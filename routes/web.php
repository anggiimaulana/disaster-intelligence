<?php

use App\Http\Controllers\Analisis\AnalisisController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Kejadian\KejadianController;
use App\Http\Controllers\Pengaturan\PengaturanController;
use App\Http\Controllers\Peringatan\PeringatanController;
use App\Http\Controllers\Validasi\ValidasiController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

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
