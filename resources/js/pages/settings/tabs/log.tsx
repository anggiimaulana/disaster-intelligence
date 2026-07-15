import { Head } from '@inertiajs/react';
import { Globe } from 'lucide-react';

export default function SettingsLog() {
    return (
        <>
            <Head title="Log Aktivitas" />
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <h2 className="text-base font-bold text-slate-900">Log Aktivitas</h2>
                </div>
                <p className="text-sm text-slate-500">Riwayat aktivitas sistem dan pengguna.</p>
                <div className="mt-4 text-center text-sm text-slate-400 py-8">
                    Fitur log aktivitas sedang dalam pengembangan.
                </div>
            </div>
        </>
    );
}
