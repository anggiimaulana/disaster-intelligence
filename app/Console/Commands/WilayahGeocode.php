<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WilayahGeocode extends Command
{
    protected $signature = 'wilayah:geocode
                            {--province= : Specific province code (e.g., 32 for Jawa Barat)}
                            {--limit= : Max kecamatan to geocode}
                            {--dry-run : Show what would be geocoded without updating}';

    protected $description = 'Geocode kecamatan coordinates via Nominatim (OpenStreetMap)';

    private int $successCount = 0;

    private int $failCount = 0;

    private int $skipCount = 0;

    public function handle(): int
    {
        $province = $this->option('province');
        $limit = $this->option('limit') ? (int) $this->option('limit') : null;
        $dryRun = $this->option('dry-run');

        // Get unique kecamatan that need geocoding
        $query = DB::table('wilayah')
            ->whereNull('latitude')
            ->whereNull('longitude')
            ->whereNotNull('kecamatan')
            ->select('kode_kecamatan', 'kecamatan', 'kabupaten', 'kode_kabupaten', 'provinsi', 'kode_provinsi')
            ->groupBy('kode_kecamatan', 'kecamatan', 'kabupaten', 'kode_kabupaten', 'provinsi', 'kode_provinsi');

        if ($province) {
            $query->where('kode_provinsi', $province);
        }

        $kecamatanList = $query->get();

        if ($kecamatanList->isEmpty()) {
            $this->info('All kecamatan already have coordinates.');

            return self::SUCCESS;
        }

        $total = $kecamatanList->count();
        if ($limit) {
            $kecamatanList = $kecamatanList->take($limit);
        }

        $this->info("Found {$total} kecamatan without coordinates.");
        $this->info('Will geocode: '.$kecamatanList->count().' kecamatan');
        $this->info('Rate limit: 1 request/second (Nominatim policy)');
        $this->newLine();

        if ($dryRun) {
            foreach ($kecamatanList as $k) {
                $this->line("  [DRY RUN] {$k->kecamatan}, {$k->kabupaten}, {$k->provinsi}");
            }
            $this->info('Dry run complete. No changes made.');

            return self::SUCCESS;
        }

        $bar = $this->output->createProgressBar($kecamatanList->count());
        $bar->start();

        foreach ($kecamatanList as $kecamatan) {
            $this->geocodeKecamatan($kecamatan);
            $bar->advance();

            // Nominatim rate limit: 1 req/sec
            usleep(1100000); // 1.1 seconds
        }

        $bar->finish();
        $this->newLine(2);

        $this->info('=== GEOCODE COMPLETE ===');
        $this->info("Success: {$this->successCount}");
        $this->info("Failed: {$this->failCount}");
        $this->info("Skipped: {$this->skipCount}");

        return self::SUCCESS;
    }

    private function geocodeKecamatan(object $kecamatan): void
    {
        $query = "{$kecamatan->kecamatan}, {$kecamatan->kabupaten}, {$kecamatan->provinsi}, Indonesia";

        try {
            $response = Http::timeout(15)->withHeaders([
                'User-Agent' => config('services.nominatim.user_agent', 'DisasterIntelligenceBPBD/1.0'),
            ])->get(config('services.nominatim.base_url', 'https://nominatim.openstreetmap.org').'/search', [
                'q' => $query,
                'format' => 'json',
                'limit' => 1,
                'countrycodes' => 'id',
            ]);

            if ($response->failed()) {
                $this->failCount++;
                Log::warning('Nominatim request failed', [
                    'kecamatan' => $kecamatan->kecamatan,
                    'status' => $response->status(),
                ]);

                return;
            }

            $data = $response->json();

            if (empty($data)) {
                $this->failCount++;
                Log::info('No geocode result', ['kecamatan' => $kecamatan->kecamatan]);

                return;
            }

            $lat = (float) $data[0]['lat'];
            $lng = (float) $data[0]['lon'];

            // Update ALL records in this kecamatan with the coordinates
            $updated = DB::table('wilayah')
                ->where('kode_kecamatan', $kecamatan->kode_kecamatan)
                ->whereNull('latitude')
                ->update([
                    'latitude' => $lat,
                    'longitude' => $lng,
                ]);

            $this->successCount += $updated;

        } catch (\Exception $e) {
            $this->failCount++;
            Log::error('Geocode error', [
                'kecamatan' => $kecamatan->kecamatan,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
