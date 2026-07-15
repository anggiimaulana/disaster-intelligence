import { Brain, Mail, MessageCircle, Send, Workflow, Plus, Trash2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { router } from '@inertiajs/react';

const integrationsList = [
    { id: 'wa', name: 'WhatsApp Gateway', desc: 'Terhubung ke WhatsApp Business API untuk notifikasi broadcast.', status: 'Terhubung', color: 'text-green-600', icon: MessageCircle },
    { id: 'n8n', name: 'n8n Workflow', desc: 'Otomasi alur penerimaan dan pemrosesan data pelaporan warga.', status: 'Aktif', color: 'text-green-600', icon: Workflow },
    { id: 'ai', name: 'AI Service (NLP & Vision)', desc: 'Layanan analisis teks laporan dan klasifikasi gambar bencana.', status: 'Connected', color: 'text-green-600', icon: Brain },
    { id: 'email', name: 'Email Service', desc: 'Pengiriman notifikasi dan laporan rekapitulasi melalui email.', status: 'Terhubung', color: 'text-green-600', icon: Mail },
    { id: 'sms', name: 'SMS Gateway', desc: 'Pengiriman notifikasi SMS sebagai cadangan jika internet down.', status: 'Terputus', color: 'text-slate-600', icon: Send },
];

export default function TabIntegrasi({ appSettings }: any) {
    const [integrations, setIntegrations] = useState(integrationsList);
    
    // Parse n8n_endpoints from appSettings if it exists, otherwise default empty array
    const defaultN8n = appSettings?.n8n_endpoints ? appSettings.n8n_endpoints : [];
    
    const [n8nEndpoints, setN8nEndpoints] = useState<any[]>(defaultN8n);
    const [saving, setSaving] = useState(false);

    const toggleStatus = (id: string) => {
        setIntegrations(integrations.map(intg => {
            if (intg.id === id) {
                const isActive = ['Terhubung', 'Aktif', 'Connected'].includes(intg.status);
                return { ...intg, status: isActive ? 'Terputus' : 'Terhubung' };
            }
            return intg;
        }));
    };

    const addN8nEndpoint = () => {
        setN8nEndpoints([...n8nEndpoints, { id: Date.now().toString(), name: '', url: '' }]);
    };

    const removeN8nEndpoint = (id: string, index: number) => {
        if (confirm('Yakin ingin menghapus webhook ini?')) {
            setN8nEndpoints(n8nEndpoints.filter(ep => ep.id !== id));
            router.delete(`/cms/settings/system/array/n8n_endpoints?index=${index}`, {
                preserveScroll: true,
            });
        }
    };

    const updateN8nEndpoint = (id: string, field: 'name' | 'url', value: string) => {
        setN8nEndpoints(n8nEndpoints.map(ep => ep.id === id ? { ...ep, [field]: value } : ep));
    };

    const saveN8nEndpoints = () => {
        setSaving(true);
        router.post('/cms/settings/system', { n8n_endpoints: n8nEndpoints }, {
            preserveScroll: true,
            onFinish: () => setSaving(false)
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Integrasi Layanan</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Kelola koneksi dengan layanan pihak ketiga dan API eksternal.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mt-6">
                    {integrations.map((intg) => {
                        const isActive = ['Terhubung', 'Aktif', 'Connected'].includes(intg.status);
                        return (
                            <div key={intg.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", isActive ? "bg-blue-50" : "bg-slate-50")}>
                                        <intg.icon className={cn("h-6 w-6", isActive ? "text-blue-600" : "text-slate-400")} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-semibold text-slate-900">{intg.name}</h3>
                                            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold border', isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200')}>
                                                {intg.status}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-slate-500 leading-relaxed">{intg.desc}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                    <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pengaturan Lanjut</button>
                                    
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input type="checkbox" className="peer sr-only" checked={isActive} onChange={() => toggleStatus(intg.id)} />
                                        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"></div>
                                    </label>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Konfigurasi Dinamis n8n */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                            <Workflow className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Konfigurasi Endpoint n8n (Dinamis)</h3>
                            <p className="text-xs text-slate-500">Atur webhook dan variabel API n8n tanpa batas</p>
                        </div>
                    </div>
                    <button 
                        onClick={addN8nEndpoint}
                        className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Tambah Endpoint
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    {n8nEndpoints.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-sm">Belum ada endpoint n8n yang dikonfigurasi. Klik "Tambah Endpoint" untuk memulai.</div>
                    ) : (
                        n8nEndpoints.map((ep, index) => (
                            <div key={ep.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 transition-colors">
                                <div className="flex-1 w-full sm:w-auto">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Nama Variabel / Fungsi</label>
                                    <input 
                                        type="text" 
                                        value={ep.name}
                                        onChange={(e) => updateN8nEndpoint(ep.id, 'name', e.target.value)}
                                        placeholder="Contoh: Webhook Laporan Warga"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                                    />
                                </div>
                                <div className="flex-[2] w-full sm:w-auto">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">URL Endpoint (Webhook)</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={ep.url}
                                            onChange={(e) => updateN8nEndpoint(ep.id, 'url', e.target.value)}
                                            placeholder="https://n8n.domainanda.com/webhook/..."
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono" 
                                        />
                                        <button 
                                            onClick={() => removeN8nEndpoint(ep.id, index)}
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            title="Hapus Endpoint"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    
                    <div className="flex justify-end pt-4 mt-2 border-t border-slate-100">
                        <button 
                            onClick={saveN8nEndpoints}
                            disabled={saving}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-70 transition-colors"
                        >
                            {saving ? 'Menyimpan...' : (
                                <>
                                    <Save className="h-4 w-4" /> Simpan Konfigurasi n8n
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
