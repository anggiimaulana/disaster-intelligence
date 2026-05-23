<?php

use App\Http\Controllers\Analisis\AnalisisController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Kejadian\KejadianController;
use App\Http\Controllers\Pengaturan\PengaturanController;
use App\Http\Controllers\Peringatan\PeringatanController;
use App\Http\Controllers\Public\AboutController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\DisasterMapController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\InformationController;
use App\Http\Controllers\Public\ReportController;
use App\Http\Controllers\Validasi\ValidasiController;
use Illuminate\Support\Facades\Route;

// Route::inertia('/', 'welcome')->name('home');
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::prefix('public')->group(function () {
    Route::get('peta-bencana', [DisasterMapController::class, 'index'])->name('public.disaster-map');
    Route::get('lapor-bencana', [ReportController::class, 'index'])->name('public.report');
    Route::post('lapor-bencana', [ReportController::class, 'store'])->name('public.report.store');

    Route::get('informasi', [InformationController::class, 'index'])->name('public.information');
    Route::get('informasi/peringatan-dini', [InformationController::class, 'alerts'])->name('public.information.alerts');
    Route::get('informasi/berita', [InformationController::class, 'news'])->name('public.information.news');
    Route::get('informasi/berita/{slug}', [InformationController::class, 'newsShow'])->name('public.information.news-show');
    Route::get('informasi/kesiapsiagaan', [InformationController::class, 'preparedness'])->name('public.information.preparedness');
    Route::get('informasi/faq', [InformationController::class, 'faq'])->name('public.information.faq');

    Route::get('tentang', [AboutController::class, 'index'])->name('public.about');
    Route::get('kontak', [ContactController::class, 'index'])->name('public.contact');
});

Route::middleware(['auth', 'verified'])->prefix('cms')->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Incidents (Data Kejadian)
    Route::get('incidents', [KejadianController::class, 'index'])->name('incidents.index');
    Route::get('incidents/{laporan}', [KejadianController::class, 'show'])->name('incidents.show');

    // Analysis (Analisis AI)
    Route::get('analysis', fn () => \Inertia\Inertia::render('disaster/analysis'))->name('analysis.index');
    Route::get('incidents/{incident}/analysis', [AnalisisController::class, 'show'])->name('analysis.show');

    // Validation (Validasi)
    Route::get('validation', [ValidasiController::class, 'index'])->name('validation.index');
    Route::post('validation/{incident}', [ValidasiController::class, 'validate'])->name('validation.validate');

    // Alerts (Peringatan Dini)
    Route::get('alerts', [PeringatanController::class, 'index'])->name('alerts.index');

    // Settings (Pengaturan)
    Route::get('settings/system', [PengaturanController::class, 'index'])->name('settings.system');
});

require __DIR__.'/settings.php';
