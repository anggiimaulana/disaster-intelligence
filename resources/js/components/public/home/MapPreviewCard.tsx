import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { disasterMap } from '@/routes/public';
import { MOCK_MARKERS } from '@/data/mock/public/alerts';

interface MapPreviewCardProps {
    markerCount: number;
}

function getMarkerColor(type: string): string {
    const map: Record<string, string> = { BANJIR: '#3B82F6', LONGSOR: '#F59E0B', KEBAKARAN: '#EF4444', ANGIN_KENCANG: '#22C55E', LAINNYA: '#8B5CF6' };
    return map[type] ?? '#94A3B8';
}

export default function MapPreviewCard({ markerCount }: MapPreviewCardProps) {
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
                            <MapContainer
                                center={[-6.42, 108.20]}
                                zoom={10}
                                className="h-full w-full"
                                zoomControl={false}
                                scrollWheelZoom={false}
                                dragging={false}
                                touchZoom={false}
                                doubleClickZoom={false}
                                keyboard={false}
                                attributionControl={false}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                {MOCK_MARKERS.map((marker) => (
                                    <CircleMarker
                                        key={marker.id}
                                        center={[marker.lat, marker.lng]}
                                        radius={8}
                                        fillColor={getMarkerColor(marker.type)}
                                        fillOpacity={0.85}
                                        color="#ffffff"
                                        weight={2}
                                    >
                                        <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                                            <div className="min-w-[120px] p-1">
                                                <p className="text-xs font-bold">{marker.type.replace(/_/g, ' ')}</p>
                                                <p className="text-[11px] text-gray-600">Kec. {marker.district}</p>
                                            </div>
                                        </Tooltip>
                                    </CircleMarker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
