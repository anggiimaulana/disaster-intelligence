import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Loader2, Search, X, Image as ImageIcon, Upload } from 'lucide-react';

interface MediaItem {
    id: number;
    file_path: string;
    file_url: string;
    original_name: string;
    mime_type: string;
    file_type: string;
    folder: string;
}

interface MediaLibraryPickerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (media: { id?: number; file_path: string; file_url: string; original_name?: string }) => void;
    accept?: string;
}

export function MediaLibraryPicker({ open, onClose, onSelect, accept = 'image/*' }: MediaLibraryPickerProps) {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [folders, setFolders] = useState<string[]>([]);
    const [folder, setFolder] = useState('');
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const load = (folderFilter: string, query: string) => {
        setLoading(true);
        const params: Record<string, string> = { json: '1' };
        if (folderFilter) params.folder = folderFilter;
        if (query) params.q = query;
        router.get('/cms/media', params, {
            preserveState: true,
            preserveScroll: true,
            only: [],
        });
    };

    useEffect(() => {
        if (!open) return;
        setLoading(true);
        fetch('/cms/media?json=1', { headers: { Accept: 'application/json' } })
            .then((r) => r.json())
            .then((data) => {
                setItems(data.media?.data ?? data.media ?? []);
                setFolders(data.folders ?? []);
            })
            .finally(() => setLoading(false));
    }, [open]);

    const handleUpload = async (file: File) => {
        setUploading(true);
        const fd = new FormData();
        fd.append('files[]', file);
        fd.append('folder', folder || 'uploads');
        try {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
            const res = await fetch('/cms/media', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': csrf, Accept: 'application/json' },
                body: fd,
            });
            if (res.ok) {
                const refreshed = await fetch('/cms/media?json=1', { headers: { Accept: 'application/json' } });
                const data = await refreshed.json();
                setItems(data.media?.data ?? data.media ?? []);
            }
        } finally {
            setUploading(false);
        }
    };

    if (!open) return null;

    const filtered = items.filter((it) => {
        if (folder && it.folder !== folder) return false;
        if (q && !it.original_name.toLowerCase().includes(q.toLowerCase())) return false;
        if (accept.startsWith('image') && !it.mime_type.startsWith('image/')) return false;
        return true;
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="flex h-[80vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <h3 className="text-lg font-bold text-slate-900">Pilih dari Media Library</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Cari file..."
                            className="block w-full rounded-lg border border-slate-200 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={folder}
                        onChange={(e) => setFolder(e.target.value)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Semua folder</option>
                        {folders.map((f) => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Upload className="h-4 w-4" />
                        {uploading ? 'Mengunggah...' : 'Unggah'}
                        <input
                            type="file"
                            className="hidden"
                            accept={accept}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload(file);
                                e.currentTarget.value = '';
                            }}
                        />
                    </label>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex h-full items-center justify-center text-slate-500">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memuat...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-sm text-slate-500">
                            <div className="text-center">
                                <ImageIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                <p>Tidak ada file{folder ? ` di folder "${folder}"` : ''}.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                            {filtered.map((it) => (
                                <button
                                    key={it.id}
                                    type="button"
                                    onClick={() => onSelect(it)}
                                    className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition-all hover:border-blue-500 hover:shadow-md"
                                    title={it.original_name}
                                >
                                    {it.mime_type.startsWith('image/') ? (
                                        <img src={it.file_url} alt={it.original_name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-xs text-slate-500">
                                            {it.file_type || 'file'}
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                                        <p className="truncate">{it.original_name}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-slate-200 px-6 py-3 text-xs text-slate-500">
                    {filtered.length} file tersedia. Klik untuk memilih.
                </div>
            </div>
        </div>
    );
}
