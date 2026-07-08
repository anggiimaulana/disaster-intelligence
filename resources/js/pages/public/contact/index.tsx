import { useState, useEffect, lazy, Suspense, type FormEvent } from 'react';
import { Head } from '@inertiajs/react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EthicalHero } from '@/components/ui/hero-ethical';
import type { PageProps } from '@/types';

const ContactMapClient = lazy(() => import('./ContactMapClient'));

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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <>
            <Head title="Kontak - Disaster Intelligence" />
            <EthicalHero
                kicker="Kontak Resmi"
                title={
                    <>
                        Hubungi{' '}
                        <span className="text-premium-blue-accent">BPBD</span> Indramayu
                    </>
                }
                subtitle="Kanal komunikasi resmi BPBD Kabupaten Indramayu. Tim kami siaga 24 jam untuk tanggap darurat bencana."
            />
            <div className="bg-premium-bg min-h-screen pb-20">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 mt-4 lg:mt-8 relative z-20">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
                        
                        {/* LEFT COLUMN: Contact Info */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-premium-heading mb-6 font-heading">Informasi Kontak</h2>
                            <div className="grid gap-4">
                                {CONTACT_CHANNELS.map(({ icon: Icon, label, value, href }) => (
                                    <div
                                        key={label}
                                        className="flex items-center gap-5 rounded-[24px] border border-premium-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow group"
                                    >
                                        <div className="shrink-0 w-12 h-12 rounded-[16px] bg-premium-bg flex items-center justify-center group-hover:bg-premium-blue-accent/10 transition-colors">
                                            <Icon className="h-6 w-6 text-premium-navy group-hover:text-premium-blue-accent transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-premium-caption mb-1 uppercase tracking-wider">{label}</p>
                                            {href ? (
                                                <a
                                                    href={href}
                                                    target={href.startsWith('http') ? '_blank' : undefined}
                                                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                    className="text-base font-bold text-premium-heading hover:text-premium-blue-accent transition-colors"
                                                >
                                                    {value}
                                                </a>
                                            ) : (
                                                <p className="text-base font-bold text-premium-heading">{value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Contact Form */}
                        <div className="bg-white rounded-[32px] border border-premium-border p-8 lg:p-10 shadow-[0_15px_40px_rgba(15,23,42,0.04)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-premium-blue-accent/5 rounded-bl-full pointer-events-none"></div>
                            <h2 className="text-2xl font-bold text-premium-heading mb-8 font-heading">Kirim Pesan</h2>
                            
                            {submitted ? (
                                <div className="text-center py-10 animate-in zoom-in-95 duration-500">
                                    <div className="w-20 h-20 rounded-full bg-premium-success/10 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="h-10 w-10 text-premium-success" />
                                    </div>
                                    <h3 className="text-xl font-bold text-premium-heading mb-3 font-heading">Pesan Terkirim!</h3>
                                    <p className="text-sm text-premium-body leading-relaxed mb-6">Tim kami akan membalas pesan Anda segera melalui email.</p>
                                    <Button
                                        onClick={() => setSubmitted(false)}
                                        variant="outline"
                                        className="h-12 px-6 rounded-[14px] font-bold text-premium-body hover:bg-premium-bg hover:text-premium-heading transition-colors border-premium-border"
                                    >
                                        Kirim Pesan Lain
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
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
                                    <div>
                                        <label className="block text-sm font-bold text-premium-heading mb-2">Alamat Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="email@contoh.com"
                                            className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading placeholder:text-premium-caption focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-premium-heading mb-2">Pesan</label>
                                        <textarea
                                            value={pesan}
                                            onChange={(e) => setPesan(e.target.value)}
                                            required
                                            rows={5}
                                            placeholder="Tulis pesan atau pertanyaan Anda di sini..."
                                            className="w-full rounded-[16px] border border-premium-border bg-premium-bg/50 px-5 py-3.5 text-sm text-premium-heading placeholder:text-premium-caption focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-sm resize-y"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full h-14 bg-gradient-to-r from-premium-navy to-premium-navy-dark hover:opacity-90 text-white rounded-[18px] text-base font-bold shadow-[0_10px_25px_rgba(11,42,82,0.25)] hover:shadow-[0_15px_35px_rgba(11,42,82,0.35)] hover:-translate-y-0.5 transition-all duration-300">
                                        <Send className="h-5 w-5 mr-2" />
                                        Kirim Pesan
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* LOCATION MAP */}
                    <div>
                        <h2 className="text-2xl font-bold text-premium-heading mb-8 font-heading">Lokasi Kantor BPBD Indramayu</h2>
                        <div className="rounded-[32px] border-4 border-white bg-premium-border overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                            <div className="h-[400px] lg:h-[500px] w-full relative z-0">
                                {isMounted && (
                                    <Suspense fallback={<div className="flex h-full w-full items-center justify-center text-sm text-gray-500">Memuat peta...</div>}>
                                        <ContactMapClient location={BPBD_LOCATION} />
                                    </Suspense>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
