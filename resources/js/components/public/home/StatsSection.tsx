import { AlertTriangle, MapPin, Activity, Users } from 'lucide-react';
import type { PublicStats } from '@/types/public-disaster';

interface StatsSectionProps {
    stats: PublicStats;
}

const statItems = [
    { key: 'reportsToday', label: 'Laporan Hari Ini', icon: AlertTriangle, color: 'bg-red-500' },
    { key: 'activeWarnings', label: 'Peringatan Aktif', icon: MapPin, color: 'bg-amber-500' },
    { key: 'highRiskZones', label: 'Zona Risiko Tinggi', icon: Activity, color: 'bg-orange-500' },
    { key: 'citizenParticipation', label: 'Partisipasi Warga', icon: Users, color: 'bg-blue-500' },
] as const;

export default function StatsSection({ stats }: StatsSectionProps) {
    return (
        <section className="bg-white py-12 lg:py-16 border-b border-[#E5E7EB]">
            <div className="mx-auto max-w-[1240px] px-4 lg:px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {statItems.map(({ key, label, icon: Icon, color }) => (
                        <div
                            key={key}
                            className="flex flex-col items-center text-center rounded-2xl bg-[#F9FAFB] p-6 border border-[#E5E7EB]"
                        >
                            <div className={`${color} rounded-xl p-2.5 mb-3`}>
                                <Icon className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-2xl lg:text-3xl font-bold text-[#003366]">
                                {stats[key]}
                            </p>
                            <p className="text-xs lg:text-sm text-[#6B7280] mt-1">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
