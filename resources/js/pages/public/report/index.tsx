import { useState, type FormEvent } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, AlertTriangle, MessageCircle, Send, CheckCircle2, MapPin, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EthicalHero } from '@/components/ui/hero-ethical';
import { home } from '@/routes';
import { disasterMap } from '@/routes/public';
import type { PageProps } from '@/types';

interface ReportPageProps extends PageProps {
    isSimulation?: boolean;
}

const DISASTER_TYPES = [
    { value: 'BANJIR', label: 'Banjir' },
    { value: 'ANGIN_KENCANG', label: 'Angin Kencang' },
    { value: 'LONGSOR', label: 'Tanah Longsor' },
    { value: 'KEBAKARAN', label: 'Kebakaran' },
    { value: 'GEMPA', label: 'Gempa Bumi' },
    { value: 'LAINNYA', label: 'Lainnya' },
];

const KECAMATAN = [
    'Indramayu', 'Jatibarang', 'Juntinyuat', 'Kandanghaur', 'Karangampel',
    'Krangkeng', 'Kertasemaya', 'Lelea', 'Lohbener', 'Losarang',
    'Pasekan', 'Patrol', 'Sindang', 'Sliyeg', 'Sukagumiwang',
    'Tukdana', 'Widasari', 'Anjatan', 'Arahan', 'Balongan',
    'Bangodua', 'Bongas', 'Cikedung', 'Gabuswetan', 'Gantar',
    'Haurgeulis', 'Kroya', 'Situraja', 'Terisi', 'Trisi',
];

export default function ReportPage({}: ReportPageProps) {
    const [nama, setNama] = useState('');
    const [jenis, setJenis] = useState('');
    const [kecamatan, setKecamatan] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [fileName, setFileName] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <>
                <Head title="Laporan Terkirim - Disaster Intelligence" />
                <div className="bg-premium-bg min-h-[80vh] flex items-center justify-center py-20 px-4">
                    <div className="max-w-md w-full bg-white rounded-[32px] p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-premium-border animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 rounded-full bg-premium-success/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-10 w-10 text-premium-success" />
                        </div>
                        <h1 className="text-2xl font-bold text-premium-heading mb-3 font-heading">Laporan Diterima!</h1>
                        <p className="text-sm text-premium-body leading-relaxed mb-8">
                            Terima kasih, <strong>{nama}</strong>. Tim BPBD akan segera memverifikasi laporan Anda dan menindaklanjutinya.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={() => { setSubmitted(false); setNama(''); setJenis(''); setKecamatan(''); setDeskripsi(''); setFileName(''); }}
                                className="w-full bg-premium-navy text-white hover:bg-premium-navy-dark h-12 rounded-[16px] text-sm font-semibold shadow-md transition-all"
                            >
                                Buat Laporan Baru
                            </Button>
                            <Button asChild variant="outline" className="w-full h-12 rounded-[16px] text-sm font-semibold border-premium-border text-premium-body hover:bg-premium-bg transition-all">
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
                title={
                    <>
                        Laporkan Kejadian{' '}
                        <span className="text-premium-blue-accent">Bencana</span> di Sekitar Anda
                    </>
                }
                subtitle="Isi formulir di bawah untuk mengirim laporan langsung ke BPBD Kabupaten Indramayu. Setiap laporan membantu respons yang lebih cepat."
                meta="Respons awal kurang dari 15 menit · Layanan 24 jam"
            />

            <div className="bg-premium-bg pb-16">
                <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-2 text-sm font-medium text-premium-body hover:text-premium-blue-hover transition-colors mb-6 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Beranda
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 items-start">
                        <div className="lg:col-span-2">
                            <form
                                onSubmit={handleSubmit}
                                className="rounded-[32px] border border-premium-border bg-white p-6 sm:p-8 lg:p-10 shadow-[0_15px_40px_rgba(15,23,42,0.04)] space-y-6 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-premium-blue-accent/5 rounded-bl-full pointer-events-none"></div>

                                <div>
                                    <label className="block text-sm font-bold text-premium-heading mb-2">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={nama}
                                        onChange={(e) => setNama(e.target.value)}
                                        required
                                        placeholder="Masukkan nama Anda"
                                        className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading placeholder:text-premium-caption focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm"
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-premium-heading mb-2">Jenis Bencana</label>
                                        <select
                                            value={jenis}
                                            onChange={(e) => setJenis(e.target.value)}
                                            required
                                            className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm appearance-none"
                                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'1.5\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'m8.25 4.5 7.5 7.5-7.5 7.5\' /%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}
                                        >
                                            <option value="">Pilih jenis bencana</option>
                                            {DISASTER_TYPES.map((t) => (
                                                <option key={t.value} value={t.value}>{t.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-premium-heading mb-2">Kecamatan</label>
                                        <select
                                            value={kecamatan}
                                            onChange={(e) => setKecamatan(e.target.value)}
                                            required
                                            className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm appearance-none"
                                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'1.5\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'m8.25 4.5 7.5 7.5-7.5 7.5\' /%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}
                                        >
                                            <option value="">Pilih kecamatan</option>
                                            {KECAMATAN.map((k) => (
                                                <option key={k} value={k}>Kec. {k}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-premium-heading mb-2">Deskripsi Kejadian</label>
                                    <textarea
                                        value={deskripsi}
                                        onChange={(e) => setDeskripsi(e.target.value)}
                                        required
                                        rows={4}
                                        placeholder="Jelaskan kronologi kejadian, dampak, dan kondisi terkini..."
                                        className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading placeholder:text-premium-caption focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm resize-y"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-premium-heading mb-2">Bukti Foto <span className="text-premium-caption font-normal">(opsional)</span></label>
                                    <label className="flex items-center justify-center flex-col gap-2 rounded-[16px] border-2 border-dashed border-premium-border bg-premium-bg/30 px-6 py-8 cursor-pointer hover:bg-premium-bg/80 hover:border-premium-blue-accent/50 transition-all group">
                                        <div className="h-10 w-10 rounded-full bg-premium-blue-accent/10 text-premium-blue-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Camera className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-medium text-premium-heading mt-2">
                                            {fileName || 'Klik atau seret foto ke sini'}
                                        </span>
                                        {!fileName && <span className="text-xs text-premium-caption">Maks. ukuran file 5MB (JPG/PNG)</span>}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
                                        />
                                    </label>
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" className="w-full h-14 bg-gradient-to-r from-premium-navy to-premium-navy-dark hover:opacity-90 text-white rounded-[18px] text-base font-bold shadow-[0_10px_25px_rgba(11,42,82,0.25)] hover:shadow-[0_15px_35px_rgba(11,42,82,0.35)] hover:-translate-y-0.5 transition-all duration-300">
                                        <Send className="h-5 w-5 mr-2" />
                                        Kirim Laporan
                                    </Button>
                                </div>
                            </form>
                        </div>

                        <aside className="space-y-6">
                            <div className="rounded-[24px] border border-premium-border bg-white p-6 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#25D366]/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
                                <h3 className="text-base font-bold text-premium-heading mb-2 font-heading">Butuh Bantuan Cepat?</h3>
                                <p className="text-sm text-premium-body leading-relaxed mb-6">
                                    Kirim laporan langsung melalui WhatsApp kami. Cukup sertakan lokasi, jenis kejadian, dan foto.
                                </p>
                                <Button
                                    asChild
                                    className="w-full h-12 bg-[#25D366] text-white hover:bg-[#1DA851] rounded-[14px] font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                >
                                    <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="h-5 w-5 mr-2" />
                                        Chat WhatsApp
                                    </a>
                                </Button>
                            </div>

                            <div className="rounded-[24px] border border-premium-warning/20 bg-premium-warning/5 p-6 shadow-sm">
                                <h3 className="text-base font-bold text-premium-heading mb-4 font-heading flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-premium-warning" />
                                    Tips Melapor
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="h-6 w-6 rounded-full bg-white border border-premium-border shadow-sm flex items-center justify-center shrink-0 text-premium-body">1</div>
                                        <span className="text-sm text-premium-body mt-0.5">Pastikan Anda berada di area yang aman sebelum melapor.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="h-6 w-6 rounded-full bg-white border border-premium-border shadow-sm flex items-center justify-center shrink-0 text-premium-body">2</div>
                                        <span className="text-sm text-premium-body mt-0.5">Sertakan detail lokasi (nama jalan/patokan terdekat).</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="h-6 w-6 rounded-full bg-white border border-premium-border shadow-sm flex items-center justify-center shrink-0 text-premium-body">3</div>
                                        <span className="text-sm text-premium-body mt-0.5">Sertakan foto jika memungkinkan untuk mempermudah validasi.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="rounded-[24px] border border-premium-border bg-white p-6 shadow-sm">
                                <h3 className="text-base font-bold text-premium-heading mb-3 font-heading flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-premium-blue-accent" />
                                    Lihat Sebaran
                                </h3>
                                <p className="text-sm text-premium-body mb-4">Cek peta interaktif untuk melihat kejadian di sekitar Anda.</p>
                                <Button asChild variant="outline" className="w-full h-11 rounded-[12px] border-premium-border text-premium-heading hover:bg-premium-bg">
                                    <Link href={disasterMap()}>Buka Peta</Link>
                                </Button>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
