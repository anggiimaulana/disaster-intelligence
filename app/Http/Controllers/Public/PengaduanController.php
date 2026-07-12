<?php

namespace App\Http\Controllers\Public;

use App\Events\LaporanCreated;
use App\Http\Controllers\Controller;
use App\Http\Requests\LaporBencanaRequest;
use App\Http\Resources\LaporanBencanaResource;
use App\Models\AuditLog;
use App\Models\JenisBencana;
use App\Models\LaporanBencana;
use App\Models\LaporanMedia;
use App\Models\StatusLaporan;
use App\Models\Wilayah;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PengaduanController extends Controller
{
    /**
     * Display the public reporting form
     */
    public function index(): Response
    {
        // Cache static reference data for 1 hour
        // Cache arrays, not Eloquent objects — avoids serialization corruption
        $jenisBencana = Cache::remember('jenis_bencana_list_v2', 3600, function () {
            return JenisBencana::select('id', 'kode', 'nama_bencana', 'icon', 'warna')->get()->toArray();
        });

        // Cache status data
        $statusList = Cache::remember('status_laporan_list', 3600, function () {
            return StatusLaporan::select('id', 'nama_status', 'warna')->get()->toArray();
        });

        // Desa list grouped by kecamatan (from Wilayah table)
        $desaByKecamatan = Cache::remember('desa_by_kecamatan_v2', 3600, function () {
            return Wilayah::where('kabupaten', 'Indramayu')
                ->whereNotNull('desa')
                ->select('kecamatan', 'desa')
                ->distinct()
                ->orderBy('kecamatan')
                ->orderBy('desa')
                ->get()
                ->groupBy('kecamatan')
                ->map(function ($items) {
                    return $items->pluck('desa')->unique()->values()->toArray();
                })
                ->toArray();
        });

        return Inertia::render('public/pengaduan/index', [
            'jenisBencana' => $jenisBencana,
            'statusList' => $statusList,
            'kecamatanList' => $this->getKecamatanList(),
            'desaByKecamatan' => $desaByKecamatan,
        ]);
    }

    /**
     * Store a new disaster report (public, no login required)
     * Rate limited by middleware: 30 requests per minute per IP
     */
    public function store(LaporBencanaRequest $request): JsonResponse
    {
        $ip = $request->ip();

        try {
            $validated = $request->validated();

            DB::beginTransaction();

            // Create or find wilayah with lock for concurrency
            $wilayah = $this->findOrCreateWilayah($validated);

            // Generate kode with lock to prevent race conditions
            $kode = LaporanBencana::generateKode();

            // Create laporan bencana
            $laporan = LaporanBencana::create([
                'kode_laporan' => $kode,
                'jenis_bencana_id' => $validated['jenis_bencana_id'],
                'status_id' => 1, // Menunggu
                'wilayah_id' => $wilayah?->id,
                'judul' => $validated['judul'],
                'deskripsi' => $validated['deskripsi'],
                'alamat' => $validated['alamat'],
                'kecamatan' => $validated['kecamatan'],
                'desa' => $validated['desa'] ?? null,
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'tingkat_keparahan' => $this->calculateSeverity($validated['jenis_bencana_id'], $validated['deskripsi']),
                'sumber_data' => 'website',
                'waktu_kejadian' => $validated['waktu_kejadian'] ?? now(),
            ]);

            // Handle media uploads
            if ($request->hasFile('media')) {
                $this->storeMedia($laporan, $request->file('media'));
            }

            // Store reporter info in separate table (for better query performance)
            $this->storeReporterInfo($laporan, $validated);

            // Append reporter info to description (for backward compatibility)
            $reporterData = [
                'nama' => $validated['nama_pelapor'],
                'no_hp' => $validated['no_hp'],
                'email' => $validated['email'] ?? null,
            ];
            $laporan->update(['deskripsi' => $validated['deskripsi']."\n\n[Pelapor: ".json_encode($reporterData).']']);

            DB::commit();

            // Fire real-time event
            $laporan->load(['jenisBencana', 'status']);
            LaporanCreated::dispatch($laporan);

            // Clear cache
            Cache::forget('laporan_statistics');

            Log::info('New disaster report created', [
                'kode_laporan' => $laporan->kode_laporan,
                'jenis_bencana' => $laporan->jenisBencana?->nama_bencana,
                'location' => $laporan->alamat,
                'ip' => $ip,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Laporan berhasil submitted. Tim kami akan segera meninjaunya.',
                'data' => [
                    'kode_laporan' => $laporan->kode_laporan,
                    'status' => [
                        'id' => 1,
                        'nama' => 'Menunggu',
                        'warna' => '#9E9E9E',
                    ],
                    'tracking_url' => url('/public/lacak-laporan?kode='.$laporan->kode_laporan),
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create laporan', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'ip' => $ip,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan laporan. Silakan coba lagi.',
            ], 500);
        }
    }

    /**
     * Track a report by its code
     */
    public function track(Request $request): Response|JsonResponse
    {
        $kode = $request->query('kode_laporan');

        // If no code provided, show the search form
        if (! $kode) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kode laporan wajib diisi.',
                ], 422);
            }

            return Inertia::render('public/pengaduan/track');
        }

        // Validate code format
        $validator = validator(['kode_laporan' => $kode], [
            'kode_laporan' => ['string', 'regex:/^LAP-[A-Z0-9\-]+$/i'],
        ]);

        if ($validator->fails()) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Format kode laporan tidak valid. Contoh: LAP-20260712-ADHZ0001-01',
                ], 422);
            }

            return Inertia::render('public/pengaduan/track', [
                'notFound' => true,
                'kode' => $kode,
                'error' => 'Format kode laporan tidak valid. Contoh: LAP-20260712-ADHZ0001-01',
            ]);
        }

        // Rate limit tracking requests
        $trackKey = 'track:'.$request->ip();
        if (RateLimiter::tooManyAttempts($trackKey, 30)) {
            return response()->json([
                'success' => false,
                'message' => 'Terlalu banyak permintaan.',
            ], 429);
        }
        RateLimiter::hit($trackKey, 60);

        $laporan = LaporanBencana::with([
            'jenisBencana:id,kode,nama_bencana,warna',
            'status:id,nama_status,warna',
            'media:id,laporan_id,media_type,file_url,created_at',
            'validasi.admin:id,name',
            'wilayah:id,kecamatan,desa',
            'earlyWarnings' => fn ($q) => $q->where('status', 'aktif')->select('id', 'laporan_id', 'status', 'level_warning'),
        ])
            ->select([
                'id', 'kode_laporan', 'jenis_bencana_id', 'status_id', 'wilayah_id',
                'judul', 'deskripsi', 'alamat',
                'latitude', 'longitude', 'tingkat_keparahan',
                'validasi_ai', 'validasi_admin', 'waktu_kejadian',
                'created_at', 'updated_at',
            ])
            ->where('kode_laporan', $kode)
            ->first();

        if (! $laporan) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Laporan tidak ditemukan. Pastikan kode laporan yang Anda masukkan benar.',
                ], 404);
            }

            return Inertia::render('public/pengaduan/track', [
                'notFound' => true,
                'kode' => $kode,
            ]);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => new LaporanBencanaResource($laporan),
            ]);
        }

        return Inertia::render('public/pengaduan/track', [
            'laporan' => (new LaporanBencanaResource($laporan))->resolve(),
            'notFound' => false,
        ]);
    }

    /**
     * API endpoint to get latest reports (for public map)
     * Cached for performance
     */
    public function latest(Request $request): JsonResponse
    {
        $limit = min($request->input('limit', 50), 100);

        // Use cache for map data
        $cacheKey = 'laporan_latest:'.$limit;
        $laporan = Cache::remember($cacheKey, 30, function () use ($limit) {
            return LaporanBencana::with([
                'jenisBencana:id,kode,nama_bencana,warna',
                'status:id,nama_status,warna',
            ])
                ->select([
                    'id', 'kode_laporan', 'jenis_bencana_id', 'status_id',
                    'latitude', 'longitude', 'tingkat_keparahan',
                    'judul', 'alamat', 'kecamatan',
                    'created_at', 'updated_at',
                ])
                ->where(function ($query) {
                    $query->whereIn('status_id', [2, 3, 4]) // Diproses, Warning, Darurat
                        ->orWhere(function ($q) {
                            $q->where('validasi_admin', true)
                                ->whereNotIn('status_id', [5, 6]);
                        });
                })
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => LaporanBencanaResource::collection($laporan),
            'meta' => [
                'total' => $laporan->count(),
                'timestamp' => now()->toIso8601String(),
            ],
        ]);
    }

    /**
     * API endpoint to get report statistics
     * Cached for performance
     */
    public function statistics(): JsonResponse
    {
        // Cache statistics for 60 seconds
        $stats = Cache::remember('laporan_statistics_v2', 60, function () {
            // Single optimized query for all status counts
            $statusCounts = LaporanBencana::selectRaw('status_id, count(*) as count')
                ->groupBy('status_id')
                ->pluck('count', 'status_id')
                ->toArray();

            return [
                'total' => array_sum($statusCounts),
                'menunggu' => $statusCounts[1] ?? 0,
                'diproses' => $statusCounts[2] ?? 0,
                'warning' => $statusCounts[3] ?? 0,
                'darurat' => $statusCounts[4] ?? 0,
                'selesai' => $statusCounts[5] ?? 0,
                'ditolak' => $statusCounts[6] ?? 0,
                'by_jenis' => [],
            ];
        });

        // Get by jenis from cache (longer TTL)
        $byJenis = Cache::remember('laporan_by_jenis_v2', 300, function () {
            $result = [];
            $items = LaporanBencana::selectRaw('jenis_bencana_id, count(*) as total')
                ->whereNotNull('jenis_bencana_id')
                ->groupBy('jenis_bencana_id')
                ->get();

            // Get jenis data
            $jenisData = JenisBencana::select('id', 'kode', 'nama_bencana', 'warna')
                ->get()
                ->keyBy('id');

            foreach ($items as $item) {
                $jenis = $jenisData->get($item->jenis_bencana_id);
                if ($jenis) {
                    $result[] = [
                        'jenis' => $jenis->nama_bencana,
                        'kode' => $jenis->kode,
                        'warna' => $jenis->warna,
                        'total' => $item->total,
                    ];
                }
            }

            return $result;
        });

        $stats['by_jenis'] = $byJenis;

        return response()->json([
            'success' => true,
            'data' => $stats,
            'meta' => [
                'timestamp' => now()->toIso8601String(),
            ],
        ]);
    }

    /**
     * Find or create wilayah record
     */
    protected function findOrCreateWilayah(array $data): ?Wilayah
    {
        $latitude = (float) $data['latitude'];
        $longitude = (float) $data['longitude'];

        // Find existing wilayah by coordinates (within ~100m radius)
        $existing = Wilayah::whereRaw('
            ABS(latitude - ?) < 0.001 AND ABS(longitude - ?) < 0.001
        ', [$latitude, $longitude])->first();

        if ($existing) {
            return $existing;
        }

        // Create new wilayah
        return Wilayah::create([
            'provinsi' => 'Jawa Barat',
            'kabupaten' => 'Indramayu',
            'kecamatan' => $data['kecamatan'],
            'desa' => $data['desa'] ?? null,
            'latitude' => $latitude,
            'longitude' => $longitude,
        ]);
    }

    /**
     * Store uploaded media files
     */
    protected function storeMedia(LaporanBencana $laporan, array $files): void
    {
        $mediaRecords = [];

        foreach ($files as $file) {
            $path = $file->store('laporan/'.date('Y/m'), 'public');

            $mediaRecords[] = [
                'laporan_id' => $laporan->id,
                'media_type' => $this->getMediaType($file->getMimeType()),
                'file_path' => $path,
                'file_url' => Storage::url($path),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Bulk insert for performance
        LaporanMedia::insert($mediaRecords);
    }

    /**
     * Store reporter information
     */
    protected function storeReporterInfo(LaporanBencana $laporan, array $data): void
    {
        // Store in audit_logs for tracking purposes
        AuditLog::create([
            'action' => 'REPORTER_INFO',
            'table_name' => 'laporan_bencana',
            'record_id' => $laporan->id,
            'new_data' => [
                'nama' => $data['nama_pelapor'],
                'no_hp' => $data['no_hp'],
                'email' => $data['email'] ?? null,
            ],
            'ip_address' => request()->ip(),
        ]);
    }

    /**
     * Determine media type from MIME
     */
    protected function getMediaType(string $mime): string
    {
        return match (true) {
            str_starts_with($mime, 'image/') => 'image',
            str_starts_with($mime, 'video/') => 'video',
            str_starts_with($mime, 'audio/') => 'audio',
            default => 'document',
        };
    }

    /**
     * Calculate severity based on disaster type and description
     */
    protected function calculateSeverity(int $jenisBencanaId, string $description): string
    {
        $description = strtolower($description);

        // Keywords indicating high severity
        $emergencyKeywords = ['darurat', 'jebol', 'hampir', 'parah', 'besar', 'bencana', 'mengungsi', 'evakuasi', 'tsunami', 'gempa'];
        $warningKeywords = ['meningkat', 'mulai', 'sedang', 'kronis', 'berulang', 'bahaya', 'rawan', 'luar biasa'];

        // Check for emergency keywords first
        foreach ($emergencyKeywords as $keyword) {
            if (str_contains($description, $keyword)) {
                return 'Tinggi';
            }
        }

        // Check for warning keywords
        foreach ($warningKeywords as $keyword) {
            if (str_contains($description, $keyword)) {
                return 'Sedang';
            }
        }

        return 'Rendah';
    }

    /**
     * Get list of kecamatan in Indramayu
     */
    protected function getKecamatanList(): array
    {
        return [
            'Anjatan', 'Arahan', 'Balongan', 'Bangodua', 'Bongas', 'Cantigi',
            'Cikedung', 'Gabuswetan', 'Gantar', 'Haurgeulis', 'Indramayu',
            'Jatibarang', 'Juntinyuat', 'Kandanghaur', 'Karangampel',
            'Kedokan Bunder', 'Kertasemaya', 'Krangkeng', 'Kroya', 'Lelea',
            'Lohbener', 'Losarang', 'Pasekan', 'Patrol', 'Sindang', 'Sliyeg',
            'Sukagumiwang', 'Sukra', 'Terisi', 'Tukdana', 'Widasari',
        ];
    }

    /**
     * API: Get desa list by kecamatan
     */
    public function getDesaByKecamatan(string $kecamatan): JsonResponse
    {
        $desa = Cache::remember("desa_by_kecamatan:{$kecamatan}", 3600, function () use ($kecamatan) {
            return Wilayah::where('kabupaten', 'Indramayu')
                ->where('kecamatan', $kecamatan)
                ->whereNotNull('desa')
                ->distinct('desa')
                ->orderBy('desa')
                ->pluck('desa')
                ->toArray();
        });

        return response()->json([
            'success' => true,
            'data' => $desa,
        ]);
    }

    /**
     * API: Hybrid search - checks Wilayah DB first, then Nominatim
     */
    public function hybridSearch(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|max:500',
        ]);

        $query = $request->input('q');
        $lowerQuery = strtolower($query);

        // Strip common prefixes for better DB matching
        $prefixes = ['kecamatan ', 'desa ', 'kelurahan ', 'kota ', 'kabupaten ', 'kampung '];
        $strippedQuery = str_replace($prefixes, '', $lowerQuery);
        $searchTerms = [$lowerQuery, $strippedQuery];

        // 1. First, try to match against our Wilayah database
        // Check for exact/partial matches on desa/kecamatan names
        $wilayahMatch = Wilayah::where('kabupaten', 'Indramayu')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where(function ($q) use ($searchTerms) {
                foreach ($searchTerms as $term) {
                    $q->orWhereRaw('LOWER(desa) LIKE ?', ["%{$term}%"])
                        ->orWhereRaw('LOWER(kecamatan) LIKE ?', ["%{$term}%"])
                        ->orWhereRaw("LOWER(CONCAT_WS(' ', desa, kecamatan)) LIKE ?", ["%{$term}%"]);
                }
            })
            ->orderByRaw('
                CASE 
                    WHEN LOWER(desa) = ? THEN 1
                    WHEN LOWER(kecamatan) = ? THEN 2
                    WHEN LOWER(desa) LIKE ? THEN 3
                    WHEN LOWER(kecamatan) LIKE ? THEN 4
                    ELSE 5
                END
            ', [strtolower($query), $strippedQuery, "{$strippedQuery}%", "{$strippedQuery}%"])
            ->first();

        if ($wilayahMatch) {
            return response()->json([
                'success' => true,
                'source' => 'wilayah_db',
                'data' => [
                    'latitude' => (float) $wilayahMatch->latitude,
                    'longitude' => (float) $wilayahMatch->longitude,
                    'display_name' => "{$wilayahMatch->desa}, {$wilayahMatch->kecamatan}, Indramayu, Jawa Barat",
                    'kecamatan' => $wilayahMatch->kecamatan,
                    'desa' => $wilayahMatch->desa,
                ],
            ]);
        }

        // 2. Fallback to Nominatim (OpenStreetMap)
        $address = $query.', Indramayu, Jawa Barat, Indonesia';

        try {
            $response = Http::timeout(10)->get('https://nominatim.openstreetmap.org/search', [
                'q' => $address,
                'format' => 'json',
                'limit' => 1,
                'countrycodes' => 'id',
                'addressdetails' => 1,
            ]);

            $data = $response->json();

            if (empty($data)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lokasi tidak ditemukan. Coba nama jalan, gedung, atau desa yang lebih spesifik.',
                ], 404);
            }

            $result = $data[0];
            $lat = (float) $result['lat'];
            $lng = (float) $result['lon'];

            // Validate bounds
            if ($lat < -6.6 || $lat > -6.1 || $lng < 107.9 || $lng > 108.6) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lokasi di luar wilayah Kabupaten Indramayu.',
                ], 422);
            }

            return response()->json([
                'success' => true,
                'source' => 'nominatim',
                'data' => [
                    'latitude' => $lat,
                    'longitude' => $lng,
                    'display_name' => $result['display_name'],
                    'boundingbox' => $result['boundingbox'] ?? null,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Hybrid search error', ['error' => $e->getMessage(), 'query' => $query]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal mencari koordinat. Silakan masukkan manual.',
            ], 500);
        }
    }

    /**
     * API: Geocode address using Nominatim (OpenStreetMap)
     */
    public function geocode(Request $request): JsonResponse
    {
        $request->validate([
            'address' => 'required|string|max:500',
        ]);

        $address = $request->input('address').', Indramayu, Jawa Barat, Indonesia';

        try {
            $response = Http::timeout(10)->get('https://nominatim.openstreetmap.org/search', [
                'q' => $address,
                'format' => 'json',
                'limit' => 1,
                'countrycodes' => 'id',
                'addressdetails' => 1,
            ]);

            $data = $response->json();

            if (empty($data)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Alamat tidak ditemukan.',
                ], 404);
            }

            $result = $data[0];

            return response()->json([
                'success' => true,
                'data' => [
                    'latitude' => (float) $result['lat'],
                    'longitude' => (float) $result['lon'],
                    'display_name' => $result['display_name'],
                    'boundingbox' => $result['boundingbox'] ?? null,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Geocoding error', ['error' => $e->getMessage(), 'address' => $address]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal mencari koordinat. Silakan masukkan manual.',
            ], 500);
        }
    }

    /**
     * API: Get coordinates from Wilayah table by kecamatan/desa
     */
    public function getCoordinatesByLocation(Request $request): JsonResponse
    {
        $request->validate([
            'kecamatan' => 'required|string',
            'desa' => 'nullable|string',
        ]);

        $query = Wilayah::where('kabupaten', 'Indramayu')
            ->where('kecamatan', $request->input('kecamatan'))
            ->whereNotNull('latitude')
            ->whereNotNull('longitude');

        if ($request->filled('desa')) {
            $query->where('desa', $request->input('desa'));
        }

        $wilayah = $query->first();

        if (! $wilayah) {
            return response()->json([
                'success' => false,
                'message' => 'Data koordinat tidak ditemukan untuk lokasi tersebut.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'latitude' => $wilayah->latitude,
                'longitude' => $wilayah->longitude,
                'kecamatan' => $wilayah->kecamatan,
                'desa' => $wilayah->desa,
            ],
        ]);
    }
}

/**
 * Return unmasked phone number
 */
function maskPhoneNumber(string $phone): string
{
    return $phone;
}

/**
 * Return unmasked email
 */
function maskEmail(?string $email): ?string
{
    return $email;
}
