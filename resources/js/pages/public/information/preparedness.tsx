import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Droplets, Wind, Flame, Mountain, AlertTriangle } from 'lucide-react';
import { EthicalHero } from '@/components/ui/hero-ethical';
import { information } from '@/routes/public';
import { MOCK_GUIDES } from '@/data/mock/public/articles'; // Fallback if needed, or remove
import type { PreparednessGuide } from '@/types/public-disaster';
import type { PageProps } from '@/types';

interface PreparednessPageProps extends PageProps {
    isSimulation?: boolean;
    guides: any[]; // Using any because the backend structure doesn't perfectly match PreparednessGuide right now
}

const ICONS: Record<string, React.ElementType> = {
    Droplets, Wind, Flame, Mountain, AlertTriangle,
};

export default function PreparednessPage({ isSimulation, guides = [] }: PreparednessPageProps) {
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
                        {guides.map((guide) => {
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

                                        {guide.content && (
                                            <div className="prose prose-lg max-w-none text-premium-body mt-4" dangerouslySetInnerHTML={{ __html: guide.content }} />
                                        )}
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
