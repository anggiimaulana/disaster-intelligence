import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { DisasterTypeBadge } from '@/components/disaster/disaster-type-badge';
import { RiskBadge } from '@/components/disaster/risk-badge';
import { StatCard } from '@/components/disaster/stat-card';
import { Sparkline } from '@/components/disaster/sparkline';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, formatDate, generatePageNumbers, getDisasterLabel } from '@/lib/utils';
import { AlertTriangle, Calendar, CheckCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Clock, Copy, Download, Eye, FileText, Filter, Search } from 'lucide-react';
import type { KejadianIndexProps, ReportStatus } from '@/types';

const statusLabels: Record<string, string> = {
    BARU: 'Baru',
    MENUNGGU_VALIDASI: 'Menunggu Validasi',
    VALID: 'Valid',
    TIDAK_VALID: 'Tidak Valid',
    DUPLIKAT: 'Duplikat',
    HOAKS: 'Hoaks',
    PERLU_CEK_LAPANGAN: 'Perlu Cek Lapangan',
    DIPROSES: 'Diproses',
    SEDANG_DIPROSES: 'Sedang Diproses',
};

const statusStyles: Record<string, string> = {
    BARU: 'bg-blue-100 text-blue-700',
    MENUNGGU_VALIDASI: 'bg-amber-100 text-amber-700',
    VALID: 'bg-green-100 text-green-700',
    TIDAK_VALID: 'bg-red-100 text-red-700',
    DUPLIKAT: 'bg-purple-100 text-purple-700',
    HOAKS: 'bg-gray-100 text-gray-600',
    PERLU_CEK_LAPANGAN: 'bg-orange-100 text-orange-700',
    DIPROSES: 'bg-cyan-100 text-cyan-700',
    SEDANG_DIPROSES: 'bg-cyan-100 text-cyan-700',
};

export default function Incidents({ reports, stats, filters, filterOptions }: KejadianIndexProps) {
    // Local filter state (not submitted until button click)
    const [localFilters, setLocalFilters] = useState({
        tanggal_mulai: filters.tanggal_mulai || '',
        tanggal_selesai: filters.tanggal_selesai || '',
        jenis_bencana: filters.jenis_bencana || '',
        kabupaten: filters.kabupaten || '',
        kecamatan: filters.kecamatan || '',
        status: filters.status || '',
        q: filters.q || '',
    });

    const filteredKecamatan = localFilters.kabupaten
        ? (filterOptions.kabupatenKecamatanMap?.[localFilters.kabupaten] || [])
        : (filterOptions.kecamatanList?.map((k: any) => k.nama) || []);

    const updateLocal = (key: string, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const submitFilter = () => {
        router.get('/cms/incidents', { ...localFilters, page: '1' }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const goToPage = (page: number) => {
        router.get('/cms/incidents', { ...filters, page: String(page) }, { preserveState: true, preserveScroll: true });
    };

    const handleExport = (format: 'excel' | 'pdf') => {
        const params = new URLSearchParams(filters as Record<string, string>);
        params.set('format', format);
        window.open(`/cms/incidents/export?${params}`, '_blank');
    };

    const pageNumbers = generatePageNumbers(reports.meta.current_page, reports.meta.last_page);

    return (
        <div className="w-full min-w-0 max-w-full pb-10 overflow-x-hidden">
            <Head title="Data Kejadian" />

            {/* Filter Bar */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                    {/* Date Range */}
                    <div className="flex w-full flex-col gap-1 sm:w-auto">
                        <label className="text-[10px] font-medium text-slate-500">Rentang Tanggal</label>
                        <div className="flex items-center gap-1.5">
                            <div className="relative flex-1 sm:flex-none">
                                <Calendar className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="date"
                                    value={localFilters.tanggal_mulai}
                                    onChange={(e) => updateLocal('tanggal_mulai', e.target.value)}
                                    className="h-9 w-full rounded-lg border border-slate-200 pl-8 pr-2 text-[11px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:w-[130px]"
                                />
                            </div>
                            <span className="text-[10px] text-slate-400">—</span>
                            <div className="flex-1 sm:flex-none">
                                <input
                                    type="date"
                                    value={localFilters.tanggal_selesai}
                                    onChange={(e) => updateLocal('tanggal_selesai', e.target.value)}
                                    className="h-9 w-full rounded-lg border border-slate-200 px-2 text-[11px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:w-[130px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Jenis Bencana */}
                    <div className="flex w-full flex-col gap-1 sm:w-auto">
                        <label className="text-[10px] font-medium text-slate-500">Jenis Bencana</label>
                        <Select value={localFilters.jenis_bencana || 'all'} onValueChange={(v) => updateLocal('jenis_bencana', v === 'all' ? '' : v)}>
                            <SelectTrigger className="h-9 w-full text-[11px] sm:w-[140px]">
                                <SelectValue placeholder="Semua Jenis" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Jenis</SelectItem>
                                {filterOptions.jenisList.map((j) => <SelectItem key={j} value={j}>{getDisasterLabel(j)}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Kabupaten */}
                    <div className="flex w-full flex-col gap-1 sm:w-auto">
                        <label className="text-[10px] font-medium text-slate-500">Kabupaten/Kota</label>
                        <Select value={localFilters.kabupaten || 'all'} onValueChange={(v) => {
                            const val = v === 'all' ? '' : v;
                            setLocalFilters((prev) => ({ ...prev, kabupaten: val, kecamatan: '' }));
                        }}>
                            <SelectTrigger className="h-9 w-full text-[11px] sm:w-[160px]">
                                <SelectValue placeholder="Semua Kabupaten" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kabupaten</SelectItem>
                                {(filterOptions.kabupatenList || []).map((k: string) => (
                                    <SelectItem key={k} value={k}>{k}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Kecamatan */}
                    <div className="flex w-full flex-col gap-1 sm:w-auto">
                        <label className="text-[10px] font-medium text-slate-500">Kecamatan</label>
                        <Select value={localFilters.kecamatan || 'all'} onValueChange={(v) => updateLocal('kecamatan', v === 'all' ? '' : v)}>
                            <SelectTrigger className="h-9 w-full text-[11px] sm:w-[160px]">
                                <SelectValue placeholder="Semua Kecamatan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kecamatan</SelectItem>
                                {filteredKecamatan.map((k: string) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="flex w-full flex-col gap-1 sm:w-auto">
                        <label className="text-[10px] font-medium text-slate-500">Status</label>
                        <Select value={localFilters.status || 'all'} onValueChange={(v) => updateLocal('status', v === 'all' ? '' : v)}>
                            <SelectTrigger className="h-9 w-full text-[11px] sm:w-[150px]">
                                <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                {filterOptions.statusList.map((s) => <SelectItem key={s} value={s}>{statusLabels[s] ?? s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Search */}
                    <div className="flex w-full flex-col gap-1 sm:w-auto">
                        <label className="text-[10px] font-medium text-slate-500">Cari</label>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={localFilters.q}
                                onChange={(e) => updateLocal('q', e.target.value)}
                                placeholder="Cari laporan..."
                                className="h-9 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-[11px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:w-[160px]"
                                onKeyDown={(e) => e.key === 'Enter' && submitFilter()}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={submitFilter}
                        className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 text-[11px] font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto"
                    >
                        <Filter className="h-3.5 w-3.5" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                <MiniStatCard title="Total Laporan" value={stats.totalLaporan.value} subtitle={`+${stats.totalLaporan.delta} dari kemarin`} subtitleColor="text-green-600" icon={<FileText className="h-4 w-4" />} iconBg="bg-blue-500" sparkData={stats.totalLaporan.trend} sparkColor="#3B82F6" />
                <MiniStatCard title="Belum Diverifikasi" value={stats.belumDiverifikasi.value} subtitle={`${stats.belumDiverifikasi.pct}% dari total`} subtitleColor="text-amber-600" icon={<Clock className="h-4 w-4" />} iconBg="bg-amber-500" sparkData={stats.belumDiverifikasi.trend} sparkColor="#F59E0B" />
                <MiniStatCard title="Valid" value={stats.valid.value} subtitle={`${stats.valid.pct}% tervalidasi`} subtitleColor="text-green-600" icon={<CheckCircle className="h-4 w-4" />} iconBg="bg-green-500" sparkData={stats.valid.trend} sparkColor="#22C55E" />
                <MiniStatCard title="Warning" value={stats.warning.value} subtitle={stats.warning.label} subtitleColor="text-red-600" icon={<AlertTriangle className="h-4 w-4" />} iconBg="bg-red-500" sparkData={stats.warning.trend} sparkColor="#EF4444" />
                <MiniStatCard title="Duplikat / Lainnya" value={stats.duplikatLainnya.value} subtitle={`${stats.duplikatLainnya.pct}% dari total`} subtitleColor="text-slate-500" icon={<Copy className="h-4 w-4" />} iconBg="bg-purple-500" sparkData={stats.duplikatLainnya.trend} sparkColor="#8B5CF6" />
            </div>

            {/* Table Header */}
            <div className="mt-5 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">Daftar Laporan Kejadian</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => handleExport('excel')} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] text-slate-600 hover:bg-slate-50">
                        <Download className="h-3 w-3" /> Export Excel
                    </button>
                    <button onClick={() => handleExport('pdf')} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] text-slate-600 hover:bg-slate-50">
                        <Download className="h-3 w-3" /> Export PDF
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="mt-3 w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[800px] text-left text-xs">
                    <thead className="border-b border-slate-100 bg-slate-50">
                        <tr>
                            <th className="px-3 py-3 font-medium text-slate-500 w-10">#</th>
                            <th className="px-3 py-3 font-medium text-slate-500">ID Laporan</th>
                            <th className="px-3 py-3 font-medium text-slate-500">Jenis Bencana</th>
                            <th className="px-3 py-3 font-medium text-slate-500">Lokasi</th>
                            <th className="px-3 py-3 font-medium text-slate-500">Waktu Laporan</th>
                            <th className="px-3 py-3 font-medium text-slate-500">Pelapor</th>
                            <th className="px-3 py-3 font-medium text-slate-500">Status</th>
                            <th className="px-3 py-3 font-medium text-slate-500">Tingkat Risiko</th>
                            <th className="px-3 py-3 font-medium text-slate-500">Sumber</th>
                            <th className="px-3 py-3 font-medium text-slate-500">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {reports.data.map((report, idx) => (
                            <tr key={report.id} className="transition-colors hover:bg-slate-50">
                                <td className="px-3 py-3 text-slate-400">{(reports.meta.current_page - 1) * reports.meta.per_page + idx + 1}</td>
                                <td className="px-3 py-3 font-medium text-blue-600">{report.laporan_id}</td>
                                <td className="px-3 py-3"><DisasterTypeBadge type={report.jenis_bencana} /></td>
                                <td className="px-3 py-3">
                                    <p className="text-slate-900">{report.lokasi}</p>
                                    <p className="text-[10px] text-slate-500">{report.kecamatan}</p>
                                </td>
                                <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{formatDate(report.waktu_laporan, 'short')}</td>
                                <td className="px-3 py-3 text-slate-600">{report.pelapor}</td>
                                <td className="px-3 py-3">
                                    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium', statusStyles[report.status] ?? 'bg-slate-100 text-slate-600')}>
                                        {statusLabels[report.status] ?? report.status}
                                    </span>
                                </td>
                                <td className="px-3 py-3"><RiskBadge level={report.tingkat_risiko} /></td>
                                <td className="px-3 py-3">
                                    <span className="inline-flex items-center gap-1 rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700">WhatsApp</span>
                                </td>
                                <td className="px-3 py-3">
                                    <Link href={`/cms/incidents/${report.laporan_id.replace('#', '')}`} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-blue-600 hover:bg-blue-50">
                                        <Eye className="h-3.5 w-3.5" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {reports.data.length === 0 && (
                            <tr><td colSpan={10} className="px-4 py-12 text-center text-slate-400">Tidak ada data laporan yang sesuai filter</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 mb-5 flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:justify-between">
                <p className="text-xs text-slate-500 text-center sm:text-left">
                    Menampilkan {reports.meta.from ?? 0} - {reports.meta.to ?? 0} dari {reports.meta.total} data
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1">
                    <PgBtn onClick={() => goToPage(1)} disabled={reports.meta.current_page === 1}><ChevronsLeft className="h-3.5 w-3.5" /></PgBtn>
                    <PgBtn onClick={() => goToPage(reports.meta.current_page - 1)} disabled={reports.meta.current_page === 1}><ChevronLeft className="h-3.5 w-3.5" /></PgBtn>
                    {pageNumbers.map((p, i) => p === '...' ? <span key={`d${i}`} className="px-1 text-xs text-slate-400">...</span> : <PgBtn key={p} onClick={() => goToPage(Number(p))} active={p === reports.meta.current_page}>{p}</PgBtn>)}
                    <PgBtn onClick={() => goToPage(reports.meta.current_page + 1)} disabled={reports.meta.current_page === reports.meta.last_page}><ChevronRight className="h-3.5 w-3.5" /></PgBtn>
                    <PgBtn onClick={() => goToPage(reports.meta.last_page)} disabled={reports.meta.current_page === reports.meta.last_page}><ChevronsRight className="h-3.5 w-3.5" /></PgBtn>
                </div>
            </div>
        </div>
    );
}

function MiniStatCard({ title, value, subtitle, subtitleColor, icon, iconBg, sparkData, sparkColor }: {
    title: string; value: number; subtitle: string; subtitleColor: string;
    icon: React.ReactNode; iconBg: string; sparkData: number[]; sparkColor: string;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between">
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-white', iconBg)}>{icon}</div>
                <Sparkline data={sparkData} color={sparkColor} width={60} height={24} />
            </div>
            <p className="mt-2 text-[10px] font-medium text-slate-500">{title}</p>
            <p className="text-xl font-bold text-slate-900">{value}</p>
            <p className={cn('text-[10px]', subtitleColor)}>{subtitle}</p>
        </div>
    );
}

function PgBtn({ children, onClick, disabled, active }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) {
    return (
        <button onClick={onClick} disabled={disabled} className={cn('flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs transition-colors', active ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100', disabled && 'cursor-not-allowed opacity-40')}>
            {children}
        </button>
    );
}
