<?php

namespace App\Jobs;

use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendN8nWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public string $triggerEvent;

    public array $payload;

    /**
     * Create a new job instance.
     */
    public function __construct(string $triggerEvent, array $payload)
    {
        $this->triggerEvent = $triggerEvent;
        $this->payload = $payload;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $settings = Setting::whereIn('key', [
            'integration_n8n_enabled', 'n8n_webhook_url', 'n8n_api_key',
            'n8n_trigger_on_report', 'n8n_trigger_on_validation', 'n8n_trigger_on_alert',
            'n8n_endpoints',
        ])->pluck('value', 'key');

        $isEnabled = (string) ($settings['integration_n8n_enabled'] ?? '1') === '1' || ($settings['integration_n8n_enabled'] ?? false) === true;
        if (! $isEnabled) {
            return;
        }

        // Check trigger condition
        if ($this->triggerEvent === 'report_created' && isset($settings['n8n_trigger_on_report']) && (string) $settings['n8n_trigger_on_report'] === '0') {
            return;
        }
        if ($this->triggerEvent === 'report_validated' && isset($settings['n8n_trigger_on_validation']) && (string) $settings['n8n_trigger_on_validation'] === '0') {
            return;
        }
        if ($this->triggerEvent === 'alert_created' && isset($settings['n8n_trigger_on_alert']) && (string) $settings['n8n_trigger_on_alert'] === '0') {
            return;
        }

        $urls = [];
        if (! empty($settings['n8n_webhook_url'])) {
            $urls[] = $settings['n8n_webhook_url'];
        }

        if (! empty($settings['n8n_endpoints'])) {
            $endpoints = is_string($settings['n8n_endpoints']) ? json_decode($settings['n8n_endpoints'], true) : $settings['n8n_endpoints'];
            if (is_array($endpoints)) {
                foreach ($endpoints as $ep) {
                    if (! empty($ep['url'])) {
                        $urls[] = $ep['url'];
                    }
                }
            }
        }

        $urls = array_unique(array_filter($urls));

        if (empty($urls)) {
            return;
        }

        $apiKey = $settings['n8n_api_key'] ?? null;

        foreach ($urls as $url) {
            try {
                $req = Http::timeout(10)
                    ->withHeaders([
                        'X-Trigger-Event' => $this->triggerEvent,
                        'Content-Type' => 'application/json',
                    ]);

                if ($apiKey) {
                    $req->withHeaders(['X-N8N-API-KEY' => $apiKey]);
                }

                $response = $req->post($url, array_merge([
                    'event' => $this->triggerEvent,
                    'timestamp' => now()->toIso8601String(),
                ], $this->payload));

                if ($response->failed()) {
                    Log::warning("n8n webhook failed for {$this->triggerEvent}", [
                        'url' => $url,
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);
                } else {
                    Log::info("n8n webhook sent successfully for {$this->triggerEvent}", [
                        'url' => $url,
                    ]);
                }
            } catch (\Exception $e) {
                Log::error("n8n webhook exception for {$this->triggerEvent}", [
                    'url' => $url,
                    'message' => $e->getMessage(),
                ]);
            }
        }
    }
}
