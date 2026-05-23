import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';
import { information } from '@/routes/public';
import { newsShow } from '@/routes/public/information';
import { MOCK_ARTICLES } from '@/data/mock/public/articles';
import type { PageProps } from '@/types';

interface NewsPageProps extends PageProps {
    isSimulation?: boolean;
}

export default function NewsPage({ isSimulation }: NewsPageProps) {
    return (
        <>
            <Head title="Berita & Informasi - Disaster Intelligence" />
            <div className="mx-auto max-w-[1240px] px-4 lg:px-6 py-8 lg:py-12">
                <Link
                    href={information()}
                    className="inline-flex items-center gap-1 text-sm text-[#003366] hover:text-[#002B5C] mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Informasi
                </Link>

                <h1 className="text-xl lg:text-2xl font-bold text-[#1F2937] mb-2">
                    Berita & Informasi
                </h1>
                <p className="text-sm text-[#6B7280] mb-8">
                    Update terbaru seputar penanggulangan bencana di Kabupaten Indramayu
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_ARTICLES.map((article) => (
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
                                <p className="text-xs text-[#6B7280] line-clamp-2">{article.excerpt}</p>
                                <div className="flex items-center gap-1 mt-3 text-xs font-medium text-[#003366]">
                                    Baca selengkapnya <ArrowRight className="h-3 w-3" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
