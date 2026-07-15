import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getDisasterLabel } from '@/lib/utils';

interface MapPreviewClientProps {
    markers?: any[];
    mapSettings?: any;
    disasterTypes?: any[];
}

export default function MapPreviewClient({ markers = [], mapSettings = {}, disasterTypes = [] }: MapPreviewClientProps) {
    const getMarkerColor = (type: string): string => {
        const found = disasterTypes.find((d) => d.type === type);
        return found?.color ?? '#94A3B8';
    };

    const center: [number, number] = [
        Number(mapSettings.lat) || -6.42,
        Number(mapSettings.lng) || 108.20,
    ];

    return (
        <MapContainer
            center={center}
            zoom={mapSettings.zoom ?? 10}
            className="absolute inset-0 z-0"
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={false}
            touchZoom={false}
            doubleClickZoom={false}
            keyboard={false}
            attributionControl={false}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {markers.map((marker) => (
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
                            <p className="text-xs font-bold">{marker.title || getDisasterLabel(marker.type)}</p>
                            <p className="text-[11px] text-gray-600">{marker.location || `Kec. ${marker.district}`}</p>
                        </div>
                    </Tooltip>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}
