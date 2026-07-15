<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Upsert settings from request.
     */
    public function update(Request $request)
    {
        $data = $request->except(['_token', '_method']);

        foreach ($data as $key => $value) {
            if ($request->hasFile($key)) {
                $file = $request->file($key);
                $path = $file->storeAs('public/settings', $file->hashName());
                $value = '/storage/settings/'.$file->hashName();
            }

            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }

    /**
     * Delete an item from a JSON array in settings (useful for n8n webhooks).
     */
    public function destroyArrayItem(Request $request, $key)
    {
        $setting = Setting::where('key', $key)->first();
        if (! $setting) {
            return back();
        }

        $index = $request->input('index');
        $array = $setting->value ?? [];

        if (isset($array[$index])) {
            unset($array[$index]);
            $setting->value = array_values($array); // re-index
            $setting->save();
        }

        return back()->with('success', 'Item berhasil dihapus.');
    }
}
