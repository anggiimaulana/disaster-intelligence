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
            // SEC #5/#6: thumbnail must be a real image mime (no SVG/JS/etc)
            // and icon must be either a known Lucide name or a media-library URL.
            'thumbnail' => 'nullable|file|mimes:jpg,jpeg,png,webp,svg|max:5120',
            'icon' => ['nullable', 'string', 'max:255', 'regex:/^(Lucide[A-Z][A-Za-z0-9]+|https?:\/\/[A-Za-z0-9._~:/?#@!$&\'()*+,;=%-]+|\/storage\/[A-Za-z0-9_\-.\/]+|media\/[A-Za-z0-9_\-.\/]+)$/'],
        ]);

        $slug = Str::slug($validated['title']);
        $count = Berita::where('slug', 'LIKE', "{$slug}%")->count();
        if ($count > 0) {
            $slug = "{$slug}-{$count}";
        }

        $berita = new Berita;
        $berita->fill([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'status' => $validated['status'],
            'seo_title' => $validated['seo_title'] ?? null,
            'seo_description' => $validated['seo_description'] ?? null,
            'seo_keywords' => $validated['seo_keywords'] ?? null,
        ]);
        $berita->slug = $slug;

        if ($validated['status'] === 'published') {
            $berita->published_at = now();
        }

        if ($request->hasFile('thumbnail')) {
            $berita->thumbnail = $request->file('thumbnail')->store('berita', 'public');
            $berita->icon = null;
        } elseif (! empty($validated['icon'])) {
            $berita->icon = $validated['icon'];
            $berita->thumbnail = null;
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
            'thumbnail' => 'nullable|file|mimes:jpg,jpeg,png,webp,svg|max:5120',
            'icon' => ['nullable', 'string', 'max:255', 'regex:/^(Lucide[A-Z][A-Za-z0-9]+|https?:\/\/[A-Za-z0-9._~:/?#@!$&\'()*+,;=%-]+|\/storage\/[A-Za-z0-9_\-.\/]+|media\/[A-Za-z0-9_\-.\/]+)$/'],
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
            $berita->icon = null;
        } elseif (array_key_exists('icon', $validated)) {
            if ($berita->icon !== $validated['icon'] && $berita->thumbnail) {
                Storage::disk('public')->delete($berita->thumbnail);
            }
            $berita->icon = $validated['icon'] ?: null;
            if (! empty($validated['icon'])) {
                $berita->thumbnail = null;
            }
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
