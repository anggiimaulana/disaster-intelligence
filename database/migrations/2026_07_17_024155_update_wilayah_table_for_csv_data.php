<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('wilayah', function (Blueprint $table) {
            $table->string('kode_provinsi', 10)->nullable()->after('provinsi');
            $table->string('kode_kabupaten', 10)->nullable()->after('kabupaten');
            $table->string('kode_kecamatan', 10)->nullable()->after('kecamatan');
            $table->string('kode_desa', 20)->nullable()->after('desa');
        });

        // Clear old data (fake coordinates from wilayah.id seeder)
        DB::table('wilayah')->truncate();

        // Add indexes for better query performance
        Schema::table('wilayah', function (Blueprint $table) {
            $table->index('kode_provinsi');
            $table->index('kode_kabupaten');
            $table->index('kode_kecamatan');
            $table->index('kode_desa');
            $table->index('kabupaten');
            $table->index('kecamatan');
            $table->index(['kabupaten', 'kecamatan', 'desa']);
        });
    }

    public function down(): void
    {
        Schema::table('wilayah', function (Blueprint $table) {
            $table->dropIndex(['kabupaten', 'kecamatan', 'desa']);
            $table->dropIndex('kecamatan');
            $table->dropIndex('kabupaten');
            $table->dropIndex('kode_desa');
            $table->dropIndex('kode_kecamatan');
            $table->dropIndex('kode_kabupaten');
            $table->dropIndex('kode_provinsi');

            $table->dropColumn([
                'kode_provinsi',
                'kode_kabupaten',
                'kode_kecamatan',
                'kode_desa',
            ]);
        });
    }
};
