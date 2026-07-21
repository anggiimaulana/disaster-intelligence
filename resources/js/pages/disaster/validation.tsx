import { Head, usePage, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/disaster/sparkline';
import {
    AlertTriangle,
    Brain,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Copy,
    Eye,
    FileText,
    MapPin,
    Search,
    XCircle,
    X,
    Loader2,
    CheckCircle2,
    Image as ImageIcon,
    ExternalLink,
} from 'lucide-react';

interface PageProps {
    [key: string]: unknown;
    laporan: {
        data: Array<{
            id: number;
            kode_laporan: string;
            judul: string;
            alamat: string;
            kecamatan: string;
            latitude: number;
            longitude: number;
            tingkat_keparahan: string;
            deskripsi: string;
            created_at: string;
            validasi_ai: boolean;
            validasi_admin: boolean;
            jenis_bencana: {
                id: number;
                kode: string;
                nama_bencana: string;
                warna: string;
            };
            status: {
                id: number;
                nama_status: string;
                warna: string;
            };
        }>;
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
            from: number;
            to: number;
        };
    };
    stats: {
        menunggu: number;
        diproses: number;
        warning: number;
        darurat: number;
        selesai: number;
        ditolak: number;
    };
    filters: Record<string, string>;
    filterOptions: {
        jenisBencana: Array<{
            id: number;
            kode: string;
            nama_bencana: string;
            warna: string;
        }>;
    };
}

const RISK_COLORS: Record<string, string> = {
    Rendah: 'bg-green-100 text-green-700',
    Sedang: 'bg-yellow-100 text-yellow-700',
    Tinggi: 'bg-orange-100 text-orange-700',
    Darurat: 'bg-red-100 text-red-700',
};

export default function Validation() {
    const { laporan, stats, filters, filterOptions } = usePage<PageProps>().props;

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedReport, setSelectedReport] = useState<typeof laporan.data[0] | null>(null);
    const [validationResult, setValidationResult] = useState<{
        hasil: string;
        catatan: string;
    } | null>(null);
    const validateForm = useForm<{ catatan: string }>({ catatan: '' });

    // Select first report by default
    useEffect(() => {
        if (laporan.data.length > 0 && !selectedId) {
            setSelectedId(laporan.data[0].id);
            setSelectedReport(laporan.data[0]);
        }
    }, [laporan.data]);

    const handleSelectReport = (report: typeof laporan.data[0]) => {
        setSelectedId(report.id);
        setSelectedReport(report);
        setValidationResult(null);
        validateForm.reset();
        validateForm.clearErrors();
    };

    const handleValidate = (hasil: string) => {
        if (!selectedId) return;

        validateForm.setData('catatan', validateForm.data.catatan);
        router.post(`/cms/validation/${selectedId}`, {
            hasil_validasi: hasil,
            catatan: validateForm.data.catatan,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                setValidationResult({ hasil, catatan: validateForm.data.catatan });
                const updatedLaporan = (page.props as any).laporan;
                const updatedReport = updatedLaporan?.data?.find((r: any) => r.id === selectedId);
                if (updatedReport) {
                    setSelectedReport(updatedReport);
                }
            },
            onError: () => {
                window.alert('Gagal menyimpan validasi. Periksa isian Anda.');
            },
        });
    };

    const handleStatusChange = (statusId: number) => {
        if (!selectedId) return;

        router.patch(`/cms/validation/${selectedId}/status`, {
            status_id: statusId,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const updatedLaporan = (page.props as any).laporan;
                const updatedReport = updatedLaporan?.data?.find((r: any) => r.id === selectedId);
                if (updatedReport) {
                    setSelectedReport(updatedReport);
                }
            },
        });
    };

    const statsData = [
        { title: 'MENUNGGU', value: stats.menunggu, color: 'bg-amber-500', sparkColor: '#F59E0B' },
        { title: 'DIPROSES', value: stats.diproses, color: 'bg-blue-500', sparkColor: '#3B82F6' },
        { title: 'WARNING', value: stats.warning, color: 'bg-orange-500', sparkColor: '#F97316' },
        { title: 'SELESAI', value: stats.selesai, color: 'bg-green-500', sparkColor: '#22C55E' },
        { title: 'DITOLAK', value: stats.ditolak, color: 'bg-red-500', sparkColor: '#EF4444' },
    ];

    return (
        <>
            <Head title="Validasi Laporan" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                {statsData.map((s) => (
                    <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg text-white', s.color)}>
                                <Clock className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-[10px] font-bold uppercase text-slate-500">{s.title}</p>
                        <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Split View */}
            <div className="mt-5 mb-5 flex flex-col gap-5 lg:flex-row">
                {/* LEFT — Daftar Laporan */}
                <div className="w-full flex-shrink-0 lg:w-[30%]">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-4 py-3">
                            <h2 className="text-base font-bold text-slate-900">Daftar Laporan Menunggu Validasi</h2>
                            <p className="text-xs text-slate-500 mt-1">{laporan.meta.total} laporan</p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-2.5">
                            <select
                                className="h-8 rounded-lg border border-slate-200 px-2 text-sm focus:border-blue-500 focus:outline-none"
                                onChange={(e) => router.get('/cms/validation', { jenis_bencana_id: e.target.value }, { preserveState: true })}
                                value={filters.jenis_bencana_id || ''}
                            >
                                <option value="">Semua Jenis</option>
                                {filterOptions.jenisBencana.map((j) => (
                                    <option key={j.id} value={j.id}>{j.nama_bencana}</option>
                                ))}
                            </select>
                        </div>

                        {/* List */}
                        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                            {laporan.data.length === 0 ? (
                                <div className="px-4 py-8 text-center text-slate-500">
                                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>Tidak ada laporan menunggu validasi</p>
                                </div>
                            ) : (
                                laporan.data.map((r) => (
                                    <button
                                        key={r.id}
                                        onClick={() => handleSelectReport(r)}
                                        className={cn(
                                            'w-full px-4 py-3 text-left transition-colors',
                                            selectedId === r.id
                                                ? 'bg-blue-50 border-l-4 border-l-blue-600'
                                                : 'hover:bg-slate-50'
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono text-slate-500">{r.kode_laporan}</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 truncate">{r.judul}</p>
                                                <p className="mt-0.5 text-xs text-slate-500 flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {r.kecamatan}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {new Date(r.created_at).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span
                                                    className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', RISK_COLORS[r.tingkat_keparahan])}
                                                >
                                                    {r.tingkat_keparahan}
                                                </span>
                                                <span
                                                    className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                                                    style={{ backgroundColor: r.jenis_bencana.warna }}
                                                >
                                                    {r.jenis_bencana.nama_bencana}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {laporan.meta.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
                                <p className="text-xs text-slate-500">
                                    Menampilkan {laporan.meta.from} - {laporan.meta.to} dari {laporan.meta.total}
                                </p>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => router.get('/cms/validation', { page: laporan.meta.current_page - 1 }, { preserveState: true })}
                                        disabled={laporan.meta.current_page === 1}
                                        className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" />
                                    </button>
                                    {Array.from({ length: Math.min(5, laporan.meta.last_page) }, (_, i) => {
                                        let page = i + 1;
                                        if (laporan.meta.last_page > 5) {
                                            const current = laporan.meta.current_page;
                                            if (current > 3) {
                                                page = current - 2 + i;
                                            }
                                            if (current > laporan.meta.last_page - 2) {
                                                page = laporan.meta.last_page - 4 + i;
                                            }
                                        }
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => router.get('/cms/validation', { page }, { preserveState: true })}
                                                className={cn(
                                                    'flex h-6 w-6 items-center justify-center rounded text-xs',
                                                    page === laporan.meta.current_page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-slate-600 hover:bg-slate-100'
                                                )}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => router.get('/cms/validation', { page: laporan.meta.current_page + 1 }, { preserveState: true })}
                                        disabled={laporan.meta.current_page === laporan.meta.last_page}
                                        className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                                    >
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT — Detail Laporan */}
                <div className="min-w-0 flex-1">
                    {selectedReport ? (
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Detail Laporan</h2>
                                    <p className="text-xs text-slate-500">{selectedReport.kode_laporan}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={`https://www.google.com/maps?q=${selectedReport.latitude},${selectedReport.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        Lihat Peta
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            </div>

                            <div className="p-5">
                                {/* Report Info */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-slate-900">{selectedReport.judul}</h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <span
                                            className="rounded-full px-3 py-1 text-sm font-medium text-white"
                                            style={{ backgroundColor: selectedReport.jenis_bencana.warna }}
                                        >
                                            {selectedReport.jenis_bencana.nama_bencana}
                                        </span>
                                        <span className={cn('rounded-full px-3 py-1 text-sm font-medium', RISK_COLORS[selectedReport.tingkat_keparahan])}>
                                            {selectedReport.tingkat_keparahan}
                                        </span>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg border border-slate-100 p-4">
                                    <div>
                                        <dt className="text-xs text-slate-500">Lokasi</dt>
                                        <dd className="text-sm font-medium text-slate-900">{selectedReport.alamat}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-500">Kecamatan</dt>
                                        <dd className="text-sm font-medium text-slate-900">{selectedReport.kecamatan}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-500">Koordinat</dt>
                                        <dd className="text-sm font-medium text-slate-900">
                                            {selectedReport.latitude}, {selectedReport.longitude}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-500">Waktu Laporan</dt>
                                        <dd className="text-sm font-medium text-slate-900">
                                            {new Date(selectedReport.created_at).toLocaleString('id-ID')}
                                        </dd>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-4 rounded-lg border border-slate-100 p-4">
                                    <h4 className="mb-2 text-sm font-bold text-slate-900">Deskripsi</h4>
                                    <p className="text-sm leading-relaxed text-slate-700">{selectedReport.deskripsi}</p>
                                </div>

                                {/* AI Analysis */}
                                <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Brain className="h-4 w-4 text-blue-600" />
                                        <h4 className="text-sm font-bold text-blue-700">Analisis AI</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-blue-600">Validasi AI:</span>
                                            <span className={selectedReport.validasi_ai ? 'text-green-600' : 'text-slate-400'}>
                                                {selectedReport.validasi_ai ? 'Completed' : 'Pending'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-blue-600">Validasi Admin:</span>
                                            <span className={selectedReport.validasi_admin ? 'text-green-600' : 'text-slate-400'}>
                                                {selectedReport.validasi_admin ? 'Completed' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="mb-4 rounded-lg border border-slate-100 p-4">
                                    <h4 className="mb-2 text-sm font-bold text-slate-900">Catatan Petugas</h4>
                                    <textarea
                                        value={validateForm.data.catatan}
                                        onChange={(e) => validateForm.setData('catatan', e.target.value)}
                                        placeholder="Tulis catatan atau hasil observasi..."
                                        className="h-20 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                    {validateForm.errors.catatan && (
                                        <p className="mt-1 text-xs text-red-600">{validateForm.errors.catatan}</p>
                                    )}
                                </div>

                                {/* Validation Result */}
                                {validationResult && (
                                    <div className={cn(
                                        'mb-4 rounded-lg p-4',
                                        validationResult.hasil === 'valid' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                                    )}>
                                        <div className="flex items-center gap-2">
                                            {validationResult.hasil === 'valid' ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-600" />
                                            )}
                                            <span className={validationResult.hasil === 'valid' ? 'text-green-700' : 'text-red-700'}>
                                                Laporan telah divalidasi: <strong>{validationResult.hasil.toUpperCase()}</strong>
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Validation Actions */}
                                <div className="border-t border-slate-200 pt-5">
                                    <h4 className="mb-3 text-sm font-bold text-slate-900">Keputusan Validasi</h4>
                                    {!selectedReport.validasi_ai && (
                                        <p className="mb-3 text-xs text-amber-600">
                                            Tunggu analisis AI selesai sebelum melakukan validasi.
                                        </p>
                                    )}
                                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                        <button
                                            onClick={() => handleValidate('valid')}
                                            disabled={validateForm.processing || !selectedReport.validasi_ai}
                                            className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-green-300 bg-green-50 p-4 text-center transition-all hover:bg-green-100 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <CheckCircle className="h-6 w-6 text-green-600" />
                                            <span className="text-sm font-bold text-green-700">VALID</span>
                                            <span className="text-[10px] text-green-600">Laporan benar dan dapat ditindaklanjuti</span>
                                        </button>
                                        <button
                                            onClick={() => handleValidate('invalid')}
                                            disabled={validateForm.processing || !selectedReport.validasi_ai}
                                            className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-red-300 bg-red-50 p-4 text-center transition-all hover:bg-red-100 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <XCircle className="h-6 w-6 text-red-600" />
                                            <span className="text-sm font-bold text-red-700">TIDAK VALID</span>
                                            <span className="text-[10px] text-red-600">Laporan tidak benar / hoaks</span>
                                        </button>
                                        <button
                                            onClick={() => handleValidate('spam')}
                                            disabled={validateForm.processing || !selectedReport.validasi_ai}
                                            className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-center transition-all hover:bg-amber-100 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <AlertTriangle className="h-6 w-6 text-amber-600" />
                                            <span className="text-sm font-bold text-amber-700">SPAM</span>
                                            <span className="text-[10px] text-amber-600">Laporan spam / tidak relevan</span>
                                        </button>
                                        <button
                                            onClick={() => handleValidate('duplikat')}
                                            disabled={validateForm.processing || !selectedReport.validasi_ai}
                                            className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-purple-300 bg-purple-50 p-4 text-center transition-all hover:bg-purple-100 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Copy className="h-6 w-6 text-purple-600" />
                                            <span className="text-sm font-bold text-purple-700">DUPLIKAT</span>
                                            <span className="text-[10px] text-purple-600">Laporan sudah ada / berulang</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Status Update */}
                                {selectedReport.validasi_ai && (
                                    <div className="mt-5 border-t border-slate-200 pt-5">
                                        <h4 className="mb-3 text-sm font-bold text-slate-900">Update Status</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleStatusChange(2)}
                                                className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm text-blue-700 hover:bg-blue-100"
                                            >
                                                Diproses
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(3)}
                                                className="rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-sm text-orange-700 hover:bg-orange-100"
                                            >
                                                Warning
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(4)}
                                                className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                                            >
                                                Darurat
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(5)}
                                                className="rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                                            >
                                                Selesai
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {validateForm.processing && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Menyimpan validasi...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-slate-500">
                            <div className="text-center">
                                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <p>Pilih laporan untuk melihat detail</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
