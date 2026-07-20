<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class WilayahApiSeeder extends Seeder
{
    private string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.wilayah_api.url', 'https://api-wilayah-indonesia-two.vercel.app/api');
    }

    public function run(): void
    {
        DB::table('wilayah')->truncate();

        $provinces = $this->fetch('provinces');
        $provinceMap = [];
        foreach ($provinces as $p) {
            $provinceMap[$p['code']] = $p['name'];
        }

        $cities = $this->fetch('cities');
        $cityMap = [];
        foreach ($cities as $c) {
            $cityMap[$c['code']] = [
                'name' => $c['name'],
                'province_code' => $c['province_code'] ?? $c['code'] ?? substr($c['code'], 0, 2),
            ];
        }

        $districts = $this->fetch('districts');
        $districtMap = [];
        foreach ($districts as $d) {
            $districtMap[$d['code']] = [
                'name' => $d['name'],
                'city_code' => $d['city_code'],
            ];
        }

        $villages = $this->fetch('villages');

        $records = [];
        $batchSize = 1000;
        $count = 0;

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

            $provinceCode = substr($cityCode, 0, 2);
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

            $count++;

            if (count($records) >= $batchSize) {
                DB::table('wilayah')->insert($records);
                $records = [];
            }
        }

        if (! empty($records)) {
            DB::table('wilayah')->insert($records);
        }

        $total = DB::table('wilayah')->count();
    }

    private function fetch(string $endpoint): array
    {
        $response = Http::timeout(60)->withHeaders([
            'User-Agent' => 'DisasterIntelligenceBPBD/1.0',
        ])->get("{$this->baseUrl}/{$endpoint}");

        if ($response->failed()) {
            return [];
        }

        $json = $response->json();

        return $json['data'] ?? [];
    }
}
