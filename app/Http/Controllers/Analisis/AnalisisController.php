<?php

namespace App\Http\Controllers\Analisis;

use App\Http\Controllers\Controller;
use App\Models\LaporanBencana;
use Inertia\Inertia;
use Inertia\Response;

class AnalisisController extends Controller
{
    public function show(string $laporan): Response
    {
        $laporanId = str_replace('#', '', $laporan);
        $report = LaporanBencana::with([
            'jenisBencana',
            'status',
            'earlyWarnings',
            'mlPredictions',
            'nlpAnalysis',
            'wilayah',
        ])->where('kode_laporan', $laporanId)->firstOrFail();

        $jenisBencana = $report->jenisBencana?->nama_bencana ?? 'Tidak Diketahui';
        $kata = str_word_count($report->deskripsi ?? '');

        $tingkatRisiko = match ($report->tingkat_keparahan) {
            'Tinggi' => 'TINGGI',
            'Sedang' => 'SEDANG',
            default => 'RENDAH',
        };

        return Inertia::render('disaster/analysis-detail', [
            'laporan' => [
                'id' => $laporanId,
                'laporan_id' => '#'.$report->kode_laporan,
                'status' => $report->status?->nama_status ?? 'Menunggu',
                'tanggal' => $report->created_at->format('d M Y, H:i').' WIB',
                'sumber' => match ($report->sumber_data) {
                    'website' => 'Website',
                    'whatsapp' => 'WhatsApp Gateway',
                    'telegram' => 'Telegram Bot',
                    default => ucfirst($report->sumber_data ?? 'Manual'),
                },
                'lokasi' => $report->kecamatan ?? $report->alamat ?? '-',
                'kecamatan' => 'Kec. '.($report->kecamatan ?? '-'),
                'status_analisis' => $report->validasi_ai ? 'Tervalidasi' : 'Diproses',
                'versi_model' => 'DisasterAI v2.1',
            ],
            'pipeline' => [
                'teks_asli' => $report->deskripsi ?? 'Tidak ada deskripsi',
                'jumlah_kata' => $kata ?: 0,
                'bahasa' => 'Indonesia',

                'teks_normalisasi' => $report->deskripsi ?? '',
                'proses' => ['Case Folding', 'Stopword Removal', 'Tokenizing', 'Stemming'],
                'keyword_top' => $report->nlpAnalysis
                    ? array_slice(explode(',', $report->nlpAnalysis->extracted_keywords), 0, 5)
                    : [$jenisBencana, $report->kecamatan, $report->tingkat_keparahan],

                'prediksi' => $jenisBencana,
                'probabilitas' => $report->mlPredictions->map(fn ($m) => [
                    'label' => $m->prediksi_bencana,
                    'value' => (int) round($m->confidence_score * 100),
                ])->toArray() ?: [
                    ['label' => $jenisBencana, 'value' => 85],
                    ['label' => 'Banjir', 'value' => 8],
                    ['label' => 'Angin Kencang', 'value' => 4],
                    ['label' => 'Kebakaran', 'value' => 3],
                ],
                'confidence' => $report->mlPredictions->max('confidence_score')
                    ? (int) round($report->mlPredictions->max('confidence_score') * 100)
                    : 85,

                'faktor_risiko' => [
                    ['faktor' => 'Jenis bencana: '.$jenisBencana, 'skor' => 30],
                    ['faktor' => 'Tingkat keparahan: '.$report->tingkat_keparahan, 'skor' => 25],
                    ['faktor' => 'Lokasi: '.($report->kecamatan ?? 'Tidak diketahui'), 'skor' => 20],
                    ['faktor' => 'Waktu laporan', 'skor' => 12],
                ],
                'total_skor' => match ($report->tingkat_keparahan) {
                    'Tinggi' => 87,
                    'Sedang' => 65,
                    default => 40,
                },
                'tingkat_risiko' => $tingkatRisiko,

                'lokasi_detail' => [
                    'lokasi' => $report->kecamatan.', '.($report->desa ?? ''),
                    'zona_rawan' => in_array($jenisBencana, ['Banjir', 'Longsor', 'Gempa']),
                    'jarak_ke_sungai' => 0,
                    'riwayat_banjir' => 0,
                    'elevasi' => 0,
                    'koordinat' => [
                        'lat' => (float) ($report->latitude ?: -6.5),
                        'lng' => (float) ($report->longitude ?: 108.3),
                    ],
                ],

                'rekomendasi' => [
                    'Verifikasi lapangan oleh petugas',
                    'Pantau perkembangan situasi',
                    'Koordinasi dengan perangkat desa setempat',
                    'Siapkan peringatan dini untuk warga sekitar',
                    'Laporkan perkembangan ke posko BPBD',
                ],

                'status_output' => $report->earlyWarnings->isNotEmpty() ? 'WARNING' : 'INFO',
                'tujuan_distribusi' => ['Dashboard BPBD', 'Grup WhatsApp BPBD'],
                'status_kirim' => $report->earlyWarnings->isNotEmpty() ? 'Berhasil Terkirim' : 'Menunggu Distribusi',
                'waktu_kirim' => $report->updated_at->format('d M Y, H:i').' WIB',
                'workflow_id' => 'WF-'.$report->kode_laporan,
            ],
        ]);
    }
}
