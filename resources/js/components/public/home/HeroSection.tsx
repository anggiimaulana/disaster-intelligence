import { Link } from '@inertiajs/react';
import { ArrowRight, ShieldAlert, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { disasterMap, report } from '@/routes/public';
import ActiveAlertCard from './ActiveAlertCard';
import type { PublicAlert, PublicStats } from '@/types/public-disaster';

interface HeroSectionProps {
    alerts: PublicAlert[];
    stats: PublicStats;
}

export default function HeroSection({ alerts, stats }: HeroSectionProps) {
    return (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1920&q=80)',
                    backgroundColor: '#002B5C',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/95 via-[#003366]/80 to-[#003366]/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001A33]/60 to-transparent" />

            <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 lg:px-6 py-16 lg:py-24">
                <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
                    <div className="text-white max-w-xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-blue-100 border border-white/10 mb-6">
                            <ShieldAlert className="h-4 w-4" />
                            <span>Sistem Informasi Bencana Terintegrasi</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight mb-4">
                            Pantau & Laporkan
                            <br />
                            <span className="text-cyan-300">Bencana</span> Secara
                            <br />
                            Real-time
                        </h1>

                        <p className="text-base sm:text-lg text-blue-100/80 leading-relaxed mb-8 max-w-lg">
                            Platform monitoring, pelaporan, dan informasi bencana berbasis AI untuk
                            masyarakat Kabupaten Indramayu. Cepat, akurat, dan terpercaya.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                asChild
                                size="lg"
                                className="bg-cyan-400 text-[#003366] hover:bg-cyan-300 font-bold text-base rounded-xl px-6 h-12 shadow-lg shadow-cyan-500/20"
                            >
                                <Link href={report()}>
                                    Lapor Bencana
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white rounded-xl px-6 h-12 text-base"
                            >
                                <Link href={disasterMap()}>
                                    Lihat Peta Bencana
                                </Link>
                            </Button>
                        </div>

                        <div className="hidden sm:flex items-center gap-6 mt-10 pt-6 border-t border-white/10">
                            <div>
                                <p className="text-2xl font-bold text-white">{stats.activeWarnings}</p>
                                <p className="text-xs text-blue-200/70">Peringatan Aktif</p>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div>
                                <p className="text-2xl font-bold text-white">{stats.reportsToday}</p>
                                <p className="text-xs text-blue-200/70">Laporan Hari Ini</p>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div>
                                <p className="text-2xl font-bold text-white">{stats.highRiskZones}</p>
                                <p className="text-xs text-blue-200/70">Zona Risiko Tinggi</p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col gap-4">
                        {alerts.slice(0, 3).map((alert) => (
                            <ActiveAlertCard key={alert.id} alert={alert} variant="compact" />
                        ))}
                        <Link
                            href={disasterMap()}
                            className="flex items-center justify-center gap-2 text-sm font-medium text-blue-200 hover:text-white transition-colors mt-2 py-2"
                        >
                            Lihat semua peringatan
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>

            <button
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 transition-colors animate-bounce"
                aria-label="Scroll ke bawah"
            >
                <ChevronDown className="h-5 w-5" />
            </button>
        </section>
    );
}
