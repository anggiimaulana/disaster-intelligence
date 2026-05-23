import type { ReportStatus } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<ReportStatus, { label: string; className: string }> = {
    BARU: { label: 'Baru', className: 'bg-blue-100 text-blue-700' },
    MENUNGGU_VALIDASI: { label: 'Menunggu Validasi', className: 'bg-amber-100 text-amber-700' },
    VALID: { label: 'Valid', className: 'bg-green-100 text-green-700' },
    TIDAK_VALID: { label: 'Tidak Valid', className: 'bg-red-100 text-red-700' },
    DUPLIKAT: { label: 'Duplikat', className: 'bg-purple-100 text-purple-700' },
    HOAKS: { label: 'Hoaks', className: 'bg-gray-100 text-gray-600' },
    PERLU_CEK_LAPANGAN: { label: 'Perlu Cek Lapangan', className: 'bg-orange-100 text-orange-700' },
    DIPROSES: { label: 'Diproses', className: 'bg-cyan-100 text-cyan-700' },
    SEDANG_DIPROSES: { label: 'Sedang Diproses', className: 'bg-cyan-100 text-cyan-700' },
};

export function StatusBadge({ status, className }: { status: ReportStatus; className?: string }) {
    const config = statusConfig[status];
    return (
        <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', config.className, className)}>
            {config.label}
        </span>
    );
}
