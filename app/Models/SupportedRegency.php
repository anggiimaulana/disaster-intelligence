<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportedRegency extends Model
{
    protected $table = 'supported_regencies';

    protected $fillable = [
        'code',
        'name',
        'province_code',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
