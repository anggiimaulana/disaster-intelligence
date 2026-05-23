import { Database, RefreshCw, Wifi, Workflow } from 'lucide-react';

export function InfoBar() {
    return (
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-2.5 md:px-5">
            <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                    <Wifi className="h-3 w-3 text-blue-600" />
                </div>
                <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-700">INFORMASI SISTEM</p>
                    <p className="text-xs text-slate-400">Data diperbarui secara real-time dari WhatsApp melalui n8n Workflow Automation</p>
                </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-400">Sumber Data</p>
                        <p className="text-xs font-medium text-slate-700">+62 812-3456-7890</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <Workflow className="h-3.5 w-3.5 text-green-500" />
                    <div>
                        <p className="text-xs text-slate-400">n8n Workflow</p>
                        <p className="text-xs font-medium text-green-600">Aktif</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <div>
                        <p className="text-xs text-slate-400">AI Service</p>
                        <p className="text-xs font-medium text-green-600">Connected</p>
                    </div>
                </div>
                <div className="hidden items-center gap-1.5 lg:flex">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <div>
                        <p className="text-xs text-slate-400">Database</p>
                        <p className="text-xs font-medium text-green-600">Normal</p>
                    </div>
                </div>
                <button className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800">
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Refresh Data</span>
                </button>
            </div>
        </div>
    );
}
