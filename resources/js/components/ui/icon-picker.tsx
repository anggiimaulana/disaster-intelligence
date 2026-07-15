import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Curated disaster-relevant icons
const ICON_LIST = [
    'AlertTriangle', 'Droplets', 'Wind', 'Flame', 'Mountain',
    'CloudRain', 'CloudLightning', 'Waves', 'Thermometer', 'Sun',
    'Snowflake', 'Tornado', 'Zap', 'ShieldAlert', 'Siren',
    'Ambulance', 'HeartPulse', 'Cross', 'Pill', 'Stethoscope',
    'Home', 'Building', 'Building2', 'MapPin', 'Map',
    'Navigation', 'Compass', 'Tent', 'Warehouse', 'Factory',
    'Phone', 'PhoneCall', 'Radio', 'Megaphone', 'Bell',
    'Users', 'UserCheck', 'HandHelping', 'Handshake', 'Shield',
    'Truck', 'Car', 'Ship', 'Plane', 'TrainFront',
    'Package', 'Boxes', 'Wrench', 'HardHat', 'Flashlight',
    'BookOpen', 'FileText', 'ClipboardList', 'CheckCircle', 'Info',
    'Eye', 'Camera', 'Wifi', 'Globe', 'Calendar',
] as const;

interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
    className?: string;
}

export default function IconPicker({ value, onChange, className }: IconPickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredIcons = ICON_LIST.filter((name) =>
        name.toLowerCase().includes(search.toLowerCase()),
    );

    const SelectedIcon = value ? (LucideIcons as any)[value] : null;

    return (
        <div className={className}>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={cn(
                    'flex items-center gap-3 rounded-lg border-2 border-dashed px-4 py-3 text-sm transition-colors w-full',
                    value
                        ? 'border-blue-300 bg-blue-50/50 text-blue-700'
                        : 'border-slate-200 text-slate-500 hover:border-blue-400 hover:bg-blue-50/30',
                )}
            >
                {SelectedIcon ? (
                    <>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                            <SelectedIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-slate-700">{value}</p>
                            <p className="text-xs text-slate-400">Klik untuk ganti icon</p>
                        </div>
                    </>
                ) : (
                    <span>Pilih icon sebagai thumbnail...</span>
                )}
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
                    <div
                        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900">Pilih Icon</h3>
                            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari icon..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-8 gap-1.5 max-h-[320px] overflow-y-auto pr-1">
                            {filteredIcons.map((iconName) => {
                                const Icon = (LucideIcons as any)[iconName];
                                if (!Icon) return null;
                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        title={iconName}
                                        onClick={() => { onChange(iconName); setOpen(false); setSearch(''); }}
                                        className={cn(
                                            'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                                            value === iconName
                                                ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500'
                                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </button>
                                );
                            })}
                        </div>

                        {value && (
                            <button
                                type="button"
                                onClick={() => { onChange(''); setOpen(false); }}
                                className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
                            >
                                Hapus Icon
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
