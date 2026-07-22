import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Globe, Check, X, Loader2, ChevronDown, MapPin, Home } from 'lucide-react';

interface SupportedRegency {
    id: number;
    code: string;
    name: string;
    province_code: string;
    is_active: boolean;
}

interface DesaItem {
    desa: string;
    latitude: string | null;
    longitude: string | null;
}

interface WilayahKecamatan {
    kecamatan: string;
    desa: DesaItem[];
}

interface WilayahKabupaten {
    kabupaten: string;
    kecamatan: WilayahKecamatan[];
}

interface PageProps {
    title: string;
    supportedRegencies: SupportedRegency[];
    wilayahData: WilayahKabupaten[];
    usesApi: boolean;
    apiUrl: string | null;
}

export default function Regencies({ title, supportedRegencies, wilayahData, usesApi, apiUrl }: PageProps) {
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [expandedKab, setExpandedKab] = useState<Record<string, boolean>>({});
    const [expandedKec, setExpandedKec] = useState<Record<string, boolean>>({});

    const regencyMap: Record<string, SupportedRegency> = {};
    supportedRegencies.forEach((r) => {
        const cleanName = r.name.replace(/^(KABUPATEN|KOTA)\s+/i, '').trim();
        regencyMap[cleanName] = r;
    });

    const filtered = supportedRegencies.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.code.includes(search)
    );

    const activeCount = supportedRegencies.filter((r) => r.is_active).length;
    const totalKec = wilayahData.reduce((sum, k) => sum + k.kecamatan.length, 0);
    const totalDesa = wilayahData.reduce((sum, k) => sum + k.kecamatan.reduce((s, kec) => s + kec.desa.length, 0), 0);

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

    const getCleanName = (name: string) =>
        name.replace(/^(KABUPATEN|KOTA)\s+/i, '').trim();

    const getWilayah = (regencyName: string) =>
        wilayahData.find((w) => w.kabupaten.toLowerCase() === getCleanName(regencyName).toLowerCase());

    return (
        <>
            <Head title={title} />

            <div className="mb-5">
                <h1 className="text-xl font-bold text-slate-900">{title}</h1>
                <p className="mt-1 text-sm text-slate-500">
                    {activeCount} aktif dari {supportedRegencies.length} total kabupaten/kota
                    {!usesApi && <>&middot; {totalKec} kecamatan &middot; {totalDesa} desa</>}
                    {usesApi && <span className="ml-2 inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Via API: {apiUrl}</span>}
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
                                <th className="w-10 px-4 py-3" />
                                <th className="w-12 px-4 py-3 font-medium text-slate-500">#</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Kode</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Nama Kabupaten/Kota</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Kecamatan</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Desa</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Status</th>
                                <th className="px-4 py-3 text-right font-medium text-slate-500">Toggle</th>
                            </tr>
                        </thead>
                        {filtered.length === 0 ? (
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                                        Tidak ditemukan wilayah yang cocok
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            filtered.map((item, idx) => {
                                const cleanName = getCleanName(item.name);
                                const wilayah = getWilayah(item.name);
                                const isExpanded = expandedKab[item.code] ?? false;
                                const kecCount = wilayah?.kecamatan.length ?? 0;
                                const desaCount = wilayah?.kecamatan.reduce((s, kec) => s + kec.desa.length, 0) ?? 0;

                                return (
                                    <tbody key={item.id} className="divide-y divide-slate-100">
                                        <tr
                                            className={cn(
                                                'transition-colors',
                                                item.is_active ? 'bg-white hover:bg-blue-50/30' : 'bg-slate-50/50 hover:bg-slate-50',
                                            )}
                                        >
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => {
                                                        if (kecCount === 0) return;
                                                        setExpandedKab((prev) => ({
                                                            ...prev,
                                                            [item.code]: !prev[item.code],
                                                        }));
                                                    }}
                                                    className={cn(
                                                        'rounded p-1 transition-colors',
                                                        kecCount > 0 ? 'hover:bg-slate-100 text-slate-400' : 'text-slate-200 cursor-default',
                                                    )}
                                                >
                                                    <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{idx + 1}</td>
                                            <td className="px-4 py-3">
                                                <code className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                                    {item.code}
                                                </code>
                                            </td>
                                            <td className={cn('px-4 py-3 font-medium', item.is_active ? 'text-slate-900' : 'text-slate-500')}>
                                                {item.name}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-500">
                                                {kecCount > 0 ? `${kecCount} kecamatan` : (usesApi && item.is_active ? 'Dari API' : '-')}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-500">
                                                {desaCount > 0 ? `${desaCount} desa` : (usesApi && item.is_active ? 'Dari API' : '-')}
                                            </td>
                                            <td className="px-4 py-3">
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
                                            <td className="px-4 py-3 text-right">
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

                                        {/* Expanded kecamatan & desa rows */}
                                        {isExpanded && wilayah && wilayah.kecamatan.map((kec) => {
                                            const kecKey = `${item.code}-${kec.kecamatan}`;
                                            const isKecExpanded = expandedKec[kecKey] ?? false;

                                            return (
                                                <tr key={kecKey} className="bg-blue-50/30 border-t border-blue-100">
                                                    <td colSpan={8} className="px-0 py-0">
                                                        <div>
                                                            <div
                                                                onClick={() => {
                                                                    if (kec.desa.length === 0) return;
                                                                    setExpandedKec((prev) => ({
                                                                        ...prev,
                                                                        [kecKey]: !prev[kecKey],
                                                                    }));
                                                                }}
                                                                className={cn(
                                                                    'flex items-center gap-3 px-4 py-2 border-b border-blue-100/50',
                                                                    kec.desa.length > 0 ? 'cursor-pointer hover:bg-blue-100/50' : '',
                                                                )}
                                                            >
                                                                <div className="w-10 shrink-0 flex justify-center">
                                                                    <ChevronDown className={cn(
                                                                        'h-3.5 w-3.5 text-blue-400 transition-transform',
                                                                        isKecExpanded && 'rotate-180',
                                                                        kec.desa.length === 0 && 'opacity-30',
                                                                    )} />
                                                                </div>
                                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                                    <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                                                                    <span className="text-sm font-medium text-blue-800">{kec.kecamatan}</span>
                                                                    <span className="text-xs text-blue-400">({kec.desa.length} desa)</span>
                                                                </div>
                                                            </div>

                                                            {isKecExpanded && kec.desa.map((d, dIdx) => (
                                                                <div
                                                                    key={dIdx}
                                                                    className="flex items-center gap-3 px-4 py-1.5 border-b border-blue-50 last:border-b-0"
                                                                >
                                                                    <div className="w-10 shrink-0 flex justify-center">
                                                                        <Home className="h-3 w-3 text-slate-400" />
                                                                    </div>
                                                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                                                        <span className="text-xs text-slate-600">{d.desa}</span>
                                                                        {(d.latitude || d.longitude) && (
                                                                            <span className="text-[10px] text-slate-400 font-mono">
                                                                                ({d.latitude ?? '-'}, {d.longitude ?? '-'})
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                );
                            })
                        )}
                    </table>
                </div>
            </div>

            {/* Summary */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium text-slate-500">Kabupaten/Kota Aktif</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{activeCount}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium text-slate-500">Total Kecamatan</p>
                    <p className="mt-1 text-2xl font-bold text-blue-700">{totalKec}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium text-slate-500">Total Desa</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-700">{totalDesa}</p>
                </div>
            </div>
        </>
    );
}
