/**
 * Laravel Echo Setup for Real-time Broadcasting
 *
 * This file initializes Laravel Echo for real-time WebSocket connections.
 * Laravel Reverb is used as the default broadcaster.
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Extend window to include Echo and Pusher
declare global {
    interface Window {
        Echo: any;
        Pusher: typeof Pusher;
    }
}

// Only initialize in browser environment
if (typeof window !== 'undefined') {
    // Check if Reverb is configured
    const reverbHost = import.meta.env.VITE_REVERB_HOST;
    const reverbPort = import.meta.env.VITE_REVERB_PORT;
    const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;

    if (reverbHost && reverbKey) {
        // Initialize with Reverb configuration
        window.Echo = new Echo({
            broadcaster: 'reverb',
            key: reverbKey,
            wsHost: reverbHost,
            wsPort: reverbPort || 8080,
            wssPort: reverbPort || 8080,
            forceTLS: false,
            disableStats: true,
            enabledTransports: ['ws', 'wss'],
        });

        console.log('[Echo] Connected to Reverb at', `${reverbHost}:${reverbPort}`);
    } else {
        // Fallback to Pusher if Reverb is not configured
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY || 'app-key',
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
            forceTLS: true,
        });

        console.warn('[Echo] Reverb not configured, falling back to Pusher');
    }
}

export {};
