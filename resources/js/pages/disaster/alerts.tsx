import { Head, router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/disaster/sparkline';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, Bell, Building, Heart, MapPin, MessageCircle, Plus, Send, Settings, Users, Edit2, Trash2 } from 'lucide-react';
import { config } from '@/config';

const riskColor: Record<string, string> = { TINGGI: '#EF4444', SEDANG: '#F59E0B', RENDAH: '#22C55E', AMAN: '#94A3B8' };

const IconMap: Record<string, React.ElementType> = {
    'users': Users,
    'heart': Heart,
    'building': Building,
    'message-circle': MessageCircle,
    'send': Send
};
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/ui/rich-text-editor';

export default function Alerts({ jenisBencana, stats: dbStats, activeAlerts, riwayatPeringatan, distribusiNotifikasi, targetNotifikasi, mapMarkers, trendData, supportedRegencies }: any) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, put, processing, reset, errors } = useForm({
        jenis_bencana_id: '',
        level_warning: 'Siaga',
        wilayah: '',
        pesan: '',
        status: 'aktif'
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    const openEdit = (alert: any) => {
        setEditingId(alert.id);
        setData({
            jenis_bencana_id: alert.jenis_bencana_id || '',
            level_warning: alert.level_warning || 'Siaga',
            wilayah: alert.wilayah || '',
            pesan: alert.pesan || '',
            status: alert.status === 'Aktif' ? 'aktif' : 'selesai'
        });
        setOpen(true);
    };

    const confirmDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus peringatan ini?')) {
            router.delete(`/cms/alerts/${id}`);
        }
    };

    const displayStats = [
        { title: 'Alert Aktif', value: dbStats?.alertAktif?.value || 0, subtitle: 'Total saat ini', subtitleColor: 'text-red-600', iconBg: 'bg-red-500', sparkColor: '#EF4444', trend: dbStats?.alertAktif?.trend || [] },
        { title: 'Risiko Tinggi', value: dbStats?.risikoTinggi?.value || 0, subtitle: 'Wilayah terdampak', subtitleColor: 'text-red-600', iconBg: 'bg-red-400', sparkColor: '#F87171', trend: dbStats?.risikoTinggi?.trend || [] },
        { title: 'Risiko Sedang', value: dbStats?.risikoSedang?.value || 0, subtitle: 'Wilayah terdampak', subtitleColor: 'text-amber-600', iconBg: 'bg-amber-500', sparkColor: '#F59E0B', trend: dbStats?.risikoSedang?.trend || [] },
        { title: 'Notifikasi Terkirim', value: dbStats?.notifikasiTerkirim?.value || 0, subtitle: 'Hari ini', subtitleColor: 'text-green-600', iconBg: 'bg-green-500', sparkColor: '#22C55E', trend: dbStats?.notifikasiTerkirim?.trend || [] },
        { title: 'Penerima Notifikasi', value: dbStats?.penerimaNotifikasi?.value || 0, subtitle: 'Total kontak aktif', subtitleColor: 'text-slate-500', iconBg: 'bg-blue-500', sparkColor: '#3B82F6', trend: dbStats?.penerimaNotifikasi?.trend || [] },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/cms/alerts/${editingId}`, {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                    setEditingId(null);
                }
            });
        } else {
            post('/cms/alerts', {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                }
            });
        }
    };

    return (
        <div className="w-full min-w-0 max-w-full pb-10 overflow-x-hidden">
            <Head title="Peringatan Dini" />

            {/* Header */}
            <div className="mb-5 flex items-center justify-end">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <button onClick={() => { reset(); setEditingId(null); }} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 cursor-pointer">
                            <Plus className="h-4 w-4" /> Buat Peringatan Dini
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] p-6">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Peringatan Dini' : 'Buat Peringatan Dini Baru'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={submit} className="grid gap-6 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="jenis_bencana_id">Jenis Bencana</Label>
                                <Select 
                                    value={data.jenis_bencana_id} 
                                    onValueChange={v => setData('jenis_bencana_id', v)}
                                >
                                    <SelectTrigger id="jenis_bencana_id" className="w-full">
                                        <SelectValue placeholder="Pilih Bencana" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jenisBencana?.map((jb: any) => (
                                            <SelectItem key={jb.id} value={jb.id.toString()}>{jb.nama_bencana}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.jenis_bencana_id && <p className="text-red-500 text-xs">{errors.jenis_bencana_id}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="level_warning">Level Peringatan</Label>
                                <Select 
                                    value={data.level_warning} 
                                    onValueChange={v => setData('level_warning', v)}
                                >
                                    <SelectTrigger id="level_warning" className="w-full">
                                        <SelectValue placeholder="Pilih Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Siaga">Siaga (Rendah)</SelectItem>
                                        <SelectItem value="Waspada">Waspada (Sedang)</SelectItem>
                                        <SelectItem value="Awas">Awas (Tinggi)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.level_warning && <p className="text-red-500 text-xs">{errors.level_warning}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="wilayah">Wilayah</Label>
                                <Select 
                                    value={data.wilayah} 
                                    onValueChange={v => setData('wilayah', v)}
                                >
                                    <SelectTrigger id="wilayah" className="w-full">
                                        <SelectValue placeholder="Pilih Kabupaten/Kota" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {supportedRegencies?.map((r: any) => (
                                            <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.wilayah && <p className="text-red-500 text-xs">{errors.wilayah}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pesan">Detail Peringatan</Label>
                                <RichTextEditor 
                                    value={data.pesan} 
                                    onChange={val => setData('pesan', val)}
                                    placeholder="Masukkan detail peringatan yang lengkap..."
                                    minHeight="200px"
                                />
                                {errors.pesan && <p className="text-red-500 text-xs">{errors.pesan}</p>}
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-red-600 hover:bg-red-700 text-white">
                                    Simpan Peringatan
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                {displayStats.map((s) => (
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
                            <TileLayer url={config.mapTileUrl} />
                            {mapMarkers?.map((m: any, i: number) => (
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
                        {activeAlerts?.map((a: any) => (
                            <div key={a.id} className="flex items-start gap-3">
                                <div className={cn('mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg', a.risk_level === 'TINGGI' ? 'bg-red-100' : a.risk_level === 'SEDANG' ? 'bg-amber-100' : a.risk_level === 'RENDAH' ? 'bg-green-100' : 'bg-slate-100')}>
                                    <AlertTriangle className={cn('h-3.5 w-3.5', a.risk_level === 'TINGGI' ? 'text-red-600' : a.risk_level === 'SEDANG' ? 'text-amber-600' : a.risk_level === 'RENDAH' ? 'text-green-600' : 'text-slate-500')} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-slate-900">{a.judul}</p>
                                    <p className="text-xs text-slate-500"><MapPin className="mr-0.5 inline h-3 w-3" />{a.kecamatan}</p>
                                    <p className="text-xs text-slate-400">{a.waktu}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-bold', a.risk_level === 'TINGGI' ? 'bg-red-100 text-red-700' : a.risk_level === 'SEDANG' ? 'bg-amber-100 text-amber-700' : a.risk_level === 'RENDAH' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600')}>{a.risk_level}</span>
                                    <p className="mt-0.5 text-xs text-slate-400">{a.time_ago}</p>
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
                        <thead className="border-b border-slate-100"><tr><th className="pb-2 text-xs text-slate-500">Judul</th><th className="pb-2 text-xs text-slate-500">Wilayah</th><th className="pb-2 text-xs text-slate-500">Tingkat</th><th className="pb-2 text-xs text-slate-500">Waktu</th><th className="pb-2 text-xs text-slate-500">Status</th><th className="pb-2 text-xs text-slate-500 text-right">Aksi</th></tr></thead>
                        <tbody className="divide-y divide-slate-50">
                            {riwayatPeringatan?.map((r: any, i: number) => (
                                <tr key={i}><td className="py-2 text-sm text-slate-900">{r.judul}</td><td className="py-2 text-sm text-slate-600">{r.wilayah}</td><td className="py-2"><span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', r.tingkat === 'TINGGI' ? 'bg-red-100 text-red-700' : r.tingkat === 'SEDANG' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700')}>{r.tingkat}</span></td><td className="py-2 text-xs text-slate-500">{r.waktu_dibuat}</td><td className="py-2"><span className={cn('text-xs font-medium', r.status === 'Aktif' ? 'text-green-600' : 'text-slate-400')}>{r.status}</span></td>
                                <td className="py-2 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openEdit(r)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="h-4 w-4" /></button>
                                        <button onClick={() => confirmDelete(r.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </td>
                                </tr>
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
                                {distribusiNotifikasi?.channels?.reduce((acc: any, ch: any, i: number) => { const circ = 2 * Math.PI * 35; const dash = (ch.pct / 100) * circ; acc.elements.push(<g key={i} className="group cursor-pointer"><circle cx="50" cy="50" r="35" fill="none" stroke={ch.color} strokeWidth="14" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-acc.offset} transform="rotate(-90 50 50)" className="transition-all duration-300 group-hover:stroke-[18px]" /><title>{ch.label}: {ch.count} ({ch.pct}%)</title></g>); acc.offset += dash; return acc; }, { elements: [] as React.ReactNode[], offset: 0 }).elements}
                                <text x="50" y="46" textAnchor="middle" fill="#64748b" fontSize="8">Total</text>
                                <text x="50" y="58" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">{distribusiNotifikasi?.total?.toLocaleString() || 0}</text>
                            </svg>
                            <div className="space-y-2">
                                {distribusiNotifikasi?.channels?.map((ch: any) => (
                                    <div key={ch.label} className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                                        <span className="text-sm text-slate-700">{ch.label}</span>
                                        <span className="text-sm font-bold text-slate-900">{ch.count.toLocaleString()} ({ch.pct}%)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between border-t border-slate-100 pt-3 text-xs">
                            <span className="font-medium text-green-600">✓ Berhasil {distribusiNotifikasi?.berhasil?.count?.toLocaleString() || 0} ({distribusiNotifikasi?.berhasil?.pct || 0}%)</span>
                            <span className="font-medium text-red-600">✗ Gagal {distribusiNotifikasi?.gagal?.count || 0} ({distribusiNotifikasi?.gagal?.pct || 0}%)</span>
                            <span className="font-medium text-amber-600">⏳ Pending {distribusiNotifikasi?.pending?.count || 0} ({distribusiNotifikasi?.pending?.pct || 0}%)</span>
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
                                { name: 'Tinggi', color: '#EF4444', data: trendData ? trendData.map((d: any) => d.tinggi) : [] },
                                { name: 'Sedang', color: '#F59E0B', data: trendData ? trendData.map((d: any) => d.sedang) : [] },
                                { name: 'Rendah', color: '#22C55E', data: trendData ? trendData.map((d: any) => d.rendah) : [] },
                                { name: 'Aman', color: '#94A3B8', data: trendData ? trendData.map((d: any) => d.aman) : [] },
                            ].map((series, sIdx) => {
                                const pathD = series.data.length > 0 ? series.data.map((val: number, i: number) => `${i === 0 ? 'M' : 'L'} ${50 + i * 36} ${130 - (val/15)*110}`).join(' ') : '';
                                return pathD ? <path key={`path-${sIdx}`} d={pathD} fill="none" stroke={series.color} strokeWidth="2" strokeLinecap="round" /> : null;
                            })}

                            {/* Points & Tooltips */}
                            {[
                                { name: 'Tinggi', color: '#EF4444', data: trendData ? trendData.map((d: any) => d.tinggi) : [] },
                                { name: 'Sedang', color: '#F59E0B', data: trendData ? trendData.map((d: any) => d.sedang) : [] },
                                { name: 'Rendah', color: '#22C55E', data: trendData ? trendData.map((d: any) => d.rendah) : [] },
                                { name: 'Aman', color: '#94A3B8', data: trendData ? trendData.map((d: any) => d.aman) : [] },
                            ].map((series) => (
                                series.data.map((val: number, i: number) => {
                                    const x = 50 + i * 36;
                                    const y = 130 - (val/15)*110;
                                    const dateStr = trendData && trendData[i] ? trendData[i].date : '';
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
                            {(trendData ? trendData.map((d: any) => d.date) : []).map((l: string, i: number)=><text key={i} x={50+i*36} y="145" textAnchor="middle" fill="#94a3b8" fontSize="7">{l}</text>)}
                        </svg>
                        <div className="mt-2 flex justify-center gap-4">
                            {[{l:'Tinggi',c:'bg-red-500'},{l:'Sedang',c:'bg-amber-500'},{l:'Rendah',c:'bg-green-500'},{l:'Aman',c:'bg-slate-400'}].map(i=><div key={i.l} className="flex items-center gap-1.5"><div className={cn('h-2.5 w-2.5 rounded-full',i.c)}/><span className="text-xs text-slate-600">{i.l}</span></div>)}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-bold text-slate-900">TARGET NOTIFIKASI</h3>
                    <div className="space-y-2">
                        {targetNotifikasi?.map((t: any) => { const Icon = IconMap[t.icon] || Users; return (
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
