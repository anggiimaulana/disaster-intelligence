import { Link, router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, ChevronDown, LogOut, Menu, Settings, User, CheckCircle, AlertTriangle, FileText, Check } from 'lucide-react';
import { useRealTimeClock } from '@/hooks/use-real-time-clock';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
    read: boolean;
    created_at: string;
    url?: string;
}

interface AdminHeaderProps {
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    '/cms/dashboard': { title: 'Dashboard', subtitle: 'Ringkasan kondisi dan situasi bencana secara real-time' },
    '/cms/incidents': { title: 'Data Kejadian', subtitle: 'Daftar seluruh laporan kejadian bencana' },
    '/cms/analysis': { title: 'Analisis AI', subtitle: 'Hasil analisis kecerdasan buatan' },
    '/cms/validation': { title: 'Validasi Laporan', subtitle: 'Verifikasi laporan masyarakat' },
    '/cms/alerts': { title: 'Peringatan Dini', subtitle: 'Kelola peringatan dan notifikasi' },
    '/cms/settings/system': { title: 'Pengaturan', subtitle: 'Konfigurasi sistem' },
};

const NOTIF_ICONS: Record<string, any> = {
    success: CheckCircle,
    warning: AlertTriangle,
    info: FileText,
};

const NOTIF_COLORS: Record<string, string> = {
    success: 'text-green-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
};

export function AdminHeader({ sidebarOpen, onToggleSidebar }: AdminHeaderProps) {
    const { url, props } = usePage();
    const now = useRealTimeClock();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    const auth = (props as any).auth?.user;
    const notifications: Notification[] = (props as any).notifications || [];
    const unreadCount = notifications.filter((n: Notification) => !n.read).length;

    const formattedDate = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });

    const currentPage = Object.entries(pageTitles).find(([path]) => url.startsWith(path));
    const title = currentPage?.[1]?.title ?? 'Detail Laporan';
    const subtitle = currentPage?.[1]?.subtitle ?? '';

    const initials = auth?.name ? auth.name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase() : 'AD';

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-5">
            <div className="flex items-center gap-3">
                <button onClick={onToggleSidebar} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Toggle sidebar">
                    <Menu className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-base font-bold text-slate-900">{title}</h1>
                    <p className="hidden text-sm text-slate-500 sm:block">{subtitle}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                <div className="hidden items-center gap-1.5 text-sm text-slate-500 md:flex">
                    <Calendar className="h-4 w-4" />
                    <span>{formattedDate}, {formattedTime} WIB</span>
                </div>

                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                    <button onClick={() => {
                        const wasOpen = notifOpen;
                        setNotifOpen(!notifOpen);
                        if (!wasOpen && unreadCount > 0) {
                            router.post('/cms/notifications/mark-read', {}, { preserveScroll: true });
                        }
                    }} className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Notifikasi">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                        )}
                    </button>
                    {notifOpen && (
                        <div className="absolute right-0 top-full mt-1 w-80 rounded-xl border border-slate-200 bg-white shadow-lg z-50">
                            <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900">Notifikasi</h3>
                                {unreadCount === 0 && notifications.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                                        <Check className="h-3 w-3" /> Semua dibaca
                                    </span>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-sm text-slate-400">Tidak ada notifikasi</div>
                                ) : (
                                    notifications.slice(0, 10).map((n) => {
                                        const Icon = NOTIF_ICONS[n.type] || FileText;
                                        return (
                                            <Link key={n.id} href={n.url || '#'} onClick={() => setNotifOpen(false)} className="flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                                                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${NOTIF_COLORS[n.type] || 'text-slate-400'}`} />
                                                <div className="min-w-0">
                                                    <p className="text-sm text-slate-700">{n.title}</p>
                                                    <p className="text-xs text-slate-500 truncate">{n.message}</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(n.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-100">
                        {auth?.avatar ? (
                            <img src={`/storage/${auth.avatar}`} alt={auth.name} className="h-9 w-9 rounded-full object-cover" />
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white">{initials}</div>
                        )}
                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-medium text-slate-900">{auth?.name || 'Admin'}</p>
                            <p className="text-xs text-slate-500">{auth?.email || ''}</p>
                        </div>
                        <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
                    </button>
                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-50">
                            <div className="border-b border-slate-100 px-4 py-3">
                                <p className="text-sm font-semibold text-slate-900">{auth?.name || 'Admin'}</p>
                                <p className="text-xs text-slate-500">{auth?.email || ''}</p>
                            </div>
                            <Link href="/cms/settings/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setProfileOpen(false)}><User className="h-4 w-4 text-slate-400" /> Profil Saya</Link>
                            <Link href="/cms/settings/system" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setProfileOpen(false)}><Settings className="h-4 w-4 text-slate-400" /> Pengaturan</Link>
                            <div className="border-t border-slate-100 mt-1 pt-1">
                                <Link href="/logout" method="post" as="button" className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50" onClick={() => setProfileOpen(false)}><LogOut className="h-4 w-4" /> Keluar</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
