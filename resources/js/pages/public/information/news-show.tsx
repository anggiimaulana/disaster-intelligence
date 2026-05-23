import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { news } from '@/routes/public/information';
import { newsShow } from '@/routes/public/information';
import { MOCK_ARTICLES } from '@/data/mock/public/articles';
import type { PageProps } from '@/types';

interface NewsShowPageProps extends PageProps {
    isSimulation?: boolean;
    slug: string;
}

export default function NewsShowPage({ isSimulation, slug }: NewsShowPageProps) {
    const article = MOCK_ARTICLES.find((a) => a.slug === slug) ?? MOCK_ARTICLES[0];
    const relatedArticles = MOCK_ARTICLES.filter((a) => a.id !== article.id).slice(0, 2);

    return (
        <>
            <Head title={`${article.title} - Disaster Intelligence`} />
            <div className="mx-auto max-w-[1240px] px-4 lg:px-6 py-8 lg:py-12">
                <Link
                    href={news()}
                    className="inline-flex items-center gap-1 text-sm text-[#003366] hover:text-[#002B5C] mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Berita
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    <article className="lg:col-span-2">
                        <div className="bg-[#E8EDF5] h-56 lg:h-72 rounded-2xl overflow-hidden mb-6">
                            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex items-center gap-3 text-xs text-[#6B7280] mb-3">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(article.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            {article.tags.map((tag) => (
                                <span key={tag} className="flex items-center gap-1 bg-[#F3F4F6] rounded-full px-2 py-0.5">
                                    <Tag className="h-3 w-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-xl lg:text-2xl font-bold text-[#1F2937] mb-4">
                            {article.title}
                        </h1>

                        <div className="prose prose-sm max-w-none text-[#4B5563]">
                            <p className="text-base leading-relaxed mb-4">{article.excerpt}</p>
                            <p className="text-base leading-relaxed mb-4">
                                Memasuki puncak musim hujan, BPBD Kabupaten Indramayu mengimbau
                                seluruh warga untuk meningkatkan kewaspadaan terhadap potensi bencana
                                hidrometeorologi seperti banjir, angin kencang, dan tanah longsor.
                            </p>
                            <p className="text-base leading-relaxed mb-4">
                                Berdasarkan data dari BMKG, curah hujan di wilayah Kabupaten Indramayu
                                diprediksi akan meningkat hingga 40% dalam beberapa pekan ke depan.
                                Masyarakat diimbau untuk selalu memantau informasi cuaca terkini dan
                                mengikuti arahan dari petugas BPBD.
                            </p>
                            <p className="text-base leading-relaxed">
                                BPBD telah menyiagakan personel di setiap kecamatan dan membuka posko
                                siaga bencana 24 jam. Masyarakat yang membutuhkan bantuan darurat
                                dapat menghubungi call center BPBD di nomor (0234) XXXXX.
                            </p>
                        </div>
                    </article>

                    <aside className="space-y-4">
                        <h3 className="text-sm font-bold text-[#1F2937]">Berita Terkait</h3>
                        {relatedArticles.map((related) => (
                            <Link
                                key={related.id}
                                href={newsShow({ slug: related.slug })}
                                className="block rounded-xl border border-[#E5E7EB] p-4 hover:bg-[#F9FAFB] transition-colors"
                            >
                                <p className="text-xs text-[#6B7280] mb-1">
                                    {new Date(related.publishedAt).toLocaleDateString('id-ID')}
                                </p>
                                <p className="text-sm font-medium text-[#1F2937] line-clamp-2">
                                    {related.title}
                                </p>
                            </Link>
                        ))}
                    </aside>
                </div>
            </div>
        </>
    );
}
