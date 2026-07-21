import { Brain, Mail, MessageCircle, Send, Workflow, Plus, Trash2, Save, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import { router } from '@inertiajs/react';

const integrationsList = [
    { id: 'wa', name: 'WhatsApp Gateway', desc: 'Terhubung ke WhatsApp Business API untuk notifikasi broadcast.', icon: MessageCircle },
    { id: 'n8n', name: 'n8n Workflow', desc: 'Otomasi alur penerimaan dan pemrosesan data pelaporan warga.', icon: Workflow },
    { id: 'ai', name: 'AI Service (NLP & Vision)', desc: 'Layanan analisis teks laporan dan klasifikasi gambar bencana.', icon: Brain },
    { id: 'email', name: 'Email Service', desc: 'Pengiriman notifikasi dan laporan rekapitulasi melalui email.', icon: Mail },
    { id: 'sms', name: 'SMS Gateway', desc: 'Pengiriman notifikasi SMS sebagai cadangan jika internet down.', icon: Send },
];

const settingKey = (id: string) => `integration_${id}_enabled`;
const configKey = (id: string) => `integration_${id}_config_url`;

function safeArray<T>(value: unknown): T[] {
    if (Array.isArray(value)) return value as T[];
    return [];
}

export default function TabIntegrasi({ appSettings = {} }: { appSettings?: Record<string, unknown> }) {
    const [integrations, setIntegrations] = useState(() =>
        integrationsList.map((intg) => ({
            ...intg,
            enabled: appSettings[settingKey(intg.id)] === true || appSettings[settingKey(intg.id)] === 'true',
            configUrl: (appSettings[configKey(intg.id)] as string) ?? '',
        }))
    );

    const [n8nEndpoints, setN8nEndpoints] = useState<Array<{ id: string; name: string; url: string }>>(() => {
        const raw = appSettings.n8n_endpoints;
        if (Array.isArray(raw)) {
            return raw.map((ep: any, i: number) => ({
                id: String(ep.id ?? `seed-${i}`),
                name: ep.name ?? '',
                url: ep.url ?? '',
            }));
        }
        return [];
    });

    const [saving, setSaving] = useState(false);
    const [configTarget, setConfigTarget] = useState<(typeof integrations)[number] | null>(null);
    const [configDraft, setConfigDraft] = useState({ enabled: false, configUrl: '' });
    const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);

    const toggleTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    const postSetting = (patch: Record<string, unknown>, options: { onSuccess?: () => void; onError?: () => void; onFinish?: () => void } = {}) => {
        router.post('/cms/settings/system', patch as any, {
            preserveScroll: true,
            onSuccess: options.onSuccess,
            onError: options.onError,
            onFinish: options.onFinish,
        });
    };

    const persistToggle = (id: string, nextEnabled: boolean) => {
        if (toggleTimers.current[id]) {
            clearTimeout(toggleTimers.current[id]);
        }
        toggleTimers.current[id] = setTimeout(() => {
            setPendingToggleId(id);
            const previous = integrations.find((i) => i.id === id)?.enabled ?? false;
            postSetting(
                { [settingKey(id)]: nextEnabled ? 'true' : 'false' },
                {
                    onError: () => {
                        // Rollback optimistic update on failure
                        setIntegrations((prev) => prev.map((intg) => intg.id === id ? { ...intg, enabled: previous } : intg));
                    },
                    onFinish: () => {
                        setPendingToggleId(null);
                        delete toggleTimers.current[id];
                    },
                },
            );
        }, 250);
    };

    const toggleStatus = (id: string) => {
        const target = integrations.find((i) => i.id === id);
        if (!target) return;
        const nextEnabled = !target.enabled;
        setIntegrations(integrations.map((intg) => (intg.id === id ? { ...intg, enabled: nextEnabled } : intg)));
        persistToggle(id, nextEnabled);
    };

    const openConfig = (intg: (typeof integrations)[number]) => {
        setConfigTarget(intg);
        setConfigDraft({ enabled: intg.enabled, configUrl: intg.configUrl });
    };

    const saveConfig = () => {
        if (!configTarget) return;
        const id = configTarget.id;
        const payload: Record<string, unknown> = {
            [settingKey(id)]: configDraft.enabled ? 'true' : 'false',
            [configKey(id)]: configDraft.configUrl,
        };
        postSetting(payload, {
            onSuccess: () => {
                setIntegrations((prev) => prev.map((intg) => intg.id === id ? { ...intg, enabled: configDraft.enabled, configUrl: configDraft.configUrl } : intg));
                setConfigTarget(null);
            },
        });
    };

    const addN8nEndpoint = () => {
        setN8nEndpoints([...n8nEndpoints, { id: `new-${Date.now()}`, name: '', url: '' }]);
    };

    const removeN8nEndpoint = (id: string, index: number) => {
        if (!confirm('Yakin ingin menghapus webhook ini?')) return;
        setN8nEndpoints(n8nEndpoints.filter((ep) => ep.id !== id));
        router.delete(`/cms/settings/system/array/n8n_endpoints?index=${index}`, {
            preserveScroll: true,
        });
    };

    const updateN8nEndpoint = (id: string, field: 'name' | 'url', value: string) => {
        setN8nEndpoints(n8nEndpoints.map((ep) => (ep.id === id ? { ...ep, [field]: value } : ep)));
    };

    const saveN8nEndpoints = () => {
        setSaving(true);
        router.post('/cms/settings/system', { n8n_endpoints: safeArray(n8nEndpoints) }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
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
                        const Icon = intg.icon;
                        return (
                            <div key={intg.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', intg.enabled ? 'bg-blue-50' : 'bg-slate-50')}>
                                        <Icon className={cn('h-6 w-6', intg.enabled ? 'text-blue-600' : 'text-slate-400')} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-semibold text-slate-900">{intg.name}</h3>
                                            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold border', intg.enabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200')}>
                                                {intg.enabled ? 'Aktif' : 'Non-aktif'}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-slate-500 leading-relaxed">{intg.desc}</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                    <button
                                        onClick={() => openConfig(intg)}
                                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        Pengaturan Lanjut
                                    </button>

                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input type="checkbox" className="peer sr-only" checked={intg.enabled} disabled={pendingToggleId === intg.id} onChange={() => toggleStatus(intg.id)} />
                                        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"></div>
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
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" /> Simpan Konfigurasi n8n
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Config Modal */}
            {configTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Pengaturan: {configTarget.name}</h3>
                            <button onClick={() => setConfigTarget(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={configDraft.enabled}
                                    onChange={(e) => setConfigDraft({ ...configDraft, enabled: e.target.checked })}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700">Aktifkan integrasi ini</span>
                            </label>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">URL Konfigurasi / Webhook</label>
                                <input
                                    type="url"
                                    value={configDraft.configUrl}
                                    onChange={(e) => setConfigDraft({ ...configDraft, configUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setConfigTarget(null)}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={saveConfig}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
