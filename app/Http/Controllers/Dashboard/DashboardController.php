<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Real kecamatan center coordinates from dataset
        $kecamatanCoords = [
            'Anjatan' => [-6.372532, 107.946761],
            'Arahan' => [-6.360261, 108.253979],
            'Balongan' => [-6.381898, 108.371611],
            'Bangodua' => [-6.516232, 108.291483],
            'Bongas' => [-6.381079, 108.021079],
            'Cantigi' => [-6.336671, 108.249001],
            'Cikedung' => [-6.501886, 108.181326],
            'Gabuswetan' => [-6.435380, 108.069649],
            'Gantar' => [-6.535662, 107.945367],
            'Haurgeulis' => [-6.453552, 107.937276],
            'Indramayu' => [-6.343098, 108.330180],
            'Jatibarang' => [-6.444092, 108.308969],
            'Juntinyuat' => [-6.433649, 108.412843],
            'Kandanghaur' => [-6.357974, 108.090547],
            'Karangampel' => [-6.470611, 108.450573],
            'Kedokan Bunder' => [-6.496816, 108.417100],
            'Kertasemaya' => [-6.520550, 108.368326],
            'Krangkeng' => [-6.520126, 108.476681],
            'Kroya' => [-6.484710, 108.042856],
            'Lelea' => [-6.458789, 108.227784],
            'Lohbener' => [-6.405672, 108.262739],
            'Losarang' => [-6.400017, 108.164470],
            'Pasekan' => [-6.297226, 108.322564],
            'Patrol' => [-6.318266, 107.995169],
            'Sindang' => [-6.341285, 108.310468],
            'Sliyeg' => [-6.454214, 108.347047],
            'Sukagumiwang' => [-6.578767, 108.316760],
            'Sukra' => [-6.303870, 107.946197],
            'Terisi' => [-6.493468, 108.134793],
            'Tukdana' => [-6.561291, 108.290927],
            'Widasari' => [-6.460692, 108.279555],
        ];

        // Generate map markers at real kecamatan locations
        $disasterTypes = ['BANJIR', 'LONGSOR', 'KEBAKARAN', 'ANGIN_KENCANG', 'LAINNYA'];
        $mapMarkers = [];
        $id = 1;

        // Distribute incidents across kecamatan realistically
        $incidents = [
            ['kec' => 'Jatibarang', 'type' => 'BANJIR'],
            ['kec' => 'Haurgeulis', 'type' => 'BANJIR'],
            ['kec' => 'Sindang', 'type' => 'LONGSOR'],
            ['kec' => 'Karangampel', 'type' => 'BANJIR'],
            ['kec' => 'Lohbener', 'type' => 'KEBAKARAN'],
            ['kec' => 'Anjatan', 'type' => 'ANGIN_KENCANG'],
            ['kec' => 'Bongas', 'type' => 'BANJIR'],
            ['kec' => 'Kandanghaur', 'type' => 'LONGSOR'],
            ['kec' => 'Kroya', 'type' => 'BANJIR'],
            ['kec' => 'Sukra', 'type' => 'LAINNYA'],
            ['kec' => 'Patrol', 'type' => 'BANJIR'],
            ['kec' => 'Losarang', 'type' => 'LONGSOR'],
            ['kec' => 'Indramayu', 'type' => 'BANJIR'],
            ['kec' => 'Arahan', 'type' => 'BANJIR'],
            ['kec' => 'Cantigi', 'type' => 'BANJIR'],
            ['kec' => 'Lelea', 'type' => 'LONGSOR'],
            ['kec' => 'Sliyeg', 'type' => 'BANJIR'],
            ['kec' => 'Gabuswetan', 'type' => 'ANGIN_KENCANG'],
            ['kec' => 'Widasari', 'type' => 'BANJIR'],
            ['kec' => 'Terisi', 'type' => 'LONGSOR'],
            ['kec' => 'Kertasemaya', 'type' => 'BANJIR'],
            ['kec' => 'Juntinyuat', 'type' => 'KEBAKARAN'],
            ['kec' => 'Cikedung', 'type' => 'LONGSOR'],
            ['kec' => 'Bangodua', 'type' => 'BANJIR'],
            ['kec' => 'Pasekan', 'type' => 'BANJIR'],
            ['kec' => 'Gantar', 'type' => 'LAINNYA'],
            ['kec' => 'Tukdana', 'type' => 'BANJIR'],
            ['kec' => 'Kedokan Bunder', 'type' => 'LONGSOR'],
            ['kec' => 'Krangkeng', 'type' => 'BANJIR'],
            ['kec' => 'Sukagumiwang', 'type' => 'ANGIN_KENCANG'],
            ['kec' => 'Balongan', 'type' => 'KEBAKARAN'],
        ];

        foreach ($incidents as $inc) {
            $coords = $kecamatanCoords[$inc['kec']] ?? null;
            if (! $coords) {
                continue;
            }
            // Add small random offset so markers don't overlap exactly
            $mapMarkers[] = [
                'id' => (string) $id++,
                'lat' => $coords[0] + (mt_rand(-30, 30) / 10000),
                'lng' => $coords[1] + (mt_rand(-30, 30) / 10000),
                'type' => $inc['type'],
                'kecamatan' => $inc['kec'],
            ];
        }

        // Build kecamatan filter list
        $kecamatanList = collect($kecamatanCoords)->keys()->sort()->values()->map(function ($name, $i) {
            return ['id' => (string) ($i + 1), 'nama' => $name, 'kabupaten' => 'Indramayu'];
        })->toArray();

        return Inertia::render('disaster/dashboard', [
            'stats' => [
                'totalLaporan' => 128,
                'totalLaporanTrend' => [12, 18, 15, 22, 28, 33, 18],
                'belumDiverifikasi' => 35,
                'belumDiverifikasiPct' => 27,
                'belumDiverifikasiTrend' => [8, 12, 10, 14, 11, 15, 13],
                'warningAktif' => 12,
                'warningAktifTrend' => [4, 6, 5, 8, 7, 10, 12],
                'laporanValid' => 81,
                'laporanValidPct' => 63,
                'laporanValidTrend' => [10, 14, 12, 16, 18, 20, 15],
                'pengirimLaporan' => 96,
                'pengirimLaporanTrend' => [12, 15, 18, 14, 20, 22, 16],
            ],
            'mapMarkers' => $mapMarkers,
            'laporanTerbaru' => [
                ['id' => '1', 'laporan_id' => '#LAP-2026-00145', 'judul' => 'Banjir di Jatibarang', 'lokasi' => 'Jl. Raya Jatibarang', 'kecamatan' => 'Jatibarang', 'waktu' => '10:35 WIB', 'foto_url' => null, 'risk_level' => 'TINGGI', 'status' => 'BARU'],
                ['id' => '2', 'laporan_id' => '#LAP-2026-00144', 'judul' => 'Longsor di Cikedung', 'lokasi' => 'Desa Cikedung Lor', 'kecamatan' => 'Cikedung', 'waktu' => '10:26 WIB', 'foto_url' => null, 'risk_level' => 'SEDANG', 'status' => 'MENUNGGU_VALIDASI'],
                ['id' => '3', 'laporan_id' => '#LAP-2026-00143', 'judul' => 'Banjir di Lohbener', 'lokasi' => 'Desa Lohbener', 'kecamatan' => 'Lohbener', 'waktu' => '10:11 WIB', 'foto_url' => null, 'risk_level' => 'SEDANG', 'status' => 'MENUNGGU_VALIDASI'],
                ['id' => '4', 'laporan_id' => '#LAP-2026-00142', 'judul' => 'Genangan di Kandanghaur', 'lokasi' => 'Desa Kandanghaur', 'kecamatan' => 'Kandanghaur', 'waktu' => '09:58 WIB', 'foto_url' => null, 'risk_level' => 'RENDAH', 'status' => 'VALID'],
                ['id' => '5', 'laporan_id' => '#LAP-2026-00141', 'judul' => 'Angin Kencang di Anjatan', 'lokasi' => 'Desa Anjatan', 'kecamatan' => 'Anjatan', 'waktu' => '09:45 WIB', 'foto_url' => null, 'risk_level' => 'RENDAH', 'status' => 'VALID'],
            ],
            'trendData' => [
                ['tanggal' => '15 Mei', 'count' => 12],
                ['tanggal' => '16 Mei', 'count' => 18],
                ['tanggal' => '17 Mei', 'count' => 15],
                ['tanggal' => '18 Mei', 'count' => 22],
                ['tanggal' => '19 Mei', 'count' => 28],
                ['tanggal' => '20 Mei', 'count' => 33],
                ['tanggal' => '21 Mei', 'count' => 18],
            ],
            'laporanByJenis' => [
                ['type' => 'BANJIR', 'label' => 'Banjir', 'count' => 45, 'pct' => 35, 'color' => '#3B82F6'],
                ['type' => 'LONGSOR', 'label' => 'Longsor', 'count' => 28, 'pct' => 22, 'color' => '#F59E0B'],
                ['type' => 'KEBAKARAN', 'label' => 'Kebakaran', 'count' => 12, 'pct' => 9, 'color' => '#EF4444'],
                ['type' => 'ANGIN_KENCANG', 'label' => 'Angin Kencang', 'count' => 8, 'pct' => 6, 'color' => '#22C55E'],
                ['type' => 'LAINNYA', 'label' => 'Lainnya', 'count' => 7, 'pct' => 6, 'color' => '#8B5CF6'],
            ],
            'risikoKeseluruhan' => [
                'score' => 76,
                'label' => 'Risiko Tinggi',
                'color' => '#EF4444',
            ],
            'filters' => [
                'kecamatan' => $kecamatanList,
                'jenisOptions' => ['BANJIR', 'LONGSOR', 'KEBAKARAN', 'ANGIN_KENCANG', 'LAINNYA'],
            ],
        ]);
    }
}
