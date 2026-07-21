<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use App\Models\Setting;
use Carbon\Carbon;
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

        // Notifications from recent audit logs (scoped per-user via session "last seen")
        $notifications = [];
        if ($request->user()) {
            $sessionKey = 'notifications_seen_at';
            $seenAt = $request->session()->get($sessionKey);

            $query = AuditLog::orderBy('created_at', 'desc')->limit(20);
            if ($seenAt) {
                $query->where('created_at', '>', Carbon::parse($seenAt));
            }
            $recentLogs = $query->get();

            // SEC #10: whitelist of tables whose notifications get URLs.
            // Anything else yields url=null. This prevents a tampered AuditLog
            // table_name or record_id from injecting arbitrary URL paths into
            // Inertia payload that ends up as href attributes in the UI.
            $urlableTables = ['laporan_bencana', 'berita', 'kesiapsiagaan', 'early_warnings'];

            $notifications = $recentLogs->map(function ($log) {
                $type = match (true) {
                    str_contains($log->action, 'VALIDATE') => 'success',
                    str_contains($log->action, 'DELETE') => 'warning',
                    str_contains($log->action, 'CREATE') || str_contains($log->action, 'STORE') => 'info',
                    default => 'info',
                };

                // SEC #10: cast record_id to int so it can't be used for path
                // injection (e.g. "../admin/users/1/edit"). Also gate on table_name.
                $recordId = (int) $log->record_id;
                $tableName = is_string($log->table_name) ? $log->table_name : '';

                $url = match (true) {
                    str_contains($log->action, 'VALIDATE_REPORT') && $tableName === 'laporan_bencana' => $recordId > 0 ? "/cms/validation/{$recordId}" : null,
                    str_contains($log->action, 'UPDATE_STATUS') && $tableName === 'laporan_bencana' => $recordId > 0 ? "/cms/incidents/{$recordId}" : null,
                    str_contains($log->action, 'CREATE_USER') || str_contains($log->action, 'DELETE_USER') => '/cms/roles',
                    str_contains($log->action, 'ROLE') => '/cms/roles',
                    $tableName === 'berita' => '/cms/berita',
                    $tableName === 'kesiapsiagaan' => '/cms/kesiapsiagaan',
                    $tableName === 'early_warnings' => '/cms/alerts',
                    default => null,
                };

                // SEC #10: also gate by the urlable tables whitelist.
                $url = $tableName && in_array($tableName, ['laporan_bencana', 'berita', 'kesiapsiagaan', 'early_warnings'], true) ? $url : null;

                return [
                    'id' => $log->id,
                    'title' => str_replace('_', ' ', $log->action),
                    'message' => "{$tableName} #{$recordId}",
                    'type' => $type,
                    'read' => false,
                    'created_at' => $log->created_at->toIso8601String(),
                    'url' => $url,
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
