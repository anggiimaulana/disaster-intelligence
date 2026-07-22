<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class SettingsController extends Controller
{
    private const SCALAR_KEYS = [
        'app_name', 'app_description', 'app_instansi', 'app_lang',
        'app_date_format', 'info_sumber_data',
        'integration_wa_enabled', 'integration_n8n_enabled',
        'integration_ai_enabled', 'integration_email_enabled',
        'integration_sms_enabled',
        'integration_wa_config_url', 'integration_n8n_config_url',
        'integration_ai_config_url', 'integration_email_config_url',
        'integration_sms_config_url',

        'ai_provider', 'ai_base_url', 'ai_model', 'ai_api_key',
        'ai_min_confidence', 'ai_auto_classification', 'ai_auto_location',

        'map_default_zoom', 'map_layer_risiko', 'map_cluster_marker',
        'map_center_lat', 'map_center_lng',

        'security_2fa_enabled', 'security_2fa_methods',

        'whatsapp_number', 'whatsapp_api_url', 'whatsapp_api_key',
        'call_center', 'email_pengaduan', 'alamat_kantor',
        'latitude_kantor', 'longitude_kantor', 'waktu_tanggap_darurat',
        'kabupaten_default', 'provinsi',
    ];

    private const FILE_KEYS = [
        'logo_file' => ['mimes:png,jpg,jpeg,svg', 'max:2048'],
        'favicon_file' => ['mimes:ico,png,svg', 'max:512'],
    ];

    public function update(Request $request)
    {
        $data = $request->except(['_token', '_method']);

        $fileRules = collect(self::FILE_KEYS)
            ->flatMap(fn ($rules, $key) => [$key => $rules])
            ->all();
        $validated = collect($fileRules)
            ->mapWithKeys(fn ($rules, $key) => [$key => array_merge(['sometimes'], $rules)])
            ->all();
        $request->validate($validated);

        foreach ($data as $key => $value) {
            if ($request->hasFile($key)) {
                $file = $request->file($key);
                $fileName = $file->hashName();
                $file->storeAs('public/settings', $fileName);

                $storageKey = match ($key) {
                    'logo_file' => 'logo_url',
                    'favicon_file' => 'favicon_url',
                    default => $key,
                };

                if ($storageKey !== $key) {
                    $existing = Setting::where('key', $storageKey)->first();
                    if ($existing?->value) {
                        $relative = preg_replace('#^/storage/#', '', $existing->value);
                        if ($relative && Storage::disk('public')->exists($relative)) {
                            Storage::disk('public')->delete($relative);
                        }
                    }
                }

                Setting::updateOrCreate(
                    ['key' => $storageKey],
                    ['value' => '/storage/settings/'.$fileName]
                );

                // Drop the file key so a stale logo_url string submitted in the
                // same request cannot overwrite the freshly uploaded file.
                unset($data[$key]);

                continue;
            }
        }

        foreach ($data as $key => $value) {
            // SEC code-review #2: ignore unknown keys so a privileged user
            // can't write to arbitrary settings keys (e.g. ai_api_key).
            if (! in_array($key, self::SCALAR_KEYS, true)) {
                continue;
            }
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }

    /**
     * Delete an item from a JSON array in settings (useful for n8n webhooks).
     */
    public function destroyArrayItem(Request $request, $key)
    {
        // Only allow deletion from whitelisted array settings.
        if (! in_array($key, ['n8n_endpoints'], true)) {
            abort(404);
        }

        $setting = Setting::where('key', $key)->first();
        if (! $setting) {
            return back();
        }

        $index = $request->input('index');
        $array = $setting->value ?? [];

        if (isset($array[$index])) {
            unset($array[$index]);
            $setting->value = array_values($array); // re-index
            $setting->save();
        }

        return back()->with('success', 'Item berhasil dihapus.');
    }

    public function removeAsset(Request $request, string $key)
    {
        if (! in_array($key, ['logo_url', 'favicon_url'], true)) {
            abort(404);
        }

        $setting = Setting::where('key', $key)->first();
        if ($setting?->value) {
            $relative = preg_replace('#^/storage/#', '', $setting->value);
            if ($relative && Storage::disk('public')->exists($relative)) {
                Storage::disk('public')->delete($relative);
            }
            $setting->delete();
        }

        return back()->with('success', ucfirst(str_replace('_url', '', $key)).' berhasil dihapus.');
    }

    public function testAiConnection(Request $request)
    {
        $validated = $request->validate([
            'ai_provider' => ['required', 'string', Rule::in(['openai-compatible', 'claude', 'gemini'])],
            'ai_base_url' => ['required', 'url'],
            'ai_model' => 'required|string|max:255',
            'ai_api_key' => 'required|string|max:500',
        ]);

        $provider = $validated['ai_provider'];
        $baseUrl = rtrim($validated['ai_base_url'], '/');
        $model = $validated['ai_model'];
        $apiKey = $validated['ai_api_key'];

        try {
            $startTime = microtime(true);

            match ($provider) {
                'claude' => $this->testClaude($baseUrl, $model, $apiKey),
                'gemini' => $this->testGemini($baseUrl, $model, $apiKey),
                default => $this->testOpenAI($baseUrl, $model, $apiKey),
            };

            $latency = round((microtime(true) - $startTime) * 1000);

            return response()->json([
                'success' => true,
                'message' => "Koneksi berhasil! ($latency ms)",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Koneksi gagal: '.$e->getMessage(),
            ]);
        }
    }

    private function testOpenAI(string $baseUrl, string $model, string $apiKey): void
    {
        $response = Http::withToken($apiKey)
            ->timeout(15)
            ->post("$baseUrl/chat/completions", [
                'model' => $model,
                'messages' => [['role' => 'user', 'content' => 'Test']],
                'max_tokens' => 1,
            ]);

        if (! $response->successful()) {
            throw new \Exception($response->json('error.message') ?? $response->body());
        }
    }

    private function testClaude(string $baseUrl, string $model, string $apiKey): void
    {
        $response = Http::withHeaders([
            'x-api-key' => $apiKey,
            'anthropic-version' => '2023-06-01',
        ])
            ->timeout(15)
            ->post("$baseUrl/v1/messages", [
                'model' => $model,
                'messages' => [['role' => 'user', 'content' => 'Test']],
                'max_tokens' => 1,
            ]);

        if (! $response->successful()) {
            throw new \Exception($response->json('error.message') ?? $response->body());
        }
    }

    private function testGemini(string $baseUrl, string $model, string $apiKey): void
    {
        $response = Http::timeout(15)
            ->post("$baseUrl/models/$model:generateContent?key=$apiKey", [
                'contents' => [['parts' => [['text' => 'Test']]]],
            ]);

        if (! $response->successful()) {
            throw new \Exception($response->json('error.message') ?? $response->body());
        }
    }
}
