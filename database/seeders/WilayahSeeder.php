<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WilayahSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Anjatan', 'desa' => 'Anjatan'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Anjatan', 'desa' => 'Ciwaringin'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Anjatan', 'desa' => 'Kertawinangun'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Arahan', 'desa' => 'Arahan'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Arahan', 'desa' => 'Cikedung'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Arahan', 'desa' => 'Karangampel'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Balongan', 'desa' => 'Balongan'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Balongan', 'desa' => 'Pasekan'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Bangodua', 'desa' => 'Bangodua'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Bangodua', 'desa' => 'Cibeureum'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Bongas', 'desa' => 'Bongas'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Bongas', 'desa' => 'Cikedung'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Cantigi', 'desa' => 'Cantigi'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Cantigi', 'desa' => 'Kedungwuni'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Cikedung', 'desa' => 'Cikedung'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Cikedung', 'desa' => 'Cikedung Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Gabuswetan', 'desa' => 'Gabuswetan'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Gabuswetan', 'desa' => 'Kaliwlingi'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Gantar', 'desa' => 'Gantar'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Gantar', 'desa' => 'Gantar Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Haurgeulis', 'desa' => 'Haurgeulis'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Haurgeulis', 'desa' => 'Cikedung'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Indramayu', 'desa' => 'Indramayu'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Indramayu', 'desa' => 'Alun-alun'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Indramayu', 'desa' => 'Karanganyar'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Indramayu', 'desa' => 'Lohbener'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Jatibarang', 'desa' => 'Jatibarang'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Jatibarang', 'desa' => 'Jatibarang Lor'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Jatibarang', 'desa' => 'Polindra'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Juntinyuat', 'desa' => 'Juntinyuat'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Juntinyuat', 'desa' => 'Sukagumiwang'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kandanghaur', 'desa' => 'Kandanghaur'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kandanghaur', 'desa' => 'Kandanghaur Kidul'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Karangampel', 'desa' => 'Karangampel'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Karangampel', 'desa' => 'Karangampel Kidul'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kedokan Bunder', 'desa' => 'Kedokan Bunder'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kedokan Bunder', 'desa' => 'Kedokan Bunder Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kertasemaya', 'desa' => 'Kertasemaya'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kertasemaya', 'desa' => 'Kertasemaya Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Krangkeng', 'desa' => 'Krangkeng'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Krangkeng', 'desa' => 'Krangkeng Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kroya', 'desa' => 'Kroya'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kroya', 'desa' => 'Kroya Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Lelea', 'desa' => 'Lelea'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Lelea', 'desa' => 'Lelea Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Lohbener', 'desa' => 'Lohbener'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Lohbener', 'desa' => 'Lohbener Kidul'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Lohbener', 'desa' => 'Polindra'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Losarang', 'desa' => 'Losarang'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Losarang', 'desa' => 'Losarang Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Pasekan', 'desa' => 'Pasekan'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Pasekan', 'desa' => 'Pasekan Kidul'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Patrol', 'desa' => 'Patrol'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Patrol', 'desa' => 'Patrol Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sindang', 'desa' => 'Sindang'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sindang', 'desa' => 'Sindang Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sliyeg', 'desa' => 'Sliyeg'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sliyeg', 'desa' => 'Sliyeg Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sukagumiwang', 'desa' => 'Sukagumiwang'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sukagumiwang', 'desa' => 'Sukagumiwang Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sukra', 'desa' => 'Sukra'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sukra', 'desa' => 'Sukra Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Terisi', 'desa' => 'Terisi'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Terisi', 'desa' => 'Terisi Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Tukdana', 'desa' => 'Tukdana'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Tukdana', 'desa' => 'Tukdana Lor'],

            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Widasari', 'desa' => 'Widasari'],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Widasari', 'desa' => 'Widasari Kidul'],
        ];

        foreach ($data as $item) {
            DB::table('wilayah')->updateOrInsert(
                [
                    'provinsi' => $item['provinsi'],
                    'kabupaten' => $item['kabupaten'],
                    'kecamatan' => $item['kecamatan'],
                    'desa' => $item['desa'],
                ],
                $item
            );
        }

        $this->command->info('Wilayah seeded successfully with '.count($data).' records.');
    }
}
