import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/disaster/sparkline';
import { AlertTriangle, Brain, CheckCircle, ChevronLeft, ChevronRight, Clock, Copy, FileText, MapPin, Search, XCircle } from 'lucide-react';

// Dummy data
const statsData = [
    { title: 'MENUNGGU VALIDASI', value: 35, subtitle: '27.3% dari total laporan', subtitleColor: 'text-amber-600', iconBg: 'bg-amber-500', sparkColor: '#F59E0B', trend: [20, 25, 22, 30, 28, 32, 35] },
    { title: 'SEDANG DIPROSES', value: 8, subtitle: '6.3% dari total laporan', subtitleColor: 'text-blue-600', iconBg: 'bg-blue-500', sparkColor: '#3B82F6', trend: [5, 7, 6, 9, 8, 7, 8] },
    { title: 'VALID', value: 81, subtitle: '63.3% dari total laporan', subtitleColor: 'text-green-600', iconBg: 'bg-green-500', sparkColor: '#22C55E', trend: [60, 65, 70, 72, 78, 80, 81] },
    { title: 'TIDAK VALID (HOAKS)', value: 4, subtitle: '3.1% dari total laporan', subtitleColor: 'text-red-600', iconBg: 'bg-red-500', sparkColor: '#EF4444', trend: [2, 1, 3, 2, 3, 3, 4] },
    { title: 'DUPLIKAT', value: 6, subtitle: '4.7% dari total laporan', subtitleColor: 'text-purple-600', iconBg: 'bg-purple-500', sparkColor: '#8B5CF6', trend: [3, 4, 5, 4, 5, 5, 6] },
];

const reports = [
    { id: 'LAP-2026-0521-001', judul: 'Banjir di Jatibarang', lokasi: 'Jatibarang, Kec. Jatibarang', waktu: '21 Mei 2026, 10:35 WIB', risk: 'TINGGI', status: 'Baru', jenis: 'Banjir', koordinat: '-6.4440, 108.3089', pelapor: '62812****3456 (WhatsApp)', sumber: 'WhatsApp Gateway', deskripsi: 'Air masuk ke rumah warga sekitar 40 cm, hujan deras sejak semalam, jalan depan rumah sudah tergenang dan air terus naik.', foto: '/images/knowledge.jpg', fotoAll: ['/images/knowledge.jpg', '/images/machine-learning-workflow.jpeg', '/images/ml-di-netflix.jpeg', '/images/startup-business-concept-banner-with-rocket-launching-vector.jpg'], nlp: { prediksi: 'Banjir', confidence: 92, keywords: ['Air Masuk', 'Hujan Deras', 'Tergenang', 'Air Naik', 'Rumah Warga'] }, cv: [{ label: 'Genangan Air', score: 0.94 }, { label: 'Jalan Tergenang', score: 0.91 }, { label: 'Rumah', score: 0.89 }, { label: 'Pohon', score: 0.78 }], risk_score: 87, severity: 'TINGGI', zona_rawan: 'Ya (Tinggi)', rekomendasi: 'Lakukan validasi lapangan dan pertimbangkan peringatan dini.' },
    { id: 'LAP-2026-0521-002', judul: 'Longsor di Cikedung', lokasi: 'Cikedung, Kec. Cikedung', waktu: '21 Mei 2026, 10:26 WIB', risk: 'SEDANG', status: 'Baru', jenis: 'Longsor', koordinat: '-6.5018, 108.1813', pelapor: '62895****7788 (WhatsApp)', sumber: 'WhatsApp Gateway', deskripsi: 'Tanah longsor menutup jalan desa sepanjang 20 meter. Belum ada korban jiwa. Material longsor berupa tanah dan batu.', foto: '/images/machine-learning-workflow.jpeg', fotoAll: ['/images/machine-learning-workflow.jpeg', '/images/knowledge.jpg', '/images/ml-di-netflix.jpeg', '/images/startup-business-concept-banner-with-rocket-launching-vector.jpg'], nlp: { prediksi: 'Longsor', confidence: 88, keywords: ['Tanah Longsor', 'Jalan Desa', 'Material', 'Batu'] }, cv: [{ label: 'Material Longsor', score: 0.90 }, { label: 'Jalan Tertutup', score: 0.85 }, { label: 'Tanah', score: 0.82 }], risk_score: 72, severity: 'SEDANG', zona_rawan: 'Ya (Sedang)', rekomendasi: 'Verifikasi lapangan diperlukan untuk konfirmasi skala longsor.' },
    { id: 'LAP-2026-0521-003', judul: 'Banjir di Lohbener', lokasi: 'Lohbener, Kec. Lohbener', waktu: '21 Mei 2026, 10:11 WIB', risk: 'SEDANG', status: 'Baru', jenis: 'Banjir', koordinat: '-6.4056, 108.2627', pelapor: '62813****1122 (WhatsApp)', sumber: 'WhatsApp Gateway', deskripsi: 'Genangan air setinggi 30cm di jalan utama desa. Drainase tersumbat. Akses jalan terganggu.', foto: '/images/ml-di-netflix.jpeg', fotoAll: ['/images/ml-di-netflix.jpeg', '/images/knowledge.jpg', '/images/machine-learning-workflow.jpeg', '/images/startup-business-concept-banner-with-rocket-launching-vector.jpg'], nlp: { prediksi: 'Banjir', confidence: 85, keywords: ['Genangan', 'Drainase', 'Tersumbat', 'Jalan'] }, cv: [{ label: 'Genangan', score: 0.88 }, { label: 'Jalan', score: 0.82 }], risk_score: 65, severity: 'SEDANG', zona_rawan: 'Ya (Sedang)', rekomendasi: 'Pantau perkembangan dan koordinasi dengan perangkat desa.' },
    { id: 'LAP-2026-0521-004', judul: 'Genangan di Kandanghaur', lokasi: 'Kandanghaur, Kec. Kandanghaur', waktu: '21 Mei 2026, 09:58 WIB', risk: 'RENDAH', status: 'Baru', jenis: 'Banjir', koordinat: '-6.3579, 108.0905', pelapor: '62817****5566 (WhatsApp)', sumber: 'WhatsApp Gateway', deskripsi: 'Genangan air di sawah dan sebagian jalan kampung. Ketinggian air sekitar 15cm.', foto: '/images/startup-business-concept-banner-with-rocket-launching-vector.jpg', fotoAll: ['/images/startup-business-concept-banner-with-rocket-launching-vector.jpg', '/images/knowledge.jpg', '/images/ml-di-netflix.jpeg', '/images/machine-learning-workflow.jpeg'], nlp: { prediksi: 'Banjir', confidence: 78, keywords: ['Genangan', 'Sawah', 'Jalan Kampung'] }, cv: [{ label: 'Genangan', score: 0.75 }, { label: 'Sawah', score: 0.70 }], risk_score: 45, severity: 'RENDAH', zona_rawan: 'Tidak', rekomendasi: 'Monitoring rutin, belum perlu tindakan darurat.' },
    { id: 'LAP-2026-0521-005', judul: 'Angin Kencang di Anjatan', lokasi: 'Anjatan, Kec. Anjatan', waktu: '21 Mei 2026, 09:45 WIB', risk: 'RENDAH', status: 'Baru', jenis: 'Angin Kencang', koordinat: '-6.3725, 107.9467', pelapor: '62821****8899 (WhatsApp)', sumber: 'WhatsApp Gateway', deskripsi: 'Angin kencang merusak atap 2 rumah warga. Tidak ada korban jiwa. Pohon tumbang di pinggir jalan.', foto: '/images/knowledge.jpg', fotoAll: ['/images/knowledge.jpg', '/images/startup-business-concept-banner-with-rocket-launching-vector.jpg', '/images/ml-di-netflix.jpeg', '/images/machine-learning-workflow.jpeg'], nlp: { prediksi: 'Angin Kencang', confidence: 90, keywords: ['Angin Kencang', 'Atap Rusak', 'Pohon Tumbang'] }, cv: [{ label: 'Atap Rusak', score: 0.88 }, { label: 'Pohon Tumbang', score: 0.85 }], risk_score: 52, severity: 'RENDAH', zona_rawan: 'Tidak', rekomendasi: 'Koordinasi dengan perangkat desa untuk pembersihan.' },
];

const riskBadge: Record<string, string> = { TINGGI: 'bg-red-100 text-red-700', SEDANG: 'bg-amber-100 text-amber-700', RENDAH: 'bg-green-100 text-green-700' };

export default function Validation() {
    const [selectedId, setSelectedId] = useState(reports[0].id);
    const [page, setPage] = useState(1);
    const perPage = 5;
    const totalPages = Math.ceil(reports.length / perPage);
    const selected = reports.find((r) => r.id === selectedId) ?? reports[0];

    return (
        <>
            <Head title="Validasi Laporan" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                {statsData.map((s) => (
                    <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg text-white', s.iconBg)}>
                                {s.title.includes('MENUNGGU') ? <Clock className="h-4 w-4" /> : s.title.includes('PROSES') ? <FileText className="h-4 w-4" /> : s.title.includes('VALID') && !s.title.includes('TIDAK') ? <CheckCircle className="h-4 w-4" /> : s.title.includes('TIDAK') ? <XCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </div>
                            <Sparkline data={s.trend} color={s.sparkColor} width={70} height={28} />
                        </div>
                        <p className="mt-2 text-[10px] font-bold uppercase text-slate-500">{s.title}</p>
                        <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                        <p className={cn('text-xs', s.subtitleColor)}>{s.subtitle}</p>
                    </div>
                ))}
            </div>

            {/* Split View: List (40%) + Detail (60%) */}
            <div className="mt-5 mb-5 flex flex-col gap-5 lg:flex-row">
                {/* LEFT — Daftar Laporan (40%) */}
                <div className="w-full flex-shrink-0 lg:w-[30%]">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-4 py-3">
                            <h2 className="text-base font-bold text-slate-900">Daftar Laporan Menunggu Validasi</h2>
                        </div>
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-2.5">
                            <select className="h-8 rounded-lg border border-slate-200 px-2 text-sm focus:border-blue-500 focus:outline-none">
                                <option>Semua Jenis</option><option>Banjir</option><option>Longsor</option><option>Kebakaran</option><option>Angin Kencang</option>
                            </select>
                            <select className="h-8 rounded-lg border border-slate-200 px-2 text-sm focus:border-blue-500 focus:outline-none">
                                <option>Semua Kecamatan</option>
                            </select>
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <input placeholder="Cari laporan..." className="h-8 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-sm focus:border-blue-500 focus:outline-none" />
                            </div>
                        </div>
                        {/* List */}
                        <div className="divide-y divide-slate-100">
                            {reports.map((r) => (
                                <button key={r.id} onClick={() => setSelectedId(r.id)} className={cn('w-full px-4 py-3 text-left transition-colors', selectedId === r.id ? 'bg-blue-50 border-l-3 border-l-blue-600' : 'hover:bg-slate-50')}>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-slate-900">{r.judul}</p>
                                            <p className="mt-0.5 text-xs text-slate-500"><MapPin className="mr-0.5 inline h-3 w-3" />{r.lokasi}</p>
                                            <p className="text-xs text-slate-400">{r.waktu}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', riskBadge[r.risk])}>{r.risk === 'TINGGI' ? 'Tinggi' : r.risk === 'SEDANG' ? 'Sedang' : 'Rendah'}</span>
                                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">{r.status}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        {/* Pagination */}
                        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
                            <p className="text-xs text-slate-500">Menampilkan 1 - 5 dari 35 laporan</p>
                            <div className="flex items-center gap-1">
                                <button className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100"><ChevronLeft className="h-3.5 w-3.5" /></button>
                                {[1, 2, 3, '...', 7].map((p, i) => (
                                    <button key={i} className={cn('flex h-6 w-6 items-center justify-center rounded text-xs', p === 1 ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>{p}</button>
                                ))}
                                <button className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100"><ChevronRight className="h-3.5 w-3.5" /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Detail Laporan (60%) */}
                <div className="min-w-0 flex-1">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                            <h2 className="text-base font-bold text-slate-900">Detail Laporan</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500">ID Laporan: <span className="font-bold text-slate-900">#{selected.id}</span></span>
                                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">{selected.status}</span>
                            </div>
                        </div>

                        <div className="p-5">
                            {/* Grid: Photo+Info+Desc+Catatan (3/5) | AI Summary (2/5) */}
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
                                {/* Left: Photo + Info + Deskripsi + Catatan */}
                                <div className="lg:col-span-3 space-y-4">
                                    <div className="rounded-lg border border-slate-100 p-3">
                                        <img src={selected.foto} alt={selected.judul} className="h-48 w-full rounded-lg object-cover" />
                                        <div className="mt-2 grid grid-cols-4 gap-1.5">
                                            {selected.fotoAll.slice(1).map((f, i) => (
                                                <img key={i} src={f} alt="" className="h-14 w-full rounded object-cover" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-slate-100 p-4">
                                        <h4 className="mb-3 text-sm font-bold text-slate-900">Informasi Laporan</h4>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                                            {[['Jenis Bencana', selected.jenis], ['Lokasi', selected.lokasi], ['Koordinat', selected.koordinat], ['Waktu Laporan', selected.waktu], ['Pelapor', selected.pelapor], ['Sumber', selected.sumber]].map(([l, v]) => (
                                                <div key={l}><dt className="text-xs text-slate-500">{l}</dt><dd className="text-sm font-medium text-slate-900">{v}</dd></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-slate-100 p-4">
                                        <h4 className="mb-2 text-sm font-bold text-slate-900">Deskripsi Laporan</h4>
                                        <p className="text-sm leading-relaxed text-slate-700">{selected.deskripsi}</p>
                                    </div>
                                </div>
                                <div className="lg:col-span-2">
                                    <div className="rounded-lg border border-slate-100 p-4 space-y-3">
                                        <h4 className="text-sm font-bold text-slate-900">Ringkasan Hasil Analisis AI</h4>
                                        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                                            <p className="text-xs font-bold text-blue-700 mb-1.5">NLP Analysis</p>
                                            <div className="space-y-1 text-xs">
                                                <div className="flex justify-between"><span className="text-slate-500">Prediksi Jenis Bencana</span><span className="font-medium">: {selected.nlp.prediksi}</span></div>
                                                <div className="flex justify-between"><span className="text-slate-500">Confidence Score</span><span className="font-medium">: {selected.nlp.confidence}%</span></div>
                                            </div>
                                            <p className="mt-2 text-xs text-slate-500">Keyword Utama</p>
                                            <div className="mt-1 flex flex-wrap gap-1">{selected.nlp.keywords.map((k) => <span key={k} className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700">{k}</span>)}</div>
                                        </div>
                                        <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-3">
                                            <p className="text-xs font-bold text-purple-700 mb-1.5">Computer Vision</p>
                                            <p className="text-xs text-slate-500 mb-1">Objek Terdeteksi</p>
                                            <div className="space-y-1">{selected.cv.map((o) => <div key={o.label} className="flex items-center justify-between text-xs"><span className="text-slate-700">{o.label}</span><span className="font-medium">{o.score}</span></div>)}</div>
                                        </div>
                                        <div className="rounded-lg border border-red-100 bg-red-50/50 p-3">
                                            <p className="text-xs font-bold text-red-700 mb-1.5">Risk Assessment</p>
                                            <div className="space-y-1 text-xs">
                                                <div className="flex justify-between"><span className="text-slate-600">Risk Score</span><span className="font-bold">: {selected.risk_score} / 100</span></div>
                                                <div className="flex justify-between"><span className="text-slate-600">Severity</span><span className="font-bold text-red-600">: {selected.severity}</span></div>
                                                <div className="flex justify-between"><span className="text-slate-600">Zona Rawan</span><span className="font-bold text-red-600">: {selected.zona_rawan}</span></div>
                                            </div>
                                            <p className="mt-2 text-xs text-slate-600"><span className="font-medium">Rekomendasi AI</span> : {selected.rekomendasi}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Catatan Petugas — full width */}
                            <div className="mt-5 rounded-lg border border-slate-100 p-4">
                                <h4 className="mb-2 text-sm font-bold text-slate-900">Catatan Petugas (Opsional)</h4>
                                <textarea placeholder="Tulis catatan atau hasil observasi..." className="h-20 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                                <p className="mt-1 text-right text-xs text-slate-400">0 / 500</p>
                            </div>

                            {/* Keputusan Validasi */}
                            <div className="mt-5 border-t border-slate-200 pt-5">
                                <h4 className="mb-3 text-sm font-bold text-slate-900">Keputusan Validasi</h4>
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                    <button className="cursor-pointer flex flex-col items-center gap-1.5 rounded-xl border-2 border-green-300 bg-green-50 p-4 text-center transition-all hover:bg-green-100 hover:shadow-md">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                        <span className="text-sm font-bold text-green-700">VALID</span>
                                        <span className="text-[10px] text-green-600">Laporan benar dan dapat ditindaklanjuti</span>
                                    </button>
                                    <button className="cursor-pointer flex flex-col items-center gap-1.5 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-center transition-all hover:bg-amber-100 hover:shadow-md">
                                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                                        <span className="text-sm font-bold text-amber-700">PERLU CEK LAPANGAN</span>
                                        <span className="text-[10px] text-amber-600">Butuh verifikasi lapangan lebih lanjut</span>
                                    </button>
                                    <button className="cursor-pointer flex flex-col items-center gap-1.5 rounded-xl border-2 border-red-300 bg-red-50 p-4 text-center transition-all hover:bg-red-100 hover:shadow-md">
                                        <XCircle className="h-6 w-6 text-red-600" />
                                        <span className="text-sm font-bold text-red-700">TIDAK VALID (HOAKS)</span>
                                        <span className="text-[10px] text-red-600">Laporan tidak benar / hoaks</span>
                                    </button>
                                    <button className="cursor-pointer flex flex-col items-center gap-1.5 rounded-xl border-2 border-purple-300 bg-purple-50 p-4 text-center transition-all hover:bg-purple-100 hover:shadow-md">
                                        <Copy className="h-6 w-6 text-purple-600" />
                                        <span className="text-sm font-bold text-purple-700">DUPLIKAT</span>
                                        <span className="text-[10px] text-purple-600">Laporan sudah ada / berulang</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
