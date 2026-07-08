import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';
import { EthicalHero } from '@/components/ui/hero-ethical';
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
            <EthicalHero
                kicker="Publikasi"
                title={
                    <>
                        Berita &{' '}
                        <span className="text-premium-blue-accent">Informasi</span>
                    </>
                }
                subtitle="Update terbaru seputar penanggulangan bencana, kegiatan BPBD, dan informasi penting lainnya di Kabupaten Indramayu."
            />

            <div className="bg-premium-bg pb-20">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {MOCK_ARTICLES.map((article) => (
                            <Link
                                key={article.id}
                                href={newsShow({ slug: article.slug })}
                                className="group flex flex-col rounded-[24px] bg-white border border-premium-border overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="h-52 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-premium-navy/10 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img 
                                        src={article.imageUrl} 
                                        alt={article.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                                    />
                                    <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                                        <Calendar className="h-3.5 w-3.5 text-premium-blue-accent" />
                                        <span className="text-[11px] font-bold text-premium-heading">
                                            {new Date(article.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold text-premium-heading group-hover:text-premium-blue-accent transition-colors line-clamp-2 mb-3 font-heading leading-snug">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-premium-body line-clamp-3 mb-6 flex-1 leading-relaxed">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-premium-border text-sm font-bold text-premium-blue-accent group-hover:gap-3 transition-all">
                                        Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
