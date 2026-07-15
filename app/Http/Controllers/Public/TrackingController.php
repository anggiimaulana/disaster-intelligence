<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\LaporanBencana;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrackingController extends Controller
{
    public function index(Request $request)
    {
        $searchId = $request->query('id');
        $laporan = null;

        if ($searchId) {
            $laporan = LaporanBencana::with(['status', 'jenisBencana', 'wilayah'])
                ->where('kode_laporan', $searchId)
                ->first();
        }

        $recentReports = LaporanBencana::with(['status', 'jenisBencana', 'wilayah'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($lap) {
                return [
                    'kode_laporan' => $lap->kode_laporan,
                    'status' => $lap->status ? $lap->status->nama_status : 'Menunggu',
                    'jenis_bencana' => $lap->jenisBencana ? $lap->jenisBencana->nama_bencana : '-',
                    'lokasi' => $lap->wilayah ? $lap->wilayah->desa.', '.$lap->wilayah->kecamatan : '-',
                    'waktu_kejadian' => $lap->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('public/tracking/index', [
            'title' => 'Lacak Laporan',
            'searchId' => $searchId,
            'isSimulation' => true,
            'recentReports' => $recentReports,
            'laporan' => $laporan ? [
                'kode_laporan' => $laporan->kode_laporan,
                'status' => $laporan->status ? $laporan->status->nama_status : 'Menunggu',
                'jenis_bencana' => $laporan->jenisBencana ? $laporan->jenisBencana->nama_bencana : '-',
                'lokasi' => $laporan->alamat,
                'waktu_kejadian' => $laporan->created_at->format('d M Y H:i'),
                'deskripsi' => $laporan->deskripsi,
            ] : null,
        ]);
    }

    public function exportPdf($kode)
    {
        $laporan = LaporanBencana::with(['status', 'jenisBencana', 'wilayah'])
            ->where('kode_laporan', $kode)
            ->firstOrFail();

        $pdf = Pdf::loadView('pdf.laporan', compact('laporan'));

        return $pdf->download('Laporan-'.$kode.'.pdf');
    }
}
