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
    sparkData?: number[];
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

function getStatValue(field: unknown, fallbackValue?: unknown): number {
    if (typeof field === 'object' && field !== null && 'value' in field) {
        return Number((field as { value: unknown }).value) || 0;
    }
    if (typeof field === 'number') return field;
    if (typeof fallbackValue === 'number') return fallbackValue;
    return 0;
}

function getStatTrend(field: unknown, fallbackTrend?: unknown): number[] {
    if (typeof field === 'object' && field !== null && 'trend' in field && Array.isArray((field as { trend: unknown }).trend)) {
        return (field as { trend: number[] }).trend;
    }
    if (Array.isArray(fallbackTrend)) return fallbackTrend;
    return [];
}

function getStatPct(field: unknown, fallbackPct?: unknown): number {
    if (typeof field === 'object' && field !== null && 'pct' in field) {
        return Number((field as { pct: unknown }).pct) || 0;
    }
    if (typeof fallbackPct === 'number') return fallbackPct;
    return 0;
}

export function StatCardsRow({ stats }: { stats?: any }) {
    if (!stats) return null;

    const totalLaporanVal = getStatValue(stats.totalLaporan);
    const totalLaporanTrend = getStatTrend(stats.totalLaporan, stats.totalLaporanTrend);

    const belumDiverifikasiVal = getStatValue(stats.belumDiverifikasi);
    const belumDiverifikasiTrend = getStatTrend(stats.belumDiverifikasi, stats.belumDiverifikasiTrend);
    const belumDiverifikasiPct = getStatPct(stats.belumDiverifikasi, stats.belumDiverifikasiPct);

    const warningAktifVal = getStatValue(stats.warningAktif);
    const warningAktifTrend = getStatTrend(stats.warningAktif, stats.warningAktifTrend);

    const laporanValidVal = getStatValue(stats.laporanValid);
    const laporanValidTrend = getStatTrend(stats.laporanValid, stats.laporanValidTrend);
    const laporanValidPct = getStatPct(stats.laporanValid, stats.laporanValidPct);

    const pengirimLaporanVal = getStatValue(stats.pengirimLaporan);
    const pengirimLaporanTrend = getStatTrend(stats.pengirimLaporan, stats.pengirimLaporanTrend);

    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
            <StatCard title="Total Laporan" value={totalLaporanVal} subtitle="+18 dari kemarin" subtitleColor="text-green-600" icon={<FileText className="h-4.5 w-4.5" />} iconBg="bg-blue-500" sparkData={totalLaporanTrend} sparkColor="#3B82F6" />
            <StatCard title="Belum Diverifikasi" value={belumDiverifikasiVal} subtitle={`${belumDiverifikasiPct}% dari total`} subtitleColor="text-amber-600" icon={<Clock className="h-4.5 w-4.5" />} iconBg="bg-amber-500" sparkData={belumDiverifikasiTrend} sparkColor="#F59E0B" />
            <StatCard title="Warning Aktif" value={warningAktifVal} subtitle="Waspada Tinggi" subtitleColor="text-red-600" icon={<AlertTriangle className="h-4.5 w-4.5" />} iconBg="bg-red-500" sparkData={warningAktifTrend} sparkColor="#EF4444" />
            <StatCard title="Laporan Valid" value={laporanValidVal} subtitle={`${laporanValidPct}% dari total`} subtitleColor="text-green-600" icon={<CheckCircle className="h-4.5 w-4.5" />} iconBg="bg-green-500" sparkData={laporanValidTrend} sparkColor="#22C55E" />
            <StatCard title="Pengirim Laporan" value={pengirimLaporanVal} subtitle="Unik hari ini" subtitleColor="text-slate-500" icon={<Users className="h-4.5 w-4.5" />} iconBg="bg-purple-500" sparkData={pengirimLaporanTrend} sparkColor="#8B5CF6" />
        </div>
    );
}
