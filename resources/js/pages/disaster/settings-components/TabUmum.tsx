import { Shield, Upload, X } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function TabUmum({ appSettings }: any) {
    const [logoPreview, setLogoPreview] = useState(appSettings?.logo_url || '/icon.png');
    const [faviconPreview, setFaviconPreview] = useState(appSettings?.favicon_url || '/favicon.ico');
    
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        app_name: appSettings?.app_name || 'Disaster Intelligence System',
        app_description: appSettings?.app_description || 'Sistem deteksi dini dan kesiapsiagaan bencana berbasis crowdsourced data dan AI.',
        app_instansi: appSettings?.app_instansi || 'BPBD Kabupaten Indramayu',
        app_lang: appSettings?.app_lang || 'id',
        app_date_format: appSettings?.app_date_format || 'DD MMMM YYYY',
        info_sumber_data: appSettings?.info_sumber_data || '+62 812-3456-7890',
        logo_file: null as File | null,
        favicon_file: null as File | null,
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo_file', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('favicon_file', file);
            setFaviconPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post('/cms/settings/system', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                // Keep the preview URL but clear the file input so it doesn't upload again unless changed
                setData('logo_file', null);
                setData('favicon_file', null);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">Pengaturan Umum</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Atur informasi dasar, tampilan, dan identitas aplikasi.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Informasi Sistem */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                    <h3 className="mb-6 text-base font-semibold text-slate-900">Identitas Sistem</h3>
                    
                    <div className="space-y-4 flex-1">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Sistem</label>
                            <input 
                                type="text"
                                value={data.app_name}
                                onChange={(e) => setData('app_name', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Instansi</label>
                            <input 
                                type="text"
                                value={data.app_instansi}
                                onChange={(e) => setData('app_instansi', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Deskripsi Aplikasi</label>
                            <textarea 
                                rows={4}
                                value={data.app_description}
                                onChange={(e) => setData('app_description', e.target.value)}
                                className="block w-full rounded-lg border border-slate-200 py-2.5 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Appearance / Logo & Favicon */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                    <h3 className="mb-6 text-base font-semibold text-slate-900">Tampilan Aplikasi</h3>
                    
                    <div className="space-y-6 flex-1">
                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">Logo Utama</label>
                            <div className="flex items-start gap-5">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                    <img src={logoPreview} alt="Logo App" className="h-full w-full object-contain p-2" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <button 
                                            type="button" 
                                            onClick={() => logoInputRef.current?.click()}
                                            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none transition-all"
                                        >
                                            Unggah Logo
                                        </button>
                                        <input 
                                            ref={logoInputRef}
                                            type="file" 
                                            className="hidden" 
                                            onChange={handleLogoChange}
                                            accept="image/png, image/jpeg, image/svg+xml" 
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">Ukuran direkomendasikan 512x512px.<br/>Format PNG, JPG atau SVG. Maks 2MB.</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        {/* Favicon Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">Favicon</label>
                            <div className="flex items-start gap-5">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2">
                                    <img src={faviconPreview} alt="Favicon" className="h-full w-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <button 
                                            type="button" 
                                            onClick={() => faviconInputRef.current?.click()}
                                            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none transition-all"
                                        >
                                            Ubah Favicon
                                        </button>
                                        <input 
                                            ref={faviconInputRef}
                                            type="file" 
                                            className="hidden" 
                                            onChange={handleFaviconChange}
                                            accept="image/x-icon, image/png, image/svg+xml" 
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">Ikon tab browser.<br/>Format .ico atau .png 32x32px.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Settings */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">Pengaturan Dasar Lainnya</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Bahasa Sistem</label>
                            <select 
                                value={data.app_lang}
                                onChange={(e) => setData('app_lang', e.target.value)}
                                className="block w-full rounded-lg border border-slate-200 py-2.5 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white transition-colors"
                            >
                                <option value="id">Bahasa Indonesia</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Format Tanggal</label>
                            <select 
                                value={data.app_date_format}
                                onChange={(e) => setData('app_date_format', e.target.value)}
                                className="block w-full rounded-lg border border-slate-200 py-2.5 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white transition-colors"
                            >
                                <option value="DD MMMM YYYY">DD MMMM YYYY (21 Mei 2026)</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY (21/05/2026)</option>
                                <option value="MM/DD/YYYY">MM/DD/YYYY (05/21/2026)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Kontak Sumber Data (WhatsApp)</label>
                            <input 
                                type="text"
                                value={data.info_sumber_data}
                                onChange={(e) => setData('info_sumber_data', e.target.value)}
                                placeholder="+62 812-3456-7890"
                                className="block w-full rounded-lg border border-slate-200 py-2.5 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white transition-colors"
                            />
                            <p className="mt-2 text-xs text-slate-500">Nomor ini ditampilkan pada Info Bar di bagian bawah dashboard.</p>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button 
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
