<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\EarlyWarning;
use App\Models\JenisBencana;
use App\Models\LaporanBencana;
use App\Models\Wilayah;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Real stats from database
        $stats = Cache::remember('dashboard:stats', 60, function () {
            $now = now();
            $lastWeek = $now->copy()->subDays(6)->startOfDay();

            return [
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
                ],
                'belumDiverifikasi' => [
                    'value' => LaporanBencana::where('status_id', 1)->count(),
                    'trend' => LaporanBencana::where('status_id', 1)
                        ->selectRaw('DATE(created_at) as date, count(*) as count')
                        ->where('created_at', '>=', $lastWeek)
                        ->groupBy('date')
                        ->orderBy('date')
                        ->pluck('count', 'date')
                        ->map(fn ($c) => (int) $c)
                        ->values()
                        ->toArray(),
                    'pct' => LaporanBencana::count() > 0
                        ? round((LaporanBencana::where('status_id', 1)->count() / LaporanBencana::count()) * 100)
                        : 0,
                ],
                'warningAktif' => [
                    'value' => EarlyWarning::where('status', 'aktif')->count(),
                    'trend' => EarlyWarning::where('status', 'aktif')
                        ->selectRaw('DATE(created_at) as date, count(*) as count')
                        ->where('created_at', '>=', $lastWeek)
                        ->groupBy('date')
                        ->orderBy('date')
                        ->pluck('count', 'date')
                        ->map(fn ($c) => (int) $c)
                        ->values()
                        ->toArray(),
                ],
                'laporanValid' => [
                    'value' => LaporanBencana::where('validasi_admin', true)->count(),
                    'trend' => LaporanBencana::where('validasi_admin', true)
                        ->selectRaw('DATE(created_at) as date, count(*) as count')
                        ->where('created_at', '>=', $lastWeek)
                        ->groupBy('date')
                        ->orderBy('date')
                        ->pluck('count', 'date')
                        ->map(fn ($c) => (int) $c)
                        ->values()
                        ->toArray(),
                    'pct' => LaporanBencana::count() > 0
                        ? round((LaporanBencana::where('validasi_admin', true)->count() / LaporanBencana::count()) * 100)
                        : 0,
                ],
                'pengirimLaporan' => [
                    'value' => LaporanBencana::distinct('whatsapp_message_id')->count(),
                    'trend' => LaporanBencana::selectRaw('DATE(created_at) as date, count(DISTINCT whatsapp_message_id) as count')
                        ->where('created_at', '>=', $lastWeek)
                        ->whereNotNull('whatsapp_message_id')
                        ->groupBy('date')
                        ->orderBy('date')
                        ->pluck('count', 'date')
                        ->map(fn ($c) => (int) $c)
                        ->values()
                        ->toArray(),
                ],
            ];
        });

        // Map markers from real reports with coordinates
        $mapMarkers = Cache::remember('dashboard:map_markers', 300, function () {
            return LaporanBencana::whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->where('created_at', '>=', now()->subDays(7))
                ->with('jenisBencana:id,kode,nama_bencana')
                ->get()
                ->map(function ($r) {
                    $coords = [
                        'lat' => (float) $r->latitude,
                        'lng' => (float) $r->longitude,
                    ];
                    // Add small random offset to prevent overlap
                    $coords['lat'] += (mt_rand(-30, 30) / 10000);
                    $coords['lng'] += (mt_rand(-30, 30) / 10000);

                    return [
                        'id' => (string) $r->id,
                        'lat' => $coords['lat'],
                        'lng' => $coords['lng'],
                        'type' => $r->jenisBencana?->kode ?? 'LAINNYA',
                        'kecamatan' => $r->kecamatan,
                        'judul' => $r->judul,
                    ];
                })
                ->toArray();
        });

        // Latest reports
        $laporanTerbaru = LaporanBencana::with(['jenisBencana:id,kode,nama_bencana,warna', 'status:id,nama_status,warna'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($r) {
                return [
                    'id' => (string) $r->id,
                    'laporan_id' => $r->kode_laporan,
                    'judul' => $r->judul,
                    'lokasi' => $r->alamat,
                    'kecamatan' => $r->kecamatan,
                    'waktu' => $r->created_at->format('H:i').' WIB',
                    'foto_url' => $r->media->first()?->file_url,
                    'risk_level' => $r->tingkat_keparahan,
                    'status' => $r->status?->nama_status ?? 'MENUNGGU',
                ];
            })
            ->toArray();

        // Trend data (last 7 days)
        $trendData = LaporanBencana::selectRaw('DATE(created_at) as tanggal, count(*) as count')
            ->where('created_at', '>=', now()->copy()->subDays(6)->startOfDay())
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->pluck('count', 'tanggal')
            ->map(fn ($c, $t) => ['tanggal' => Carbon::parse($t)->format('d M'), 'count' => (int) $c])
            ->values()
            ->toArray();

        // Reports by disaster type
        $laporanByJenis = LaporanBencana::with('jenisBencana:id,kode,nama_bencana,warna')
            ->selectRaw('jenis_bencana_id, count(*) as count')
            ->groupBy('jenis_bencana_id')
            ->get()
            ->map(function ($item) {
                $jenis = $item->jenisBencana;

                return [
                    'type' => $jenis?->kode ?? 'LAINNYA',
                    'label' => $jenis?->nama_bencana ?? 'Lainnya',
                    'count' => (int) $item->count,
                    'pct' => 0, // will calculate below
                    'color' => $jenis?->warna ?? '#8B5CF6',
                ];
            })
            ->toArray();

        // Calculate percentages
        $totalByJenis = array_sum(array_column($laporanByJenis, 'count'));
        if ($totalByJenis > 0) {
            $laporanByJenis = array_map(function ($item) use ($totalByJenis) {
                $item['pct'] = round(($item['count'] / $totalByJenis) * 100);

                return $item;
            }, $laporanByJenis);
        }

        // Overall risk score (based on recent high-risk reports)
        $riskStats = LaporanBencana::where('created_at', '>=', now()->subDays(30))
            ->selectRaw('tingkat_keparahan, count(*) as count')
            ->groupBy('tingkat_keparahan')
            ->pluck('count', 'tingkat_keparahan')
            ->toArray();

        $riskWeights = ['Rendah' => 1, 'Sedang' => 3, 'Tinggi' => 7, 'Darurat' => 10];
        $totalRiskReports = array_sum($riskStats);
        $weightedScore = 0;
        foreach ($riskStats as $level => $count) {
            $weightedScore += ($riskWeights[$level] ?? 1) * $count;
        }
        $riskScore = $totalRiskReports > 0 ? min(100, round(($weightedScore / ($totalRiskReports * 10)) * 100)) : 0;

        $risikoKeseluruhan = [
            'score' => $riskScore,
            'label' => $this->getRiskLabel($riskScore),
            'color' => $this->getRiskColor($riskScore),
        ];

        // Filter options
        $kecamatanList = Wilayah::where('kabupaten', 'Indramayu')
            ->whereNotNull('kecamatan')
            ->distinct('kecamatan')
            ->orderBy('kecamatan')
            ->pluck('kecamatan')
            ->map(function ($name, $i) {
                return ['id' => (string) ($i + 1), 'nama' => $name, 'kabupaten' => 'Indramayu'];
            })
            ->toArray();

        $jenisOptions = JenisBencana::orderBy('kode')->pluck('kode')->toArray();

        return Inertia::render('disaster/dashboard', [
            'stats' => $stats,
            'mapMarkers' => $mapMarkers,
            'laporanTerbaru' => $laporanTerbaru,
            'trendData' => $trendData,
            'laporanByJenis' => $laporanByJenis,
            'risikoKeseluruhan' => $risikoKeseluruhan,
            'filters' => [
                'kecamatan' => $kecamatanList,
                'jenisOptions' => $jenisOptions,
            ],
        ]);
    }

    private function getRiskLabel(int $score): string
    {
        return match (true) {
            $score >= 80 => 'Risiko Sangat Tinggi',
            $score >= 60 => 'Risiko Tinggi',
            $score >= 40 => 'Risiko Sedang',
            default => 'Risiko Rendah',
        };
    }

    private function getRiskColor(int $score): string
    {
        return match (true) {
            $score >= 80 => '#EF4444',
            $score >= 60 => '#F97316',
            $score >= 40 => '#F59E0B',
            default => '#22C55E',
        };
    }
}
