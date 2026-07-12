<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IncidentCluster extends Model
{
    use HasFactory;

    protected $table = 'incident_clusters';

    protected $fillable = [
        'cluster_code',
        'jenis_bencana_id',
        'total_laporan',
        'radius_km',
        'center_latitude',
        'center_longitude',
        'severity',
    ];

    protected $casts = [
        'center_latitude' => 'decimal:8',
        'center_longitude' => 'decimal:8',
        'radius_km' => 'float',
        'total_laporan' => 'integer',
    ];

    public function jenisBencana(): BelongsTo
    {
        return $this->belongsTo(JenisBencana::class);
    }
}
