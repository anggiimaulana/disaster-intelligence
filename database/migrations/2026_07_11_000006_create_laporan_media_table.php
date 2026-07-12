<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laporan_id')->constrained('laporan_bencana')->cascadeOnDelete();
            $table->enum('media_type', ['image', 'video', 'audio', 'document'])->nullable();
            $table->text('file_path')->nullable();
            $table->text('file_url')->nullable();
            $table->text('ai_result')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_media');
    }
};
