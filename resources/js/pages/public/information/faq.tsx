import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { ChevronDown, Search } from 'lucide-react';
import { EthicalHero } from '@/components/ui/hero-ethical';
import type { FaqItem } from '@/types/public-disaster';
import type { PageProps } from '@/types';

interface FaqPageProps extends PageProps {
    isSimulation?: boolean;
    faqs: FaqItem[];
}

export default function FaqPage({ isSimulation, faqs = [] }: FaqPageProps) {
    const [search, setSearch] = useState('');
    const [openId, setOpenId] = useState<string | null>(null);

    const filtered = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(search.toLowerCase()) ||
            faq.answer.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <>
            <Head title="FAQ - Disaster Intelligence" />
            <EthicalHero
                kicker="Tanya Jawab"
                title={
                    <>
                        FAQ &{' '}
                        <span className="text-premium-blue-accent">Bantuan</span>
                    </>
                }
                subtitle="Temukan jawaban untuk pertanyaan yang paling sering diajukan seputar sistem pelaporan dan penanggulangan bencana."
            />

            <div className="bg-premium-bg pb-20">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative mb-8">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-premium-caption" />
                            <input
                                type="text"
                                placeholder="Cari pertanyaan Anda di sini..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setOpenId(null); }}
                                className="w-full rounded-[20px] border border-premium-border bg-white py-4 pl-14 pr-6 text-base text-premium-heading placeholder:text-premium-caption focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent shadow-sm"
                            />
                        </div>

                        <div className="space-y-4">
                            {filtered.map((faq) => (
                                <div
                                    key={faq.id}
                                    className={`rounded-[20px] border transition-all duration-300 overflow-hidden ${
                                        openId === faq.id 
                                        ? 'bg-white border-premium-blue-accent/30 shadow-md ring-4 ring-premium-blue-accent/5' 
                                        : 'bg-white border-premium-border hover:border-premium-blue-accent/30 hover:shadow-sm'
                                    }`}
                                >
                                    <button
                                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                        className="flex w-full items-center justify-between px-6 py-5 text-left"
                                    >
                                        <span className={`text-base font-bold pr-4 transition-colors ${openId === faq.id ? 'text-premium-blue-accent' : 'text-premium-heading'}`}>
                                            {faq.question}
                                        </span>
                                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openId === faq.id ? 'bg-premium-blue-accent/10' : 'bg-premium-bg'}`}>
                                            <ChevronDown
                                                className={`h-5 w-5 transition-transform duration-300 ${
                                                    openId === faq.id ? 'rotate-180 text-premium-blue-accent' : 'text-premium-caption'
                                                }`}
                                            />
                                        </div>
                                    </button>
                                    <div 
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        <div className="px-6 pb-6 pt-2 text-base text-premium-body leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filtered.length === 0 && (
                                <div className="text-center py-16 bg-white rounded-[24px] border border-premium-border border-dashed">
                                    <Search className="h-10 w-10 text-premium-caption mx-auto mb-4" />
                                    <p className="text-base font-medium text-premium-heading">Tidak ada hasil yang ditemukan</p>
                                    <p className="text-sm text-premium-body mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
