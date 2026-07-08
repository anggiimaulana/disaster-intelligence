import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Droplets, Wind, Flame, Mountain, AlertTriangle } from 'lucide-react';
import { EthicalHero } from '@/components/ui/hero-ethical';
import { information } from '@/routes/public';
import { MOCK_GUIDES } from '@/data/mock/public/articles';
import type { PageProps } from '@/types';

interface PreparednessPageProps extends PageProps {
    isSimulation?: boolean;
}

const ICONS: Record<string, React.ElementType> = {
    Droplets, Wind, Flame, Mountain, AlertTriangle,
};

export default function PreparednessPage({ isSimulation }: PreparednessPageProps) {
    return (
        <>
            <Head title="Panduan Kesiapsiagaan - Disaster Intelligence" />
            <EthicalHero
                kicker="Panduan Lengkap"
                title={
                    <>
                        Panduan{' '}
                        <span className="text-premium-success">Kesiapsiagaan</span>
                    </>
                }
                subtitle="Pelajari langkah-langkah kesiapsiagaan menghadapi berbagai jenis bencana untuk meminimalisir risiko bagi Anda dan keluarga."
            />

            <div className="bg-premium-bg pb-20">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                    <div className="space-y-10 max-w-5xl mx-auto">
                        {MOCK_GUIDES.map((guide) => {
                            const Icon = ICONS[guide.icon] ?? AlertTriangle;

                            return (
                                <div
                                    key={guide.id}
                                    className="rounded-[32px] border border-premium-border bg-white overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(15,23,42,0.06)] transition-all"
                                    id={guide.slug}
                                >
                                    <div className="p-8 lg:p-10">
                                        <div className="flex items-start gap-6 mb-8 pb-8 border-b border-premium-border">
                                            <div className={`shrink-0 w-16 h-16 rounded-[20px] flex items-center justify-center ${
                                                guide.accent === 'blue' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                guide.accent === 'orange' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                                guide.accent === 'red' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                guide.accent === 'slate' ? 'bg-slate-50 text-slate-600 border border-slate-100' :
                                                'bg-gray-50 text-gray-600 border border-gray-100'
                                            }`}>
                                                <Icon className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-premium-heading font-heading mb-2">{guide.title}</h2>
                                                <p className="text-base text-premium-body leading-relaxed max-w-3xl">{guide.description}</p>
                                            </div>
                                        </div>

                                        <div className="grid lg:grid-cols-3 gap-8 mb-8">
                                            {[
                                                { label: 'Sebelum Kejadian', items: guide.before },
                                                { label: 'Saat Kejadian', items: guide.during },
                                                { label: 'Setelah Kejadian', items: guide.after },
                                            ].map((section) => (
                                                <div key={section.label} className="bg-premium-bg/50 rounded-[20px] p-6 border border-premium-border/50">
                                                    <h3 className="text-sm font-bold text-premium-heading mb-4 uppercase tracking-wider">{section.label}</h3>
                                                    <ul className="space-y-3">
                                                        {section.items.map((item, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-sm text-premium-body">
                                                                <CheckCircle className="h-5 w-5 shrink-0 text-premium-success mt-0.5" />
                                                                <span className="leading-relaxed">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-amber-50 border border-amber-200/50 rounded-[24px] p-6 lg:p-8">
                                            <h4 className="text-base font-bold text-amber-900 mb-4 font-heading flex items-center gap-2">
                                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                                                Perlengkapan Darurat (Tas Siaga Bencana)
                                            </h4>
                                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {guide.checklist.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-2.5 text-sm font-medium text-amber-900/80 bg-white/50 px-4 py-2.5 rounded-[12px] border border-amber-200/30">
                                                        <CheckCircle className="h-4 w-4 shrink-0 text-amber-500" />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
