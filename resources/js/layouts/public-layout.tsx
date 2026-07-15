import { type ReactNode, useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import PublicHeader from '@/components/public/layout/PublicHeader';
import PublicFooter from '@/components/public/layout/PublicFooter';
import SimulationBanner from '@/components/public/layout/SimulationBanner';

interface PublicLayoutProps {
    children?: ReactNode;
    overlayHeader?: boolean;
    isSimulation?: boolean;
}

export default function PublicLayout({ children, overlayHeader, isSimulation = true }: PublicLayoutProps) {
    const { component } = usePage();
    const resolvedOverlayHeader = overlayHeader ?? (component === 'public/home');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-white font-sans text-[#1F2937]">
            {isSimulation && <SimulationBanner />}
            <PublicHeader overlayHeader={resolvedOverlayHeader} scrolled={scrolled} />
            <main className="flex-1">{children}</main>
            <PublicFooter isSimulation={isSimulation} />
        </div>
    );
}
