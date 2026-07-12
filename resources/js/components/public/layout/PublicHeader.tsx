import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import { disasterMap, information, about, contact } from '@/routes/public';
import { laporBencana } from '@/routes';
import PublicMobileNav from './PublicMobileNav';

const NAV_LINKS = [
    { href: home(), url: home.url(), label: 'Beranda' },
    { href: disasterMap(), url: disasterMap.url(), label: 'Peta Bencana' },
    { href: laporBencana(), url: laporBencana.url(), label: 'Lapor Bencana' },
    { href: '/public/lacak-laporan', url: '/public/lacak-laporan', label: 'Lacak Laporan' },
    { href: information(), url: information.url(), label: 'Informasi' },
    { href: about(), url: about.url(), label: 'Tentang' },
    { href: contact(), url: contact.url(), label: 'Kontak' },
];

interface PublicHeaderProps {
    overlayHeader: boolean;
    scrolled: boolean;
}

function isLinkActive(currentUrl: string, linkUrl: string): boolean {
    if (linkUrl === '/public') return currentUrl === '/public' || currentUrl === '/';
    if (linkUrl === '/') return currentUrl === '/';
    return currentUrl === linkUrl || currentUrl.startsWith(linkUrl + '/') || currentUrl.startsWith(linkUrl);
}

export default function PublicHeader({ overlayHeader, scrolled }: PublicHeaderProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { url } = usePage();
    const isTransparent = overlayHeader && !scrolled;

    return (
        <>
            <header
                className={cn(
                    'sticky top-0 z-[1000] w-full transition-all duration-300 border-b',
                    isTransparent
                        ? 'bg-transparent border-transparent'
                        : 'bg-white/95 backdrop-blur-md shadow-sm border-premium-border',
                )}
            >
                <div className="mx-auto flex h-16 lg:h-22 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
                    <Link href={home()} className="flex items-center gap-2.5 sm:gap-3 min-w-0 group">
                        <img
                            src="/icon.png"
                            alt="BPBD"
                            className="h-9 w-9 lg:h-10 lg:w-10 rounded-xl object-cover transition-transform group-hover:scale-105 shadow-sm shrink-0"
                        />
                        <div className="min-w-0">
                            <p
                                className={cn(
                                    'text-[15px] lg:text-base font-bold leading-tight truncate font-heading transition-colors',
                                    isTransparent ? 'text-white drop-shadow' : 'text-premium-navy',
                                )}
                            >
                                Disaster Intelligence
                            </p>
                            <p
                                className={cn(
                                    'hidden lg:block text-[11px] font-medium leading-tight transition-colors',
                                    isTransparent ? 'text-white/80' : 'text-premium-caption',
                                )}
                            >
                                BPBD Kabupaten Indramayu
                            </p>
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV_LINKS.map((link) => {
                            const isActive = isLinkActive(url, link.url);
                            return (
                                <Link
                                    key={link.url}
                                    href={link.href}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={cn(
                                        'relative rounded-full px-4 py-2 text-sm transition-colors group',
                                        isActive
                                            ? isTransparent
                                                ? 'text-white font-semibold bg-white/15'
                                                : 'text-premium-blue-accent font-semibold bg-premium-blue-accent/10'
                                            : isTransparent
                                              ? 'text-white/85 hover:text-white font-medium'
                                              : 'text-premium-body hover:text-premium-blue-hover font-medium hover:bg-premium-bg',
                                    )}
                                >
                                    {link.label}
                                    <span
                                        aria-hidden
                                        className={cn(
                                            'absolute left-1/2 -translate-x-1/2 bottom-0.5 h-[2px] rounded-full transition-all duration-300',
                                            isTransparent ? 'bg-white' : 'bg-premium-blue-accent',
                                            isActive
                                                ? 'w-6 opacity-100'
                                                : 'w-0 opacity-0 group-hover:w-6 group-hover:opacity-100',
                                        )}
                                    />
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button
                            asChild
                            className="hidden sm:inline-flex h-10 lg:h-11 gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] shadow-sm hover:-translate-y-0.5 transition-all duration-300 text-sm font-semibold rounded-full px-5 lg:px-6 border-0"
                        >
                            <a href="https://wa.me/6285647075733" target="_blank" rel="noopener noreferrer">
                                <Phone className="h-4 w-4" />
                                <span className="hidden md:inline">Lapor via WhatsApp</span>
                                <span className="md:hidden">WhatsApp</span>
                            </a>
                        </Button>

                        <button
                            type="button"
                            onClick={() => setMobileOpen((prev) => !prev)}
                            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                            aria-expanded={mobileOpen}
                            aria-controls="public-mobile-nav"
                            className={cn(
                                'relative inline-flex lg:hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                                isTransparent
                                    ? 'bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white'
                                    : 'bg-premium-bg hover:bg-premium-border text-premium-navy',
                            )}
                        >
                            <span className="sr-only">{mobileOpen ? 'Tutup menu' : 'Buka menu'}</span>
                            <span aria-hidden className="relative block h-3.5 w-5">
                                <span
                                    className={cn(
                                        'absolute left-0 right-0 h-[2px] rounded-full bg-current transition-all duration-300 ease-out',
                                        mobileOpen
                                            ? 'top-1/2 -translate-y-1/2 rotate-45'
                                            : 'top-0 translate-y-0 rotate-0',
                                    )}
                                />
                                <span
                                    className={cn(
                                        'absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] rounded-full bg-current transition-all duration-300 ease-out',
                                        mobileOpen
                                            ? 'opacity-0 scale-x-0'
                                            : 'opacity-100 scale-x-100',
                                    )}
                                />
                                <span
                                    className={cn(
                                        'absolute left-0 right-0 h-[2px] rounded-full bg-current transition-all duration-300 ease-out',
                                        mobileOpen
                                            ? 'top-1/2 -translate-y-1/2 -rotate-45'
                                            : 'bottom-0 translate-y-0 rotate-0',
                                    )}
                                />
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            <PublicMobileNav
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                links={NAV_LINKS.map(({ href, url, label }) => ({ href, url, label }))}
            />
        </>
    );
}
