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
use App\Models\SupportedRegency;
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
    public function index(): Response
    {
        $jenisBencana = Cache::remember('jenis_bencana_list_v2', 3600, function () {
            return JenisBencana::select('id', 'kode', 'nama_bencana', 'icon', 'warna')->get()->toArray();
        });

        $statusList = Cache::remember('status_laporan_list', 3600, function () {
            return StatusLaporan::select('id', 'nama_status', 'warna')->get()->toArray();
        });

        $kabupatenList = Cache::remember('kabupaten_list_v2', 3600, function () {
            return SupportedRegency::where('is_active', true)
                ->select('code', 'name')
                ->orderBy('name')
                ->get()
                ->toArray();
        });

        return Inertia::render('public/pengaduan/index', [
            'jenisBencana' => $jenisBencana,
            'statusList' => $statusList,
            'kabupatenList' => $kabupatenList,
        ]);
    }

    public function store(LaporBencanaRequest $request): JsonResponse
    {
        $ip = $request->ip();

        try {
            $validated = $request->validated();

            DB::beginTransaction();

            $wilayah = $this->findOrCreateWilayah($validated);

            $kode = LaporanBencana::generateKode();

            $laporan = LaporanBencana::create([
                'kode_laporan' => $kode,
                'jenis_bencana_id' => $validated['jenis_bencana_id'],
                'status_id' => 1,
                'wilayah_id' => $wilayah?->id,
                'judul' => $validated['judul'],
                'deskripsi' => $validated['deskripsi'],
                'alamat' => $validated['alamat'],
                'kecamatan' => $validated['kecamatan'],
                'desa' => $validated['desa'] ?? null,
                'latitude' => $validated['latitude'] ?? null,
                'longitude' => $validated['longitude'] ?? null,
                'tingkat_keparahan' => $this->calculateSeverity($validated['jenis_bencana_id'], $validated['deskripsi']),
                'sumber_data' => 'website',
                'waktu_kejadian' => $validated['waktu_kejadian'] ?? now(),
            ]);

            if ($request->hasFile('media')) {
                $this->storeMedia($laporan, $request->file('media'));
            }

            $this->storeReporterInfo($laporan, $validated);

            $reporterData = [
                'nama' => $validated['nama_pelapor'],
                'no_hp' => $validated['no_hp'],
                'email' => $validated['email'] ?? null,
            ];
            $laporan->update(['deskripsi' => $validated['deskripsi']."\n\n[Pelapor: ".json_encode($reporterData).']']);

            DB::commit();

            $laporan->load(['jenisBencana', 'status']);
            LaporanCreated::dispatch($laporan);

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

    public function track(Request $request): Response|JsonResponse
    {
        $kode = $request->query('kode_laporan');

        if (! $kode) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kode laporan wajib diisi.',
                ], 422);
            }

            return Inertia::render('public/pengaduan/track');
        }

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

    public function latest(Request $request): JsonResponse
    {
        $limit = min($request->input('limit', 50), 100);

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
                    $query->whereIn('status_id', [2, 3, 4])
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

    public function statistics(): JsonResponse
    {
        $stats = Cache::remember('laporan_statistics_v2', 60, function () {
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

        $byJenis = Cache::remember('laporan_by_jenis_v2', 300, function () {
            $result = [];
            $items = LaporanBencana::selectRaw('jenis_bencana_id, count(*) as total')
                ->whereNotNull('jenis_bencana_id')
                ->groupBy('jenis_bencana_id')
                ->get();

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

    protected function findOrCreateWilayah(array $data): ?Wilayah
    {
        $latitude = ! empty($data['latitude']) ? (float) $data['latitude'] : null;
        $longitude = ! empty($data['longitude']) ? (float) $data['longitude'] : null;

        // If coordinates available, try to find existing wilayah by proximity
        if ($latitude !== null && $longitude !== null) {
            $existing = Wilayah::whereRaw('
                ABS(latitude - ?) < 0.001 AND ABS(longitude - ?) < 0.001
            ', [$latitude, $longitude])->first();

            if ($existing) {
                return $existing;
            }
        }

        // Try to find by kecamatan + desa name (from CSV data)
        if (! empty($data['kecamatan'])) {
            $query = Wilayah::where('kecamatan', $data['kecamatan']);

            if (! empty($data['desa'])) {
                $query->where('desa', $data['desa']);
            }

            $existing = $query->first();
            if ($existing) {
                return $existing;
            }
        }

        // Create new wilayah record
        return Wilayah::create([
            'provinsi' => $data['provinsi'] ?? 'Jawa Barat',
            'kabupaten' => $data['kabupaten'] ?? 'Indramayu',
            'kecamatan' => $data['kecamatan'],
            'desa' => $data['desa'] ?? null,
            'latitude' => $latitude,
            'longitude' => $longitude,
        ]);
    }

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

        LaporanMedia::insert($mediaRecords);
    }

    protected function storeReporterInfo(LaporanBencana $laporan, array $data): void
    {
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

    protected function getMediaType(string $mime): string
    {
        return match (true) {
            str_starts_with($mime, 'image/') => 'image',
            str_starts_with($mime, 'video/') => 'video',
            str_starts_with($mime, 'audio/') => 'audio',
            default => 'document',
        };
    }

    protected function calculateSeverity(int $jenisBencanaId, string $description): string
    {
        $description = strtolower($description);

        $emergencyKeywords = ['darurat', 'jebol', 'hampir', 'parah', 'besar', 'bencana', 'mengungsi', 'evakuasi', 'tsunami', 'gempa'];
        $warningKeywords = ['meningkat', 'mulai', 'sedang', 'kronis', 'berulang', 'bahaya', 'rawan', 'luar biasa'];

        foreach ($emergencyKeywords as $keyword) {
            if (str_contains($description, $keyword)) {
                return 'Tinggi';
            }
        }

        foreach ($warningKeywords as $keyword) {
            if (str_contains($description, $keyword)) {
                return 'Sedang';
            }
        }

        return 'Rendah';
    }

    /**
     * API: Get desa list by kecamatan — supports both code and name
     */
    public function getDesaByKecamatan(string $kecamatan, Request $request): JsonResponse
    {
        $kabupaten = $request->input('kabupaten');
        $cacheKey = $kabupaten
            ? "desa_by_kecamatan:{$kabupaten}:{$kecamatan}"
            : "desa_by_kecamatan:all:{$kecamatan}";

        $desa = Cache::remember($cacheKey, 3600, function () use ($kecamatan, $kabupaten) {
            $query = Wilayah::query();

            // Support code or name
            if (ctype_digit($kecamatan)) {
                $query->where('kode_kecamatan', $kecamatan);
            } else {
                $query->where('kecamatan', $kecamatan);
            }

            $query->whereNotNull('desa');

            if ($kabupaten) {
                if (ctype_digit($kabupaten)) {
                    $query->where('kode_kabupaten', $kabupaten);
                } else {
                    $query->where('kabupaten', $this->normalizeWilayahName($kabupaten));
                }
            }

            return $query->select('kode_desa', 'desa')
                ->distinct()
                ->orderBy('desa')
                ->get()
                ->map(fn ($d) => [
                    'code' => $d->kode_desa,
                    'name' => $d->desa,
                ])
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

        $prefixes = ['kecamatan ', 'desa ', 'kelurahan ', 'kota ', 'kabupaten ', 'kampung '];
        $strippedQuery = str_replace($prefixes, '', $lowerQuery);
        $searchTerms = [$lowerQuery, $strippedQuery];

        $wilayahMatch = Wilayah::whereNotNull('latitude')
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
            $parts = array_filter([
                $wilayahMatch->desa,
                $wilayahMatch->kecamatan,
                $wilayahMatch->kabupaten,
                $wilayahMatch->provinsi,
            ]);

            return response()->json([
                'success' => true,
                'source' => 'wilayah_db',
                'data' => [
                    'latitude' => (float) $wilayahMatch->latitude,
                    'longitude' => (float) $wilayahMatch->longitude,
                    'display_name' => implode(', ', $parts),
                    'kecamatan' => $wilayahMatch->kecamatan,
                    'desa' => $wilayahMatch->desa,
                ],
            ]);
        }

        $address = $query.', Indonesia';

        try {
            $response = Http::timeout(10)->withHeaders([
                'User-Agent' => config('services.nominatim.user_agent', 'DisasterIntelligenceBPBD/1.0'),
            ])->get(config('services.nominatim.base_url', 'https://nominatim.openstreetmap.org').'/search', [
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

            return response()->json([
                'success' => true,
                'source' => 'nominatim',
                'data' => [
                    'latitude' => (float) $result['lat'],
                    'longitude' => (float) $result['lon'],
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

        $address = $request->input('address').', Indonesia';

        try {
            $response = Http::timeout(10)->withHeaders([
                'User-Agent' => config('services.nominatim.user_agent', 'DisasterIntelligenceBPBD/1.0'),
            ])->get(config('services.nominatim.base_url', 'https://nominatim.openstreetmap.org').'/search', [
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
            'kabupaten' => 'nullable|string',
        ]);

        $query = Wilayah::query();

        // Support code or name
        if (ctype_digit($request->input('kecamatan'))) {
            $query->where('kode_kecamatan', $request->input('kecamatan'));
        } else {
            $query->where('kecamatan', $request->input('kecamatan'));
        }

        $query->whereNotNull('latitude')
            ->whereNotNull('longitude');

        if ($request->filled('kabupaten')) {
            if (ctype_digit($request->input('kabupaten'))) {
                $query->where('kode_kabupaten', $request->input('kabupaten'));
            } else {
                $query->where('kabupaten', $this->normalizeWilayahName($request->input('kabupaten')));
            }
        }

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

    /**
     * API: Get list of active kabupaten
     */
    public function getKabupatenList(): JsonResponse
    {
        $list = Cache::remember('kabupaten_list_api_v2', 3600, function () {
            return SupportedRegency::where('is_active', true)
                ->select('code', 'name')
                ->orderBy('name')
                ->get()
                ->toArray();
        });

        return response()->json([
            'success' => true,
            'data' => $list,
        ]);
    }

    /**
     * API: Get kecamatan list by kabupaten — supports code or name
     */
    public function getKecamatanByKabupaten(string $kabupaten): JsonResponse
    {
        $isCode = ctype_digit($kabupaten);
        $cacheKey = $isCode
            ? "kecamatan_by_kabupaten_code:{$kabupaten}"
            : "kecamatan_by_kabupaten:{$kabupaten}";

        $kecamatan = Cache::remember($cacheKey, 3600, function () use ($kabupaten, $isCode) {
            $query = Wilayah::query();

            if ($isCode) {
                $query->where('kode_kabupaten', $kabupaten);
            } else {
                $normalized = $this->normalizeWilayahName($kabupaten);
                $query->where('kabupaten', $normalized);
            }

            return $query->select('kode_kecamatan', 'kecamatan')
                ->distinct()
                ->orderBy('kecamatan')
                ->get()
                ->map(fn ($d) => [
                    'code' => $d->kode_kecamatan,
                    'name' => $d->kecamatan,
                ])
                ->toArray();
        });

        return response()->json([
            'success' => true,
            'data' => $kecamatan,
        ]);
    }

    /**
     * Normalize wilayah name: "KABUPATEN INDRAMAYU" → "Indramayu"
     */
    protected function normalizeWilayahName(string $name): string
    {
        $name = preg_replace('/^(KABUPATEN|KOTA)\s+/i', '', $name);

        return ucwords(strtolower(trim($name)));
    }
}
