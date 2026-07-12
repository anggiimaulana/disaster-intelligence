<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nlp_analysis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laporan_id')->nullable()->constrained('laporan_bencana')->cascadeOnDelete();
            $table->text('extracted_keywords')->nullable();
            $table->string('sentiment', 50)->nullable();
            $table->text('detected_entities')->nullable();
            $table->text('cleaned_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nlp_analysis');
    }
};
