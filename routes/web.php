<?php

use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\DisasterTypeController;
use App\Http\Controllers\Admin\EnvController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\KesiapsiagaanController;
use App\Http\Controllers\Admin\MediaLibraryController;
use App\Http\Controllers\Admin\RegencyController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingsController;
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
use App\Http\Controllers\Public\ReportController;
use App\Http\Controllers\Public\TrackingController;
use App\Http\Controllers\Public\WilayahController;
use App\Http\Controllers\Validasi\ValidasiController;
use App\Models\Setting;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Public Reporting System (No login required)
Route::prefix('public')->group(function () {
    Route::get('peta-bencana', [DisasterMapController::class, 'index'])->name('public.disaster-map');
    Route::get('lapor-bencana', [PengaduanController::class, 'index'])->name('lapor-bencana');
    Route::post('lapor-bencana', [PengaduanController::class, 'store'])
        ->middleware('throttle:30,60') // 30 requests per minute per IP
        ->name('public.report.store');
    Route::get('lacak-laporan', [PengaduanController::class, 'track'])
        ->middleware('throttle:30,60') // 30 requests per minute per IP
        ->name('public.report.track');

    // New v2 report system
    Route::get('lapor', [ReportController::class, 'index'])->name('public.report-v2');
    Route::post('lapor', [ReportController::class, 'store'])
        ->middleware('throttle:30,60')
        ->name('public.report-v2.store');
    Route::get('lacak', [TrackingController::class, 'index'])->name('public.tracking');
    Route::get('laporan/{kode}/export-pdf', [TrackingController::class, 'exportPdf'])->name('public.tracking.export-pdf');

    // Wilayah cascading select
    Route::get('districts/{regency}', [WilayahController::class, 'districts'])->name('public.districts');
    Route::get('villages/{district}/{kabupaten?}', [WilayahController::class, 'villages'])->name('public.villages');

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
    Route::get('/kabupaten', [PengaduanController::class, 'getKabupatenList'])
        ->middleware('cache.headers:public;max_age=3600')
        ->name('api.kabupaten');
    Route::get('/kecamatan/{kabupaten}', [PengaduanController::class, 'getKecamatanByKabupaten'])
        ->middleware('cache.headers:public;max_age=3600')
        ->name('api.kecamatan-by-kabupaten');
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
    Route::post('alerts', [PeringatanController::class, 'store'])->name('alerts.store');
    Route::put('alerts/{alert}', [PeringatanController::class, 'update'])->name('alerts.update');
    Route::delete('alerts/{alert}', [PeringatanController::class, 'destroy'])->name('alerts.destroy');

    // News (Berita)
    Route::get('berita', [BeritaController::class, 'index'])->name('admin.berita.index');
    Route::get('berita/create', [BeritaController::class, 'create'])->name('admin.berita.create');
    Route::post('berita', [BeritaController::class, 'store'])->name('admin.berita.store');
    Route::get('berita/{berita}/edit', [BeritaController::class, 'edit'])->name('admin.berita.edit');
    Route::put('berita/{berita}', [BeritaController::class, 'update'])->name('admin.berita.update');
    Route::delete('berita/{berita}', [BeritaController::class, 'destroy'])->name('admin.berita.destroy');

    // Kesiapsiagaan
    Route::get('kesiapsiagaan', [KesiapsiagaanController::class, 'index'])->name('admin.kesiapsiagaan.index');
    Route::get('kesiapsiagaan/create', [KesiapsiagaanController::class, 'create'])->name('admin.kesiapsiagaan.create');
    Route::post('kesiapsiagaan', [KesiapsiagaanController::class, 'store'])->name('admin.kesiapsiagaan.store');
    Route::get('kesiapsiagaan/{kesiapsiagaan}/edit', [KesiapsiagaanController::class, 'edit'])->name('admin.kesiapsiagaan.edit');
    Route::put('kesiapsiagaan/{kesiapsiagaan}', [KesiapsiagaanController::class, 'update'])->name('admin.kesiapsiagaan.update');
    Route::delete('kesiapsiagaan/{kesiapsiagaan}', [KesiapsiagaanController::class, 'destroy'])->name('admin.kesiapsiagaan.destroy');

    // FAQ
    Route::get('faq', [FaqController::class, 'index'])->name('admin.faq.index');
    Route::get('faq/create', [FaqController::class, 'create'])->name('admin.faq.create');
    Route::post('faq', [FaqController::class, 'store'])->name('admin.faq.store');
    Route::get('faq/{faq}/edit', [FaqController::class, 'edit'])->name('admin.faq.edit');
    Route::put('faq/{faq}', [FaqController::class, 'update'])->name('admin.faq.update');
    Route::delete('faq/{faq}', [FaqController::class, 'destroy'])->name('admin.faq.destroy');

    // Disaster Types (Jenis Bencana)
    Route::get('disaster-types', [DisasterTypeController::class, 'index'])->name('admin.disaster-types.index');
    Route::post('disaster-types', [DisasterTypeController::class, 'store'])->name('admin.disaster-types.store');
    Route::put('disaster-types/{id}', [DisasterTypeController::class, 'update'])->name('admin.disaster-types.update');
    Route::delete('disaster-types/{id}', [DisasterTypeController::class, 'destroy'])->name('admin.disaster-types.destroy');

    // Supported Regencies (Wilayah)
    Route::get('regencies', [RegencyController::class, 'index'])->name('admin.regencies.index');
    Route::post('regencies', [RegencyController::class, 'store'])->name('admin.regencies.store');
    Route::patch('regencies/{regency}/toggle', [RegencyController::class, 'toggle'])->name('admin.regencies.toggle');
    Route::delete('regencies/{regency}', [RegencyController::class, 'destroy'])->name('admin.regencies.destroy');

    // Settings (Pengaturan)
    Route::get('settings/system', [PengaturanController::class, 'index'])->name('settings.system');
    Route::post('settings/system', [SettingsController::class, 'update'])->name('settings.update');
    Route::delete('settings/system/array/{key}', [SettingsController::class, 'destroyArrayItem'])->name('settings.array.destroy');

    // Settings sub-pages
    Route::get('settings/env', [EnvController::class, 'edit'])->name('settings.env');
    Route::post('settings/env', [EnvController::class, 'update'])->name('settings.env.update');

    $getAppSettings = function () {
        return Setting::pluck('value', 'key')->toArray();
    };

    Route::get('settings/umum', fn () => Inertia::render('settings/tabs/umum', ['appSettings' => $getAppSettings()]))->name('settings.umum');
    Route::get('settings/integrasi', fn () => Inertia::render('settings/tabs/integrasi', ['appSettings' => $getAppSettings()]))->name('settings.integrasi');
    Route::get('settings/ai', fn () => Inertia::render('settings/tabs/ai', ['appSettings' => $getAppSettings()]))->name('settings.ai');
    Route::get('settings/peringatan', fn () => Inertia::render('settings/tabs/peringatan', ['appSettings' => $getAppSettings()]))->name('settings.peringatan');
    Route::get('settings/pengguna', fn () => Inertia::render('settings/tabs/pengguna', ['appSettings' => $getAppSettings()]))->name('settings.pengguna');
    Route::get('settings/keamanan', fn () => Inertia::render('settings/tabs/keamanan', ['appSettings' => $getAppSettings()]))->name('settings.keamanan');
    Route::get('settings/backup', fn () => Inertia::render('settings/tabs/backup'))->name('settings.backup');
    Route::get('settings/log', fn () => Inertia::render('settings/tabs/log'))->name('settings.log');

    // Roles & Permissions + User Management
    Route::get('roles', [RoleController::class, 'index'])->name('admin.roles.index');
    Route::post('roles', [RoleController::class, 'storeRole'])->name('admin.roles.store');
    Route::put('roles/{role}', [RoleController::class, 'updateRole'])->name('admin.roles.update');
    Route::delete('roles/{role}', [RoleController::class, 'destroyRole'])->name('admin.roles.destroy');
    Route::post('roles/assign', [RoleController::class, 'assignRole'])->name('admin.roles.assign');
    Route::post('roles/remove-role', [RoleController::class, 'removeRole'])->name('admin.roles.remove-role');
    Route::post('roles/users', [RoleController::class, 'storeUser'])->name('admin.roles.users.store');
    Route::delete('roles/users/{user}', [RoleController::class, 'destroyUser'])->name('admin.roles.users.destroy');

    // Media Library
    Route::get('media', [MediaLibraryController::class, 'index'])->name('admin.media.index');
    Route::post('media', [MediaLibraryController::class, 'store'])->name('admin.media.store');
    Route::put('media/{media}', [MediaLibraryController::class, 'update'])->name('admin.media.update');
    Route::delete('media/{media}', [MediaLibraryController::class, 'destroy'])->name('admin.media.destroy');

    // Master Data API
    Route::get('settings/master-data/kecamatan-desa', [PengaturanController::class, 'getKecamatanDesa'])->name('settings.master-data.kecamatan-desa');
    Route::get('settings/master-data/jenis-bencana', [PengaturanController::class, 'getMasterDataJenisBencana'])->name('settings.master-data.jenis-bencana');
    Route::get('settings/master-data/status-laporan', [PengaturanController::class, 'getMasterDataStatusLaporan'])->name('settings.master-data.status-laporan');
    Route::get('settings/master-data/wilayah', [PengaturanController::class, 'getMasterDataWilayah'])->name('settings.master-data.wilayah');
});

require __DIR__.'/settings.php';
