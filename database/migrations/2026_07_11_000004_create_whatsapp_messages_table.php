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
                    CREATE TYPE tipe_pesan AS ENUM ('text', 'image', 'video', 'audio', 'document', 'location');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$");

                DB::statement("DO $$ BEGIN
                    CREATE TYPE whatsapp_source AS ENUM ('whatsapp_cloud_api', 'wablas', 'fonnte', 'twilio');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$");

                DB::statement("DO $$ BEGIN
                    CREATE TYPE whatsapp_status AS ENUM ('pending', 'processed', 'failed');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$");
            } catch (Exception $e) {
                // Types may already exist
            }
        }

        Schema::create('whatsapp_messages', function (Blueprint $table) {
            $table->id();
            $table->string('message_id', 255)->nullable()->unique();
            $table->string('nomor_pengirim', 30)->nullable();
            $table->string('nama_pengirim', 150)->nullable();

            if (DB::getDriverName() === 'pgsql') {
                $table->string('tipe_pesan', 20)->nullable();
                $table->string('source', 30)->default('whatsapp_cloud_api');
                $table->string('status_proses', 20)->default('pending');
            } else {
                $table->enum('tipe_pesan', ['text', 'image', 'video', 'audio', 'document', 'location'])->nullable();
                $table->enum('source', ['whatsapp_cloud_api', 'wablas', 'fonnte', 'twilio'])->default('whatsapp_cloud_api');
                $table->enum('status_proses', ['pending', 'processed', 'failed'])->default('pending');
            }

            $table->text('isi_pesan')->nullable();
            $table->text('media_url')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->jsonb('raw_payload')->nullable();
            $table->dateTime('received_at')->nullable();
            $table->timestamps();

            $table->index('message_id', 'idx_whatsapp_message');
            $table->index('status_proses', 'idx_status_proses');
        });

        // Add check constraints for PostgreSQL (after table exists)
        if (DB::getDriverName() === 'pgsql') {
            try {
                DB::statement("ALTER TABLE whatsapp_messages ADD CONSTRAINT chk_tipe_pesan CHECK (tipe_pesan IN ('text', 'image', 'video', 'audio', 'document', 'location') OR tipe_pesan IS NULL)");
                DB::statement("ALTER TABLE whatsapp_messages ADD CONSTRAINT chk_source CHECK (source IN ('whatsapp_cloud_api', 'wablas', 'fonnte', 'twilio'))");
                DB::statement("ALTER TABLE whatsapp_messages ADD CONSTRAINT chk_status_proses CHECK (status_proses IN ('pending', 'processed', 'failed'))");
            } catch (Exception $e) {
                // Constraints may already exist
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('whatsapp_messages');
    }
};
