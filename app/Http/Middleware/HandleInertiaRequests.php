<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $infoBar = Cache::remember('infoBar', 60, function () {
            $settings = Setting::whereIn('key', ['info_sumber_data', 'n8n_endpoints'])->pluck('value', 'key');
            $n8nEndpoints = $settings['n8n_endpoints'] ?? [];

            return [
                'sumber_data' => $settings['info_sumber_data'] ?? config('services.whatsapp.number', '+62 812-3456-7890'),
                'n8n_aktif' => config('services.n8n.enabled', false),
                'ai_connected' => config('services.ai.enabled', false),
            ];
        });

        // Notifications from recent audit logs
        $notifications = [];
        if ($request->user()) {
            $recentLogs = AuditLog::orderBy('created_at', 'desc')->limit(10)->get();
            $notifications = $recentLogs->map(function ($log) {
                $type = match (true) {
                    str_contains($log->action, 'VALIDATE') => 'success',
                    str_contains($log->action, 'DELETE') => 'warning',
                    default => 'info',
                };

                return [
                    'id' => $log->id,
                    'title' => str_replace('_', ' ', $log->action),
                    'message' => "{$log->table_name} #{$log->record_id}",
                    'type' => $type,
                    'read' => false,
                    'created_at' => $log->created_at->toIso8601String(),
                    'url' => null,
                ];
            })->toArray();
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? array_merge($request->user()->toArray(), [
                    'roles' => $request->user()->getRoleNames(),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                ]) : null,
            ],
            'infoBar' => $infoBar,
            'notifications' => $notifications,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
