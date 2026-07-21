import { Head, Link } from '@inertiajs/react';
import { Activity, Clock, Database, Globe, ChevronDown, ChevronUp, User } from 'lucide-react';
import React, { useState } from 'react';

type AuditLog = {
    id: number;
    user_id: number | null;
    action: string;
    table_name: string;
    record_id: number;
    old_data: any | null;
    new_data: any | null;
    ip_address: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    } | null;
};

type PaginatedLogs = {
    data: AuditLog[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
};

interface Props {
    logs: PaginatedLogs;
}

export default function SettingsLog({ logs }: Props) {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const toggleRow = (id: number) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const getActionBadge = (action: string) => {
        const actionLower = action.toLowerCase();
        if (actionLower.includes('create') || actionLower.includes('insert')) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">CREATE</span>;
        }
        if (actionLower.includes('update') || actionLower.includes('edit')) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">UPDATE</span>;
        }
        if (actionLower.includes('delete') || actionLower.includes('destroy')) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">DELETE</span>;
        }
        if (actionLower.includes('login')) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">LOGIN</span>;
        }
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">{action.toUpperCase()}</span>;
    };

    return (
        <>
            <Head title="Log Aktivitas" />
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Log Aktivitas Sistem</h2>
                        <p className="text-sm text-slate-500">Mencatat riwayat aktivitas pengguna dan perubahan data dalam sistem.</p>
                    </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Waktu</th>
                                <th className="px-4 py-3">Pengguna</th>
                                <th className="px-4 py-3">Aksi</th>
                                <th className="px-4 py-3">Tabel Target</th>
                                <th className="px-4 py-3">ID Data</th>
                                <th className="px-4 py-3">Alamat IP</th>
                                <th className="px-4 py-3 text-right">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.data.length > 0 ? (
                                logs.data.map((log) => (
                                    <React.Fragment key={log.id}>
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-700">{new Date(log.created_at).toLocaleString('id-ID')}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-900">{log.user?.name || 'Sistem / Guest'}</span>
                                                        {log.user?.email && <span className="text-xs text-slate-500">{log.user.email}</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {getActionBadge(log.action)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Database className="w-4 h-4 text-slate-400" />
                                                    <span className="font-medium text-slate-700">{log.table_name || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 font-mono">
                                                {log.record_id || '-'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-600">{log.ip_address || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => toggleRow(log.id)}
                                                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Lihat Detail"
                                                >
                                                    {expandedRow === log.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedRow === log.id && (
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <td colSpan={7} className="px-4 py-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-white p-3 rounded border border-slate-200">
                                                            <div className="text-xs font-bold text-slate-500 mb-2 uppercase">Data Sebelumnya</div>
                                                            {log.old_data ? (
                                                                <pre className="text-xs overflow-auto max-h-48 text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                                                                    {JSON.stringify(log.old_data, null, 2)}
                                                                </pre>
                                                            ) : (
                                                                <div className="text-sm text-slate-400 italic">Tidak ada data sebelumnya (Misal: Insert)</div>
                                                            )}
                                                        </div>
                                                        <div className="bg-white p-3 rounded border border-slate-200">
                                                            <div className="text-xs font-bold text-slate-500 mb-2 uppercase">Data Baru / Saat Ini</div>
                                                            {log.new_data ? (
                                                                <pre className="text-xs overflow-auto max-h-48 text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                                                                    {JSON.stringify(log.new_data, null, 2)}
                                                                </pre>
                                                            ) : (
                                                                <div className="text-sm text-slate-400 italic">Tidak ada data baru (Misal: Delete)</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                                        Belum ada log aktivitas yang tercatat.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {logs.links && logs.links.length > 3 && (
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Menampilkan <span className="font-medium">{logs.from || 0}</span> - <span className="font-medium">{logs.to || 0}</span> dari <span className="font-medium">{logs.total}</span> data
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {logs.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 text-sm rounded border ${
                                        link.active 
                                            ? 'bg-blue-600 text-white border-blue-600' 
                                            : link.url 
                                                ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50' 
                                                : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
