import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getDisasterLabel } from '@/lib/utils';
import { MOCK_MARKERS } from '@/data/mock/public/alerts';

interface DisasterMapClientProps {
    filteredMarkers: typeof MOCK_MARKERS;
}

const INDRAMAYU_CENTER: [number, number] = [-6.42, 108.20];
const INDRAMAYU_ZOOM = 11;

function getMarkerColor(type: string): string {
    const map: Record<string, string> = { BANJIR: '#1E88FF', LONGSOR: '#F59E0B', KEBAKARAN: '#EF4444', ANGIN_KENCANG: '#22C55E', LAINNYA: '#8B5CF6' };
    return map[type] ?? '#94A3B8';
}

export default function DisasterMapClient({ filteredMarkers }: DisasterMapClientProps) {
    return (
        <MapContainer
            center={INDRAMAYU_CENTER}
            zoom={INDRAMAYU_ZOOM}
            className="absolute inset-0 z-0"
            style={{ height: '100%', width: '100%' }}
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
                    radius={10}
                    fillColor={getMarkerColor(marker.type)}
                    fillOpacity={0.85}
                    color="#ffffff"
                    weight={3}
                    opacity={1}
                >
                    <Tooltip direction="top" offset={[0, -12]} opacity={1}>
                        <div className="min-w-[150px] p-1">
                            <p className="text-sm font-bold font-heading">{getDisasterLabel(marker.type)}</p>
                            <p className="text-xs text-premium-body mt-0.5">Kec. {marker.district}</p>
                        </div>
                    </Tooltip>
                    <Popup className="rounded-xl">
                        <div className="min-w-[180px]">
                            <p className="text-base font-bold text-premium-heading font-heading mb-1">{getDisasterLabel(marker.type)}</p>
                            <p className="text-sm text-premium-body">Kec. {marker.district}, {marker.village}</p>
                            <p className="text-xs text-premium-caption mt-1">Kab. Indramayu, Jawa Barat</p>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="flex h-2.5 w-2.5 rounded-full animate-pulse" style={{ backgroundColor: getMarkerColor(marker.type) }}></span>
                                <span className="text-xs font-bold text-premium-heading uppercase tracking-wider">Laporan Aktif</span>
                            </div>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}
