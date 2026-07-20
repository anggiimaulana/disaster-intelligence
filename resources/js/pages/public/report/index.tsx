import { useState, type FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, AlertTriangle, MessageCircle, Send, CheckCircle2, MapPin, Camera, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EthicalHero } from '@/components/ui/hero-ethical';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { home } from '@/routes';
import { disasterMap } from '@/routes/public';
import { config } from '@/config';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ lat, lng, onPick }: { lat: number; lng: number; onPick: (lat: number, lng: number) => void }) {
    useMapEvents({ click(e) { onPick(e.latlng.lat, e.latlng.lng); } });
    return <Marker position={[lat, lng]} />;
}

interface Regency {
    id: number;
    code: string;
    name: string;
}

interface DisasterType {
    id: number;
    kode: string;
    nama_bencana: string;
}

interface ReportPageProps {
    supportedRegencies: Regency[];
    disasterTypes: DisasterType[];
}

export default function ReportPage({ supportedRegencies, disasterTypes }: ReportPageProps) {
    const [nama, setNama] = useState('');
    const [noHp, setNoHp] = useState('');
    const [kabupaten, setKabupaten] = useState('');
    const [kecamatan, setKecamatan] = useState('');
    const [desa, setDesa] = useState('');
    const [jenisBencanaId, setJenisBencanaId] = useState('');
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [tingkatKeparahan, setTingkatKeparahan] = useState('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [buktiFile, setBuktiFile] = useState<File | null>(null);
    const [buktiPreview, setBuktiPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Waktu Kejadian (auto-filled)
    const [waktuKejadian, setWaktuKejadian] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });

    // Kecamatan & Desa from API (now returns { code, name } objects)
    const [kecamatanList, setKecamatanList] = useState<{code: string; name: string}[]>([]);
    const [desaList, setDesaList] = useState<{code: string; name: string}[]>([]);
    const [loadingKecamatan, setLoadingKecamatan] = useState(false);
    const [loadingDesa, setLoadingDesa] = useState(false);

    // Fetch kecamatan when kabupaten changes (uses BPS code)
    const handleKabupatenChange = async (value: string) => {
        setKabupaten(value);
        setKecamatan('');
        setDesa('');
        setDesaList([]);
        if (!value) { setKecamatanList([]); return; }

        setLoadingKecamatan(true);
        try {
            const res = await fetch(`/api/kecamatan/${encodeURIComponent(value)}`);
            const data = await res.json();
            setKecamatanList(data.data || []);
        } catch { setKecamatanList([]); }
        setLoadingKecamatan(false);
    };

    // Fetch desa when kecamatan changes (uses BPS code)
    const handleKecamatanChange = async (value: string) => {
        setKecamatan(value);
        setDesa('');
        if (!value) { setDesaList([]); return; }

        setLoadingDesa(true);
        try {
            const kecCode = kecamatanList.find(k => k.name === value)?.code || value;
            const res = await fetch(`/api/desa-by-kecamatan/${encodeURIComponent(kecCode)}?kabupaten=${encodeURIComponent(kabupaten)}`);
            const data = await res.json();
            setDesaList(data.data || []);
        } catch { setDesaList([]); }
        setLoadingDesa(false);
    };

    // Get GPS location
    const handleGetLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => { setLatitude(pos.coords.latitude); setLongitude(pos.coords.longitude); },
            () => { setLatitude(-6.42); setLongitude(108.20); }
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBuktiFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setBuktiPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        const formData = new FormData();
        formData.append('nama_pelapor', nama);
        formData.append('no_hp_pelapor', noHp);
        formData.append('jenis_bencana_id', jenisBencanaId);
        formData.append('judul', judul);
        formData.append('deskripsi', deskripsi);
        formData.append('alamat', `${kecamatan}, ${kabupaten}`);
        formData.append('kecamatan', kecamatan);
        if (desa) formData.append('desa', desa);
        formData.append('tingkat_keparahan', tingkatKeparahan);
        if (latitude) formData.append('latitude', String(latitude));
        if (longitude) formData.append('longitude', String(longitude));
        if (buktiFile) formData.append('bukti', buktiFile);
        formData.append('waktu_kejadian', waktuKejadian);

        try {
            const res = await fetch('/public/lapor', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setSubmitted(true);
            } else {
                setErrors(data.errors || { 'general': data.message || 'Terjadi kesalahan' });
            }
        } catch {
            setErrors({ 'general': 'Terjadi kesalahan koneksi' });
        }
        setSubmitting(false);
    };

    if (submitted) {
        return (
            <>
                <Head title="Laporan Terkirim" />
                <div className="bg-premium-bg min-h-[80vh] flex items-center justify-center py-20 px-4">
                    <div className="max-w-md w-full bg-white rounded-[32px] p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-premium-border">
                        <div className="w-20 h-20 rounded-full bg-premium-success/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-10 w-10 text-premium-success" />
                        </div>
                        <h1 className="text-2xl font-bold text-premium-heading mb-3 font-heading">Laporan Diterima!</h1>
                        <p className="text-sm text-premium-body leading-relaxed mb-8">
                            Terima kasih, <strong>{nama}</strong>. Tim BPBD akan segera memverifikasi laporan Anda.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button onClick={() => { setSubmitted(false); setNama(''); setNoHp(''); setKabupaten(''); setKecamatan(''); setDesa(''); setJenisBencanaId(''); setJudul(''); setDeskripsi(''); setTingkatKeparahan(''); setBuktiFile(null); setBuktiPreview(null); setWaktuKejadian(() => { const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); return now.toISOString().slice(0, 16); }); }} className="w-full bg-premium-navy text-white hover:bg-premium-navy-dark h-12 rounded-[16px] text-sm font-semibold">
                                Buat Laporan Baru
                            </Button>
                            <Button asChild variant="outline" className="w-full h-12 rounded-[16px] text-sm font-semibold border-premium-border">
                                <Link href={home()}>Kembali ke Beranda</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Lapor Bencana - Disaster Intelligence" />

            <EthicalHero
                kicker="Pelaporan Darurat"
                title={<>Laporkan Kejadian <span className="text-premium-blue-accent">Bencana</span> di Sekitar Anda</>}
                subtitle="Isi formulir di bawah untuk mengirim laporan langsung ke BPBD. Setiap laporan membantu respons yang lebih cepat."
                meta="Respons awal kurang dari 15 menit · Layanan 24 jam"
            />

            <div className="bg-premium-bg pb-16">
                <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10">
                    <Link href={home()} className="inline-flex items-center gap-2 text-sm font-medium text-premium-body hover:text-premium-blue-hover transition-colors mb-6 group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Beranda
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 items-start">
                        <div className="lg:col-span-2">
                            {errors.general && (
                                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errors.general}</div>
                            )}

                            <form onSubmit={handleSubmit} className="rounded-[32px] border border-premium-border bg-white p-6 sm:p-8 lg:p-10 shadow-[0_15px_40px_rgba(15,23,42,0.04)] space-y-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-premium-blue-accent/5 rounded-bl-full pointer-events-none" />

                                {/* Nama & No HP */}
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-premium-heading mb-2">Nama Lengkap *</label>
                                        <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} required placeholder="Masukkan nama Anda" className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading placeholder:text-premium-caption focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm" />
                                        {errors.nama_pelapor && <p className="mt-1 text-xs text-red-600">{errors.nama_pelapor}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-premium-heading mb-2">No. HP / WhatsApp *</label>
                                        <input type="tel" value={noHp} onChange={(e) => setNoHp(e.target.value)} required placeholder="08xxxxxxxxxx" className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading placeholder:text-premium-caption focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm" />
                                        {errors.no_hp_pelapor && <p className="mt-1 text-xs text-red-600">{errors.no_hp_pelapor}</p>}
                                    </div>
                                </div>

                                {/* Kabupaten */}
                                <div>
                                    <label className="block text-sm font-bold text-premium-heading mb-2">Kabupaten/Kota *</label>
                                    <select value={kabupaten} onChange={(e) => handleKabupatenChange(e.target.value)} required className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm appearance-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'1.5\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'m8.25 4.5 7.5 7.5-7.5 7.5\' /%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}>
                                        <option value="">Pilih kabupaten/kota</option>
                                        {supportedRegencies.map((r) => <option key={r.id} value={r.code}>{r.name}</option>)}
                                    </select>
                                </div>

                                {/* Kecamatan & Desa */}
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-premium-heading mb-2">Kecamatan *</label>
                                        <select value={kecamatan} onChange={(e) => handleKecamatanChange(e.target.value)} required disabled={!kabupaten || loadingKecamatan} className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm appearance-none disabled:opacity-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'1.5\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'m8.25 4.5 7.5 7.5-7.5 7.5\' /%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}>
                                        <option value="">{loadingKecamatan ? 'Memuat...' : 'Pilih kecamatan'}</option>
                                        {kecamatanList.map((k) => <option key={k.code} value={k.name}>{k.name}</option>)}
                                    </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-premium-heading mb-2">Desa/Kelurahan</label>
                                        <select value={desa} onChange={(e) => setDesa(e.target.value)} disabled={!kecamatan || loadingDesa} className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm appearance-none disabled:opacity-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'1.5\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'m8.25 4.5 7.5 7.5-7.5 7.5\' /%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}>
                                        <option value="">{loadingDesa ? 'Memuat...' : 'Pilih desa'}</option>
                                        {desaList.map((d) => <option key={d.code} value={d.name}>{d.name}</option>)}
                                    </select>
                                    </div>
                                </div>

                                {/* Jenis Bencana & Keparahan */}
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-premium-heading mb-2">Jenis Bencana *</label>
                                        <select value={jenisBencanaId} onChange={(e) => setJenisBencanaId(e.target.value)} required className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm appearance-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'1.5\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'m8.25 4.5 7.5 7.5-7.5 7.5\' /%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}>
                                        <option value="">Pilih jenis bencana</option>
                                        {disasterTypes.map((t) => <option key={t.id} value={t.id}>{t.nama_bencana}</option>)}
                                    </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-premium-heading mb-2">Tingkat Keparahan *</label>
                                        <select value={tingkatKeparahan} onChange={(e) => setTingkatKeparahan(e.target.value)} required className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm appearance-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'1.5\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'m8.25 4.5 7.5 7.5-7.5 7.5\' /%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}>
                                        <option value="">Pilih tingkat</option>
                                        <option value="Rendah">Rendah</option>
                                        <option value="Sedang">Sedang</option>
                                        <option value="Tinggi">Tinggi</option>
                                        <option value="Darurat">Darurat</option>
                                    </select>
                                    </div>
                                </div>

                                {/* Waktu Kejadian */}
                                <div>
                                    <label className="block text-sm font-bold text-premium-heading mb-2">Tanggal & Waktu Kejadian *</label>
                                    <input type="datetime-local" value={waktuKejadian} onChange={(e) => setWaktuKejadian(e.target.value)} required className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm" />
                                    <p className="mt-1 text-xs text-premium-caption">Otomatis mendeteksi waktu saat ini. Sesuaikan jika kejadian terjadi sebelumnya.</p>
                                    {errors.waktu_kejadian && <p className="mt-1 text-xs text-red-600">{errors.waktu_kejadian}</p>}
                                </div>

                                {/* Judul */}
                                <div>
                                    <label className="block text-sm font-bold text-premium-heading mb-2">Judul Laporan *</label>
                                    <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} required placeholder="Ringkasan singkat kejadian" className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading placeholder:text-premium-caption focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm" />
                                </div>

                                {/* Deskripsi */}
                                <div>
                                    <label className="block text-sm font-bold text-premium-heading mb-2">Deskripsi Kejadian *</label>
                                    <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required rows={4} placeholder="Jelaskan kronologi kejadian, dampak, dan kondisi terkini..." className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading placeholder:text-premium-caption focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm resize-y" />
                                </div>

                                {/* Lokasi dengan Peta */}
                                <div>
                                    <label className="block text-sm font-bold text-premium-heading mb-2">Lokasi Kejadian</label>
                                    <div className="flex gap-3 mb-3">
                                        <Button type="button" onClick={handleGetLocation} variant="outline" className="flex items-center gap-2 rounded-[14px] border-premium-border text-premium-heading hover:bg-premium-bg">
                                            <MapPin className="h-4 w-4" /> {latitude ? 'Update Lokasi GPS' : 'Ambil Lokasi GPS'}
                                        </Button>
                                        {latitude && longitude && (
                                            <span className="flex items-center text-sm text-premium-body">{latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
                                        )}
                                    </div>
                                    <div className="rounded-[16px] border border-premium-border overflow-hidden shadow-sm" style={{ height: '280px' }}>
                                        <MapContainer
                                            center={latitude && longitude ? [latitude, longitude] : [-6.42, 108.20]}
                                            zoom={latitude ? 14 : 10}
                                            className="h-full w-full"
                                            style={{ zIndex: 0 }}
                                            scrollWheelZoom={true}
                                        >
                                            <TileLayer url={config.mapTileUrl} attribution='&copy; OpenStreetMap' />
                                            {latitude && longitude && (
                                                <LocationMarker lat={latitude} lng={longitude} onPick={(lat, lng) => { setLatitude(lat); setLongitude(lng); }} />
                                            )}
                                        </MapContainer>
                                    </div>
                                    <p className="mt-2 text-xs text-premium-caption">Klik pada peta untuk memilih lokasi, atau gunakan tombol GPS di atas.</p>
                                </div>

                                {/* Bukti Foto */}
                                <div>
                                    <label className="block text-sm font-bold text-premium-heading mb-2">Bukti Foto <span className="text-premium-caption font-normal">(opsional)</span></label>
                                    {buktiPreview ? (
                                        <div className="relative inline-block">
                                            <img src={buktiPreview} alt="Preview" className="max-h-48 rounded-xl object-cover border border-premium-border" />
                                            <button type="button" onClick={() => { setBuktiFile(null); setBuktiPreview(null); }} className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center"><X className="h-3.5 w-3.5" /></button>
                                        </div>
                                    ) : (
                                        <label className="flex items-center justify-center flex-col gap-2 rounded-[16px] border-2 border-dashed border-premium-border bg-premium-bg/30 px-6 py-8 cursor-pointer hover:bg-premium-bg/80 hover:border-premium-blue-accent/50 transition-all group">
                                            <div className="h-10 w-10 rounded-full bg-premium-blue-accent/10 text-premium-blue-accent flex items-center justify-center group-hover:scale-110 transition-transform"><Camera className="h-5 w-5" /></div>
                                            <span className="text-sm font-medium text-premium-heading mt-2">Klik atau seret foto ke sini</span>
                                            <span className="text-xs text-premium-caption">Maks. 5MB (JPG/PNG)</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                        </label>
                                    )}
                                </div>

                                {/* Submit */}
                                <div className="pt-2">
                                    <Button type="submit" disabled={submitting} className="w-full h-14 bg-gradient-to-r from-premium-navy to-premium-navy-dark hover:opacity-90 text-white rounded-[18px] text-base font-bold shadow-[0_10px_25px_rgba(11,42,82,0.25)] hover:shadow-[0_15px_35px_rgba(11,42,82,0.35)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60">
                                        {submitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Send className="h-5 w-5 mr-2" />}
                                        {submitting ? 'Mengirim...' : 'Kirim Laporan'}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6">
                            <div className="rounded-[24px] border border-premium-border bg-white p-6 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#25D366]/10 rounded-bl-full transition-transform group-hover:scale-110" />
                                <h3 className="text-base font-bold text-premium-heading mb-2 font-heading">Butuh Bantuan Cepat?</h3>
                                <p className="text-sm text-premium-body leading-relaxed mb-6">Kirim laporan langsung melalui WhatsApp kami.</p>
                                <Button asChild className="w-full h-12 bg-[#25D366] text-white hover:bg-[#1DA851] rounded-[14px] font-bold shadow-md">
                                    <a href="https://wa.me/6285647075733" target="_blank" rel="noopener noreferrer"><MessageCircle className="h-5 w-5 mr-2" />Chat WhatsApp</a>
                                </Button>
                            </div>

                            <div className="rounded-[24px] border border-premium-warning/20 bg-premium-warning/5 p-6 shadow-sm">
                                <h3 className="text-base font-bold text-premium-heading mb-4 font-heading flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-premium-warning" />Tips Melapor</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3"><div className="h-6 w-6 rounded-full bg-white border border-premium-border shadow-sm flex items-center justify-center shrink-0 text-premium-body">1</div><span className="text-sm text-premium-body mt-0.5">Pastikan Anda berada di area yang aman sebelum melapor.</span></li>
                                    <li className="flex items-start gap-3"><div className="h-6 w-6 rounded-full bg-white border border-premium-border shadow-sm flex items-center justify-center shrink-0 text-premium-body">2</div><span className="text-sm text-premium-body mt-0.5">Sertakan detail lokasi (nama jalan/patokan terdekat).</span></li>
                                    <li className="flex items-start gap-3"><div className="h-6 w-6 rounded-full bg-white border border-premium-border shadow-sm flex items-center justify-center shrink-0 text-premium-body">3</div><span className="text-sm text-premium-body mt-0.5">Sertakan foto jika memungkinkan untuk mempermudah validasi.</span></li>
                                </ul>
                            </div>

                            <div className="rounded-[24px] border border-premium-border bg-white p-6 shadow-sm">
                                <h3 className="text-base font-bold text-premium-heading mb-3 font-heading flex items-center gap-2"><MapPin className="h-5 w-5 text-premium-blue-accent" />Lihat Sebaran</h3>
                                <p className="text-sm text-premium-body mb-4">Cek peta interaktif untuk melihat kejadian di sekitar Anda.</p>
                                <Button asChild variant="outline" className="w-full h-11 rounded-[12px] border-premium-border text-premium-heading hover:bg-premium-bg"><Link href={disasterMap()}>Buka Peta</Link></Button>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
