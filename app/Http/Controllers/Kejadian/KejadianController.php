<?php

namespace App\Http\Controllers\Kejadian;

use App\Http\Controllers\Controller;
use App\Models\JenisBencana;
use App\Models\LaporanBencana;
use App\Models\StatusLaporan;
use App\Models\SupportedRegency;
use App\Models\Wilayah;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class KejadianController extends Controller
{
    public function index(Request $request): Response
    {
        // Build kabupaten-kecamatan map from active regencies FIRST
        $activeRegencies = SupportedRegency::where('is_active', true)
            ->pluck('name')
            ->map(fn ($name) => Str::title(trim(str_ireplace(['KABUPATEN', 'KOTA'], '', $name))))
            ->toArray();
        $kabupatenKecamatanMap = [];
        if ($activeRegencies) {
            $allWilayah = Wilayah::whereIn('kabupaten', $activeRegencies)
                ->whereNotNull('kecamatan')
                ->select('kabupaten', 'kecamatan')
                ->distinct()
                ->orderBy('kabupaten')
                ->orderBy('kecamatan')
                ->get();
            foreach ($allWilayah as $w) {
                $kabupatenKecamatanMap[$w->kabupaten][] = $w->kecamatan;
            }
        }

        $query = LaporanBencana::query()
            ->with(['jenisBencana:id,kode,nama_bencana,warna', 'status:id,nama_status,warna']);

        // Filters
        if ($request->filled('tanggal_mulai')) {
            $query->whereDate('created_at', '>=', $request->tanggal_mulai);
        }
        if ($request->filled('tanggal_selesai')) {
            $query->whereDate('created_at', '<=', $request->tanggal_selesai);
        }
        if ($request->filled('jenis_bencana')) {
            $query->whereHas('jenisBencana', fn ($q) => $q->where('kode', $request->jenis_bencana));
        }
        if ($request->filled('kabupaten')) {
            $kabKec = $kabupatenKecamatanMap[$request->kabupaten] ?? [];
            if ($kabKec) {
                $query->whereIn('kecamatan', $kabKec);
            }
        } elseif ($request->filled('kecamatan')) {
            $query->where('kecamatan', $request->kecamatan);
        }
        if ($request->filled('status')) {
            $query->whereHas('status', fn ($q) => $q->where('nama_status', $request->status));
        }
        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->whereRaw('kode_laporan ILIKE ?', ["%{$search}%"])
                    ->orWhereRaw('judul ILIKE ?', ["%{$search}%"])
                    ->orWhereRaw('alamat ILIKE ?', ["%{$search}%"]);
            });
        }

        $query->orderBy('created_at', 'desc');

        $paginated = $query->paginate(10)->withQueryString();

        // Transform data for frontend
        $reports = $paginated->getCollection()->map(function ($r) {
            return [
                'id' => (string) $r->id,
                'laporan_id' => $r->kode_laporan,
                'jenis_bencana' => $r->jenisBencana?->kode ?? 'LAINNYA',
                'lokasi' => $r->alamat,
                'kecamatan' => $r->kecamatan,
                'waktu_laporan' => $r->created_at->toIso8601String(),
                'pelapor' => $this->maskPhone($r->whatsappMessage?->from ?? 'N/A'),
                'status' => $r->status?->nama_status ?? 'MENUNGGU',
                'tingkat_risiko' => $r->tingkat_keparahan ?? 'RENDAH',
                'sumber' => $r->sumber_data === 'whatsapp' ? 'WHATSAPP' : strtoupper($r->sumber_data ?? 'WEBSITE'),
            ];
        })->toArray();

        // Stats from database
        $now = now();
        $lastWeek = $now->copy()->subDays(6)->startOfDay();

        $stats = [
            'totalLaporan' => [
                'value' => LaporanBencana::count(),
                'trend' => LaporanBencana::selectRaw('DATE(created_at) as date, count(*) as count')
                    ->where('created_at', '>=', $lastWeek)
                    ->groupBy('date')
                    ->orderBy('date')
                    ->pluck('count', 'date')
                    ->map(fn ($c) => (int) $c)
                    ->values()
                    ->toArray(),
                'delta' => LaporanBencana::whereDate('created_at', $now->copy()->subDay())->count(),
            ],
            'belumDiverifikasi' => [
                'value' => LaporanBencana::where('status_id', 1)->count(),
                'pct' => LaporanBencana::count() > 0
                    ? round((LaporanBencana::where('status_id', 1)->count() / LaporanBencana::count()) * 100)
                    : 0,
                'trend' => LaporanBencana::where('status_id', 1)
                    ->selectRaw('DATE(created_at) as date, count(*) as count')
                    ->where('created_at', '>=', $lastWeek)
                    ->groupBy('date')
                    ->orderBy('date')
                    ->pluck('count', 'date')
                    ->map(fn ($c) => (int) $c)
                    ->values()
                    ->toArray(),
            ],
            'valid' => [
                'value' => LaporanBencana::where('validasi_admin', true)->count(),
                'pct' => LaporanBencana::count() > 0
                    ? round((LaporanBencana::where('validasi_admin', true)->count() / LaporanBencana::count()) * 100)
                    : 0,
                'trend' => LaporanBencana::where('validasi_admin', true)
                    ->selectRaw('DATE(created_at) as date, count(*) as count')
                    ->where('created_at', '>=', $lastWeek)
                    ->groupBy('date')
                    ->orderBy('date')
                    ->pluck('count', 'date')
                    ->map(fn ($c) => (int) $c)
                    ->values()
                    ->toArray(),
            ],
            'warning' => [
                'value' => LaporanBencana::where('status_id', 3)->count(), // Warning status
                'trend' => LaporanBencana::where('status_id', 3)
                    ->selectRaw('DATE(created_at) as date, count(*) as count')
                    ->where('created_at', '>=', $lastWeek)
                    ->groupBy('date')
                    ->orderBy('date')
                    ->pluck('count', 'date')
                    ->map(fn ($c) => (int) $c)
                    ->values()
                    ->toArray(),
                'label' => 'Waspada Tinggi',
            ],
            'duplikatLainnya' => [
                'value' => LaporanBencana::where('is_duplicate', true)->count(),
                'pct' => LaporanBencana::count() > 0
                    ? round((LaporanBencana::where('is_duplicate', true)->count() / LaporanBencana::count()) * 100)
                    : 0,
                'trend' => LaporanBencana::where('is_duplicate', true)
                    ->selectRaw('DATE(created_at) as date, count(*) as count')
                    ->where('created_at', '>=', $lastWeek)
                    ->groupBy('date')
                    ->orderBy('date')
                    ->pluck('count', 'date')
                    ->map(fn ($c) => (int) $c)
                    ->values()
                    ->toArray(),
            ],
        ];

        // Filter options — use pre-computed data from top of method
        $kecamatanList = $allWilayah->map(function ($w) {
            return ['id' => $w->kecamatan, 'nama' => $w->kecamatan, 'kabupaten' => $w->kabupaten];
        })->toArray();

        $kabupatenList = array_keys($kabupatenKecamatanMap);

        $statusList = StatusLaporan::orderBy('id')->pluck('nama_status')->toArray();
        $jenisList = JenisBencana::orderBy('kode')->pluck('kode')->toArray();

        return Inertia::render('disaster/incidents', [
            'reports' => [
                'data' => $reports,
                'meta' => [
                    'current_page' => $paginated->currentPage(),
                    'last_page' => $paginated->lastPage(),
                    'per_page' => $paginated->perPage(),
                    'total' => $paginated->total(),
                    'from' => $paginated->firstItem(),
                    'to' => $paginated->lastItem(),
                ],
                'links' => [
                    'prev' => $paginated->previousPageUrl(),
                    'next' => $paginated->nextPageUrl(),
                ],
            ],
            'stats' => $stats,
            'filters' => $request->only(['tanggal_mulai', 'tanggal_selesai', 'jenis_bencana', 'kabupaten', 'kecamatan', 'status', 'q']),
            'filterOptions' => [
                'kabupatenList' => $kabupatenList,
                'kabupatenKecamatanMap' => $kabupatenKecamatanMap,
                'kecamatanList' => $kecamatanList,
                'statusList' => $statusList,
                'jenisList' => $jenisList,
            ],
        ]);
    }

    public function show(string $laporan): Response
    {
        $laporanId = str_replace('#', '', $laporan);
        $report = LaporanBencana::with([
            'jenisBencana:id,kode,nama_bencana,warna,icon',
            'status:id,nama_status,warna',
            'media',
            'validasi.admin:id,name',
            'earlyWarnings',
            'mlPredictions',
            'nlpAnalysis',
            'wilayah:id,provinsi,kabupaten,kecamatan,desa',
            'whatsappMessage',
        ])->where(function ($q) use ($laporanId) {
            $q->where('kode_laporan', $laporanId);
            if (is_numeric($laporanId)) {
                $q->orWhere('id', (int) $laporanId);
            }
        })->firstOrFail();

        // Get workflow log if exists
        $workflowLogs = $report->workflowLogs()
            ->orderBy('created_at')
            ->get()
            ->map(fn ($log) => [
                'id' => (string) $log->id,
                'timestamp' => $log->created_at->toIso8601String(),
                'type' => $log->type,
                'description' => $log->description,
            ])
            ->toArray();

        // If no workflow logs, create default activity timeline
        $activities = $workflowLogs ?: [
            ['id' => '1', 'timestamp' => $report->created_at->toIso8601String(), 'type' => 'whatsapp', 'description' => 'Laporan diterima via '.strtoupper($report->sumber_data ?? 'WEBSITE')],
            ['id' => '2', 'timestamp' => $report->created_at->addSeconds(5)->toIso8601String(), 'type' => 'system', 'description' => 'Laporan masuk ke sistem via n8n workflow'],
            ['id' => '3', 'timestamp' => $report->created_at->addSeconds(10)->toIso8601String(), 'type' => 'ai', 'description' => 'Analisis AI dimulai (NLP + CV + Spatial)'],
            ['id' => '4', 'timestamp' => $report->created_at->addSeconds(30)->toIso8601String(), 'type' => 'ai', 'description' => 'Analisis AI selesai - Risk Score: '.($report->confidence_score ?? 'N/A').'/100'],
            ['id' => '5', 'timestamp' => $report->created_at->addMinute()->toIso8601String(), 'type' => 'system', 'description' => 'Status: '.($report->validasi_admin ? 'Tervalidasi' : 'Menunggu validasi petugas')],
        ];

        return Inertia::render('disaster/incidents/show', [
            'report' => [
                'id' => (string) $report->id,
                'laporan_id' => $report->kode_laporan,
                'status' => $report->status?->nama_status ?? 'MENUNGGU',
                'tingkat_risiko' => $report->tingkat_keparahan,
                'risk_score' => $report->confidence_score,
                'jenis_bencana' => $report->jenisBencana?->kode ?? 'LAINNYA',
                'lokasi' => $report->alamat,
                'kecamatan' => $report->kecamatan,
                'koordinat' => ['lat' => (float) $report->latitude, 'lng' => (float) $report->longitude],
                'deskripsi' => $report->deskripsi,
                'pelapor' => $report->nama_pelapor ? ($report->nama_pelapor.($report->no_hp_pelapor ? ' ('.$report->no_hp_pelapor.')' : '')) : $this->maskPhone($report->whatsappMessage?->from ?? 'N/A'),
                'sumber' => strtoupper($report->sumber_data ?? 'WEBSITE'),
                'id_pesan' => $report->whatsapp_message_id,
                'diterima_pada' => $report->created_at->toIso8601String(),
                'foto' => $report->media->map(fn ($m) => str_starts_with($m->file_url, '/storage/') || str_starts_with($m->file_url, 'http') ? $m->file_url : '/storage/'.$m->file_url)->toArray(),
                'foto_count' => $report->media->count(),
                'ai_ringkasan' => [
                    'prediksi_jenis' => [
                        'label' => $report->nlpAnalysis?->predicted_type ?? $report->jenisBencana?->nama_bencana ?? 'Tidak diketahui',
                        'confidence' => $report->nlpAnalysis?->confidence ?? 0,
                    ],
                    'risk_score' => $report->confidence_score ?? 0,
                    'severity' => $report->tingkat_keparahan,
                    'rekomendasi' => $report->nlpAnalysis?->recommendation ?? 'Segera lakukan verifikasi lapangan.',
                ],
                'zona_rawan' => $report->wilayah?->desa ? true : false,
                'zona_label' => $report->wilayah?->desa ? 'Zona Rawan '.$report->jenisBencana?->nama_bencana.' - '.$report->wilayah->desa : 'Data zona tidak tersedia',
                'link_gmaps' => 'https://maps.google.com/?q='.$report->latitude.','.$report->longitude,
                'activities' => $activities,
                'workflow_id' => 'wf_disaster_'.$report->kode_laporan,
                'eksekusi_n8n' => 'exec_n8n_'.$report->id,
                'node_sumber' => strtoupper($report->sumber_data ?? 'WEBSITE').' Webhook',
                'database_id' => 'db_lap_'.$report->id,
                'terakhir_diperbarui' => $report->updated_at->toIso8601String(),
            ],
        ]);
    }

    private function maskPhone(string $phone): string
    {
        return $phone;
    }

    public function exportReportPdf(string $laporan)
    {
        $laporanId = str_replace('#', '', $laporan);
        $report = LaporanBencana::with([
            'jenisBencana:id,kode,nama_bencana,warna',
            'status:id,nama_status,warna',
            'wilayah:id,provinsi,kabupaten,kecamatan,desa',
        ])->where(function ($q) use ($laporanId) {
            $q->where('kode_laporan', $laporanId);
            if (is_numeric($laporanId)) {
                $q->orWhere('id', (int) $laporanId);
            }
        })->firstOrFail();

        $pdf = Pdf::loadView('pdf.laporan', ['laporan' => $report]);

        return $pdf->download('Laporan-'.$report->kode_laporan.'.pdf');
    }

    public function export(Request $request): HttpResponse
    {
        $format = strtolower(trim($request->input('format', 'excel')));
        if (str_contains($format, 'excel')) {
            $format = 'excel';
        }

        $query = LaporanBencana::query()
            ->with(['jenisBencana:id,kode,nama_bencana', 'status:id,nama_status']);

        if ($request->filled('tanggal_mulai')) {
            $query->whereDate('created_at', '>=', $request->tanggal_mulai);
        }
        if ($request->filled('tanggal_selesai')) {
            $query->whereDate('created_at', '<=', $request->tanggal_selesai);
        }
        if ($request->filled('jenis_bencana')) {
            $query->whereHas('jenisBencana', fn ($q) => $q->where('kode', $request->jenis_bencana));
        }

        // Add kabupaten filter logic identical to index
        if ($request->filled('kabupaten')) {
            $activeRegencies = SupportedRegency::where('is_active', true)
                ->pluck('name')
                ->map(fn ($name) => Str::title(trim(str_ireplace(['KABUPATEN', 'KOTA'], '', $name))))
                ->toArray();
            $kabupatenKecamatanMap = [];
            if ($activeRegencies) {
                $allWilayah = Wilayah::whereIn('kabupaten', $activeRegencies)
                    ->whereNotNull('kecamatan')
                    ->select('kabupaten', 'kecamatan')
                    ->distinct()
                    ->get();
                foreach ($allWilayah as $w) {
                    $kabupatenKecamatanMap[$w->kabupaten][] = $w->kecamatan;
                }
            }
            $kabKec = $kabupatenKecamatanMap[$request->kabupaten] ?? [];
            if ($kabKec) {
                $query->whereIn('kecamatan', $kabKec);
            }
        } elseif ($request->filled('kecamatan')) {
            $query->where('kecamatan', $request->kecamatan);
        }
        if ($request->filled('status')) {
            $query->whereHas('status', fn ($q) => $q->where('nama_status', $request->status));
        }
        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->whereRaw('kode_laporan ILIKE ?', ["%{$search}%"])
                    ->orWhereRaw('judul ILIKE ?', ["%{$search}%"])
                    ->orWhereRaw('alamat ILIKE ?', ["%{$search}%"]);
            });
        }

        $reports = $query->orderBy('created_at', 'desc')->get();

        $headers = [
            'ID Laporan',
            'Jenis Bencana',
            'Judul',
            'Alamat',
            'Kecamatan',
            'Desa',
            'Latitude',
            'Longitude',
            'Tingkat Keparahan',
            'Status',
            'Tanggal Kejadian',
            'Tanggal Dibuat',
            'Pelapor (WhatsApp)',
            'Sumber Data',
        ];

        $rows = $reports->map(function ($r) {
            return [
                $r->kode_laporan,
                $r->jenisBencana?->nama_bencana ?? '-',
                $r->judul,
                $r->alamat,
                $r->kecamatan,
                $r->desa ?? '-',
                $r->latitude ?? '-',
                $r->longitude ?? '-',
                $r->tingkat_keparahan ?? '-',
                $r->status?->nama_status ?? '-',
                $r->waktu_kejadian?->format('d M Y H:i') ?? '-',
                $r->created_at->format('d M Y H:i'),
                $this->maskPhone($r->whatsappMessage?->from ?? '-'),
                strtoupper($r->sumber_data ?? 'WEBSITE'),
            ];
        })->toArray();

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('pdf.incidents-list', [
                'headers' => $headers,
                'rows' => $rows,
                'generatedAt' => now()->format('d M Y H:i'),
            ])->setPaper('a4', 'landscape');

            return $pdf->download('laporan-kejadian-'.now()->format('Ymd-His').'.pdf');
        }

        if ($format === 'csv') {
            $callback = function () use ($headers, $rows) {
                $file = fopen('php://output', 'w');
                fputcsv($file, $headers);
                foreach ($rows as $row) {
                    fputcsv($file, $row);
                }
                fclose($file);
            };

            return HttpResponse::stream($callback, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="laporan-kejadian-'.now()->format('Ymd-His').'.csv"',
            ]);
        }

        // Excel format (using CSV with proper headers for Excel compatibility)
        $callback = function () use ($headers, $rows) {
            $file = fopen('php://output', 'w');
            // Add BOM for UTF-8 Excel compatibility
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($file, $headers);
            foreach ($rows as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return HttpResponse::stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="laporan-kejadian-'.now()->format('Ymd-His').'.xls"',
        ]);
    }
}
