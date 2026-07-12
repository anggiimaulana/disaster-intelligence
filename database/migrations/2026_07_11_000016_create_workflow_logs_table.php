<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            try {
                DB::statement("DO $$ BEGIN
                    CREATE TYPE workflow_status AS ENUM ('running', 'success', 'failed');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$");
            } catch (Exception $e) {
                // Type may already exist
            }
        }

        Schema::create('workflow_logs', function (Blueprint $table) {
            $table->id();
            $table->string('workflow_name', 255)->nullable();
            $table->string('execution_id', 255)->nullable();
            $table->foreignId('whatsapp_message_id')->nullable()->constrained('whatsapp_messages')->cascadeOnDelete();
            $table->foreignId('laporan_id')->nullable()->constrained('laporan_bencana')->cascadeOnDelete();
            $table->string('step_name', 255)->nullable();

            if (DB::getDriverName() === 'pgsql') {
                $table->string('status', 20)->nullable();
            } else {
                $table->enum('status', ['running', 'success', 'failed'])->nullable();
            }

            $table->text('response')->nullable();
            $table->float('execution_time')->nullable();
            $table->timestamps();

            $table->index('execution_id', 'idx_execution_id');
            $table->index('status', 'idx_workflow_status');
        });

        // Add check constraints for PostgreSQL
        if (DB::getDriverName() === 'pgsql') {
            try {
                DB::statement("ALTER TABLE workflow_logs ADD CONSTRAINT chk_workflow_status CHECK (status IN ('running', 'success', 'failed') OR status IS NULL)");
            } catch (Exception $e) {
                // Constraints may already exist
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_logs');
    }
};
