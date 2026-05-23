<?php

namespace App\Http\Controllers\Analisis;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AnalisisController extends Controller
{
    public function show(string $laporan): Response
    {
        return Inertia::render('disaster/analysis-detail', [
            'laporan' => [
                'id' => $laporan,
                'laporan_id' => '#LAP-2026-0521-001',
                'status' => 'MENUNGGU_VALIDASI',
                'tanggal' => '21 Mei 2026, 10:35 WIB',
                'sumber' => 'WhatsApp Gateway',
                'lokasi' => 'Jatibarang',
                'kecamatan' => 'Kec. Jatibarang',
                'status_analisis' => 'Diproses',
                'versi_model' => 'TextClassifier v1.0',
            ],
            'pipeline' => [
                // Step 1: Teks Asli
                'teks_asli' => 'Air masuk rumah warga sekitar 40 cm akibat hujan deras sejak semalam dan terus naik.',
                'jumlah_kata' => 16,
                'bahasa' => 'Indonesia',

                // Step 2: Preprocessing NLP
                'teks_normalisasi' => 'air masuk rumah warga sekitar 40 cm akibat hujan deras sejak semalam dan terus naik',
                'proses' => ['Case Folding', 'Stopword Removal', 'Tokenizing', 'Stemming'],
                'keyword_top' => ['air masuk', 'rumah warga', 'hujan deras', 'naik', 'genangan'],

                // Step 3: Hasil Klasifikasi
                'prediksi' => 'BANJIR',
                'probabilitas' => [
                    ['label' => 'Banjir', 'value' => 92],
                    ['label' => 'Longsor', 'value' => 6],
                    ['label' => 'Kebakaran', 'value' => 1],
                    ['label' => 'Angin Kencang', 'value' => 1],
                ],
                'confidence' => 92,

                // Step 4: Risk Assessment
                'faktor_risiko' => [
                    ['faktor' => 'Kata kunci banjir terdeteksi', 'skor' => 30],
                    ['faktor' => 'Hujan deras dalam laporan', 'skor' => 25],
                    ['faktor' => 'Banyak laporan serupa (10 laporan)', 'skor' => 20],
                    ['faktor' => 'Lokasi zona rawan banjir', 'skor' => 20],
                    ['faktor' => 'Waktu laporan (malam/hujan)', 'skor' => 12],
                ],
                'total_skor' => 87,
                'tingkat_risiko' => 'TINGGI',

                // Step 5: Analisis Lokasi
                'lokasi_detail' => [
                    'lokasi' => 'Jatibarang',
                    'zona_rawan' => true,
                    'jarak_ke_sungai' => 320,
                    'riwayat_banjir' => 8,
                    'elevasi' => 82,
                    'koordinat' => ['lat' => -6.444092, 'lng' => 108.308969],
                ],

                // Step 6: Rekomendasi
                'rekomendasi' => [
                    'Verifikasi lapangan oleh petugas',
                    'Pantau perkembangan curah hujan',
                    'Siapkan peringatan dini untuk warga',
                    'Koordinasi dengan perangkat desa',
                    'Monitor debit sungai terdekat',
                ],

                // Step 7: Output Workflow
                'status_output' => 'WARNING',
                'tujuan_distribusi' => ['Dashboard BPBD', 'Grup WhatsApp BPBD', 'Telegram Channel', 'Email Operator'],
                'status_kirim' => 'Berhasil Terkirim',
                'waktu_kirim' => '21 Mei 2026, 10:36 WIB',
                'workflow_id' => 'WF-2026-0521-001',
            ],
        ]);
    }
}
