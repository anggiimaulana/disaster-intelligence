import { Head, Link, router } from '@inertiajs/react';
import { Brain, Cpu, Search, CheckCircle2, AlertTriangle, ArrowRight, Activity, Filter, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface ReportItem {
    id: string;
    kode_laporan: string;
    judul: string;
    kecamatan: string;
    jenis_bencana: string;
    jenis_warna: string;
    tingkat_keparahan: string;
    confidence_score: number;
    validasi_ai: boolean;
    keywords: string[];
    created_at: string;
}

interface AnalysisProps {
    reports: {
        data: ReportItem[];
        meta: {
            current_page: number;
            last_page: number;
            total: number;
            per_page: number;
        };
    };
    summary?: {
        total_analyzed: number;
        high_risk: number;
        avg_confidence: number;
        ai_provider: string;
        ai_model: string;
        min_confidence: number;
    };
    filters: {
        q?: string;
        tingkat_keparahan?: string;
    };
}

const SEVERITY_BADGES: Record<string, string> = {
    Darurat: 'bg-red-100 text-red-700 border-red-200',
    Tinggi: 'bg-orange-100 text-orange-700 border-orange-200',
    Sedang: 'bg-amber-100 text-amber-700 border-amber-200',
    Rendah: 'bg-green-100 text-green-700 border-green-200',
};

export default function Analysis({ reports, summary, filters }: AnalysisProps) {
    const [search, setSearch] = useState(filters?.q || '');
    const [severity, setSeverity] = useState(filters?.tingkat_keparahan || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/cms/analysis', { q: search, tingkat_keparahan: severity }, { preserveState: true });
    };

    return (
        <>
            <Head title="Analisis AI Disaster Intelligence" />

            <div className="space-y-6 pb-10">
                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 mb-1">
                            <Sparkles className="h-3.5 w-3.5" /> Engine: {summary?.ai_provider ?? '-'} ({summary?.ai_model ?? '-'})
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Analisis AI & Prediksi Risiko</h1>
                        <p className="text-sm text-slate-500">Hasil klasifikasi NLP, evaluasi tingkat keparahan, dan prediksi lokasi kebencanaan.</p>
                    </div>

                    <Link
                        href="/cms/settings/system?tab=ai"
                        className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors shadow-sm w-fit"
                    >
                        <Cpu className="h-4 w-4" />
                        Pengaturan Model AI
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">Total Teranalisis</span>
                            <Brain className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="mt-3 text-2xl font-extrabold text-slate-900">{summary?.total_analyzed ?? 0}</p>
                        <p className="mt-1 text-xs text-slate-500">Laporan terproses otomatis</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">Risiko Tinggi / Darurat</span>
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                        </div>
                        <p className="mt-3 text-2xl font-extrabold text-red-600">{summary?.high_risk ?? 0}</p>
                        <p className="mt-1 text-xs text-slate-500">Memerlukan atensi penanganan</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">Rata-Rata Confidence</span>
                            <Activity className="h-5 w-5 text-emerald-600" />
                        </div>
                        <p className="mt-3 text-2xl font-extrabold text-emerald-600">{summary?.avg_confidence ?? 0}%</p>
                        <p className="mt-1 text-xs text-slate-500">Tingkat kepastian prediksi AI</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">Ambang Batas Minim</span>
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="mt-3 text-2xl font-extrabold text-blue-600">{summary?.min_confidence ?? 0}%</p>
                        <p className="mt-1 text-xs text-slate-500">Nilai verifikasi otomatis</p>
                    </div>
                </div>

                {/* Filter & Search */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari kode laporan, judul, atau alamat..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                value={severity}
                                onChange={(e) => setSeverity(e.target.value)}
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="">Semua Keparahan</option>
                                <option value="Darurat">Darurat</option>
                                <option value="Tinggi">Tinggi</option>
                                <option value="Sedang">Sedang</option>
                                <option value="Rendah">Rendah</option>
                            </select>

                            <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                            >
                                <Filter className="h-4 w-4" /> Filter
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table list */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-5 py-3.5">Kode / Judul Laporan</th>
                                    <th className="px-5 py-3.5">Jenis Bencana</th>
                                    <th className="px-5 py-3.5">Akurasi AI</th>
                                    <th className="px-5 py-3.5">Tingkat Keparahan</th>
                                    <th className="px-5 py-3.5">Kata Kunci Utama</th>
                                    <th className="px-5 py-3.5 text-right">Aksi Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reports.data.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-slate-900">{report.judul}</div>
                                            <div className="text-xs font-mono text-slate-400 mt-0.5">{report.kode_laporan} • Kec. {report.kecamatan}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: report.jenis_warna + '20', color: report.jenis_warna }}>
                                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: report.jenis_warna }}></span>
                                                {report.jenis_bencana}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${Math.min(100, report.confidence_score)}%` }}></div>
                                                </div>
                                                <span className="font-bold text-slate-900 text-xs">{report.confidence_score}%</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${SEVERITY_BADGES[report.tingkat_keparahan] || SEVERITY_BADGES.Rendah}`}>
                                                {report.tingkat_keparahan}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {report.keywords?.filter(Boolean).slice(0, 3).map((kw, i) => (
                                                    <span key={i} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 font-medium">
                                                        #{String(kw).trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Link
                                                href={`/cms/incidents/${report.kode_laporan}/analysis`}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline"
                                            >
                                                Analisis Lengkap <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {reports.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                                            Tidak ditemukan data analisis AI.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
