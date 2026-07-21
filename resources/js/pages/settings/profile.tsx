import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { ArrowLeft, Loader2, Save, Lock, Trash2, Camera, Image as ImageIcon } from 'lucide-react';
import { MediaLibraryPicker } from '@/components/ui/media-library-picker';

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<{ auth: { user: { name: string; email: string; email_verified_at: string | null; avatar?: string | null } } }>().props;

    const profileForm = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });
    const [avatarPath, setAvatarPath] = useState<string>(auth.user.avatar ?? '');

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [showDelete, setShowDelete] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
            setAvatarPath('');
        }
    };

    const handleMediaSelect = (media: { file_path: string; file_url: string }) => {
        setAvatarFile(null);
        setAvatarPreview(media.file_url);
        setAvatarPath(media.file_path);
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', profileForm.data.name);
        formData.append('email', profileForm.data.email);
        formData.append('_method', 'PUT');
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        } else if (avatarPath) {
            formData.append('avatar_path', avatarPath);
        }
        router.post('/cms/settings/profile', formData, { preserveScroll: true });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/cms/settings/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset('current_password', 'password', 'password_confirmation'),
        });
    };

    const currentAvatar = avatarPreview ?? (avatarPath ? `/storage/${avatarPath}` : (auth.user.avatar ? `/storage/${auth.user.avatar}` : null));

    return (
        <>
            <Head title="Profil Saya" />

            <div className="mx-auto max-w-2xl pb-10">
                <div className="mb-6 text-center">
                    <a href="/cms/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </a>
                    <h1 className="text-xl font-bold text-slate-900">Profil Saya</h1>
                    <p className="mt-1 text-sm text-slate-500">Kelola informasi profil dan kata sandi Anda</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-5">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex flex-col items-center text-center">
                            <div onClick={() => avatarInputRef.current?.click()} className="group relative cursor-pointer">
                                {currentAvatar ? (
                                    <img src={currentAvatar} alt="Avatar" className="h-24 w-24 rounded-full object-cover border-2 border-slate-200" />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-3xl font-bold text-white">
                                        {auth.user.name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Camera className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <p className="mt-3 text-sm font-medium text-slate-900">Foto Profil</p>
                            <p className="text-xs text-slate-500">Klik avatar untuk mengganti, atau pilih dari media library</p>
                            <div className="mt-3 flex flex-wrap justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                                >
                                    Unggah Foto
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowMediaPicker(true)}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                                >
                                    <ImageIcon className="h-3.5 w-3.5" /> Pilih dari Media Library
                                </button>
                                {(avatarFile || avatarPath) && (
                                    <button
                                        type="button"
                                        onClick={() => { setAvatarFile(null); setAvatarPreview(null); setAvatarPath(''); }}
                                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                    >
                                        Reset
                                    </button>
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
                                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
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

                        <div className="mt-6 flex items-center justify-end border-t border-slate-100 pt-5">
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {profileForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Simpan Profil
                            </button>
                        </div>
                    </div>
                </form>

                <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-5">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
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

                        <div className="mt-5 flex items-center justify-end border-t border-slate-100 pt-5">
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {passwordForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                                Ubah Kata Sandi
                            </button>
                        </div>
                    </div>
                </form>

                <div className="mt-5 rounded-xl border border-red-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-red-600" />
                        <h2 className="text-base font-bold text-red-900">Hapus Akun</h2>
                    </div>
                    <p className="mb-4 text-sm text-slate-600">Setelah akun dihapus, semua data akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.</p>
                    <button
                        onClick={() => setShowDelete(!showDelete)}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
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

            <MediaLibraryPicker
                open={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={handleMediaSelect}
            />
        </>
    );
}
