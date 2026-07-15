<?php

namespace App\Console\Commands;

use App\Models\Wilayah;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class SeedWilayahFromApi extends Command
{
    protected $signature = 'wilayah:seed-api {--province= : Specific province code (e.g. 32 for Jawa Barat). Leave empty for ALL.}';
    protected $description = 'Seed wilayah data from wilayah.id API for all Indonesia or specific province';

    public function handle(): int
    {
        $baseUrl = 'https://wilayah.id/api';
        $targetProvince = $this->option('province');

        // 1. Get all provinces
        $this->info('Fetching provinces...');
        $provincesResponse = Http::timeout(30)->get("{$baseUrl}/provinces.json");
        if (! $provincesResponse->successful()) {
            $this->error('Failed to fetch provinces: ' . $provincesResponse->status());
            return self::FAILURE;
        }

        $provinces = $provincesResponse->json('data', []);

        if ($targetProvince) {
            $provinces = array_filter($provinces, fn ($p) => $p['code'] === $targetProvince);
        }

        $this->info('Processing ' . count($provinces) . ' provinces...');

        $totalKecamatan = 0;
        $totalDesa = 0;
        $totalRegencies = 0;

        foreach ($provinces as $province) {
            $provinceCode = $province['code'];
            $provinceName = $province['name'];

            $this->newLine();
            $this->info("=== {$provinceName} ({$provinceCode}) ===");

            // 2. Get regencies
            $regenciesResponse = Http::timeout(30)->get("{$baseUrl}/regencies/{$provinceCode}.json");
            if (! $regenciesResponse->successful()) {
                $this->warn("  Failed to fetch regencies for {$provinceName}");
                continue;
            }

            $regencies = $regenciesResponse->json('data', []);
            $totalRegencies += count($regencies);

            foreach ($regencies as $regency) {
                $regencyCode = $regency['code'];
                $regencyName = $regency['name'];

                // 3. Get kecamatan
                $districtsResponse = Http::timeout(30)->get("{$baseUrl}/districts/{$regencyCode}.json");
                if (! $districtsResponse->successful()) {
                    continue;
                }

                $districts = $districtsResponse->json('data', []);

                foreach ($districts as $district) {
                    $districtCode = $district['code'];
                    $districtName = $district['name'];

                    // Create kecamatan record
                    Wilayah::firstOrCreate(
                        ['kecamatan' => $districtName, 'kabupaten' => $regencyName, 'desa' => null],
                        [
                            'provinsi' => $provinceName,
                            'kodepos' => null,
                            'latitude' => -6.9 + (mt_rand(-100, 100) / 100),
                            'longitude' => 107.6 + (mt_rand(-100, 100) / 100),
                        ]
                    );
                    $totalKecamatan++;

                    // 4. Get desa/kelurahan
                    $villagesResponse = Http::timeout(30)->get("{$baseUrl}/villages/{$districtCode}.json");
                    if (! $villagesResponse->successful()) {
                        continue;
                    }

                    $villages = $villagesResponse->json('data', []);

                    foreach ($villages as $village) {
                        Wilayah::firstOrCreate(
                            ['kecamatan' => $districtName, 'kabupaten' => $regencyName, 'desa' => $village['name']],
                            [
                                'provinsi' => $provinceName,
                                'kodepos' => null,
                                'latitude' => -6.9 + (mt_rand(-100, 100) / 100),
                                'longitude' => 107.6 + (mt_rand(-100, 100) / 100),
                            ]
                        );
                        $totalDesa++;
                    }
                }

                $this->line("  {$regencyName}: " . count($districts) . " kecamatan");
            }

            $this->info("{$provinceName}: " . count($regencies) . " regencies");
        }

        $this->newLine();
        $this->info("=== SEED COMPLETE ===");
        $this->info("Provinces: " . count($provinces));
        $this->info("Regencies: {$totalRegencies}");
        $this->info("Kecamatan: {$totalKecamatan}");
        $this->info("Desa/Kelurahan: {$totalDesa}");
        $this->info("Total records: " . Wilayah::count());

        return self::SUCCESS;
    }
}
