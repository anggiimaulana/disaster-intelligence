import { useState, type FormEvent } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, AlertTriangle, MessageCircle, Camera, MapPin, Upload, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { home } from '@/routes';
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
            <div className="mx-auto max-w-[1240px] px-4 lg:px-6 py-20 lg:py-28">
                <div className="max-w-lg mx-auto text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-xl lg:text-2xl font-bold text-[#1F2937] mb-2">Laporan Terkirim!</h1>
                    <p className="text-sm text-[#6B7280] mb-6">
                        Terima kasih, {nama}. Tim BPBD akan memverifikasi laporan Anda dan menindaklanjuti segera.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button
                            onClick={() => { setSubmitted(false); setNama(''); setJenis(''); setKecamatan(''); setDeskripsi(''); setFileName(''); }}
                            className="bg-[#003366] text-white hover:bg-[#002B5C] rounded-xl"
                        >
                            Laporkan Lagi
                        </Button>
                        <Button asChild variant="outline" className="rounded-xl border-[#E5E7EB]">
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
            <div className="mx-auto max-w-[1240px] px-4 lg:px-6 py-8 lg:py-12">
            <Link
                href={home()}
                className="inline-flex items-center gap-1 text-sm text-[#003366] hover:text-[#002B5C] mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Kembali
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h1 className="text-xl lg:text-2xl font-bold text-[#1F2937] mb-2">Lapor Bencana</h1>
                    <p className="text-sm text-[#6B7280] mb-6">
                        Isi formulir di bawah untuk melaporkan kejadian bencana. Data Anda akan kami proses dan verifikasi.
                    </p>

                    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 lg:p-8 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Nama Lengkap</label>
                            <input
                                type="text"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                required
                                placeholder="Masukkan nama Anda"
                                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Jenis Bencana</label>
                                <select
                                    value={jenis}
                                    onChange={(e) => setJenis(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                                >
                                    <option value="">Pilih jenis bencana</option>
                                    {DISASTER_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Kecamatan</label>
                                <select
                                    value={kecamatan}
                                    onChange={(e) => setKecamatan(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                                >
                                    <option value="">Pilih kecamatan</option>
                                    {KECAMATAN.map((k) => (
                                        <option key={k} value={k}>Kec. {k}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Deskripsi Kejadian</label>
                            <textarea
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                                required
                                rows={4}
                                placeholder="Jelaskan kronologi kejadian, dampak, dan kondisi terkini..."
                                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] resize-y"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Foto Kejadian (opsional)</label>
                            <label className="flex items-center gap-3 rounded-xl border border-dashed border-[#E5E7EB] px-4 py-3 cursor-pointer hover:bg-[#F9FAFB] transition-colors">
                                <Upload className="h-5 w-5 text-[#9CA3AF]" />
                                <span className="text-sm text-[#6B7280]">
                                    {fileName || 'Upload foto dari perangkat Anda'}
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
                                />
                            </label>
                        </div>

                        <Button type="submit" className="w-full bg-[#003366] text-white hover:bg-[#002B5C] rounded-xl py-2.5">
                            <Send className="h-4 w-4 mr-2" />
                            Kirim Laporan
                        </Button>
                    </form>
                </div>

                <div className="space-y-4">
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
                        <h3 className="text-sm font-bold text-[#1F2937] mb-4">Lapor via WhatsApp</h3>
                        <p className="text-xs text-[#6B7280] mb-4">
                            Kirim laporan langsung melalui WhatsApp. Cukup kirim pesan dengan format: Jenis Kejadian, Lokasi, dan Foto.
                        </p>
                        <Button
                            asChild
                            className="w-full bg-[#25D366] text-white hover:bg-[#1DA851] rounded-xl gap-2"
                        >
                            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="h-4 w-4" />
                                Lapor via WhatsApp
                            </a>
                        </Button>
                    </div>

                    <div className="rounded-2xl border border-[#E5E7EB] bg-[#FFFBEB] p-6">
                        <h3 className="text-sm font-bold text-[#92400E] mb-2">Tips Melapor</h3>
                        <ul className="space-y-2 text-xs text-[#92400E]/80">
                            <li className="flex items-start gap-2">
                                <Camera className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                Ambil foto dari jarak aman
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                Sertakan lokasi kejadian
                            </li>
                            <li className="flex items-start gap-2">
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                Jangan membahayakan diri sendiri
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
