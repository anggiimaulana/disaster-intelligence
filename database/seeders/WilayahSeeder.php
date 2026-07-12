<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WilayahSeeder extends Seeder
{
    public function run(): void
    {
        // Sample data for Indramayu kabupaten - kecamatan and desa with coordinates
        $data = [
            // Anjatan
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Anjatan', 'desa' => 'Anjatan', 'latitude' => -6.372532, 'longitude' => 107.946761],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Anjatan', 'desa' => 'Ciwaringin', 'latitude' => -6.365123, 'longitude' => 107.938234],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Anjatan', 'desa' => 'Kertawinangun', 'latitude' => -6.380456, 'longitude' => 107.951789],

            // Arahan
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Arahan', 'desa' => 'Arahan', 'latitude' => -6.360261, 'longitude' => 108.253979],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Arahan', 'desa' => 'Cikedung', 'latitude' => -6.370891, 'longitude' => 108.245632],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Arahan', 'desa' => 'Karangampel', 'latitude' => -6.351234, 'longitude' => 108.267891],

            // Balongan
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Balongan', 'desa' => 'Balongan', 'latitude' => -6.381898, 'longitude' => 108.371611],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Balongan', 'desa' => 'Pasekan', 'latitude' => -6.375623, 'longitude' => 108.382341],

            // Bangodua
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Bangodua', 'desa' => 'Bangodua', 'latitude' => -6.516232, 'longitude' => 108.291483],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Bangodua', 'desa' => 'Cibeureum', 'latitude' => -6.508912, 'longitude' => 108.302145],

            // Bongas
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Bongas', 'desa' => 'Bongas', 'latitude' => -6.381079, 'longitude' => 108.021079],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Bongas', 'desa' => 'Cikedung', 'latitude' => -6.392341, 'longitude' => 108.014567],

            // Cantigi
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Cantigi', 'desa' => 'Cantigi', 'latitude' => -6.336671, 'longitude' => 108.249001],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Cantigi', 'desa' => 'Kedungwuni', 'latitude' => -6.345678, 'longitude' => 108.258921],

            // Cikedung
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Cikedung', 'desa' => 'Cikedung', 'latitude' => -6.501886, 'longitude' => 108.181326],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Cikedung', 'desa' => 'Cikedung Lor', 'latitude' => -6.498761, 'longitude' => 108.189432],

            // Gabuswetan
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Gabuswetan', 'desa' => 'Gabuswetan', 'latitude' => -6.435380, 'longitude' => 108.069649],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Gabuswetan', 'desa' => 'Kaliwlingi', 'latitude' => -6.428912, 'longitude' => 108.076234],

            // Gantar
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Gantar', 'desa' => 'Gantar', 'latitude' => -6.535662, 'longitude' => 107.945367],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Gantar', 'desa' => 'Gantar Lor', 'latitude' => -6.528912, 'longitude' => 107.952341],

            // Haurgeulis
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Haurgeulis', 'desa' => 'Haurgeulis', 'latitude' => -6.453552, 'longitude' => 107.937276],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Haurgeulis', 'desa' => 'Cikedung', 'latitude' => -6.461234, 'longitude' => 107.928912],

            // Indramayu (Kota)
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Indramayu', 'desa' => 'Indramayu', 'latitude' => -6.343098, 'longitude' => 108.330180],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Indramayu', 'desa' => 'Alun-alun', 'latitude' => -6.340234, 'longitude' => 108.328912],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Indramayu', 'desa' => 'Karanganyar', 'latitude' => -6.351234, 'longitude' => 108.338921],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Indramayu', 'desa' => 'Lohbener', 'latitude' => -6.338912, 'longitude' => 108.325678],

            // Jatibarang
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Jatibarang', 'desa' => 'Jatibarang', 'latitude' => -6.444092, 'longitude' => 108.308969],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Jatibarang', 'desa' => 'Jatibarang Lor', 'latitude' => -6.438912, 'longitude' => 108.315678],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Jatibarang', 'desa' => 'Polindra', 'latitude' => -6.442341, 'longitude' => 108.312341],

            // Juntinyuat
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Juntinyuat', 'desa' => 'Juntinyuat', 'latitude' => -6.433649, 'longitude' => 108.412843],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Juntinyuat', 'desa' => 'Sukagumiwang', 'latitude' => -6.428912, 'longitude' => 108.405678],

            // Kandanghaur
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kandanghaur', 'desa' => 'Kandanghaur', 'latitude' => -6.357974, 'longitude' => 108.090547],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kandanghaur', 'desa' => 'Kandanghaur Kidul', 'latitude' => -6.365432, 'longitude' => 108.098234],

            // Karangampel
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Karangampel', 'desa' => 'Karangampel', 'latitude' => -6.470611, 'longitude' => 108.450573],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Karangampel', 'desa' => 'Karangampel Kidul', 'latitude' => -6.478912, 'longitude' => 108.458912],

            // Kedokan Bunder
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kedokan Bunder', 'desa' => 'Kedokan Bunder', 'latitude' => -6.496816, 'longitude' => 108.417100],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kedokan Bunder', 'desa' => 'Kedokan Bunder Lor', 'latitude' => -6.489123, 'longitude' => 108.425678],

            // Kertasemaya
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kertasemaya', 'desa' => 'Kertasemaya', 'latitude' => -6.520550, 'longitude' => 108.368326],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kertasemaya', 'desa' => 'Kertasemaya Lor', 'latitude' => -6.512341, 'longitude' => 108.375678],

            // Krangkeng
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Krangkeng', 'desa' => 'Krangkeng', 'latitude' => -6.520126, 'longitude' => 108.476681],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Krangkeng', 'desa' => 'Krangkeng Lor', 'latitude' => -6.515678, 'longitude' => 108.484321],

            // Kroya
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kroya', 'desa' => 'Kroya', 'latitude' => -6.484710, 'longitude' => 108.042856],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Kroya', 'desa' => 'Kroya Lor', 'latitude' => -6.478912, 'longitude' => 108.050234],

            // Lelea
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Lelea', 'desa' => 'Lelea', 'latitude' => -6.458789, 'longitude' => 108.227784],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Lelea', 'desa' => 'Lelea Lor', 'latitude' => -6.451234, 'longitude' => 108.235678],

            // Lohbener
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Lohbener', 'desa' => 'Lohbener', 'latitude' => -6.405672, 'longitude' => 108.262739],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Lohbener', 'desa' => 'Lohbener Kidul', 'latitude' => -6.412341, 'longitude' => 108.258912],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Lohbener', 'desa' => 'Polindra', 'latitude' => -6.408912, 'longitude' => 108.265678],

            // Losarang
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Losarang', 'desa' => 'Losarang', 'latitude' => -6.400017, 'longitude' => 108.164470],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Losarang', 'desa' => 'Losarang Lor', 'latitude' => -6.395678, 'longitude' => 108.172341],

            // Pasekan
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Pasekan', 'desa' => 'Pasekan', 'latitude' => -6.297226, 'longitude' => 108.322564],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Pasekan', 'desa' => 'Pasekan Kidul', 'latitude' => -6.305678, 'longitude' => 108.330123],

            // Patrol
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Patrol', 'desa' => 'Patrol', 'latitude' => -6.318266, 'longitude' => 107.995169],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Patrol', 'desa' => 'Patrol Lor', 'latitude' => -6.310234, 'longitude' => 108.002341],

            // Sindang
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sindang', 'desa' => 'Sindang', 'latitude' => -6.341285, 'longitude' => 108.310468],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sindang', 'desa' => 'Sindang Lor', 'latitude' => -6.335678, 'longitude' => 108.318912],

            // Sliyeg
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sliyeg', 'desa' => 'Sliyeg', 'latitude' => -6.454214, 'longitude' => 108.347047],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sliyeg', 'desa' => 'Sliyeg Lor', 'latitude' => -6.448912, 'longitude' => 108.355678],

            // Sukagumiwang
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sukagumiwang', 'desa' => 'Sukagumiwang', 'latitude' => -6.578767, 'longitude' => 108.316760],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sukagumiwang', 'desa' => 'Sukagumiwang Lor', 'latitude' => -6.571234, 'longitude' => 108.324567],

            // Sukra
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sukra', 'desa' => 'Sukra', 'latitude' => -6.303870, 'longitude' => 107.946197],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Sukra', 'desa' => 'Sukra Lor', 'latitude' => -6.298912, 'longitude' => 107.954321],

            // Terisi
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Terisi', 'desa' => 'Terisi', 'latitude' => -6.493468, 'longitude' => 108.134793],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Terisi', 'desa' => 'Terisi Lor', 'latitude' => -6.487612, 'longitude' => 108.142341],

            // Tukdana
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Tukdana', 'desa' => 'Tukdana', 'latitude' => -6.561291, 'longitude' => 108.290927],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Tukdana', 'desa' => 'Tukdana Lor', 'latitude' => -6.555678, 'longitude' => 108.298912],

            // Widasari
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Widasari', 'desa' => 'Widasari', 'latitude' => -6.460692, 'longitude' => 108.279555],
            ['provinsi' => 'Jawa Barat', 'kabupaten' => 'Indramayu', 'kecamatan' => 'Widasari', 'desa' => 'Widasari Kidul', 'latitude' => -6.454321, 'longitude' => 108.287654],
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
