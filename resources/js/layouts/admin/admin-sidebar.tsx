import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Bell, Brain, CheckSquare, ChevronDown, Database, LayoutDashboard, LogOut, Settings, Shield, User } from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: '/cms/dashboard', icon: LayoutDashboard },
    { label: 'Data Kejadian', href: '/cms/incidents', icon: Database },
    { label: 'Analisis AI', href: '/cms/analysis', icon: Brain },
    { label: 'Validasi Laporan', href: '/cms/validation', icon: CheckSquare },
    { label: 'Peringatan Dini', href: '/cms/alerts', icon: Bell },
    { label: 'Pengaturan', href: '/cms/settings/system', icon: Settings },
];

interface AdminSidebarProps {
    open: boolean;
    onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
    const { url } = usePage();
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <>
            {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
            <aside className={cn('fixed inset-y-0 left-0 z-40 flex w-[210px] flex-col bg-[#1a2332] transition-transform duration-300', !open && '-translate-x-full')}>
                {/* Logo */}
                <div className="flex flex-col items-center gap-0.5 px-4 py-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600/20">
                        <Shield className="h-5 w-5 text-blue-400" />
                    </div>
                    <span className="mt-1 text-sm font-bold tracking-wider text-white">DISASTER</span>
                    <span className="text-sm font-bold text-blue-400">INTELLIGENCE</span>
                    <span className="text-xs text-slate-500">Crowdsourced Data + AI</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = 
                        (item.href === '/cms/analysis' && url.includes('/cms/analysis')) ||
                        (item.href !== '/cms/analysis' && item.href === '/cms/dashboard' && url === '/cms/dashboard') ||
                        (item.href !== '/cms/analysis' && item.href !== '/cms/dashboard' && url.startsWith(item.href) && !url.includes('/cms/analysis'));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                    isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="relative border-t border-white/5 px-4 py-3">
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex w-full items-center gap-2 rounded-lg px-1 py-1 hover:bg-white/5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white">AD</div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-white">Admin BPBD</p>
                            <p className="text-xs text-slate-500">Administrator</p>
                        </div>
                        <ChevronDown className={cn('h-3.5 w-3.5 text-slate-500 transition-transform', userMenuOpen && 'rotate-180')} />
                    </button>
                    {userMenuOpen && (
                        <div className="absolute bottom-full left-3 right-3 mb-1 rounded-lg border border-slate-700 bg-[#243044] py-1 shadow-xl">
                            <Link href="/cms/settings/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5" onClick={() => setUserMenuOpen(false)}><User className="h-4 w-4" /> Profil Saya</Link>
                            <Link href="/cms/settings/system" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5" onClick={() => setUserMenuOpen(false)}><Settings className="h-4 w-4" /> Pengaturan</Link>
                            <div className="my-1 border-t border-slate-700" />
                            <Link href="/logout" method="post" as="button" className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10" onClick={() => setUserMenuOpen(false)}><LogOut className="h-4 w-4" /> Keluar</Link>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
