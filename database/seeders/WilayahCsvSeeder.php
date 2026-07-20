<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WilayahCsvSeeder extends Seeder
{
    private string $dataPath;

    public function run(): void
    {
        $this->dataPath = base_path('data/wilayah');

        if (! is_dir($this->dataPath)) {
            return;
        }

        DB::table('wilayah')->truncate();

        $provinces = $this->readCsv('provinces.csv');
        $cities = $this->readCsv('cities.csv');
        $districts = $this->readCsv('districts.csv');
        $villages = $this->readCsv('villages.csv');

        // Build lookup maps
        $provinceMap = [];
        foreach ($provinces as $p) {
            $provinceMap[$p['code']] = $p['name'];
        }

        $cityMap = [];
        foreach ($cities as $c) {
            $cityMap[$c['code']] = [
                'name' => $c['name'],
                'province_code' => $c['province_code'],
            ];
        }

        $districtMap = [];
        foreach ($districts as $d) {
            $districtMap[$d['code']] = [
                'name' => $d['name'],
                'city_code' => $d['city_code'],
            ];
        }

        // Insert villages (most granular level)
        $records = [];
        $batchSize = 1000;

        foreach ($villages as $v) {
            $districtCode = $v['district_code'];
            $district = $districtMap[$districtCode] ?? null;
            if (! $district) {
                continue;
            }

            $cityCode = $district['city_code'];
            $city = $cityMap[$cityCode] ?? null;
            if (! $city) {
                continue;
            }

            $provinceCode = $city['province_code'];
            $provinceName = $provinceMap[$provinceCode] ?? null;
            if (! $provinceName) {
                continue;
            }

            // Clean city name: "Kab. Indramayu" → "Indramayu"
            $kabupatenName = preg_replace('/^(Kab\.|Kota)\s+/i', '', $city['name']);
            $kabupatenName = ucwords(strtolower(trim($kabupatenName)));

            $records[] = [
                'provinsi' => $provinceName,
                'kode_provinsi' => $provinceCode,
                'kabupaten' => $kabupatenName,
                'kode_kabupaten' => $cityCode,
                'kecamatan' => $district['name'],
                'kode_kecamatan' => $districtCode,
                'desa' => $v['name'],
                'kode_desa' => $v['code'],
                'kodepos' => null,
                'latitude' => null,
                'longitude' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if (count($records) >= $batchSize) {
                DB::table('wilayah')->insert($records);
                $records = [];
            }
        }

        // Insert remaining records
        if (! empty($records)) {
            DB::table('wilayah')->insert($records);
        }
    }

    private function readCsv(string $filename): array
    {
        $path = $this->dataPath.'/'.$filename;
        if (! file_exists($path)) {
            return [];
        }

        $handle = fopen($path, 'r');
        if ($handle === false) {
            return [];
        }

        // Read header
        $headers = fgetcsv($handle);
        if ($headers === false) {
            fclose($handle);

            return [];
        }

        $headers = array_map('trim', $headers);
        $data = [];

        while (($row = fgetcsv($handle)) !== false) {
            if (count($row) !== count($headers)) {
                continue;
            }

            $data[] = array_combine($headers, $row);
        }

        fclose($handle);

        return $data;
    }
}
