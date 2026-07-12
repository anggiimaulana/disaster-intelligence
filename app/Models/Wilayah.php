<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wilayah extends Model
{
    use HasFactory;

    protected $table = 'wilayah';

    protected $fillable = [
        'provinsi',
        'kabupaten',
        'kecamatan',
        'desa',
        'kodepos',
        'latitude',
        'longitude',
    ];

    public function laporanBencana(): HasMany
    {
        return $this->hasMany(LaporanBencana::class);
    }

    /**
     * Get full address string
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->desa,
            $this->kecamatan,
            $this->kabupaten,
            $this->provinsi,
        ]);

        return implode(', ', $parts);
    }
}
