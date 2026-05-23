<?php

namespace App\Http\Controllers\Peringatan;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PeringatanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('disaster/alerts', [
            'stats' => [
                'alertAktif' => ['value' => 5, 'delta' => 2, 'trend' => [2, 3, 1, 4, 2, 3, 5]],
                'risikoTinggi' => ['value' => 3, 'label' => 'Alert tinggi', 'trend' => [1, 2, 1, 2, 1, 2, 3]],
                'risikoSedang' => ['value' => 2, 'label' => 'Alert sedang', 'trend' => [1, 1, 0, 2, 1, 1, 2]],
                'notifikasiTerkirim' => ['value' => 1247, 'label' => 'Total terkirim', 'trend' => [150, 180, 200, 170, 220, 190, 247]],
                'penerimaNotifikasi' => ['value' => 3456, 'label' => 'Total penerima', 'trend' => [400, 450, 500, 480, 520, 490, 556]],
            ],
            'activeAlerts' => [
                ['id' => '1', 'judul' => 'Peringatan Banjir - Karanganyar', 'lokasi' => 'Jl. Merdeka', 'kecamatan' => 'Karanganyar', 'waktu' => '10:35 WIB', 'risk_level' => 'TINGGI', 'is_new' => true, 'time_ago' => 'Baru saja'],
                ['id' => '2', 'judul' => 'Peringatan Longsor - Cibeureum', 'lokasi' => 'Bukit Indah', 'kecamatan' => 'Cibeureum', 'waktu' => '09:22 WIB', 'risk_level' => 'SEDANG', 'is_new' => false, 'time_ago' => '47 menit lalu'],
                ['id' => '3', 'judul' => 'Peringatan Banjir - Kawalu', 'lokasi' => 'Bantaran Sungai', 'kecamatan' => 'Kawalu', 'waktu' => '06:30 WIB', 'risk_level' => 'TINGGI', 'is_new' => false, 'time_ago' => '4 jam lalu'],
            ],
            'riwayatPeringatan' => [
                ['id' => '1', 'judul' => 'Peringatan Banjir Karanganyar', 'wilayah' => 'Kec. Karanganyar', 'tingkat' => 'TINGGI', 'waktu_dibuat' => '23 Mei 2026, 10:35', 'status' => 'Aktif'],
                ['id' => '2', 'judul' => 'Peringatan Longsor Cibeureum', 'wilayah' => 'Kec. Cibeureum', 'tingkat' => 'SEDANG', 'waktu_dibuat' => '23 Mei 2026, 09:22', 'status' => 'Aktif'],
                ['id' => '3', 'judul' => 'Peringatan Angin Kencang', 'wilayah' => 'Kec. Tamansari', 'tingkat' => 'SEDANG', 'waktu_dibuat' => '22 Mei 2026, 14:00', 'status' => 'Selesai'],
            ],
            'distribusiNotifikasi' => [
                'total' => 1247,
                'channels' => [
                    ['label' => 'WhatsApp', 'count' => 680, 'pct' => 55, 'color' => '#22C55E'],
                    ['label' => 'SMS', 'count' => 312, 'pct' => 25, 'color' => '#3B82F6'],
                    ['label' => 'Email', 'count' => 155, 'pct' => 12, 'color' => '#F59E0B'],
                    ['label' => 'Aplikasi', 'count' => 100, 'pct' => 8, 'color' => '#8B5CF6'],
                ],
                'berhasil' => ['count' => 1180, 'pct' => 95],
                'gagal' => ['count' => 42, 'pct' => 3],
                'pending' => ['count' => 25, 'pct' => 2],
            ],
            'targetNotifikasi' => [
                ['label' => 'Grup WhatsApp BPBD', 'icon' => 'message-circle', 'count' => 45],
                ['label' => 'Warga Terdampak', 'icon' => 'users', 'count' => 2800],
                ['label' => 'Perangkat Desa', 'icon' => 'building', 'count' => 156],
                ['label' => 'Relawan', 'icon' => 'heart', 'count' => 455],
            ],
        ]);
    }
}
