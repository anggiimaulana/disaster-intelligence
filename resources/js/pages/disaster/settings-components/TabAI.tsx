import { Brain, Cpu, Globe, Key, Save, Server } from 'lucide-react';
import { useForm } from '@inertiajs/react';

const PROVIDERS = [
    {
        id: 'openai-compatible',
        name: 'OpenAI Compatible',
        description: 'OpenAI API format. Cocok untuk OpenAI, OpenRouter, Together AI, Groq, dll.',
        defaultBaseUrl: 'https://api.openai.com/v1',
        models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-5-sonnet', 'llama-3-70b'],
        placeholder: 'sk-...',
    },
    {
        id: 'claude',
        name: 'Claude (Anthropic)',
        description: 'Anthropic API langsung. Model Claude terbaru.',
        defaultBaseUrl: 'https://api.anthropic.com',
        models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
        placeholder: 'sk-ant-...',
    },
    {
        id: 'gemini',
        name: 'Google Gemini',
        description: 'Google AI Studio / Vertex AI API.',
        defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'],
        placeholder: 'AIza...',
    },
];

export default function TabAI({ appSettings }: any) {
    const { data, setData, post, processing } = useForm({
        ai_provider: appSettings?.ai_provider || 'openai-compatible',
        ai_base_url: appSettings?.ai_base_url || '',
        ai_model: appSettings?.ai_model || '',
        ai_api_key: appSettings?.ai_api_key || '',
        ai_min_confidence: appSettings?.ai_min_confidence || '85',
        ai_auto_classification: appSettings?.ai_auto_classification === '1' || appSettings?.ai_auto_classification === true || false,
        ai_auto_location: appSettings?.ai_auto_location === '1' || appSettings?.ai_auto_location === true || false,
    });

    const selectedProvider = PROVIDERS.find(p => p.id === data.ai_provider) || PROVIDERS[0];

    const handleProviderChange = (providerId: string) => {
        const provider = PROVIDERS.find(p => p.id === providerId);
        if (provider) {
            setData('ai_provider', providerId);
            setData('ai_base_url', provider.defaultBaseUrl);
            setData('ai_model', provider.models[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/cms/settings/system', { preserveScroll: true });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">Konfigurasi AI & Analitik</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Atur provider AI, model, base URL, dan pengaturan analitik data laporan.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Provider & Connection Settings */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                            <Brain className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Provider & Koneksi AI</h3>
                            <p className="text-xs text-slate-500">Pilih penyedia AI dan konfigurasi koneksi</p>
                        </div>
                    </div>

                    <div className="space-y-5 flex-1">
                        {/* Provider Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">AI Provider</label>
                            <div className="grid grid-cols-1 gap-2">
                                {PROVIDERS.map((provider) => (
                                    <label
                                        key={provider.id}
                                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                                            data.ai_provider === provider.id
                                                ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500'
                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="ai_provider"
                                            value={provider.id}
                                            checked={data.ai_provider === provider.id}
                                            onChange={() => handleProviderChange(provider.id)}
                                            className="mt-0.5 h-4 w-4 text-purple-600 focus:ring-purple-500"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{provider.name}</p>
                                            <p className="text-xs text-slate-500">{provider.description}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Base URL */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <span className="flex items-center gap-1.5">
                                    <Globe className="h-3.5 w-3.5" /> Base URL
                                </span>
                            </label>
                            <input
                                type="url"
                                value={data.ai_base_url}
                                onChange={(e) => setData('ai_base_url', e.target.value)}
                                placeholder={selectedProvider.defaultBaseUrl}
                                className="block w-full rounded-lg border border-slate-200 py-2.5 pl-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-slate-50 focus:bg-white transition-colors font-mono text-xs"
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                URL endpoint API. Untuk OpenAI Compatible, bisa ganti ke provider lain seperti OpenRouter.
                            </p>
                        </div>

                        {/* Model */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <span className="flex items-center gap-1.5">
                                    <Server className="h-3.5 w-3.5" /> Model
                                </span>
                            </label>
                            <input
                                type="text"
                                value={data.ai_model}
                                onChange={(e) => setData('ai_model', e.target.value)}
                                placeholder={selectedProvider.models[0] || 'Ketik nama model...'}
                                list="ai-model-suggestions"
                                className="block w-full rounded-lg border border-slate-200 py-2.5 pl-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-slate-50 focus:bg-white transition-colors font-mono text-xs"
                            />
                            <datalist id="ai-model-suggestions">
                                {selectedProvider.models.map((model) => (
                                    <option key={model} value={model} />
                                ))}
                            </datalist>
                            <p className="mt-1 text-xs text-slate-500">Ketik manual atau pilih dari saran. Bebas pakai model apapun dari provider.</p>
                        </div>

                        {/* API Key */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <span className="flex items-center gap-1.5">
                                    <Key className="h-3.5 w-3.5" /> API Key
                                </span>
                            </label>
                            <input
                                type="password"
                                value={data.ai_api_key}
                                onChange={(e) => setData('ai_api_key', e.target.value)}
                                placeholder={selectedProvider.placeholder}
                                className="block w-full rounded-lg border border-slate-200 py-2.5 pl-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-slate-50 focus:bg-white transition-colors"
                            />
                            <p className="mt-1 text-xs text-slate-500">Kosongkan jika tidak ingin mengubah. Disimpan secara terenkripsi.</p>
                        </div>
                    </div>
                </div>

                {/* Thresholds & Automation */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                            <Cpu className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Otomasi & Threshold</h3>
                            <p className="text-xs text-slate-500">Ambang batas tingkat keyakinan (confidence)</p>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700">Minimum Confidence Deteksi Bencana</label>
                                <span className="text-sm font-bold text-amber-600">{data.ai_min_confidence}%</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="99"
                                value={data.ai_min_confidence}
                                onChange={(e) => setData('ai_min_confidence', e.target.value)}
                                className="w-full accent-amber-500"
                            />
                            <p className="mt-1 text-xs text-slate-500">Laporan di bawah angka ini membutuhkan validasi manual oleh admin.</p>
                        </div>

                        <div className="h-px bg-slate-100" />

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-slate-900">Auto-Klasifikasi Kategori</h4>
                                <p className="text-xs text-slate-500 mt-1">Biarkan AI menentukan jenis bencana secara otomatis</p>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={data.ai_auto_classification}
                                    onChange={(e) => setData('ai_auto_classification', e.target.checked)}
                                />
                                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-slate-900">Ekstraksi Lokasi Otomatis</h4>
                                <p className="text-xs text-slate-500 mt-1">Gunakan NER untuk mengekstrak alamat/lokasi dari teks laporan</p>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={data.ai_auto_location}
                                    onChange={(e) => setData('ai_auto_location', e.target.checked)}
                                />
                                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
                >
                    {processing ? 'Menyimpan...' : (
                        <>
                            <Save className="h-4 w-4" /> Simpan Pengaturan AI
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
