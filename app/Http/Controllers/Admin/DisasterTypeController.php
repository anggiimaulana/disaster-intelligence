<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JenisBencana;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DisasterTypeController extends Controller
{
    public function index()
    {
        $types = JenisBencana::all();

        return Inertia::render('disaster/types', [
            'title' => 'Pengaturan Jenis Bencana',
            'disasterTypes' => $types,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_bencana' => 'required|string|max:100',
            'icon' => 'nullable|string|max:255',
            'warna' => 'nullable|string|max:20',
        ]);

        $kode = strtoupper(Str::slug($validated['nama_bencana'], '_'));

        JenisBencana::create([
            'kode' => $kode,
            'nama_bencana' => $validated['nama_bencana'],
            'icon' => $validated['icon'],
            'warna' => $validated['warna'] ?? 'red',
        ]);

        return back()->with('success', 'Jenis Bencana berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama_bencana' => 'required|string|max:100',
            'icon' => 'nullable|string|max:255',
            'warna' => 'nullable|string|max:20',
        ]);

        $jenisBencana = JenisBencana::findOrFail($id);

        $jenisBencana->update([
            'nama_bencana' => $validated['nama_bencana'],
            'icon' => $validated['icon'],
            'warna' => $validated['warna'],
        ]);

        return back()->with('success', 'Jenis Bencana berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $jenisBencana = JenisBencana::findOrFail($id);

        if ($jenisBencana->laporanBencana()->count() > 0) {
            return back()->with('error', 'Tidak dapat menghapus jenis bencana karena sudah digunakan pada laporan.');
        }

        $jenisBencana->delete();

        return back()->with('success', 'Jenis Bencana berhasil dihapus.');
    }
}
