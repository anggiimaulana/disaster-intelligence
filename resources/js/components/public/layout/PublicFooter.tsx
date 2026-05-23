import { Link } from '@inertiajs/react';
import { MapPin, Phone, Mail, AlertTriangle } from 'lucide-react';
import {
    disasterMap,
    report,
    about,
    contact,
} from '@/routes/public';
import {
    alerts,
    faq,
    news,
    preparedness,
} from '@/routes/public/information';

interface PublicFooterProps {
    isSimulation?: boolean;
}

const FOOTER_LINKS = [
    {
        title: 'Layanan',
        links: [
            { label: 'Peta Bencana', href: disasterMap() },
            { label: 'Lapor Bencana', href: report() },
            { label: 'Peringatan Dini', href: alerts() },
            { label: 'Kesiapsiagaan', href: preparedness() },
        ],
    },
    {
        title: 'Informasi',
        links: [
            { label: 'Berita', href: news() },
            { label: 'FAQ', href: faq() },
            { label: 'Tentang Kami', href: about() },
            { label: 'Hubungi Kami', href: contact() },
        ],
    },
];

export default function PublicFooter({ isSimulation = true }: PublicFooterProps) {
    return (
        <footer className="bg-[#001A33] text-white">
            <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10 py-12 lg:py-16">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white text-xs font-bold">
                                BP
                            </div>
                            <div>
                                <p className="text-sm font-bold leading-tight">Disaster Intelligence</p>
                                <p className="text-[10px] leading-tight text-blue-200/70">
                                    BPBD Kabupaten Indramayu
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-blue-200/70 leading-relaxed mb-4 max-w-xs">
                            Sistem Informasi Bencana berbasis AI untuk deteksi dini, pelaporan, dan
                            pemantauan bencana di Kabupaten Indramayu.
                        </p>
                        {isSimulation && (
                            <div className="flex items-center gap-2 text-xs text-blue-300 bg-blue-400/10 rounded-lg px-3 py-2 w-fit">
                                <AlertTriangle className="h-3 w-3 shrink-0" />
                                <span>Data Prototype — Informasi tidak langsung dari sistem sebenarnya</span>
                            </div>
                        )}
                    </div>

                    {FOOTER_LINKS.map((group) => (
                        <div key={group.title}>
                            <h4 className="text-sm font-semibold mb-3">{group.title}</h4>
                            <ul className="space-y-2">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-blue-200/70 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div>
                        <h4 className="text-sm font-semibold mb-3">Kontak</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2.5 text-sm text-blue-200/70">
                                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-blue-300" />
                                <span>Jl. Letnan Jenderal Soeprapto No. 1, Indramayu</span>
                            </li>
                            <li className="flex items-center gap-2.5 text-sm text-blue-200/70">
                                <Phone className="h-4 w-4 shrink-0 text-blue-300" />
                                <span>(0234) XXXXX</span>
                            </li>
                            <li className="flex items-center gap-2.5 text-sm text-blue-200/70">
                                <Mail className="h-4 w-4 shrink-0 text-blue-300" />
                                <span>bpbd@indramayukab.go.id</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-blue-300/50">
                    &copy; {new Date().getFullYear()} BPBD Kabupaten Indramayu. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
