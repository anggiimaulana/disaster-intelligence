<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CvAnalysis extends Model
{
    use HasFactory;

    protected $table = 'cv_analysis';

    protected $fillable = [
        'laporan_media_id',
        'detected_object',
        'severity_level',
        'confidence_score',
        'raw_result',
    ];

    protected $casts = [
        'confidence_score' => 'decimal:2',
        'raw_result' => 'array',
    ];

    public function laporanMedia(): BelongsTo
    {
        return $this->belongsTo(LaporanMedia::class, 'laporan_media_id');
    }

    /**
     * Get severity color
     */
    public function getSeverityColorAttribute(): string
    {
        return match ($this->severity_level) {
            'Rendah' => '#4CAF50',
            'Sedang' => '#FFC107',
            'Tinggi' => '#FF9800',
            'Darurat' => '#F44336',
            default => '#9E9E9E',
        };
    }
}
