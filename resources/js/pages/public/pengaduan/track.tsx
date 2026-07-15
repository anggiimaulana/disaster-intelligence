import { useState, useEffect, useCallback } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import {
    Search,
    MapPin,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Loader2,
    Calendar,
    FileText,
    Image as ImageIcon,
    Share2,
    Copy,
    Check,
    RefreshCw,
    User,
} from 'lucide-react';

interface Laporan {
    id: number;
    kode_laporan: string;
    jenis_bencana: {
        id: number;
        kode: string;
        nama: string;
        warna: string;
    };
    status: {
        id: number;
        nama: string;
        warna: string;
    };
    judul: string;
    deskripsi: string;
    pelapor?: {
        nama?: string;
        no_hp?: string;
        email?: string;
    } | null;
    alamat: string;
    kecamatan: string;
    desa: string;
    latitude: number;
    longitude: number;
    tingkat_keparahan: string;
    validasi_ai: boolean;
    validasi_admin: boolean;
    waktu_kejadian: string;
    created_at: string;
    updated_at: string;
    media: Array<{
        id: number;
        media_type: string;
        file_url: string;
        ai_result: string;
    }>;
    validasi: {
        id: number;
        hasil_validasi: string;
        catatan: string;
        admin: { id: number; nama: string };
        created_at: string;
    } | null;
    timeline: Array<{
        step: string;
        label: string;
        waktu: string;
        status: string;
        catatan?: string;
        icon?: string;
    }>;
    tracking_url?: string;
}

interface PageProps {
    [key: string]: unknown;
    laporan?: Laporan;
    notFound?: boolean;
    kode?: string;
}

const SEVERITY_COLORS: Record<string, string> = {
    Rendah: 'bg-green-100 text-green-700',
    Sedang: 'bg-yellow-100 text-yellow-700',
    Tinggi: 'bg-orange-100 text-orange-700',
    Darurat: 'bg-red-100 text-red-700',
};

const TIMELINE_ICONS: Record<string, React.ReactNode> = {
    completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    rejected: <XCircle className="w-4 h-4 text-red-500" />,
    current: <Clock className="w-4 h-4 text-blue-500 animate-pulse" />,
    default: <div className="w-2 h-2 rounded-full bg-gray-300" />,
};

const unwrapLaporan = (lap: any): Laporan | undefined => {
    if (!lap) return undefined;
    return lap.data ? lap.data : lap;
};

function extractPelaporAndCleanDeskripsi(
    rawDeskripsi?: string,
    pelaporProp?: { nama?: string; no_hp?: string; email?: string } | null
) {
    let deskripsi = rawDeskripsi || '';
    let pelapor = pelaporProp || null;

    const regex = /\[Pelapor:\s*(\{.*?\})\s*\]/s;
    const match = deskripsi.match(regex);
    if (match && match[1]) {
        try {
            if (!pelapor) {
                pelapor = JSON.parse(match[1]);
            }
            deskripsi = deskripsi.replace(regex, '').trim();
        } catch (e) {
            // fallback
        }
    }

    return { deskripsi, pelapor };
}

export default function TrackReport() {
    const { laporan: initialLaporan, notFound, kode } = usePage<PageProps>().props;
    const [searchCode, setSearchCode] = useState(kode || '');
    const [isSearching, setIsSearching] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    // Local state for polling updates
    const [laporan, setLaporan] = useState<Laporan | undefined>(() => unwrapLaporan(initialLaporan));
    
    // Sync props to state when Inertia partial reload happens
    useEffect(() => {
        if (initialLaporan !== undefined) {
            setLaporan(unwrapLaporan(initialLaporan));
        }
    }, [initialLaporan]);

    useEffect(() => {
        if (kode !== undefined) {
            setSearchCode(kode);
        }
    }, [kode]);

    // Polling for status updates - check every 30 seconds
    useEffect(() => {
        if (!kode || notFound) return;

        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`/api/reports/track?kode_laporan=${encodeURIComponent(kode)}`, {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        setLaporan(result.data);
                        setLastUpdate(new Date());
                    }
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 30000); // 30 seconds

        return () => clearInterval(pollInterval);
    }, [kode, notFound]);

    const handleRefresh = useCallback(async () => {
        if (!kode || isRefreshing) return;

        setIsRefreshing(true);
        try {
            const response = await fetch(`/api/reports/track?kode_laporan=${encodeURIComponent(kode)}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    setLaporan(result.data);
                    setLastUpdate(new Date());
                }
            }
        } catch (error) {
            console.error('Refresh error:', error);
        } finally {
            setIsRefreshing(false);
        }
    }, [kode, isRefreshing]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchCode.trim()) return;

        setIsSearching(true);
        router.get('/public/lacak-laporan', 
            { kode_laporan: searchCode.trim().toUpperCase() },
            { 
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: ['laporan', 'notFound', 'kode', 'error'],
                onSuccess: () => {
                    setIsSearching(false);
                    // Polling for updates is handled by the useEffect
                },
                onError: () => {
                    setIsSearching(false);
                }
            }
        );
    };

    const copyToClipboard = async () => {
        if (laporan?.kode_laporan) {
            await navigator.clipboard.writeText(laporan.kode_laporan);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareReport = async () => {
        if (laporan?.tracking_url && navigator.share) {
            try {
                await navigator.share({
                    title: `Laporan ${laporan.kode_laporan}`,
                    text: `Lacak status laporan: ${laporan.judul}`,
                    url: laporan.tracking_url,
                });
            } catch (err) {
                // User cancelled or error
            }
        }
    };

    const shareViaWhatsApp = () => {
        if (laporan?.kode_laporan) {
            const text = encodeURIComponent(
                `📋 Lacak Laporan Bencana Indramayu\n\n` +
                `Kode: ${laporan.kode_laporan}\n` +
                `Status: ${laporan.status?.nama || '-'}\n` +
                `Judul: ${laporan.judul}\n\n` +
                `Lacak di: ${window.location.origin}/public/lacak-laporan?kode_laporan=${encodeURIComponent(laporan.kode_laporan)}`
            );
            window.open(`https://wa.me/?text=${text}`, '_blank');
        }
    };

    const shareViaTelegram = () => {
        if (laporan?.kode_laporan) {
            const text = encodeURIComponent(
                `📋 Lacak Laporan Bencana Indramayu\n\n` +
                `Kode: ${laporan.kode_laporan}\n` +
                `Status: ${laporan.status?.nama || '-'}\n` +
                `Judul: ${laporan.judul}\n\n` +
                `Lacak di: ${window.location.origin}/public/lacak-laporan?kode_laporan=${encodeURIComponent(laporan.kode_laporan)}`
            );
            window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + '/public/lacak-laporan?kode_laporan=' + laporan.kode_laporan)}&text=${text}`, '_blank');
        }
    };

    // Show not found state
    if (notFound) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
                <div className="max-w-lg mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lacak Laporan</h1>
                        <p className="text-gray-600">
                            Masukkan kode laporan Anda untuk melihat status
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-red-700 font-medium">Laporan tidak ditemukan</p>
                                <p className="text-red-600 text-sm mt-1">
                                    Kode laporan "{kode}" tidak ditemukan. Pastikan kode yang Anda masukkan benar.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                                placeholder="Contoh: LAP-20260712-ADHZ0001-01"
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSearching || !searchCode.trim()}
                            className="w-full mt-4 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSearching ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Mencari...
                                </>
                            ) : (
                                'Cari Laporan'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/public/lapor-bencana" className="text-blue-600 hover:underline text-sm">
                            &larr; Kembali ke Form Pelaporan
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Show initial search state
    if (!laporan) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
                <div className="max-w-lg mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lacak Laporan</h1>
                        <p className="text-gray-600">
                            Masukkan kode laporan Anda untuk melihat status
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                                placeholder="Contoh: LAP-20260712-ADHZ0001-01"
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSearching || !searchCode.trim()}
                            className="w-full mt-4 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSearching ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Mencari...
                                </>
                            ) : (
                                'Cari Laporan'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/public/lapor-bencana" className="text-blue-600 hover:underline text-sm">
                            &larr; Buat Laporan Baru
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Show report detail
    return (
        <>
        <Head title="Lacak Laporan - Disaster Intelligence" />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Status Laporan</h1>
                    <p className="text-gray-600">Pantau status laporan bencana Anda</p>
                    {lastUpdate && (
                        <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
                            <RefreshCw className="w-3 h-3" />
                            <span>Update terakhir: {lastUpdate.toLocaleTimeString('id-ID')}</span>
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="ml-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 inline ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Report Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Status Header */}
                    <div
                        className="px-4 sm:px-6 py-4 sm:py-5 text-white"
                        style={{ backgroundColor: laporan.status?.warna || '#3B82F6' }}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            <div>
                                <p className="text-xs sm:text-sm opacity-80">Status</p>
                                <p className="text-xl sm:text-2xl font-bold">{laporan.status?.nama || '-'}</p>
                            </div>
                            <div className="sm:text-right">
                                <p className="text-xs sm:text-sm opacity-80">Kode Laporan</p>
                                <div className="flex items-center sm:justify-end gap-2 flex-wrap">
                                    <p className="text-base sm:text-2xl font-bold font-mono break-all">{laporan.kode_laporan}</p>
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-1 hover:bg-white/20 rounded transition-colors shrink-0"
                                        title="Salin kode"
                                    >
                                        {copied ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            <Copy className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Report Content */}
                    <div className="p-6 space-y-6">
                        {/* Title & Badges */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">{laporan.judul}</h2>
                            <div className="flex flex-wrap gap-2">
                                <span
                                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                                    style={{ backgroundColor: laporan.jenis_bencana?.warna || '#64748B' }}
                                >
                                    {laporan.jenis_bencana?.nama || '-'}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${SEVERITY_COLORS[laporan.tingkat_keparahan] || 'bg-gray-100 text-gray-700'}`}>
                                    {laporan.tingkat_keparahan}
                                </span>
                            </div>
                        </div>

                        {/* Description & Reporter */}
                        {(() => {
                            const { deskripsi: cleanDeskripsi, pelapor: infoPelapor } =
                                extractPelaporAndCleanDeskripsi(laporan.deskripsi, laporan.pelapor);
                            return (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Deskripsi Kejadian
                                        </h3>
                                        <p className="text-gray-600 whitespace-pre-wrap">{cleanDeskripsi}</p>
                                    </div>

                                    {infoPelapor && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 overflow-hidden">
                                            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-600 shrink-0" />
                                                Informasi Pelapor
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                                {infoPelapor.nama && (
                                                    <div className="min-w-0">
                                                        <p className="text-gray-500 text-xs mb-0.5">Nama Pelapor</p>
                                                        <p className="font-medium text-gray-800 break-words [overflow-wrap:anywhere] leading-snug">{infoPelapor.nama}</p>
                                                    </div>
                                                )}
                                                {infoPelapor.no_hp && (
                                                    <div className="min-w-0">
                                                        <p className="text-gray-500 text-xs mb-0.5">Nomor Telepon / WhatsApp</p>
                                                        <p className="font-medium text-gray-800 break-words [overflow-wrap:anywhere] leading-snug">{infoPelapor.no_hp}</p>
                                                    </div>
                                                )}
                                                {infoPelapor.email && (
                                                    <div className="min-w-0">
                                                        <p className="text-gray-500 text-xs mb-0.5">Email</p>
                                                        <p className="font-medium text-gray-800 break-words [overflow-wrap:anywhere] leading-snug">{infoPelapor.email}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Location */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Lokasi
                            </h3>
                            <p className="text-gray-700">{laporan.alamat}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                {laporan.desa ? `${laporan.desa}, ` : ''}{laporan.kecamatan}
                            </p>
                            <a
                                href={`https://www.google.com/maps?q=${laporan.latitude},${laporan.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm mt-2"
                            >
                                Lihat di Peta &rarr;
                            </a>
                        </div>

                        {/* Timeline */}
                        {laporan.timeline && laporan.timeline.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Riwayat Status
                                </h3>
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                                    <div className="space-y-4">
                                        {laporan.timeline.map((item, index) => (
                                            <div key={index} className="relative flex items-start gap-4 pl-10">
                                                <div className="absolute left-2 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center -translate-x-1/2">
                                                    {TIMELINE_ICONS[item.status] || TIMELINE_ICONS.default}
                                                </div>
                                                <div className={`flex-1 rounded-lg p-3 ${
                                                    item.status === 'current' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                                                }`}>
                                                    <div className="flex items-center justify-between">
                                                        <p className={`font-medium ${item.status === 'current' ? 'text-blue-700' : 'text-gray-900'}`}>
                                                            {item.label}
                                                        </p>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(item.waktu).toLocaleString('id-ID', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </span>
                                                    </div>
                                                    {item.catatan && (
                                                        <p className="text-sm text-gray-600 mt-1">{item.catatan}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Media */}
                        {laporan.media && laporan.media.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    Bukti Foto/Video
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {laporan.media.map((media) => (
                                        <a
                                            key={media.id}
                                            href={media.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity"
                                        >
                                            <img
                                                src={media.file_url}
                                                alt="Bukti"
                                                className="w-full h-full object-cover"
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(laporan.created_at).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Share Buttons */}
                                <button
                                    onClick={shareViaWhatsApp}
                                    className="flex items-center gap-1 text-green-600 hover:text-green-700"
                                    title="Bagikan via WhatsApp"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    <span className="hidden sm:inline">WhatsApp</span>
                                </button>
                                <button
                                    onClick={shareViaTelegram}
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                                    title="Bagikan via Telegram"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                    </svg>
                                    <span className="hidden sm:inline">Telegram</span>
                                </button>
                                {laporan.tracking_url && (
                                    <button
                                        onClick={shareReport}
                                        className="flex items-center gap-1 text-blue-600 hover:underline"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        <span className="hidden sm:inline">Bagikan</span>
                                    </button>
                                )}
                                <a href="/public/lapor-bencana" className="text-blue-600 hover:underline">
                                    &larr; Buat Laporan Baru
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
