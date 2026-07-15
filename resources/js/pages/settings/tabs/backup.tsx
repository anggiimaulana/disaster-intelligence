import { Head } from '@inertiajs/react';
import { HardDrive } from 'lucide-react';

export default function SettingsBackup() {
    return (
        <>
            <Head title="Backup & Pemulihan" />
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <HardDrive className="h-5 w-5 text-blue-600" />
                    <h2 className="text-base font-bold text-slate-900">Backup & Pemulihan</h2>
                </div>
                <p className="text-sm text-slate-500 mb-4">Kelola backup database dan pemulihan sistem.</p>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { title: 'Backup Database', desc: 'Backup terakhir: -', action: 'Backup Sekarang' },
                        { title: 'Restore Database', desc: 'Kembalikan ke backup sebelumnya', action: 'Restore' },
                        { title: 'Export Data', desc: 'Export semua data ke CSV/JSON', action: 'Export' },
                        { title: 'Import Data', desc: 'Import data dari file backup', action: 'Import' },
                    ].map((item) => (
                        <div key={item.title} className="rounded-lg border border-slate-100 p-3">
                            <p className="text-sm font-medium text-slate-900">{item.title}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
                            <button className="mt-2 text-xs font-medium text-blue-600 hover:underline">{item.action}</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
