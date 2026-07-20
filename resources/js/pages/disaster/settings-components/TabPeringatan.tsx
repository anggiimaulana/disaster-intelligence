import { Bell, Map as MapIcon, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { useForm } from '@inertiajs/react';
import { config } from '@/config';

const defaultRiskThresholds = [
    { level: 'Rendah', range: '0 - 39', color: 'bg-green-500', notif: 'Tidak ada notifikasi', enabled: true },
    { level: 'Sedang', range: '40 - 69', color: 'bg-amber-500', notif: 'Notifikasi internal', enabled: true },
    { level: 'Tinggi', range: '70 - 89', color: 'bg-orange-500', notif: 'Notifikasi internal + Stakeholder', enabled: true },
    { level: 'Sangat Tinggi', range: '90 - 100', color: 'bg-red-500', notif: 'Notifikasi semua + Eskalasi', enabled: true },
];

const defaultNotifChannels = [
    { channel: 'WhatsApp', rendah: false, sedang: true, tinggi: true, sangatTinggi: true },
    { channel: 'SMS', rendah: false, sedang: false, tinggi: true, sangatTinggi: true },
    { channel: 'Email', rendah: false, sedang: true, tinggi: true, sangatTinggi: true },
    { channel: 'Aplikasi (In-app)', rendah: true, sedang: true, tinggi: true, sangatTinggi: true },
];

export default function TabPeringatan({ appSettings }: any) {
    const { data, setData, post, processing, transform } = useForm({
        risk_thresholds: appSettings?.risk_thresholds ? JSON.parse(appSettings.risk_thresholds) : defaultRiskThresholds,
        notif_channels: appSettings?.notif_channels ? JSON.parse(appSettings.notif_channels) : defaultNotifChannels,
        map_default_zoom: appSettings?.map_default_zoom || '10',
        map_layer_risiko: appSettings?.map_layer_risiko === undefined ? true : (appSettings.map_layer_risiko === '1' || appSettings.map_layer_risiko === true),
        map_cluster_marker: appSettings?.map_cluster_marker === undefined ? true : (appSettings.map_cluster_marker === '1' || appSettings.map_cluster_marker === true),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        transform((data: any) => ({
            ...data,
            risk_thresholds: JSON.stringify(data.risk_thresholds),
            notif_channels: JSON.stringify(data.notif_channels)
        }));
        
        post('/cms/settings/system', {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">Peringatan Dini & Peta</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Konfigurasi sistem klasifikasi risiko, notifikasi otomatis, dan preferensi peta.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Ambang Risiko */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                                <TriangleAlert className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-slate-900">Ambang & Risk Score</h3>
                                <p className="text-xs text-slate-500">Klasifikasi tingkat bahaya bencana</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="w-full overflow-hidden rounded-xl border border-slate-200">
                                <table className="w-full text-left text-sm divide-y divide-slate-100">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-700">Tingkat Risiko</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-700">Skor AI</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-700">Warna</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-700 text-center">Aktif</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {data.risk_thresholds.map((r: any, index: number) => (
                                            <tr key={`t1-${r.level}`} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-slate-900">{r.level}</td>
                                                <td className="px-4 py-3 text-slate-600">{r.range}</td>
                                                <td className="px-4 py-3"><div className={cn('h-3.5 w-3.5 rounded-sm', r.color)} /></td>
                                                <td className="px-4 py-3 text-center">
                                                    <label className="relative inline-flex cursor-pointer items-center">
                                                        <input 
                                                            type="checkbox" 
                                                            className="peer sr-only" 
                                                            checked={r.enabled} 
                                                            onChange={(e) => setData('risk_thresholds', data.risk_thresholds.map((item: any, i: number) => i === index ? {...item, enabled: e.target.checked} : item))}
                                                        />
                                                        <div className="peer h-5 w-9 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                                                    </label>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Konfigurasi Peta */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                            <MapIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Konfigurasi Peta</h3>
                            <p className="text-xs text-slate-500">Tampilan default dashboard monitoring</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2 divide-y divide-slate-100">
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Peta Default</p>
                                <p className="text-xs text-slate-500 mt-0.5">OpenStreetMap</p>
                            </div>
                            <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">OpenStreetMap</span>
                        </div>
                        
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Zoom Default</p>
                                <p className="text-xs text-slate-500 mt-0.5">Tingkat perbesaran peta</p>
                            </div>
                            <input 
                                type="number" 
                                value={data.map_default_zoom}
                                onChange={(e) => setData('map_default_zoom', e.target.value)}
                                className="w-16 rounded border border-slate-200 px-2 py-1 text-sm text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Layer Risiko</p>
                                <p className="text-xs text-slate-500 mt-0.5">Tampilkan area risiko di peta</p>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input 
                                    type="checkbox" 
                                    className="peer sr-only" 
                                    checked={data.map_layer_risiko} 
                                    onChange={(e) => setData('map_layer_risiko', e.target.checked)}
                                />
                                <div className="peer h-5 w-9 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Cluster Marker</p>
                                <p className="text-xs text-slate-500 mt-0.5">Kelompokkan titik berdekatan</p>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input 
                                    type="checkbox" 
                                    className="peer sr-only" 
                                    checked={data.map_cluster_marker} 
                                    onChange={(e) => setData('map_cluster_marker', e.target.checked)}
                                />
                                <div className="peer h-5 w-9 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                            </label>
                        </div>
                    </div>
                    <div className="mt-4 h-32 overflow-hidden rounded-xl border border-slate-200">
                        <MapContainer center={[-6.42, 108.20]} zoom={10} className="h-full w-full" style={{ zIndex: 0 }} scrollWheelZoom={false}>
                            <TileLayer url={config.mapTileUrl} />
                            <CircleMarker center={[-6.42, 108.20]} radius={8} fillColor="#EF4444" fillOpacity={0.8} color="#fff" weight={2} />
                        </MapContainer>
                    </div>
                </div>

                {/* Notifikasi */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                            <Bell className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Distribusi Notifikasi (Routing)</h3>
                            <p className="text-xs text-slate-500">Pilih kanal penerima notifikasi otomatis untuk tiap level risiko</p>
                        </div>
                    </div>

                    <div className="w-full overflow-hidden rounded-xl border border-slate-200">
                        <table className="w-full text-left text-sm divide-y divide-slate-200">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-700">Kanal Notifikasi</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">Rendah</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">Sedang</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">Tinggi</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">Sangat Tinggi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {data.notif_channels.map((ch: any, index: number) => (
                                    <tr key={ch.channel} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-slate-900">{ch.channel}</td>
                                        <td className="px-4 py-4 text-center"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={ch.rendah} onChange={(e) => setData('notif_channels', data.notif_channels.map((c: any, i: number) => i === index ? {...c, rendah: e.target.checked} : c))} /></td>
                                        <td className="px-4 py-4 text-center"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={ch.sedang} onChange={(e) => setData('notif_channels', data.notif_channels.map((c: any, i: number) => i === index ? {...c, sedang: e.target.checked} : c))} /></td>
                                        <td className="px-4 py-4 text-center"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={ch.tinggi} onChange={(e) => setData('notif_channels', data.notif_channels.map((c: any, i: number) => i === index ? {...c, tinggi: e.target.checked} : c))} /></td>
                                        <td className="px-4 py-4 text-center"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={ch.sangatTinggi} onChange={(e) => setData('notif_channels', data.notif_channels.map((c: any, i: number) => i === index ? {...c, sangatTinggi: e.target.checked} : c))} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                        <button 
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-70 transition-colors"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Konfigurasi'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
