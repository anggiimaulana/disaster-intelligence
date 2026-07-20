<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class NormalizeWilayah extends Command
{
    protected $signature = 'wilayah:normalize';

    protected $description = 'Normalize kabupaten names (remove Kabupaten/Kota prefix)';

    public function handle(): int
    {
        $count = DB::table('wilayah')
            ->where('kabupaten', 'like', 'Kabupaten %')
            ->orWhere('kabupaten', 'like', 'Kota %')
            ->update([
                'kabupaten' => DB::raw("REGEXP_REPLACE(kabupaten, '^(Kabupaten|Kota)\\s+', '', 'i')"),
            ]);

        $this->info("Normalized {$count} records.");

        // Capitalize properly
        $rows = DB::table('wilayah')->select('kabupaten')->distinct()->get();
        foreach ($rows as $row) {
            $proper = ucwords(strtolower($row->kabupaten));
            if ($proper !== $row->kabupaten) {
                DB::table('wilayah')->where('kabupaten', $row->kabupaten)->update(['kabupaten' => $proper]);
            }
        }

        $this->info('Capitalized all kabupaten names.');
        $this->info('Total records: '.DB::table('wilayah')->count());
        $this->info('Distinct kabupaten: '.DB::table('wilayah')->distinct('kabupaten')->count('kabupaten'));

        return self::SUCCESS;
    }
}
