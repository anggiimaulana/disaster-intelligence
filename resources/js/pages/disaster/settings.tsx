import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, Bell, Brain, Database, Globe, HardDrive, Lock, Mail, MessageCircle, RefreshCw, Send, Settings, Shield, Trash2, Users, Workflow } from 'lucide-react';
import { Icon } from "@/components/ui/icon";

const tabs = [
    { id: 'umum', label: 'Umum', icon: Settings },
    { id: 'integrasi', label: 'Integrasi', icon: Workflow },
    { id: 'ai', label: 'AI & Analitik', icon: Brain },
    { id: 'peringatan', label: 'Peringatan Dini', icon: Bell },
    { id: 'pengguna', label: 'Pengguna & Akses', icon: Users },
    { id: 'keamanan', label: 'Keamanan', icon: Lock },
    { id: 'backup', label: 'Backup & Pemulihan', icon: HardDrive },
    { id: 'log', label: 'Log Aktivitas', icon: Globe },
];

const integrations = [
    { name: 'WhatsApp Gateway', desc: 'Terhubung ke WhatsApp Business API', status: 'Terhubung', color: 'text-green-600' },
    { name: 'n8n Workflow', desc: 'Otomasi alur penerimaan dan pemrosesan data', status: 'Aktif', color: 'text-green-600' },
    { name: 'AI Service (NLP & Vision)', desc: 'Layanan analisis teks dan gambar', status: 'Connected', color: 'text-green-600' },
    { name: 'Email Service', desc: 'Pengiriman notifikasi melalui email', status: 'Terhubung', color: 'text-green-600' },
    { name: 'SMS Gateway', desc: 'Pengiriman notifikasi melalui SMS', status: 'Terhubung', color: 'text-green-600' },
];

const riskThresholds = [
    { level: 'Rendah', range: '0 - 39', color: 'bg-green-500', notif: 'Tidak ada notifikasi', enabled: true },
    { level: 'Sedang', range: '40 - 69', color: 'bg-amber-500', notif: 'Notifikasi internal', enabled: true },
    { level: 'Tinggi', range: '70 - 89', color: 'bg-orange-500', notif: 'Notifikasi internal + Stakeholder', enabled: true },
    { level: 'Sangat Tinggi', range: '90 - 100', color: 'bg-red-500', notif: 'Notifikasi semua + Eskalasi', enabled: true },
];

const notifChannels = [
    { channel: 'WhatsApp', rendah: false, sedang: true, tinggi: true, sangatTinggi: true },
    { channel: 'SMS', rendah: false, sedang: false, tinggi: true, sangatTinggi: true },
    { channel: 'Email', rendah: false, sedang: true, tinggi: true, sangatTinggi: true },
    { channel: 'Aplikasi (In-app)', rendah: true, sedang: true, tinggi: true, sangatTinggi: true },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('umum');

    return (
        <div className="w-full min-w-0 max-w-full pb-10 overflow-x-hidden">
            <Head title="Pengaturan Sistem" />

            {/* Tabs */}
            <div className="mb-5 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                <div className="flex gap-1 min-w-max">
                {tabs.map((tab) => { const Icon = tab.icon; return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors', activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>
                        <Icon className="h-3.5 w-3.5" /> {tab.label}
                    </button>
                ); })}
                </div>
            </div>

            {activeTab === 'umum' && (
                <div className="space-y-5 mb-5">
                    {/* Row 1: Informasi Sistem + Integrasi */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {/* Informasi Sistem */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-base font-bold text-slate-900">Informasi Sistem</h3>
                                <button className="text-sm text-blue-600 hover:underline">Edit Informasi</button>
                            </div>
                            <div className="mb-4 flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100">
                                    <Shield className="h-8 w-8 text-blue-600" />
                                </div>
                                <button className="text-xs text-blue-600 hover:underline">Ubah Logo</button>
                            </div>
                            <dl className="space-y-2.5">
                                {[['Nama Sistem', 'Disaster Intelligence System'], ['Instansi', 'BPBD Kabupaten Indramayu'], ['Versi Aplikasi', 'v1.0.0'], ['Lingkungan', 'Production'], ['Waktu Server', '21 Mei 2026, 10:45:21 WIB'], ['Zona Waktu', 'Asia/Jakarta (UTC+7)']].map(([l, v]) => (
                                    <div key={l} className="flex items-center justify-between"><dt className="text-sm text-slate-500">{l}</dt><dd className="text-sm font-medium text-slate-900">{v}</dd></div>
                                ))}
                            </dl>
                            <div className="mt-4 border-t border-slate-100 pt-3">
                                <p className="text-xs text-slate-500">Bahasa</p>
                                <select className="mt-1 h-8 w-full rounded-lg border border-slate-200 px-2 text-sm"><option>Bahasa Indonesia</option><option>English</option></select>
                            </div>
                            <div className="mt-3">
                                <p className="text-xs text-slate-500">Deskripsi</p>
                                <p className="mt-1 text-sm text-slate-700">Sistem deteksi dini dan kesiapsiagaan bencana berbasis crowdsourced data dan AI.</p>
                            </div>
                        </div>

                        {/* Integrasi Layanan */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-4 text-base font-bold text-slate-900">Integrasi Layanan</h3>
                            <div className="space-y-3">
                                {integrations.map((intg) => (
                                    <div key={intg.name} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                                {intg.name.includes('WhatsApp') && <MessageCircle className="h-4 w-4 text-green-600" />}
                                                {intg.name.includes('n8n') && <Workflow className="h-4 w-4 text-orange-500" />}
                                                {intg.name.includes('AI') && <Brain className="h-4 w-4 text-purple-600" />}
                                                {intg.name.includes('Email') && <Mail className="h-4 w-4 text-blue-600" />}
                                                {intg.name.includes('SMS') && <Send className="h-4 w-4 text-cyan-600" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{intg.name}</p>
                                                <p className="text-xs text-slate-500">{intg.desc}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', intg.status === 'Terhubung' || intg.status === 'Aktif' || intg.status === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600')}>{intg.status}</span>
                                            <button className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors">Konfigurasi</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-3 text-sm text-blue-600 hover:underline">Lihat semua integrasi →</button>
                        </div>
                    </div>

                    {/* Row 2: Ambang Risiko + Konfigurasi Peta */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {/* Ambang Risiko */}
                        {/* Ambang Risiko */}
                        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Pengaturan Ambang & Risk Score</h3>
                                <p className="mt-1 mb-4 text-sm text-slate-500">Atur ambang batas untuk klasifikasi tingkat risiko dan peringatan dini.</p>
                                
                                {/* Tabel 1: Klasifikasi Risiko */}
                                <div className="mb-4 w-full overflow-x-auto rounded-lg border border-slate-200">
                                    <table className="w-full min-w-[300px] text-left text-sm divide-y divide-slate-100">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr className="divide-x divide-slate-100">
                                                <th className="px-3 py-2 text-xs font-medium text-slate-500">Tingkat Risiko</th>
                                                <th className="px-3 py-2 text-xs font-medium text-slate-500">Rentang Risk Score</th>
                                                <th className="px-3 py-2 text-xs font-medium text-slate-500">Warna</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {riskThresholds.map((r) => (
                                                <tr key={`t1-${r.level}`} className="divide-x divide-slate-100">
                                                    <td className="px-3 py-2.5 font-medium text-slate-900">{r.level}</td>
                                                    <td className="px-3 py-2.5 text-slate-600">{r.range}</td>
                                                    <td className="px-3 py-2.5"><div className={cn('h-4 w-4 rounded', r.color)} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Tabel 2: Peringatan & Status */}
                                <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
                                    <table className="w-full min-w-[400px] text-left text-sm divide-y divide-slate-100">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr className="divide-x divide-slate-100">
                                                <th className="px-3 py-2 text-xs font-medium text-slate-500">Tingkat Risiko</th>
                                                <th className="px-3 py-2 text-xs font-medium text-slate-500">Ambang untuk Peringatan</th>
                                                <th className="px-3 py-2 text-xs font-medium text-slate-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {riskThresholds.map((r) => (
                                                <tr key={`t2-${r.level}`} className="divide-x divide-slate-100">
                                                    <td className="px-3 py-2.5 font-medium text-slate-900">{r.level}</td>
                                                    <td className="px-3 py-2.5 text-slate-600">{r.notif}</td>
                                                    <td className="px-3 py-2.5">
                                                        <label className="relative inline-flex cursor-pointer items-center">
                                                            <input type="checkbox" className="peer sr-only" defaultChecked={r.enabled} />
                                                            <div className="peer h-5 w-9 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                                                        </label>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <button className="mt-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 self-start">Atur Ambang</button>
                        </div>

                        {/* Konfigurasi Peta */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-4 text-base font-bold text-slate-900">Konfigurasi Peta</h3>
                            <div className="space-y-1 divide-y divide-slate-100">
                                {[['Peta Default', 'OpenStreetMap', false], ['Zoom Default', '10', false], ['Batas Wilayah', 'Kabupaten (Otomatis)', false], ['Layer Risiko', 'Tampilkan layer risiko di peta', true], ['Cluster Marker', 'Kelompokkan marker laporan', true], ['Heatmap', 'Tampilkan heatmap kepadatan laporan', true]].map(([l, v, isToggle]) => (
                                    <div key={l as string} className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{l as string}</p>
                                            <p className="text-[11px] text-slate-500">{v as string}</p>
                                        </div>
                                        {isToggle ? (
                                            <label className="relative inline-flex cursor-pointer items-center">
                                                <input type="checkbox" className="peer sr-only" defaultChecked={true} />
                                                <div className="peer h-5 w-9 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                                            </label>
                                        ) : (
                                            <span className="text-sm font-medium text-slate-900">{v as string}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 h-32 overflow-hidden rounded-lg">
                                <MapContainer center={[-6.42, 108.20]} zoom={10} className="h-full w-full" style={{ zIndex: 0 }} scrollWheelZoom={false}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <CircleMarker center={[-6.42, 108.20]} radius={8} fillColor="#EF4444" fillOpacity={0.8} color="#fff" weight={2} />
                                </MapContainer>
                            </div>
                            <button className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">Simpan Pengaturan Peta</button>
                        </div>
                    </div>

                    {/* Row 3: Notifikasi + Pemeliharaan */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {/* Notifikasi */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900">Pengaturan Notifikasi</h3>
                            <p className="mt-1 mb-4 text-sm text-slate-500">Pilih kanal dan penerima notifikasi untuk setiap tingkat risiko.</p>
                            <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
                                <table className="w-full min-w-[500px] text-left text-sm divide-y divide-slate-100">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr className="divide-x divide-slate-100">
                                            <th className="px-3 py-2 text-xs font-medium text-slate-500">Kanal Notifikasi</th>
                                            <th className="px-3 py-2 text-center text-xs font-medium text-slate-500">Rendah</th>
                                            <th className="px-3 py-2 text-center text-xs font-medium text-slate-500">Sedang</th>
                                            <th className="px-3 py-2 text-center text-xs font-medium text-slate-500">Tinggi</th>
                                            <th className="px-3 py-2 text-center text-xs font-medium text-slate-500">Sangat Tinggi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {notifChannels.map((ch) => (
                                            <tr key={ch.channel} className="divide-x divide-slate-100">
                                                <td className="px-3 py-2.5 font-medium text-slate-900">{ch.channel}</td>
                                                <td className="px-3 py-2.5 text-center"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked={ch.rendah} /></td>
                                                <td className="px-3 py-2.5 text-center"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked={ch.sedang} /></td>
                                                <td className="px-3 py-2.5 text-center"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked={ch.tinggi} /></td>
                                                <td className="px-3 py-2.5 text-center"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked={ch.sangatTinggi} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">Simpan Pengaturan Notifikasi</button>
                        </div>

                        {/* Pemeliharaan */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-4 text-base font-bold text-slate-900">Pemeliharaan Sistem</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { title: 'Backup Database', desc: 'Backup terakhir: 21 Mei 2026, 02:15 WIB', action: 'Backup Sekarang', color: 'text-blue-600' },
                                    { title: 'Periksa Health System', desc: 'Periksa status semua layanan', action: 'Periksa', color: 'text-slate-600' },
                                    { title: 'Bersihkan Cache', desc: 'Hapus cache sistem untuk performa optimal', action: 'Bersihkan', color: 'text-blue-600' },
                                    { title: 'Update Sistem', desc: 'Periksa dan instal pembaruan sistem', action: 'Cek Update', color: 'text-slate-600' },
                                    { title: 'Optimasi Database', desc: 'Optimasi tabel dan index database', action: 'Optimasi', color: 'text-slate-600' },
                                    { title: 'Reset Pengaturan', desc: 'Kembalikan pengaturan ke default', action: 'Reset', color: 'text-red-600' },
                                ].map((item) => (
                                    <div key={item.title} className="rounded-lg border border-slate-100 p-3">
                                        <p className="text-sm font-medium text-slate-900">{item.title}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
                                        <button className={cn('mt-2 text-xs font-medium hover:underline', item.color)}>{item.action}</button>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-3 text-xs text-slate-400">
                                <Icon iconNode={AlertTriangle} className="w-4 h-4 inline-block mr-1 text-amber-500" />
                                Pastikan melakukan backup sebelum melakukan perubahan penting pada sistem.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab !== 'umum' && (
                <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="text-center">
                        <Settings className="mx-auto h-12 w-12 text-slate-200" />
                        <p className="mt-3 text-base font-medium text-slate-400">Tab "{tabs.find((t) => t.id === activeTab)?.label}" sedang dalam pengembangan</p>
                    </div>
                </div>
            )}
        </div>
    );
}
