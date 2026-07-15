<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;

class ReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'string', 'in:BANJIR,LONGSOR,KEBAKARAN,ANGIN_KENCANG,LAINNYA'],
            'regency_code' => ['required', 'string', 'max:10'],
            'regency_name' => ['required', 'string', 'max:100'],
            'district_code' => ['required', 'string', 'max:15'],
            'district_name' => ['required', 'string', 'max:100'],
            'village_code' => ['required', 'string', 'max:20'],
            'village_name' => ['required', 'string', 'max:100'],
            'address_detail' => ['required', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'description' => ['required', 'string', 'max:2000'],
            'reporter_name' => ['required', 'string', 'max:100'],
            'reporter_phone' => ['required', 'string', 'max:20'],
            'photo' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
