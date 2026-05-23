import { useState } from 'react';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';
import { InfoBar } from '@/pages/disaster/components/info-bar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-100">
            <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className={cn('flex flex-1 flex-col min-w-0 transition-all duration-300', sidebarOpen ? 'lg:ml-[200px]' : 'ml-0')}>
                <AdminHeader sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-4 pb-0 md:p-5 md:pb-0">
                    {children}
                </main>
                <InfoBar />
            </div>
        </div>
    );
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
