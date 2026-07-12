import { useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileNavLink {
    href: React.ComponentProps<typeof Link>['href'];
    url: string;
    label: string;
}

interface PublicMobileNavProps {
    open: boolean;
    onClose: () => void;
    links: MobileNavLink[];
}

function isLinkActive(currentUrl: string, linkUrl: string): boolean {
    if (linkUrl === '/public') return currentUrl === '/public' || currentUrl === '/';
    if (linkUrl === '/') return currentUrl === '/';
    return currentUrl === linkUrl || currentUrl.startsWith(linkUrl + '/') || currentUrl.startsWith(linkUrl);
}

export default function PublicMobileNav({ open, onClose, links }: PublicMobileNavProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const { url } = usePage();

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    return (
        <>
            <div
                aria-hidden
                onClick={onClose}
                className={cn(
                    'fixed inset-x-0 top-16 bottom-0 z-[998] bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300',
                    open ? 'opacity-100' : 'opacity-0 pointer-events-none',
                )}
            />
            <div
                id="public-mobile-nav"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Menu navigasi"
                className={cn(
                    'fixed inset-x-0 top-16 z-[999] lg:hidden bg-white shadow-2xl border-b border-premium-border origin-top',
                    'transition-all duration-300 ease-out',
                    open
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-3 pointer-events-none',
                )}
            >
                <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
                    <nav className="flex flex-col gap-1">
                        {links.map((link) => {
                            const isActive = isLinkActive(url, link.url);
                            return (
                                <Link
                                    key={link.url}
                                    href={link.href}
                                    onClick={onClose}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={cn(
                                        'flex items-center justify-between rounded-xl px-4 py-3.5 text-base transition-colors',
                                        isActive
                                            ? 'bg-premium-blue-accent/10 text-premium-blue-accent font-semibold'
                                            : 'text-premium-heading font-medium hover:bg-premium-bg active:bg-premium-border',
                                    )}
                                >
                                    <span>{link.label}</span>
                                    {isActive && (
                                        <span aria-hidden className="h-2 w-2 rounded-full bg-premium-blue-accent" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="mt-4 pt-4 border-t border-premium-border">
                        <Button
                            asChild
                            className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#1DA851] text-sm font-semibold rounded-xl h-12"
                        >
                            <a
                                href="https://wa.me/6285647075733"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Phone className="h-4 w-4" />
                                Lapor via WhatsApp
                            </a>
                        </Button>
                        <p className="mt-3 text-center text-xs text-premium-caption">
                            BPBD Kabupaten Indramayu
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
