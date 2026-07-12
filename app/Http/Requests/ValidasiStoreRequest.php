<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ValidasiStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'hasil_validasi' => ['required', 'in:valid,invalid,spam,duplikat'],
            'catatan' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'hasil_validasi.required' => 'Hasil validasi wajib dipilih.',
            'hasil_validasi.in' => 'Hasil validasi tidak valid.',
            'catatan.max' => 'Catatan maksimal 1000 karakter.',
        ];
    }
}
