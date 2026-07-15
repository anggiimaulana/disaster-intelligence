import { Head, usePage } from '@inertiajs/react';
import TabIntegrasi from '@/pages/disaster/settings-components/TabIntegrasi';

export default function SettingsIntegrasi() {
    const { appSettings } = usePage<{ appSettings: Record<string, string> }>().props;
    return (
        <>
            <Head title="Pengaturan Integrasi" />
            <TabIntegrasi appSettings={appSettings} />
        </>
    );
}
