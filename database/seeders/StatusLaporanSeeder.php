<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusLaporanSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['id' => 1, 'nama_status' => 'Menunggu', 'warna' => '#9E9E9E'],
            ['id' => 2, 'nama_status' => 'Diproses', 'warna' => '#03A9F4'],
            ['id' => 3, 'nama_status' => 'Warning', 'warna' => '#FFC107'],
            ['id' => 4, 'nama_status' => 'Darurat', 'warna' => '#F44336'],
            ['id' => 5, 'nama_status' => 'Selesai', 'warna' => '#4CAF50'],
            ['id' => 6, 'nama_status' => 'Ditolak', 'warna' => '#795548'],
        ];

        foreach ($data as $item) {
            DB::table('status_laporan')->updateOrInsert(
                ['id' => $item['id']],
                $item
            );
        }
    }
}
