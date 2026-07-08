import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { disasterMap } from '@/routes/public';
import { MOCK_MARKERS } from '@/data/mock/public/alerts';

const MapPreviewClient = lazy(() => import('./MapPreviewClient'));

interface MapPreviewCardProps {
    markerCount: number;
}

export default function MapPreviewCard({ markerCount }: MapPreviewCardProps) {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <section className="bg-[#F3F6FC] py-12 lg:py-16">
            <div className="mx-auto max-w-[1240px] px-4 lg:px-6">
                <div className="rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-sm">
                    <div className="grid lg:grid-cols-2 gap-0">
                        <div className="p-6 lg:p-10 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#E0E7FF] px-3 py-1 text-xs font-semibold text-[#003366] w-fit mb-4">
                                <MapPin className="h-3.5 w-3.5" />
                                Peta Bencana
                            </div>
                            <h2 className="text-xl lg:text-2xl font-bold text-[#1F2937] mb-3">
                                Pantau Sebaran Bencana
                            </h2>
                            <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
                                Lihat peta interaktif sebaran bencana terkini di Kabupaten Indramayu.
                                Filter berdasarkan jenis, tingkat risiko, dan kecamatan.
                            </p>
                            <div className="flex items-center gap-2 text-sm text-[#4B5563] mb-6">
                                <span className="font-semibold text-[#003366]">{markerCount} titik</span>
                                <span>kejadian terpantau saat ini</span>
                            </div>
                            <Button
                                asChild
                                className="w-fit bg-[#003366] text-white hover:bg-[#002B5C] rounded-xl px-6"
                            >
                                <Link href={disasterMap()}>
                                    Lihat Peta Lengkap
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="relative h-[240px] lg:h-[320px] w-full bg-[#E8EDF5]">
                            {isMounted && (
                                <Suspense fallback={<div className="flex h-full w-full items-center justify-center text-sm text-gray-500">Memuat peta...</div>}>
                                    <MapPreviewClient />
                                </Suspense>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
