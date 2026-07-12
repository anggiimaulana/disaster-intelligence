<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incident_clusters', function (Blueprint $table) {
            $table->id();
            $table->string('cluster_code', 100)->nullable();
            $table->foreignId('jenis_bencana_id')->nullable()->constrained('jenis_bencana')->cascadeOnDelete();
            $table->integer('total_laporan')->nullable();
            $table->float('radius_km')->nullable();
            $table->decimal('center_latitude', 10, 8)->nullable();
            $table->decimal('center_longitude', 11, 8)->nullable();

            if (DB::getDriverName() === 'pgsql') {
                $table->string('severity', 20)->nullable();
            } else {
                $table->enum('severity', ['Rendah', 'Sedang', 'Tinggi', 'Darurat'])->nullable();
            }

            $table->timestamps();
        });

        // Add check constraints for PostgreSQL
        if (DB::getDriverName() === 'pgsql') {
            try {
                DB::statement("ALTER TABLE incident_clusters ADD CONSTRAINT chk_cluster_severity CHECK (severity IN ('Rendah', 'Sedang', 'Tinggi', 'Darurat') OR severity IS NULL)");
            } catch (Exception $e) {
                // Constraints may already exist
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('incident_clusters');
    }
};
