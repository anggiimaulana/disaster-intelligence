import { Head, router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { ArrowLeft, Upload, X, Loader2, ImageIcon } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';
import IconPicker from '@/components/ui/icon-picker';
import SeoAnalyzer from '@/components/ui/seo-analyzer';
import { MediaLibraryPicker } from '@/components/ui/media-library-picker';

interface Berita {
    id: number;
    title: string;
    slug: string;
    content: string;
    thumbnail: string | null;
    icon: string | null;
    status: 'draft' | 'published';
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;
}

function isMediaIcon(value: string | null | undefined) {
    return !!value && (/^https?:\/\//.test(value) || value.startsWith('/storage/') || value.startsWith('media/'));
}

export default function BeritaForm() {
    const { berita, errors } = usePage<{ berita?: Berita; errors?: Record<string, string> }>().props;
    const isEdit = !!berita;

    const [title, setTitle] = useState(berita?.title || '');
    const [content, setContent] = useState(berita?.content || '');
    const [status, setStatus] = useState<'draft' | 'published'>(berita?.status || 'draft');
    const [seoTitle, setSeoTitle] = useState(berita?.seo_title || '');
    const [seoDescription, setSeoDescription] = useState(berita?.seo_description || '');
    const [seoKeywords, setSeoKeywords] = useState(berita?.seo_keywords || '');
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [removeThumbnail, setRemoveThumbnail] = useState(false);
    const [iconName, setIconName] = useState(berita?.icon || '');
    const [thumbnailMode, setThumbnailMode] = useState<'upload' | 'icon'>(
        berita?.icon ? 'icon' : 'upload',
    );
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setThumbnailPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeFile = () => {
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setRemoveThumbnail(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleMediaSelect = (media: { file_path: string; file_url: string }) => {
        setIconName(media.file_url);
        setShowMediaPicker(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('status', status);
        formData.append('seo_title', seoTitle);
        formData.append('seo_description', seoDescription);
        formData.append('seo_keywords', seoKeywords);
        if (thumbnailMode === 'upload') {
            if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
            if (removeThumbnail) formData.append('remove_thumbnail', '1');
            formData.append('icon', '');
        } else {
            formData.append('icon', iconName);
        }

        if (isEdit && berita) {
            formData.append('_method', 'PUT');
            router.post(`/cms/berita/${berita.slug}`, formData, { preserveScroll: true, onFinish: () => setSubmitting(false) });
        } else {
            router.post('/cms/berita', formData, { preserveScroll: true, onFinish: () => setSubmitting(false) });
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Berita' : 'Tambah Berita'} />

            <div className="mb-5">
                <a href="/cms/berita" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                    <ArrowLeft className="h-4 w-4" /> Kembali
                </a>
                <h1 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Berita' : 'Tambah Berita Baru'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 pb-20">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-base font-bold text-slate-900">Informasi Berita</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Judul Berita *</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" placeholder="Masukkan judul berita" />
                            {errors?.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Konten *</label>
                            <RichTextEditor value={content} onChange={setContent} placeholder="Tulis konten berita yang lengkap di sini..." minHeight="300px" />
                            {errors?.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
                        </div>

                        {/* Thumbnail / Icon */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Thumbnail / Ikon</label>
                            <div className="mb-3 flex flex-wrap gap-2">
                                <button type="button" onClick={() => setThumbnailMode('upload')} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${thumbnailMode === 'upload' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    Upload Gambar
                                </button>
                                <button type="button" onClick={() => setThumbnailMode('icon')} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${thumbnailMode === 'icon' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    Pilih Icon
                                </button>
                                <button type="button" onClick={() => setShowMediaPicker(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                                    <ImageIcon className="h-4 w-4" /> Media Library
                                </button>
                            </div>

                            {thumbnailMode === 'upload' ? (
                                <div onClick={() => fileInputRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-6 hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                                    {thumbnailPreview || (berita?.thumbnail && !removeThumbnail) ? (
                                        <div className="relative">
                                            <img src={thumbnailPreview || `/storage/${berita?.thumbnail}`} alt="Preview" className="max-h-48 rounded-lg object-cover" />
                                            <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(); }} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"><X className="h-3.5 w-3.5" /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="mb-2 h-8 w-8 text-slate-400" />
                                            <p className="text-sm font-medium text-slate-600">Klik untuk upload thumbnail</p>
                                            <p className="mt-1 text-xs text-slate-400">JPG, PNG, atau WebP</p>
                                        </>
                                    )}
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </div>
                            ) : isMediaIcon(iconName) ? (
                                <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                                    <img src={iconName} alt="Custom icon" className="h-12 w-12 rounded object-contain" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-slate-700">Custom icon dari Media Library</p>
                                        <p className="truncate text-xs text-slate-500">{iconName}</p>
                                    </div>
                                    <button type="button" onClick={() => setIconName('')} className="text-xs text-red-600 hover:underline">Hapus</button>
                                </div>
                            ) : (
                                <IconPicker value={iconName} onChange={setIconName} />
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
                            <div className="flex gap-3">
                                {(['draft', 'published'] as const).map((s) => (
                                    <label key={s} className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 cursor-pointer transition-colors">
                                        <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-slate-700 capitalize">{s === 'draft' ? 'Draf' : 'Terbit'}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <SeoAnalyzer
                    seoTitle={seoTitle}
                    setSeoTitle={setSeoTitle}
                    seoDescription={seoDescription}
                    setSeoDescription={setSeoDescription}
                    seoKeywords={seoKeywords}
                    setSeoKeywords={setSeoKeywords}
                    fallbackTitle={title}
                    previewSlug={berita?.slug || 'preview-slug'}
                    sectionLabel="berita"
                />

                <div className="flex items-center justify-end gap-3 pt-4">
                    <a href="/cms/berita" className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Batal</a>
                    <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 shadow-sm">
                        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isEdit ? 'Simpan Perubahan' : 'Simpan Berita'}
                    </button>
                </div>
            </form>

            <MediaLibraryPicker
                open={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={handleMediaSelect}
                accept="image/*"
            />
        </>
    );
}
