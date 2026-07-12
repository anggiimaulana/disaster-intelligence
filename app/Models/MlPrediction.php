<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MlPrediction extends Model
{
    use HasFactory;

    protected $fillable = [
        'laporan_id',
        'model_name',
        'model_version',
        'prediksi_bencana',
        'prediksi_keparahan',
        'confidence_score',
        'raw_result',
        'processing_time',
    ];

    protected $casts = [
        'confidence_score' => 'decimal:2',
        'raw_result' => 'array',
        'processing_time' => 'float',
    ];

    public function laporan(): BelongsTo
    {
        return $this->belongsTo(LaporanBencana::class, 'laporan_id');
    }

    /**
     * Check if prediction is high confidence
     */
    public function isHighConfidence(): bool
    {
        return $this->confidence_score >= 0.8;
    }
}
