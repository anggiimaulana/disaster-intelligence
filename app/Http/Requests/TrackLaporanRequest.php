<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackLaporanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kode_laporan' => ['required', 'string', 'regex:/^LAP-[A-Z0-9\-]+$/i'],
        ];
    }

    public function messages(): array
    {
        return [
            'kode_laporan.required' => 'Kode laporan wajib diisi.',
            'kode_laporan.regex' => 'Format kode laporan tidak valid. Contoh: LAP-20260712-ADHZ0001-01',
        ];
    }
}
