<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BeritaController extends Controller
{
    public function index()
    {
        $berita = Berita::latest()->get();

        return Inertia::render('admin/berita/index', [
            'berita' => $berita,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/berita/form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'seo_keywords' => 'nullable|string|max:255',
        ]);

        $slug = Str::slug($validated['title']);
        $count = Berita::where('slug', 'LIKE', "{$slug}%")->count();
        if ($count > 0) {
            $slug = "{$slug}-{$count}";
        }

        $berita = new Berita($validated);
        $berita->slug = $slug;

        if ($validated['status'] === 'published') {
            $berita->published_at = now();
        }

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('berita', 'public');
            $berita->thumbnail = $path;
        }

        $berita->save();

        return redirect()->route('admin.berita.index')->with('success', 'Berita berhasil ditambahkan');
    }

    public function edit(Berita $berita)
    {
        return Inertia::render('admin/berita/form', [
            'berita' => $berita,
        ]);
    }

    public function update(Request $request, Berita $berita)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'seo_keywords' => 'nullable|string|max:255',
        ]);

        // Clear SEO fields if empty string sent
        foreach (['seo_title', 'seo_description', 'seo_keywords'] as $field) {
            if (isset($validated[$field]) && $validated[$field] === '') {
                $validated[$field] = null;
            }
        }

        if ($validated['status'] === 'published' && ! $berita->published_at) {
            $berita->published_at = now();
        } elseif ($validated['status'] === 'draft') {
            $berita->published_at = null;
        }

        $berita->fill($validated);

        if ($request->boolean('remove_thumbnail') && $berita->thumbnail) {
            Storage::disk('public')->delete($berita->thumbnail);
            $berita->thumbnail = null;
        }

        if ($request->hasFile('thumbnail')) {
            if ($berita->thumbnail) {
                Storage::disk('public')->delete($berita->thumbnail);
            }
            $path = $request->file('thumbnail')->store('berita', 'public');
            $berita->thumbnail = $path;
        }

        $berita->save();

        return redirect()->route('admin.berita.index')->with('success', 'Berita berhasil diperbarui');
    }

    public function destroy(Berita $berita)
    {
        if ($berita->thumbnail) {
            Storage::disk('public')->delete($berita->thumbnail);
        }
        $berita->delete();

        return back()->with('success', 'Berita berhasil dihapus');
    }
}
