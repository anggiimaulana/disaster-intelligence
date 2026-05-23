import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Shield, Target, Eye, Heart, ArrowRight, Building, Users, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { home } from '@/routes';
import { contact } from '@/routes/public';
import type { PageProps } from '@/types';

interface AboutPageProps extends PageProps {
    isSimulation?: boolean;
}

const VALUES = [
    { icon: Shield, title: 'Tanggap', desc: 'Respons cepat dan tepat dalam setiap situasi darurat bencana.', stat: '< 15 Menit', statLabel: 'Waktu respons' },
    { icon: Target, title: 'Akurat', desc: 'Informasi berbasis data dan AI yang terverifikasi oleh petugas ahli.', stat: '100%', statLabel: 'Verifikasi' },
    { icon: Eye, title: 'Transparan', desc: 'Semua informasi dapat diakses publik secara terbuka dan bertanggung jawab.', stat: '24/7', statLabel: 'Akses publik' },
    { icon: Heart, title: 'Gotong Royong', desc: 'Mengutamakan partisipasi masyarakat dalam penanggulangan bencana.', stat: '2.000+', statLabel: 'Partisipan' },
];

const STEPS = [
    { step: 1, title: 'Pelaporan', desc: 'Masyarakat melaporkan kejadian melalui web atau WhatsApp', color: 'bg-blue-500' },
    { step: 2, title: 'Verifikasi', desc: 'Petugas BPBD memverifikasi laporan dan data di lapangan', color: 'bg-amber-500' },
    { step: 3, title: 'Analisis AI', desc: 'Sistem AI menganalisis tingkat risiko dan pola kejadian', color: 'bg-purple-500' },
    { step: 4, title: 'Tindak Lanjut', desc: 'Koordinasi penanggulangan dan penerbitan peringatan dini', color: 'bg-emerald-500' },
];

export default function AboutPage({}: AboutPageProps) {
    return (
        <>
            <Head title="Tentang - Disaster Intelligence" />
            <div>
            <div className="relative bg-gradient-to-br from-[#001a33] via-[#00264d] to-[#003366] overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400 blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-cyan-400 blur-3xl" />
                </div>
                <div className="relative mx-auto max-w-[1240px] px-4 lg:px-6 py-12 lg:py-16">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-1 text-sm text-blue-300 hover:text-blue-200 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Beranda
                    </Link>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Building className="h-5 w-5 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-blue-300">BPBD Kab. Indramayu</span>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                        Tentang Disaster Intelligence
                    </h1>
                    <p className="text-sm text-blue-200/80 max-w-2xl leading-relaxed">
                        Sistem informasi bencana berbasis kecerdasan buatan (AI) yang dikembangkan
                        oleh BPBD Kabupaten Indramayu untuk mendeteksi, memantau, dan merespons
                        kejadian bencana secara cepat dan akurat.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-[1240px] px-4 lg:px-6 py-10 lg:py-14">
                <div className="max-w-3xl mb-14">
                    <h2 className="text-lg lg:text-xl font-bold text-[#1F2937] mb-4">Mengapa Disaster Intelligence?</h2>
                    <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                        Dengan memanfaatkan teknologi AI dan partisipasi aktif masyarakat, sistem ini mampu
                        memberikan peringatan dini, analisis risiko real-time, dan koordinasi penanggulangan
                        bencana yang lebih efektif di seluruh Kabupaten Indramayu.
                    </p>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                        Berkolaborasi dengan BMKG, BNPB, dan organisasi kemanusiaan, kami berkomitmen
                        untuk melindungi masyarakat Indramayu dari dampak bencana alam melalui inovasi
                        teknologi dan gotong royong.
                    </p>
                </div>

                <div className="mb-14">
                    <h2 className="text-lg lg:text-xl font-bold text-[#1F2937] mb-6">Nilai-Nilai Kami</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {VALUES.map(({ icon: Icon, title, desc, stat, statLabel }) => (
                            <div
                                key={title}
                                className="rounded-xl border border-[#E5E7EB] bg-white p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#E0E7FF] flex items-center justify-center mb-3 group-hover:bg-[#003366] transition-colors">
                                    <Icon className="h-5 w-5 text-[#003366] group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-sm font-bold text-[#1F2937] mb-1">{title}</h3>
                                <p className="text-xs text-[#6B7280] mb-3">{desc}</p>
                                <div className="pt-3 border-t border-[#E5E7EB]">
                                    <p className="text-lg font-bold text-[#003366]">{stat}</p>
                                    <p className="text-[10px] text-[#9CA3AF]">{statLabel}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-14">
                    <h2 className="text-lg lg:text-xl font-bold text-[#1F2937] mb-6">Alur Penanganan Bencana</h2>
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                            {STEPS.map(({ step, title, desc, color }, index) => (
                                <div
                                    key={step}
                                    className="relative p-6 border-b sm:border-b-0 sm:border-r border-[#E5E7EB] last:border-0"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-full ${color} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
                                            {step}
                                        </div>
                                        {index < STEPS.length - 1 && (
                                            <div className="hidden lg:block h-0.5 w-full bg-[#E5E7EB] relative">
                                                <div className="absolute inset-0 bg-gradient-to-r from-[#003366] to-transparent" style={{ width: `${(step / STEPS.length) * 100}%` }} />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-bold text-[#1F2937] mb-1">{title}</h3>
                                    <p className="text-xs text-[#6B7280]">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-[#001a33] to-[#003366] p-8 lg:p-10 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Users className="h-5 w-5 text-blue-400" />
                        <span className="text-sm font-medium text-blue-300">Bersama Kita Tangguh</span>
                    </div>
                    <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">Siap Membantu?</h2>
                    <p className="text-sm text-blue-200/80 max-w-lg mx-auto mb-6">
                        Jika Anda memiliki pertanyaan, saran, atau ingin melaporkan kejadian bencana,
                        jangan ragu untuk menghubungi tim BPBD Kabupaten Indramayu.
                    </p>
                    <Button
                        asChild
                        className="bg-white text-[#003366] hover:bg-blue-50 rounded-xl font-medium"
                    >
                        <Link href={contact()}>
                            Hubungi Kami
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
        </>
    );
}
