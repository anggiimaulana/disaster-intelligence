import { Head, Link } from '@inertiajs/react';
import { Brain, Database, FileText } from 'lucide-react';

export default function Analysis() {
    return (
        <>
            <Head title="Analisis AI" />

            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="max-w-md text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                        <Brain className="h-8 w-8 text-purple-600" />
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-slate-900">Analisis AI Laporan</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Untuk melihat hasil analisis AI, silakan pilih salah satu laporan dari halaman Data Kejadian terlebih dahulu.
                    </p>
                    <Link
                        href="/cms/incidents"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                        <Database className="h-4 w-4" />
                        Buka Data Kejadian
                    </Link>
                </div>
            </div>
        </>
    );
}
