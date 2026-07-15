import { Database, RefreshCw, Wifi, Workflow, Server } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';

export function InfoBar() {
    const { infoBar } = usePage<any>().props;

    const handleRefresh = () => {
        router.reload({ only: ['infoBar', 'stats', 'laporan'] });
    };

    return (
        <div className="flex flex-wrap items-center justify-between border-t border-slate-200 bg-white px-4 py-2.5 md:px-5 gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                    <Wifi className="h-3 w-3 text-blue-600" />
                </div>
                <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-700">INFORMASI SISTEM</p>
                    <p className="text-xs text-slate-400">Data diperbarui secara real-time dari WhatsApp melalui n8n Workflow Automation</p>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-400">Sumber Data</p>
                        <p className="text-xs font-medium text-slate-700">{infoBar?.sumber_data || '+62 812-3456-7890'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <Workflow className={infoBar?.n8n_aktif ? 'h-3.5 w-3.5 text-green-500' : 'h-3.5 w-3.5 text-slate-400'} />
                    <div>
                        <p className="text-xs text-slate-400">n8n Workflow</p>
                        <p className={`text-xs font-medium ${infoBar?.n8n_aktif ? 'text-green-600' : 'text-slate-500'}`}>
                            {infoBar?.n8n_aktif ? 'Aktif' : 'Tidak Aktif'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${infoBar?.ai_connected ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <div>
                        <p className="text-xs text-slate-400">AI Service</p>
                        <p className={`text-xs font-medium ${infoBar?.ai_connected ? 'text-green-600' : 'text-slate-500'}`}>
                            {infoBar?.ai_connected ? 'Connected' : 'Offline'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5 text-green-500" />
                    <div>
                        <p className="text-xs text-slate-400">Database</p>
                        <p className="text-xs font-medium text-green-600">Normal</p>
                    </div>
                </div>
                <button 
                    onClick={handleRefresh}
                    className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Refresh Data</span>
                </button>
            </div>
        </div>
    );
}
