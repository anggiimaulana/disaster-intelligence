export function Sparkline({ data, color = '#3B82F6', height = 32, width = 80 }: { data?: number[] | null; color?: string; height?: number; width?: number }) {
    if (!data || !Array.isArray(data) || data.length < 2) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    });
    return (
        <svg width={width} height={height} className="flex-shrink-0" aria-hidden="true">
            <path d={`M ${points.join(' L ')}`} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

