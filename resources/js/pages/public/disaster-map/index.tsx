import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, AlertTriangle, MapPin, Waves, Mountain, Flame, Wind, MoreHorizontal } from 'lucide-react';
import { home } from '@/routes';
import { report } from '@/routes/public';
import { getDisasterLabel } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_MARKERS } from '@/data/mock/public/alerts';
import type { PageProps } from '@/types';

interface DisasterMapPageProps extends PageProps {
    isSimulation?: boolean;
}

const INDRAMAYU_CENTER: [number, number] = [-6.42, 108.20];
const INDRAMAYU_ZOOM = 11;

const DISASTER_TYPES = ['BANJIR', 'LONGSOR', 'KEBAKARAN', 'ANGIN_KENCANG', 'LAINNYA'] as const;

function getMarkerColor(type: string): string {
    const map: Record<string, string> = { BANJIR: '#3B82F6', LONGSOR: '#F59E0B', KEBAKARAN: '#EF4444', ANGIN_KENCANG: '#22C55E', LAINNYA: '#8B5CF6' };
    return map[type] ?? '#94A3B8';
}

const legendItems = [
    { type: 'BANJIR', label: 'Banjir', color: '#3B82F6', icon: Waves },
    { type: 'LONGSOR', label: 'Longsor', color: '#F59E0B', icon: Mountain },
    { type: 'KEBAKARAN', label: 'Kebakaran', color: '#EF4444', icon: Flame },
    { type: 'ANGIN_KENCANG', label: 'Angin Kencang', color: '#22C55E', icon: Wind },
    { type: 'LAINNYA', label: 'Lainnya', color: '#8B5CF6', icon: MoreHorizontal },
];

export default function DisasterMapPage({}: DisasterMapPageProps) {
    const [selectedType, setSelectedType] = useState('all');

    const filteredMarkers = selectedType === 'all'
        ? MOCK_MARKERS
        : MOCK_MARKERS.filter((m) => m.type === selectedType);

    const countByType = MOCK_MARKERS.reduce((acc, m) => {
        acc[m.type] = (acc[m.type] ?? 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const activeAlertCount = MOCK_MARKERS.filter((m) => m.status === 'active_alert' || m.status === 'waspada').length;

    return (
        <>
            <Head title="Peta Bencana - Disaster Intelligence" />
            <div className="mx-auto max-w-[1240px] px-4 lg:px-6 py-8 lg:py-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-1 text-sm text-[#003366] hover:text-[#002B5C] mb-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                        <h1 className="text-xl lg:text-2xl font-bold text-[#1F2937]">Peta Bencana</h1>
                        <p className="text-sm text-[#6B7280] mt-1">
                            Pantau sebaran bencana terkini di Kabupaten Indramayu
                        </p>
                    </div>
                    <Link
                        href={report()}
                        className="inline-flex items-center gap-2 bg-[#003366] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#002B5C] transition-colors"
                    >
                        <AlertTriangle className="h-4 w-4" />
                        Lapor Bencana
                    </Link>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">{activeAlertCount}</p>
                            <p className="text-xs text-[#6B7280]">Titik kejadian terpantau</p>
                        </div>
                    </div>
                    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                            <MapPin className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">{MOCK_MARKERS.length}</p>
                            <p className="text-xs text-[#6B7280]">Total laporan masuk</p>
                        </div>
                    </div>
                    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <Waves className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1F2937]">31</p>
                            <p className="text-xs text-[#6B7280]">Kecamatan di Indramayu</p>
                        </div>
                    </div>
                </div>

                <div className="flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 md:px-5">
                        <h3 className="text-sm font-bold text-slate-900">PETA SEBARAN KEJADIAN</h3>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="h-8 w-[130px] rounded-full border-blue-200 bg-blue-50 text-[11px] text-blue-700 md:w-[150px]">
                                <SelectValue placeholder="Semua Jenis" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Jenis Bencana</SelectItem>
                                {DISASTER_TYPES.map((t) => (
                                    <SelectItem key={t} value={t}>{getDisasterLabel(t)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="relative h-[400px] lg:h-[500px] w-full">
                        <div className="absolute top-3 left-3 z-[1000] space-y-1.5 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur-sm border border-slate-100">
                            {legendItems.map((item) => {
                                const Icon = item.icon;
                                const count = countByType[item.type] ?? 0;
                                return (
                                    <div key={item.type} className="flex items-center gap-2">
                                        <div className="flex h-5 w-5 items-center justify-center rounded" style={{ backgroundColor: item.color + '20' }}>
                                            <Icon className="h-3 w-3" style={{ color: item.color }} />
                                        </div>
                                        <span className="text-[10px] font-medium text-slate-700">{item.label}</span>
                                        <span className="text-[10px] font-bold text-slate-900">{count}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <MapContainer
                            center={INDRAMAYU_CENTER}
                            zoom={INDRAMAYU_ZOOM}
                            className="h-full w-full"
                            style={{ zIndex: 0 }}
                            zoomControl={true}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {filteredMarkers.map((marker) => (
                                <CircleMarker
                                    key={marker.id}
                                    center={[marker.lat, marker.lng]}
                                    radius={9}
                                    fillColor={getMarkerColor(marker.type)}
                                    fillOpacity={0.85}
                                    color="#ffffff"
                                    weight={2.5}
                                    opacity={1}
                                >
                                    <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                                        <div className="min-w-[140px] p-1">
                                            <p className="text-xs font-bold">{getDisasterLabel(marker.type)}</p>
                                            <p className="text-[11px] text-gray-600">Kec. {marker.district}</p>
                                            <p className="mt-0.5 text-[10px] text-gray-400">Kab. Indramayu</p>
                                        </div>
                                    </Tooltip>
                                    <Popup>
                                        <div className="min-w-[160px]">
                                            <p className="text-sm font-bold text-slate-900">{getDisasterLabel(marker.type)}</p>
                                            <p className="text-xs text-slate-600">Kec. {marker.district}, {marker.village}</p>
                                            <p className="text-[11px] text-slate-400">Kab. Indramayu, Jawa Barat</p>
                                            <div className="mt-2 flex items-center gap-1.5">
                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getMarkerColor(marker.type) }} />
                                                <span className="text-[10px] font-medium text-slate-600">Laporan aktif</span>
                                            </div>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </>
    );
}
