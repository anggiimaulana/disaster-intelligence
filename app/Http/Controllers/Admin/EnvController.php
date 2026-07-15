<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class EnvController extends Controller
{
    /**
     * Show the .env editor page.
     */
    public function edit()
    {
        $envPath = base_path('.env');
        $envContent = File::exists($envPath) ? File::get($envPath) : '';

        return Inertia::render('disaster/settings-env', [
            'envContent' => $envContent,
        ]);
    }

    /**
     * Update the .env file.
     */
    public function update(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $envPath = base_path('.env');

        // Backup current env just in case
        if (File::exists($envPath)) {
            File::copy($envPath, base_path('.env.backup_'.time()));
        }

        File::put($envPath, $request->input('content'));

        // Clear config cache so changes take effect
        Artisan::call('config:clear');

        return back()->with('success', 'File .env berhasil diperbarui.');
    }
}
