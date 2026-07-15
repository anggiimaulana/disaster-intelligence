import { useState } from 'react';
import { cn, getDisasterLabel } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Waves, Mountain, Flame, Wind, MoreHorizontal } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import type { DashboardProps, MapMarker } from '@/types';
import 'leaflet/dist/leaflet.css';

interface EventMapProps {
    markers: MapMarker[];
    filters: DashboardProps['filters'];
    laporanByJenis?: Array<{ type: string; label: string; count: number; color: string }>;
}

const DEFAULT_COLORS: Record<string, string> = {
    BANJIR: '#3B82F6',
    LONGSOR: '#F59E0B',
    KEBAKARAN: '#EF4444',
    ABRAASI: '#FF9800',
    ROB: '#00BCD4',
    CUACA: '#9C27B0',
    LAINNYA: '#8B5CF6',
};

function getMarkerColor(type: string, byJenis?: Array<{ type: string; color: string }>): string {
    if (byJenis) {
        const found = byJenis.find((j) => j.type === type);
        if (found) return found.color;
    }
    return DEFAULT_COLORS[type] ?? '#94A3B8';
}

const INDRAMAYU_CENTER: [number, number] = [-6.42, 108.20];
const INDRAMAYU_ZOOM = 10;

export function EventMap({ markers, filters, laporanByJenis }: EventMapProps) {
    const [selectedType, setSelectedType] = useState('all');
    const [selectedKecamatan, setSelectedKecamatan] = useState('all');

    const filteredMarkers = markers.filter((m) => {
        if (selectedType !== 'all' && m.type !== selectedType) return false;
        if (selectedKecamatan !== 'all' && m.kecamatan !== selectedKecamatan) return false;
        return true;
    });

    const countByType = markers.reduce((acc, m) => {
        acc[m.type] = (acc[m.type] ?? 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 md:px-5">
                <h3 className="text-sm font-bold text-slate-900">PETA SEBARAN KEJADIAN</h3>
                <div className="flex flex-wrap items-center gap-2">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="h-8 w-[130px] rounded-full border-blue-200 bg-blue-50 text-[11px] text-blue-700 md:w-[150px]">
                            <SelectValue placeholder="Semua Jenis" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Jenis Bencana</SelectItem>
                            {filters.jenisOptions.map((j) => (
                                <SelectItem key={j} value={j}>{getDisasterLabel(j)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Map + Legend */}
            <div className="relative h-[350px] w-full sm:h-[400px]">
                {/* Legend overlay */}
                <div className="absolute top-3 left-3 z-[1000] space-y-1.5 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur-sm border border-slate-100">
                    {(laporanByJenis && laporanByJenis.length > 0 ? laporanByJenis : []).map((item) => {
                        const count = countByType[item.type] ?? item.count ?? 0;
                        return (
                            <div key={item.type} className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[10px] font-medium text-slate-700">{item.label}</span>
                                <span className="text-[10px] font-bold text-slate-900">{count}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Leaflet Map */}
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
                            fillColor={getMarkerColor(marker.type, laporanByJenis)}
                            fillOpacity={0.85}
                            color="#ffffff"
                            weight={2.5}
                            opacity={1}
                        >
                            {/* Tooltip shows on hover */}
                            <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                                <div className="min-w-[140px] p-1">
                                    <p className="text-xs font-bold">{getDisasterLabel(marker.type)}</p>
                                    <p className="text-[11px] text-gray-600">Kec. {marker.kecamatan}</p>
                                    <p className="mt-0.5 text-[10px] text-gray-400">Kab. Indramayu</p>
                                </div>
                            </Tooltip>
                            {/* Popup shows on click */}
                            <Popup>
                                <div className="min-w-[160px]">
                                    <p className="text-sm font-bold text-slate-900">{getDisasterLabel(marker.type)}</p>
                                    <p className="text-xs text-slate-600">Kec. {marker.kecamatan}</p>
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
    );
}
