<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\ReportRequest;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('public/report/index', [
            'title' => 'Lapor Bencana',
            'isSimulation' => true,
        ]);
    }

    public function store(ReportRequest $request)
    {
        // Simpan laporan (belum diimplementasikan — masih prototipe)
        return back()->with('success', 'Laporan berhasil dikirim. Tim BPBD akan memverifikasi laporan Anda.');
    }
}
