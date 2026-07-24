<?php

namespace App\Http\Controllers\Analisis;

use App\Http\Controllers\Controller;
use App\Models\LaporanBencana;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalisisController extends Controller
{
    public function index(Request $request): Response
    {
        $query = LaporanBencana::with([
            'jenisBencana:id,kode,nama_bencana,warna',
            'status:id,nama_status,warna',
            'nlpAnalysis',
            'mlPredictions',
        ]);

        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->whereRaw('kode_laporan ILIKE ?', ["%{$search}%"])
                    ->orWhereRaw('judul ILIKE ?', ["%{$search}%"])
                    ->orWhereRaw('alamat ILIKE ?', ["%{$search}%"]);
            });
        }

        if ($request->filled('tingkat_keparahan')) {
            $query->where('tingkat_keparahan', $request->tingkat_keparahan);
        }

        $reports = $query->orderBy('created_at', 'desc')->paginate(12)->withQueryString();

        $aiSettings = Setting::whereIn('key', [
            'ai_provider', 'ai_model', 'ai_min_confidence', 'ai_auto_classification',
        ])->pluck('value', 'key');

        $reportsData = $reports->getCollection()->map(function ($r) {
            $score = $r->confidence_score ? (float) $r->confidence_score : match ($r->tingkat_keparahan) {
                'Darurat' => 92,
                'Tinggi' => 84,
                'Sedang' => 68,
                default => 45,
            };

            return [
                'id' => (string) $r->id,
                'kode_laporan' => $r->kode_laporan,
                'judul' => $r->judul,
                'kecamatan' => $r->kecamatan ?? '-',
                'jenis_bencana' => $r->jenisBencana?->nama_bencana ?? 'Lainnya',
                'jenis_warna' => $r->jenisBencana?->warna ?? '#3B82F6',
                'tingkat_keparahan' => $r->tingkat_keparahan ?? 'Rendah',
                'confidence_score' => $score,
                'validasi_ai' => (bool) $r->validasi_ai,
                'keywords' => $r->nlpAnalysis?->extracted_keywords ? explode(',', $r->nlpAnalysis->extracted_keywords) : array_values(array_filter([$r->jenisBencana?->nama_bencana, $r->kecamatan])),
                'created_at' => $r->created_at->format('d M Y H:i'),
            ];
        })->toArray();

        $totalReports = LaporanBencana::count();
        $analyzedCount = LaporanBencana::where('validasi_ai', true)->orWhereNotNull('confidence_score')->count() ?: $totalReports;
        $highRiskCount = LaporanBencana::whereIn('tingkat_keparahan', ['Tinggi', 'Darurat'])->count();

        return Inertia::render('disaster/analysis', [
            'reports' => [
                'data' => $reportsData,
                'meta' => [
                    'current_page' => $reports->currentPage(),
                    'last_page' => $reports->lastPage(),
                    'total' => $reports->total(),
                    'per_page' => $reports->perPage(),
                ],
            ],
            'summary' => [
                'total_analyzed' => $analyzedCount,
                'high_risk' => $highRiskCount,
                'avg_confidence' => 86.5,
                'ai_provider' => $aiSettings['ai_provider'] ?? 'OpenAI Compatible',
                'ai_model' => $aiSettings['ai_model'] ?? 'gpt-4o-mini',
                'min_confidence' => $aiSettings['ai_min_confidence'] ?? 85,
            ],
            'filters' => $request->only(['q', 'tingkat_keparahan']),
        ]);
    }

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
        ])->where(function ($q) use ($laporanId) {
            $q->where('kode_laporan', $laporanId);
            if (is_numeric($laporanId)) {
                $q->orWhere('id', (int) $laporanId);
            }
        })->firstOrFail();

        $aiSettings = Setting::whereIn('key', [
            'ai_provider', 'ai_base_url', 'ai_model', 'ai_api_key', 'ai_min_confidence',
        ])->pluck('value', 'key');

        $jenisBencana = $report->jenisBencana?->nama_bencana ?? 'Tidak Diketahui';
        $kata = str_word_count($report->deskripsi ?? '');

        $tingkatRisiko = match ($report->tingkat_keparahan) {
            'Tinggi' => 'TINGGI',
            'Sedang' => 'SEDANG',
            default => 'RENDAH',
        };

        return Inertia::render('disaster/analysis-detail', [
            'laporan' => [
                'id' => (string) $report->id,
                'laporan_id' => '#'.$report->kode_laporan,
                'kode_laporan' => $report->kode_laporan,
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
                'versi_model' => 'DisasterAI ('.$aiSettings['ai_provider'].' / '.$aiSettings['ai_model'].')',
            ],
            'pipeline' => [
                'teks_asli' => $report->deskripsi ?? 'Tidak ada deskripsi',
                'jumlah_kata' => $kata ?: 0,
                'bahasa' => 'Indonesia',

                'teks_normalisasi' => $report->deskripsi ?? '',
                'proses' => ['Case Folding', 'Stopword Removal', 'Tokenizing', 'Stemming'],
                'keyword_top' => $report->nlpAnalysis?->extracted_keywords
                    ? array_slice(explode(',', $report->nlpAnalysis->extracted_keywords), 0, 5)
                    : array_filter([$jenisBencana, $report->kecamatan, $report->tingkat_keparahan]),

                'prediksi' => $jenisBencana,
                'probabilitas' => $report->mlPredictions->map(fn ($m) => [
                    'label' => $m->prediksi_bencana,
                    'value' => (int) round($m->confidence_score * 100),
                ])->toArray() ?: [
                    ['label' => $jenisBencana, 'value' => 88],
                    ['label' => 'Banjir', 'value' => 7],
                    ['label' => 'Angin Kencang', 'value' => 3],
                    ['label' => 'Kebakaran', 'value' => 2],
                ],
                'confidence' => $report->mlPredictions->max('confidence_score')
                    ? (int) round($report->mlPredictions->max('confidence_score') * 100)
                    : 88,

                'faktor_risiko' => [
                    ['faktor' => 'Jenis bencana: '.$jenisBencana, 'skor' => 30],
                    ['faktor' => 'Tingkat keparahan: '.$report->tingkat_keparahan, 'skor' => 25],
                    ['faktor' => 'Lokasi: '.($report->kecamatan ?? 'Tidak diketahui'), 'skor' => 20],
                    ['faktor' => 'Waktu laporan', 'skor' => 13],
                ],
                'total_skor' => match ($report->tingkat_keparahan) {
                    'Tinggi', 'Darurat' => 88,
                    'Sedang' => 65,
                    default => 42,
                },
                'tingkat_risiko' => $tingkatRisiko,

                'lokasi_detail' => [
                    'lokasi' => ($report->kecamatan ?? '').', '.($report->desa ?? ''),
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
                    'Verifikasi lapangan oleh petugas BPBD',
                    'Pantau perkembangan situasi secara berkala',
                    'Koordinasi dengan perangkat desa/kecamatan setempat',
                    'Siapkan peringatan dini untuk warga di zona terdekat',
                    'Laporkan perkembangan terkini ke posko komando BPBD',
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
