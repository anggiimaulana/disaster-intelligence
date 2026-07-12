<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_daily', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal')->nullable();
            $table->integer('total_laporan')->default(0);
            $table->integer('total_warning')->default(0);
            $table->integer('total_darurat')->default(0);
            $table->integer('total_banjir')->default(0);
            $table->integer('total_abrasi')->default(0);
            $table->integer('total_rob')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_daily');
    }
};
