import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Tag, ArrowRight } from 'lucide-react';
import { news } from '@/routes/public/information';
import { newsShow } from '@/routes/public/information';
import type { InformationArticle } from '@/types/public-disaster';
import type { PageProps } from '@/types';

interface NewsShowPageProps extends PageProps {
    isSimulation?: boolean;
    slug: string;
    article: InformationArticle;
    relatedArticles: InformationArticle[];
}

export default function NewsShowPage({ isSimulation, slug, article, relatedArticles = [] }: NewsShowPageProps) {

    return (
        <>
            <Head title={`${article.title} - Disaster Intelligence`} />
            <div className="bg-premium-bg min-h-screen py-10 lg:py-16">
                <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
                    <Link
                        href={news()}
                        className="inline-flex items-center gap-2 text-sm font-medium text-premium-body hover:text-premium-blue-hover transition-colors mb-8 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Daftar Publikasi
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-10">
                        <article className="lg:col-span-2">
                            {/* Article Header */}
                            <div className="mb-8">
                                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-premium-caption mb-4 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5 text-premium-blue-accent bg-premium-blue-accent/10 px-3 py-1 rounded-full">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(article.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                    {article.tags?.map((tag) => (
                                        <span key={tag} className="flex items-center gap-1 bg-white border border-premium-border px-3 py-1 rounded-full text-premium-body shadow-sm">
                                            <Tag className="h-3.5 w-3.5" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-premium-heading mb-6 font-heading leading-tight tracking-tight">
                                    {article.title}
                                </h1>
                            </div>

                            {/* Featured Image */}
                            <div className="rounded-[32px] overflow-hidden mb-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)] relative group border-4 border-white">
                                <div className="absolute inset-0 bg-premium-navy/10 z-10 transition-colors group-hover:bg-transparent"></div>
                                <img 
                                    src={article.imageUrl} 
                                    alt={article.title} 
                                    className="w-full h-[300px] lg:h-[450px] object-cover transition-transform duration-1000 group-hover:scale-105" 
                                />
                            </div>

                            {/* Article Body */}
                            <div className="prose prose-lg max-w-none text-premium-body font-sans leading-relaxed">
                                {article.excerpt && (
                                    <p className="text-lg leading-relaxed mb-6 font-medium text-premium-heading border-l-4 border-premium-blue-accent pl-6 bg-premium-blue-accent/5 py-4 rounded-r-xl">
                                        {article.excerpt}
                                    </p>
                                )}
                                <div dangerouslySetInnerHTML={{ __html: article.content || '' }} />
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="space-y-6 lg:pl-4">
                            <div className="sticky top-28 bg-white rounded-[24px] border border-premium-border p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-premium-heading mb-4 font-heading border-b border-premium-border pb-3">Baca Juga</h3>
                                <div className="space-y-4">
                                    {relatedArticles.map((related) => (
                                        <Link
                                            key={related.id}
                                            href={newsShow({ slug: related.slug })}
                                            className="group block py-3 border-b border-premium-border/50 last:border-0 last:pb-0"
                                        >
                                            <p className="text-xs font-bold text-premium-blue-accent mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(related.publishedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <p className="text-sm font-bold text-premium-heading group-hover:text-premium-blue-accent transition-colors line-clamp-2 leading-snug">
                                                {related.title}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 text-center">
                                    <Link href={news()} className="inline-flex items-center justify-center gap-2 text-sm font-bold text-premium-blue-accent hover:text-premium-blue-hover transition-colors">
                                        Lihat Semua Berita <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
