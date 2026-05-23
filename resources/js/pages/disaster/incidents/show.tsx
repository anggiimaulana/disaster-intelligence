import { Head, Link } from '@inertiajs/react';
import { cn, formatDate, getDisasterLabel } from '@/lib/utils';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, AlertTriangle, Bell, Brain, CheckSquare, Clock, Copy, Download, ExternalLink, FileText, MapPin, MessageCircle, Phone, Share2, Waves } from 'lucide-react';
import type { LaporanDetailProps } from '@/types';

export default function IncidentShow({ report }: LaporanDetailProps) {
    return (
        <>
            <Head title={`Detail Laporan - ${report.laporan_id}`} />

            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                <Link href="/cms/incidents" className="hover:text-blue-600">Data Kejadian</Link>
                <span>›</span>
                <span>Detail Laporan</span>
                <span>›</span>
                <span className="font-medium text-slate-900">{report.laporan_id}</span>
            </nav>

            {/* Top Actions */}
            <div className="mb-4 flex items-center justify-between">
                <Link href="/cms/incidents" className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600">
                    <ArrowLeft className="h-4 w-4" /> Kembali
                </Link>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                        <Share2 className="h-4 w-4" /> Bagikan
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                        <Download className="h-4 w-4" /> Unduh PDF
                    </button>
                </div>
            </div>

            {/* Report Header Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">{report.laporan_id}</span>
                            <span className={cn('rounded-full px-3 py-1 text-xs font-semibold',
                                report.status === 'BARU' ? 'bg-blue-100 text-blue-700' :
                                report.status === 'VALID' ? 'bg-green-100 text-green-700' :
                                'bg-amber-100 text-amber-700'
                            )}>
                                {report.status === 'BARU' ? 'Baru' : report.status === 'VALID' ? 'Valid' : 'Menunggu Validasi'}
                            </span>
                        </div>
                        <h2 className="mt-2 text-xl font-bold text-slate-900">
                            {getDisasterLabel(report.jenis_bencana)} di {report.kecamatan}
                        </h2>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{formatDate(report.diterima_pada)}</span>
                            <span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4 text-green-600" />WhatsApp</span>
                            <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{report.pelapor}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-lg border border-slate-200 px-4 py-3">
                        <div className="text-right">
                            <p className="text-xs text-slate-500">Tingkat Risiko</p>
                            <span className={cn('text-sm font-bold', report.tingkat_risiko === 'TINGGI' ? 'text-red-600' : report.tingkat_risiko === 'SEDANG' ? 'text-amber-600' : 'text-green-600')}>
                                {report.tingkat_risiko}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500">Status</p>
                            <span className="text-sm font-bold text-blue-700">{report.status === 'BARU' ? 'BARU' : report.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 1: Informasi Laporan (kiri) | Foto + Lokasi (kanan) — grid-2 */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Informasi Laporan */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-base font-bold text-slate-900">Informasi Laporan</h3>
                    <dl className="space-y-4">
                        {[
                            { icon: Waves, label: 'Jenis Bencana', value: getDisasterLabel(report.jenis_bencana) },
                            { icon: MapPin, label: 'Lokasi', value: `${report.lokasi}, Kec. ${report.kecamatan}` },
                            { icon: MapPin, label: 'Koordinat', value: `${report.koordinat.lat}, ${report.koordinat.lng}` },
                            { icon: FileText, label: 'Deskripsi', value: report.deskripsi },
                            { icon: Phone, label: 'Pelapor', value: report.pelapor },
                            { icon: MessageCircle, label: 'Sumber', value: `${report.sumber} Gateway` },
                            { icon: Copy, label: 'ID Pesan', value: report.id_pesan },
                            { icon: Clock, label: 'Diterima pada', value: formatDate(report.diterima_pada) },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.label} className="flex gap-3">
                                    <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                                    <div className="min-w-0">
                                        <dt className="text-xs text-slate-500">{item.label}</dt>
                                        <dd className="text-sm font-medium text-slate-900 break-words">{item.value}</dd>
                                    </div>
                                </div>
                            );
                        })}
                    </dl>
                </div>

                {/* Right column: Foto + Lokasi stacked */}
                <div className="space-y-5">
                    {/* Foto / Media */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-base font-bold text-slate-900">Foto / Media ({report.foto_count})</h3>
                        {report.foto.length > 0 ? (
                            <div className="space-y-3">
                                <img src={report.foto[0]} alt="Foto laporan" className="h-52 w-full rounded-lg object-cover" />
                                <div className="grid grid-cols-4 gap-2">
                                    {report.foto.slice(1, 5).map((foto, i) => (
                                        <div key={i} className="relative">
                                            <img src={foto} alt="" className="h-14 w-full rounded-lg object-cover" />
                                            {i === 3 && report.foto_count > 5 && (
                                                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60">
                                                    <span className="text-sm font-bold text-white">+{report.foto_count - 5}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-44 items-center justify-center rounded-lg bg-slate-50">
                                <div className="text-center">
                                    <FileText className="mx-auto h-10 w-10 text-slate-300" />
                                    <p className="mt-2 text-sm text-slate-400">Tidak ada foto</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Lokasi di Peta */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900">Lokasi di Peta</h3>
                            <a href={`https://www.google.com/maps?q=${report.koordinat.lat},${report.koordinat.lng}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                Buka di Google Maps <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                        <div className="h-48 overflow-hidden rounded-lg">
                            <MapContainer center={[report.koordinat.lat, report.koordinat.lng]} zoom={13} className="h-full w-full" style={{ zIndex: 0 }} zoomControl={true} scrollWheelZoom={false}>
                                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <CircleMarker center={[report.koordinat.lat, report.koordinat.lng]} radius={10} fillColor="#EF4444" fillOpacity={0.9} color="#ffffff" weight={3}>
                                    <Popup>{report.lokasi}, Kec. {report.kecamatan}</Popup>
                                </CircleMarker>
                            </MapContainer>
                        </div>
                        {report.zona_rawan && (
                            <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <span className="text-sm font-medium text-red-700">{report.zona_label}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Row 2: Riwayat Aktivitas | Ringkasan AI | Metadata — grid-3 */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Riwayat Aktivitas — Timeline */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-base font-bold text-slate-900">Riwayat Aktivitas</h3>
                    <div className="relative pl-6">
                        {/* Timeline line */}
                        <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-200" />

                        <div className="space-y-5">
                            {report.activities.map((activity, idx) => (
                                <div key={activity.id} className="relative">
                                    {/* Dot */}
                                    <div className={cn(
                                        'absolute -left-6 top-1 h-[18px] w-[18px] rounded-full border-[3px] border-white shadow-sm',
                                        activity.type === 'whatsapp' ? 'bg-green-500' :
                                        activity.type === 'ai' ? 'bg-purple-500' :
                                        activity.type === 'system' ? 'bg-blue-500' : 'bg-slate-400'
                                    )} />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                                        <p className="text-xs text-slate-500">{formatDate(activity.timestamp)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Ringkasan Analisis AI */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-base font-bold text-slate-900">Ringkasan Analisis AI</h3>
                    {report.ai_ringkasan ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Prediksi Jenis Bencana</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-900">{report.ai_ringkasan.prediksi_jenis.label}</span>
                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">{report.ai_ringkasan.prediksi_jenis.confidence}%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Tingkat Risiko (Risk Score)</span>
                                <span className="text-sm font-bold text-slate-900">{report.ai_ringkasan.risk_score} / 100</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Severity</span>
                                <span className={cn('text-sm font-bold', report.ai_ringkasan.severity === 'TINGGI' ? 'text-red-600' : 'text-amber-600')}>
                                    {report.ai_ringkasan.severity}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Rekomendasi AI</p>
                                <p className="mt-1 text-sm text-slate-900">{report.ai_ringkasan.rekomendasi}</p>
                            </div>
                            <Link href={`/incidents/${report.laporan_id.replace('#', '')}/analysis`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
                                Lihat Analisis AI Lengkap →
                            </Link>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400">Analisis AI belum tersedia</p>
                    )}
                </div>

                {/* Metadata Sistem */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-base font-bold text-slate-900">Metadata Sistem</h3>
                    <dl className="space-y-3">
                        {[
                            ['Workflow ID', report.workflow_id],
                            ['Eksekusi n8n', report.eksekusi_n8n],
                            ['Node Sumber', report.node_sumber],
                            ['Database ID', report.database_id],
                            ['Terakhir Diperbarui', formatDate(report.terakhir_diperbarui)],
                        ].map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between">
                                <dt className="text-sm text-slate-500">{label}</dt>
                                <dd className="text-sm font-medium text-slate-900">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
                <Link href="/cms/incidents" className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600">
                    <ArrowLeft className="h-4 w-4" /> Kembali
                </Link>
                <div className="flex gap-3">
                    <Link href={`/cms/incidents/${report.laporan_id.replace('#', '')}/analysis`} className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                        <Brain className="h-4 w-4" /> Analisis AI
                    </Link>
                    <Link href="/cms/validation" className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                        <CheckSquare className="h-4 w-4" /> Validasi Laporan
                    </Link>
                    <button className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
                        <Bell className="h-4 w-4" /> Buat Peringatan Dini
                    </button>
                </div>
            </div>
        </>
    );
}
