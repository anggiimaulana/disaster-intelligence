<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Symfony\Component\HttpFoundation\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureRateLimiting();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Configure rate limiting for the application.
     */
    protected function configureRateLimiting(): void
    {
        // Rate limit for public disaster report submission
        // 5 attempts per IP per hour
        RateLimiter::for('lapor-bencana', function (Request $request) {
            return Limit::perHour(5)
                ->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Terlalu banyak pengaduan dari IP ini. Silakan coba lagi dalam 1 jam.',
                        'error' => 'rate_limit_exceeded',
                        'retry_after' => $headers['Retry-After'] ?? 3600,
                    ], 429, $headers);
                });
        });

        // Rate limit for public report tracking
        // 30 attempts per IP per minute
        RateLimiter::for('lacak-laporan', function (Request $request) {
            return Limit::perMinute(30)
                ->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Terlalu banyak permintaan lacak. Silakan tunggu sebentar.',
                        'error' => 'rate_limit_exceeded',
                        'retry_after' => $headers['Retry-After'] ?? 60,
                    ], 429, $headers);
                });
        });

        // Rate limit for API tracking endpoints
        // 60 attempts per IP per minute
        RateLimiter::for('api-lacak', function (Request $request) {
            return Limit::perMinute(60)
                ->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Terlalu banyak permintaan API.',
                        'error' => 'rate_limit_exceeded',
                    ], 429, $headers);
                });
        });

        // Rate limit for validation actions (admin)
        // 30 attempts per user per minute
        RateLimiter::for('validasi', function ($request) {
            return Limit::perMinute(30)
                ->by($request->user()?->id ?: $request->ip())
                ->response(function ($request, array $headers) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Terlalu banyak aksi validasi. Silakan tunggu sebentar.',
                        'error' => 'rate_limit_exceeded',
                    ], 429, $headers);
                });
        });

        // Strict rate limit for login attempts
        RateLimiter::for('login', function (Request $request) {
            $email = $request->string('email')->toString();

            // Use email + IP for better rate limiting
            return Limit::perMinute(5)
                ->by($email.'|'.$request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Terlalu banyak percobaan login. Silakan tunggu 1 menit.',
                        'error' => 'rate_limit_exceeded',
                    ], 429, $headers);
                });
        });

        // Rate limit for API general usage
        // 120 requests per minute per IP
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(120)
                ->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Terlalu banyak permintaan API.',
                        'error' => 'rate_limit_exceeded',
                    ], 429, $headers);
                });
        });
    }
}
