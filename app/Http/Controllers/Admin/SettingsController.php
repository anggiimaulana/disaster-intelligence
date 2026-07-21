<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    /**
     * Upsert settings from request.
     */
    public function update(Request $request)
    {
        $data = $request->except(['_token', '_method']);

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
            'ai_provider' => 'required|string',
            'ai_base_url' => 'required|string',
            'ai_model' => 'required|string',
            'ai_api_key' => 'required|string',
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
