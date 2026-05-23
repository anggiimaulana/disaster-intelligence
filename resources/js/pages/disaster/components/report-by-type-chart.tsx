import type { DashboardProps } from '@/types';

export function ReportByTypeChart({ data }: { data: DashboardProps['laporanByJenis'] }) {
    const total = data.reduce((s, d) => s + d.count, 0);

    // Donut chart math
    const radius = 55;
    const cx = 70;
    const cy = 70;
    const strokeWidth = 20;
    const circumference = 2 * Math.PI * radius;

    let offset = 0;
    const segments = data.map((item) => {
        const pct = total > 0 ? item.count / total : 0;
        const dashLength = pct * circumference;
        const segment = { ...item, dashLength, offset };
        offset += dashLength;
        return segment;
    });

    return (
        <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">LAPORAN BERDASARKAN JENIS</h3>

            <div className="mt-4 flex flex-1 items-center gap-5">
                {/* Donut */}
                <div className="relative flex-shrink-0">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
                        {segments.map((seg, i) => (
                            <circle
                                key={i}
                                cx={cx}
                                cy={cy}
                                r={radius}
                                fill="none"
                                stroke={seg.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
                                strokeDashoffset={-seg.offset + circumference * 0.25}
                                strokeLinecap="butt"
                                className="cursor-pointer transition-all duration-300 hover:stroke-[24px]"
                            />
                        ))}
                        <text x={cx} y={cy - 6} textAnchor="middle" fill="#64748b" fontSize="9">Total</text>
                        <text x={cx} y={cy + 12} textAnchor="middle" fill="#0f172a" fontSize="20" fontWeight="bold">{total}</text>
                    </svg>
                </div>

                {/* Legend */}
                <div className="space-y-2.5">
                    {data.map((item) => (
                        <div key={item.type} className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-[11px] font-medium text-slate-700">{item.label}</span>
                            <span className="text-[11px] font-bold text-slate-900">{item.count}</span>
                            <span className="text-[10px] text-slate-400">({item.pct}%)</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
