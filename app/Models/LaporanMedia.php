<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LaporanMedia extends Model
{
    use HasFactory;

    protected $table = 'laporan_media';

    protected $fillable = [
        'laporan_id',
        'media_type',
        'file_path',
        'file_url',
        'ai_result',
    ];

    public function laporan(): BelongsTo
    {
        return $this->belongsTo(LaporanBencana::class, 'laporan_id');
    }

    public function cvAnalysis(): HasMany
    {
        return $this->hasMany(CvAnalysis::class, 'laporan_media_id');
    }

    public function isImage(): bool
    {
        return $this->media_type === 'image';
    }

    public function isVideo(): bool
    {
        return $this->media_type === 'video';
    }
}
