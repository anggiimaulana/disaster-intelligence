import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Bell, Newspaper, BookOpen, HelpCircle } from 'lucide-react';
import { EthicalHero } from '@/components/ui/hero-ethical';
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
        iconBg: 'bg-premium-danger/10',
        iconColor: 'text-premium-danger',
        badge: 'Aktif',
        badgeColor: 'bg-premium-danger/10 text-premium-danger',
    },
    {
        icon: Newspaper,
        title: 'Berita & Informasi',
        desc: 'Update berita dan informasi terbaru seputar penanggulangan bencana di Kabupaten Indramayu.',
        href: news(),
        iconBg: 'bg-premium-blue-accent/10',
        iconColor: 'text-premium-blue-accent',
        badge: 'Terbaru',
        badgeColor: 'bg-premium-blue-accent/10 text-premium-blue-accent',
    },
    {
        icon: BookOpen,
        title: 'Panduan Kesiapsiagaan',
        desc: 'Panduan lengkap kesiapsiagaan menghadapi berbagai jenis bencana sebelum, saat, dan setelah kejadian.',
        href: preparedness(),
        iconBg: 'bg-premium-success/10',
        iconColor: 'text-premium-success',
        badge: null,
        badgeColor: '',
    },
    {
        icon: HelpCircle,
        title: 'Tanya Jawab (FAQ)',
        desc: 'Pertanyaan yang sering diajukan seputar sistem pelaporan, verifikasi, dan penanggulangan bencana.',
        href: faq(),
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

            <EthicalHero
                kicker="Pusat Informasi"
                title={
                    <>
                        Informasi{' '}
                        <span className="text-premium-blue-accent">Bencana</span> Terpadu
                    </>
                }
                subtitle="Akses peringatan dini terkini, berita terbaru, panduan kesiapsiagaan, dan tanya jawab seputar sistem tanggap darurat di Kabupaten Indramayu."
            />

            <div className="bg-premium-bg pb-20">
                {/* Categories Grid */}
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {CATEGORIES.map(({ icon: Icon, title, desc, href, iconBg, iconColor, badge, badgeColor }) => (
                            <Link
                                key={href.url}
                                href={href}
                                className="group flex flex-col h-full rounded-[24px] border border-premium-border bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.03)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-premium-bg to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-[100px]"></div>

                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className={`w-14 h-14 rounded-[16px] ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                                        <Icon className={`h-7 w-7 ${iconColor}`} />
                                    </div>
                                    {badge && (
                                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${badgeColor}`}>
                                            {badge}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-premium-heading mb-3 group-hover:text-premium-blue-accent transition-colors font-heading">
                                    {title}
                                </h3>
                                <p className="text-sm text-premium-body leading-relaxed flex-1 mb-6">
                                    {desc}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold text-premium-blue-accent group-hover:gap-3 transition-all mt-auto relative z-10">
                                    Lihat Detail
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
