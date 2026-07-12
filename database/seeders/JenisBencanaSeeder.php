<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisBencanaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['kode' => 'BANJIR', 'nama_bencana' => 'Banjir', 'icon' => 'flood.png', 'warna' => '#2196F3'],
            ['kode' => 'ROB', 'nama_bencana' => 'Banjir Rob', 'icon' => 'rob.png', 'warna' => '#00BCD4'],
            ['kode' => 'ABRASI', 'nama_bencana' => 'Abrasi', 'icon' => 'abrasi.png', 'warna' => '#FF9800'],
            ['kode' => 'LONGSOR', 'nama_bencana' => 'Longsor', 'icon' => 'landslide.png', 'warna' => '#795548'],
            ['kode' => 'CUACA', 'nama_bencana' => 'Cuaca Ekstrem', 'icon' => 'storm.png', 'warna' => '#9C27B0'],
            ['kode' => 'KEBAKARAN', 'nama_bencana' => 'Kebakaran', 'icon' => 'fire.png', 'warna' => '#F44336'],
        ];

        foreach ($data as $item) {
            DB::table('jenis_bencana')->updateOrInsert(
                ['kode' => $item['kode']],
                $item
            );
        }
    }
}
