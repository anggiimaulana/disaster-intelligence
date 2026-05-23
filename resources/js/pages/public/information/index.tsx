import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Bell, Newspaper, BookOpen, HelpCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { home } from '@/routes';
import { alerts, news, preparedness, faq } from '@/routes/public/information';
import type { PageProps } from '@/types';

interface InformationPageProps extends PageProps {
    isSimulation?: boolean;
}

const CATEGORIES = [
    {
        icon: Bell,
        title: 'Peringatan Dini',
        desc: 'Informasi peringatan dini bencana terkini dari BPBD dan BMKG. Pantau status terkini di wilayah Anda.',
        href: alerts(),
        gradient: 'from-red-500 to-red-600',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        badge: 'Aktif',
        badgeColor: 'bg-red-100 text-red-700',
    },
    {
        icon: Newspaper,
        title: 'Berita & Informasi',
        desc: 'Update berita dan informasi terbaru seputar penanggulangan bencana di Kabupaten Indramayu.',
        href: news(),
        gradient: 'from-blue-500 to-blue-600',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        badge: 'Terbaru',
        badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
        icon: BookOpen,
        title: 'Panduan Kesiapsiagaan',
        desc: 'Panduan lengkap kesiapsiagaan menghadapi berbagai jenis bencana sebelum, saat, dan setelah kejadian.',
        href: preparedness(),
        gradient: 'from-emerald-500 to-emerald-600',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        badge: null,
        badgeColor: '',
    },
    {
        icon: HelpCircle,
        title: 'Tanya Jawab (FAQ)',
        desc: 'Pertanyaan yang sering diajukan seputar sistem pelaporan, verifikasi, dan penanggulangan bencana.',
        href: faq(),
        gradient: 'from-purple-500 to-purple-600',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        badge: null,
        badgeColor: '',
    },
];

export default function InformationPage({}: InformationPageProps) {
    return (
        <>
            <Head title="Informasi Bencana - Disaster Intelligence" />
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
                            <ShieldAlert className="h-5 w-5 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-blue-300">Pusat Informasi Bencana</span>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                        Informasi Bencana
                    </h1>
                    <p className="text-sm text-blue-200/80 max-w-2xl leading-relaxed">
                        Akses informasi lengkap seputar kebencanaan di Kabupaten Indramayu,
                        mulai dari peringatan dini terkini, berita terbaru, panduan kesiapsiagaan,
                        hingga tanya jawab seputar sistem tanggap darurat.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-[1240px] px-4 lg:px-6 py-10 lg:py-14">
                <div className="grid sm:grid-cols-2 gap-6">
                    {CATEGORIES.map(({ icon: Icon, title, desc, href, iconBg, iconColor, badge, badgeColor, gradient }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group relative rounded-2xl border border-[#E5E7EB] bg-white p-6 lg:p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon className={`h-6 w-6 ${iconColor}`} />
                                </div>
                                {badge && (
                                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
                                        {badge}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-base font-bold text-[#1F2937] mb-2 group-hover:text-[#003366] transition-colors">
                                {title}
                            </h3>
                            <p className="text-sm text-[#6B7280] leading-relaxed">{desc}</p>
                            <div className="flex items-center gap-1 mt-5 text-sm font-medium group-hover:gap-2 transition-all">
                                <span className="bg-gradient-to-r bg-clip-text text-transparent from-[#003366] to-[#005599]">
                                    Buka
                                </span>
                                <ArrowRight className="h-4 w-4 text-[#003366] group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}
