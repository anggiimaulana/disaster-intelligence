<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('whatsapp_message_id')->nullable()->constrained('whatsapp_messages')->cascadeOnDelete();
            $table->string('file_name', 255)->nullable();
            $table->string('original_name', 255)->nullable();
            $table->text('file_path')->nullable();
            $table->text('file_url')->nullable();
            $table->string('file_type', 50)->nullable();
            $table->string('mime_type', 100)->nullable();
            $table->bigInteger('file_size')->nullable();
            $table->text('ai_analysis')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
