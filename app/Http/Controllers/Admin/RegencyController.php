<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportedRegency;
use App\Models\Wilayah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class RegencyController extends Controller
{
    private array $jawaBarat = [
        ['code' => '3201', 'name' => 'KABUPATEN BOGOR'],
        ['code' => '3202', 'name' => 'KABUPATEN SUKABUMI'],
        ['code' => '3203', 'name' => 'KABUPATEN CIANJUR'],
        ['code' => '3204', 'name' => 'KABUPATEN BANDUNG'],
        ['code' => '3205', 'name' => 'KABUPATEN GARUT'],
        ['code' => '3206', 'name' => 'KABUPATEN TASIKMALAYA'],
        ['code' => '3207', 'name' => 'KABUPATEN CIAMIS'],
        ['code' => '3208', 'name' => 'KABUPATEN KUNINGAN'],
        ['code' => '3209', 'name' => 'KABUPATEN CIREBON'],
        ['code' => '3210', 'name' => 'KABUPATEN MAJALENGKA'],
        ['code' => '3211', 'name' => 'KABUPATEN SUMEDANG'],
        ['code' => '3212', 'name' => 'KABUPATEN INDRAMAYU'],
        ['code' => '3213', 'name' => 'KABUPATEN SUBANG'],
        ['code' => '3214', 'name' => 'KABUPATEN PURWAKARTA'],
        ['code' => '3215', 'name' => 'KABUPATEN KARAWANG'],
        ['code' => '3216', 'name' => 'KABUPATEN BEKASI'],
        ['code' => '3217', 'name' => 'KABUPATEN BANDUNG BARAT'],
        ['code' => '3218', 'name' => 'KABUPATEN PANGANDARAN'],
        ['code' => '3271', 'name' => 'KOTA BOGOR'],
        ['code' => '3272', 'name' => 'KOTA SUKABUMI'],
        ['code' => '3273', 'name' => 'KOTA BANDUNG'],
        ['code' => '3274', 'name' => 'KOTA CIREBON'],
        ['code' => '3275', 'name' => 'KOTA BEKASI'],
        ['code' => '3276', 'name' => 'KOTA DEPOK'],
        ['code' => '3277', 'name' => 'KOTA CIMAHI'],
        ['code' => '3278', 'name' => 'KOTA TASIKMALAYA'],
        ['code' => '3279', 'name' => 'KOTA BANJAR'],
    ];

    public function index()
    {
        foreach ($this->jawaBarat as $regency) {
            SupportedRegency::updateOrCreate(
                ['code' => $regency['code']],
                [
                    'name' => $regency['name'],
                    'province_code' => '32',
                ]
            );
        }

        $regencies = SupportedRegency::orderBy('code')->get();
        $this->clearRegencyCache();

        $activeRegencyNames = $regencies
            ->where('is_active', true)
            ->pluck('name')
            ->map(fn ($name) => preg_replace('/^(KABUPATEN|KOTA)\s+/i', '', $name))
            ->map(fn ($name) => ucwords(strtolower(trim($name))))
            ->toArray();

        $wilayahData = Wilayah::whereIn('kabupaten', $activeRegencyNames)
            ->select('kabupaten', 'kecamatan', 'desa', 'latitude', 'longitude')
            ->orderBy('kabupaten')
            ->orderBy('kecamatan')
            ->orderBy('desa')
            ->get()
            ->groupBy('kabupaten')
            ->map(function ($items, $kabupaten) {
                return [
                    'kabupaten' => $kabupaten,
                    'kecamatan' => $items->groupBy('kecamatan')->map(function ($desaItems, $kecamatan) {
                        return [
                            'kecamatan' => $kecamatan,
                            'desa' => $desaItems->unique('desa')->values()->map(function ($item) {
                                return [
                                    'desa' => $item->desa,
                                    'latitude' => $item->latitude,
                                    'longitude' => $item->longitude,
                                ];
                            }),
                        ];
                    })->values(),
                ];
            })
            ->values();

        return Inertia::render('disaster/regencies', [
            'title' => 'Pengaturan Wilayah — Jawa Barat',
            'supportedRegencies' => $regencies,
            'wilayahData' => $wilayahData,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:10',
            'name' => 'required|string|max:100',
            'province_code' => 'required|string|max:10',
        ]);

        SupportedRegency::updateOrCreate(
            ['code' => $request->code],
            [
                'name' => $request->name,
                'province_code' => $request->province_code,
                'is_active' => true,
            ]
        );
        $this->clearRegencyCache();

        return back()->with('success', 'Wilayah berhasil ditambahkan.');
    }

    public function toggle(SupportedRegency $regency)
    {
        $regency->update(['is_active' => ! $regency->is_active]);
        $this->clearRegencyCache();

        return back()->with('success', 'Status wilayah berhasil diubah.');
    }

    public function destroy(SupportedRegency $regency)
    {
        $regency->delete();
        $this->clearRegencyCache();

        return back()->with('success', 'Wilayah berhasil dihapus.');
    }

    private function clearRegencyCache(): void
    {
        Cache::forget('kabupaten_list_v2');
        Cache::forget('kabupaten_list_api_v2');
    }
}
