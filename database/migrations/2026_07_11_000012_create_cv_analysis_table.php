<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cv_analysis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laporan_media_id')->nullable()->constrained('laporan_media')->cascadeOnDelete();
            $table->string('detected_object', 255)->nullable();
            $table->string('severity_level', 50)->nullable();
            $table->decimal('confidence_score', 5, 2)->nullable();
            $table->json('raw_result')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cv_analysis');
    }
};
