import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Globe, Check, X, Loader2 } from 'lucide-react';

interface SupportedRegency {
    id: number;
    code: string;
    name: string;
    province_code: string;
    is_active: boolean;
}

interface PageProps {
    title: string;
    supportedRegencies: SupportedRegency[];
}

export default function Regencies({ title, supportedRegencies }: PageProps) {
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    const filtered = supportedRegencies.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.code.includes(search)
    );

    const activeCount = supportedRegencies.filter((r) => r.is_active).length;

    const handleToggle = (id: number) => {
        setTogglingId(id);
        router.patch(`/cms/regencies/${id}/toggle`, {}, {
            preserveScroll: true,
            onFinish: () => setTogglingId(null),
        });
    };

    const handleToggleAll = (activate: boolean) => {
        const toToggle = filtered.filter((r) => r.is_active !== activate);
        toToggle.forEach((r) => {
            if (r.is_active !== activate) {
                router.patch(`/cms/regencies/${r.id}/toggle`, {}, {
                    preserveScroll: true,
                });
            }
        });
    };

    return (
        <>
            <Head title={title} />

            <div className="mb-5">
                <h1 className="text-xl font-bold text-slate-900">{title}</h1>
                <p className="mt-1 text-sm text-slate-500">
                    {activeCount} aktif dari {supportedRegencies.length} total kabupaten/kota
                </p>
            </div>

            {/* Controls */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 sm:max-w-xs">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama atau kode..."
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                    <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleToggleAll(true)}
                        className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
                    >
                        <Check className="h-3.5 w-3.5" /> Aktifkan Semua
                    </button>
                    <button
                        onClick={() => handleToggleAll(false)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X className="h-3.5 w-3.5" /> Nonaktifkan Semua
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50">
                            <tr>
                                <th className="w-12 px-5 py-3 font-medium text-slate-500">#</th>
                                <th className="px-5 py-3 font-medium text-slate-500">Kode</th>
                                <th className="px-5 py-3 font-medium text-slate-500">Nama Kabupaten/Kota</th>
                                <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                                <th className="px-5 py-3 text-right font-medium text-slate-500">Toggle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                                        Tidak ditemukan wilayah yang cocok
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item, idx) => (
                                    <tr
                                        key={item.id}
                                        className={cn(
                                            'transition-colors',
                                            item.is_active ? 'bg-white hover:bg-green-50/30' : 'bg-slate-50/50 hover:bg-slate-50',
                                        )}
                                    >
                                        <td className="px-5 py-3 text-xs text-slate-400">{idx + 1}</td>
                                        <td className="px-5 py-3">
                                            <code className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                                {item.code}
                                            </code>
                                        </td>
                                        <td className={cn('px-5 py-3 font-medium', item.is_active ? 'text-slate-900' : 'text-slate-500')}>
                                            {item.name}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={cn(
                                                    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                                                    item.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-slate-100 text-slate-400',
                                                )}
                                            >
                                                {item.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <button
                                                onClick={() => handleToggle(item.id)}
                                                disabled={togglingId === item.id}
                                                className={cn(
                                                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                                                    item.is_active ? 'bg-green-500' : 'bg-slate-300',
                                                    'disabled:opacity-50',
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                                                        item.is_active ? 'translate-x-6' : 'translate-x-1',
                                                    )}
                                                />
                                                {togglingId === item.id && (
                                                    <Loader2 className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
