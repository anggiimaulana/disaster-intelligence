import { useState } from 'react';
import { getDisasterLabel } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TrendDataPoint } from '@/types';

// Dummy data per disaster type for interactive filtering
const trendByType: Record<string, number[]> = {
    all: [12, 18, 15, 22, 28, 33, 18],
    BANJIR: [5, 8, 6, 10, 14, 16, 9],
    LONGSOR: [3, 4, 4, 5, 6, 8, 4],
    KEBAKARAN: [1, 2, 2, 3, 3, 4, 2],
    ANGIN_KENCANG: [2, 2, 1, 2, 3, 3, 2],
    LAINNYA: [1, 2, 2, 2, 2, 2, 1],
};

const labels = ['15 Mei', '16 Mei', '17 Mei', '18 Mei', '19 Mei', '20 Mei', '21 Mei'];

export function ReportTrendChart({ data }: { data: TrendDataPoint[] }) {
    const [filterType, setFilterType] = useState('all');

    const chartData = (trendByType[filterType] ?? trendByType.all).map((count, i) => ({
        count,
        label: data[i]?.tanggal ?? labels[i],
    }));

    const max = Math.max(...chartData.map((d) => d.count));
    const yMax = Math.ceil(max / 10) * 10 || 10;

    const svgW = 320;
    const svgH = 200;
    const pad = { top: 25, right: 15, bottom: 35, left: 35 };
    const chartW = svgW - pad.left - pad.right;
    const chartH = svgH - pad.top - pad.bottom;

    const points = chartData.map((d, i) => ({
        x: pad.left + (i / (chartData.length - 1)) * chartW,
        y: pad.top + chartH - (d.count / yMax) * chartH,
        value: d.count,
        label: d.label,
    }));

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${pad.top + chartH} L ${points[0].x} ${pad.top + chartH} Z`;

    const yTicks = Array.from({ length: 6 }, (_, i) => Math.round((yMax / 5) * i));

    // Line color based on filter
    const lineColor = filterType === 'BANJIR' ? '#3B82F6' : filterType === 'LONGSOR' ? '#F59E0B' : filterType === 'KEBAKARAN' ? '#EF4444' : filterType === 'ANGIN_KENCANG' ? '#22C55E' : filterType === 'LAINNYA' ? '#8B5CF6' : '#3B82F6';

    return (
        <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">TREND LAPORAN</h3>
                    <p className="text-[10px] text-slate-500">(7 HARI TERAKHIR)</p>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="h-7 w-[110px] rounded-full border-slate-200 text-[10px]">
                        <SelectValue placeholder="Semua Jenis" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Jenis</SelectItem>
                        <SelectItem value="BANJIR">Banjir</SelectItem>
                        <SelectItem value="LONGSOR">Longsor</SelectItem>
                        <SelectItem value="KEBAKARAN">Kebakaran</SelectItem>
                        <SelectItem value="ANGIN_KENCANG">Angin Kencang</SelectItem>
                        <SelectItem value="LAINNYA">Lainnya</SelectItem>
                    </SelectContent>
                </Select>
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
