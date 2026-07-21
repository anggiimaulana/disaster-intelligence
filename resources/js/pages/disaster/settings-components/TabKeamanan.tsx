import { KeyRound, ShieldAlert, Smartphone, Save } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

function parseSetting<T>(value: unknown, fallback: T): T {
    if (value === null || value === undefined) return fallback;
    if (Array.isArray(value) || typeof value === 'object') return value as T;
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return parsed ?? fallback;
        } catch {
            return fallback;
        }
    }
    return fallback;
}

export default function TabKeamanan({ appSettings }: any) {
    const { data, setData, processing } = useForm({
        security_2fa_enabled: String(appSettings?.security_2fa_enabled) === '1' || appSettings?.security_2fa_enabled === true,
        security_2fa_methods: parseSetting<string[]>(appSettings?.security_2fa_methods, ['authenticator', 'webauthn']),
        password_min_length: appSettings?.password_min_length || '12',
        password_require_case: String(appSettings?.password_require_case) === '1' || appSettings?.password_require_case === true,
        password_require_numbers: String(appSettings?.password_require_numbers) === '1' || appSettings?.password_require_numbers === true,
        password_require_symbols: String(appSettings?.password_require_symbols) === '1' || appSettings?.password_require_symbols === true,
        password_force_change_days: appSettings?.password_force_change_days || '90',
        session_timeout_minutes: appSettings?.session_timeout_minutes || '30',
        login_max_attempts: appSettings?.login_max_attempts || '5',
    });

    const toggleMethod = (method: string) => {
        if (data.security_2fa_methods.includes(method)) {
            setData('security_2fa_methods', data.security_2fa_methods.filter((m: string) => m !== method));
        } else {
            setData('security_2fa_methods', [...data.security_2fa_methods, method]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post('/cms/settings/system', data as any, {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">Keamanan Sistem</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Konfigurasi autentikasi, kebijakan kata sandi, dan keamanan sesi.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* 2FA Settings */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                            <Smartphone className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Two-Factor Authentication (2FA)</h3>
                            <p className="text-xs text-slate-500">Lapisan keamanan tambahan saat login</p>
                        </div>
                    </div>
                    
                    <div className="space-y-5 flex-1">
                        <div className="flex items-start justify-between">
                            <div className="pr-4">
                                <h4 className="text-sm font-medium text-slate-900">Wajibkan 2FA untuk Semua Admin</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Paksa semua pengguna dengan role Super Admin dan Operator untuk menggunakan aplikasi authenticator.</p>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center shrink-0">
                                <input 
                                    type="checkbox" 
                                    className="peer sr-only" 
                                    checked={data.security_2fa_enabled} 
                                    onChange={(e) => setData('security_2fa_enabled', e.target.checked)}
                                />
                                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"></div>
                            </label>
                        </div>
                        
                        <div className="h-px bg-slate-100" />
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Metode 2FA yang Diizinkan</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        checked={data.security_2fa_methods.includes('authenticator')}
                                        onChange={() => toggleMethod('authenticator')}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                    />
                                    <span className="text-sm text-slate-700">Authenticator App (Google, Authy)</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        checked={data.security_2fa_methods.includes('webauthn')}
                                        onChange={() => toggleMethod('webauthn')}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                    />
                                    <span className="text-sm text-slate-700">Passkey / WebAuthn (Rekomendasi)</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        checked={data.security_2fa_methods.includes('email')}
                                        onChange={() => toggleMethod('email')}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                    />
                                    <span className="text-sm text-slate-700">Email OTP</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Policy */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                            <KeyRound className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Kebijakan Kata Sandi</h3>
                            <p className="text-xs text-slate-500">Aturan pembuatan kata sandi pengguna</p>
                        </div>
                    </div>
                    
                    <div className="space-y-5 flex-1">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Panjang Minimum (Karakter)</label>
                            <input 
                                type="number" 
                                value={data.password_min_length}
                                onChange={(e) => setData('password_min_length', e.target.value)}
                                className="block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                            />
                        </div>
                        
                        <div className="space-y-3">
                            <label className="flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    checked={data.password_require_case} 
                                    onChange={(e) => setData('password_require_case', e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                                />
                                <span className="text-sm text-slate-700">Harus mengandung huruf besar & kecil</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    checked={data.password_require_numbers} 
                                    onChange={(e) => setData('password_require_numbers', e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                                />
                                <span className="text-sm text-slate-700">Harus mengandung angka</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    checked={data.password_require_symbols} 
                                    onChange={(e) => setData('password_require_symbols', e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                                />
                                <span className="text-sm text-slate-700">Harus mengandung simbol unik (@, #, $)</span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Paksa ganti setiap (Hari)</label>
                            <input 
                                type="number" 
                                value={data.password_force_change_days}
                                onChange={(e) => setData('password_force_change_days', e.target.value)}
                                className="block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Session & Restrictions */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                            <ShieldAlert className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Pembatasan Sesi & Keamanan Tambahan</h3>
                            <p className="text-xs text-slate-500">Mencegah akses tidak sah ke dashboard</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Batas Waktu Sesi Tidak Aktif (Menit)</label>
                            <input 
                                type="number" 
                                value={data.session_timeout_minutes}
                                onChange={(e) => setData('session_timeout_minutes', e.target.value)}
                                className="block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 bg-slate-50 focus:bg-white transition-colors"
                            />
                            <p className="mt-1 text-xs text-slate-500">Sistem otomatis logout jika tidak ada interaksi.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Batas Percobaan Login Gagal</label>
                            <input 
                                type="number" 
                                value={data.login_max_attempts}
                                onChange={(e) => setData('login_max_attempts', e.target.value)}
                                className="block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 bg-slate-50 focus:bg-white transition-colors"
                            />
                            <p className="mt-1 text-xs text-slate-500">Akun dikunci sementara (15 menit) jika melebihi batas.</p>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
                        <button 
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
                        >
                            {processing ? 'Menyimpan...' : (
                                <>
                                    <Save className="h-4 w-4" /> Simpan Aturan Keamanan
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
