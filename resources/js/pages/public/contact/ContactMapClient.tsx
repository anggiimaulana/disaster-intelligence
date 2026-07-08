import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface ContactMapClientProps {
    location: [number, number];
}

export default function ContactMapClient({ location }: ContactMapClientProps) {
    return (
        <MapContainer
            center={location}
            zoom={15}
            className="h-full w-full"
            zoomControl={true}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CircleMarker center={location} radius={12} fillColor="#0B2A52" fillOpacity={0.9} color="#ffffff" weight={3}>
                <Popup className="rounded-xl">
                    <div className="text-center min-w-[200px] p-2">
                        <p className="text-base font-bold text-premium-heading font-heading mb-1">BPBD Kab. Indramayu</p>
                        <p className="text-sm text-premium-body leading-relaxed mb-2">Jl. Letnan Jenderal Soeprapto No. 1</p>
                        <p className="text-xs font-medium text-premium-caption">Indramayu, Jawa Barat 45213</p>
                    </div>
                </Popup>
            </CircleMarker>
        </MapContainer>
    );
}
