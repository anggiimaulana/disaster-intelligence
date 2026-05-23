import { useState, type FormEvent } from 'react';
import { Head, Link } from '@inertiajs/react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, MapPin, Phone, Mail, Clock, MessageCircle, Send, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { home } from '@/routes';
import type { PageProps } from '@/types';

interface ContactPageProps extends PageProps {
    isSimulation?: boolean;
}

const CONTACT_CHANNELS = [
    { icon: MapPin, label: 'Alamat', value: 'Jl. Letnan Jenderal Soeprapto No. 1, Indramayu, Jawa Barat 45213', href: null },
    { icon: Phone, label: 'Telepon', value: '(0234) XXXXX', href: 'tel:620234000000' },
    { icon: Mail, label: 'Email', value: 'bpbd@indramayukab.go.id', href: 'mailto:bpbd@indramayukab.go.id' },
    { icon: Clock, label: 'Jam Operasional', value: 'Senin - Jumat, 07:30 - 16:00 WIB', href: null },
    { icon: MessageCircle, label: 'WhatsApp', value: '0812-3456-7890', href: 'https://wa.me/6281234567890' },
];

const BPBD_LOCATION: [number, number] = [-6.330, 108.322];

export default function ContactPage({}: ContactPageProps) {
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [pesan, setPesan] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <>
            <Head title="Kontak - Disaster Intelligence" />
            <div>
            <div className="relative bg-gradient-to-br from-[#001a33] via-[#00264d] to-[#003366] overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400 blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-cyan-400 blur-3xl" />
                </div>
                <div className="relative mx-auto max-w-[1240px] px-4 lg:px-6 py-12 lg:py-16">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-1 text-sm text-blue-300 hover:text-blue-200 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Beranda
                    </Link>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Building className="h-5 w-5 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-blue-300">Kontak Resmi</span>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3">Hubungi Kami</h1>
                    <p className="text-sm text-blue-200/80 max-w-2xl leading-relaxed">
                        Hubungi BPBD Kabupaten Indramayu melalui kanal komunikasi resmi yang tersedia.
                        Kami siap membantu 24 jam untuk tanggap darurat bencana.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-[1240px] px-4 lg:px-6 py-10 lg:py-14">
                <div className="grid lg:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-[#1F2937] mb-3">Informasi Kontak</h2>
                        {CONTACT_CHANNELS.map(({ icon: Icon, label, value, href }) => (
                            <div
                                key={label}
                                className="flex items-start gap-4 rounded-xl border border-[#E5E7EB] bg-white p-5 hover:shadow-sm transition-shadow"
                            >
                                <div className="shrink-0 w-10 h-10 rounded-xl bg-[#E0E7FF] flex items-center justify-center">
                                    <Icon className="h-5 w-5 text-[#003366]" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-[#6B7280] mb-0.5">{label}</p>
                                    {href ? (
                                        <a
                                            href={href}
                                            target={href.startsWith('http') ? '_blank' : undefined}
                                            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            className="text-sm font-medium text-[#003366] hover:text-[#002B5C] transition-colors"
                                        >
                                            {value}
                                        </a>
                                    ) : (
                                        <p className="text-sm font-medium text-[#1F2937]">{value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-[#1F2937] mb-3">Kirim Pesan</h2>
                        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 lg:p-8">
                            {submitted ? (
                                <div className="text-center py-8">
                                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                        <Send className="h-7 w-7 text-green-600" />
                                    </div>
                                    <h3 className="text-base font-bold text-[#1F2937] mb-1">Pesan Terkirim!</h3>
                                    <p className="text-sm text-[#6B7280]">Tim kami akan membalas pesan Anda segera.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Nama</label>
                                        <input
                                            type="text"
                                            value={nama}
                                            onChange={(e) => setNama(e.target.value)}
                                            required
                                            placeholder="Nama lengkap"
                                            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="email@contoh.com"
                                            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Pesan</label>
                                        <textarea
                                            value={pesan}
                                            onChange={(e) => setPesan(e.target.value)}
                                            required
                                            rows={4}
                                            placeholder="Tulis pesan Anda..."
                                            className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] resize-y"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full bg-[#003366] text-white hover:bg-[#002B5C] rounded-xl py-2.5">
                                        <Send className="h-4 w-4 mr-2" />
                                        Kirim Pesan
                                    </Button>
                                </form>
                            )}
                        </div>

                        <div className="mt-4">
                            <Button
                                asChild
                                className="w-full bg-[#25D366] text-white hover:bg-[#1DA851] rounded-xl gap-2 py-2.5"
                            >
                                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="h-4 w-4" />
                                    Hubungi via WhatsApp
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-[#1F2937] mb-4">Lokasi Kantor BPBD Indramayu</h2>
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
                        <div className="h-[300px] lg:h-[400px] w-full">
                            <MapContainer
                                center={BPBD_LOCATION}
                                zoom={15}
                                className="h-full w-full"
                                zoomControl={true}
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <CircleMarker center={BPBD_LOCATION} radius={10} fillColor="#003366" fillOpacity={0.85} color="#ffffff" weight={3}>
                                    <Popup>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-slate-900">BPBD Kab. Indramayu</p>
                                            <p className="text-xs text-slate-600">Jl. Letnan Jenderal Soeprapto No. 1</p>
                                            <p className="text-[11px] text-slate-400">Indramayu, Jawa Barat 45213</p>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
