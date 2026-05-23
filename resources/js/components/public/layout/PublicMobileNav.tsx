import { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavLink {
    href: string;
    label: string;
}

interface PublicMobileNavProps {
    open: boolean;
    onClose: () => void;
    links: MobileNavLink[];
}

export default function PublicMobileNav({ open, onClose, links }: PublicMobileNavProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}
            <div
                ref={panelRef}
                className={`fixed left-0 right-0 top-16 z-[1000] bg-white shadow-xl border-t border-[#E5E7EB] lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    open ? 'max-h-[480px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'
                }`}
            >
                <div className="px-6 py-4">
                    <nav className="flex flex-col gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onClose}
                                className="rounded-xl px-4 py-3.5 text-base font-medium text-[#4B5563] transition-colors hover:bg-[#F3F4F6] hover:text-[#003366] active:bg-[#E8EDF5]"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                        <Button
                            asChild
                            className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#1DA851] text-sm font-semibold rounded-xl h-11"
                        >
                            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                                <Phone className="h-4 w-4" />
                                Lapor via WhatsApp
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
