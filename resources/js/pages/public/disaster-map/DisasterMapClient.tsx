import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getDisasterLabel } from '@/lib/utils';
import { config } from '@/config';

interface DisasterMapClientProps {
    filteredMarkers: any[];
    mapSettings?: any;
    disasterTypes?: any[];
}

const INDRAMAYU_CENTER: [number, number] = [-6.42, 108.20];
const INDRAMAYU_ZOOM = 11;

export default function DisasterMapClient({ filteredMarkers, mapSettings = {}, disasterTypes = [] }: DisasterMapClientProps) {
    const getMarkerColor = (type: string): string => {
        const found = disasterTypes.find((d) => d.type === type);
        return found?.color ?? '#94A3B8';
    };

    const center: [number, number] = [
        Number(mapSettings.lat) || INDRAMAYU_CENTER[0],
        Number(mapSettings.lng) || INDRAMAYU_CENTER[1],
    ];

    const zoom = mapSettings.zoom ?? INDRAMAYU_ZOOM;

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            className="absolute inset-0 z-0"
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={config.mapTileUrl}
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
                            <p className="text-sm font-bold font-heading">{marker.title || getDisasterLabel(marker.type)}</p>
                            <p className="text-xs text-premium-body mt-0.5">{marker.location || `Kec. ${marker.district}`}</p>
                        </div>
                    </Tooltip>
                    <Popup className="rounded-xl">
                        <div className="min-w-[180px]">
                            <p className="text-base font-bold text-premium-heading font-heading mb-1">{marker.title || getDisasterLabel(marker.type)}</p>
                            <p className="text-sm text-premium-body">{marker.location || `Kec. ${marker.district}, ${marker.village}`}</p>
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
