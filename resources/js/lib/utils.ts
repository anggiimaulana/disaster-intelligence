import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function formatDate(dateString: string, pattern: 'short' | 'long' | 'time' = 'long'): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions =
        pattern === 'short'
            ? { day: 'numeric', month: 'short', year: 'numeric' }
            : pattern === 'time'
              ? { hour: '2-digit', minute: '2-digit', hour12: false }
              : { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
    return date.toLocaleDateString('id-ID', options) + ' WIB';
}

export function getRiskHex(level: string): string {
    const map: Record<string, string> = { TINGGI: '#EF4444', SEDANG: '#F59E0B', RENDAH: '#22C55E', AMAN: '#94A3B8' };
    return map[level] ?? '#94A3B8';
}

export function getDisasterLabel(type: string): string {
    const map: Record<string, string> = { BANJIR: 'Banjir', LONGSOR: 'Longsor', KEBAKARAN: 'Kebakaran', ANGIN_KENCANG: 'Angin Kencang', LAINNYA: 'Lainnya' };
    return map[type] ?? type;
}

export function generatePageNumbers(current: number, total: number): (number | '...')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
}
