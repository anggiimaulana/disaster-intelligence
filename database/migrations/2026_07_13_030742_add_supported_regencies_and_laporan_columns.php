<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create supported_regencies table
        Schema::create('supported_regencies', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique();
            $table->string('name', 100);
            $table->string('province_code', 10);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        DB::table('supported_regencies')->insert([
            'code' => '32.12',
            'name' => 'KABUPATEN INDRAMAYU',
            'province_code' => '32',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Add nama_pelapor and no_hp_pelapor to laporan_bencana
        Schema::table('laporan_bencana', function (Blueprint $table) {
            $table->string('nama_pelapor', 150)->nullable();
            $table->string('no_hp_pelapor', 25)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('laporan_bencana', function (Blueprint $table) {
            $table->dropColumn('nama_pelapor');
            $table->dropColumn('no_hp_pelapor');
        });

        Schema::dropIfExists('supported_regencies');
    }
};
