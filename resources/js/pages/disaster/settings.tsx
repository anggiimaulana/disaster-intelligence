import { Head, usePage } from '@inertiajs/react';
import { Settings, SlidersHorizontal, Map as MapIcon, Users, ShieldCheck, Zap, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

// Import Tab Components
import TabUmum from './settings-components/TabUmum';
import TabIntegrasi from './settings-components/TabIntegrasi';
import TabPeringatan from './settings-components/TabPeringatan';
import TabAI from './settings-components/TabAI';
import TabPengguna from './settings-components/TabPengguna';
import TabKeamanan from './settings-components/TabKeamanan';

const menuItems = [
    { id: 'umum', label: 'Umum & Tampilan', component: TabUmum },
    { id: 'peringatan', label: 'Peringatan & Peta', component: TabPeringatan },
    { id: 'ai', label: 'AI & Analitik', component: TabAI },
    { id: 'integrasi', label: 'Integrasi Sistem', component: TabIntegrasi },
    { id: 'pengguna', label: 'Pengguna & Akses', component: TabPengguna },
    { id: 'keamanan', label: 'Keamanan', component: TabKeamanan },
];

export default function SettingsPage({ appSettings }: any) {
    const { url } = usePage();
    // Parse tab from url, e.g. /cms/settings/system?tab=umum
    const searchParams = new URLSearchParams(url.split('?')[1] || '');
    const initialTab = searchParams.get('tab') || 'umum';
    
    const [activeTab, setActiveTab] = useState(initialTab);
    
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [url]);

    const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component;

    return (
        <>
            <Head title={`Pengaturan - ${menuItems.find(i => i.id === activeTab)?.label}`} />
            <div className="w-full min-w-0 max-w-full pb-10 overflow-x-hidden">
                <div className="flex items-center justify-between space-y-2 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Pengaturan: {menuItems.find(i => i.id === activeTab)?.label}
                        </h2>
                        <p className="text-sm text-slate-500">Kelola konfigurasi sistem Disaster Intelligence.</p>
                    </div>
                </div>

                <div className="min-w-0">
                    {ActiveComponent ? (
                        <ActiveComponent appSettings={appSettings || {}} />
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center animate-in fade-in">
                            <h3 className="text-lg font-medium text-slate-900">Modul Belum Tersedia</h3>
                            <p className="mt-2 text-sm text-slate-500">Fitur {menuItems.find(i => i.id === activeTab)?.label} sedang dalam tahap pengembangan.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
