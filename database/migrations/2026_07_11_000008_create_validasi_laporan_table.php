<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('validasi_laporan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laporan_id')->constrained('laporan_bencana')->cascadeOnDelete();
            $table->foreignId('admin_id')->nullable()->constrained('users')->nullOnDelete();

            if (DB::getDriverName() === 'pgsql') {
                $table->string('hasil_validasi', 20)->nullable();
            } else {
                $table->enum('hasil_validasi', ['valid', 'invalid', 'spam', 'duplikat'])->nullable();
            }

            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->index('hasil_validasi', 'idx_hasil_validasi');
        });

        // Add check constraints for PostgreSQL
        if (DB::getDriverName() === 'pgsql') {
            try {
                DB::statement("ALTER TABLE validasi_laporan ADD CONSTRAINT chk_hasil_validasi CHECK (hasil_validasi IN ('valid', 'invalid', 'spam', 'duplikat') OR hasil_validasi IS NULL)");
            } catch (Exception $e) {
                // Constraints may already exist
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('validasi_laporan');
    }
};
