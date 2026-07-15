<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Wilayah;

class WilayahController extends Controller
{
    public function districts(string $regency)
    {
        $districts = Wilayah::query()
            ->where('kabupaten', $regency)
            ->select('kecamatan')
            ->distinct()
            ->orderBy('kecamatan')
            ->get()
            ->pluck('kecamatan')
            ->values();

        return response()->json(['data' => $districts]);
    }

    public function villages(string $district, ?string $kabupaten = null)
    {
        $query = Wilayah::query()
            ->where('kecamatan', $district);

        if ($kabupaten) {
            $normalized = preg_replace('/^(KABUPATEN|KOTA)\s+/i', '', $kabupaten);
            $normalized = ucwords(strtolower(trim($normalized)));
            $query->where('kabupaten', $normalized);
        }

        $villages = $query->select('desa')
            ->distinct()
            ->orderBy('desa')
            ->get()
            ->pluck('desa')
            ->values();

        return response()->json(['data' => $villages]);
    }
}
