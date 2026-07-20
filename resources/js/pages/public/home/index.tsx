import { Head } from '@inertiajs/react';
import HeroSection from '@/components/public/home/HeroSection';
import StatsSection from '@/components/public/home/StatsSection';
import MapPreviewCard from '@/components/public/home/MapPreviewCard';
import ReportStepsSection from '@/components/public/home/ReportStepsSection';
import WhyReportCard from '@/components/public/home/WhyReportCard';
import NewsSection from '@/components/public/home/NewsSection';
import WhatsAppCtaPanel from '@/components/public/home/WhatsAppCtaPanel';
import type { InformationArticle } from '@/types/public-disaster';
import type { PageProps } from '@/types';

interface HomePageProps extends PageProps {
    isSimulation?: boolean;
    markers?: any[];
    mapSettings?: any;
    disasterTypes?: any[];
    alerts?: any[];
    articles?: InformationArticle[];
}

export default function HomePage({ stats, alerts = [], markers = [], mapSettings = {}, disasterTypes = [], articles = [] }: HomePageProps) {
    return (
        <>
            <Head title="Beranda - Disaster Intelligence" />
            <HeroSection alerts={alerts} stats={stats} />
            <StatsSection stats={stats} />
            <MapPreviewCard 
                markerCount={markers.length} 
                markers={markers}
                mapSettings={mapSettings}
                disasterTypes={disasterTypes}
            />
            <ReportStepsSection />
            <WhyReportCard />
            {articles.length > 0 && <NewsSection articles={articles} />}
            <WhatsAppCtaPanel />
        </>
    );
}
