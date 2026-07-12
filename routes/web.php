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
use App\Http\Controllers\Public\PengaduanController;
use App\Http\Controllers\Validasi\ValidasiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Public Reporting System (No login required)
Route::prefix('public')->group(function () {
    Route::get('peta-bencana', [DisasterMapController::class, 'index'])->name('public.disaster-map');
    Route::get('lapor-bencana', [PengaduanController::class, 'index'])->name('public.report');
    Route::post('lapor-bencana', [PengaduanController::class, 'store'])
        ->middleware('throttle:30,60') // 30 requests per minute per IP
        ->name('public.report.store');
    Route::get('lacak-laporan', [PengaduanController::class, 'track'])
        ->middleware('throttle:30,60') // 30 requests per minute per IP
        ->name('public.report.track');

    Route::get('informasi', [InformationController::class, 'index'])->name('public.information');
    Route::get('informasi/peringatan-dini', [InformationController::class, 'alerts'])->name('public.information.alerts');
    Route::get('informasi/berita', [InformationController::class, 'news'])->name('public.information.news');
    Route::get('informasi/berita/{slug}', [InformationController::class, 'newsShow'])->name('public.information.news-show');
    Route::get('informasi/kesiapsiagaan', [InformationController::class, 'preparedness'])->name('public.information.preparedness');
    Route::get('informasi/faq', [InformationController::class, 'faq'])->name('public.information.faq');

    Route::get('tentang', [AboutController::class, 'index'])->name('public.about');
    Route::get('kontak', [ContactController::class, 'index'])->name('public.contact');
});

// API endpoints for public reporting (for AJAX calls)
Route::prefix('api')->group(function () {
    Route::get('/reports/latest', [PengaduanController::class, 'latest'])
        ->middleware('cache.headers:public;max_age=30') // Cache 30 seconds
        ->name('api.reports.latest');
    Route::get('/reports/statistics', [PengaduanController::class, 'statistics'])
        ->middleware('cache.headers:public;max_age=60')
        ->name('api.reports.statistics');
    Route::get('/reports/track', [PengaduanController::class, 'track'])
        ->middleware('throttle:30,60')
        ->name('api.reports.track');

    // Location autocomplete/geocoding endpoints
    Route::get('/desa-by-kecamatan/{kecamatan}', [PengaduanController::class, 'getDesaByKecamatan'])
        ->middleware('cache.headers:public;max_age=3600')
        ->name('api.desa-by-kecamatan');
    Route::get('/geocode', [PengaduanController::class, 'geocode'])
        ->middleware('throttle:100,60')
        ->name('api.geocode');
    Route::get('/search-location', [PengaduanController::class, 'hybridSearch'])
        ->middleware('throttle:100,60')
        ->name('api.search-location');
    Route::get('/coordinates-by-location', [PengaduanController::class, 'getCoordinatesByLocation'])
        ->middleware('cache.headers:public;max_age=3600')
        ->name('api.coordinates-by-location');
});

// Keep legacy route for backwards compatibility
Route::get('/public/lapor-bencana', [PengaduanController::class, 'index'])->name('lapor-bencana');
Route::post('/public/lapor-bencana', [PengaduanController::class, 'store'])
    ->name('lapor-bencana.store');
Route::get('/public/lacak-laporan', [PengaduanController::class, 'track'])
    ->name('lacak-laporan');

Route::middleware(['auth', 'verified'])->prefix('cms')->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Incidents (Data Kejadian)
    Route::get('incidents', [KejadianController::class, 'index'])->name('incidents.index');
    Route::get('incidents/{laporan}', [KejadianController::class, 'show'])->name('incidents.show');
    Route::get('incidents/export', [KejadianController::class, 'export'])->name('incidents.export');

    // Analysis (Analisis AI)
    Route::get('analysis', fn () => Inertia::render('disaster/analysis'))->name('analysis.index');
    Route::get('incidents/{incident}/analysis', [AnalisisController::class, 'show'])->name('analysis.show');

    // Validation (Validasi)
    Route::get('validation', [ValidasiController::class, 'index'])->name('validation.index');
    Route::get('validation/{id}', [ValidasiController::class, 'show'])->name('validation.show');
    Route::post('validation/{id}', [ValidasiController::class, 'validate'])
        ->middleware('throttle:30,60')
        ->name('validation.validate');
    Route::patch('validation/{id}/status', [ValidasiController::class, 'updateStatus'])
        ->middleware('throttle:30,60')
        ->name('validation.update-status');

    // Alerts (Peringatan Dini)
    Route::get('alerts', [PeringatanController::class, 'index'])->name('alerts.index');

    // Settings (Pengaturan)
    Route::get('settings/system', [PengaturanController::class, 'index'])->name('settings.system');
    Route::get('settings/master-data/kecamatan-desa', [PengaturanController::class, 'getKecamatanDesa'])->name('settings.master-data.kecamatan-desa');
    Route::get('settings/master-data/jenis-bencana', [PengaturanController::class, 'getMasterDataJenisBencana'])->name('settings.master-data.jenis-bencana');
    Route::get('settings/master-data/status-laporan', [PengaturanController::class, 'getMasterDataStatusLaporan'])->name('settings.master-data.status-laporan');
    Route::get('settings/master-data/wilayah', [PengaturanController::class, 'getMasterDataWilayah'])->name('settings.master-data.wilayah');
});

require __DIR__.'/settings.php';
