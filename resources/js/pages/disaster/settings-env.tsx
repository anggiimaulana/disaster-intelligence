import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Save, AlertTriangle } from 'lucide-react';

interface Props {
    envContent: string;
}

export default function SettingsEnv({ envContent }: Props) {
    const { data, setData, post, processing } = useForm({
        content: envContent
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/cms/settings/env', {
            preserveScroll: true
        });
    };

    return (
        <>
            <Head title="Environment Configuration" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Environment Configuration</h1>
                    <p className="text-sm text-slate-500">
                        Edit konfigurasi core aplikasi (.env) langsung dari admin panel.
                    </p>
                </div>

                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                    <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-yellow-800">Peringatan Keamanan (DANGER ZONE)</h3>
                            <p className="mt-1 text-sm text-yellow-700">
                                Mengubah file ini dapat menyebabkan aplikasi tidak berfungsi (crash).
                                Pastikan Anda tahu apa yang Anda ubah.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-[600px]">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3">
                            <span className="font-medium text-slate-700 font-mono text-sm">.env</span>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="w-full flex-1 p-4 font-mono text-sm bg-slate-900 text-slate-50 focus:outline-none resize-none"
                            spellCheck={false}
                        />
                    </div>
                </form>
            </div>
        </>
    );
}
