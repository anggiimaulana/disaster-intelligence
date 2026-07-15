import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    Shield,
    Plus,
    Pencil,
    Trash2,
    Users,
    UserPlus,
    X,
    Loader2,
    Check,
    ChevronDown,
} from 'lucide-react';

interface Role {
    id: number;
    name: string;
    permissions: Array<{ id: number; name: string }>;
}

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    roles: Array<{ id: number; name: string }>;
}

interface Permission {
    id: number;
    name: string;
}

export default function RolesIndex({ roles, users, permissions }: { roles: Role[]; users: User[]; permissions: Permission[] }) {
    const [tab, setTab] = useState<'users' | 'roles'>('users');
    const [showRoleForm, setShowRoleForm] = useState(false);
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleteType, setDeleteType] = useState<'role' | 'user'>('role');

    // Role form
    const [roleName, setRoleName] = useState('');
    const [rolePerms, setRolePerms] = useState<string[]>([]);

    // User form
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userPasswordConfirm, setUserPasswordConfirm] = useState('');
    const [userRole, setUserRole] = useState('');

    const openRoleForm = (role?: Role) => {
        if (role) {
            setEditingRole(role);
            setRoleName(role.name);
            setRolePerms(role.permissions.map((p) => p.name));
        } else {
            setEditingRole(null);
            setRoleName('');
            setRolePerms([]);
        }
        setShowRoleForm(true);
    };

    const submitRole = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { name: roleName, permissions: rolePerms };
        if (editingRole) {
            router.put(`/cms/roles/${editingRole.id}`, data, { preserveScroll: true, onFinish: () => setShowRoleForm(false) });
        } else {
            router.post('/cms/roles', data, { preserveScroll: true, onFinish: () => setShowRoleForm(false) });
        }
    };

    const submitUser = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/cms/roles/users', {
            name: userName,
            email: userEmail,
            password: userPassword,
            password_confirmation: userPasswordConfirm,
            role: userRole,
        }, { preserveScroll: true, onFinish: () => { setShowUserForm(false); setUserName(''); setUserEmail(''); setUserPassword(''); setUserPasswordConfirm(''); setUserRole(''); } });
    };

    const handleAssignRole = (userId: number, roleName: string) => {
        router.post('/cms/roles/assign', { user_id: userId, role: roleName }, { preserveScroll: true });
    };

    const handleRemoveRole = (userId: number) => {
        router.post('/cms/roles/remove-role', { user_id: userId }, { preserveScroll: true });
    };

    const handleDelete = () => {
        if (deleteType === 'role' && deleteId) {
            router.delete(`/cms/roles/${deleteId}`, { preserveScroll: true, onFinish: () => { setDeleteId(null); setDeleteType('role'); } });
        } else if (deleteType === 'user' && deleteId) {
            router.delete(`/cms/roles/users/${deleteId}`, { preserveScroll: true, onFinish: () => { setDeleteId(null); setDeleteType('user'); } });
        }
    };

    return (
        <>
            <Head title="Role & Hak Akses" />

            <div className="mb-5">
                <h1 className="text-xl font-bold text-slate-900">Role & Hak Akses</h1>
                <p className="mt-1 text-sm text-slate-500">Kelola user dan role di satu tempat</p>
            </div>

            {/* Tabs */}
            <div className="mb-5 flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                <button onClick={() => setTab('users')} className={cn('flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors', tab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>
                    <Users className="h-4 w-4" /> User ({users.length})
                </button>
                <button onClick={() => setTab('roles')} className={cn('flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors', tab === 'roles' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>
                    <Shield className="h-4 w-4" /> Role ({roles.length})
                </button>
            </div>

            {/* Users Tab */}
            {tab === 'users' && (
                <>
                    <div className="mb-4 flex justify-end">
                        <button onClick={() => setShowUserForm(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                            <UserPlus className="h-4 w-4" /> Tambah User
                        </button>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-slate-100 bg-slate-50">
                                    <tr>
                                        <th className="px-5 py-3 font-medium text-slate-500">Nama</th>
                                        <th className="px-5 py-3 font-medium text-slate-500">Email</th>
                                        <th className="px-5 py-3 font-medium text-slate-500">Role</th>
                                        <th className="px-5 py-3 font-medium text-slate-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-medium text-slate-900">{user.name}</td>
                                            <td className="px-5 py-3 text-slate-600">{user.email}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    {user.roles.length > 0 ? (
                                                        user.roles.map((r) => (
                                                            <span key={r.id} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                                                {r.name}
                                                                <button onClick={() => handleRemoveRole(user.id)} className="ml-0.5 hover:text-blue-900"><X className="h-3 w-3" /></button>
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-slate-400">Tidak ada role</span>
                                                    )}
                                                    {roles.length > 0 && (
                                                        <select onChange={(e) => { if (e.target.value) handleAssignRole(user.id, e.target.value); e.target.value = ''; }} className="rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none">
                                                            <option value="">+ Tambah</option>
                                                            {roles.filter((r) => !user.roles.find((ur) => ur.id === r.id)).map((r) => (
                                                                <option key={r.id} value={r.name}>{r.name}</option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <button onClick={() => { setDeleteId(user.id); setDeleteType('user'); }} className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                                                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Roles Tab */}
            {tab === 'roles' && (
                <>
                    <div className="mb-4 flex justify-end">
                        <button onClick={() => openRoleForm()} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                            <Plus className="h-4 w-4" /> Tambah Role
                        </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {roles.map((role) => (
                            <div key={role.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                        <h3 className="font-bold text-slate-900">{role.name}</h3>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => openRoleForm(role)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><Pencil className="h-4 w-4" /></button>
                                        <button onClick={() => { setDeleteId(role.id); setDeleteType('role'); }} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-1">
                                    {role.permissions.length > 0 ? (
                                        role.permissions.map((p) => (
                                            <span key={p.id} className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">{p.name}</span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400">Tidak ada permission</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Role Form Modal */}
            {showRoleForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">{editingRole ? 'Edit Role' : 'Tambah Role'}</h3>
                            <button onClick={() => setShowRoleForm(false)} className="rounded-lg p-1 hover:bg-slate-100"><X className="h-5 w-5 text-slate-400" /></button>
                        </div>
                        <form onSubmit={submitRole} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Nama Role *</label>
                                <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" placeholder="Contoh: admin, editor, viewer" required />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Permissions</label>
                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto rounded-lg border border-slate-200 p-3">
                                    {permissions.map((perm) => (
                                        <label key={perm.id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                            <input type="checkbox" checked={rolePerms.includes(perm.name)} onChange={(e) => {
                                                if (e.target.checked) setRolePerms([...rolePerms, perm.name]);
                                                else setRolePerms(rolePerms.filter((p) => p !== perm.name));
                                            }} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                                            {perm.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowRoleForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Batal</button>
                                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">{editingRole ? 'Simpan' : 'Buat'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User Form Modal */}
            {showUserForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Tambah User</h3>
                            <button onClick={() => setShowUserForm(false)} className="rounded-lg p-1 hover:bg-slate-100"><X className="h-5 w-5 text-slate-400" /></button>
                        </div>
                        <form onSubmit={submitUser} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Nama *</label>
                                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" required />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email *</label>
                                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Password *</label>
                                    <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Konfirmasi Password *</label>
                                    <input type="password" value={userPasswordConfirm} onChange={(e) => setUserPasswordConfirm(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" required />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
                                <select value={userRole} onChange={(e) => setUserRole(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
                                    <option value="">Pilih Role (opsional)</option>
                                    {roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowUserForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Batal</button>
                                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Buat User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus</h3>
                        <p className="mt-2 text-sm text-slate-600">Apakah Anda yakin ingin menghapus {deleteType === 'role' ? 'role' : 'user'} ini?</p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button onClick={() => { setDeleteId(null); setDeleteType('role'); }} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Batal</button>
                            <button onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
