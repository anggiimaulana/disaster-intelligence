<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NlpAnalysis extends Model
{
    use HasFactory;

    protected $fillable = [
        'laporan_id',
        'extracted_keywords',
        'sentiment',
        'detected_entities',
        'cleaned_text',
    ];

    public function laporan(): BelongsTo
    {
        return $this->belongsTo(LaporanBencana::class, 'laporan_id');
    }

    /**
     * Get keywords as array
     */
    public function getKeywordsArrayAttribute(): array
    {
        if (empty($this->extracted_keywords)) {
            return [];
        }

        return array_map('trim', explode(',', $this->extracted_keywords));
    }

    /**
     * Get sentiment color
     */
    public function getSentimentColorAttribute(): string
    {
        return match ($this->sentiment) {
            'positive' => '#4CAF50',
            'negative' => '#F44336',
            'neutral' => '#9E9E9E',
            default => '#9E9E9E',
        };
    }
}
