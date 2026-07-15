import { Search, Plus, MoreHorizontal } from 'lucide-react';

const mockUsers = [
    { id: 1, name: 'Admin BPBD', email: 'admin@bpbd.indramayu.go.id', role: 'Super Admin', status: 'Aktif', lastLogin: 'Hari ini, 10:45' },
    { id: 2, name: 'Operator TRC', email: 'operator.trc@bpbd.indramayu.go.id', role: 'Operator', status: 'Aktif', lastLogin: 'Kemarin, 14:20' },
    { id: 3, name: 'Relawan TIK', email: 'relawan1@rtik.id', role: 'Relawan', status: 'Aktif', lastLogin: '2 Hari yang lalu' },
    { id: 4, name: 'Bupati Indramayu', email: 'bupati@indramayu.go.id', role: 'Viewer (Eksekutif)', status: 'Non-aktif', lastLogin: '1 Bulan yang lalu' },
];

export default function TabPengguna() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Pengguna & Akses</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Kelola akun pengguna, peran, dan hak akses ke dalam sistem.
                    </p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors shrink-0">
                    <Plus className="h-4 w-4" /> Tambah Pengguna
                </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cari pengguna berdasarkan nama atau email..." 
                            className="block w-full rounded-lg border-slate-200 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select className="block w-full rounded-lg border-slate-200 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option>Semua Peran</option>
                            <option>Super Admin</option>
                            <option>Operator</option>
                            <option>Relawan</option>
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
                                <th className="px-6 py-3 font-semibold text-slate-700">Login Terakhir</th>
                                <th className="px-6 py-3 font-semibold text-slate-700 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {mockUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{user.name}</div>
                                        <div className="text-slate-500 text-xs mt-0.5">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.status === 'Aktif' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-slate-100 text-slate-600 ring-slate-500/10'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{user.lastLogin}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500 flex justify-between items-center">
                    <span>Menampilkan 1 hingga 4 dari 4 pengguna</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 rounded border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Sebelumnya</button>
                        <button className="px-3 py-1 rounded border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Selanjutnya</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
