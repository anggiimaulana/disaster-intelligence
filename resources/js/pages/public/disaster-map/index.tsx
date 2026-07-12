import { useState, useEffect, lazy, Suspense } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    AlertTriangle,
    MapPin,
    Waves,
    Mountain,
    Flame,
    Wind,
    MoreHorizontal,
    Activity,
    Map as MapIcon,
} from 'lucide-react';
import { home, laporBencana } from '@/routes';
import { getDisasterLabel } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { EthicalHero } from '@/components/ui/hero-ethical';
import { MOCK_MARKERS } from '@/data/mock/public/alerts';
import type { PageProps } from '@/types';

const DisasterMapClient = lazy(() => import('./DisasterMapClient'));

interface DisasterMapPageProps extends PageProps {
    isSimulation?: boolean;
}

const DISASTER_TYPES = ['BANJIR', 'LONGSOR', 'KEBAKARAN', 'ANGIN_KENCANG', 'LAINNYA'] as const;

const legendItems = [
    { type: 'BANJIR', label: 'Banjir', color: '#1E88FF', icon: Waves },
    { type: 'LONGSOR', label: 'Longsor', color: '#F59E0B', icon: Mountain },
    { type: 'KEBAKARAN', label: 'Kebakaran', color: '#EF4444', icon: Flame },
    { type: 'ANGIN_KENCANG', label: 'Angin Kencang', color: '#22C55E', icon: Wind },
    { type: 'LAINNYA', label: 'Lainnya', color: '#8B5CF6', icon: MoreHorizontal },
];

export default function DisasterMapPage({}: DisasterMapPageProps) {
    const [selectedType, setSelectedType] = useState('all');
    const [isMounted, setIsMounted] = useState(false);
    const [showControls, setShowControls] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const filteredMarkers =
        selectedType === 'all'
            ? MOCK_MARKERS
            : MOCK_MARKERS.filter((m) => m.type === selectedType);

    const countByType = MOCK_MARKERS.reduce((acc, m) => {
        acc[m.type] = (acc[m.type] ?? 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const activeAlertCount = MOCK_MARKERS.filter((m) => m.status === 'active_alert').length;

    return (
        <>
            <Head title="Peta Bencana - Disaster Intelligence" />

            <EthicalHero
                kicker="Peta Interaktif"
                title={
                    <>
                        Pantau Sebaran{' '}
                        <span className="text-premium-blue-accent">Bencana</span> Real-time
                    </>
                }
                subtitle="Visualisasi geografis kejadian bencana di Kabupaten Indramayu. Filter berdasarkan jenis bencana, lihat detail lokasi, dan akses laporan warga secara langsung."
                primary={{ label: 'Lapor Darurat', href: laporBencana() }}
                meta="Diperbarui setiap 5 menit · Sumber: BPBD & laporan warga"
            />

            <div className="bg-premium-bg pb-16">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                    {/* Mobile controls toggle */}
                    <div className="lg:hidden mb-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowControls((v) => !v)}
                            className="w-full justify-between h-12 rounded-2xl border-premium-border bg-white"
                        >
                            <span className="flex items-center gap-2 text-sm font-semibold text-premium-heading">
                                <Activity className="h-4 w-4 text-premium-blue-accent" />
                                Filter & Ringkasan
                            </span>
                            <span className="text-xs font-semibold text-premium-blue-accent">
                                {showControls ? 'Sembunyikan' : 'Tampilkan'}
                            </span>
                        </Button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 lg:h-[720px]">
                        {/* LEFT PANEL */}
                        <div
                            className={`w-full lg:w-[320px] shrink-0 flex flex-col gap-6 ${
                                showControls ? 'block' : 'hidden lg:flex'
                            }`}
                        >
                            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-premium-border text-center">
                                <h3 className="text-sm font-bold text-premium-heading mb-4 uppercase tracking-wider">
                                    Filter Kategori
                                </h3>
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger className="w-full h-11 rounded-[12px] border-premium-border bg-premium-bg text-sm font-medium text-premium-heading focus:ring-premium-blue-accent">
                                        <SelectValue placeholder="Semua Jenis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Jenis Bencana</SelectItem>
                                        {DISASTER_TYPES.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {getDisasterLabel(t)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-premium-border flex-1 flex flex-col gap-4">
                                <h3 className="text-sm font-bold text-premium-heading mb-2 uppercase tracking-wider">
                                    Ringkasan Aktif
                                </h3>

                                <div className="flex items-center gap-4 p-4 rounded-[16px] bg-red-50 border border-red-100">
                                    <div className="w-12 h-12 rounded-[12px] bg-white flex items-center justify-center shrink-0 shadow-sm text-premium-danger">
                                        <Activity className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-premium-heading font-heading leading-none">
                                            {activeAlertCount}
                                        </p>
                                        <p className="text-xs font-medium text-premium-body mt-1">
                                            Status Waspada
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-[16px] bg-blue-50 border border-blue-100">
                                    <div className="w-12 h-12 rounded-[12px] bg-white flex items-center justify-center shrink-0 shadow-sm text-premium-blue-accent">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-premium-heading font-heading leading-none">
                                            {MOCK_MARKERS.length}
                                        </p>
                                        <p className="text-xs font-medium text-premium-body mt-1">
                                            Total Laporan Masuk
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-premium-border">
                                    <h4 className="text-xs font-bold text-premium-heading mb-3 uppercase tracking-wider">
                                        Legenda
                                    </h4>
                                    <div className="space-y-2.5">
                                        {legendItems.map((item) => {
                                            const Icon = item.icon;
                                            const count = countByType[item.type] ?? 0;
                                            return (
                                                <div
                                                    key={item.type}
                                                    className="flex items-center justify-between group cursor-pointer"
                                                    onClick={() => setSelectedType(item.type)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="flex h-7 w-7 items-center justify-center rounded-[8px] transition-transform group-hover:scale-110"
                                                            style={{ backgroundColor: item.color + '15' }}
                                                        >
                                                            <Icon
                                                                className="h-3.5 w-3.5"
                                                                style={{ color: item.color }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium text-premium-body group-hover:text-premium-heading transition-colors">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-bold text-premium-heading bg-premium-bg px-2 py-0.5 rounded-md">
                                                        {count}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PANEL: Map */}
                        <div className="flex-1 relative h-[420px] sm:h-[520px] lg:h-full min-h-[420px] lg:min-h-0 rounded-3xl sm:rounded-[32px] overflow-hidden border border-premium-border shadow-[0_10px_30px_rgba(15,23,42,0.06)] bg-premium-border">
                            {isMounted ? (
                                <Suspense
                                    fallback={
                                        <div className="flex h-full w-full items-center justify-center gap-2 text-sm text-premium-body bg-premium-bg">
                                            <MapIcon className="h-5 w-5 animate-pulse text-premium-blue-accent" />
                                            Memuat peta...
                                        </div>
                                    }
                                >
                                    <DisasterMapClient filteredMarkers={filteredMarkers} />
                                </Suspense>
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm text-premium-body bg-premium-bg">
                                    Menyiapkan peta...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* PANDUAN PETA SECTION */}
            <div id="panduan-peta" className="scroll-mt-24 bg-premium-bg pb-20">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                    <div className="mx-auto max-w-3xl text-center mb-12">
                        <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-premium-blue-accent">
                            <span aria-hidden className="h-px w-6 bg-premium-blue-accent/60" />
                            Panduan
                            <span aria-hidden className="h-px w-6 bg-premium-blue-accent/60" />
                        </p>
                        <h2 className="text-balance text-2xl font-semibold tracking-[-0.01em] text-premium-heading sm:text-3xl">
                            Cara Membaca Peta Bencana
                        </h2>
                        <p className="mt-4 text-sm text-premium-body sm:text-base">
                            Pahami simbol, warna, dan interaksi pada peta untuk mendapatkan informasi sebaran bencana yang akurat.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-2xl border border-premium-border bg-white p-6">
                            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-premium-blue-accent/10 text-sm font-semibold text-premium-blue-accent">
                                01
                            </div>
                            <h3 className="text-base font-semibold text-premium-heading">Identifikasi Simbol</h3>
                            <p className="mt-2 text-sm leading-relaxed text-premium-body">
                                Setiap lingkaran berwarna menandai satu laporan. Warna mengikuti jenis bencana: biru untuk banjir, oranye untuk longsor, merah untuk kebakaran, hijau untuk angin kencang, dan ungu untuk kejadian lainnya.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-premium-border bg-white p-6">
                            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-premium-blue-accent/10 text-sm font-semibold text-premium-blue-accent">
                                02
                            </div>
                            <h3 className="text-base font-semibold text-premium-heading">Filter & Ringkasan</h3>
                            <p className="mt-2 text-sm leading-relaxed text-premium-body">
                                Gunakan menu Filter Kategori di samping untuk memfokuskan peta pada satu jenis bencana. Klik item legenda untuk menyaring dengan cepat.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-premium-border bg-white p-6">
                            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-premium-blue-accent/10 text-sm font-semibold text-premium-blue-accent">
                                03
                            </div>
                            <h3 className="text-base font-semibold text-premium-heading">Klik untuk Detail</h3>
                            <p className="mt-2 text-sm leading-relaxed text-premium-body">
                                Klik marker untuk melihat informasi lengkap: jenis bencana, kecamatan, desa, dan status penanganan. Peta diperbarui setiap 5 menit.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
