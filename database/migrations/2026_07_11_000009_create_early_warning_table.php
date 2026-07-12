<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Create enum types for PostgreSQL
        if (DB::getDriverName() === 'pgsql') {
            try {
                DB::statement("DO $$ BEGIN
                    CREATE TYPE level_warning AS ENUM ('Siaga', 'Waspada', 'Awas');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$");

                DB::statement("DO $$ BEGIN
                    CREATE TYPE warning_status AS ENUM ('aktif', 'selesai');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$");
            } catch (Exception $e) {
                // Types may already exist
            }
        }

        Schema::create('early_warning', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laporan_id')->nullable()->constrained('laporan_bencana')->cascadeOnDelete();
            $table->foreignId('jenis_bencana_id')->nullable()->constrained('jenis_bencana')->nullOnDelete();

            if (DB::getDriverName() === 'pgsql') {
                $table->string('level_warning', 20)->nullable();
                $table->string('status', 20)->default('aktif');
            } else {
                $table->enum('level_warning', ['Siaga', 'Waspada', 'Awas'])->nullable();
                $table->enum('status', ['aktif', 'selesai'])->default('aktif');
            }

            $table->string('wilayah', 255)->nullable();
            $table->text('pesan')->nullable();
            $table->timestamps();

            $table->index('status', 'idx_warning_status');
            $table->index('level_warning', 'idx_level_warning');
        });

        // Add check constraints for PostgreSQL
        if (DB::getDriverName() === 'pgsql') {
            try {
                DB::statement("ALTER TABLE early_warning ADD CONSTRAINT chk_level_warning CHECK (level_warning IN ('Siaga', 'Waspada', 'Awas') OR level_warning IS NULL)");
                DB::statement("ALTER TABLE early_warning ADD CONSTRAINT chk_warning_status CHECK (status IN ('aktif', 'selesai'))");
            } catch (Exception $e) {
                // Constraints may already exist
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('early_warning');
    }
};
