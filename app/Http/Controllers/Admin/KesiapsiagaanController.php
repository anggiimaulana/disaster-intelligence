<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kesiapsiagaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KesiapsiagaanController extends Controller
{
    public function index()
    {
        $data = Kesiapsiagaan::latest()->get();

        return Inertia::render('admin/kesiapsiagaan/index', ['items' => $data]);
    }

    public function create()
    {
        return Inertia::render('admin/kesiapsiagaan/form');
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
        $count = Kesiapsiagaan::where('slug', 'LIKE', "{$slug}%")->count();
        if ($count > 0) {
            $slug = "{$slug}-{$count}";
        }

        $item = new Kesiapsiagaan;
        $item->fill([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'status' => $validated['status'],
            'seo_title' => $validated['seo_title'] ?? null,
            'seo_description' => $validated['seo_description'] ?? null,
            'seo_keywords' => $validated['seo_keywords'] ?? null,
        ]);
        $item->slug = $slug;

        if ($validated['status'] === 'published') {
            $item->published_at = now();
        }

        if ($request->hasFile('thumbnail')) {
            $item->thumbnail = $request->file('thumbnail')->store('kesiapsiagaan', 'public');
            $item->icon = null;
        } elseif (! empty($validated['icon'])) {
            $item->icon = $validated['icon'];
            $item->thumbnail = null;
        }

        $item->save();

        return redirect()->route('admin.kesiapsiagaan.index')->with('success', 'Berhasil ditambahkan');
    }

    public function edit(Kesiapsiagaan $kesiapsiagaan)
    {
        return Inertia::render('admin/kesiapsiagaan/form', ['item' => $kesiapsiagaan]);
    }

    public function update(Request $request, Kesiapsiagaan $kesiapsiagaan)
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

        if ($validated['status'] === 'published' && ! $kesiapsiagaan->published_at) {
            $validated['published_at'] = now();
        } elseif ($validated['status'] === 'draft') {
            $validated['published_at'] = null;
        }

        if ($request->boolean('remove_thumbnail') && $kesiapsiagaan->thumbnail) {
            Storage::disk('public')->delete($kesiapsiagaan->thumbnail);
            $kesiapsiagaan->thumbnail = null;
        }

        if ($request->hasFile('thumbnail')) {
            if ($kesiapsiagaan->thumbnail) {
                Storage::disk('public')->delete($kesiapsiagaan->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('kesiapsiagaan', 'public');
            $validated['icon'] = null;
        } elseif (array_key_exists('icon', $validated)) {
            if ($kesiapsiagaan->icon !== $validated['icon'] && $kesiapsiagaan->thumbnail) {
                Storage::disk('public')->delete($kesiapsiagaan->thumbnail);
            }
            $validated['icon'] = $validated['icon'] ?: null;
            if (! empty($validated['icon'])) {
                $validated['thumbnail'] = null;
            }
        }

        $kesiapsiagaan->update($validated);

        return redirect()->route('admin.kesiapsiagaan.index')->with('success', 'Berhasil diperbarui');
    }

    public function destroy(Kesiapsiagaan $kesiapsiagaan)
    {
        if ($kesiapsiagaan->thumbnail) {
            Storage::disk('public')->delete($kesiapsiagaan->thumbnail);
        }
        $kesiapsiagaan->delete();

        return back()->with('success', 'Berhasil dihapus');
    }
}
