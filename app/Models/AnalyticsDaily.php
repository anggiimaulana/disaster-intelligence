<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnalyticsDaily extends Model
{
    use HasFactory;

    protected $fillable = [
        'tanggal',
        'total_laporan',
        'total_warning',
        'total_darurat',
        'total_banjir',
        'total_abrasi',
        'total_rob',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'total_laporan' => 'integer',
        'total_warning' => 'integer',
        'total_darurat' => 'integer',
        'total_banjir' => 'integer',
        'total_abrasi' => 'integer',
        'total_rob' => 'integer',
    ];

    /**
     * Get total incidents for the day
     */
    public function getTotalIncidentsAttribute(): int
    {
        return $this->total_banjir + $this->total_abrasi + $this->total_rob;
    }
}
