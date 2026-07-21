import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    Bell,
    Brain,
    CheckSquare,
    ChevronDown,
    Database,
    FileText,
    Globe,
    LayoutDashboard,
    LogOut,
    MapPin,
    Megaphone,
    Newspaper,
    Settings,
    Shield,
    Tag,
    User,
    HelpCircle,
    Image,
} from 'lucide-react';

interface NavItem {
    label: string;
    href?: string;
    icon: any;
    permission?: string;
    subItems?: { label: string; href: string }[];
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

const navGroups: NavGroup[] = [
    {
        title: '',
        items: [
            { label: 'Dashboard', href: '/cms/dashboard', icon: LayoutDashboard },
            { label: 'Data Kejadian', href: '/cms/incidents', icon: Database, permission: 'manage incidents' },
            { label: 'Analisis AI', href: '/cms/analysis', icon: Brain, permission: 'manage analysis' },
            { label: 'Validasi Laporan', href: '/cms/validation', icon: CheckSquare, permission: 'manage validation' },
        ],
    },
    {
        title: 'Konten Publik',
        items: [
            { label: 'Peringatan Dini', href: '/cms/alerts', icon: Bell, permission: 'manage alerts' },
            { label: 'Berita', href: '/cms/berita', icon: Newspaper, permission: 'manage news' },
            { label: 'Kesiapsiagaan', href: '/cms/kesiapsiagaan', icon: Shield, permission: 'manage preparedness' },
            { label: 'FAQ', href: '/cms/faq', icon: HelpCircle, permission: 'manage faq' },
        ],
    },
    {
        title: 'Data Master',
        items: [
            { label: 'Jenis Bencana', href: '/cms/disaster-types', icon: Tag },
            { label: 'Wilayah', href: '/cms/regencies', icon: MapPin },
            { label: 'Media Library', href: '/cms/media', icon: Image },
        ],
    },
    {
        title: 'Sistem',
        items: [
            { label: 'Audit Log', href: '/cms/settings/log', icon: FileText, permission: 'manage settings' },
            {
                label: 'Pengaturan',
                icon: Settings,
                permission: 'manage settings',
                subItems: [
                    { label: 'Umum & Tampilan', href: '/cms/settings/system?tab=umum' },
                    { label: 'Peringatan & Peta', href: '/cms/settings/system?tab=peringatan' },
                    { label: 'AI & Analitik', href: '/cms/settings/system?tab=ai' },
                    { label: 'Integrasi Sistem', href: '/cms/settings/system?tab=integrasi' },
                    { label: 'Pengguna & Akses', href: '/cms/settings/system?tab=pengguna' },
                    { label: 'Keamanan', href: '/cms/settings/system?tab=keamanan' },
                    { label: 'Environment (.env)', href: '/cms/settings/env' },
                    { label: 'Role & Hak Akses', href: '/cms/roles' },
                ],
            },
        ],
    },
];

interface AdminSidebarProps {
    open: boolean;
    onClose: () => void;
}

function NavItemComponent({ item, url }: { item: NavItem; url: string }) {
    const Icon = item.icon;
    const isParentActive = item.href 
        ? ((item.href === '/cms/analysis' && (url === '/cms/analysis' || url.startsWith('/cms/analysis/'))) ||
          (item.href !== '/cms/analysis' && item.href === '/cms/dashboard' && url === '/cms/dashboard') ||
          (item.href !== '/cms/analysis' && item.href !== '/cms/dashboard' && url.startsWith(item.href)))
        : (item.subItems?.some(sub => url.startsWith(sub.href)) || false);
        
    const [isOpen, setIsOpen] = useState(isParentActive);

    if (item.subItems) {
        return (
            <div className="space-y-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isParentActive ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {item.label}
                    </div>
                    <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')} />
                </button>
                <div className={cn("overflow-hidden transition-all duration-200 ease-in-out", isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
                    <div className="mt-1 flex flex-col space-y-1 pl-10 pr-2">
                        {item.subItems.map((sub, idx) => {
                            const isSubActive = url.includes(sub.href);
                            return (
                                <Link
                                    key={idx}
                                    href={sub.href}
                                    className={cn(
                                        'block rounded-md px-2 py-2 text-xs font-medium transition-colors',
                                        isSubActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                                    )}
                                >
                                    {sub.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link
            href={item.href!}
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isParentActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
            )}
        >
            <Icon className="h-4 w-4" />
            {item.label}
        </Link>
    );
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
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
                        <img src="/icon.png" alt="Logo" className="h-full w-full object-cover" />
                    </div>
                    <span className="mt-1 text-sm font-bold tracking-wider text-white">DISASTER</span>
                    <span className="text-sm font-bold text-blue-400">INTELLIGENCE</span>
                    <span className="text-xs text-slate-500">Crowdsourced Data + AI</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-3 overflow-y-auto px-3 py-2">
                    {navGroups.map((group, gi) => {
                        const user = usePage().props.auth?.user;
                        const userPermissions = (user?.permissions as string[]) || [];
                        const userRoles = (user?.roles as Array<{ name: string }> | undefined)?.map(r => r.name) ?? [];
                        const isSuperAdmin = userRoles.includes('super-admin');

                        const visibleItems = group.items.filter(item => {
                            if (!item.permission) return true;
                            if (isSuperAdmin) return true;
                            return userPermissions.includes(item.permission);
                        });

                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={gi}>
                                {group.title && (
                                    <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">{group.title}</p>
                                )}
                                {visibleItems.map((item, idx) => (
                                    <NavItemComponent key={idx} item={item} url={url} />
                                ))}
                            </div>
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
