import { Head } from '@inertiajs/react';
import HeroSection from '@/components/public/home/HeroSection';
import StatsSection from '@/components/public/home/StatsSection';
import MapPreviewCard from '@/components/public/home/MapPreviewCard';
import ReportStepsSection from '@/components/public/home/ReportStepsSection';
import WhyReportCard from '@/components/public/home/WhyReportCard';
import NewsSection from '@/components/public/home/NewsSection';
import WhatsAppCtaPanel from '@/components/public/home/WhatsAppCtaPanel';
import { MOCK_ALERTS } from '@/data/mock/public/alerts';
import { MOCK_STATS } from '@/data/mock/public/stats';
import { MOCK_ARTICLES } from '@/data/mock/public/articles';
import type { PageProps } from '@/types';

interface HomePageProps extends PageProps {
    isSimulation?: boolean;
}

export default function HomePage({}: HomePageProps) {
    return (
        <>
            <Head title="Beranda - Disaster Intelligence" />
            <HeroSection alerts={MOCK_ALERTS} stats={MOCK_STATS} />
            <StatsSection stats={MOCK_STATS} />
            <MapPreviewCard markerCount={MOCK_ALERTS.length} />
            <ReportStepsSection />
            <WhyReportCard />
            <NewsSection articles={MOCK_ARTICLES} />
            <WhatsAppCtaPanel />
        </>
    );
}
