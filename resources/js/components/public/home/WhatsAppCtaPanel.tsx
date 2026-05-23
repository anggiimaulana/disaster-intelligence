import { Phone, MessageCircle, Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WhatsAppCtaPanel() {
    return (
        <section className="bg-white py-12 lg:py-16">
            <div className="mx-auto max-w-[1240px] px-4 lg:px-6">
                <div className="rounded-2xl bg-gradient-to-br from-[#25D366] to-[#1DA851] overflow-hidden">
                    <div className="p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                                <MessageCircle className="h-7 w-7 text-white" />
                            </div>
                            <div className="text-white">
                                <h2 className="text-xl lg:text-2xl font-bold mb-2">
                                    Lapor Bencana via WhatsApp
                                </h2>
                                <p className="text-sm text-white/80 leading-relaxed max-w-md">
                                    Kirim laporan bencana langsung melalui WhatsApp.
                                    Cukup kirim pesan ke nomor resmi BPBD dan tim kami akan segera merespons.
                                </p>
                                <div className="flex items-center gap-6 mt-4 text-sm text-white/70">
                                    <span className="flex items-center gap-1.5">
                                        <Send className="h-3.5 w-3.5" /> Kirim foto & lokasi
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5" /> Respon cepat
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button
                            asChild
                            className="shrink-0 bg-white text-[#1DA851] hover:bg-gray-100 font-bold rounded-xl px-8 h-12 text-base shadow-lg"
                        >
                            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="mr-2 h-5 w-5" />
                                Lapor via WhatsApp
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
