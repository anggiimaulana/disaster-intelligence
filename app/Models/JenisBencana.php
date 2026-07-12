<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JenisBencana extends Model
{
    use HasFactory;

    protected $table = 'jenis_bencana';

    protected $fillable = [
        'kode',
        'nama_bencana',
        'icon',
        'warna',
    ];

    public function laporanBencana(): HasMany
    {
        return $this->hasMany(LaporanBencana::class);
    }

    public function earlyWarnings(): HasMany
    {
        return $this->hasMany(EarlyWarning::class);
    }

    public function incidentClusters(): HasMany
    {
        return $this->hasMany(IncidentCluster::class);
    }
}
