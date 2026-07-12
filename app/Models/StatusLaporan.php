<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StatusLaporan extends Model
{
    use HasFactory;

    protected $table = 'status_laporan';

    protected $fillable = [
        'nama_status',
        'warna',
    ];

    public function laporanBencana(): HasMany
    {
        return $this->hasMany(LaporanBencana::class);
    }

    /**
     * Check if this status is a terminal state
     */
    public function isTerminal(): bool
    {
        return in_array($this->nama_status, ['Selesai', 'Ditolak']);
    }

    /**
     * Check if this status requires action
     */
    public function requiresAction(): bool
    {
        return $this->nama_status === 'Menunggu';
    }
}
