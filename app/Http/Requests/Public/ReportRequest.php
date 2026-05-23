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
            'location' => ['required', 'string', 'max:255'],
            'district' => ['required', 'string', 'max:100'],
            'village' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'max:2000'],
            'reporter_name' => ['required', 'string', 'max:100'],
            'reporter_phone' => ['required', 'string', 'max:20'],
            'photo' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
