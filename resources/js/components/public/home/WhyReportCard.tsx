import { ShieldCheck, Bell, HeartHandshake, RefreshCw } from 'lucide-react';

const REASONS = [
    { icon: Bell, title: 'Respons Cepat', desc: 'Laporan Anda langsung diterima petugas BPBD untuk tindak lanjut.' },
    { icon: ShieldCheck, title: 'Akurat & Terpercaya', desc: 'Setiap laporan diverifikasi oleh petugas sebelum dipublikasikan.' },
    { icon: HeartHandshake, title: 'Gotong Royong', desc: 'Bersama-sama kita ciptakan lingkungan yang lebih aman.' },
    { icon: RefreshCw, title: 'Transparan', desc: 'Pantau status laporan Anda secara real-time.' },
];

export default function WhyReportCard() {
    return (
        <section className="bg-[#003366] py-12 lg:py-16">
            <div className="mx-auto max-w-[1240px] px-4 lg:px-6">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="text-xl lg:text-2xl font-bold text-white mb-3">
                        Kenapa Harus Melapor?
                    </h2>
                    <p className="text-sm text-blue-200/70 leading-relaxed">
                        Partisipasi Anda sangat berarti dalam penanggulangan bencana
                        di Kabupaten Indramayu.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {REASONS.map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center"
                        >
                            <div className="w-12 h-12 rounded-xl bg-cyan-400/20 flex items-center justify-center mx-auto mb-4">
                                <Icon className="h-6 w-6 text-cyan-300" />
                            </div>
                            <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                            <p className="text-xs text-blue-200/70">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
