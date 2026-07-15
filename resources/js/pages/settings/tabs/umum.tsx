import { Head, usePage } from '@inertiajs/react';
import TabUmum from '@/pages/disaster/settings-components/TabUmum';

export default function SettingsUmum() {
    const { appSettings } = usePage<{ appSettings: Record<string, string> }>().props;
    return (
        <>
            <Head title="Pengaturan Umum" />
            <TabUmum appSettings={appSettings} />
        </>
    );
}
