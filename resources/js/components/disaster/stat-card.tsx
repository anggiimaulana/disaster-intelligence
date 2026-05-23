import { cn } from '@/lib/utils';
import { Sparkline } from './sparkline';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    subtitleColor?: 'green' | 'red' | 'amber' | 'default';
    icon: React.ReactNode;
    iconBgColor: string;
    sparklineData?: number[];
    sparklineColor?: string;
}

export function StatCard({ title, value, subtitle, subtitleColor = 'default', icon, iconBgColor, sparklineData, sparklineColor = '#3B82F6' }: StatCardProps) {
    const subtitleColors = { green: 'text-green-600', red: 'text-red-600', amber: 'text-amber-600', default: 'text-slate-500' };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-white', iconBgColor)}>{icon}</div>
                        {sparklineData && <Sparkline data={sparklineData} color={sparklineColor} height={32} />}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{title}</p>
                    <p className="text-xl font-bold text-slate-900">{value}</p>
                    {subtitle && <p className={cn('mt-1 text-xs', subtitleColors[subtitleColor])}>{subtitle}</p>}
                </div>
            </div>
        </div>
    );
}
