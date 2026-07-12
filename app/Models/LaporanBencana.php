<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class LaporanBencana extends Model
{
    use HasFactory;

    protected $table = 'laporan_bencana';

    protected $fillable = [
        'kode_laporan',
        'whatsapp_message_id',
        'user_id',
        'jenis_bencana_id',
        'status_id',
        'wilayah_id',
        'kecamatan',
        'desa',
        'judul',
        'deskripsi',
        'alamat',
        'latitude',
        'longitude',
        'tingkat_keparahan',
        'sumber_data',
        'confidence_score',
        'validasi_ai',
        'validasi_admin',
        'is_duplicate',
        'duplicate_reference',
        'waktu_kejadian',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'confidence_score' => 'decimal:2',
        'validasi_ai' => 'boolean',
        'validasi_admin' => 'boolean',
        'is_duplicate' => 'boolean',
        'waktu_kejadian' => 'datetime',
    ];

    public function whatsappMessage(): BelongsTo
    {
        return $this->belongsTo(WhatsAppMessage::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jenisBencana(): BelongsTo
    {
        return $this->belongsTo(JenisBencana::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(StatusLaporan::class, 'status_id');
    }

    public function wilayah(): BelongsTo
    {
        return $this->belongsTo(Wilayah::class);
    }

    public function duplicateOf(): BelongsTo
    {
        return $this->belongsTo(LaporanBencana::class, 'duplicate_reference');
    }

    public function duplicates(): HasMany
    {
        return $this->hasMany(LaporanBencana::class, 'duplicate_reference');
    }

    public function media(): HasMany
    {
        return $this->hasMany(LaporanMedia::class, 'laporan_id');
    }

    public function validasi(): HasOne
    {
        return $this->hasOne(ValidasiLaporan::class, 'laporan_id');
    }

    public function earlyWarnings(): HasMany
    {
        return $this->hasMany(EarlyWarning::class, 'laporan_id');
    }

    public function mlPredictions(): HasMany
    {
        return $this->hasMany(MlPrediction::class, 'laporan_id');
    }

    public function nlpAnalysis(): HasOne
    {
        return $this->hasOne(NlpAnalysis::class, 'laporan_id');
    }

    public function workflowLogs(): HasMany
    {
        return $this->hasMany(WorkflowLog::class, 'laporan_id');
    }

    /**
     * Generate unique report code with lock to prevent race conditions
     */
    public static function generateKode(): string
    {
        $dateStr = date('Ymd');
        $todayDate = date('Y-m-d');

        // 4 huruf abjad kapital acak (A-Z)
        $letters = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4);

        // ID berikutnya (berdasarkan max ID di tabel + 1)
        $nextId = (static::max('id') ?? 0) + 1;
        $formattedId = str_pad((string) $nextId, 4, '0', STR_PAD_LEFT);

        // Jumlah laporan hari ini + 1
        $todayCount = static::whereDate('created_at', $todayDate)->count() + 1;
        $formattedTodayCount = '0'.$todayCount;

        return sprintf('LAP-%s-%s%s-%s', $dateStr, $letters, $formattedId, $formattedTodayCount);
    }

    /**
     * Check if report is validated
     */
    public function isValidated(): bool
    {
        return $this->validasi_admin && $this->validasi_ai;
    }

    /**
     * Check if report needs validation
     */
    public function needsValidation(): bool
    {
        return $this->status_id === 1 && ! $this->validasi_admin;
    }

    /**
     * Scope for pending reports
     */
    public function scopePending($query)
    {
        return $query->where('status_id', 1);
    }

    /**
     * Scope for validated reports
     */
    public function scopeValidated($query)
    {
        return $query->where('validasi_admin', true);
    }

    /**
     * Scope for active warnings
     */
    public function scopeWithActiveWarnings($query)
    {
        return $query->whereHas('earlyWarnings', function ($q) {
            $q->where('status', 'aktif');
        });
    }

    /**
     * Scope for searchable reports
     */
    public function scopeSearch($query, string $term)
    {
        // PostgreSQL compatible
        return $query->whereRaw(
            'kode_laporan ILIKE ? OR judul ILIKE ? OR alamat ILIKE ?',
            ["%{$term}%", "%{$term}%", "%{$term}%"]
        );
    }

    /**
     * Get severity color
     */
    public function getSeverityColorAttribute(): string
    {
        return match ($this->tingkat_keparahan) {
            'Rendah' => '#4CAF50',
            'Sedang' => '#FFC107',
            'Tinggi' => '#FF9800',
            'Darurat' => '#F44336',
            default => '#9E9E9E',
        };
    }
}
