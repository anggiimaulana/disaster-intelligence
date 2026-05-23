import { Head } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/disaster/sparkline';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, Bell, Building, Heart, MapPin, MessageCircle, Plus, Send, Settings, Users } from 'lucide-react';

const stats = [
    { title: 'Alert Aktif', value: 5, subtitle: '2 bertambah hari ini', subtitleColor: 'text-red-600', iconBg: 'bg-red-500', sparkColor: '#EF4444', trend: [2, 3, 1, 4, 2, 3, 5] },
    { title: 'Risiko Tinggi', value: 3, subtitle: 'Wilayah terdampak', subtitleColor: 'text-red-600', iconBg: 'bg-red-400', sparkColor: '#F87171', trend: [1, 2, 1, 2, 1, 2, 3] },
    { title: 'Risiko Sedang', value: 7, subtitle: 'Wilayah terdampak', subtitleColor: 'text-amber-600', iconBg: 'bg-amber-500', sparkColor: '#F59E0B', trend: [3, 4, 5, 4, 6, 5, 7] },
    { title: 'Notifikasi Terkirim', value: 1248, subtitle: 'Hari ini', subtitleColor: 'text-green-600', iconBg: 'bg-green-500', sparkColor: '#22C55E', trend: [800, 900, 1000, 950, 1100, 1200, 1248] },
    { title: 'Penerima Notifikasi', value: 12540, subtitle: 'Total kontak aktif', subtitleColor: 'text-slate-500', iconBg: 'bg-blue-500', sparkColor: '#3B82F6', trend: [10000, 10500, 11000, 11500, 12000, 12200, 12540] },
];

const activeAlerts = [
    { id: '1', judul: 'Banjir di Jatibarang', kecamatan: 'Kec. Jatibarang', waktu: '21 Mei 2026, 10:35 WIB', risk: 'TINGGI', timeAgo: 'Baru saja' },
    { id: '2', judul: 'Longsor di Cikedung', kecamatan: 'Kec. Cikedung', waktu: '21 Mei 2026, 09:58 WIB', risk: 'SEDANG', timeAgo: '47 menit lalu' },
    { id: '3', judul: 'Potensi Banjir di Lohbener', kecamatan: 'Kec. Lohbener', waktu: '21 Mei 2026, 09:20 WIB', risk: 'SEDANG', timeAgo: '1 jam lalu' },
    { id: '4', judul: 'Genangan di Kandanghaur', kecamatan: 'Kec. Kandanghaur', waktu: '21 Mei 2026, 08:45 WIB', risk: 'RENDAH', timeAgo: '2 jam lalu' },
    { id: '5', judul: 'Kondisi Aman', kecamatan: 'Kec. Haurgeulis', waktu: '21 Mei 2026, 07:30 WIB', risk: 'AMAN', timeAgo: '3 jam lalu' },
];

const riwayat = [
    { judul: 'Banjir di Jatibarang', wilayah: 'Jatibarang', tingkat: 'Tinggi', waktu: '21 Mei 2026, 10:35', status: 'Aktif' },
    { judul: 'Longsor di Cikedung', wilayah: 'Cikedung', tingkat: 'Sedang', waktu: '21 Mei 2026, 09:58', status: 'Aktif' },
    { judul: 'Potensi Banjir di Lohbener', wilayah: 'Lohbener', tingkat: 'Sedang', waktu: '21 Mei 2026, 09:20', status: 'Aktif' },
    { judul: 'Genangan di Kandanghaur', wilayah: 'Kandanghaur', tingkat: 'Rendah', waktu: '21 Mei 2026, 08:45', status: 'Selesai' },
    { judul: 'Angin Kencang di Patrol', wilayah: 'Patrol', tingkat: 'Rendah', waktu: '21 Mei 2026, 07:10', status: 'Selesai' },
];

const distribusi = { total: 1248, channels: [{ label: 'WhatsApp', count: 1020, pct: 81.7, color: '#22C55E' }, { label: 'SMS', count: 128, pct: 10.3, color: '#3B82F6' }, { label: 'Email', count: 64, pct: 5.1, color: '#F59E0B' }, { label: 'Aplikasi', count: 36, pct: 2.9, color: '#8B5CF6' }], berhasil: { count: 1146, pct: 91.8 }, gagal: { count: 62, pct: 5.0 }, pending: { count: 40, pct: 3.2 } };

const targets = [
    { label: 'Masyarakat Umum', count: 8240, icon: Users },
    { label: 'Relawan / Komunitas', count: 2150, icon: Heart },
    { label: 'Perangkat Desa', count: 1120, icon: Building },
    { label: 'Instansi Terkait', count: 860, icon: Building },
    { label: 'Media / Public', count: 170, icon: Send },
];

const mapMarkers = [
    { lat: -6.444, lng: 108.309, risk: 'TINGGI' }, { lat: -6.502, lng: 108.181, risk: 'SEDANG' },
    { lat: -6.406, lng: 108.263, risk: 'SEDANG' }, { lat: -6.358, lng: 108.091, risk: 'RENDAH' },
    { lat: -6.454, lng: 107.937, risk: 'AMAN' },
];

const riskColor: Record<string, string> = { TINGGI: '#EF4444', SEDANG: '#F59E0B', RENDAH: '#22C55E', AMAN: '#94A3B8' };


export default function Alerts() {
    return (
        <div className="w-full min-w-0 max-w-full pb-10 overflow-x-hidden">
            <Head title="Peringatan Dini" />

            {/* Header */}
            <div className="mb-5 flex items-center justify-end">
                <button className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 cursor-pointer">
                    <Plus className="h-4 w-4" /> Buat Peringatan Dini
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                {stats.map((s) => (
                    <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg text-white', s.iconBg)}><Bell className="h-4 w-4" /></div>
                            <Sparkline data={s.trend} color={s.sparkColor} width={70} height={28} />
                        </div>
                        <p className="mt-2 text-xs font-bold uppercase text-slate-500">{s.title}</p>
                        <p className="text-2xl font-bold text-slate-900">{s.value.toLocaleString()}</p>
                        <p className={cn('text-xs', s.subtitleColor)}>{s.subtitle}</p>
                    </div>
                ))}
            </div>

            {/* Row 1: Peta | Alert Aktif | Riwayat — grid 3 */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Peta */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-bold text-slate-900">PETA SEBARAN PERINGATAN DINI</h3>
                    <div className="mb-3 flex gap-3">
                        {[{ l: 'Tinggi', c: 'bg-red-500' }, { l: 'Sedang', c: 'bg-amber-500' }, { l: 'Rendah', c: 'bg-green-500' }, { l: 'Aman', c: 'bg-slate-400' }].map((i) => (
                            <div key={i.l} className="flex items-center gap-1"><div className={cn('h-2.5 w-2.5 rounded-full', i.c)} /><span className="text-xs text-slate-600">{i.l}</span></div>
                        ))}
                    </div>
                    <div className="h-[300px] overflow-hidden rounded-lg">
                        <MapContainer center={[-6.42, 108.20]} zoom={10} className="h-full w-full" style={{ zIndex: 0 }} scrollWheelZoom={false}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {mapMarkers.map((m, i) => (
                                <CircleMarker key={i} center={[m.lat, m.lng]} radius={12} fillColor={riskColor[m.risk]} fillOpacity={0.6} color={riskColor[m.risk]} weight={2}>
                                    <Tooltip>{m.risk}</Tooltip>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    </div>
                </div>

                {/* Alert Aktif */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">ALERT AKTIF</h3>
                        <span className="text-xs text-blue-600 cursor-pointer hover:underline">Lihat semua</span>
                    </div>
                    <div className="space-y-3">
                        {activeAlerts.map((a) => (
                            <div key={a.id} className="flex items-start gap-3">
                                <div className={cn('mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg', a.risk === 'TINGGI' ? 'bg-red-100' : a.risk === 'SEDANG' ? 'bg-amber-100' : a.risk === 'RENDAH' ? 'bg-green-100' : 'bg-slate-100')}>
                                    <AlertTriangle className={cn('h-3.5 w-3.5', a.risk === 'TINGGI' ? 'text-red-600' : a.risk === 'SEDANG' ? 'text-amber-600' : a.risk === 'RENDAH' ? 'text-green-600' : 'text-slate-500')} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-slate-900">{a.judul}</p>
                                    <p className="text-xs text-slate-500"><MapPin className="mr-0.5 inline h-3 w-3" />{a.kecamatan}</p>
                                    <p className="text-xs text-slate-400">{a.waktu}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-bold', a.risk === 'TINGGI' ? 'bg-red-100 text-red-700' : a.risk === 'SEDANG' ? 'bg-amber-100 text-amber-700' : a.risk === 'RENDAH' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600')}>{a.risk}</span>
                                    <p className="mt-0.5 text-xs text-slate-400">{a.timeAgo}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Riwayat Peringatan */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">RIWAYAT PERINGATAN</h3>
                        <span className="text-xs text-blue-600 cursor-pointer hover:underline">Lihat semua</span>
                    </div>
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-100"><tr><th className="pb-2 text-xs text-slate-500">Judul</th><th className="pb-2 text-xs text-slate-500">Wilayah</th><th className="pb-2 text-xs text-slate-500">Tingkat</th><th className="pb-2 text-xs text-slate-500">Waktu</th><th className="pb-2 text-xs text-slate-500">Status</th></tr></thead>
                        <tbody className="divide-y divide-slate-50">
                            {riwayat.map((r, i) => (
                                <tr key={i}><td className="py-2 text-sm text-slate-900">{r.judul}</td><td className="py-2 text-sm text-slate-600">{r.wilayah}</td><td className="py-2"><span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', r.tingkat === 'Tinggi' ? 'bg-red-100 text-red-700' : r.tingkat === 'Sedang' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700')}>{r.tingkat}</span></td><td className="py-2 text-xs text-slate-500">{r.waktu}</td><td className="py-2"><span className={cn('text-xs font-medium', r.status === 'Aktif' ? 'text-green-600' : 'text-slate-400')}>{r.status}</span></td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Row 2: Distribusi | Trend | Target — grid 3 */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold text-slate-900">DISTRIBUSI NOTIFIKASI</h3>
                    <div className="flex flex-1 flex-col justify-center">
                        <div className="flex items-center justify-center gap-6">
                            <svg width="110" height="110" viewBox="0 0 100 100" className="flex-shrink-0">
                                <circle cx="50" cy="50" r="35" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                                {distribusi.channels.reduce((acc, ch, i) => { const circ = 2 * Math.PI * 35; const dash = (ch.pct / 100) * circ; acc.elements.push(<g key={i} className="group cursor-pointer"><circle cx="50" cy="50" r="35" fill="none" stroke={ch.color} strokeWidth="14" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-acc.offset} transform="rotate(-90 50 50)" className="transition-all duration-300 group-hover:stroke-[18px]" /><title>{ch.label}: {ch.count} ({ch.pct}%)</title></g>); acc.offset += dash; return acc; }, { elements: [] as React.ReactNode[], offset: 0 }).elements}
                                <text x="50" y="46" textAnchor="middle" fill="#64748b" fontSize="8">Total</text>
                                <text x="50" y="58" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">{distribusi.total.toLocaleString()}</text>
                            </svg>
                            <div className="space-y-2">
                                {distribusi.channels.map((ch) => (
                                    <div key={ch.label} className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                                        <span className="text-sm text-slate-700">{ch.label}</span>
                                        <span className="text-sm font-bold text-slate-900">{ch.count.toLocaleString()} ({ch.pct}%)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between border-t border-slate-100 pt-3 text-xs">
                            <span className="font-medium text-green-600">✓ Berhasil {distribusi.berhasil.count.toLocaleString()} ({distribusi.berhasil.pct}%)</span>
                            <span className="font-medium text-red-600">✗ Gagal {distribusi.gagal.count} ({distribusi.gagal.pct}%)</span>
                            <span className="font-medium text-amber-600">⏳ Pending {distribusi.pending.count} ({distribusi.pending.pct}%)</span>
                        </div>
                    </div>
                    <button className="mt-5 w-full rounded-lg border border-blue-200 bg-blue-50 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer">Lihat Detail Distribusi →</button>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-bold text-slate-900">TREND PERINGATAN (7 HARI TERAKHIR)</h3>
                    <div className="flex flex-1 flex-col justify-center">
                        <svg viewBox="0 0 300 150" className="w-full" preserveAspectRatio="xMidYMid meet">
                            {/* Grid Lines */}
                            {[0,3,6,9,12,15].map((t)=>{const y=130-(t/15)*110;return(<g key={t}><line x1="35" y1={y} x2="290" y2={y} stroke="#f1f5f9" strokeWidth="0.5"/><text x="28" y={y+3} textAnchor="end" fill="#94a3b8" fontSize="8">{t}</text></g>);})}
                            
                            {/* Lines */}
                            {[
                                { name: 'Tinggi', color: '#EF4444', data: [5, 7, 5, 8, 10, 12, 10] },
                                { name: 'Sedang', color: '#F59E0B', data: [4, 5, 4, 6, 7, 8, 6] },
                                { name: 'Rendah', color: '#22C55E', data: [2, 3, 2, 3, 4, 5, 3] },
                                { name: 'Aman', color: '#94A3B8', data: [1, 2, 1, 2, 2, 3, 2] },
                            ].map((series, sIdx) => {
                                const pathD = series.data.map((val, i) => `${i === 0 ? 'M' : 'L'} ${50 + i * 36} ${130 - (val/15)*110}`).join(' ');
                                return <path key={`path-${sIdx}`} d={pathD} fill="none" stroke={series.color} strokeWidth="2" strokeLinecap="round" />;
                            })}

                            {/* Points & Tooltips */}
                            {[
                                { name: 'Tinggi', color: '#EF4444', data: [5, 7, 5, 8, 10, 12, 10] },
                                { name: 'Sedang', color: '#F59E0B', data: [4, 5, 4, 6, 7, 8, 6] },
                                { name: 'Rendah', color: '#22C55E', data: [2, 3, 2, 3, 4, 5, 3] },
                                { name: 'Aman', color: '#94A3B8', data: [1, 2, 1, 2, 2, 3, 2] },
                            ].map((series) => (
                                series.data.map((val, i) => {
                                    const x = 50 + i * 36;
                                    const y = 130 - (val/15)*110;
                                    const dateStr = ['15 Mei', '16 Mei', '17 Mei', '18 Mei', '19 Mei', '20 Mei', '21 Mei'][i];
                                    return (
                                        <g key={`point-${series.name}-${i}`} className="group cursor-pointer">
                                            <circle cx={x} cy={y} r="12" fill="transparent" />
                                            <circle cx={x} cy={y} r="3" fill={series.color} className="transition-all group-hover:r-[4.5]"/>
                                            <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none drop-shadow-md">
                                                <rect x={x-45} y={y-38} width="90" height="28" rx="4" fill="#1e293b"/>
                                                <polygon points={`${x-4},${y-10} ${x+4},${y-10} ${x},${y-6}`} fill="#1e293b"/>
                                                <text x={x} y={y-26} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{dateStr} • {series.name}</text>
                                                <text x={x} y={y-15} textAnchor="middle" fill="#cbd5e1" fontSize="7">{val} Peringatan</text>
                                            </g>
                                        </g>
                                    );
                                })
                            ))}
                            
                            {/* X Axis Labels */}
                            {['15 Mei','16 Mei','17 Mei','18 Mei','19 Mei','20 Mei','21 Mei'].map((l,i)=><text key={i} x={50+i*36} y="145" textAnchor="middle" fill="#94a3b8" fontSize="7">{l}</text>)}
                        </svg>
                        <div className="mt-2 flex justify-center gap-4">
                            {[{l:'Tinggi',c:'bg-red-500'},{l:'Sedang',c:'bg-amber-500'},{l:'Rendah',c:'bg-green-500'},{l:'Aman',c:'bg-slate-400'}].map(i=><div key={i.l} className="flex items-center gap-1.5"><div className={cn('h-2.5 w-2.5 rounded-full',i.c)}/><span className="text-xs text-slate-600">{i.l}</span></div>)}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-bold text-slate-900">TARGET NOTIFIKASI</h3>
                    <div className="space-y-2">
                        {targets.map((t) => { const Icon = t.icon; return (
                            <div key={t.label} className="flex items-center gap-3 rounded-lg bg-slate-50 p-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100"><Icon className="h-4 w-4 text-blue-600" /></div>
                                <span className="flex-1 text-sm font-medium text-slate-900">{t.label}</span>
                                <span className="text-sm font-bold text-slate-700">{t.count.toLocaleString()} kontak</span>
                            </div>
                        ); })}
                    </div>
                    <button className="mt-3 w-full rounded-lg border border-blue-200 bg-blue-50 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 cursor-pointer">Kelola Target Notifikasi</button>
                </div>
            </div>

            {/* Pengaturan Cepat */}
            <div className="mt-5 mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-slate-900">PENGATURAN CEPAT PERINGATAN</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                        { title: 'Ambang Batas Risiko', desc: 'Atur threshold untuk memicu peringatan otomatis', action: 'Atur' },
                        { title: 'Template Pesan', desc: 'Kelola template pesan untuk berbagai jenis bencana', action: 'Kelola' },
                        { title: 'Saluran Notifikasi', desc: 'Kelola saluran dan gateway notifikasi yang aktif', action: 'Kelola' },
                        { title: 'Jadwal & Eskalasi', desc: 'Atur jadwal pemantauan dan eskalasi peringatan', action: 'Atur' },
                        { title: 'Laporan & Evaluasi', desc: 'Lihat laporan efektivitas peringatan dini', action: 'Lihat' },
                    ].map((item) => (
                        <div key={item.title} className="rounded-lg border border-slate-100 p-4">
                            <Settings className="h-5 w-5 text-slate-400" />
                            <p className="mt-2 text-sm font-bold text-slate-900">{item.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
                            <button className="mt-2 text-sm font-medium text-blue-600 hover:underline cursor-pointer">{item.action}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
