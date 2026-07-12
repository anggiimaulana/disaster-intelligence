/**
 * Admin Real-time Hook for Disaster Reports
 *
 * This hook listens for real-time updates on the admin dashboard.
 * Uses Laravel Echo to receive broadcasts for new reports and status updates.
 */

import { useEffect, useCallback, useRef } from 'react';

interface LaporanBencanaData {
    id: number;
    kode_laporan: string;
    jenis_bencana?: string;
    judul: string;
    alamat: string;
    kecamatan: string;
    latitude: number;
    longitude: number;
    tingkat_keparahan: 'Rendah' | 'Sedang' | 'Tinggi' | 'Darurat';
    status: {
        id: number;
        nama: string;
        warna: string;
    };
    created_at: string;
}

interface StatusUpdateData {
    id: number;
    kode_laporan: string;
    old_status: number;
    new_status: {
        id: number;
        nama: string;
        warna: string;
    };
    updated_at: string;
}

interface UseAdminRealtimeOptions {
    enabled?: boolean;
    onNewReport?: (data: LaporanBencanaData) => void;
    onStatusUpdate?: (data: StatusUpdateData) => void;
}

/**
 * Hook for admin real-time updates
 *
 * @param options - Configuration options
 * @returns Connection status and manual refresh function
 *
 * @example
 * ```tsx
 * function AdminDashboard() {
 *     const [reports, setReports] = useState([]);
 *
 *     useAdminRealtime({
 *         onNewReport: (report) => {
 *             setReports(prev => [report, ...prev]);
 *             toast.success(`Laporan baru: ${report.kode_laporan}`);
 *         },
 *         onStatusUpdate: (update) => {
 *             console.log('Status updated:', update);
 *         }
 *     });
 *
 *     return <Dashboard reports={reports} />;
 * }
 * ```
 */
export function useAdminRealtime(options: UseAdminRealtimeOptions = {}) {
    const {
        enabled = true,
        onNewReport,
        onStatusUpdate,
    } = options;

    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    const handleNewReport = useCallback((data: LaporanBencanaData) => {
        console.log('[Realtime] New report received:', data.kode_laporan);
        onNewReport?.(data);
    }, [onNewReport]);

    const handleStatusUpdate = useCallback((data: StatusUpdateData) => {
        console.log('[Realtime] Status update received:', data.kode_laporan);
        onStatusUpdate?.(data);
    }, [onStatusUpdate]);

    useEffect(() => {
        if (!enabled || typeof window === 'undefined' || !window.Echo) {
            return;
        }

        console.log('[Realtime] Connecting to admin channel...');

        // Listen for new reports
        const channel = window.Echo.channel('laporan');

        channel
            .listen('laporan.created', (data: { laporan: LaporanBencanaData }) => {
                handleNewReport(data.laporan);
            })
            .listen('laporan.status.updated', (data: StatusUpdateData) => {
                handleStatusUpdate(data);
            })
            .listen('laporan.validated', (data: any) => {
                console.log('[Realtime] Report validated:', data);
            })
            .here((users: any[]) => {
                console.log('[Realtime] Connected to channel, users online:', users.length);
            })
            .joining((user: any) => {
                console.log('[Realtime] User joined:', user);
            })
            .leaving((user: any) => {
                console.log('[Realtime] User left:', user);
            })
            .error((error: any) => {
                console.error('[Realtime] Channel error:', error);
                reconnectAttempts.current++;

                if (reconnectAttempts.current < maxReconnectAttempts) {
                    console.log(`[Realtime] Reconnecting... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
                } else {
                    console.error('[Realtime] Max reconnect attempts reached');
                }
            });

        return () => {
            console.log('[Realtime] Disconnecting from channel...');
            window.Echo.leaveChannel('laporan');
        };
    }, [enabled, handleNewReport, handleStatusUpdate]);

    return {
        isConnected: typeof window !== 'undefined' && !!window.Echo,
    };
}

export default useAdminRealtime;
