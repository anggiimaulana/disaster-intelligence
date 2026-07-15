import { cn } from '@/lib/utils';
import { Search, CheckCircle2, AlertCircle, Shield, Gauge } from 'lucide-react';

interface SeoAnalyzerProps {
    seoTitle: string;
    setSeoTitle: (v: string) => void;
    seoDescription: string;
    setSeoDescription: (v: string) => void;
    seoKeywords: string;
    setSeoKeywords: (v: string) => void;
    /** Fallback title when seoTitle is empty */
    fallbackTitle: string;
    /** URL slug for preview */
    previewSlug?: string;
    /** Section label like "berita", "kesiapsiagaan", "faq" */
    sectionLabel?: string;
}

function getScoreColor(len: number, optimalMin: number, optimalMax: number) {
    if (len === 0) return 'text-slate-400 bg-slate-100';
    if (len >= optimalMin && len <= optimalMax) return 'text-green-700 bg-green-100';
    if (len > optimalMax) return 'text-red-700 bg-red-100';
    return 'text-orange-700 bg-orange-100';
}

function getScoreIcon(len: number, optimalMin: number, optimalMax: number) {
    if (len >= optimalMin && len <= optimalMax) {
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    }
    return <AlertCircle className={cn('h-4 w-4', len > optimalMax ? 'text-red-600' : 'text-orange-600')} />;
}

function computeOverallScore(titleLen: number, descLen: number, keywordsLen: number): { score: number; label: string; color: string } {
    let total = 0;

    // Title: 40 points
    if (titleLen >= 30 && titleLen <= 60) total += 40;
    else if (titleLen > 0 && titleLen < 30) total += 20;
    else if (titleLen > 60) total += 15;

    // Description: 40 points
    if (descLen >= 120 && descLen <= 160) total += 40;
    else if (descLen > 0 && descLen < 120) total += 20;
    else if (descLen > 160) total += 15;

    // Keywords: 20 points
    const keyCount = keywordsLen > 0 ? keywordsLen : 0;
    if (keyCount >= 3 && keyCount <= 8) total += 20;
    else if (keyCount > 0) total += 10;

    if (total >= 80) return { score: total, label: 'Bagus', color: 'text-green-600' };
    if (total >= 50) return { score: total, label: 'Cukup', color: 'text-orange-600' };
    return { score: total, label: 'Perlu Perbaikan', color: 'text-red-600' };
}

export default function SeoAnalyzer({
    seoTitle,
    setSeoTitle,
    seoDescription,
    setSeoDescription,
    seoKeywords,
    setSeoKeywords,
    fallbackTitle,
    previewSlug = 'preview-slug',
    sectionLabel = 'konten',
}: SeoAnalyzerProps) {
    const currentTitle = seoTitle || fallbackTitle || 'Judul Akan Tampil Di Sini';
    const titleLen = currentTitle.length;
    const descLen = seoDescription.length;
    const keywordsList = seoKeywords.split(',').filter((k) => k.trim() !== '');
    const overall = computeOverallScore(titleLen, descLen, keywordsList.length);

    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {/* Header with overall score */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-600" />
                    <h2 className="text-base font-bold text-slate-900">SEO Analyzer</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Gauge className={cn('h-5 w-5', overall.color)} />
                    <span className={cn('text-lg font-black', overall.color)}>{overall.score}</span>
                    <span className={cn('text-sm font-medium', overall.color)}>/ 100 — {overall.label}</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row">
                {/* SEO Input Area */}
                <div className="w-full lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-slate-200">
                    <div className="space-y-5">
                        <div>
                            <div className="mb-1.5 flex items-end justify-between">
                                <label className="block text-sm font-medium text-slate-700">SEO Title</label>
                                <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', getScoreColor(titleLen, 30, 60))}>
                                    {getScoreIcon(titleLen, 30, 60)}
                                    {titleLen} / 60
                                </span>
                            </div>
                            <input
                                type="text"
                                value={seoTitle}
                                onChange={(e) => setSeoTitle(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder={`Kosongkan untuk menggunakan judul ${sectionLabel} asli`}
                            />
                        </div>

                        <div>
                            <div className="mb-1.5 flex items-end justify-between">
                                <label className="block text-sm font-medium text-slate-700">SEO Description</label>
                                <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', getScoreColor(descLen, 120, 160))}>
                                    {getScoreIcon(descLen, 120, 160)}
                                    {descLen} / 160
                                </span>
                            </div>
                            <textarea
                                value={seoDescription}
                                onChange={(e) => setSeoDescription(e.target.value)}
                                rows={4}
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Tulis deskripsi singkat dan menarik untuk Google Search..."
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Keywords (Katakunci)</label>
                            <input
                                type="text"
                                value={seoKeywords}
                                onChange={(e) => setSeoKeywords(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="bencana, edukasi, evakuasi, bpbd (pisahkan dengan koma)"
                            />
                        </div>
                    </div>
                </div>

                {/* SEO Preview Area */}
                <div className="w-full lg:w-1/2 p-6 bg-slate-50 flex flex-col">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">
                        Live Search Preview
                    </h3>

                    <div className="flex-1 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="max-w-[600px]">
                            <div className="mb-1 flex items-center gap-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                    <Shield className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="mb-0.5 text-[13px] font-medium leading-none text-slate-900">
                                        Disaster Intelligence Portal
                                    </span>
                                    <span className="text-[12px] leading-none text-slate-500">
                                        https://di.bpbd.go.id › {sectionLabel} › {previewSlug}
                                    </span>
                                </div>
                            </div>
                            <h3 className="mb-1 cursor-pointer truncate text-[20px] font-medium leading-tight text-[#1a0dab] hover:underline">
                                {currentTitle}
                            </h3>
                            <p className="line-clamp-2 text-[14px] leading-[1.58] text-[#4d5156]">
                                <span className="text-slate-500">2 hari yang lalu — </span>
                                {seoDescription || `Tulis deskripsi konten Anda di kolom SEO Description untuk melihat preview bagaimana Google akan menampilkannya di hasil pencarian.`}
                            </p>
                        </div>
                    </div>

                    {keywordsList.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {keywordsList.slice(0, 6).map((keyword, i) => (
                                <span key={i} className="inline-block rounded-md bg-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                    {keyword.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
