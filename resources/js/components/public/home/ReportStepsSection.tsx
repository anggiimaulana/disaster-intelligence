import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Smartphone, Camera, MapPin, Send, ShieldCheck, ArrowRight } from 'lucide-react';
import { laporBencana } from '@/routes';

const STEPS = [
    { step: 1, icon: MapPin, title: 'Tentukan Lokasi', desc: 'Pilih lokasi kejadian di peta atau ketik alamat' },
    { step: 2, icon: Camera, title: 'Ambil Foto', desc: 'Dokumentasikan kejadian dengan foto jika aman' },
    { step: 3, icon: Send, title: 'Kirim Laporan', desc: 'Isi detail kejadian dan kirim ke BPBD' },
    { step: 4, icon: ShieldCheck, title: 'Terverifikasi', desc: 'Petugas BPBD akan memverifikasi laporan Anda' },
];

export default function ReportStepsSection() {
    return (
        <section className="bg-white py-12 lg:py-16">
            <div className="mx-auto max-w-[1240px] px-4 lg:px-6">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="text-xl lg:text-2xl font-bold text-[#1F2937] mb-3">
                        Cara Melaporkan Bencana
                    </h2>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                        Laporkan kejadian bencana dengan cepat dan mudah melalui platform kami.
                        Ikuti langkah-langkah berikut:
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {STEPS.map(({ step, icon: Icon, title, desc }) => (
                        <div
                            key={step}
                            className="relative flex flex-col items-center text-center rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] p-6"
                        >
                            <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-[#003366] text-white text-xs font-bold flex items-center justify-center">
                                {step}
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#E0E7FF] flex items-center justify-center mb-4">
                                <Icon className="h-6 w-6 text-[#003366]" />
                            </div>
                            <h3 className="text-sm font-bold text-[#1F2937] mb-1">{title}</h3>
                            <p className="text-xs text-[#6B7280]">{desc}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Button
                        asChild
                        className="bg-[#003366] text-white hover:bg-[#002B5C] rounded-xl px-8"
                    >
                        <Link href={laporBencana()}>
                            Mulai Lapor Bencana
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#9CA3AF]">
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Atau laporkan melalui WhatsApp</span>
                </div>
            </div>
        </section>
    );
}
