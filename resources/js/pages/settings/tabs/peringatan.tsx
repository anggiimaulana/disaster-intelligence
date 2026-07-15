import { Head, usePage } from '@inertiajs/react';
import TabPeringatan from '@/pages/disaster/settings-components/TabPeringatan';

export default function SettingsPeringatan() {
    const { appSettings } = usePage<{ appSettings: Record<string, string> }>().props;
    return (
        <>
            <Head title="Pengaturan Peringatan" />
            <TabPeringatan appSettings={appSettings} />
        </>
    );
}
