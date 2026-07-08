import { Head, Link } from '@inertiajs/react';
import { Shield, Target, Eye, Heart, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EthicalHero } from '@/components/ui/hero-ethical';
import { contact } from '@/routes/public';
import type { PageProps } from '@/types';

interface AboutPageProps extends PageProps {
    isSimulation?: boolean;
}

const VALUES = [
    { icon: Shield, title: 'Tanggap', desc: 'Respons cepat dan tepat dalam setiap situasi darurat bencana.', stat: '< 15 Menit', statLabel: 'Waktu respons', color: 'text-premium-blue-accent', bg: 'bg-premium-blue-accent/10' },
    { icon: Target, title: 'Akurat', desc: 'Informasi berbasis data dan AI yang terverifikasi oleh petugas ahli.', stat: '100%', statLabel: 'Verifikasi', color: 'text-premium-success', bg: 'bg-premium-success/10' },
    { icon: Eye, title: 'Transparan', desc: 'Semua informasi dapat diakses publik secara terbuka dan bertanggung jawab.', stat: '24/7', statLabel: 'Akses publik', color: 'text-premium-warning', bg: 'bg-premium-warning/10' },
    { icon: Heart, title: 'Gotong Royong', desc: 'Mengutamakan partisipasi masyarakat dalam penanggulangan bencana.', stat: '2.000+', statLabel: 'Partisipan', color: 'text-pink-500', bg: 'bg-pink-500/10' },
];

const STEPS = [
    { step: 1, title: 'Pelaporan', desc: 'Masyarakat melaporkan kejadian melalui web atau WhatsApp', color: 'bg-premium-blue-accent' },
    { step: 2, title: 'Verifikasi', desc: 'Petugas BPBD memverifikasi laporan dan data di lapangan', color: 'bg-premium-warning' },
    { step: 3, title: 'Analisis AI', desc: 'Sistem AI menganalisis tingkat risiko dan pola kejadian', color: 'bg-purple-500' },
    { step: 4, title: 'Tindak Lanjut', desc: 'Koordinasi penanggulangan dan penerbitan peringatan dini', color: 'bg-premium-success' },
];

export default function AboutPage({}: AboutPageProps) {
    return (
        <>
            <Head title="Tentang - Disaster Intelligence" />
            <EthicalHero
                kicker="BPBD Kab. Indramayu"
                title={
                    <>
                        Tentang{' '}
                        <span className="text-premium-blue-accent">Disaster Intelligence</span>
                    </>
                }
                subtitle="Sistem informasi bencana berbasis kecerdasan buatan (AI) yang dikembangkan oleh BPBD Kabupaten Indramayu untuk mendeteksi, memantau, dan merespons kejadian bencana secara cepat dan akurat."
            />
            <div className="bg-premium-bg min-h-screen pb-20">

                <div className="mx-auto max-w-[1440px] px-6 lg:px-10 -mt-10 relative z-20">
                    <div className="bg-white rounded-[32px] border border-premium-border p-8 lg:p-14 shadow-[0_15px_40px_rgba(15,23,42,0.04)] mb-16">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl lg:text-3xl font-bold text-premium-heading mb-6 font-heading text-center">Mengapa Disaster Intelligence?</h2>
                            <p className="text-base text-premium-body leading-relaxed mb-6 text-center">
                                Dengan memanfaatkan teknologi AI dan partisipasi aktif masyarakat, sistem ini mampu
                                memberikan peringatan dini, analisis risiko real-time, dan koordinasi penanggulangan
                                bencana yang lebih efektif di seluruh Kabupaten Indramayu.
                            </p>
                            <p className="text-base text-premium-body leading-relaxed text-center">
                                Berkolaborasi dengan BMKG, BNPB, dan organisasi kemanusiaan, kami berkomitmen
                                untuk melindungi masyarakat Indramayu dari dampak bencana alam melalui inovasi
                                teknologi dan semangat gotong royong.
                            </p>
                        </div>
                    </div>

                    <div className="mb-20">
                        <h2 className="text-2xl lg:text-3xl font-bold text-premium-heading mb-10 font-heading text-center">Nilai-Nilai Kami</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {VALUES.map(({ icon: Icon, title, desc, stat, statLabel, color, bg }) => (
                                <div
                                    key={title}
                                    className="rounded-[24px] border border-premium-border bg-white p-8 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    <div className={`w-14 h-14 rounded-[16px] ${bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`h-7 w-7 ${color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-premium-heading mb-3 font-heading">{title}</h3>
                                    <p className="text-sm text-premium-body mb-6 leading-relaxed">{desc}</p>
                                    <div className="pt-5 border-t border-premium-border">
                                        <p className="text-3xl font-bold text-premium-heading font-heading mb-1">{stat}</p>
                                        <p className="text-xs font-medium text-premium-caption uppercase tracking-wider">{statLabel}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-20">
                        <h2 className="text-2xl lg:text-3xl font-bold text-premium-heading mb-10 font-heading text-center">Alur Penanganan Bencana</h2>
                        <div className="rounded-[32px] border border-premium-border bg-white overflow-hidden shadow-sm">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                                {STEPS.map(({ step, title, desc, color }, index) => (
                                    <div
                                        key={step}
                                        className="relative p-8 border-b sm:border-b-0 lg:border-r border-premium-border last:border-0"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className={`w-12 h-12 rounded-[16px] ${color} text-white text-lg font-bold flex items-center justify-center shrink-0 shadow-sm`}>
                                                {step}
                                            </div>
                                            {index < STEPS.length - 1 && (
                                                <div className="hidden lg:block h-0.5 w-full bg-premium-border relative ml-4">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-premium-blue-accent to-transparent" style={{ width: '100%' }} />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-premium-heading mb-2 font-heading">{title}</h3>
                                        <p className="text-sm text-premium-body leading-relaxed">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[32px] bg-gradient-to-r from-premium-navy to-premium-navy-dark p-12 lg:p-16 text-center relative overflow-hidden shadow-[0_20px_40px_rgba(11,42,82,0.3)]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-premium-blue-accent/20 rounded-full blur-[60px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-premium-success/20 rounded-full blur-[60px] pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="p-3 bg-white/10 rounded-full backdrop-blur-md">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-sm font-bold text-white uppercase tracking-wider">Bersama Kita Tangguh</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-heading">Siap Membantu?</h2>
                            <p className="text-base text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
                                Jika Anda memiliki pertanyaan, saran, atau ingin melaporkan kejadian bencana,
                                jangan ragu untuk menghubungi tim BPBD Kabupaten Indramayu.
                            </p>
                            <Button
                                asChild
                                className="h-14 px-8 bg-white text-premium-navy hover:bg-premium-bg hover:text-premium-navy-dark rounded-[18px] font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-0"
                            >
                                <Link href={contact()}>
                                    Hubungi Kami
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
