<?php

namespace Tests\Unit\Models;

use App\Models\StatusLaporan;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class StatusLaporanTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        StatusLaporan::create(['id' => 1, 'nama_status' => 'Menunggu', 'warna' => '#9E9E9E']);
        StatusLaporan::create(['id' => 2, 'nama_status' => 'Diproses', 'warna' => '#03A9F4']);
        StatusLaporan::create(['id' => 3, 'nama_status' => 'Warning', 'warna' => '#FFC107']);
        StatusLaporan::create(['id' => 4, 'nama_status' => 'Darurat', 'warna' => '#F44336']);
        StatusLaporan::create(['id' => 5, 'nama_status' => 'Selesai', 'warna' => '#4CAF50']);
        StatusLaporan::create(['id' => 6, 'nama_status' => 'Ditolak', 'warna' => '#795548']);
    }

    public function test_has_many_laporan_bencana(): void
    {
        $status = StatusLaporan::where('nama_status', 'Menunggu')->first();

        $this->assertInstanceOf(HasMany::class, $status->laporanBencana());
    }

    public function test_is_terminal_for_selesai_status(): void
    {
        $selesai = StatusLaporan::where('nama_status', 'Selesai')->first();
        $menunggu = StatusLaporan::where('nama_status', 'Menunggu')->first();

        $this->assertTrue($selesai->isTerminal());
        $this->assertFalse($menunggu->isTerminal());
    }

    public function test_is_terminal_for_ditolak_status(): void
    {
        $ditolak = StatusLaporan::where('nama_status', 'Ditolak')->first();

        $this->assertTrue($ditolak->isTerminal());
    }

    public function test_requires_action_for_menunggu_status(): void
    {
        $menunggu = StatusLaporan::where('nama_status', 'Menunggu')->first();
        $diproses = StatusLaporan::where('nama_status', 'Diproses')->first();

        $this->assertTrue($menunggu->requiresAction());
        $this->assertFalse($diproses->requiresAction());
    }
}
