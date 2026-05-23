import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Droplets, Wind, Flame, Mountain, AlertTriangle } from 'lucide-react';
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
            <div className="mx-auto max-w-[1240px] px-4 lg:px-6 py-8 lg:py-12">
                <Link
                    href={information()}
                    className="inline-flex items-center gap-1 text-sm text-[#003366] hover:text-[#002B5C] mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Informasi
                </Link>

                <h1 className="text-xl lg:text-2xl font-bold text-[#1F2937] mb-2">
                    Panduan Kesiapsiagaan
                </h1>
                <p className="text-sm text-[#6B7280] mb-8">
                    Panduan lengkap kesiapsiagaan menghadapi berbagai jenis bencana
                </p>

                <div className="space-y-8">
                    {MOCK_GUIDES.map((guide) => {
                        const Icon = ICONS[guide.icon] ?? AlertTriangle;

                        return (
                            <div
                                key={guide.id}
                                className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden"
                                id={guide.slug}
                            >
                                <div className="p-6 lg:p-8">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                                            guide.accent === 'blue' ? 'bg-blue-100 text-blue-600' :
                                            guide.accent === 'orange' ? 'bg-orange-100 text-orange-600' :
                                            guide.accent === 'red' ? 'bg-red-100 text-red-600' :
                                            guide.accent === 'slate' ? 'bg-slate-100 text-slate-600' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-[#1F2937]">{guide.title}</h2>
                                            <p className="text-sm text-[#6B7280] mt-1">{guide.description}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { label: 'Sebelum Kejadian', items: guide.before },
                                            { label: 'Saat Kejadian', items: guide.during },
                                            { label: 'Setelah Kejadian', items: guide.after },
                                        ].map((section) => (
                                            <div key={section.label}>
                                                <h3 className="text-sm font-bold text-[#1F2937] mb-3">{section.label}</h3>
                                                <ul className="space-y-2">
                                                    {section.items.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#4B5563]">
                                                            <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-green-500" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}

                                        <div className="bg-[#FFFBEB] border border-amber-200 rounded-xl p-4">
                                            <h4 className="text-sm font-bold text-[#92400E] mb-2">Perlengkapan yang Perlu Disiapkan:</h4>
                                            <div className="grid sm:grid-cols-2 gap-2">
                                                {guide.checklist.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-xs text-[#92400E]/80">
                                                        <CheckCircle className="h-3 w-3 shrink-0" />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
