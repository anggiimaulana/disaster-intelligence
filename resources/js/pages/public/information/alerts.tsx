import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Bell } from 'lucide-react';
import { information } from '@/routes/public';
import ActiveAlertCard from '@/components/public/home/ActiveAlertCard';
import { MOCK_ALERTS } from '@/data/mock/public/alerts';
import type { PageProps } from '@/types';

interface AlertsPageProps extends PageProps {
    isSimulation?: boolean;
}

export default function AlertsPage({ isSimulation }: AlertsPageProps) {
    return (
        <>
            <Head title="Peringatan Dini - Disaster Intelligence" />
            <div className="mx-auto max-w-[1240px] px-4 lg:px-6 py-8 lg:py-12">
                <Link
                    href={information()}
                    className="inline-flex items-center gap-1 text-sm text-[#003366] hover:text-[#002B5C] mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Informasi
                </Link>

                <div className="flex items-center gap-3 mb-6">
                    <Bell className="h-6 w-6 text-[#003366]" />
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-[#1F2937]">Peringatan Dini</h1>
                        <p className="text-sm text-[#6B7280]">
                            Peringatan dini bencana terkini di Kabupaten Indramayu
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {MOCK_ALERTS.map((alert) => (
                        <ActiveAlertCard key={alert.id} alert={alert} variant="full" />
                    ))}
                </div>
            </div>
        </>
    );
}
