import { Head, router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Image, Upload, Trash2, X, Loader2, Folder, Search, Grid, List, FileText, RefreshCw } from 'lucide-react';

interface MediaItem {
    id: number;
    file_name: string;
    original_name: string;
    file_path: string;
    file_type: string;
    mime_type: string;
    file_size: number;
    folder: string;
    created_at: string;
    url: string;
    size_formatted: string;
    is_image: boolean;
}

interface PageProps {
    media: {
        data: MediaItem[];
        current_page: number; last_page: number; total: number; from: number; to: number;
    };
    folders: string[];
}

export default function MediaIndex({ media, folders }: PageProps) {
    const [uploading, setUploading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [editMedia, setEditMedia] = useState<MediaItem | null>(null);
    const [editForm, setEditForm] = useState({ original_name: '', folder: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSync = () => {
        setSyncing(true);
        router.post('/cms/media/sync', {}, {
            preserveScroll: true,
            onFinish: () => setSyncing(false),
        });
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;

        setUploading(true);
        const formData = new FormData();
        for (const file of Array.from(files)) {
            formData.append('files[]', file);
        }
        if (selectedFolder) formData.append('folder', selectedFolder);

        router.post('/cms/media', formData, {
            preserveScroll: true,
            onFinish: () => {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/cms/media/${id}`, { preserveScroll: true, onFinish: () => setDeleteId(null) });
    };

    const handleEdit = (media: MediaItem) => {
        setEditMedia(media);
        setEditForm({ original_name: media.original_name, folder: media.folder || '' });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editMedia) return;
        router.put(`/cms/media/${editMedia.id}`, editForm, {
            preserveScroll: true,
            onSuccess: () => setEditMedia(null),
        });
    };

    const filteredMedia = media.data.filter((m) => {
        if (selectedFolder && m.folder !== selectedFolder) return false;
        if (search && !m.original_name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <>
            <Head title="Media Library" />

            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Media Library</h1>
                    <p className="mt-1 text-sm text-slate-500">{media.total} file</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleSync} disabled={syncing} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-60">
                        <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
                        <span>Sync Storage</span>
                    </button>
                    <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                        {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        Upload
                    </button>
                    <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,application/pdf" onChange={handleUpload} className="hidden" />
                </div>
            </div>

            {/* Filters */}
            <div className="mb-4 flex gap-3">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari file..." className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <select value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none">
                    <option value="">Semua Folder</option>
                    {folders.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>

            {/* Media Grid */}
            {filteredMedia.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
                    <Image className="mx-auto h-16 w-16 text-slate-300" />
                    <p className="mt-3 text-sm text-slate-500">Belum ada media</p>
                    <button onClick={() => fileInputRef.current?.click()} className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700">Upload file pertama</button>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-3 gap-2 sm:gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                    {filteredMedia.map((item) => (
                        <div key={item.id} onClick={() => setSelectedMedia(item)} className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-2 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
                            <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
                                {item.is_image || item.mime_type?.startsWith('image/') ? (
                                    <img src={item.url} alt={item.original_name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-slate-400">
                                        <FileText className="h-8 w-8" />
                                    </div>
                                )}
                            </div>
                            <p className="mt-2 truncate text-xs font-medium text-slate-700">{item.original_name}</p>
                            <p className="text-[10px] text-slate-400">{item.size_formatted || '-'}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-100 bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 font-medium text-slate-500">Preview</th>
                                    <th className="px-4 py-3 font-medium text-slate-500">Nama</th>
                                    <th className="px-4 py-3 font-medium text-slate-500">Ukuran</th>
                                    <th className="px-4 py-3 font-medium text-slate-500">Folder</th>
                                    <th className="px-4 py-3 font-medium text-slate-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredMedia.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-2">
                                            {(item.is_image || item.mime_type?.startsWith('image/')) ? (
                                                <img src={item.url} alt="" className="h-10 w-10 rounded object-cover" />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100"><FileText className="h-4 w-4 text-slate-400" /></div>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 font-medium text-slate-900">{item.original_name}</td>
                                        <td className="px-4 py-2 text-slate-500">{item.size_formatted || '-'}</td>
                                        <td className="px-4 py-2 text-slate-500">{item.folder}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex gap-2">
                                                <button onClick={() => setSelectedMedia(item)} className="text-xs text-blue-600 hover:text-blue-700">Lihat</button>
                                                <button onClick={() => handleEdit(item)} className="text-xs text-amber-600 hover:text-amber-700">Edit</button>
                                                <button onClick={() => setDeleteId(item.id)} className="text-xs text-red-600 hover:text-red-700">Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {selectedMedia && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setSelectedMedia(null)}>
                    <div className="max-w-3xl w-full mx-4 rounded-xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900">{selectedMedia.original_name}</h3>
                            <button onClick={() => setSelectedMedia(null)} className="rounded p-1 hover:bg-slate-100"><X className="h-5 w-5" /></button>
                        </div>
                        {(selectedMedia.is_image || selectedMedia.mime_type?.startsWith('image/')) ? (
                            <img src={selectedMedia.url} alt="" className="max-h-96 rounded-lg object-contain mx-auto" />
                        ) : (
                            <div className="flex h-48 items-center justify-center bg-slate-100 rounded-lg"><FileText className="h-12 w-12 text-slate-400" /></div>
                        )}
                        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                            <span>{selectedMedia.size_formatted} · {selectedMedia.folder}</span>
                            <div className="flex gap-3">
                                <button onClick={() => { navigator.clipboard.writeText(selectedMedia.url); }} className="text-blue-600 hover:text-blue-700">Copy URL</button>
                                <button onClick={() => { setSelectedMedia(null); handleEdit(selectedMedia); }} className="text-amber-600 hover:text-amber-700">Edit</button>
                                <button onClick={() => { setSelectedMedia(null); setDeleteId(selectedMedia.id); }} className="text-red-600 hover:text-red-700">Hapus</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-900">Hapus File?</h3>
                        <p className="mt-2 text-sm text-slate-600">File akan dihapus permanen dari server.</p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button onClick={() => setDeleteId(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Batal</button>
                            <button onClick={() => handleDelete(deleteId)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Hapus</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editMedia && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-900">Edit File</h3>
                        <form onSubmit={handleUpdate} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama File</label>
                                <input type="text" value={editForm.original_name} onChange={e => setEditForm({ ...editForm, original_name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Folder</label>
                                <input type="text" value={editForm.folder} onChange={e => setEditForm({ ...editForm, folder: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Biarkan kosong untuk uploads" />
                            </div>
                            <div className="mt-5 flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setEditMedia(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Batal</button>
                                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
