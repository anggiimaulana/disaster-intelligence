<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class WilayahSyncCoords extends Command
{
    protected $signature = 'wilayah:sync-coords {--dry-run : Show what would be updated}';

    protected $description = 'Sync coordinates from CSV to wilayah table (kecamatan-level matching)';

    public function handle(): int
    {
        $csvPath = base_path('data/wilayah/village_coords.csv');
        if (! file_exists($csvPath)) {
            $this->error('CSV not found: '.$csvPath);

            return self::FAILURE;
        }

        $dryRun = $this->option('dry-run');

        // Step 1: Build kecamatan coordinate map from CSV
        $handle = fopen($csvPath, 'r');
        if ($handle === false) {
            return self::FAILURE;
        }

        $headers = fgetcsv($handle);
        $headerMap = array_flip($headers);

        // Group by kecamatan name → collect lat/lng
        $kecamatanCoords = []; // kecamatan => ['lat' => [...], 'lng' => [...]]

        while (($row = fgetcsv($handle)) !== false) {
            $district = $row[$headerMap['district']] ?? '';
            $subDistrict = $row[$headerMap['sub_district']] ?? '';
            $lng = (float) ($row[$headerMap['approx_long']] ?? 0);
            $lat = (float) ($row[$headerMap['approx_lat']] ?? 0);

            if ($lat == 0 || $lng == 0) {
                continue;
            }

            $kecamatanName = ucwords(strtolower(trim($subDistrict)));

            if (! isset($kecamatanCoords[$kecamatanName])) {
                $kecamatanCoords[$kecamatanName] = ['lats' => [], 'lngs' => []];
            }
            $kecamatanCoords[$kecamatanName]['lats'][] = $lat;
            $kecamatanCoords[$kecamatanName]['lngs'][] = $lng;
        }
        fclose($handle);

        // Calculate centroid for each kecamatan
        $kecamatanCentroids = [];
        foreach ($kecamatanCoords as $name => $coords) {
            $kecamatanCentroids[$name] = [
                'lat' => array_sum($coords['lats']) / count($coords['lats']),
                'lng' => array_sum($coords['lngs']) / count($coords['lngs']),
            ];
        }

        $this->info('CSV kecamatan centroids: '.count($kecamatanCentroids));

        // Step 2: Find DB kecamatan without coordinates
        $dbKecamatan = DB::table('wilayah')
            ->whereNull('latitude')
            ->whereNotNull('kecamatan')
            ->select('kode_kecamatan', 'kecamatan')
            ->distinct('kode_kecamatan')
            ->get()
            ->keyBy('kecamatan');

        $this->info('DB kecamatan without coords: '.count($dbKecamatan));

        // Step 3: Match and update
        $matched = 0;
        $notMatched = 0;

        foreach ($dbKecamatan as $kecamatanName => $kec) {
            $centroid = $kecamatanCentroids[$kecamatanName] ?? null;

            if (! $centroid) {
                $notMatched++;

                continue;
            }

            if ($dryRun) {
                $this->line("  [DRY] {$kecamatanName}: {$centroid['lat']}, {$centroid['lng']}");
                $matched++;

                continue;
            }

            // Update all records in this kecamatan
            DB::table('wilayah')
                ->where('kode_kecamatan', $kec->kode_kecamatan)
                ->whereNull('latitude')
                ->update([
                    'latitude' => $centroid['lat'],
                    'longitude' => $centroid['lng'],
                ]);

            $matched++;
        }

        $this->info('=== SYNC COMPLETE ===');
        $this->info("Matched: {$matched} kecamatan");
        $this->info("Not matched: {$notMatched} kecamatan");

        // Final stats
        $withCoords = DB::table('wilayah')->whereNotNull('latitude')->count();
        $total = DB::table('wilayah')->count();
        $this->info("Total desa with coords: {$withCoords}/{$total}");

        return self::SUCCESS;
    }
}
