<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WhatsAppMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'message_id',
        'nomor_pengirim',
        'nama_pengirim',
        'tipe_pesan',
        'isi_pesan',
        'media_url',
        'latitude',
        'longitude',
        'raw_payload',
        'source',
        'status_proses',
        'received_at',
    ];

    protected $casts = [
        'raw_payload' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'received_at' => 'datetime',
    ];

    public function laporanBencana(): HasMany
    {
        return $this->hasMany(LaporanBencana::class);
    }

    public function mediaFiles(): HasMany
    {
        return $this->hasMany(MediaFile::class);
    }

    public function workflowLogs(): HasMany
    {
        return $this->hasMany(WorkflowLog::class);
    }

    public function isProcessed(): bool
    {
        return $this->status_proses === 'processed';
    }
}
