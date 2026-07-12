<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Performance optimization indexes for PostgreSQL
     */
    public function up(): void
    {
        // Additional indexes for laporan_bencana table
        Schema::table('laporan_bencana', function (Blueprint $table) {
            // Composite index for tracking by kode and status
            $table->index(['kode_laporan', 'status_id'], 'idx_kode_status');

            // Index for wilayah filtering with status and date
            $table->index(['wilayah_id', 'status_id', 'created_at'], 'idx_wilayah_status_time');

            // Index for date range queries by disaster type
            $table->index(['waktu_kejadian', 'jenis_bencana_id'], 'idx_waktu_jenis');

            // Index for severity filtering
            $table->index(['tingkat_keparahan', 'status_id'], 'idx_severity_status');

            // Index for source data filtering
            $table->index(['sumber_data', 'created_at'], 'idx_source_time');

            // Index for AI/Admin validation filtering
            $table->index(['validasi_admin', 'validasi_ai', 'status_id'], 'idx_validation_status');
        });

        // Add index to laporan_media for faster joins
        Schema::table('laporan_media', function (Blueprint $table) {
            $table->index(['laporan_id', 'media_type'], 'idx_media_laporan_type');
        });

        // Add index to validasi_laporan
        Schema::table('validasi_laporan', function (Blueprint $table) {
            $table->index(['laporan_id', 'hasil_validasi'], 'idx_validasi_hasil');
            $table->index(['admin_id', 'created_at'], 'idx_validasi_admin_time');
        });

        // Add index to early_warning for active alerts
        Schema::table('early_warning', function (Blueprint $table) {
            $table->index(['status', 'jenis_bencana_id', 'created_at'], 'idx_warning_status_jenis');
        });

        // PostgreSQL: Analyze tables for query optimizer
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ANALYZE laporan_bencana');
            DB::statement('ANALYZE laporan_media');
            DB::statement('ANALYZE validasi_laporan');
            DB::statement('ANALYZE early_warning');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('laporan_bencana', function (Blueprint $table) {
            $table->dropIndex('idx_kode_status');
            $table->dropIndex('idx_wilayah_status_time');
            $table->dropIndex('idx_waktu_jenis');
            $table->dropIndex('idx_severity_status');
            $table->dropIndex('idx_source_time');
            $table->dropIndex('idx_validation_status');
        });

        Schema::table('laporan_media', function (Blueprint $table) {
            $table->dropIndex('idx_media_laporan_type');
        });

        Schema::table('validasi_laporan', function (Blueprint $table) {
            $table->dropIndex('idx_validasi_hasil');
            $table->dropIndex('idx_validasi_admin_time');
        });

        Schema::table('early_warning', function (Blueprint $table) {
            $table->dropIndex('idx_warning_status_jenis');
        });
    }
};
