import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react';
import { useRealTimeClock } from '@/hooks/use-real-time-clock';

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

export function AdminHeader({ sidebarOpen, onToggleSidebar }: AdminHeaderProps) {
    const { url } = usePage();
    const now = useRealTimeClock();
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const formattedDate = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });

    const currentPage = Object.entries(pageTitles).find(([path]) => url.startsWith(path));
    const title = currentPage?.[1]?.title ?? 'Detail Laporan';
    const subtitle = currentPage?.[1]?.subtitle ?? '';

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setProfileOpen(false);
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

                <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Notifikasi">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-0.5 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">5</span>
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-100">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white">BP</div>
                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-medium text-slate-900">BPBD</p>
                            <p className="text-xs text-slate-500">Kabupaten</p>
                        </div>
                        <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
                    </button>
                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-50">
                            <div className="border-b border-slate-100 px-4 py-3">
                                <p className="text-sm font-semibold text-slate-900">Admin BPBD</p>
                                <p className="text-xs text-slate-500">admin@bpbd-indramayu.go.id</p>
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
