<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EarlyWarning extends Model
{
    use HasFactory;

    protected $table = 'early_warning';

    protected $fillable = [
        'laporan_id',
        'jenis_bencana_id',
        'level_warning',
        'wilayah',
        'pesan',
        'status',
    ];

    public function laporan(): BelongsTo
    {
        return $this->belongsTo(LaporanBencana::class, 'laporan_id');
    }

    public function jenisBencana(): BelongsTo
    {
        return $this->belongsTo(JenisBencana::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'aktif';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'selesai';
    }

    /**
     * Get warning level color
     */
    public function getLevelColorAttribute(): string
    {
        return match ($this->level_warning) {
            'Siaga' => '#4CAF50',
            'Waspada' => '#FFC107',
            'Awas' => '#F44336',
            default => '#9E9E9E',
        };
    }
}
