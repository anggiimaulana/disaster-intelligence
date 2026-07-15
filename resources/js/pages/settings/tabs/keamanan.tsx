import { Head, usePage } from '@inertiajs/react';
import TabKeamanan from '@/pages/disaster/settings-components/TabKeamanan';

export default function SettingsKeamanan() {
    const { appSettings } = usePage<{ appSettings: Record<string, string> }>().props;
    return (
        <>
            <Head title="Pengaturan Keamanan" />
            <TabKeamanan appSettings={appSettings} />
        </>
    );
}
