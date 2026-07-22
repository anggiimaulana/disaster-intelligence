import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Brain, CheckCircle, FileText, MapPin, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Laporan {
    id: number;
    kode_laporan: string;
    judul: string;
    alamat: string;
    kecamatan: string;
    desa: string | null;
    latitude: number;
    longitude: number;
    tingkat_keparahan: string;
    deskripsi: string;
    validasi_ai: boolean;
    validasi_admin: boolean;
    created_at: string;
    jenis_bencana: { id: number; kode: string; nama_bencana: string; warna: string; icon: string | null };
    status: { id: number; nama_status: string; warna: string };
    media: Array<{ id: number; media_type: string; file_path: string; file_url: string }>;
    validasi: { id: number; hasil_validasi: string; catatan: string | null; admin: { id: number; name: string } } | null;
    wilayah: { id: number; provinsi: string; kabupaten: string; kecamatan: string; desa: string } | null;
    early_warnings: Array<{ id: number; level_warning: string; pesan: string; status: string }>;
    ml_predictions: Array<{ id: number; model_name: string; prediksi_bencana: string; confidence_score: number }>;
    nlp_analysis: { id: number; extracted_keywords: string; sentiment: string; cleaned_text: string } | null;
}

const RISK_COLORS: Record<string, string> = {
    Rendah: 'bg-green-100 text-green-700',
    Sedang: 'bg-yellow-100 text-yellow-700',
    Tinggi: 'bg-orange-100 text-orange-700',
    Darurat: 'bg-red-100 text-red-700',
};

export default function ValidationShow({ laporan }: { laporan: Laporan }) {
    return (
        <>
            <Head title={`Validasi: ${laporan.kode_laporan}`} />

            <div className="mb-5">
                <button onClick={() => router.get('/cms/validation')} className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                    <ArrowLeft className="h-4 w-4" /> Kembali ke Validasi
                </button>
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-slate-900">{laporan.judul}</h1>
                    <span className="text-sm font-mono text-slate-500">{laporan.kode_laporan}</span>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-bold text-slate-900">Detail Laporan</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div><dt className="text-xs text-slate-500">Jenis Bencana</dt><dd className="mt-0.5 font-medium text-slate-900" style={{ color: laporan.jenis_bencana.warna }}>{laporan.jenis_bencana.nama_bencana}</dd></div>
                            <div><dt className="text-xs text-slate-500">Tingkat Keparahan</dt><dd className="mt-0.5"><span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', RISK_COLORS[laporan.tingkat_keparahan])}>{laporan.tingkat_keparahan}</span></dd></div>
                            <div><dt className="text-xs text-slate-500">Lokasi</dt><dd className="mt-0.5 font-medium text-slate-900">{laporan.alamat}</dd></div>
                            <div><dt className="text-xs text-slate-500">Kecamatan</dt><dd className="mt-0.5 font-medium text-slate-900">{laporan.kecamatan}</dd></div>
                            <div><dt className="text-xs text-slate-500">Koordinat</dt><dd className="mt-0.5 font-medium text-slate-900">{laporan.latitude}, {laporan.longitude}</dd></div>
                            <div><dt className="text-xs text-slate-500">Waktu</dt><dd className="mt-0.5 font-medium text-slate-900">{new Date(laporan.created_at).toLocaleString('id-ID')}</dd></div>
                        </div>
                        <div className="mt-4"><dt className="text-xs text-slate-500">Deskripsi</dt><dd className="mt-1 text-sm text-slate-700 leading-relaxed">{laporan.deskripsi}</dd></div>
                    </div>

                    {/* Media */}
                    {laporan.media.length > 0 && (
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-base font-bold text-slate-900">Media</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {laporan.media.map((m) => (
                                    <div key={m.id} className="rounded-lg border border-slate-200 overflow-hidden">
                                        {m.media_type === 'image' ? (
                                            <img src={`/storage/${m.file_url}`} alt="" className="w-full h-40 object-cover" />
                                        ) : (
                                            <div className="flex h-40 items-center justify-center bg-slate-100 text-slate-400 text-sm">Video</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI Analysis */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="h-5 w-5 text-blue-600" />
                            <h2 className="text-base font-bold text-blue-900">Analisis AI</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-blue-600 font-medium">Validasi AI:</span>
                                <span className={cn('ml-2 font-medium', laporan.validasi_ai ? 'text-green-600' : 'text-slate-400')}>{laporan.validasi_ai ? 'Selesai' : 'Pending'}</span>
                            </div>
                            <div>
                                <span className="text-blue-600 font-medium">Validasi Admin:</span>
                                <span className={cn('ml-2 font-medium', laporan.validasi_admin ? 'text-green-600' : 'text-slate-400')}>{laporan.validasi_admin ? 'Selesai' : 'Pending'}</span>
                            </div>
                        </div>
                        {laporan.nlp_analysis && (
                            <div className="mt-3 text-sm">
                                <p className="text-blue-600 font-medium">Sentimen: {laporan.nlp_analysis.sentiment}</p>
                                <p className="mt-1 text-slate-600">Keywords: {laporan.nlp_analysis.extracted_keywords}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                    {/* Status */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-3 text-sm font-bold text-slate-900">Status</h3>
                        <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: laporan.status.warna }}>{laporan.status.nama_status}</span>
                    </div>

                    {/* Validation Result */}
                    {laporan.validasi && (
                        <div className={cn('rounded-xl p-5 border', laporan.validasi.hasil_validasi === 'valid' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50')}>
                            <div className="flex items-center gap-2 mb-2">
                                {laporan.validasi.hasil_validasi === 'valid' ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                                <h3 className="text-sm font-bold text-slate-900">Hasil Validasi</h3>
                            </div>
                            <p className="text-sm font-medium text-slate-900 uppercase">{laporan.validasi.hasil_validasi}</p>
                            {laporan.validasi.catatan && <p className="mt-1 text-sm text-slate-600">{laporan.validasi.catatan}</p>}
                            <p className="mt-2 text-xs text-slate-500">Oleh: {laporan.validasi.admin.name}</p>
                        </div>
                    )}

                    {/* Early Warnings */}
                    {laporan.early_warnings.length > 0 && (
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-3 text-sm font-bold text-slate-900">Peringatan Dini</h3>
                            <div className="space-y-2">
                                {laporan.early_warnings.map((w) => (
                                    <div key={w.id} className="rounded-lg bg-amber-50 p-3 text-sm">
                                        <p className="font-medium text-amber-800">{w.level_warning}</p>
                                        <p className="text-xs text-amber-600">{w.pesan}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ML Predictions */}
                    {laporan.ml_predictions.length > 0 && (
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-3 text-sm font-bold text-slate-900">Prediksi ML</h3>
                            <div className="space-y-2">
                                {laporan.ml_predictions.map((p) => (
                                    <div key={p.id} className="rounded-lg bg-purple-50 p-3 text-sm">
                                        <p className="font-medium text-purple-800">{p.model_name}</p>
                                        <p className="text-xs text-purple-600">Confidence: {(p.confidence_score * 100).toFixed(1)}%</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
