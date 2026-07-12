<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'whatsapp_message_id',
        'file_name',
        'original_name',
        'file_path',
        'file_url',
        'file_type',
        'mime_type',
        'file_size',
        'ai_analysis',
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    public function whatsappMessage(): BelongsTo
    {
        return $this->belongsTo(WhatsAppMessage::class);
    }

    /**
     * Get human readable file size
     */
    public function getFileSizeFormattedAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2).' '.$units[$i];
    }
}
