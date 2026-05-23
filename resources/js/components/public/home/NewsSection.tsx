import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { news, newsShow } from '@/routes/public/information';
import type { InformationArticle } from '@/types/public-disaster';

interface NewsSectionProps {
    articles: InformationArticle[];
}

export default function NewsSection({ articles }: NewsSectionProps) {
    return (
        <section className="bg-[#F9FAFB] py-12 lg:py-16">
            <div className="mx-auto max-w-[1240px] px-4 lg:px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-[#1F2937]">
                            Berita & Informasi
                        </h2>
                        <p className="text-sm text-[#6B7280] mt-1">
                            Update terbaru seputar penanggulangan bencana
                        </p>
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        className="hidden sm:flex border-[#E5E7EB] text-[#4B5563] rounded-xl"
                    >
                        <Link href={news()}>
                            Lihat Semua
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.slice(0, 3).map((article) => (
                        <Link
                            key={article.id}
                            href={newsShow({ slug: article.slug })}
                            className="group rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="bg-[#E8EDF5] h-44 overflow-hidden">
                                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(article.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <h3 className="text-sm font-bold text-[#1F2937] group-hover:text-[#003366] transition-colors line-clamp-2 mb-2">
                                    {article.title}
                                </h3>
                                <p className="text-xs text-[#6B7280] line-clamp-2">
                                    {article.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
