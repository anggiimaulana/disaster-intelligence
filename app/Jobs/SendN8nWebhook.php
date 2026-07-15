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
        $setting = Setting::where('key', 'n8n_endpoints')->first();
        if (! $setting || empty($setting->value)) {
            return;
        }

        $endpoints = $setting->value;

        // If the array is JSON encoded, it will be decoded automatically due to accessor
        if (is_string($endpoints)) {
            $endpoints = json_decode($endpoints, true);
        }

        if (! is_array($endpoints)) {
            return;
        }

        foreach ($endpoints as $endpoint) {
            $url = $endpoint['url'] ?? null;
            if (! $url) {
                continue;
            }

            try {
                $response = Http::timeout(10)
                    ->withHeaders([
                        'X-Trigger-Event' => $this->triggerEvent,
                    ])
                    ->post($url, array_merge([
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
