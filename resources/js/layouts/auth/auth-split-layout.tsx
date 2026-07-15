import { Link, usePage } from '@inertiajs/react';
import { Activity, BarChart3, Bell, Shield } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const stats = [
    { value: '1.2K+', label: 'Laporan' },
    { value: '98%', label: 'Akurasi' },
    { value: '24/7', label: 'Monitoring' },
];

const features = [
    { icon: Activity, text: 'Pemantauan bencana real-time berbasis AI' },
    { icon: Bell, text: 'Notifikasi peringatan dini otomatis' },
    { icon: BarChart3, text: 'Analisis dan visualisasi data kebencanaan' },
];

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid min-h-dvh lg:max-w-none lg:grid-cols-2">
            {/* Left Panel - Branding & Hero */}
            <div className="relative hidden h-dvh flex-col justify-between overflow-hidden bg-[#003366] p-10 lg:flex">
                <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/95 via-[#003366]/85 to-[#001A33]/95" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

                {/* Decorative glass elements */}
                <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-cyan-400/5 blur-3xl" />
                <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-blue-400/5 blur-3xl" />
                <div className="absolute left-1/3 top-1/3 h-48 w-48 rounded-full bg-cyan-300/5 blur-3xl" />

                {/* Floating decorative cards */}
                <div className="absolute right-10 top-32 z-10 rounded-xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-400/20 p-1.5">
                            <Activity className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-xs font-medium text-white/60">Aktif</div>
                            <div className="text-sm font-semibold text-white">12 Bencana</div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-40 left-10 z-10 rounded-xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        <span className="text-xs text-white/60">Sistem Aktif — 99.9% Uptime</span>
                    </div>
                </div>

                <div className="relative z-10">
                    <Link href={home()} className="inline-flex items-center gap-3">
                        <div className="flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl bg-white shadow-lg shadow-cyan-500/10">
                            <img src="/icon.png" alt="Logo" className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <div className="text-xs font-bold tracking-[0.15em] text-white">DISASTER</div>
                            <div className="text-xs font-bold tracking-[0.15em] text-cyan-300">INTELLIGENCE</div>
                        </div>
                    </Link>
                </div>

                <div className="relative z-10 max-w-sm space-y-8">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-blue-100 backdrop-blur-sm">
                        <Activity className="h-3 w-3" />
                        Platform Kebencanaan Berbasis AI
                    </div>

                    <div>
                        <h2 className="text-[2rem] font-bold leading-[1.1] tracking-tight text-white">
                            Pantau & Laporkan
                        </h2>
                        <h2 className="text-[2rem] font-bold leading-[1.1] tracking-tight text-cyan-300">
                            Bencana Secara Real-time
                        </h2>
                    </div>

                    <p className="text-sm leading-relaxed text-blue-200/70">
                        Platform monitoring, pelaporan, dan informasi kebencanaan berbasis AI
                        untuk masyarakat dan pemerintah Kabupaten Indramayu.
                    </p>

                    <div className="space-y-3">
                        {features.map((feature) => (
                            <div key={feature.text} className="flex items-center gap-3">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
                                    <feature.icon className="h-3.5 w-3.5 text-cyan-300" />
                                </div>
                                <span className="text-sm text-blue-200/70">{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 border-t border-white/10 pt-6">
                        {stats.map((stat, i) => (
                            <div key={stat.label} className="flex items-center gap-6">
                                <div>
                                    <div className="text-lg font-bold text-white">{stat.value}</div>
                                    <div className="text-[11px] text-blue-200/60">{stat.label}</div>
                                </div>
                                {i < stats.length - 1 && (
                                    <div className="h-8 w-px bg-white/10" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-xs text-blue-300/40">
                    &copy; {new Date().getFullYear()} {name}. Hak cipta dilindungi.
                </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="flex min-h-dvh w-full items-center justify-center bg-slate-50 p-6 lg:p-12 relative overflow-hidden">
                {/* Decorative background elements for right panel */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-100/50 blur-3xl opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-100/50 blur-3xl opacity-50 pointer-events-none" />

                <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-8 relative z-10">
                    {/* Mobile logo */}
                    <Link
                        href={home()}
                        className="flex items-center justify-center gap-3 lg:hidden"
                    >
                        <div className="flex h-10 w-10 items-center overflow-hidden justify-center rounded-xl bg-white shadow-sm border border-slate-100">
                            <img src="/icon.png" alt="Logo" className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold tracking-[0.15em] text-slate-800">DISASTER</div>
                            <div className="text-[10px] font-bold tracking-[0.15em] text-blue-600">INTELLIGENCE</div>
                        </div>
                    </Link>

                    <div className="rounded-3xl border border-white bg-white/70 p-8 shadow-[0_8px_40px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
                        <div className="mb-8 flex flex-col gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
                            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
