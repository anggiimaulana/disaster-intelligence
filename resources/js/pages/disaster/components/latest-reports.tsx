import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { FileText, MapPin } from 'lucide-react';
import type { ReportSummary, RiskLevel } from '@/types';

const riskStyles: Record<RiskLevel, { bg: string; text: string; label: string }> = {
    TINGGI: { bg: 'bg-red-500', text: 'text-white', label: 'WARNING' },
    SEDANG: { bg: 'bg-amber-500', text: 'text-white', label: 'SEDANG' },
    RENDAH: { bg: 'bg-green-500', text: 'text-white', label: 'RENDAH' },
    AMAN: { bg: 'bg-slate-400', text: 'text-white', label: 'AMAN' },
};

const riskLabel: Record<RiskLevel, string> = {
    TINGGI: 'Tinggi',
    SEDANG: 'Sedang',
    RENDAH: 'Rendah',
    AMAN: 'Aman',
};

import { RiskBadge } from '@/components/disaster/risk-badge';

export function LatestReports({ reports }: { reports: ReportSummary[] }) {
    return (
        <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">LAPORAN TERBARU</h3>
                <Link href="/cms/incidents" className="text-sm font-medium text-blue-600 hover:underline">Lihat semua</Link>
            </div>

            <div className="flex-1 divide-y divide-slate-100 overflow-y-auto">
                {reports.map((report) => (
                    <Link key={report.id} href={`/cms/incidents/${report.id}`} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                            <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900 truncate">{report.judul}</p>
                            <p className="flex items-center gap-1 text-xs text-slate-500">
                                <MapPin className="h-3 w-3 text-slate-400" /> {report.kecamatan}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{report.waktu}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <RiskBadge level={report.risk_level} />
                        </div>
                    </Link>
                ))}
                {reports.length === 0 && (
                    <div className="px-5 py-8 text-center text-sm text-slate-400">Belum ada laporan terbaru</div>
                )}
            </div>
        </div>
    );
}
