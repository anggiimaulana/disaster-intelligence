import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MOCK_MARKERS } from '@/data/mock/public/alerts';

function getMarkerColor(type: string): string {
    const map: Record<string, string> = { BANJIR: '#3B82F6', LONGSOR: '#F59E0B', KEBAKARAN: '#EF4444', ANGIN_KENCANG: '#22C55E', LAINNYA: '#8B5CF6' };
    return map[type] ?? '#94A3B8';
}

export default function MapPreviewClient() {
    return (
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
    );
}
