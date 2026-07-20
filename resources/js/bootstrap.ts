import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Echo: any;
        Pusher: typeof Pusher;
    }
}

if (typeof window !== 'undefined') {
    window.Pusher = Pusher;

    const reverbHost = import.meta.env.VITE_REVERB_HOST;
    const reverbPort = import.meta.env.VITE_REVERB_PORT;
    const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;

    if (reverbHost && reverbKey) {
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
    } else {
        const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
        const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;

        if (pusherKey) {
            window.Echo = new Echo({
                broadcaster: 'pusher',
                key: pusherKey,
                cluster: pusherCluster || 'mt1',
                forceTLS: true,
            });
        }
    }
}

export {};
