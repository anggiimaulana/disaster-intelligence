import { Head, router, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

// Import Tab Components
import TabUmum from './settings-components/TabUmum';
import TabIntegrasi from './settings-components/TabIntegrasi';
import TabPeringatan from './settings-components/TabPeringatan';
import TabAI from './settings-components/TabAI';
import TabPengguna from './settings-components/TabPengguna';
import TabKeamanan from './settings-components/TabKeamanan';

const menuItems = [
    { id: 'umum', label: 'Umum & Tampilan' },
    { id: 'peringatan', label: 'Peringatan & Peta' },
    { id: 'ai', label: 'AI & Analitik' },
    { id: 'integrasi', label: 'Integrasi Sistem' },
    { id: 'pengguna', label: 'Pengguna & Akses' },
    { id: 'keamanan', label: 'Keamanan' },
];

export default function SettingsPage({ appSettings }: any) {
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split('?')[1] || '');
    const initialTab = searchParams.get('tab') || 'umum';

    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const tab = new URLSearchParams(url.split('?')[1] || '').get('tab');
        if (tab && tab !== activeTab) setActiveTab(tab);
    }, [url]);

    const switchTab = (id: string) => {
        setActiveTab(id);
        router.visit(`/cms/settings/system?tab=${id}`, { preserveState: true, preserveScroll: true });
    };

    return (
        <>
            <Head title={`Pengaturan - ${menuItems.find(i => i.id === activeTab)?.label ?? 'Sistem'}`} />
            <div className="w-full min-w-0 max-w-full pb-10 overflow-x-hidden">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Pengaturan: {menuItems.find(i => i.id === activeTab)?.label ?? 'Sistem'}
                    </h2>
                    <p className="text-sm text-slate-500">Kelola konfigurasi sistem Disaster Intelligence.</p>
                </div>

                <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
                    <div className="flex min-w-max gap-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => switchTab(item.id)}
                                className={cn(
                                    'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                                    activeTab === item.id
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                                )}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="min-w-0">
                    {activeTab === 'umum' && <TabUmum appSettings={appSettings || {}} />}
                    {activeTab === 'peringatan' && <TabPeringatan appSettings={appSettings || {}} />}
                    {activeTab === 'ai' && <TabAI appSettings={appSettings || {}} />}
                    {activeTab === 'integrasi' && <TabIntegrasi appSettings={appSettings || {}} />}
                    {activeTab === 'pengguna' && <TabPengguna />}
                    {activeTab === 'keamanan' && <TabKeamanan appSettings={appSettings || {}} />}
                </div>
            </div>
        </>
    );
}
