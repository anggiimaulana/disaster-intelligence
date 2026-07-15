<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\ReportRequest;
use App\Models\JenisBencana;
use App\Models\LaporanBencana;
use App\Models\LaporanMedia;
use App\Models\StatusLaporan;
use App\Models\SupportedRegency;
use App\Models\Wilayah;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $supportedRegencies = SupportedRegency::where('is_active', true)->get();
        $disasterTypes = JenisBencana::all();

        return Inertia::render('public/report/index', [
            'title' => 'Lapor Bencana',
            'isSimulation' => true,
            'supportedRegencies' => $supportedRegencies,
            'disasterTypes' => $disasterTypes,
        ]);
    }

    public function store(ReportRequest $request)
    {
        $validated = $request->validated();

        $laporan = DB::transaction(function () use ($validated, $request) {
            $wilayah = Wilayah::firstOrCreate(
                ['desa' => $validated['village_name'], 'kecamatan' => $validated['district_name']],
                [
                    'provinsi' => 'Jawa Barat',
                    'kabupaten' => $validated['regency_name'],
                    'kecamatan' => $validated['district_name'],
                    'desa' => $validated['village_name'],
                    'latitude' => $validated['latitude'] ?? null,
                    'longitude' => $validated['longitude'] ?? null,
                ]
            );

            $jenisBencana = JenisBencana::where('kode', $validated['type'])->first();

            $status = StatusLaporan::firstOrCreate(['nama_status' => 'Menunggu Validasi']);

            $kodeLaporan = LaporanBencana::generateKode();

            $laporan = LaporanBencana::create([
                'kode_laporan' => $kodeLaporan,
                'nama_pelapor' => $validated['reporter_name'],
                'no_hp_pelapor' => $validated['reporter_phone'],
                'jenis_bencana_id' => $jenisBencana ? $jenisBencana->id : null,
                'status_id' => $status->id,
                'wilayah_id' => $wilayah ? $wilayah->id : null,
                'judul' => 'Laporan '.($jenisBencana ? $jenisBencana->nama_bencana : 'Bencana').' di '.$validated['village_name'],
                'deskripsi' => $validated['description'],
                'alamat' => $validated['address_detail'],
                'latitude' => $validated['latitude'] ?? null,
                'longitude' => $validated['longitude'] ?? null,
                'sumber_data' => 'website',
                'tingkat_keparahan' => 'Sedang',
                'validasi_admin' => false,
                'is_duplicate' => false,
            ]);

            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('laporan/'.date('Y/m'), 'public');
                $url = Storage::url($path);

                LaporanMedia::create([
                    'laporan_id' => $laporan->id,
                    'media_type' => 'image',
                    'file_url' => $url,
                    'file_path' => $path,
                ]);
            }

            return $laporan;
        });

        return back()->with([
            'success' => 'Laporan berhasil dikirim. Tim BPBD akan memverifikasi laporan Anda.',
            'tracking_id' => $laporan->kode_laporan,
        ]);
    }
}
