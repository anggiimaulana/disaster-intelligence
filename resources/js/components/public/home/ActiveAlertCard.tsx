import { AlertTriangle, Droplets, Wind, Flame, Mountain, HelpCircle, Clock } from 'lucide-react';
import type { PublicAlert } from '@/types/public-disaster';

const DISASTER_ICONS: Record<string, React.ElementType> = {
    BANJIR: Droplets,
    ANGIN_KENCANG: Wind,
    KEBAKARAN: Flame,
    LONGSOR: Mountain,
    LAINNYA: HelpCircle,
};

const RISK_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    TINGGI: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
    SEDANG: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
    RENDAH: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
};

interface ActiveAlertCardProps {
    alert: PublicAlert;
    variant?: 'compact' | 'full';
}

export default function ActiveAlertCard({ alert, variant = 'full' }: ActiveAlertCardProps) {
    const Icon = DISASTER_ICONS[alert.disasterType] ?? HelpCircle;
    const colors = RISK_COLORS[alert.riskLevel] ?? RISK_COLORS.RENDAH;

    if (variant === 'compact') {
        return (
            <div className={`rounded-xl border ${colors.border} ${colors.bg} p-4 backdrop-blur-sm`}>
                <div className="flex items-start gap-3">
                    <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${colors.dot} bg-opacity-20`}>
                        <Icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-[#1F2937]">{alert.title}</span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                                {alert.riskLevel}
                            </span>
                        </div>
                        <p className="text-xs text-[#4B5563] mt-0.5">
                            {alert.district} — {alert.village}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-xl border ${colors.border} ${colors.bg} p-5`}>
            <div className="flex items-start gap-3">
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${colors.dot} bg-opacity-20`}>
                    <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-[#1F2937]">{alert.title}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                            {alert.riskLevel}
                        </span>
                        {alert.status === 'AKTIF' && (
                            <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                AKTIF
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-[#4B5563] mt-1">
                        {alert.district} — {alert.village}
                    </p>
                    <p className="text-sm text-[#6B7280] mt-2">{alert.summary}</p>
                    {alert.recommendedAction && (
                        <div className="flex items-start gap-2 mt-3 text-xs text-[#4B5563]">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            <span>{alert.recommendedAction}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1 mt-3 text-xs text-[#9CA3AF]">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(alert.updatedAt).toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
