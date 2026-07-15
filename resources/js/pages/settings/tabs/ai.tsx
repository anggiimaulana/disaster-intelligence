import { Head, usePage } from '@inertiajs/react';
import TabAI from '@/pages/disaster/settings-components/TabAI';

export default function SettingsAI() {
    const { appSettings } = usePage<{ appSettings: Record<string, string> }>().props;
    return (
        <>
            <Head title="Pengaturan AI & Analitik" />
            <TabAI appSettings={appSettings} />
        </>
    );
}
