<?php

namespace App\Http\Controllers\Kejadian;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KejadianController extends Controller
{
    private function getKecamatanList(): array
    {
        $kecamatan = [
            'Anjatan', 'Arahan', 'Balongan', 'Bangodua', 'Bongas', 'Cantigi',
            'Cikedung', 'Gabuswetan', 'Gantar', 'Haurgeulis', 'Indramayu',
            'Jatibarang', 'Juntinyuat', 'Kandanghaur', 'Karangampel',
            'Kedokan Bunder', 'Kertasemaya', 'Krangkeng', 'Kroya', 'Lelea',
            'Lohbener', 'Losarang', 'Pasekan', 'Patrol', 'Sindang', 'Sliyeg',
            'Sukagumiwang', 'Sukra', 'Terisi', 'Tukdana', 'Widasari',
        ];

        return collect($kecamatan)->sort()->values()->map(function ($name, $i) {
            return ['id' => (string) ($i + 1), 'nama' => $name, 'kabupaten' => 'Indramayu'];
        })->toArray();
    }

    public function index(Request $request): Response
    {
        // Generate 13 dummy reports with format LAP-{tahun}-{bulantanggal}-{urutan}
        $allReports = [
            ['id' => '1', 'laporan_id' => '#LAP-2026-0521-001', 'jenis_bencana' => 'BANJIR', 'lokasi' => 'Jatibarang', 'kecamatan' => 'Kec. Jatibarang', 'waktu_laporan' => '2026-05-21T10:35:00+07:00', 'pelapor' => '62812****3456', 'status' => 'BARU', 'tingkat_risiko' => 'TINGGI', 'sumber' => 'WHATSAPP'],
            ['id' => '2', 'laporan_id' => '#LAP-2026-0521-002', 'jenis_bencana' => 'LONGSOR', 'lokasi' => 'Cikedung', 'kecamatan' => 'Kec. Cikedung', 'waktu_laporan' => '2026-05-21T10:26:00+07:00', 'pelapor' => '62895****7788', 'status' => 'MENUNGGU_VALIDASI', 'tingkat_risiko' => 'SEDANG', 'sumber' => 'WHATSAPP'],
            ['id' => '3', 'laporan_id' => '#LAP-2026-0521-003', 'jenis_bencana' => 'BANJIR', 'lokasi' => 'Lohbener', 'kecamatan' => 'Kec. Lohbener', 'waktu_laporan' => '2026-05-21T10:11:00+07:00', 'pelapor' => '62813****1122', 'status' => 'MENUNGGU_VALIDASI', 'tingkat_risiko' => 'TINGGI', 'sumber' => 'WHATSAPP'],
            ['id' => '4', 'laporan_id' => '#LAP-2026-0521-004', 'jenis_bencana' => 'KEBAKARAN', 'lokasi' => 'Bongas', 'kecamatan' => 'Kec. Bongas', 'waktu_laporan' => '2026-05-21T09:58:00+07:00', 'pelapor' => '62896****3344', 'status' => 'VALID', 'tingkat_risiko' => 'SEDANG', 'sumber' => 'WHATSAPP'],
            ['id' => '5', 'laporan_id' => '#LAP-2026-0521-005', 'jenis_bencana' => 'ANGIN_KENCANG', 'lokasi' => 'Anjatan', 'kecamatan' => 'Kec. Anjatan', 'waktu_laporan' => '2026-05-21T09:45:00+07:00', 'pelapor' => '62821****8899', 'status' => 'VALID', 'tingkat_risiko' => 'RENDAH', 'sumber' => 'WHATSAPP'],
            ['id' => '6', 'laporan_id' => '#LAP-2026-0521-006', 'jenis_bencana' => 'LAINNYA', 'lokasi' => 'Kandanghaur', 'kecamatan' => 'Kec. Kandanghaur', 'waktu_laporan' => '2026-05-21T09:30:00+07:00', 'pelapor' => '62817****5566', 'status' => 'DUPLIKAT', 'tingkat_risiko' => 'RENDAH', 'sumber' => 'WHATSAPP'],
            ['id' => '7', 'laporan_id' => '#LAP-2026-0521-007', 'jenis_bencana' => 'LONGSOR', 'lokasi' => 'Haurgeulis', 'kecamatan' => 'Kec. Haurgeulis', 'waktu_laporan' => '2026-05-21T09:12:00+07:00', 'pelapor' => '62832****2211', 'status' => 'PERLU_CEK_LAPANGAN', 'tingkat_risiko' => 'SEDANG', 'sumber' => 'WHATSAPP'],
            ['id' => '8', 'laporan_id' => '#LAP-2026-0521-008', 'jenis_bencana' => 'BANJIR', 'lokasi' => 'Karangampel', 'kecamatan' => 'Kec. Karangampel', 'waktu_laporan' => '2026-05-21T09:05:00+07:00', 'pelapor' => '62811****6677', 'status' => 'HOAKS', 'tingkat_risiko' => 'RENDAH', 'sumber' => 'WHATSAPP'],
            ['id' => '9', 'laporan_id' => '#LAP-2026-0521-009', 'jenis_bencana' => 'BANJIR', 'lokasi' => 'Sindang', 'kecamatan' => 'Kec. Sindang', 'waktu_laporan' => '2026-05-21T08:50:00+07:00', 'pelapor' => '62856****4433', 'status' => 'VALID', 'tingkat_risiko' => 'SEDANG', 'sumber' => 'WHATSAPP'],
            ['id' => '10', 'laporan_id' => '#LAP-2026-0521-010', 'jenis_bencana' => 'KEBAKARAN', 'lokasi' => 'Indramayu', 'kecamatan' => 'Kec. Indramayu', 'waktu_laporan' => '2026-05-21T08:30:00+07:00', 'pelapor' => '62878****9900', 'status' => 'DIPROSES', 'tingkat_risiko' => 'TINGGI', 'sumber' => 'WHATSAPP'],
            ['id' => '11', 'laporan_id' => '#LAP-2026-0520-001', 'jenis_bencana' => 'BANJIR', 'lokasi' => 'Sliyeg', 'kecamatan' => 'Kec. Sliyeg', 'waktu_laporan' => '2026-05-20T16:20:00+07:00', 'pelapor' => '62819****1234', 'status' => 'VALID', 'tingkat_risiko' => 'SEDANG', 'sumber' => 'WHATSAPP'],
            ['id' => '12', 'laporan_id' => '#LAP-2026-0520-002', 'jenis_bencana' => 'LONGSOR', 'lokasi' => 'Gantar', 'kecamatan' => 'Kec. Gantar', 'waktu_laporan' => '2026-05-20T15:45:00+07:00', 'pelapor' => '62852****5678', 'status' => 'VALID', 'tingkat_risiko' => 'RENDAH', 'sumber' => 'WHATSAPP'],
            ['id' => '13', 'laporan_id' => '#LAP-2026-0520-003', 'jenis_bencana' => 'ANGIN_KENCANG', 'lokasi' => 'Patrol', 'kecamatan' => 'Kec. Patrol', 'waktu_laporan' => '2026-05-20T14:30:00+07:00', 'pelapor' => '62838****9012', 'status' => 'BARU', 'tingkat_risiko' => 'SEDANG', 'sumber' => 'WHATSAPP'],
        ];

        $page = (int) $request->input('page', 1);
        $perPage = 10;
        $total = count($allReports);
        $lastPage = (int) ceil($total / $perPage);
        $offset = ($page - 1) * $perPage;
        $pageData = array_slice($allReports, $offset, $perPage);

        return Inertia::render('disaster/incidents', [
            'reports' => [
                'data' => $pageData,
                'meta' => [
                    'current_page' => $page,
                    'last_page' => $lastPage,
                    'per_page' => $perPage,
                    'total' => $total,
                    'from' => $total > 0 ? $offset + 1 : 0,
                    'to' => min($offset + $perPage, $total),
                ],
                'links' => [
                    'prev' => $page > 1 ? '/incidents?page='.($page - 1) : null,
                    'next' => $page < $lastPage ? '/incidents?page='.($page + 1) : null,
                ],
            ],
            'stats' => [
                'totalLaporan' => ['value' => 128, 'trend' => [12, 18, 15, 22, 28, 33, 18], 'delta' => 18],
                'belumDiverifikasi' => ['value' => 35, 'pct' => 27, 'trend' => [8, 12, 10, 14, 11, 15, 13]],
                'valid' => ['value' => 81, 'pct' => 63, 'trend' => [10, 14, 12, 16, 18, 20, 15]],
                'warning' => ['value' => 12, 'trend' => [4, 6, 5, 8, 7, 10, 12], 'label' => 'Waspada Tinggi'],
                'duplikatLainnya' => ['value' => 6, 'pct' => 5, 'trend' => [1, 2, 1, 2, 1, 2, 1]],
            ],
            'filters' => [
                'tanggal_mulai' => $request->input('tanggal_mulai', ''),
                'tanggal_selesai' => $request->input('tanggal_selesai', ''),
                'jenis_bencana' => $request->input('jenis_bencana', ''),
                'kecamatan' => $request->input('kecamatan', ''),
                'status' => $request->input('status', ''),
                'q' => $request->input('q', ''),
            ],
            'filterOptions' => [
                'kecamatanList' => $this->getKecamatanList(),
                'statusList' => ['BARU', 'MENUNGGU_VALIDASI', 'VALID', 'TIDAK_VALID', 'DUPLIKAT', 'HOAKS', 'PERLU_CEK_LAPANGAN', 'DIPROSES'],
                'jenisList' => ['BANJIR', 'LONGSOR', 'KEBAKARAN', 'ANGIN_KENCANG', 'LAINNYA'],
            ],
        ]);
    }

    public function show(string $laporan): Response
    {
        // In production, fetch from DB using laporan_id
        $laporanId = '#'.str_replace('#', '', $laporan);

        return Inertia::render('disaster/incidents/show', [
            'report' => [
                'id' => $laporan,
                'laporan_id' => '#LAP-2026-0521-001',
                'status' => 'BARU',
                'tingkat_risiko' => 'TINGGI',
                'risk_score' => 78,
                'jenis_bencana' => 'BANJIR',
                'lokasi' => 'Desa Jatibarang',
                'kecamatan' => 'Jatibarang',
                'koordinat' => ['lat' => -6.444092, 'lng' => 108.308969],
                'deskripsi' => 'Banjir setinggi 1 meter merendam pemukiman warga di Desa Jatibarang dan sekitarnya. Air datang dari arah sungai yang meluap akibat hujan deras sejak pukul 04:00 WIB. Beberapa rumah warga terendam dan akses jalan terputus.',
                'pelapor' => '62812****3456 (WhatsApp)',
                'sumber' => 'WhatsApp',
                'id_pesan' => 'wamid.HBGLm...A3e1',
                'diterima_pada' => '2026-05-21T10:35:00+07:00',
                'foto' => ['/images/knowledge.jpg', '/images/machine-learning-workflow.jpeg', '/images/ml-di-netflix.jpeg', '/images/startup-business-concept-banner-with-rocket-launching-vector.jpg'],
                'foto_count' => 4,
                'ai_ringkasan' => [
                    'prediksi_jenis' => ['label' => 'Banjir', 'confidence' => 94],
                    'risk_score' => 78,
                    'severity' => 'TINGGI',
                    'rekomendasi' => 'Segera lakukan evakuasi warga di area terdampak dan koordinasi dengan tim SAR.',
                ],
                'zona_rawan' => true,
                'zona_label' => 'Zona Rawan Banjir - Tinggi',
                'link_gmaps' => 'https://maps.google.com/?q=-6.444092,108.308969',
                'activities' => [
                    ['id' => '1', 'timestamp' => '2026-05-21T10:35:00+07:00', 'type' => 'whatsapp', 'description' => 'Laporan diterima via WhatsApp'],
                    ['id' => '2', 'timestamp' => '2026-05-21T10:35:05+07:00', 'type' => 'system', 'description' => 'Laporan masuk ke sistem via n8n workflow'],
                    ['id' => '3', 'timestamp' => '2026-05-21T10:35:10+07:00', 'type' => 'ai', 'description' => 'Analisis AI dimulai (NLP + CV + Spatial)'],
                    ['id' => '4', 'timestamp' => '2026-05-21T10:35:30+07:00', 'type' => 'ai', 'description' => 'Analisis AI selesai - Risk Score: 78/100'],
                    ['id' => '5', 'timestamp' => '2026-05-21T10:36:00+07:00', 'type' => 'system', 'description' => 'Status: Menunggu validasi petugas'],
                ],
                'workflow_id' => 'wf_disaster_2026_05121',
                'eksekusi_n8n' => 'exec_n8n_78234',
                'node_sumber' => 'WhatsApp Webhook',
                'database_id' => 'db_lap_05121',
                'terakhir_diperbarui' => '2026-05-21T10:36:00+07:00',
            ],
        ]);
    }
}
