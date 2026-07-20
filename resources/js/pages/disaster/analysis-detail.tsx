import { Head, Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, Bell, CheckCircle, ExternalLink, FileText, MapPin, MessageCircle, Monitor, Mail, Send } from 'lucide-react';
import { config } from '@/config';

interface AnalysisDetailProps {
    laporan: {
        id: string;
        laporan_id: string;
        status: string;
        tanggal: string;
        sumber: string;
        lokasi: string;
        kecamatan: string;
        status_analisis: string;
        versi_model: string;
    };
    pipeline: {
        teks_asli: string;
        jumlah_kata: number;
        bahasa: string;
        teks_normalisasi: string;
        proses: string[];
        keyword_top: string[];
        prediksi: string;
        probabilitas: { label: string; value: number }[];
        confidence: number;
        faktor_risiko: { faktor: string; skor: number }[];
        total_skor: number;
        tingkat_risiko: string;
        lokasi_detail: {
            lokasi: string;
            zona_rawan: boolean;
            jarak_ke_sungai: number;
            riwayat_banjir: number;
            elevasi: number;
            koordinat: { lat: number; lng: number };
        };
        rekomendasi: string[];
        status_output: string;
        tujuan_distribusi: string[];
        status_kirim: string;
        waktu_kirim: string;
        workflow_id: string;
    };
}

export default function AnalysisDetail({ laporan, pipeline }: AnalysisDetailProps) {
    return (
        <div className="w-full min-w-0 max-w-full pb-10 overflow-x-hidden">
            <Head title={`Analisis AI - ${laporan.laporan_id}`} />

            {/* Report Info Header */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    <div>
                        <p className="text-xs text-slate-500">ID Laporan</p>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{laporan.laporan_id.replace('#', '')}</span>
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">Menunggu Validasi</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Tanggal Laporan</p>
                        <p className="mt-1 text-sm font-medium text-slate-900">{laporan.tanggal}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Sumber</p>
                        <p className="mt-1 text-sm font-medium text-slate-900">{laporan.sumber}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Lokasi</p>
                        <p className="mt-1 text-sm font-medium text-slate-900">{laporan.lokasi}, {laporan.kecamatan}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Status Analisis</p>
                        <span className="mt-1 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">{laporan.status_analisis}</span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Versi Model</p>
                        <p className="mt-1 text-sm font-medium text-slate-900">{laporan.versi_model}</p>
                    </div>
                </div>
            </div>

            {/* Pipeline Steps Row 1: Teks Asli | Preprocessing NLP | Hasil Klasifikasi */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Step 1: Teks Asli */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">1</span>
                        Teks Asli Laporan
                    </h3>
                    <blockquote className="rounded-lg bg-slate-50 p-4 text-sm italic text-slate-700 border-l-4 border-blue-400">
                        "{pipeline.teks_asli}"
                    </blockquote>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <p className="text-xs text-slate-500">Jumlah Kata</p>
                            <p className="text-sm font-bold text-slate-900">{pipeline.jumlah_kata} kata</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Bahasa</p>
                            <p className="text-sm font-bold text-slate-900">{pipeline.bahasa}</p>
                        </div>
                    </div>
                </div>

                {/* Step 2: Preprocessing NLP */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">2</span>
                        Preprocessing NLP
                    </h3>
                    <div>
                        <p className="text-xs text-slate-500">Teks Normalisasi</p>
                        <p className="mt-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{pipeline.teks_normalisasi}</p>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 mb-2">Proses</p>
                        <div className="space-y-1.5">
                            {pipeline.proses.map((p) => (
                                <div key={p} className="flex items-center gap-2">
                                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                    <span className="text-sm text-slate-700">{p}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 mb-2">Keyword (Top 5)</p>
                        <div className="flex flex-wrap gap-1.5">
                            {pipeline.keyword_top.map((k) => (
                                <span key={k} className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">{k}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Step 3: Hasil Klasifikasi */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">3</span>
                        Hasil Klasifikasi (Machine Learning)
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <p className="text-xs text-slate-500">Prediksi Jenis Bencana</p>
                            <p className="mt-1 text-2xl font-black text-blue-700">{pipeline.prediksi}</p>
                            <p className="mt-1 text-xs text-slate-500">Confidence</p>
                            <p className="text-xl font-bold text-green-600">{pipeline.confidence}%</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 mb-2">Probabilitas Kelas</p>
                        <div className="space-y-2">
                            {pipeline.probabilitas.map((p) => (
                                <div key={p.label} className="flex items-center gap-2">
                                    <span className="w-24 text-xs text-slate-600">{p.label}</span>
                                    <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${p.value}%` }} />
                                    </div>
                                    <span className="w-10 text-right text-xs font-bold text-slate-900">{p.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pipeline Steps Row 2: Risk Assessment | Analisis Lokasi | Rekomendasi */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Step 4: Risk Assessment */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">4</span>
                        Risk Assessment (Rule-based Scoring)
                    </h3>
                    <div className="flex items-start gap-4">
                        {/* Gauge */}
                        <div className="flex flex-col items-center">
                            <svg width="100" height="60" viewBox="0 0 100 60">
                                <path d="M 10 55 A 40 40 0 0 1 36 18" fill="none" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" />
                                <path d="M 38 17 A 40 40 0 0 1 62 17" fill="none" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
                                <path d="M 64 18 A 40 40 0 0 1 90 55" fill="none" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
                                {(() => {
                                    const angle = ((pipeline.total_skor / 100) * 180);
                                    const rad = ((180 - angle) * Math.PI) / 180;
                                    const nx = 50 + 30 * Math.cos(rad);
                                    const ny = 55 - 30 * Math.sin(rad);
                                    return <line x1="50" y1="55" x2={nx} y2={ny} stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />;
                                })()}
                                <circle cx="50" cy="55" r="3" fill="#1e293b" />
                            </svg>
                            <p className="text-xl font-bold text-slate-900">{pipeline.total_skor}<span className="text-sm text-slate-400">/100</span></p>
                            <span className={cn('mt-1 rounded-full px-3 py-0.5 text-xs font-bold',
                                pipeline.tingkat_risiko === 'TINGGI' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            )}>{pipeline.tingkat_risiko}</span>
                        </div>
                        {/* Factors */}
                        <div className="flex-1 space-y-2">
                            <p className="text-xs font-medium text-slate-500">Faktor Risiko</p>
                            {pipeline.faktor_risiko.map((f) => (
                                <div key={f.faktor} className="flex items-center justify-between">
                                    <span className="text-xs text-slate-700">{f.faktor}</span>
                                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">+{f.skor}</span>
                                </div>
                            ))}
                            <div className="border-t border-slate-100 pt-2 flex justify-between">
                                <span className="text-xs font-bold text-slate-900">TOTAL SKOR</span>
                                <span className="text-xs font-bold text-slate-900">{pipeline.total_skor} / 100</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 5: Analisis Lokasi */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">5</span>
                        Analisis Lokasi
                    </h3>
                    <div className="grid grid-cols-1 gap-3 mb-3 sm:grid-cols-2">
                        <div><p className="text-xs text-slate-500">Lokasi</p><p className="text-sm font-medium text-slate-900">{pipeline.lokasi_detail.lokasi}</p></div>
                        <div><p className="text-xs text-slate-500">Zona Rawan</p><p className={cn('text-sm font-bold', pipeline.lokasi_detail.zona_rawan ? 'text-red-600' : 'text-green-600')}>{pipeline.lokasi_detail.zona_rawan ? 'YA' : 'TIDAK'}</p></div>
                        <div><p className="text-xs text-slate-500">Jarak ke Sungai</p><p className="text-sm font-medium text-slate-900">{pipeline.lokasi_detail.jarak_ke_sungai} meter</p></div>
                        <div><p className="text-xs text-slate-500">Riwayat Banjir</p><p className="text-sm font-medium text-slate-900">{pipeline.lokasi_detail.riwayat_banjir} kejadian</p></div>
                        <div><p className="text-xs text-slate-500">Elevasi</p><p className="text-sm font-medium text-slate-900">{pipeline.lokasi_detail.elevasi} mdpl</p></div>
                    </div>
                    <div className="h-32 overflow-hidden rounded-lg">
                        <MapContainer center={[pipeline.lokasi_detail.koordinat.lat, pipeline.lokasi_detail.koordinat.lng]} zoom={12} className="h-full w-full" style={{ zIndex: 0 }} scrollWheelZoom={false} zoomControl={false}>
                            <TileLayer url={config.mapTileUrl} />
                            <CircleMarker center={[pipeline.lokasi_detail.koordinat.lat, pipeline.lokasi_detail.koordinat.lng]} radius={8} fillColor="#EF4444" fillOpacity={0.9} color="#fff" weight={2} />
                        </MapContainer>
                    </div>
                </div>

                {/* Step 6: Rekomendasi Sistem */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">6</span>
                        Rekomendasi Sistem
                    </h3>
                    <div className="space-y-3">
                        {pipeline.rekomendasi.map((r, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                <span className="text-sm text-slate-700">{r}</span>
                            </div>
                        ))}
                    </div>
                    <Link href="/cms/alerts" className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors">
                        <Bell className="h-4 w-4" /> Buat Peringatan Dini →
                    </Link>
                </div>
            </div>

            {/* Step 7: Output Workflow (n8n) */}
            <div className="mt-5 mb-5 rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <h3 className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">7</span>
                    Output Workflow (n8n)
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Left */}
                    <div className="space-y-5">
                        <div>
                            <p className="text-xs text-slate-500">Status Output</p>
                            <span className={cn('mt-2 inline-block rounded-lg px-5 py-2 text-base font-bold',
                                pipeline.status_output === 'WARNING' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                            )}>{pipeline.status_output}</span>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Status Kirim</p>
                            <p className="mt-1 text-sm font-bold text-green-600">{pipeline.status_kirim}</p>
                            <p className="text-xs text-slate-400">{pipeline.waktu_kirim}</p>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="space-y-5">
                        <div>
                            <p className="text-xs text-slate-500 mb-2">Tujuan Distribusi</p>
                            <div className="flex flex-wrap gap-2">
                                {pipeline.tujuan_distribusi.map((t) => (
                                    <span key={t} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                                        {t.includes('Dashboard') && <Monitor className="h-3.5 w-3.5 text-slate-500" />}
                                        {t.includes('WhatsApp') && <MessageCircle className="h-3.5 w-3.5 text-green-600" />}
                                        {t.includes('Telegram') && <Send className="h-3.5 w-3.5 text-blue-500" />}
                                        {t.includes('Email') && <Mail className="h-3.5 w-3.5 text-amber-600" />}
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Workflow ID</p>
                            <p className="mt-1 text-base font-bold text-slate-900">{pipeline.workflow_id}</p>
                            <button className="mt-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                                Lihat Log Workflow
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
