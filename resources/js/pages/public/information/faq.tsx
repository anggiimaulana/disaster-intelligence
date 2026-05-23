import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ChevronDown, Search } from 'lucide-react';
import { information } from '@/routes/public';
import { MOCK_FAQS } from '@/data/mock/public/articles';
import type { PageProps } from '@/types';

interface FaqPageProps extends PageProps {
    isSimulation?: boolean;
}

export default function FaqPage({ isSimulation }: FaqPageProps) {
    const [search, setSearch] = useState('');
    const [openId, setOpenId] = useState<string | null>(null);

    const filtered = MOCK_FAQS.filter(
        (faq) =>
            faq.question.toLowerCase().includes(search.toLowerCase()) ||
            faq.answer.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <>
            <Head title="FAQ - Disaster Intelligence" />
            <div className="mx-auto max-w-[1240px] px-4 lg:px-6 py-8 lg:py-12">
                <Link
                    href={information()}
                    className="inline-flex items-center gap-1 text-sm text-[#003366] hover:text-[#002B5C] mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Informasi
                </Link>

                <h1 className="text-xl lg:text-2xl font-bold text-[#1F2937] mb-2">
                    Tanya Jawab (FAQ)
                </h1>
                <p className="text-sm text-[#6B7280] mb-6">
                    Pertanyaan yang sering diajukan seputar sistem dan pelaporan bencana
                </p>

                <div className="relative max-w-md mb-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <input
                        type="text"
                        placeholder="Cari pertanyaan..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setOpenId(null); }}
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                    />
                </div>

                <div className="space-y-3 max-w-3xl">
                    {filtered.map((faq) => (
                        <div
                            key={faq.id}
                            className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-[#1F2937] hover:bg-[#F9FAFB] transition-colors"
                            >
                                <span className="pr-4">{faq.question}</span>
                                <ChevronDown
                                    className={`h-4 w-4 shrink-0 text-[#6B7280] transition-transform ${
                                        openId === faq.id ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            {openId === faq.id && (
                                <div className="px-5 pb-4 text-sm text-[#6B7280] leading-relaxed border-t border-[#E5E7EB] pt-3">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <p className="text-sm text-[#9CA3AF] text-center py-8">
                            Tidak ada hasil yang ditemukan untuk &quot;{search}&quot;
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
