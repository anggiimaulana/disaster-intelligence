<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Wilayah;
use Illuminate\Support\Facades\Http;

class WilayahController extends Controller
{
    public function districts(string $regency)
    {
        $query = Wilayah::query();

        if (ctype_digit($regency)) {
            $query->where('kode_kabupaten', $regency);
        } else {
            $normalized = preg_replace('/^(KABUPATEN|KOTA)\s+/i', '', $regency);
            $normalized = ucwords(strtolower(trim($normalized)));
            $query->where('kabupaten', $normalized);
        }

        $dbDistricts = $query->select('kode_kecamatan', 'kecamatan')
            ->distinct()
            ->orderBy('kecamatan')
            ->get()
            ->map(fn ($d) => [
                'code' => $d->kode_kecamatan,
                'name' => $d->kecamatan,
            ])
            ->values();

        $districts = collect();
        if ($dbDistricts->isNotEmpty()) {
            $districts = $dbDistricts;
        } else {
            $apiUrl = config('services.wilayah_api.url');
            if ($apiUrl && ctype_digit($regency)) {
                $response = Http::get("{$apiUrl}/districts/{$regency}.json");
                if ($response->successful()) {
                    $districts = collect($response->json())->map(fn ($d) => [
                        'code' => $d['id'],
                        'name' => $d['name'],
                    ])->values();
                }
            }
        }

        return response()->json(['data' => $districts]);
    }

    public function villages(string $district, ?string $kabupaten = null)
    {
        $query = Wilayah::query();

        // Support both code and name for kecamatan
        if (ctype_digit($district)) {
            $query->where('kode_kecamatan', $district);
        } else {
            $query->where('kecamatan', $district);
        }

        if ($kabupaten) {
            if (ctype_digit($kabupaten)) {
                $query->where('kode_kabupaten', $kabupaten);
            } else {
                $normalized = preg_replace('/^(KABUPATEN|KOTA)\s+/i', '', $kabupaten);
                $normalized = ucwords(strtolower(trim($normalized)));
                $query->where('kabupaten', $normalized);
            }
        }

        $dbVillages = $query->select('kode_desa', 'desa')
            ->distinct()
            ->orderBy('desa')
            ->get()
            ->map(fn ($v) => [
                'code' => $v->kode_desa,
                'name' => $v->desa,
            ])
            ->values();

        $villages = collect();
        if ($dbVillages->isNotEmpty()) {
            $villages = $dbVillages;
        } else {
            $apiUrl = config('services.wilayah_api.url');
            if ($apiUrl && ctype_digit($district)) {
                $response = Http::get("{$apiUrl}/villages/{$district}.json");
                if ($response->successful()) {
                    $villages = collect($response->json())->map(fn ($v) => [
                        'code' => $v['id'],
                        'name' => $v['name'],
                    ])->values();
                }
            }
        }

        return response()->json(['data' => $villages]);
    }
}
