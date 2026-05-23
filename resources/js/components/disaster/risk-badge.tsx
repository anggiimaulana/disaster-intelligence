import type { RiskLevel } from '@/types';
import { cn } from '@/lib/utils';

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
    TINGGI: { label: 'Tinggi', className: 'bg-red-100 text-red-700 border-red-200' },
    SEDANG: { label: 'Sedang', className: 'bg-amber-100 text-amber-700 border-amber-200' },
    RENDAH: { label: 'Rendah', className: 'bg-green-100 text-green-700 border-green-200' },
    AMAN: { label: 'Aman', className: 'bg-gray-100 text-gray-600 border-gray-200' },
};

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
    const config = riskConfig[level];
    return (
        <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', config.className, className)}>
            {config.label}
        </span>
    );
}
