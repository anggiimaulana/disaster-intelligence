import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import RichTextEditor from '@/components/ui/rich-text-editor';
import {
    AlertCircle,
    AlertTriangle,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    CloudLightning,
    Copy,
    Flame,
    Image as ImageIcon,
    Loader2,
    Map,
    MapPin,
    Mountain,
    Mail,
    Phone,
    Search,
    Share2,
    Target,
    Umbrella,
    Upload,
    Waves,
    X,
    Activity,
    CloudRain,
    ThermometerSun,
    Tornado,
    Skull,
    MountainSnow,
    Droplets,
    Wind,
} from 'lucide-react';
import { Icon } from "@/components/ui/icon";

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { config } from '@/config';

// Slide-in animation for toast notification
const toastStyles = `
@keyframes slideIn {
    from { transform: translateX(120%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
.animate-slide-in { animation: slideIn 0.3s ease-out; }
`;
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = toastStyles;
    document.head.appendChild(style);
}

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface JenisBencana {
    id: number;
    kode: string;
    nama_bencana: string;
    icon: string;
    warna: string;
}

interface KabupatenItem {
    code: string;
    name: string;
}

interface Props {
    jenisBencana: JenisBencana[];
    kabupatenList: KabupatenItem[];
}

const iconMap: Record<string, React.ElementType> = {
    Flame, Droplets, Wind, MountainSnow, Activity, Waves, CloudRain, CloudLightning, ThermometerSun, Tornado, Skull, AlertTriangle
};

// Default center: Indonesia
const DEFAULT_CENTER: [number, number] = [-2.5, 118.0];
const DEFAULT_ZOOM = 5;

// Custom marker component for click handling
const MapClickHandler = () => {
    const map = useMapEvents({
        click(e: L.LeafletMouseEvent) {
            // Dispatch custom event with coordinates
            window.dispatchEvent(new CustomEvent('map-click', {
                detail: { lat: e.latlng.lat, lng: e.latlng.lng }
            }));
        }
    });
    return null;
};

// Marker component for selected location
const LocationMarker = ({ position }: { position: [number, number] | null }) => {
    if (!position) return null;
    return <Marker position={position} />;
};

// FlyTo component - animates map to new center when coordinates change
const FlyToCenter = ({ center, zoom }: { center: [number, number] | null; zoom: number }) => {
    const map = useMap();
    
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, { animate: true, duration: 1.5 });
        }
    }, [center, zoom, map]);
    
    return null;
};

export default function PengaduanIndex({ jenisBencana, kabupatenList }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [kodeLaporan, setKodeLaporan] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mapError, setMapError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; message: string } | null>(null);
    const [kecamatanOptions, setKecamatanOptions] = useState<{code: string; name: string}[]>([]);
    const [desaOptions, setDesaOptions] = useState<{code: string; name: string}[]>([]);
    const [isLoadingKecamatan, setIsLoadingKecamatan] = useState(false);
    const [isLoadingDesa, setIsLoadingDesa] = useState(false);

    // Auto-dismiss notification after 5 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Toast state
    const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
        setNotification({ type, message });
    };

    const { data, setData, post, processing, errors } = useForm({
        nama_pelapor: '',
        no_hp: '',
        email: '',
        jenis_bencana_id: '',
        judul: '',
        deskripsi: '',
        alamat: '',
        kabupaten: '',
        kecamatan: '',
        desa: '',
        provinsi: '',
        latitude: '',
        longitude: '',
        waktu_kejadian_date: new Date().toISOString().split('T')[0],
        waktu_kejadian_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        // Honeypot fields - hidden from users, filled by bots
        website_url: '',
        contact_subject: '',
    });

    // Auto-copy to clipboard when success
    useEffect(() => {
        if (submitSuccess && kodeLaporan) {
            navigator.clipboard.writeText(kodeLaporan).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
            }).catch(() => {
                // Clipboard API not available, user can manually copy
            });
        }
    }, [submitSuccess, kodeLaporan]);

    // Handle map click events
    useEffect(() => {
        const handleMapClick = (event: CustomEvent<{ lat: number; lng: number }>) => {
            const { lat, lng } = event.detail;
            setData('latitude', lat.toFixed(6));
            setData('longitude', lng.toFixed(6));
            // Force map re-render to show marker
            setMapKey(prev => prev + 1);
        };

        window.addEventListener('map-click', handleMapClick as EventListener);
        return () => window.removeEventListener('map-click', handleMapClick as EventListener);
    }, [setData]);

    // Fetch kecamatan when kabupaten changes (uses BPS code for accuracy)
    useEffect(() => {
        if (!data.kabupaten) {
            setKecamatanOptions([]);
            setDesaOptions([]);
            setData('kecamatan', '');
            setData('desa', '');
            return;
        }

        const selected = kabupatenList.find(k => k.code === data.kabupaten || k.name === data.kabupaten);
        if (!selected) return;

        setIsLoadingKecamatan(true);
        setData('kecamatan', '');
        setData('desa', '');
        setDesaOptions([]);

        // Use code for API call — backend supports both code and name
        fetch(`/api/kecamatan/${encodeURIComponent(selected.code)}`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setKecamatanOptions(result.data);
                }
            })
            .catch(() => {
                setKecamatanOptions([]);
            })
            .finally(() => setIsLoadingKecamatan(false));
    }, [data.kabupaten]);

    // Fetch desa when kecamatan changes (uses BPS code for accuracy)
    useEffect(() => {
        if (!data.kecamatan || !data.kabupaten) {
            setDesaOptions([]);
            return;
        }

        const selected = kabupatenList.find(k => k.code === data.kabupaten || k.name === data.kabupaten);
        if (!selected) return;

        // kecamatan option now has { code, name } — use code
        const kecCode = typeof data.kecamatan === 'string' && data.kecamatan.length > 0
            ? (kecamatanOptions.find((k: any) => k.name === data.kecamatan)?.code || data.kecamatan)
            : data.kecamatan;

        setIsLoadingDesa(true);
        setDesaOptions([]);

        fetch(`/api/desa-by-kecamatan/${encodeURIComponent(kecCode)}?kabupaten=${encodeURIComponent(selected.code)}`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setDesaOptions(result.data);
                }
            })
            .catch(() => {
                setDesaOptions([]);
            })
            .finally(() => setIsLoadingDesa(false));
    }, [data.kecamatan, data.kabupaten]);

    // Get coordinates from database when kecamatan/desa selected
    useEffect(() => {
        if (data.kecamatan && !data.alamat) {
            const debounceTimer = setTimeout(() => {
                fetchCoordinatesFromWilayah(data.kecamatan, data.desa || undefined);
            }, 400);
            return () => clearTimeout(debounceTimer);
        }
    }, [data.kecamatan, data.desa, data.alamat]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const validFiles = selectedFiles.filter((file) => {
            const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'].includes(file.type);
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
            return isValidType && isValidSize;
        });
        setFiles((prev) => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const copyToClipboard = () => {
        if (kodeLaporan) {
            navigator.clipboard.writeText(kodeLaporan);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    const shareViaWhatsApp = () => {
        if (kodeLaporan) {
            const text = encodeURIComponent(
                `Saya telah melaporkan bencana.\n\n` +
                `📋 Kode Laporan: ${kodeLaporan}\n\n` +
                `Lacak status: ${window.location.origin}/public/lacak-laporan?kode_laporan=${encodeURIComponent(kodeLaporan)}`
            );
            window.open(`https://wa.me/?text=${text}`, '_blank');
        }
    };

    const shareViaTelegram = () => {
        if (kodeLaporan) {
            const text = encodeURIComponent(
                `Saya telah melaporkan bencana.\n\n` +
                `📋 Kode Laporan: ${kodeLaporan}\n\n` +
                `Lacak status: ${window.location.origin}/public/lacak-laporan?kode_laporan=${encodeURIComponent(kodeLaporan)}`
            );
            window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + '/public/lacak-laporan?kode_laporan=' + kodeLaporan)}&text=${text}`, '_blank');
        }
    };

    const geocodeAddress = async (address: string) => {
        if (isGeocoding) return;
        setIsGeocoding(true);
        try {
                const response = await fetch(`/api/search-location?q=${encodeURIComponent(address)}`, {
                    headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                });
                const result = await response.json();
                if (result.success && result.data) {
                    const lat = result.data.latitude;
                    const lng = result.data.longitude;

                    setData('latitude', lat.toFixed(6));
                    setData('longitude', lng.toFixed(6));
                    setMapKey(prev => prev + 1);
                    setNotification({ type: 'success', message: 'Lokasi berhasil ditemukan!' });
                }
            } catch (error) {
                console.warn('Geocoding error:', error);
            } finally {
                setIsGeocoding(false);
            }
        };

    const fetchCoordinatesFromWilayah = async (kecamatan: string, desa?: string) => {
        try {
            // Resolve kecamatan code from options
            const kecCode = kecamatanOptions.find((k: any) => k.name === kecamatan)?.code || kecamatan;
            const params = new URLSearchParams({ kecamatan: kecCode });
            if (desa) {
                const desaCode = desaOptions.find((d: any) => d.name === desa)?.code || desa;
                params.append('desa', desaCode);
            }
            const selectedKab = kabupatenList.find(k => k.code === data.kabupaten);
            if (selectedKab) params.append('kabupaten', selectedKab.code);
            const response = await fetch(`/api/coordinates-by-location?${params}`, {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            const result = await response.json();
            if (result.success && result.data) {
                const lat = result.data.latitude;
                const lng = result.data.longitude;

                setData('latitude', lat.toFixed(6));
                setData('longitude', lng.toFixed(6));
                setMapKey(prev => prev + 1);
            } else {
                setNotification({ type: 'warning', message: 'Koordinat tidak tersedia untuk wilayah ini. Klik peta untuk menandai lokasi.' });
            }
        } catch (error) {
            console.warn('Fetch coordinates error:', error);
        }
    };

    const handleMapSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        e.preventDefault(); // Prevent form submission
        const input = e.currentTarget;
        const address = input.value.trim();
        if (!address) return;
        
        await hybridSearch(address);
        input.blur();
    };

    // Hybrid search: checks Wilayah DB first, then Nominatim
    const hybridSearch = async (query: string) => {
        if (isGeocoding) return;
        setNotification(null);
        setIsGeocoding(true);
        setSubmitError(null);
        try {
            const response = await fetch(`/api/search-location?q=${encodeURIComponent(query)}`, {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            const result = await response.json();
            if (result.success && result.data) {
                const lat = result.data.latitude;
                const lng = result.data.longitude;

                setData('latitude', lat.toFixed(6));
                setData('longitude', lng.toFixed(6));
                setMapKey(prev => prev + 1);
                
                // Update address field if we got a display name
                if (result.data.display_name) {
                    setData('alamat', result.data.display_name);
                }
                
                setNotification({ type: 'success', message: 'Lokasi berhasil ditemukan! Koordinat sudah terisi.' });
            } else {
                setNotification({ type: 'warning', message: result.message || 'Lokasi tidak ditemukan. Coba gunakan nama jalan, desa, atau gedung yang lebih spesifik.' });
            }
        } catch (error) {
            console.warn('Search error, using fallback:', error);
            setNotification({ type: 'error', message: 'Gagal mencari lokasi. Silakan coba lagi atau gunakan peta untuk menandai lokasi.' });
        } finally {
            setIsGeocoding(false);
        }
    };



    // Use current location (Geolocation API)
    const useCurrentLocation = async () => {
        if (!navigator.geolocation) {
            setNotification({ type: 'warning', message: 'Browser atau perangkat Anda tidak mendukung fitur lokasi. Silakan klik peta untuk memilih lokasi.' });
            return;
        }

        setNotification(null);
        setIsGeocoding(true);
        setSubmitError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setData('latitude', lat.toFixed(6));
                setData('longitude', lng.toFixed(6));
                setMapKey(prev => prev + 1);
                
                // Reverse geocode to get address for display
                try {
                    const response = await fetch(`/api/search-location?q=${encodeURIComponent(`${lat},${lng}`)}`, {
                        headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                    });
                    const result = await response.json();
                    if (result.success && result.data?.display_name) {
                        setData('alamat', result.data.display_name);
                    }
                } catch (e) {
                    console.warn('Reverse geocode failed:', e);
                }
                
                setNotification({ type: 'success', message: 'Lokasi Anda berhasil dideteksi! Peta sudah menampilkan posisi Anda.' });
                setIsGeocoding(false);
            },
            (error) => {
                setIsGeocoding(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setNotification({ type: 'warning', message: 'Akses lokasi ditolak. Silakan izinkan akses lokasi di pengaturan browser, atau klik peta untuk memilih lokasi.' });
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setNotification({ type: 'warning', message: 'Lokasi tidak dapat dideteksi. Pastikan GPS aktif dan coba lagi, atau klik peta untuk memilih lokasi.' });
                        break;
                    case error.TIMEOUT:
                        setNotification({ type: 'warning', message: 'Waktu permintaan lokasi habis. Coba lagi atau klik peta untuk memilih lokasi.' });
                        break;
                    default:
                        setNotification({ type: 'error', message: 'Gagal mendapatkan lokasi. Silakan gunakan peta untuk menandai lokasi.' });
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    // Combine date and time for submission
    const getCombinedDateTime = () => {
        if (data.waktu_kejadian_date && data.waktu_kejadian_time) {
            return `${data.waktu_kejadian_date}T${data.waktu_kejadian_time}`;
        }
        return data.waktu_kejadian_date || '';
    };

    const validateForm = (): string | null => {
        if (!data.nama_pelapor || data.nama_pelapor.length < 2) return 'Nama lengkap wajib diisi (min. 2 karakter).';
        if (!data.no_hp || data.no_hp.length < 8) return 'Nomor WhatsApp wajib diisi dengan benar.';
        if (!data.jenis_bencana_id) return 'Silakan pilih jenis bencana terlebih dahulu.';
        if (!data.judul || data.judul.length < 5) return 'Judul laporan wajib diisi (min. 5 karakter).';
        if (!data.deskripsi || data.deskripsi.length < 10) return 'Deskripsi kejadian wajib diisi (min. 10 karakter).';
        if (!data.alamat || data.alamat.length < 5) return 'Alamat lengkap wajib diisi.';
        if (!data.kabupaten) return 'Silakan pilih kabupaten/kota.';
        if (!data.kecamatan) return 'Silakan pilih kecamatan.';
        if (!data.latitude || !data.longitude) return 'Silakan tandai lokasi di peta terlebih dahulu.';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Frontend validation first
        const validationError = validateForm();
        if (validationError) {
            showToast('warning', validationError);
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        const formData = new FormData();
        // Add all form data
        Object.entries(data).forEach(([key, value]) => {
            if (value && key !== 'waktu_kejadian_date' && key !== 'waktu_kejadian_time') {
                formData.append(key, value);
            }
        });
        // Add combined datetime
        const combinedDateTime = getCombinedDateTime();
        if (combinedDateTime) {
            formData.append('waktu_kejadian', combinedDateTime);
        }
        files.forEach((file) => {
            formData.append('media[]', file);
        });

        try {
            const response = await fetch('/public/lapor-bencana', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                showToast('success', 'Laporan berhasil dikirim! Tim kami akan segera meninjau laporan Anda.');
                setSubmitSuccess(true);
                setKodeLaporan(result.data.kode_laporan);
                // Reset form
                setData({
                    nama_pelapor: '',
                    no_hp: '',
                    email: '',
                    jenis_bencana_id: '',
                    judul: '',
                    deskripsi: '',
                    alamat: '',
                    kabupaten: '',
                    kecamatan: '',
                    desa: '',
                    provinsi: '',
                    latitude: '',
                    longitude: '',
                    waktu_kejadian_date: '',
                    waktu_kejadian_time: '',
                });
                setKecamatanOptions([]);
                setDesaOptions([]);
                setFiles([]);
            } else {
                // Handle 422 validation errors
                if (response.status === 422 && result.errors) {
                    const fieldMessages = Object.values(result.errors).flat().join('. ');
                    showToast('warning', fieldMessages || 'Ada data yang belum diisi dengan benar. Periksa kembali form Anda.');
                } else if (response.status === 429) {
                    showToast('warning', 'Terlalu banyak permintaan. Silakan tunggu beberapa saat sebelum mencoba lagi.');
                } else {
                    showToast('error', result.message || 'Gagal mengirim laporan. Silakan coba lagi.');
                }
                setSubmitError(result.message || 'Terjadi kesalahan saat menyimpan laporan.');
            }
        } catch (error) {
            showToast('error', 'Gagal terhubung ke server. Periksa koneksi internet Anda dan coba lagi.');
            setSubmitError('Terjadi kesalahan koneksi. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if form has all required fields filled
    const isFormIncomplete = !data.nama_pelapor || data.nama_pelapor.length < 2
        || !data.no_hp || data.no_hp.length < 8
        || !data.jenis_bencana_id
        || !data.judul || data.judul.length < 5
        || !data.deskripsi || data.deskripsi.length < 10
        || !data.alamat || data.alamat.length < 5
        || !data.kabupaten
        || !data.kecamatan
        || !data.latitude || !data.longitude;

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-8 md:p-10 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-50">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Laporan Berhasil Dikirim!</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Terima kasih, laporan Anda telah diterima. Tim kami akan segera meninjaunya.
                        </p>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
                            <p className="text-sm text-blue-600 mb-3 font-medium">Kode Laporan Anda:</p>
                            <div className="flex items-center justify-center gap-3">
                                <p className="text-3xl md:text-4xl font-bold text-blue-700 font-mono tracking-wider select-all">{kodeLaporan}</p>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2.5 bg-white hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                                    title="Salin kode"
                                >
                                    {copied ? (
                                        <Check className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-blue-600" />
                                    )}
                                </button>
                            </div>
                            {copied && (
                                <p className="text-xs text-green-600 mt-2 font-medium">✓ Kode berhasil disalin!</p>
                            )}
                        </div>

                        <p className="text-sm text-gray-500 mb-8">
                            Simpan kode ini untuk melacak status laporan Anda.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                            <button
                                onClick={shareViaWhatsApp}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all hover:shadow-lg hover:shadow-green-200"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                Bagikan via WhatsApp
                            </button>
                            <button
                                onClick={shareViaTelegram}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                </svg>
                                <span className="hidden sm:inline">Telegram</span>
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                href={`/public/lacak-laporan?kode_laporan=${kodeLaporan}`}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-200"
                            >
                                Lacak Laporan
                            </a>
                            <button
                                onClick={() => setSubmitSuccess(false)}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                            >
                                Buat Laporan Baru
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Determine map center from coordinates or default
    const mapCenter = (data.latitude && data.longitude)
        ? [parseFloat(data.latitude), parseFloat(data.longitude)] as [number, number]
        : DEFAULT_CENTER;
    const mapZoom = (data.latitude && data.longitude) ? 16 : DEFAULT_ZOOM;

    return (
        <>
            <Head title="Lapor Bencana - Disaster Intelligence" />
            {notification && createPortal(
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2147483647, pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', bottom: '24px', right: '24px', maxWidth: '24rem', pointerEvents: 'auto' }}
                         className={`${notification.type === 'success' ? 'bg-green-600' : notification.type === 'error' ? 'bg-red-600' : notification.type === 'warning' ? 'bg-amber-600' : 'bg-blue-600'} text-white px-5 py-4 rounded-xl shadow-2xl flex items-start gap-3 animate-slide-in`}>
                        {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" /> :
                         notification.type === 'error' ? <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" /> :
                         notification.type === 'warning' ? <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" /> :
                         <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                        <div className="flex-1">
                            <p className="text-sm font-medium">{notification.message}</p>
                        </div>
                        <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white flex-shrink-0 ml-2">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>,
                document.body
            )}
            <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4 shadow-sm">
                        <AlertTriangle className="w-8 h-8 text-orange-600" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Lapor Bencana</h1>
                    <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
                        Laporkan kejadian bencana di sekitar Anda. Setiap laporan membantu tim kami merespons lebih cepat dan tepat sasaran.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 md:p-8 space-y-8">
                    {/* Error Alert */}
                    {submitError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{submitError}</p>
                        </div>
                    )}

                    {/* Reporter Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">1</span>
                            Informasi Pelapor
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_pelapor}
                                    onChange={(e) => setData('nama_pelapor', e.target.value)}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow ${
                                        errors.nama_pelapor ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.nama_pelapor && (
                                    <p className="text-red-500 text-xs mt-1">{errors.nama_pelapor}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nomor WhatsApp <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={data.no_hp}
                                        onChange={(e) => setData('no_hp', e.target.value)}
                                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow ${
                                            errors.no_hp ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>
                                {errors.no_hp && (
                                    <p className="text-red-500 text-xs mt-1">{errors.no_hp}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email (Opsional)
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    placeholder="email@contoh.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Disaster Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">2</span>
                            Informasi Bencana
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Jenis Bencana <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {jenisBencana.map((jenis) => (
                                    <label
                                        key={jenis.id}
                                        className={`relative flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                                            data.jenis_bencana_id === jenis.id.toString()
                                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-sm'
                                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="jenis_bencana_id"
                                            value={jenis.id}
                                            checked={data.jenis_bencana_id === jenis.id.toString()}
                                            onChange={(e) => setData('jenis_bencana_id', e.target.value)}
                                            className="sr-only"
                                        />
                                        {jenis.icon && iconMap[jenis.icon] ? (
                                            {
                                                render: () => {
                                                    const IconComponent = iconMap[jenis.icon];
                                                    return <IconComponent className="w-8 h-8" style={{ color: jenis.warna || '#9ca3af' }} />;
                                                }
                                            }.render()
                                        ) : (
                                            <AlertTriangle className="w-8 h-8 text-gray-400" />
                                        )}
                                        <span className="text-sm font-medium text-gray-700">{jenis.nama_bencana}</span>
                                        {data.jenis_bencana_id === jenis.id.toString() && (
                                            <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-blue-600" />
                                        )}
                                    </label>
                                ))}
                            </div>
                            {errors.jenis_bencana_id && (
                                <p className="text-red-500 text-xs mt-1">{errors.jenis_bencana_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Judul Laporan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.judul ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Contoh: Banjir di Jalan Merdeka"
                            />
                            {errors.judul && (
                                <p className="text-red-500 text-xs mt-1">{errors.judul}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deskripsi Kejadian <span className="text-red-500">*</span>
                            </label>
                            <RichTextEditor
                                value={data.deskripsi}
                                onChange={(val) => setData('deskripsi', val)}
                                placeholder="Jelaskan kronologi kejadian secara detail..."
                                minHeight="200px"
                            />
                            {errors.deskripsi && (
                                <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Tanggal Kejadian
                                </label>
                                <input
                                    type="date"
                                    value={data.waktu_kejadian_date}
                                    onChange={(e) => setData('waktu_kejadian_date', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Waktu Kejadian
                                </label>
                                <input
                                    type="time"
                                    value={data.waktu_kejadian_time}
                                    onChange={(e) => setData('waktu_kejadian_time', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">3</span>
                            Lokasi Kejadian
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kabupaten/Kota <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kabupaten}
                                    onChange={(e) => {
                                        setData('kabupaten', e.target.value);
                                        const selected = kabupatenList.find(k => k.code === e.target.value || k.name === e.target.value);
                                        setData('provinsi', selected ? '' : '');
                                    }}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.kabupaten ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Pilih Kabupaten/Kota</option>
                                    {kabupatenList.map((kab) => (
                                        <option key={kab.code} value={kab.code}>{kab.name}</option>
                                    ))}
                                </select>
                                {errors.kabupaten && (
                                    <p className="text-red-500 text-xs mt-1">{errors.kabupaten}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kecamatan <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kecamatan}
                                    onChange={(e) => {
                                        setData('kecamatan', e.target.value);
                                        setData('desa', '');
                                    }}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.kecamatan ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    disabled={!data.kabupaten || isLoadingKecamatan}
                                >
                                    <option value="">
                                        {isLoadingKecamatan ? 'Memuat...' : 'Pilih Kecamatan'}
                                    </option>
                                    {kecamatanOptions.map((kec) => (
                                        <option key={kec.code} value={kec.name}>{kec.name}</option>
                                    ))}
                                    {!isLoadingKecamatan && kecamatanOptions.length === 0 && data.kabupaten && (
                                        <option value="" disabled>Tidak ada data kecamatan</option>
                                    )}
                                </select>
                                {errors.kecamatan && (
                                    <p className="text-red-500 text-xs mt-1">{errors.kecamatan}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Desa/Kelurahan
                                </label>
                                <select
                                    value={data.desa}
                                    onChange={(e) => setData('desa', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={!data.kecamatan || isLoadingDesa}
                                >
                                    <option value="">
                                        {isLoadingDesa ? 'Memuat...' : 'Pilih Desa/Kelurahan'}
                                    </option>
                                    {desaOptions.map((desa) => (
                                        <option key={desa.code} value={desa.name}>{desa.name}</option>
                                    ))}
                                    {!isLoadingDesa && desaOptions.length === 0 && data.kecamatan && (
                                        <option value="" disabled>Tidak ada data desa untuk kecamatan ini</option>
                                    )}
                                    {!isLoadingDesa && desaOptions.length === 0 && !data.kecamatan && (
                                        <option value="" disabled>Pilih kecamatan terlebih dahulu</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alamat Lengkap <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                rows={2}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.alamat ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Contoh: Jl. Merdeka No. 45, depan Masjid Al-Hidayah"
                            />
                            {errors.alamat && (
                                <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Map className="w-4 h-4" />
                                Tandai Lokasi di Peta <span className="text-red-500">*</span>
                                {isGeocoding && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                            </label>
                            
                            {/* Map Controls: Search + Current Location */}
                            <div className="mb-2 flex gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        id="map-search"
                                        placeholder="Cari lokasi: nama jalan, gedung, desa... (contoh: Jl. Merdeka, Kantor BPBD, Polindra)"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        onKeyDown={handleMapSearch}
                                    />
                                    {isGeocoding && (
                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-blue-600" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={useCurrentLocation}
                                    disabled={isGeocoding}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Gunakan lokasi saat ini (GPS)"
                                >
                                    <Target className="w-4 h-4" />
                                    <span className="hidden sm:inline">Lokasi Saya</span>
                                </button>
                            </div>
                            
                            <div className={`border rounded-lg overflow-hidden ${errors.latitude ? 'border-red-500' : 'border-gray-300'}`}>
                                <div style={{ height: '300px', width: '100%' }}>
                                    <MapContainer
                                        key={mapKey}
                                        center={mapCenter}
                                        zoom={mapZoom}
                                        scrollWheelZoom={true}
                                        className="h-full w-full"
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url={config.mapTileUrl}
                                        />
                                        <MapClickHandler />
                                        <FlyToCenter center={data.latitude && data.longitude ? [parseFloat(data.latitude), parseFloat(data.longitude)] : null} zoom={data.latitude && data.longitude ? 17 : mapZoom} />
                                        <LocationMarker position={data.latitude && data.longitude ? [parseFloat(data.latitude), parseFloat(data.longitude)] : null} />
                                    </MapContainer>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Klik pada peta untuk menandai lokasi, atau isi alamat/kecamatan/desa untuk otomatis mencari koordinat.</p>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                                    <input
                                        type="text"
                                        value={data.latitude}
                                        onChange={(e) => setData('latitude', e.target.value)}
                                        placeholder="Latitude"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                                    <input
                                        type="text"
                                        value={data.longitude}
                                        onChange={(e) => setData('longitude', e.target.value)}
                                        placeholder="Longitude"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            {errors.latitude && (
                                <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
                            )}
                        </div>
                    </div>

                    {/* Media Upload */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">4</span>
                            Foto/Bukti (Opsional)
                        </h3>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                            <input
                                type="file"
                                id="media-upload"
                                multiple
                                accept="image/*,video/mp4"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label htmlFor="media-upload" className="cursor-pointer">
                                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
                                    Klik untuk upload foto/video
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Maks 5 file (JPG, PNG, MP4). Maks 10MB per file.
                                </p>
                            </label>
                        </div>

                        {files.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {files.map((file, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            {file.type.startsWith('image/') ? (
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <p className="text-xs text-gray-500 truncate mt-1">{file.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Honeypot Fields - Hidden from users, filled by bots */}
                    <div className="hidden">
                        <input
                            type="text"
                            name="website_url"
                            value={data.website_url}
                            onChange={(e) => setData('website_url', e.target.value)}
                            tabIndex={-1}
                            autoComplete="off"
                        />
                        <input
                            type="text"
                            name="contact_subject"
                            value={data.contact_subject}
                            onChange={(e) => setData('contact_subject', e.target.value)}
                            tabIndex={-1}
                            autoComplete="off"
                        />
                    </div>

                    {/* Submit */}
                    <div className="pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={isSubmitting || processing}
                            title={'Kirim laporan'}
                            className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                'Kirim Laporan'
                            )}
                        </button>
                    </div>
                </form>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* WhatsApp Card */}
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Butuh Bantuan?</h3>
                                <p className="text-xs text-gray-500">Hubungi kami via WhatsApp</p>
                            </div>
                        </div>
                        <a
                            href="https://wa.me/6285647075733"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-all hover:shadow-lg hover:shadow-green-200"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Hubungi via WhatsApp
                        </a>
                        <p className="text-xs text-gray-400 text-center mt-3">Respon cepat 1x24 jam</p>
                    </div>

                    {/* Tips Card */}
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-blue-500" />
                            Tips Melapor
                        </h3>
                        <ul className="space-y-2.5">
                            {[
                                'Isi data diri dengan lengkap dan benar',
                                'Jelaskan kronologi kejadian secara detail',
                                'Tandai lokasi kejadian di peta dengan tepat',
                                'Lampirkan foto/video jika memungkinkan',
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kode Laporan Card */}
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Search className="w-4 h-4 text-indigo-500" />
                            Punya Kode Laporan?
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                            Lacak status laporan Anda yang sudah terkirim.
                        </p>
                        <a
                            href="/public/lacak-laporan"
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all"
                        >
                            Lacak Laporan
                        </a>
                    </div>
                </div>
                </div>
            </div>
        </div>
        </>
    );
}