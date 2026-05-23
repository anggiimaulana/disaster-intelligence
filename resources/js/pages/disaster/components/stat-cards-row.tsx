import { AlertTriangle, CheckCircle, Clock, FileText, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/disaster/sparkline';
import type { DashboardStats } from '@/types';

interface StatCardProps {
    title: string;
    value: number;
    subtitle: string;
    subtitleColor: string;
    icon: React.ReactNode;
    iconBg: string;
    sparkData: number[];
    sparkColor: string;
}

function StatCard({ title, value, subtitle, subtitleColor, icon, iconBg, sparkData, sparkColor }: StatCardProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-white', iconBg)}>
                    {icon}
                </div>
                <Sparkline data={sparkData} color={sparkColor} width={80} height={30} />
            </div>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">{title}</p>
            <p className="mt-0.5 text-2xl font-bold text-slate-900">{value}</p>
            <p className={cn('mt-0.5 text-[11px] font-medium', subtitleColor)}>{subtitle}</p>
        </div>
    );
}

export function StatCardsRow({ stats }: { stats: DashboardStats }) {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
            <StatCard title="Total Laporan" value={stats.totalLaporan} subtitle="+18 dari kemarin" subtitleColor="text-green-600" icon={<FileText className="h-4.5 w-4.5" />} iconBg="bg-blue-500" sparkData={stats.totalLaporanTrend} sparkColor="#3B82F6" />
            <StatCard title="Belum Diverifikasi" value={stats.belumDiverifikasi} subtitle={`${stats.belumDiverifikasiPct}% dari total`} subtitleColor="text-amber-600" icon={<Clock className="h-4.5 w-4.5" />} iconBg="bg-amber-500" sparkData={stats.belumDiverifikasiTrend} sparkColor="#F59E0B" />
            <StatCard title="Warning Aktif" value={stats.warningAktif} subtitle="Waspada Tinggi" subtitleColor="text-red-600" icon={<AlertTriangle className="h-4.5 w-4.5" />} iconBg="bg-red-500" sparkData={stats.warningAktifTrend} sparkColor="#EF4444" />
            <StatCard title="Laporan Valid" value={stats.laporanValid} subtitle={`${stats.laporanValidPct}% dari total`} subtitleColor="text-green-600" icon={<CheckCircle className="h-4.5 w-4.5" />} iconBg="bg-green-500" sparkData={stats.laporanValidTrend} sparkColor="#22C55E" />
            <StatCard title="Pengirim Laporan" value={stats.pengirimLaporan} subtitle="Unik hari ini" subtitleColor="text-slate-500" icon={<Users className="h-4.5 w-4.5" />} iconBg="bg-purple-500" sparkData={stats.pengirimLaporanTrend} sparkColor="#8B5CF6" />
        </div>
    );
}
