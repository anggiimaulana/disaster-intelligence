import { cn } from '@/lib/utils';

export function RiskGauge({ score, label }: { score: number; label: string }) {
    // Gauge: semicircle with 3 colored segments + needle
    const cx = 70;
    const cy = 70;
    const radius = 50;

    // Needle angle: 0 = left (0 score), 180 = right (100 score)
    const needleAngle = (score / 100) * 180;
    const needleRad = ((180 - needleAngle) * Math.PI) / 180;
    const needleLen = radius - 12;
    const nx = cx + needleLen * Math.cos(needleRad);
    const ny = cy - needleLen * Math.sin(needleRad);

    return (
        <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-center text-sm font-bold text-slate-900">TINGKAT RISIKO KESELURUHAN</h3>

            <div className="flex flex-1 flex-col items-center justify-center">
                {/* Gauge SVG */}
                <svg width="160" height="95" viewBox="0 0 140 95">
                    {/* Green arc (0-33%) */}
                    <g className="group cursor-pointer">
                        <path
                            d="M 20 70 A 50 50 0 0 1 46.7 28.4"
                            fill="none" stroke="#22C55E" strokeWidth="14" strokeLinecap="round"
                            className="transition-all duration-300 group-hover:stroke-[18px]"
                        />
                        <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <rect x="5" y="35" width="55" height="18" rx="4" fill="#1e293b" />
                            <text x="32" y="47" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">Rendah (0-33)</text>
                        </g>
                    </g>
                    {/* Yellow arc (33-66%) */}
                    <g className="group cursor-pointer">
                        <path
                            d="M 49 27 A 50 50 0 0 1 91 27"
                            fill="none" stroke="#F59E0B" strokeWidth="14" strokeLinecap="round"
                            className="transition-all duration-300 group-hover:stroke-[18px]"
                        />
                        <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <rect x="42" y="5" width="55" height="18" rx="4" fill="#1e293b" />
                            <text x="70" y="17" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">Sedang (34-66)</text>
                        </g>
                    </g>
                    {/* Red arc (66-100%) */}
                    <g className="group cursor-pointer">
                        <path
                            d="M 93.3 28.4 A 50 50 0 0 1 120 70"
                            fill="none" stroke="#EF4444" strokeWidth="14" strokeLinecap="round"
                            className="transition-all duration-300 group-hover:stroke-[18px]"
                        />
                        <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <rect x="80" y="35" width="55" height="18" rx="4" fill="#1e293b" />
                            <text x="107" y="47" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">Tinggi (67-100)</text>
                        </g>
                    </g>
                    {/* Needle */}
                    <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx={cx} cy={cy} r="5" fill="#1e293b" />
                    <circle cx={cx} cy={cy} r="2.5" fill="white" />
                </svg>

                {/* Score */}
                <div className="mt-1 text-center">
                    <span className="text-3xl font-bold text-red-600">{score}</span>
                    <span className="text-sm text-slate-400"> / 100</span>
                </div>

                {/* Label badge */}
                <div className={cn(
                    'mt-2 rounded-full px-4 py-1 text-xs font-bold',
                    score >= 70 ? 'bg-red-100 text-red-700' : score >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700',
                )}>
                    {label}
                </div>

                <p className="mt-2 text-center text-[10px] text-slate-400">Berdasarkan analisis AI & data terkini</p>
            </div>
        </div>
    );
}
