import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { home } from '@/routes';
import { disasterMap, report, information, about, contact } from '@/routes/public';
import PublicMobileNav from './PublicMobileNav';

const NAV_LINKS = [
    { href: home(), label: 'Beranda' },
    { href: disasterMap(), label: 'Peta Bencana' },
    { href: report(), label: 'Lapor Bencana' },
    { href: information(), label: 'Informasi' },
    { href: about(), label: 'Tentang' },
    { href: contact(), label: 'Kontak' },
];

interface PublicHeaderProps {
    overlayHeader: boolean;
    scrolled: boolean;
}

export default function PublicHeader({ overlayHeader, scrolled }: PublicHeaderProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <header
                className={`sticky top-0 z-[1000] w-full transition-all duration-300 ${
                    overlayHeader && !scrolled
                        ? 'bg-white/80 backdrop-blur-md shadow-sm'
                        : 'bg-white shadow-sm'
                }`}
            >
                <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6 lg:px-10">
                    <Link href={home()} className="flex items-center gap-2.5 shrink-0">
                        <img src="/logo.webp" alt="BPBD" className="h-9 w-9 rounded-lg object-cover" />
                        <div>
                            <p className="text-sm font-bold leading-tight text-[#003366]">
                                Disaster Intelligence
                            </p>
                            <p className="text-[10px] leading-tight text-[#6B7280] hidden xs:block">
                                BPBD Kabupaten Indramayu
                            </p>
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-[#4B5563] transition-colors hover:bg-[#F3F4F6] hover:text-[#003366]"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            className="hidden sm:inline-flex h-9 gap-2 bg-[#25D366] text-white hover:bg-[#1DA851] text-sm font-semibold rounded-lg px-4"
                        >
                            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                                <Phone className="h-4 w-4" />
                                Lapor via WhatsApp
                            </a>
                        </Button>

                        <button
                            onClick={() => setMobileOpen((prev) => !prev)}
                            className="inline-flex lg:hidden h-9 w-9 items-center justify-center rounded-lg text-[#4B5563] hover:bg-[#F3F4F6]"
                            aria-label="Buka menu navigasi"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            <PublicMobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} links={NAV_LINKS} />
        </>
    );
}
