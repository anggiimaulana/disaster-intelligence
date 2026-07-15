import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    FileText,
    Plus,
    Pencil,
    Trash2,
    Eye,
    Image as ImageIcon,
    Calendar,
} from 'lucide-react';

interface Berita {
    id: number;
    title: string;
    slug: string;
    content: string;
    thumbnail: string | null;
    status: 'draft' | 'published';
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;
    published_at: string | null;
    created_at: string;
}

interface PageProps {
    berita: Berita[];
}

export default function BeritaIndex({ berita }: PageProps) {
    const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

    const handleDelete = (slug: string) => {
        router.delete(`/cms/berita/${slug}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteSlug(null),
        });
    };

    return (
        <>
            <Head title="Kelola Berita" />

            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Kelola Berita</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Total {berita.length} berita
                    </p>
                </div>
                <a
                    href="/cms/berita/create"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Tambah Berita
                </a>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                {berita.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                        <FileText className="mb-3 h-16 w-16 opacity-30" />
                        <p className="text-base font-medium">Belum ada berita</p>
                        <p className="mt-1 text-sm">Klik "Tambah Berita" untuk memulai</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-100 bg-slate-50">
                                <tr>
                                    <th className="px-5 py-3 font-medium text-slate-500">Thumbnail</th>
                                    <th className="px-5 py-3 font-medium text-slate-500">Judul</th>
                                    <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                                    <th className="px-5 py-3 font-medium text-slate-500">Tanggal</th>
                                    <th className="px-5 py-3 font-medium text-slate-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {berita.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3">
                                            {item.thumbnail ? (
                                                <img
                                                    src={`/storage/${item.thumbnail}`}
                                                    alt={item.title}
                                                    className="h-12 w-20 rounded-lg object-cover border border-slate-200"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-slate-100 border border-slate-200">
                                                    <ImageIcon className="h-5 w-5 text-slate-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <p className="font-medium text-slate-900">{item.title}</p>
                                            {item.seo_title && (
                                                <p className="mt-0.5 text-xs text-slate-500">{item.seo_title}</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={cn(
                                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                    item.status === 'published'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                )}
                                            >
                                                {item.status === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                {item.published_at
                                                    ? new Date(item.published_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })
                                                    : '-'}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`/cms/berita/${item.slug}/edit`}
                                                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" /> Edit
                                                </a>
                                                <button
                                                    onClick={() => setDeleteSlug(item.slug)}
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

            {deleteSlug && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteSlug(null)}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteSlug)}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
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
