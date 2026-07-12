import { useState, type FormEvent, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Search, CheckCircle2, Clock, ShieldCheck, MapPin, AlertCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EthicalHero } from '@/components/ui/hero-ethical';
import { home } from '@/routes';
import type { PageProps } from '@/types';

interface TrackingPageProps extends PageProps {
    isSimulation?: boolean;
    searchId?: string;
}

// Mock data for tracking
const getMockData = (id: string) => {
    if (!id || id.length < 5) return null;
    
    // Simulate found report
    return {
        id: id.toUpperCase(),
        date: '14 Okt 2023, 10:30 WIB',
        type: 'Banjir Rob',
        location: 'Kec. Kandanghaur, Desa Eretan Wetan',
        reporter: 'Ahmad M.',
        status: 'Diproses', // Diterima, Diproses, Selesai
        officer: 'Tim Reaksi Cepat (TRC) Regu 2',
        timeline: [
            {
                status: 'Diterima',
                date: '14 Okt 2023, 10:30 WIB',
                description: 'Laporan telah diterima oleh sistem dan masuk ke antrean verifikasi.',
                completed: true
            },
            {
                status: 'Diverifikasi AI',
                date: '14 Okt 2023, 10:32 WIB',
                description: 'Foto bukti divalidasi oleh sistem Computer Vision (Validitas 98%).',
                completed: true
            },
            {
                status: 'Diproses',
                date: '14 Okt 2023, 10:45 WIB',
                description: 'Tim TRC Regu 2 sedang menuju ke lokasi kejadian.',
                completed: true
            },
            {
                status: 'Penanganan',
                date: 'Estimasi: 11:30 WIB',
                description: 'Proses evakuasi dan penanganan di lokasi bencana.',
                completed: false
            },
            {
                status: 'Selesai',
                date: '-',
                description: 'Laporan ditutup dan penanganan selesai.',
                completed: false
            }
        ]
    };
};

export default function TrackingPage({ searchId = '' }: TrackingPageProps) {
    const [idInput, setIdInput] = useState(searchId || '');
    const [report, setReport] = useState<any>(null);
    const [searched, setSearched] = useState(!!searchId);

    useEffect(() => {
        if (searchId) {
            setReport(getMockData(searchId));
            setSearched(true);
        }
    }, [searchId]);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (!idInput.trim()) return;
        
        // Update URL without full reload using Inertia
        router.get('/public/lacak-laporan', { id: idInput }, { preserveState: true });
    };

    return (
        <>
            <Head title="Lacak Laporan - Disaster Intelligence" />
            <EthicalHero
                kicker="Layanan Pelacakan"
                title={
                    <>
                        Lacak Status{' '}
                        <span className="text-premium-blue-accent">Laporan</span> Anda
                    </>
                }
                subtitle="Masukkan ID Laporan untuk memantau proses penanganan kejadian secara real-time. ID dikirimkan setelah Anda mengirim laporan."
                compact
            />

            <div className="bg-premium-bg pb-16">
                <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-10">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-2 text-sm font-medium text-premium-body hover:text-premium-blue-hover transition-colors mb-6 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Beranda
                    </Link>

                    {/* Header & Search */}
                    <div className={`transition-all duration-500 ease-in-out ${searched ? 'mb-10' : 'mb-10'}`}>
                        <form onSubmit={handleSearch} className={`relative ${searched ? 'max-w-md' : 'max-w-xl'}`}>
                            <input
                                type="text"
                                value={idInput}
                                onChange={(e) => setIdInput(e.target.value)}
                                placeholder="ID Laporan Anda..."
                                className="w-full h-14 pl-14 pr-32 rounded-[18px] border border-premium-border bg-white text-base text-premium-heading placeholder:text-premium-caption focus:outline-none focus:ring-2 focus:ring-premium-blue-accent/30 focus:border-premium-blue-accent transition-all shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-premium-caption" />
                            <Button type="submit" className="absolute right-1.5 top-1.5 h-11 px-6 rounded-[14px] bg-gradient-to-r from-premium-navy to-premium-navy-dark hover:opacity-90 text-white font-bold transition-opacity">
                                Lacak
                            </Button>
                        </form>
                        {!searched && (
                            <p className="mt-3 text-xs text-premium-caption">
                                Contoh ID: <span className="font-mono text-premium-body">LAP-2023-001</span>
                            </p>
                        )}
                    </div>

                    {/* Results Area */}
                    {searched && (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                            {report ? (
                                <div className="grid lg:grid-cols-3 gap-8">
                                    {/* Left Panel: Report Details */}
                                    <div className="lg:col-span-1 space-y-6">
                                        <div className="bg-white rounded-[24px] p-6 border border-premium-border shadow-[0_15px_40px_rgba(15,23,42,0.04)] relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full pointer-events-none"></div>
                                            <div className="mb-4">
                                                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-premium-blue-accent text-xs font-bold uppercase tracking-wider mb-2">
                                                    ID: {report.id}
                                                </span>
                                                <h3 className="text-xl font-bold text-premium-heading font-heading">{report.type}</h3>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="h-5 w-5 text-premium-caption shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-bold text-premium-heading uppercase tracking-wider mb-0.5">Lokasi</p>
                                                        <p className="text-sm text-premium-body">{report.location}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Clock className="h-5 w-5 text-premium-caption shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-bold text-premium-heading uppercase tracking-wider mb-0.5">Waktu Laporan</p>
                                                        <p className="text-sm text-premium-body">{report.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <ShieldCheck className="h-5 w-5 text-premium-caption shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-bold text-premium-heading uppercase tracking-wider mb-0.5">Petugas Menangani</p>
                                                        <p className="text-sm text-premium-body">{report.officer}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-[#25D366]/10 to-transparent border border-[#25D366]/20 rounded-[24px] p-6 text-center">
                                            <Phone className="h-8 w-8 text-[#25D366] mx-auto mb-3" />
                                            <h4 className="text-sm font-bold text-premium-heading mb-1">Ada Info Tambahan?</h4>
                                            <p className="text-xs text-premium-body mb-4">Hubungi pusat panggilan atau WhatsApp kami.</p>
                                            <Button asChild className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white rounded-[14px]">
                                                <a href="https://wa.me/6285647075733" target="_blank" rel="noopener noreferrer">Hubungi Petugas</a>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Right Panel: Timeline */}
                                    <div className="lg:col-span-2 bg-white rounded-[32px] p-8 lg:p-10 border border-premium-border shadow-[0_15px_40px_rgba(15,23,42,0.04)]">
                                        <h3 className="text-lg font-bold text-premium-heading font-heading mb-8">Timeline Penanganan</h3>
                                        
                                        <div className="relative pl-6 lg:pl-8">
                                            {/* Vertical Line */}
                                            <div className="absolute left-[11px] lg:left-[15px] top-4 bottom-8 w-0.5 bg-gray-100 rounded-full"></div>
                                            
                                            <div className="space-y-10">
                                                {report.timeline.map((step: any, idx: number) => {
                                                    const isLast = idx === report.timeline.length - 1;
                                                    return (
                                                        <div key={idx} className="relative">
                                                            {/* Bullet */}
                                                            <div className={`absolute -left-6 lg:-left-8 w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${step.completed ? 'bg-premium-success text-white' : 'bg-gray-200'}`}>
                                                                {step.completed && <CheckCircle2 className="h-3 w-3" />}
                                                            </div>
                                                            
                                                            <div className={`pt-0.5 ${!step.completed ? 'opacity-50' : ''}`}>
                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                                                                    <h4 className="text-base font-bold text-premium-heading">{step.status}</h4>
                                                                    <span className="text-xs font-semibold text-premium-caption bg-gray-50 px-2 py-0.5 rounded-md">{step.date}</span>
                                                                </div>
                                                                <p className="text-sm text-premium-body leading-relaxed">{step.description}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Not Found */
                                <div className="bg-white rounded-[32px] border border-premium-border shadow-sm p-12 text-center max-w-2xl mx-auto">
                                    <div className="w-20 h-20 bg-premium-danger/10 text-premium-danger rounded-[24px] flex items-center justify-center mx-auto mb-6">
                                        <AlertCircle className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-premium-heading font-heading mb-2">Laporan Tidak Ditemukan</h3>
                                    <p className="text-base text-premium-body mb-6">
                                        Kami tidak dapat menemukan laporan dengan ID <strong className="text-premium-heading">"{searchId}"</strong>. Pastikan ID yang Anda masukkan sudah benar.
                                    </p>
                                    <Button onClick={() => {setIdInput(''); setSearched(false);}} className="bg-premium-navy text-white rounded-[16px] h-12 px-8 shadow-md">
                                        Coba Cari Lagi
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
