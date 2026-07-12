<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ml_predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laporan_id')->nullable()->constrained('laporan_bencana')->cascadeOnDelete();
            $table->string('model_name', 100)->nullable();
            $table->string('model_version', 50)->nullable();
            $table->string('prediksi_bencana', 100)->nullable();
            $table->string('prediksi_keparahan', 50)->nullable();
            $table->decimal('confidence_score', 5, 2)->nullable();
            $table->json('raw_result')->nullable();
            $table->float('processing_time')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ml_predictions');
    }
};
