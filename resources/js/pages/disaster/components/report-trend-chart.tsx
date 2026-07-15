import { getDisasterLabel } from '@/lib/utils';
import type { TrendDataPoint } from '@/types';

export function ReportTrendChart({ data }: { data: TrendDataPoint[] }) {
    const chartData = data.map((d) => ({
        count: d.count,
        label: d.tanggal,
    }));

    const max = Math.max(...chartData.map((d) => d.count), 0);
    const yMax = Math.ceil(max / 10) * 10 || 10;

    const svgW = 320;
    const svgH = 200;
    const pad = { top: 25, right: 15, bottom: 35, left: 35 };
    const chartW = svgW - pad.left - pad.right;
    const chartH = svgH - pad.top - pad.bottom;

    const points = chartData.map((d, i) => ({
        x: pad.left + (i / (Math.max(chartData.length - 1, 1))) * chartW,
        y: pad.top + chartH - (d.count / yMax) * chartH,
        value: d.count,
        label: d.label,
    }));

    const linePath = points.length > 0 ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') : `M ${pad.left} ${pad.top + chartH}`;
    const areaPath = points.length > 0 ? `${linePath} L ${points[points.length - 1].x} ${pad.top + chartH} L ${points[0].x} ${pad.top + chartH} Z` : '';

    const yTicks = Array.from({ length: 6 }, (_, i) => Math.round((yMax / 5) * i));

    const lineColor = '#3B82F6';

    return (
        <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">TREND LAPORAN</h3>
                    <p className="text-[10px] text-slate-500">(7 HARI TERAKHIR)</p>
                </div>
            </div>

            <div className="mt-3 flex-1">
                <svg viewBox={`0 0 ${svgW} ${svgH}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                    {/* Y-axis grid lines + labels */}
                    {yTicks.map((tick) => {
                        const y = pad.top + chartH - (tick / yMax) * chartH;
                        return (
                            <g key={tick}>
                                <line x1={pad.left} y1={y} x2={svgW - pad.right} y2={y} stroke="#f1f5f9" strokeWidth="0.5" />
                                <text x={pad.left - 8} y={y + 3} textAnchor="end" fill="#94a3b8" fontSize="8">{tick}</text>
                            </g>
                        );
                    })}

                    {/* Area gradient fill */}
                    <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={lineColor} stopOpacity="0.15" />
                            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#trendGrad)" />

                    {/* Line */}
                    <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Data points with values — show on hover via CSS */}
                    {points.map((p, i) => (
                        <g key={i} className="group">
                            <circle cx={p.x} cy={p.y} r="14" fill="transparent" className="cursor-pointer" />
                            <circle cx={p.x} cy={p.y} r="4" fill="white" stroke={lineColor} strokeWidth="2.5" className="transition-all group-hover:r-[6]" />
                            <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <rect x={p.x - 40} y={p.y - 30} width="80" height="20" rx="4" fill="#1e293b" />
                                <text x={p.x} y={p.y - 16} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
                                    {p.label}: {p.value}
                                </text>
                            </g>
                        </g>
                    ))}

                    {/* X-axis labels */}
                    {points.map((p, i) => (
                        <text key={i} x={p.x} y={svgH - 8} textAnchor="middle" fill="#94a3b8" fontSize="7">
                            {p.label}
                        </text>
                    ))}
                </svg>
            </div>
        </div>
    );
}
