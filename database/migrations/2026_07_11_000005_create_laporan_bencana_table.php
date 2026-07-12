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
                    CREATE TYPE tingkat_keparahan AS ENUM ('Rendah', 'Sedang', 'Tinggi', 'Darurat');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$");

                DB::statement("DO $$ BEGIN
                    CREATE TYPE sumber_data AS ENUM ('whatsapp', 'mobile_app', 'website', 'api', 'sensor');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$");
            } catch (Exception $e) {
                // Types may already exist
            }
        }

        Schema::create('laporan_bencana', function (Blueprint $table) {
            $table->id();
            $table->string('kode_laporan', 50)->nullable()->unique();
            $table->foreignId('whatsapp_message_id')->nullable()->constrained('whatsapp_messages')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('jenis_bencana_id')->nullable()->constrained('jenis_bencana')->nullOnDelete();
            $table->foreignId('status_id')->default(1)->constrained('status_laporan');
            $table->foreignId('wilayah_id')->nullable()->constrained('wilayah')->nullOnDelete();
            $table->string('judul', 255)->nullable();
            $table->text('deskripsi')->nullable();
            $table->text('alamat')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            // Use string for PostgreSQL compatibility, enum for MySQL
            if (DB::getDriverName() === 'pgsql') {
                $table->string('tingkat_keparahan', 20)->default('Rendah');
                $table->string('sumber_data', 20)->default('website');
            } else {
                $table->enum('tingkat_keparahan', ['Rendah', 'Sedang', 'Tinggi', 'Darurat'])->default('Rendah');
                $table->enum('sumber_data', ['whatsapp', 'mobile_app', 'website', 'api', 'sensor'])->default('website');
            }

            $table->decimal('confidence_score', 5, 2)->nullable();
            $table->boolean('validasi_ai')->default(false);
            $table->boolean('validasi_admin')->default(false);
            $table->boolean('is_duplicate')->default(false);
            $table->unsignedBigInteger('duplicate_reference')->nullable();
            $table->dateTime('waktu_kejadian')->nullable();
            $table->timestamps();

            $table->index(['latitude', 'longitude'], 'idx_laporan_latlng');
            $table->index('kode_laporan', 'idx_kode_laporan');
            $table->index('created_at', 'idx_created_at');
            $table->index('status_id', 'idx_status_id');
        });

        // Add duplicate_reference foreign key separately for PostgreSQL
        if (DB::getDriverName() === 'pgsql') {
            Schema::table('laporan_bencana', function (Blueprint $table) {
                $table->foreign('duplicate_reference')->references('id')->on('laporan_bencana')->nullOnDelete();
            });

            // Add check constraints
            try {
                DB::statement("ALTER TABLE laporan_bencana ADD CONSTRAINT chk_tingkat_keparahan CHECK (tingkat_keparahan IN ('Rendah', 'Sedang', 'Tinggi', 'Darurat'))");
                DB::statement("ALTER TABLE laporan_bencana ADD CONSTRAINT chk_sumber_data CHECK (sumber_data IN ('whatsapp', 'mobile_app', 'website', 'api', 'sensor'))");
            } catch (Exception $e) {
                // Constraints may already exist
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_bencana');
    }
};
