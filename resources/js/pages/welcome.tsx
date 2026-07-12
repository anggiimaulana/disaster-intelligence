import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Activity, AlertTriangle, ShieldCheck, Map, BellRing, Droplet, Wind, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { disasterMap } from '@/routes/public';
import { laporBencana } from '@/routes';

export default function Welcome() {
    return (
        <>
            <Head title="Disaster Intelligence - BPBD Indramayu" />
            
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-premium-bg">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=2500" 
                        alt="Rescue Team" 
                        className="w-full h-full object-cover object-center opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-premium-navy via-premium-navy/90 to-transparent"></div>
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent backdrop-blur-[20px]"></div>
                </div>

                <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        
                        {/* LEFT COLUMN (45%) */}
                        <div className="w-full lg:w-[45%] text-white animate-in slide-in-from-bottom-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
                                <span className="flex h-2 w-2 rounded-full bg-premium-success animate-pulse"></span>
                                <span className="text-xs font-semibold tracking-wide">SYSTEM ACTIVE & MONITORING</span>
                            </div>
                            
                            <h1 className="text-5xl lg:text-[60px] font-bold leading-[1.1] mb-6 font-heading tracking-tight">
                                Intelligence <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-premium-blue-accent">
                                    Disaster Response
                                </span>
                            </h1>
                            
                            <p className="text-lg text-blue-100/80 mb-10 leading-relaxed font-sans max-w-xl">
                                Platform pintar berbasis AI untuk deteksi dini, pemantauan real-time, dan manajemen krisis bencana di wilayah Kabupaten Indramayu.
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4">
                                <Button asChild className="h-14 px-8 rounded-[18px] bg-premium-blue-accent hover:bg-premium-blue-hover text-white text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all border-0">
                                    <Link href={laporBencana()}>
                                        Lapor Kejadian <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="h-14 px-8 rounded-[18px] bg-white/5 border-white/20 hover:bg-white/10 text-white text-base font-semibold backdrop-blur-sm transition-all hover:border-white/40">
                                    <Link href={disasterMap()}>
                                        <Map className="mr-2 h-5 w-5" /> Pantau Peta
                                    </Link>
                                </Button>
                            </div>
                            
                            <div className="mt-12 flex items-center gap-6 text-sm font-medium text-blue-200/60">
                                <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-premium-success" /> Validasi AI</div>
                                <div className="flex items-center gap-2"><Activity className="h-5 w-5 text-blue-400" /> Real-time Data</div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN (55%) */}
                        <div className="w-full lg:w-[55%] relative flex flex-col gap-5 pt-10">
                            {/* Alert Card 1 */}
                            <div className="glass-premium p-5 rounded-[24px] flex items-start gap-4 transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-[0_15px_40px_rgba(15,23,42,0.08)] hover:shadow-[0_25px_60px_rgba(15,23,42,0.12)] ml-auto w-full max-w-[420px] animate-in fade-in slide-in-from-right-8 delay-150 border border-white/40">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-premium-danger/10 text-premium-danger">
                                    <Droplet className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-premium-danger bg-premium-danger/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Tinggi</span>
                                        <span className="text-xs text-premium-caption font-medium">Baru saja</span>
                                    </div>
                                    <h4 className="text-base font-bold text-premium-heading mb-1 font-heading">Potensi Banjir Rob</h4>
                                    <p className="text-sm text-premium-body leading-relaxed">Peningkatan tinggi gelombang di pesisir Eretan. Status waspada dinaikkan.</p>
                                </div>
                            </div>

                            {/* Alert Card 2 */}
                            <div className="glass-premium p-5 rounded-[24px] flex items-start gap-4 transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-[0_15px_40px_rgba(15,23,42,0.08)] hover:shadow-[0_25px_60px_rgba(15,23,42,0.12)] ml-auto w-full max-w-[420px] lg:mr-12 animate-in fade-in slide-in-from-right-8 delay-300 border border-white/40">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-premium-warning/10 text-premium-warning">
                                    <Wind className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-premium-warning bg-premium-warning/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Sedang</span>
                                        <span className="text-xs text-premium-caption font-medium">10 menit lalu</span>
                                    </div>
                                    <h4 className="text-base font-bold text-premium-heading mb-1 font-heading">Cuaca Ekstrem</h4>
                                    <p className="text-sm text-premium-body leading-relaxed">Angin kencang terpantau di area Karangampel dan sekitarnya.</p>
                                </div>
                            </div>
                            
                            {/* Alert Card 3 */}
                            <div className="glass-premium p-5 rounded-[24px] flex items-start gap-4 transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 shadow-[0_15px_40px_rgba(15,23,42,0.08)] hover:shadow-[0_25px_60px_rgba(15,23,42,0.12)] ml-auto w-full max-w-[420px] animate-in fade-in slide-in-from-right-8 delay-500 border border-white/40">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-premium-success/10 text-premium-success">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-premium-success bg-premium-success/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Aman</span>
                                        <span className="text-xs text-premium-caption font-medium">1 jam lalu</span>
                                    </div>
                                    <h4 className="text-base font-bold text-premium-heading mb-1 font-heading">Kondisi Normal</h4>
                                    <p className="text-sm text-premium-body leading-relaxed">Bendungan Rentang beroperasi dalam kapasitas normal.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATISTIC SECTION */}
            <section className="py-20 bg-premium-bg">
                <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Stat 1 */}
                        <div className="bg-white border border-premium-border rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300">
                            <div className="h-12 w-12 rounded-[16px] bg-blue-50 text-premium-blue-accent flex items-center justify-center mb-4">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-bold text-premium-heading mb-1 font-heading">24</h3>
                            <p className="text-sm font-medium text-premium-body">Kejadian Aktif</p>
                        </div>
                        {/* Stat 2 */}
                        <div className="bg-white border border-premium-border rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300">
                            <div className="h-12 w-12 rounded-[16px] bg-red-50 text-premium-danger flex items-center justify-center mb-4">
                                <BellRing className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-bold text-premium-heading mb-1 font-heading">3</h3>
                            <p className="text-sm font-medium text-premium-body">Peringatan Dini</p>
                        </div>
                        {/* Stat 3 */}
                        <div className="bg-white border border-premium-border rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300">
                            <div className="h-12 w-12 rounded-[16px] bg-green-50 text-premium-success flex items-center justify-center mb-4">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-bold text-premium-heading mb-1 font-heading">85%</h3>
                            <p className="text-sm font-medium text-premium-body">Indeks Kesiapsiagaan</p>
                        </div>
                        {/* Stat 4 */}
                        <div className="bg-white border border-premium-border rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300">
                            <div className="h-12 w-12 rounded-[16px] bg-orange-50 text-premium-warning flex items-center justify-center mb-4">
                                <Activity className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-bold text-premium-heading mb-1 font-heading">99.9%</h3>
                            <p className="text-sm font-medium text-premium-body">Sensor Uptime</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-24 bg-premium-navy-darker relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-premium-blue-accent/20 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-10">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-[42px] font-bold text-white font-heading mb-4">
                            Teknologi di Balik Intelijen Bencana
                        </h2>
                        <p className="text-base text-blue-200/80">
                            Mengkombinasikan Computer Vision, NLP, dan data sensor untuk deteksi yang lebih cepat dan akurat.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="glass-dark-premium p-8 rounded-[24px] border border-white/10 hover:border-premium-blue-accent/50 transition-colors group">
                            <div className="h-14 w-14 rounded-2xl bg-premium-blue-accent/20 flex items-center justify-center text-premium-blue-accent mb-6 group-hover:scale-110 transition-transform">
                                <Activity className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 font-heading">Analisis Real-time</h3>
                            <p className="text-sm text-blue-200/70 leading-relaxed font-sans">
                                Memproses laporan masyarakat dan data sensor secara instan untuk menentukan tingkat bahaya dan radius terdampak.
                            </p>
                        </div>
                        <div className="glass-dark-premium p-8 rounded-[24px] border border-white/10 hover:border-premium-blue-accent/50 transition-colors group">
                            <div className="h-14 w-14 rounded-2xl bg-premium-blue-accent/20 flex items-center justify-center text-premium-blue-accent mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 font-heading">Validasi AI (Computer Vision)</h3>
                            <p className="text-sm text-blue-200/70 leading-relaxed font-sans">
                                Secara otomatis menganalisis foto dan video yang diunggah pelapor untuk memvalidasi keaslian dan tingkat keparahan bencana.
                            </p>
                        </div>
                        <div className="glass-dark-premium p-8 rounded-[24px] border border-white/10 hover:border-premium-blue-accent/50 transition-colors group">
                            <div className="h-14 w-14 rounded-2xl bg-premium-blue-accent/20 flex items-center justify-center text-premium-blue-accent mb-6 group-hover:scale-110 transition-transform">
                                <Map className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 font-heading">Pemetaan Dinamis</h3>
                            <p className="text-sm text-blue-200/70 leading-relaxed font-sans">
                                Memvisualisasikan titik rawan, jalur evakuasi, dan persebaran bencana dalam peta interaktif resolusi tinggi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
