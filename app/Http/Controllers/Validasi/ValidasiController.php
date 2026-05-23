<?php

namespace App\Http\Controllers\Validasi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ValidasiController extends Controller
{
    public function index(Request $request): Response
    {
        $selectedReport = [
            'id' => '1',
            'laporan_id' => '#LAP-2026-05121',
            'status' => 'MENUNGGU_VALIDASI',
            'tingkat_risiko' => 'TINGGI',
            'risk_score' => 78,
            'jenis_bencana' => 'BANJIR',
            'lokasi' => 'Jl. Merdeka No. 45',
            'kecamatan' => 'Karanganyar',
            'koordinat' => ['lat' => -7.01, 'lng' => 108.22],
            'deskripsi' => 'Banjir setinggi 1 meter merendam pemukiman warga di Jl. Merdeka No. 45 dan sekitarnya. Air datang dari arah sungai Citanduy yang meluap akibat hujan deras sejak pukul 04:00 WIB.',
            'pelapor' => '62812****3456 (WhatsApp)',
            'sumber' => 'WhatsApp',
            'id_pesan' => 'wamid.HBGLm...A3e1',
            'diterima_pada' => '2026-05-23T10:35:00+07:00',
            'foto' => [],
            'foto_count' => 0,
            'ai_ringkasan' => [
                'prediksi_jenis' => ['label' => 'Banjir', 'confidence' => 94],
                'risk_score' => 78,
                'severity' => 'TINGGI',
                'rekomendasi' => 'Segera lakukan evakuasi warga di area terdampak.',
                'nlp' => ['prediksi' => 'Banjir', 'confidence' => 94, 'keyword_utama' => ['banjir', 'merendam', 'sungai', 'meluap', 'hujan']],
                'cv' => ['objek_terdeteksi' => [
                    ['label' => 'Genangan Air', 'confidence' => 92],
                    ['label' => 'Rumah Terendam', 'confidence' => 87],
                    ['label' => 'Jalan Terputus', 'confidence' => 78],
                ]],
                'risk' => ['score' => 78, 'severity' => 'TINGGI', 'zona_rawan' => 'Zona Rawan Banjir - Tinggi', 'rekomendasi' => 'Evakuasi segera diperlukan'],
            ],
            'zona_rawan' => true,
            'zona_label' => 'Zona Rawan Banjir - Tinggi',
            'link_gmaps' => 'https://maps.google.com/?q=-7.01,108.22',
            'activities' => [],
            'workflow_id' => 'wf_disaster_2026_05121',
            'eksekusi_n8n' => 'exec_n8n_78234',
            'node_sumber' => 'WhatsApp Webhook',
            'database_id' => 'db_lap_05121',
            'terakhir_diperbarui' => '2026-05-23T10:36:00+07:00',
        ];

        return Inertia::render('disaster/validation', [
            'stats' => [
                'menungguValidasi' => ['value' => 23, 'pct' => 15, 'trend' => [5, 8, 6, 9, 7, 10, 8]],
                'sedangDiproses' => ['value' => 8, 'pct' => 5, 'trend' => [2, 3, 4, 2, 3, 4, 3]],
                'valid' => ['value' => 112, 'pct' => 72, 'trend' => [14, 16, 18, 15, 20, 17, 22]],
                'tidakValid' => ['value' => 8, 'pct' => 5, 'trend' => [1, 2, 1, 3, 1, 2, 2]],
                'duplikat' => ['value' => 5, 'pct' => 3, 'trend' => [1, 0, 2, 1, 1, 2, 1]],
            ],
            'reports' => [
                'data' => [
                    ['id' => '1', 'judul' => 'Banjir di Jl. Merdeka', 'lokasi' => 'Jl. Merdeka No. 45', 'kecamatan' => 'Karanganyar', 'waktu' => '10:35 WIB', 'foto_url' => null, 'risk_level' => 'TINGGI', 'status' => 'MENUNGGU_VALIDASI'],
                    ['id' => '2', 'judul' => 'Longsor di Bukit Indah', 'lokasi' => 'Bukit Indah RT 03', 'kecamatan' => 'Cibeureum', 'waktu' => '09:22 WIB', 'foto_url' => null, 'risk_level' => 'SEDANG', 'status' => 'MENUNGGU_VALIDASI'],
                    ['id' => '3', 'judul' => 'Kebakaran Lahan Kosong', 'lokasi' => 'Jl. Pahlawan', 'kecamatan' => 'Indihiang', 'waktu' => '08:15 WIB', 'foto_url' => null, 'risk_level' => 'RENDAH', 'status' => 'BARU'],
                    ['id' => '4', 'judul' => 'Angin Kencang Rusak Atap', 'lokasi' => 'Perumahan Griya Asri', 'kecamatan' => 'Tamansari', 'waktu' => '07:48 WIB', 'foto_url' => null, 'risk_level' => 'SEDANG', 'status' => 'MENUNGGU_VALIDASI'],
                    ['id' => '5', 'judul' => 'Banjir Bandang Sungai Citanduy', 'lokasi' => 'Bantaran Sungai', 'kecamatan' => 'Kawalu', 'waktu' => '06:30 WIB', 'foto_url' => null, 'risk_level' => 'TINGGI', 'status' => 'BARU'],
                ],
                'meta' => ['current_page' => 1, 'last_page' => 5, 'per_page' => 5, 'total' => 23, 'from' => 1, 'to' => 5],
                'links' => ['prev' => null, 'next' => '/validasi?page=2'],
            ],
            'selectedReport' => $selectedReport,
            'filters' => [
                'jenis' => $request->input('jenis', ''),
                'kecamatan' => $request->input('kecamatan', ''),
                'q' => $request->input('q', ''),
            ],
            'filterOptions' => [
                'jenisList' => ['BANJIR', 'LONGSOR', 'KEBAKARAN', 'ANGIN_KENCANG', 'LAINNYA'],
                'kecamatanList' => [
                    ['id' => '1', 'nama' => 'Karanganyar', 'kabupaten' => 'Tasikmalaya'],
                    ['id' => '2', 'nama' => 'Cibeureum', 'kabupaten' => 'Tasikmalaya'],
                    ['id' => '3', 'nama' => 'Indihiang', 'kabupaten' => 'Tasikmalaya'],
                    ['id' => '4', 'nama' => 'Kawalu', 'kabupaten' => 'Tasikmalaya'],
                    ['id' => '5', 'nama' => 'Tamansari', 'kabupaten' => 'Tasikmalaya'],
                ],
            ],
        ]);
    }

    public function validate(Request $request, string $id): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'decision' => ['required', 'in:VALID,PERLU_CEK_LAPANGAN,TIDAK_VALID,DUPLIKAT'],
            'catatan' => ['nullable', 'string', 'max:500'],
        ]);

        // TODO: Process validation decision

        return back()->with('success', 'Laporan berhasil divalidasi.');
    }
}
