<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LaporBencanaRequest extends FormRequest
{
    /**
     * Spam words that indicate fake reports
     */
    protected array $spamWords = [
        ' gratis ', ' click here ', ' link ', ' scam ', '作弊',
        ' hack ', ' casino ', ' gambling ', ' porn ', ' xxx ',
    ];

    /**
     * Suspicious patterns
     */
    protected array $suspiciousPatterns = [
        '/(.)\1{5,}/', // Repeated characters (6+ times)
        '/\b\w+\b(?:\s+\w+\b){50,}/', // Very long sentences without punctuation
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Honeypot fields - should be empty
            'website_url' => 'nullable|string|max:0', // Honeypot - reject if filled
            'contact_subject' => 'nullable|string|max:0', // Honeypot

            // Real fields
            'nama_pelapor' => [
                'required',
                'string',
                'max:150',
                'min:2',
                'not_regex:/^\d+$/', // Cannot be only numbers
            ],
            'no_hp' => [
                'required',
                'string',
                'max:25',
                'regex:/^(\+?62|08|628)\d{8,14}$/',
            ],
            'email' => [
                'nullable',
                'email',
                'max:150',
            ],
            'jenis_bencana_id' => [
                'required',
                'integer',
                'exists:jenis_bencana,id',
            ],
            'judul' => [
                'required',
                'string',
                'max:255',
                'min:5',
            ],
            'deskripsi' => [
                'required',
                'string',
                'max:5000',
                'min:10',
            ],
            'alamat' => [
                'required',
                'string',
                'max:500',
                'min:5',
            ],
            'kabupaten' => [
                'required',
                'string',
                'max:100',
            ],
            'provinsi' => [
                'nullable',
                'string',
                'max:100',
            ],
            'kecamatan' => [
                'required',
                'string',
                'max:100',
            ],
            'desa' => [
                'nullable',
                'string',
                'max:100',
            ],
            'latitude' => [
                'required',
                'numeric',
                'between:-90,90',
            ],
            'longitude' => [
                'required',
                'numeric',
                'between:-180,180',
            ],
            'waktu_kejadian' => [
                'nullable',
                'date',
                'before_or_equal:now',
                'after:2020-01-01',
            ],
            'media.*' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,gif,webp,mp4,mov,avi',
                'max:10240', // 10MB
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'nama_pelapor.required' => 'Nama pelapor wajib diisi.',
            'nama_pelapor.min' => 'Nama minimal 2 karakter.',
            'nama_pelapor.not_regex' => 'Nama tidak valid.',
            'no_hp.required' => 'Nomor WhatsApp wajib diisi.',
            'no_hp.regex' => 'Format nomor WhatsApp tidak valid. Contoh: 081234567890',
            'jenis_bencana_id.required' => 'Jenis bencana wajib dipilih.',
            'jenis_bencana_id.exists' => 'Jenis bencana tidak valid.',
            'jenis_bencana_id.integer' => 'Jenis bencana tidak valid.',
            'judul.required' => 'Judul laporan wajib diisi.',
            'judul.min' => 'Judul minimal 5 karakter.',
            'deskripsi.required' => 'Deskripsi kejadian wajib diisi.',
            'deskripsi.min' => 'Deskripsi minimal 10 karakter.',
            'alamat.required' => 'Alamat lengkap wajib diisi.',
            'alamat.min' => 'Alamat minimal 5 karakter.',
            'kecamatan.required' => 'Kecamatan wajib diisi.',
            'latitude.required' => 'Lokasi harus ditandai di peta.',
            'latitude.between' => 'Koordinat tidak valid.',
            'longitude.required' => 'Lokasi harus ditandai di peta.',
            'longitude.between' => 'Koordinat tidak valid.',
            'waktu_kejadian.before_or_equal' => 'Waktu kejadian tidak boleh di masa depan.',
            'waktu_kejadian.after' => 'Waktu kejadian terlalu lama.',
            'media.*.max' => 'Ukuran file maksimal 10MB.',
            'media.*.mimes' => 'Format file harus jpg, png, gif, webp, atau mp4.',
        ];
    }

    /**
     * Additional validation checks
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Honeypot validation - reject if filled (bot detection)
            $honeypotFields = ['website_url', 'contact_subject'];
            foreach ($honeypotFields as $field) {
                $value = $this->input($field);
                if (! empty($value)) {
                    // Log potential bot attempt
                    \Log::warning('Honeypot field filled - potential bot', [
                        'field' => $field,
                        'value' => $value,
                        'ip' => $this->ip(),
                        'user_agent' => $this->userAgent(),
                    ]);
                    $validator->errors()->add('spam', 'Submission detected as automated.');

                    return;
                }
            }

            if ($this->isSpam()) {
                $validator->errors()->add('spam', 'Laporan Anda terdeteksi sebagai spam.');
            }

            // Check location is within Indonesia bounds
            $lat = $this->input('latitude');
            $lng = $this->input('longitude');

            if ($lat && $lng) {
                // Indonesia bounds: approximately lat -11 to 6, lng 95 to 141
                if ($lat < -11 || $lat > 6 || $lng < 95 || $lng > 141) {
                    $validator->errors()->add('location', 'Lokasi harus berada di wilayah Indonesia.');
                }
            }
        });
    }

    /**
     * Check if submission is spam
     */
    protected function isSpam(): bool
    {
        $content = strtolower($this->input('judul', '').' '.$this->input('deskripsi', ''));

        // Check spam words
        foreach ($this->spamWords as $word) {
            if (stripos($content, trim($word)) !== false) {
                return true;
            }
        }

        // Check suspicious patterns
        foreach ($this->suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $content)) {
                return true;
            }
        }

        return false;
    }

    protected function prepareForValidation(): void
    {
        // Normalize phone number
        if ($this->no_hp) {
            $phone = preg_replace('/[^0-9+]/', '', $this->no_hp);

            // Remove country code prefix if already has 62
            if (str_starts_with($phone, '620')) {
                $phone = '62'.substr($phone, 3);
            } elseif (str_starts_with($phone, '0')) {
                $phone = '62'.substr($phone, 1);
            }

            // Ensure starts with 62
            if (! str_starts_with($phone, '62')) {
                $phone = '62'.$phone;
            }

            $this->merge(['no_hp' => $phone]);
        }

        // Sanitize text inputs
        $inputsToSanitize = ['nama_pelapor', 'judul', 'deskripsi', 'alamat', 'kecamatan', 'desa'];

        foreach ($inputsToSanitize as $input) {
            if ($this->$input) {
                $this->merge([
                    $input => strip_tags($this->$input),
                ]);
            }
        }
    }
}
