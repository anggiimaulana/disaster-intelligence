import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Search, Plus, X, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

interface UserRow {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    roles: string[];
    created_at: string | null;
}

interface RoleOption {
    id: number;
    name: string;
}

interface PageProps extends InertiaPageProps {
    users: UserRow[];
    roles: RoleOption[];
    flash?: { success?: string; error?: string };
}

export default function TabPengguna() {
    const { users = [], roles = [], flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<UserRow | null>(null);

    const addForm = useForm<{ name: string; email: string; password: string; password_confirmation: string; role: string }>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    const filtered = users.filter((u) => {
        const matchSearch = !search
            || u.name.toLowerCase().includes(search.toLowerCase())
            || u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = !roleFilter || u.roles.includes(roleFilter);
        return matchSearch && matchRole;
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/cms/roles/users', {
            preserveScroll: true,
            onSuccess: () => {
                addForm.reset();
                setShowAdd(false);
            },
        });
    };

    const handleDelete = (user: UserRow) => {
        router.delete(`/cms/roles/users/${user.id}`, {
            preserveScroll: true,
            onSuccess: () => setConfirmDelete(null),
        });
    };

    return (
        <>
            {flash?.success && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
                    {flash.success}
                </div>
            )}

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Pengguna & Akses</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Kelola akun pengguna, peran, dan hak akses ke dalam sistem.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors shrink-0"
                    >
                        <Plus className="h-4 w-4" /> Tambah Pengguna
                    </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari pengguna berdasarkan nama atau email..."
                                className="block w-full rounded-lg border-slate-200 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="block w-full rounded-lg border-slate-200 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Semua Peran</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.name}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-slate-700">Nama Pengguna</th>
                                    <th className="px-6 py-3 font-semibold text-slate-700">Peran</th>
                                    <th className="px-6 py-3 font-semibold text-slate-700">Status</th>
                                    <th className="px-6 py-3 font-semibold text-slate-700">Terdaftar</th>
                                    <th className="px-6 py-3 font-semibold text-slate-700 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                                            {users.length === 0 ? 'Belum ada pengguna.' : 'Tidak ada hasil yang cocok dengan filter.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{user.name}</div>
                                                <div className="text-slate-500 text-xs mt-0.5">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.roles.length === 0 ? (
                                                    <span className="text-xs text-slate-400">Tidak ada peran</span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles.map((r) => (
                                                            <span key={r} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                                {r}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.is_admin ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-slate-100 text-slate-600 ring-slate-500/10'}`}>
                                                    {user.is_admin ? 'Aktif' : 'Non-aktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setConfirmDelete(user)}
                                                    className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                                    title="Hapus pengguna"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
                        Menampilkan {filtered.length} dari {users.length} pengguna
                    </div>
                </div>
            </div>

            {showAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Tambah Pengguna</h3>
                            <button onClick={() => { setShowAdd(false); addForm.reset(); addForm.clearErrors(); }} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Nama</label>
                                <input
                                    type="text"
                                    value={addForm.data.name}
                                    onChange={(e) => addForm.setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                                {addForm.errors.name && <p className="mt-1 text-xs text-red-600">{addForm.errors.name}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                                <input
                                    type="email"
                                    value={addForm.data.email}
                                    onChange={(e) => addForm.setData('email', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                                {addForm.errors.email && <p className="mt-1 text-xs text-red-600">{addForm.errors.email}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                                <input
                                    type="password"
                                    value={addForm.data.password}
                                    onChange={(e) => addForm.setData('password', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                                {addForm.errors.password && <p className="mt-1 text-xs text-red-600">{addForm.errors.password}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Konfirmasi Password</label>
                                <input
                                    type="password"
                                    value={addForm.data.password_confirmation}
                                    onChange={(e) => addForm.setData('password_confirmation', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Peran</label>
                                <select
                                    value={addForm.data.role}
                                    onChange={(e) => addForm.setData('role', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">— Tanpa peran —</option>
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.name}>{r.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowAdd(false); addForm.reset(); addForm.clearErrors(); }}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={addForm.processing}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                                >
                                    {addForm.processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-900">Hapus Pengguna?</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            <strong>{confirmDelete.name}</strong> ({confirmDelete.email}) akan dihapus permanen.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDelete)}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
