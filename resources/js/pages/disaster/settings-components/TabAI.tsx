import { Brain, Cpu, Database, Network, Save } from 'lucide-react';
import { useForm } from '@inertiajs/react';

export default function TabAI({ appSettings }: any) {
    const { data, setData, post, processing } = useForm({
        ai_nlp_model: appSettings?.ai_nlp_model || 'Gemini 1.5 Pro',
        ai_vision_model: appSettings?.ai_vision_model || 'Gemini 1.5 Pro Vision',
        ai_api_key: appSettings?.ai_api_key || '',
        ai_min_confidence: appSettings?.ai_min_confidence || '85',
        ai_auto_classification: appSettings?.ai_auto_classification === '1' || appSettings?.ai_auto_classification === true || false,
        ai_auto_location: appSettings?.ai_auto_location === '1' || appSettings?.ai_auto_location === true || false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/cms/settings/system', { preserveScroll: true });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">Konfigurasi AI & Analitik</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Atur model AI, threshold deteksi, dan pengaturan analitik data laporan.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Model Settings */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                            <Brain className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Model AI (Vision & NLP)</h3>
                            <p className="text-xs text-slate-500">Pilih mesin kecerdasan buatan utama</p>
                        </div>
                    </div>
                    
                    <div className="space-y-5 flex-1">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Model Pemrosesan Teks (NLP)</label>
                            <select 
                                value={data.ai_nlp_model}
                                onChange={(e) => setData('ai_nlp_model', e.target.value)}
                                className="block w-full rounded-lg border border-slate-200 py-2.5 pl-3 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-slate-50 focus:bg-white transition-colors"
                            >
                                <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Rekomendasi)</option>
                                <option value="GPT-4o">GPT-4o</option>
                                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                                <option value="Llama 3">Llama 3 (Lokal)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Model Pemrosesan Gambar (Vision)</label>
                            <select 
                                value={data.ai_vision_model}
                                onChange={(e) => setData('ai_vision_model', e.target.value)}
                                className="block w-full rounded-lg border border-slate-200 py-2.5 pl-3 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-slate-50 focus:bg-white transition-colors"
                            >
                                <option value="Gemini 1.5 Pro Vision">Gemini 1.5 Pro Vision</option>
                                <option value="GPT-4o Vision">GPT-4o Vision</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">API Key (OpenAI / Anthropic / Gemini)</label>
                            <input 
                                type="password" 
                                value={data.ai_api_key}
                                onChange={(e) => setData('ai_api_key', e.target.value)}
                                placeholder="************************"
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
                                <p className="text-xs text-slate-500 mt-1">Biarkan AI menentukan jenis bencana secara otomatis (Banjir, Gempa, dll)</p>
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
                                <p className="text-xs text-slate-500 mt-1">Gunakan NER untuk mengekstrak alamat/lokasi dari teks laporan deskriptif</p>
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
