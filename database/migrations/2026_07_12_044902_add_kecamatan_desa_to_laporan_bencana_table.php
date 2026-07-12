<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('laporan_bencana', function (Blueprint $table) {
            $table->string('kecamatan', 100)->nullable()->after('alamat');
            $table->string('desa', 100)->nullable()->after('kecamatan');
        });
    }

    public function down(): void
    {
        Schema::table('laporan_bencana', function (Blueprint $table) {
            $table->dropColumn(['kecamatan', 'desa']);
        });
    }
};
