<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Wilayah;

class WilayahController extends Controller
{
    public function districts(string $regency)
    {
        // Support both code (3212) and name (Indramayu)
        $query = Wilayah::query();

        if (ctype_digit($regency)) {
            $query->where('kode_kabupaten', $regency);
        } else {
            $normalized = preg_replace('/^(KABUPATEN|KOTA)\s+/i', '', $regency);
            $normalized = ucwords(strtolower(trim($normalized)));
            $query->where('kabupaten', $normalized);
        }

        $districts = $query->select('kode_kecamatan', 'kecamatan')
            ->distinct()
            ->orderBy('kecamatan')
            ->get()
            ->map(fn ($d) => [
                'code' => $d->kode_kecamatan,
                'name' => $d->kecamatan,
            ])
            ->values();

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

        $villages = $query->select('kode_desa', 'desa')
            ->distinct()
            ->orderBy('desa')
            ->get()
            ->map(fn ($v) => [
                'code' => $v->kode_desa,
                'name' => $v->desa,
            ])
            ->values();

        return response()->json(['data' => $villages]);
    }
}
