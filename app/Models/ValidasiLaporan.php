<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ValidasiLaporan extends Model
{
    use HasFactory;

    protected $table = 'validasi_laporan';

    protected $fillable = [
        'laporan_id',
        'admin_id',
        'hasil_validasi',
        'catatan',
    ];

    public function laporan(): BelongsTo
    {
        return $this->belongsTo(LaporanBencana::class, 'laporan_id');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function isValid(): bool
    {
        return $this->hasil_validasi === 'valid';
    }

    public function isInvalid(): bool
    {
        return $this->hasil_validasi === 'invalid';
    }

    public function isSpam(): bool
    {
        return $this->hasil_validasi === 'spam';
    }

    public function isDuplicate(): bool
    {
        return $this->hasil_validasi === 'duplikat';
    }
}
