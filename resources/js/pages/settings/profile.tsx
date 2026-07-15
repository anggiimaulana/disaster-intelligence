import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { ArrowLeft, Loader2, Save, Lock, Trash2, Camera, X } from 'lucide-react';

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<{ auth: { user: { name: string; email: string; email_verified_at: string | null } } }>().props;

    const profileForm = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [showDelete, setShowDelete] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', profileForm.data.name);
        formData.append('email', profileForm.data.email);
        formData.append('_method', 'PUT');
        if (avatarFile) formData.append('avatar', avatarFile);
        router.post('/cms/settings/profile', formData, { preserveScroll: true });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/cms/settings/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset('current_password', 'password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Profil Saya" />

            <div className="max-w-3xl pb-10">
                <div className="mb-6">
                    <a href="/cms/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </a>
                    <h1 className="text-xl font-bold text-slate-900">Profil Saya</h1>
                    <p className="mt-1 text-sm text-slate-500">Kelola informasi profil dan kata sandi Anda</p>
                </div>

            {/* Profile Info */}
            <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-base font-bold text-slate-900">Informasi Profil</h2>
                    </div>

                    <div className="flex items-center gap-5 mb-5">
                        <div onClick={() => avatarInputRef.current?.click()} className="relative cursor-pointer group">
                            {avatarPreview || auth.user.avatar ? (
                                <img src={avatarPreview || `/storage/${auth.user.avatar}`} alt="Avatar" className="h-20 w-20 rounded-full object-cover border-2 border-slate-200" />
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-2xl font-bold text-white">
                                    {auth.user.name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Camera className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">Foto Profil</p>
                            <p className="text-xs text-slate-500">Klik untuk mengganti foto</p>
                            {avatarFile && (
                                <button type="button" onClick={() => { setAvatarFile(null); setAvatarPreview(null); }} className="mt-1 text-xs text-red-500 hover:text-red-700">Hapus foto</button>
                            )}
                        </div>
                        <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Nama Lengkap</label>
                            <input
                                type="text"
                                value={profileForm.data.name}
                                onChange={(e) => profileForm.setData('name', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                placeholder="Masukkan nama lengkap"
                            />
                            {profileForm.errors.name && <p className="mt-1 text-xs text-red-600">{profileForm.errors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                value={profileForm.data.email}
                                onChange={(e) => profileForm.setData('email', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                placeholder="Masukkan email"
                            />
                            {profileForm.errors.email && <p className="mt-1 text-xs text-red-600">{profileForm.errors.email}</p>}
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                                <p className="text-sm text-amber-700">
                                    Email belum diverifikasi.{' '}
                                    <button type="button" onClick={() => router.post('/email/verification-notification')} className="font-medium underline">
                                        Kirim ulang email verifikasi
                                    </button>
                                </p>
                                {status === 'verification-link-sent' && (
                                    <p className="mt-1 text-xs text-green-600">Link verifikasi telah dikirim ke email Anda.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-5 flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={profileForm.processing}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                        >
                            {profileForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Simpan Profil
                        </button>
                    </div>
                </div>
            </form>

            {/* Password Change */}
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Lock className="h-5 w-5 text-blue-600" />
                        <h2 className="text-base font-bold text-slate-900">Ubah Kata Sandi</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Kata Sandi Saat Ini *</label>
                            <input
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                placeholder="Masukkan kata sandi saat ini"
                            />
                            {passwordForm.errors.current_password && <p className="mt-1 text-xs text-red-600">{passwordForm.errors.current_password}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Kata Sandi Baru *</label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Masukkan kata sandi baru"
                                />
                                {passwordForm.errors.password && <p className="mt-1 text-xs text-red-600">{passwordForm.errors.password}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Konfirmasi Kata Sandi *</label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Ulangi kata sandi baru"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                        >
                            {passwordForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                            Ubah Kata Sandi
                        </button>
                    </div>
                </div>
            </form>

            {/* Danger Zone */}
            <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Trash2 className="h-5 w-5 text-red-600" />
                    <h2 className="text-base font-bold text-red-900">Hapus Akun</h2>
                </div>
                <p className="text-sm text-slate-600 mb-4">Setelah akun dihapus, semua data akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.</p>
                <button
                    onClick={() => setShowDelete(!showDelete)}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    Hapus Akun
                </button>
                {showDelete && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            router.delete('/cms/settings/profile');
                        }} className="space-y-3">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Konfirmasi dengan kata sandi</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                                    placeholder="Masukkan kata sandi"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowDelete(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                                    Batal
                                </button>
                                <button type="submit" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                                    Ya, Hapus Akun
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            </div>
        </>
    );
}
