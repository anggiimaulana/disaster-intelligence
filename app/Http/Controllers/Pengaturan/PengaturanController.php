<?php

namespace App\Http\Controllers\Pengaturan;

use App\Http\Controllers\Controller;
use App\Models\JenisBencana;
use App\Models\StatusLaporan;
use App\Models\Wilayah;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanController extends Controller
{
    public function index(): Response
    {
        // System info from config/database
        $systemInfo = [
            'nama_sistem' => config('app.name', 'Disaster Intelligence System'),
            'instansi' => config('app.instansi', 'BPBD Kabupaten Indramayu'),
            'versi_aplikasi' => config('app.version', 'v1.0.0'),
            'lingkungan' => app()->environment(),
            'waktu_server' => now()->toIso8601String(),
            'zona_waktu' => config('app.timezone', 'Asia/Jakarta (WIB)'),
            'bahasa' => config('app.locale', 'id'),
            'deskripsi' => 'Sistem Deteksi Dini dan Kesiapsiagaan Bencana Berbasis Crowdsourced Data + AI untuk BPBD Kabupaten Indramayu.',
            'logo_url' => config('app.logo_url'),
        ];

        // Integrations from config
        $integrations = [
            ['id' => '1', 'name' => 'n8n Workflow', 'description' => 'Automation workflow engine', 'status' => config('services.n8n.enabled') ? 'AKTIF' : 'NONAKTIF', 'icon' => 'workflow', 'config_url' => '/pengaturan/integrasi/n8n'],
            ['id' => '2', 'name' => 'AI Service', 'description' => 'NLP + Computer Vision + Spatial', 'status' => config('services.ai.enabled') ? 'CONNECTED' : 'DISCONNECTED', 'icon' => 'brain', 'config_url' => '/pengaturan/integrasi/ai'],
            ['id' => '3', 'name' => 'WhatsApp Gateway', 'description' => 'WhatsApp Business API', 'status' => config('services.whatsapp.enabled') ? 'TERHUBUNG' : 'TIDAK TERHUBUNG', 'icon' => 'message-circle', 'config_url' => '/pengaturan/integrasi/whatsapp'],
            ['id' => '4', 'name' => 'Telegram Bot', 'description' => 'Telegram notification channel', 'status' => config('services.telegram.enabled') ? 'AKTIF' : 'NONAKTIF', 'icon' => 'send', 'config_url' => '/pengaturan/integrasi/telegram'],
        ];

        // Risk thresholds from config or defaults
        $riskThresholds = Cache::remember('risk_thresholds', 3600, function () {
            return [
                ['level' => 'RENDAH', 'min' => 0, 'max' => 39, 'color' => '#22C55E', 'ambang_notifikasi' => 'Tidak ada notifikasi', 'enabled' => true],
                ['level' => 'SEDANG', 'min' => 40, 'max' => 69, 'color' => '#F59E0B', 'ambang_notifikasi' => 'Notifikasi internal', 'enabled' => true],
                ['level' => 'TINGGI', 'min' => 70, 'max' => 89, 'color' => '#F97316', 'ambang_notifikasi' => 'Notifikasi internal + Stakeholder', 'enabled' => true],
                ['level' => 'SANGAT TINGGI', 'min' => 90, 'max' => 100, 'color' => '#EF4444', 'ambang_notifikasi' => 'Notifikasi semua + Eskalasi', 'enabled' => true],
            ];
        });

        // Notification channels
        $notificationSettings = [
            ['channel' => 'WHATSAPP', 'rendah' => false, 'sedang' => true, 'tinggi' => true, 'sangat_tinggi' => true],
            ['channel' => 'SMS', 'rendah' => false, 'sedang' => false, 'tinggi' => true, 'sangat_tinggi' => true],
            ['channel' => 'EMAIL', 'rendah' => true, 'sedang' => true, 'tinggi' => true, 'sangat_tinggi' => true],
            ['channel' => 'APLIKASI', 'rendah' => true, 'sedang' => true, 'tinggi' => true, 'sangat_tinggi' => true],
        ];

        // Master data counts
        $masterDataStats = [
            'kecamatan_count' => Wilayah::where('kabupaten', 'Indramayu')->distinct('kecamatan')->count('kecamatan'),
            'desa_count' => Wilayah::where('kabupaten', 'Indramayu')->whereNotNull('desa')->distinct('desa')->count('desa'),
            'jenis_bencana_count' => JenisBencana::count(),
            'status_laporan_count' => StatusLaporan::count(),
        ];

        return Inertia::render('disaster/settings', [
            'systemInfo' => $systemInfo,
            'integrations' => $integrations,
            'riskThresholds' => $riskThresholds,
            'notificationSettings' => $notificationSettings,
            'masterDataStats' => $masterDataStats,
        ]);
    }

    public function getKecamatanDesa(): JsonResponse
    {
        $data = Wilayah::where('kabupaten', 'Indramayu')
            ->whereNotNull('kecamatan')
            ->whereNotNull('desa')
            ->select('kecamatan', 'desa', 'latitude', 'longitude')
            ->distinct()
            ->orderBy('kecamatan')
            ->orderBy('desa')
            ->get()
            ->groupBy('kecamatan')
            ->map(function ($items, $kecamatan) {
                return [
                    'kecamatan' => $kecamatan,
                    'desa' => $items->unique('desa')->map(function ($item) {
                        return [
                            'desa' => $item->desa,
                            'latitude' => $item->latitude,
                            'longitude' => $item->longitude,
                        ];
                    })->values()->toArray(),
                ];
            })
            ->values()
            ->toArray();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function getMasterDataJenisBencana(): JsonResponse
    {
        $jenis = JenisBencana::orderBy('kode')->get(['id', 'kode', 'nama_bencana', 'icon', 'warna', 'deskripsi']);

        return response()->json(['success' => true, 'data' => $jenis]);
    }

    public function getMasterDataStatusLaporan(): JsonResponse
    {
        $status = StatusLaporan::orderBy('id')->get(['id', 'nama_status', 'warna', 'urutan']);

        return response()->json(['success' => true, 'data' => $status]);
    }

    public function getMasterDataWilayah(): JsonResponse
    {
        $wilayah = Wilayah::where('kabupaten', 'Indramayu')
            ->select('id', 'provinsi', 'kabupaten', 'kecamatan', 'desa', 'latitude', 'longitude')
            ->orderBy('kecamatan')
            ->orderBy('desa')
            ->get();

        return response()->json(['success' => true, 'data' => $wilayah]);
    }
}
