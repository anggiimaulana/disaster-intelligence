import Echo from 'laravel-echo';

declare global {
    interface Window {
        Echo: any;
    }
}

if (typeof window !== 'undefined') {
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
    }
}

export {};
