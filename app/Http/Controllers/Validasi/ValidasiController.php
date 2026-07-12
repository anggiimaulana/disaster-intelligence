<?php

namespace App\Http\Controllers\Validasi;

use App\Events\LaporanStatusUpdated;
use App\Events\LaporanValidated;
use App\Http\Controllers\Controller;
use App\Http\Requests\ValidasiStoreRequest;
use App\Http\Resources\JenisBencanaResource;
use App\Models\AuditLog;
use App\Models\JenisBencana;
use App\Models\LaporanBencana;
use App\Models\ValidasiLaporan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;
use Inertia\Response;

class ValidasiController extends Controller
{
    /**
     * Display list of reports pending validation
     */
    public function index(Request $request): Response
    {
        // Get cached stats
        $stats = $this->getCachedStats();

        // Build query with eager loading
        $query = LaporanBencana::with([
            'jenisBencana:id,kode,nama_bencana,warna',
            'status:id,nama_status,warna',
        ])
            ->where('status_id', 1) // Menunggu
            ->orderBy('created_at', 'asc');

        // Filter by disaster type
        if ($request->filled('jenis_bencana_id')) {
            $query->where('jenis_bencana_id', $request->jenis_bencana_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search with PostgreSQL compatible ILIKE
        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->whereRaw('kode_laporan ILIKE ?', ["%{$search}%"])
                    ->orWhereRaw('judul ILIKE ?', ["%{$search}%"])
                    ->orWhereRaw('alamat ILIKE ?', ["%{$search}%"]);
            });
        }

        $laporan = $query->paginate($request->input('per_page', 15))
            ->withQueryString();

        // Get jenis bencana with cache
        $jenisBencana = Cache::remember('jenis_bencana_list', 3600, function () {
            return JenisBencana::all();
        });

        return Inertia::render('disaster/validation', [
            'laporan' => $laporan,
            'stats' => $stats,
            'filters' => $request->only(['jenis_bencana_id', 'date_from', 'date_to', 'q']),
            'filterOptions' => [
                'jenisBencana' => JenisBencanaResource::collection($jenisBencana),
            ],
        ]);
    }

    /**
     * Show detail of a report for validation
     */
    public function show(string $id): Response
    {
        $laporan = LaporanBencana::with([
            'jenisBencana:id,kode,nama_bencana,warna,icon',
            'status:id,nama_status,warna',
            'media',
            'validasi.admin:id,name',
            'earlyWarnings',
            'mlPredictions',
            'nlpAnalysis',
            'wilayah:id,provinsi,kabupaten,kecamatan,desa',
        ])->findOrFail($id);

        return Inertia::render('disaster/validation/show', [
            'laporan' => $laporan,
        ]);
    }

    /**
     * Validate a report (API)
     * Rate limited: 30 validations per minute per admin
     */
    public function validate(ValidasiStoreRequest $request, string $id): JsonResponse
    {
        // Rate limiting
        $key = 'validasi:'.auth()->id();
        if (RateLimiter::tooManyAttempts($key, 30)) {
            return response()->json([
                'success' => false,
                'message' => 'Terlalu banyak validasi. Silakan tunggu sebentar.',
            ], 429);
        }
        RateLimiter::hit($key, 60);

        $laporan = LaporanBencana::findOrFail($id);

        if ($laporan->validasi_admin) {
            return response()->json([
                'success' => false,
                'message' => 'Laporan ini sudah divalidasi sebelumnya.',
            ], 422);
        }

        try {
            DB::beginTransaction();

            $validated = $request->validated();

            // Create validation record
            $validasi = ValidasiLaporan::create([
                'laporan_id' => $laporan->id,
                'admin_id' => auth()->id(),
                'hasil_validasi' => $validated['hasil_validasi'],
                'catatan' => $validated['catatan'] ?? null,
            ]);

            // Update laporan status based on validation result
            $newStatusId = match ($validated['hasil_validasi']) {
                'valid' => 2, // Diproses
                'invalid', 'spam', 'duplikat' => 6, // Ditolak
                default => 1,
            };

            $laporan->update([
                'validasi_admin' => $validated['hasil_validasi'] === 'valid',
                'status_id' => $newStatusId,
            ]);

            // Log the action
            AuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'VALIDATE_REPORT',
                'table_name' => 'laporan_bencana',
                'record_id' => $laporan->id,
                'old_data' => null,
                'new_data' => [
                    'hasil_validasi' => $validated['hasil_validasi'],
                    'catatan' => $validated['catatan'],
                ],
                'ip_address' => $request->ip(),
            ]);

            DB::commit();

            // Fire real-time events
            $laporan->refresh();
            $laporan->load(['jenisBencana:id,kode,nama_bencana,warna', 'status:id,nama_status,warna']);

            LaporanValidated::dispatch($laporan, $validasi);
            LaporanStatusUpdated::dispatch($laporan);

            // Clear cache
            Cache::forget('laporan_statistics');

            Log::info('Report validated', [
                'laporan_id' => $laporan->id,
                'kode_laporan' => $laporan->kode_laporan,
                'hasil' => $validated['hasil_validasi'],
                'admin_id' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Validasi berhasil disimpan.',
                'data' => [
                    'laporan_id' => $laporan->id,
                    'kode_laporan' => $laporan->kode_laporan,
                    'validasi' => [
                        'hasil' => $validasi->hasil_validasi,
                        'catatan' => $validasi->catatan,
                    ],
                    'status' => [
                        'id' => $laporan->status->id,
                        'nama' => $laporan->status->nama_status,
                    ],
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to validate report', [
                'laporan_id' => $laporan->id,
                'error' => $e->getMessage(),
                'admin_id' => auth()->id(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan validasi.',
            ], 500);
        }
    }

    /**
     * Update report status (move to different status)
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'status_id' => 'required|exists:status_laporan,id',
        ]);

        $laporan = LaporanBencana::findOrFail($id);
        $oldStatusId = $laporan->status_id;

        $laporan->update([
            'status_id' => $request->status_id,
        ]);

        // Log the action
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'UPDATE_STATUS',
            'table_name' => 'laporan_bencana',
            'record_id' => $laporan->id,
            'old_data' => ['status_id' => $oldStatusId],
            'new_data' => ['status_id' => $request->status_id],
            'ip_address' => $request->ip(),
        ]);

        // Fire real-time event
        $laporan->load(['jenisBencana:id,kode,nama_bencana,warna', 'status:id,nama_status,warna']);
        LaporanStatusUpdated::dispatch($laporan);

        // Clear cache
        Cache::forget('laporan_statistics');

        Log::info('Report status updated', [
            'laporan_id' => $laporan->id,
            'old_status' => $oldStatusId,
            'new_status' => $request->status_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status berhasil diupdate.',
            'data' => [
                'status' => [
                    'id' => $laporan->status->id,
                    'nama' => $laporan->status->nama_status,
                    'warna' => $laporan->status->warna,
                ],
            ],
        ]);
    }

    /**
     * API: Get validation statistics (cached)
     */
    public function statistics(): JsonResponse
    {
        $stats = $this->getCachedStats();

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Get cached statistics
     */
    protected function getCachedStats(): array
    {
        return Cache::remember('validation_stats', 30, function () {
            return [
                'menunggu' => LaporanBencana::where('status_id', 1)->count(),
                'diproses' => LaporanBencana::where('status_id', 2)->count(),
                'warning' => LaporanBencana::where('status_id', 3)->count(),
                'darurat' => LaporanBencana::where('status_id', 4)->count(),
                'selesai' => LaporanBencana::where('status_id', 5)->count(),
                'ditolak' => LaporanBencana::where('status_id', 6)->count(),
            ];
        });
    }
}
