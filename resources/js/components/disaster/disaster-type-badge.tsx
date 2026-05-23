import type { DisasterType } from '@/types';
import { cn } from '@/lib/utils';
import { Flame, Mountain, MoreHorizontal, Waves, Wind } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const disasterConfig: Record<DisasterType, { label: string; icon: LucideIcon; color: string }> = {
    BANJIR: { label: 'Banjir', icon: Waves, color: 'text-blue-600 bg-blue-50' },
    LONGSOR: { label: 'Longsor', icon: Mountain, color: 'text-amber-600 bg-amber-50' },
    KEBAKARAN: { label: 'Kebakaran', icon: Flame, color: 'text-red-600 bg-red-50' },
    ANGIN_KENCANG: { label: 'Angin Kencang', icon: Wind, color: 'text-green-600 bg-green-50' },
    LAINNYA: { label: 'Lainnya', icon: MoreHorizontal, color: 'text-purple-600 bg-purple-50' },
};

export function DisasterTypeBadge({ type, className }: { type: DisasterType; className?: string }) {
    const config = disasterConfig[type];
    const Icon = config.icon;
    return (
        <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium', config.color, className)}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
        </span>
    );
}
