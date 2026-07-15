import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Bell, Search, AlertTriangle, Info, MapPin } from 'lucide-react';
import { EthicalHero } from '@/components/ui/hero-ethical';
import { information } from '@/routes/public';
import ActiveAlertCard from '@/components/public/home/ActiveAlertCard';
import type { PublicAlert } from '@/types/public-disaster';
import type { PageProps } from '@/types';

interface AlertsPageProps extends PageProps {
    isSimulation?: boolean;
    alerts: PublicAlert[];
}

export default function AlertsPage({ isSimulation, alerts = [] }: AlertsPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [typeFilter, setTypeFilter] = useState('ALL');

    const filteredAlerts = alerts.filter((alert) => {
        const matchesSearch = 
            alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            alert.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (alert.village || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || alert.status === statusFilter;
        const matchesType = typeFilter === 'ALL' || alert.disasterType === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const activeCount = alerts.filter(a => a.status === 'AKTIF').length;
    const warningCount = alerts.filter(a => a.status === 'WASPADA').length;

    return (
        <>
            <Head title="Peringatan Dini - Disaster Intelligence" />
            <EthicalHero
                kicker="Status Siaga"
                title={
                    <>
                        Peringatan{' '}
                        <span className="text-premium-danger">Dini</span> Terkini
                    </>
                }
                subtitle="Pantau peringatan dini bencana terkini di Kabupaten Indramayu. Tetap waspada untuk keselamatan Anda dan keluarga."
            />

            <div className="bg-premium-bg pb-20">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                    <div className="max-w-4xl mx-auto space-y-6">
                        
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white rounded-[24px] p-6 border border-premium-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-premium-blue-accent/10 flex items-center justify-center">
                                        <Bell className="h-4 w-4 text-premium-blue-accent" />
                                    </div>
                                    <span className="text-sm font-bold text-premium-caption">Total Peringatan</span>
                                </div>
                                <div className="text-3xl font-black text-premium-heading font-heading">{alerts.length}</div>
                            </div>
                            <div className="bg-white rounded-[24px] p-6 border border-premium-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-premium-danger/10 flex items-center justify-center">
                                        <AlertTriangle className="h-4 w-4 text-premium-danger" />
                                    </div>
                                    <span className="text-sm font-bold text-premium-caption">Status Aktif</span>
                                </div>
                                <div className="text-3xl font-black text-premium-heading font-heading">{activeCount}</div>
                            </div>
                            <div className="bg-white rounded-[24px] p-6 border border-premium-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] col-span-2 lg:col-span-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-premium-warning/10 flex items-center justify-center">
                                        <Info className="h-4 w-4 text-premium-warning" />
                                    </div>
                                    <span className="text-sm font-bold text-premium-caption">Status Waspada</span>
                                </div>
                                <div className="text-3xl font-black text-premium-heading font-heading">{warningCount}</div>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="bg-white rounded-[24px] p-6 border border-premium-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-premium-caption" />
                                <input
                                    type="text"
                                    placeholder="Cari lokasi atau judul peringatan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-2xl border border-premium-border bg-premium-bg/50 py-3 pl-12 pr-4 text-sm text-premium-heading placeholder:text-premium-caption focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent"
                                />
                            </div>
                            <div className="flex gap-4">
                                <select 
                                    className="rounded-2xl border border-premium-border bg-premium-bg/50 py-3 px-4 text-sm text-premium-heading focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent appearance-none cursor-pointer"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="ALL">Semua Status</option>
                                    <option value="AKTIF">Status Aktif</option>
                                    <option value="WASPADA">Status Waspada</option>
                                </select>
                                <select 
                                    className="rounded-2xl border border-premium-border bg-premium-bg/50 py-3 px-4 text-sm text-premium-heading focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent appearance-none cursor-pointer"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                >
                                    <option value="ALL">Semua Bencana</option>
                                    <option value="BANJIR">Banjir</option>
                                    <option value="LONGSOR">Longsor</option>
                                    <option value="ANGIN_KENCANG">Angin Kencang</option>
                                </select>
                            </div>
                        </div>

                        {/* Alerts List */}
                        <div className="space-y-4">
                            {filteredAlerts.length > 0 ? (
                                filteredAlerts.map((alert) => (
                                    <ActiveAlertCard key={alert.id} alert={alert} variant="full" />
                                ))
                            ) : (
                                <div className="text-center py-16 bg-white rounded-[24px] border border-premium-border border-dashed">
                                    <MapPin className="h-10 w-10 text-premium-caption mx-auto mb-4" />
                                    <p className="text-base font-medium text-premium-heading">Tidak ada peringatan yang sesuai</p>
                                    <p className="text-sm text-premium-body mt-1">Coba ubah kata pencarian atau filter yang Anda gunakan.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
