import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';
import SeoAnalyzer from '@/components/ui/seo-analyzer';

interface Item {
    id: number;
    question: string;
    answer: string;
    sort_order: number;
    is_active: boolean;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;
}

export default function FaqForm() {
    const { item, errors } = usePage<{ item?: Item; errors?: Record<string, string> }>().props;
    const isEdit = !!item;

    const [question, setQuestion] = useState(item?.question || '');
    const [answer, setAnswer] = useState(item?.answer || '');
    const [sortOrder, setSortOrder] = useState(item?.sort_order ?? 0);
    const [isActive, setIsActive] = useState(item?.is_active ?? true);
    const [seoTitle, setSeoTitle] = useState(item?.seo_title || '');
    const [seoDescription, setSeoDescription] = useState(item?.seo_description || '');
    const [seoKeywords, setSeoKeywords] = useState(item?.seo_keywords || '');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const data = {
            question,
            answer,
            sort_order: sortOrder,
            is_active: isActive,
            seo_title: seoTitle || null,
            seo_description: seoDescription || null,
            seo_keywords: seoKeywords || null,
        };

        if (isEdit && item) {
            router.put(`/cms/faq/${item.id}`, data, {
                preserveScroll: true,
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post('/cms/faq', data, {
                preserveScroll: true,
                onFinish: () => setSubmitting(false),
            });
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit FAQ' : 'Tambah FAQ'} />

            <div className="mb-5">
                <a href="/cms/faq" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                    <ArrowLeft className="h-4 w-4" /> Kembali
                </a>
                <h1 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit FAQ' : 'Tambah FAQ Baru'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 pb-20">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-base font-bold text-slate-900">Pertanyaan & Jawaban</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Pertanyaan *</label>
                            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" placeholder="Masukkan pertanyaan" />
                            {errors?.question && <p className="mt-1 text-xs text-red-600">{errors.question}</p>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Jawaban *</label>
                            <RichTextEditor value={answer} onChange={setAnswer} placeholder="Tulis jawaban lengkap..." minHeight="200px" />
                            {errors?.answer && <p className="mt-1 text-xs text-red-600">{errors.answer}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Urutan</label>
                                <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
                                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-medium text-slate-700">Aktif (Ditampilkan)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <SeoAnalyzer
                    seoTitle={seoTitle}
                    setSeoTitle={setSeoTitle}
                    seoDescription={seoDescription}
                    setSeoDescription={setSeoDescription}
                    seoKeywords={seoKeywords}
                    setSeoKeywords={setSeoKeywords}
                    fallbackTitle={question}
                    previewSlug="faq"
                    sectionLabel="faq"
                />

                <div className="flex items-center justify-end gap-3 pt-4">
                    <a href="/cms/faq" className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Batal</a>
                    <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 shadow-sm">
                        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isEdit ? 'Simpan Perubahan' : 'Simpan'}
                    </button>
                </div>
            </form>
        </>
    );
}
