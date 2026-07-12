<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\ReportRequest;
use Illuminate\Http\Request;
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

    public function track(Request $request)
    {
        return Inertia::render('public/tracking/index', [
            'title' => 'Lacak Laporan',
            'searchId' => $request->query('id'),
            'isSimulation' => true,
        ]);
    }
}
