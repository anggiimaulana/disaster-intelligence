<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaLibrary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MediaLibraryController extends Controller
{
    public function index(Request $request)
    {
        $query = MediaLibrary::orderBy('created_at', 'desc');

        if ($request->filled('folder')) {
            $query->where('folder', $request->folder);
        }

        if ($request->filled('type')) {
            $query->where('file_type', $request->type);
        }

        if ($request->filled('q')) {
            $query->where('original_name', 'like', "%{$request->q}%");
        }

        $media = $query->paginate(24);

        return Inertia::render('admin/media/index', [
            'media' => $media,
            'folders' => MediaLibrary::distinct()->pluck('folder')->filter()->toArray(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:10240',
            'folder' => 'nullable|string|max:100',
        ]);

        $folder = $request->input('folder', 'uploads');
        $uploaded = [];

        foreach ($request->file('files') as $file) {
            $path = $file->store("media/{$folder}", 'public');
            $media = MediaLibrary::create([
                'user_id' => auth()->id(),
                'file_name' => basename($path),
                'original_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'file_type' => $file->getClientOriginalExtension(),
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'folder' => $folder,
            ]);
            $uploaded[] = $media;
        }

        return back()->with('success', count($uploaded).' file berhasil diupload.');
    }

    public function update(Request $request, MediaLibrary $media)
    {
        $request->validate([
            'original_name' => 'required|string|max:255',
            'folder' => 'nullable|string|max:100',
        ]);

        $media->update([
            'original_name' => $request->original_name,
            'folder' => $request->input('folder', 'uploads'),
        ]);

        return back()->with('success', 'Detail file berhasil diperbarui.');
    }

    public function destroy(MediaLibrary $media)
    {
        Storage::disk('public')->delete($media->file_path);
        $media->delete();

        return back()->with('success', 'File berhasil dihapus.');
    }
}
