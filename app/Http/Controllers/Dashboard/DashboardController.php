<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\EarlyWarning;
use App\Models\JenisBencana;
use App\Models\LaporanBencana;
use App\Models\SupportedRegency;
use App\Models\Wilayah;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function markNotificationsRead(Request $request)
    {
        $request->session()->put('notifications_seen_at', now()->toIso8601String());

        return back();
    }

    public function index(): Response
    {
        // Real stats from database
        $stats = $this->getDashboardStats();

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
        $baseTrendData = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $baseTrendData->put($date, [
                'tanggal' => Carbon::parse($date)->format('d M'),
                'count' => 0,
            ]);
        }

        $trendRecords = LaporanBencana::selectRaw('DATE(created_at) as tanggal, count(*) as count')
            ->where('created_at', '>=', now()->copy()->subDays(6)->startOfDay())
            ->groupBy('tanggal')
            ->pluck('count', 'tanggal');

        foreach ($trendRecords as $date => $count) {
            if ($baseTrendData->has($date)) {
                $item = $baseTrendData->get($date);
                $item['count'] = (int) $count;
                $baseTrendData->put($date, $item);
            }
        }
        $trendData = $baseTrendData->values()->toArray();

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
        $activeRegencies = SupportedRegency::where('is_active', true)->pluck('name')
            ->map(fn ($name) => preg_replace('/^(KABUPATEN|KOTA)\s+/i', '', $name))
            ->map(fn ($name) => ucwords(strtolower(trim($name))))
            ->toArray();

        $kecamatanList = Wilayah::whereIn('kabupaten', $activeRegencies)
            ->whereNotNull('kecamatan')
            ->distinct()
            ->select('kecamatan', 'kabupaten')
            ->orderBy('kabupaten')
            ->orderBy('kecamatan')
            ->get()
            ->map(function ($item, $i) {
                return [
                    'id' => (string) ($i + 1),
                    'nama' => $item->kecamatan,
                    'kabupaten' => $item->kabupaten,
                ];
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

    private function getDashboardStats(): array
    {
        return Cache::remember('dashboard:stats', 60, function () {
            $now = now();
            $lastWeek = $now->copy()->subDays(6)->startOfDay();

            $baseTrend = [];
            for ($i = 6; $i >= 0; $i--) {
                $baseTrend[now()->subDays($i)->format('Y-m-d')] = 0;
            }

            return [
                'totalLaporan' => [
                    'value' => LaporanBencana::count(),
                    'trend' => array_values(array_replace($baseTrend, LaporanBencana::selectRaw('DATE(created_at) as date, count(*) as count')
                        ->where('created_at', '>=', $lastWeek)
                        ->groupBy('date')
                        ->pluck('count', 'date')
                        ->map(fn ($c) => (int) $c)
                        ->toArray())),
                ],
                'belumDiverifikasi' => [
                    'value' => LaporanBencana::where('status_id', 1)->count(),
                    'trend' => array_values(array_replace($baseTrend, LaporanBencana::where('status_id', 1)
                        ->selectRaw('DATE(created_at) as date, count(*) as count')
                        ->where('created_at', '>=', $lastWeek)
                        ->groupBy('date')
                        ->pluck('count', 'date')
                        ->map(fn ($c) => (int) $c)
                        ->toArray())),
                    'pct' => LaporanBencana::count() > 0
                        ? round((LaporanBencana::where('status_id', 1)->count() / LaporanBencana::count()) * 100)
                        : 0,
                ],
                'warningAktif' => [
                    'value' => EarlyWarning::where('status', 'aktif')->count(),
                    'trend' => array_values(array_replace($baseTrend, EarlyWarning::where('status', 'aktif')
                        ->selectRaw('DATE(created_at) as date, count(*) as count')
                        ->where('created_at', '>=', $lastWeek)
                        ->groupBy('date')
                        ->pluck('count', 'date')
                        ->map(fn ($c) => (int) $c)
                        ->toArray())),
                ],
                'laporanValid' => [
                    'value' => LaporanBencana::where('validasi_admin', true)->count(),
                    'trend' => array_values(array_replace($baseTrend, LaporanBencana::where('validasi_admin', true)
                        ->selectRaw('DATE(created_at) as date, count(*) as count')
                        ->where('created_at', '>=', $lastWeek)
                        ->groupBy('date')
                        ->pluck('count', 'date')
                        ->map(fn ($c) => (int) $c)
                        ->toArray())),
                    'pct' => LaporanBencana::count() > 0
                        ? round((LaporanBencana::where('validasi_admin', true)->count() / LaporanBencana::count()) * 100)
                        : 0,
                ],
                'pengirimLaporan' => [
                    'value' => LaporanBencana::distinct('whatsapp_message_id')->count(),
                    'trend' => array_values(array_replace($baseTrend, LaporanBencana::selectRaw('DATE(created_at) as date, count(DISTINCT whatsapp_message_id) as count')
                        ->where('created_at', '>=', $lastWeek)
                        ->whereNotNull('whatsapp_message_id')
                        ->groupBy('date')
                        ->pluck('count', 'date')
                        ->map(fn ($c) => (int) $c)
                        ->toArray())),
                ],
            ];
        });
    }
}
