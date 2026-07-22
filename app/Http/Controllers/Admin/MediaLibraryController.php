<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaLibrary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MediaLibraryController extends Controller
{
    public function index(Request $request)
    {
        $this->syncStorageFiles();

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

        if ($request->wantsJson() || $request->boolean('json')) {
            return response()->json([
                'media' => $media->through(fn ($m) => [
                    'id' => $m->id,
                    'file_path' => $m->file_path,
                    'file_url' => $m->url,
                    'original_name' => $m->original_name,
                    'mime_type' => $m->mime_type,
                    'file_type' => $m->file_type,
                    'folder' => $m->folder,
                ]),
                'folders' => MediaLibrary::distinct()->pluck('folder')->filter()->values(),
            ]);
        }

        return Inertia::render('admin/media/index', [
            'media' => $media,
            'folders' => MediaLibrary::distinct()->pluck('folder')->filter()->toArray(),
        ]);
    }

    public function sync(Request $request)
    {
        $count = $this->syncStorageFiles();

        return back()->with('success', "Media sync selesai. {$count} file baru ditambahkan ke library.");
    }

    private function syncStorageFiles(): int
    {
        $count = 0;
        try {
            $files = Storage::disk('public')->allFiles();
            $existingPaths = MediaLibrary::pluck('file_path')->toArray();
            $existingSet = array_flip($existingPaths);

            foreach ($files as $filePath) {
                $filename = basename($filePath);
                if (str_starts_with($filename, '.') || $filename === 'hot' || $filename === '.gitignore') {
                    continue;
                }

                if (isset($existingSet[$filePath])) {
                    continue;
                }

                $folderDir = dirname($filePath);
                $folder = ($folderDir === '.' || $folderDir === '') ? 'general' : $folderDir;
                $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
                $absolutePath = Storage::disk('public')->path($filePath);
                $mimeType = @mime_content_type($absolutePath) ?: 'application/octet-stream';
                $size = @filesize($absolutePath) ?: 0;

                MediaLibrary::create([
                    'user_id' => Auth::id() ?? 1,
                    'file_name' => $filename,
                    'original_name' => $filename,
                    'file_path' => $filePath,
                    'file_type' => $extension,
                    'mime_type' => $mimeType,
                    'file_size' => $size,
                    'folder' => $folder,
                ]);

                $count++;
            }
        } catch (\Throwable $e) {
        }

        return $count;
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
                'user_id' => Auth::id(),
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
