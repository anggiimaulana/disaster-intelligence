import { Head } from '@inertiajs/react';
import type { DashboardProps } from '@/types';
import { StatCardsRow } from './components/stat-cards-row';
import { LatestReports } from './components/latest-reports';
import { ReportTrendChart } from './components/report-trend-chart';
import { ReportByTypeChart } from './components/report-by-type-chart';
import { RiskGauge } from './components/risk-gauge';
import { EventMap } from './components/event-map';

export default function Dashboard({ stats, mapMarkers, laporanTerbaru, trendData, laporanByJenis, risikoKeseluruhan, filters }: DashboardProps) {
    return (
        <div className="w-full min-w-0 max-w-full pb-10 overflow-x-hidden">
            <Head title="Dashboard" />

            {/* Stat Cards Row */}
            <StatCardsRow stats={stats} />

            {/* Map + Latest Reports — SIDE BY SIDE on desktop, stacked on mobile */}
            <div className="mt-5 flex flex-col gap-5 lg:flex-row">
                <div className="min-w-0 flex-1 min-h-[400px]">
                    <EventMap markers={mapMarkers} filters={filters} />
                </div>
                <div className="w-full flex-shrink-0 lg:w-[320px] xl:w-[340px]">
                    <LatestReports reports={laporanTerbaru} />
                </div>
            </div>

            {/* Charts Row — grid-3 desktop, grid-1 mobile */}
            <div className="mt-5 mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <ReportTrendChart data={trendData} />
                <ReportByTypeChart data={laporanByJenis} />
                <RiskGauge score={risikoKeseluruhan.score} label={risikoKeseluruhan.label} />
            </div>
        </div>
    );
}
