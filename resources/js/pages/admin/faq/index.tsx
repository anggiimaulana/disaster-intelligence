import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FileText, Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Item {
    id: number;
    question: string;
    answer: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

export default function FaqIndex({ items }: { items: Item[] }) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        router.delete(`/cms/faq/${id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteId(null),
        });
    };

    return (
        <>
            <Head title="Kelola FAQ" />

            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Kelola FAQ</h1>
                    <p className="mt-1 text-sm text-slate-500">Total {items.length} pertanyaan</p>
                </div>
                <a href="/cms/faq/create" className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4" /> Tambah FAQ
                </a>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                        <FileText className="mb-3 h-16 w-16 opacity-30" />
                        <p className="text-base font-medium">Belum ada FAQ</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-slate-400">#{item.sort_order}</span>
                                        <p className="font-medium text-slate-900">{item.question}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-500 line-clamp-1">{item.answer}</p>
                                </div>
                                <div className="ml-4 flex items-center gap-2">
                                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', item.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500')}>
                                        {item.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                    <a href={`/cms/faq/${item.id}/edit`} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                        <Pencil className="h-3.5 w-3.5" /> Edit
                                    </a>
                                    <button onClick={() => setDeleteId(item.id)} className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus</h3>
                        <p className="mt-2 text-sm text-slate-600">Apakah Anda yakin ingin menghapus FAQ ini?</p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button onClick={() => setDeleteId(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Batal</button>
                            <button onClick={() => handleDelete(deleteId)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
