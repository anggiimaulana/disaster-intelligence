import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    AlertTriangle,
    Plus,
    Pencil,
    Trash2,
    X,
    Check,
    ImageIcon,
    Upload,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { MediaLibraryPicker } from '@/components/ui/media-library-picker';

const allIconKeys = [
    'Flame', 'Waves', 'Wind', 'CloudLightning', 'Mountain', 'Droplets', 
    'ThermometerSun', 'CloudRain', 'Activity', 'AlertTriangle', 'Siren', 
    'Tornado', 'Snowflake', 'Virus', 'Zap', 'Skull', 'Radioactive', 
    'Biohazard', 'House', 'Ambulance', 'Car', 'Trees', 'MapPin',
    'ShieldAlert', 'LifeBuoy', 'HeartPulse', 'Bandage', 'Crosshair',
    'ThermometerSnowflake', 'Umbrella', 'CloudDrizzle', 'CloudSnow'
];

interface JenisBencana {
    id: number;
    kode: string;
    nama_bencana: string;
    icon: string | null;
    warna: string;
}

interface PageProps {
    title: string;
    disasterTypes: JenisBencana[];
}

const colorOptions = [
    { label: 'Merah', value: '#EF4444' },
    { label: 'Oranye', value: '#F97316' },
    { label: 'Kuning', value: '#EAB308' },
    { label: 'Hijau', value: '#22C55E' },
    { label: 'Biru', value: '#3B82F6' },
    { label: 'Ungu', value: '#A855F7' },
    { label: 'Pink', value: '#EC4899' },
    { label: 'Abu', value: '#64748B' },
];

export default function DisasterTypes({ title, disasterTypes }: PageProps) {
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [namaBencana, setNamaBencana] = useState('');
    const [icon, setIcon] = useState('');
    const [warna, setWarna] = useState('#EF4444');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [iconSearch, setIconSearch] = useState('');
    const [showMediaPicker, setShowMediaPicker] = useState(false);

    const isMediaIcon = (value: string) => /^https?:\/\//.test(value) || value.startsWith('/storage/') || value.startsWith('media/');

    const filteredIcons = allIconKeys
        .filter(k => k.toLowerCase().includes(iconSearch.toLowerCase()))
        .slice(0, 48); // limit for performance

    const openAdd = () => {
        setEditId(null);
        setNamaBencana('');
        setIcon('');
        setWarna('#EF4444');
        setError('');
        setIconSearch('');
        setShowForm(true);
    };

    const openEdit = (item: JenisBencana) => {
        setEditId(item.id);
        setNamaBencana(item.nama_bencana);
        setIcon(item.icon || '');
        setWarna(item.warna);
        setError('');
        setIconSearch('');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditId(null);
        setNamaBencana('');
        setIcon('');
        setWarna('#EF4444');
        setError('');
        setIconSearch('');
    };

    const handleMediaSelect = (media: { file_path: string; file_url: string }) => {
        setIcon(media.file_url);
        setShowMediaPicker(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!namaBencana.trim()) {
            setError('Nama bencana harus diisi');
            return;
        }

        setSubmitting(true);
        setError('');

        const data = {
            nama_bencana: namaBencana.trim(),
            icon,
            warna,
        };

        if (editId) {
            router.put(`/cms/disaster-types/${editId}`, data, {
                preserveScroll: true,
                onSuccess: () => closeForm(),
                onError: (errs) => setError(Object.values(errs).join(', ')),
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post('/cms/disaster-types', data, {
                preserveScroll: true,
                onSuccess: () => closeForm(),
                onError: (errs) => setError(Object.values(errs).join(', ')),
                onFinish: () => setSubmitting(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        router.delete(`/cms/disaster-types/${id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteId(null),
        });
    };

    return (
        <>
            <Head title={title} />

            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">{title}</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Total {disasterTypes.length} jenis bencana
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Tambah Jenis Bencana
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">
                                {editId ? 'Edit Jenis Bencana' : 'Tambah Jenis Bencana'}
                            </h3>
                            <button onClick={closeForm} className="rounded-lg p-1 hover:bg-slate-100 transition-colors">
                                <X className="h-5 w-5 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Nama Bencana *</label>
                                <input
                                    type="text"
                                    value={namaBencana}
                                    onChange={(e) => setNamaBencana(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Contoh: Banjir Bandang"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Icon</label>

                                {isMediaIcon(icon) && (
                                    <div className="mb-3 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                                        <img src={icon} alt="Custom icon preview" className="h-10 w-10 rounded object-contain" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-slate-700">Custom icon dari Media Library</p>
                                            <p className="truncate text-xs text-slate-500">{icon}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIcon('')}
                                            className="text-xs text-red-600 hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                )}

                                <div className="mb-3 flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Cari icon (ex: Flame, Droplets)..."
                                        value={iconSearch}
                                        onChange={(e) => setIconSearch(e.target.value)}
                                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowMediaPicker(true)}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        <Upload className="h-4 w-4" /> Upload
                                    </button>
                                </div>

                                {!isMediaIcon(icon) && (
                                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-[160px] overflow-y-auto p-1">
                                        <button
                                            type="button"
                                            onClick={() => setIcon('')}
                                            className={cn(
                                                'flex h-10 w-10 flex-col items-center justify-center rounded-lg border-2 transition-all',
                                                icon === '' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                                            )}
                                            title="Tanpa Icon (Default)"
                                        >
                                            <AlertTriangle className="h-5 w-5" />
                                        </button>
                                        {filteredIcons.filter(k => k !== 'AlertTriangle').map((iconKey) => {
                                            const IconComp = (LucideIcons as any)[iconKey];
                                            if (!IconComp || typeof IconComp !== 'object' && typeof IconComp !== 'function') return null;
                                            return (
                                                <button
                                                    key={iconKey}
                                                    type="button"
                                                    onClick={() => setIcon(iconKey)}
                                                    className={cn(
                                                        'flex h-10 w-10 flex-col items-center justify-center rounded-lg border-2 transition-all',
                                                        icon === iconKey ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                                                    )}
                                                    title={iconKey}
                                                >
                                                    <IconComp className="h-5 w-5" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="mt-2 text-xs text-slate-500">
                                    Icon terpilih: <span className="font-semibold text-slate-700">{isMediaIcon(icon) ? 'Custom (media library)' : (icon || 'Default (AlertTriangle)')}</span>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Warna</label>
                                <div className="flex flex-wrap gap-2">
                                    {colorOptions.map((c) => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            onClick={() => setWarna(c.value)}
                                            className={cn(
                                                'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all',
                                                warna === c.value ? 'border-slate-800 scale-110' : 'border-transparent'
                                            )}
                                            style={{ backgroundColor: c.value }}
                                        >
                                            {warna === c.value && <Check className="h-4 w-4 text-white drop-shadow" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-xs text-slate-400">Atau kode hex:</span>
                                    <input
                                        type="text"
                                        value={warna}
                                        onChange={(e) => setWarna(e.target.value)}
                                        className="w-24 rounded border border-slate-200 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                                        placeholder="#EF4444"
                                    />
                                    <div className="h-5 w-5 rounded border" style={{ backgroundColor: warna }} />
                                </div>
                            </div>

                            {error && (
                                <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">{error}</p>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                                >
                                    {editId ? 'Simpan' : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                {disasterTypes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                        <AlertTriangle className="mb-3 h-16 w-16 opacity-30" />
                        <p className="text-base font-medium">Belum ada jenis bencana</p>
                        <p className="mt-1 text-sm">Klik "Tambah Jenis Bencana" untuk menambah</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-100 bg-slate-50">
                                <tr>
                                    <th className="px-5 py-3 font-medium text-slate-500">Warna</th>
                                    <th className="px-5 py-3 font-medium text-slate-500">Kode</th>
                                    <th className="px-5 py-3 font-medium text-slate-500">Nama Bencana</th>
                                    <th className="px-5 py-3 font-medium text-slate-500">Icon</th>
                                    <th className="px-5 py-3 font-medium text-slate-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {disasterTypes.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3">
                                            <div
                                                className="h-6 w-6 rounded-full border border-slate-200"
                                                style={{ backgroundColor: item.warna }}
                                            />
                                        </td>
                                        <td className="px-5 py-3">
                                            <code className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                                {item.kode}
                                            </code>
                                        </td>
                                        <td className="px-5 py-3 font-medium text-slate-900">{item.nama_bencana}</td>
                                        <td className="px-5 py-3 text-slate-600">
                                            {item.icon && /^https?:\/\//.test(item.icon) || (item.icon && item.icon.startsWith('/storage/')) ? (
                                                <div className="flex items-center gap-2">
                                                    <img src={item.icon} alt={item.nama_bencana} className="h-6 w-6 object-contain" />
                                                    <ImageIcon className="h-3.5 w-3.5 text-blue-500" />
                                                </div>
                                            ) : item.icon && (LucideIcons as any)[item.icon] ? (
                                                <div className="flex items-center gap-2">
                                                    {(() => {
                                                        const IconComponent = (LucideIcons as any)[item.icon];
                                                        return <IconComponent className="h-5 w-5" />;
                                                    })()}
                                                    <span>{item.icon}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEdit(item)}
                                                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(item.id)}
                                                    className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            Apakah Anda yakin ingin menghapus jenis bencana ini? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <MediaLibraryPicker
                open={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={handleMediaSelect}
                accept="image/*"
            />
        </>
    );
}
