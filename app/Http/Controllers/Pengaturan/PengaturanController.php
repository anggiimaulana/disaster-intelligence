<?php

namespace App\Http\Controllers\Pengaturan;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('disaster/settings', [
            'systemInfo' => [
                'nama_sistem' => 'Disaster Intelligence System',
                'instansi' => 'BPBD Kabupaten Tasikmalaya',
                'versi_aplikasi' => 'v1.0.0',
                'lingkungan' => 'Production',
                'waktu_server' => now()->toIso8601String(),
                'zona_waktu' => 'Asia/Jakarta (WIB)',
                'bahasa' => 'Bahasa Indonesia',
                'deskripsi' => 'Sistem Deteksi Dini dan Kesiapsiagaan Bencana Berbasis Crowdsourced Data + n8n + AI untuk BPBD Kabupaten Tasikmalaya.',
                'logo_url' => null,
            ],
            'integrations' => [
                ['id' => '1', 'name' => 'n8n Workflow', 'description' => 'Automation workflow engine', 'status' => 'AKTIF', 'icon' => 'workflow', 'config_url' => '/pengaturan/integrasi/n8n'],
                ['id' => '2', 'name' => 'AI Service', 'description' => 'NLP + Computer Vision + Spatial', 'status' => 'CONNECTED', 'icon' => 'brain', 'config_url' => '/pengaturan/integrasi/ai'],
                ['id' => '3', 'name' => 'WhatsApp Gateway', 'description' => 'WhatsApp Business API', 'status' => 'TERHUBUNG', 'icon' => 'message-circle', 'config_url' => '/pengaturan/integrasi/whatsapp'],
                ['id' => '4', 'name' => 'Telegram Bot', 'description' => 'Telegram notification channel', 'status' => 'AKTIF', 'icon' => 'send', 'config_url' => '/pengaturan/integrasi/telegram'],
            ],
            'riskThresholds' => [
                ['level' => 'RENDAH', 'min' => 0, 'max' => 30, 'color' => '#22C55E', 'ambang_notifikasi' => 'Tidak ada notifikasi', 'enabled' => true],
                ['level' => 'SEDANG', 'min' => 31, 'max' => 60, 'color' => '#F59E0B', 'ambang_notifikasi' => 'Notifikasi ke operator', 'enabled' => true],
                ['level' => 'TINGGI', 'min' => 61, 'max' => 100, 'color' => '#EF4444', 'ambang_notifikasi' => 'Notifikasi ke semua', 'enabled' => true],
            ],
            'notificationSettings' => [
                ['channel' => 'WHATSAPP', 'rendah' => false, 'sedang' => true, 'tinggi' => true, 'sangat_tinggi' => true],
                ['channel' => 'SMS', 'rendah' => false, 'sedang' => false, 'tinggi' => true, 'sangat_tinggi' => true],
                ['channel' => 'EMAIL', 'rendah' => true, 'sedang' => true, 'tinggi' => true, 'sangat_tinggi' => true],
                ['channel' => 'APLIKASI', 'rendah' => true, 'sedang' => true, 'tinggi' => true, 'sangat_tinggi' => true],
            ],
        ]);
    }
}
