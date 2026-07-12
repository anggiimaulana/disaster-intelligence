<?php

namespace Tests\Unit\Models;

use App\Models\JenisBencana;
use App\Models\LaporanBencana;
use App\Models\StatusLaporan;
use App\Models\User;
use App\Models\ValidasiLaporan;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class ValidasiLaporanTest extends TestCase
{
    use DatabaseMigrations;

    protected User $admin;

    protected LaporanBencana $laporan;

    protected function setUp(): void
    {
        parent::setUp();

        // Create status records
        StatusLaporan::create(['id' => 1, 'nama_status' => 'Menunggu', 'warna' => '#9E9E9E']);
        StatusLaporan::create(['id' => 2, 'nama_status' => 'Diproses', 'warna' => '#03A9F4']);
        StatusLaporan::create(['id' => 3, 'nama_status' => 'Warning', 'warna' => '#FFC107']);
        StatusLaporan::create(['id' => 4, 'nama_status' => 'Darurat', 'warna' => '#F44336']);
        StatusLaporan::create(['id' => 5, 'nama_status' => 'Selesai', 'warna' => '#4CAF50']);
        StatusLaporan::create(['id' => 6, 'nama_status' => 'Ditolak', 'warna' => '#795548']);

        // Create jenis bencana records
        JenisBencana::create(['id' => 1, 'kode' => 'BANJIR', 'nama_bencana' => 'Banjir', 'warna' => '#2196F3']);
        JenisBencana::create(['id' => 2, 'kode' => 'ROB', 'nama_bencana' => 'Banjir Rob', 'warna' => '#00BCD4']);

        $this->admin = User::factory()->create();
        $jenisBencana = JenisBencana::first();
        $status = StatusLaporan::first();

        $this->laporan = LaporanBencana::create([
            'kode_laporan' => 'LAP-2026-0001',
            'jenis_bencana_id' => $jenisBencana->id,
            'status_id' => $status->id,
            'judul' => 'Test Report',
            'alamat' => 'Test Address',
            'kecamatan' => 'Test',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ]);
    }

    public function test_can_create_validasi(): void
    {
        $validasi = ValidasiLaporan::create([
            'laporan_id' => $this->laporan->id,
            'admin_id' => $this->admin->id,
            'hasil_validasi' => 'valid',
            'catatan' => 'Laporan sesuai kondisi lapangan',
        ]);

        $this->assertDatabaseHas('validasi_laporan', [
            'laporan_id' => $this->laporan->id,
            'hasil_validasi' => 'valid',
        ]);
    }

    public function test_belongs_to_laporan(): void
    {
        $validasi = ValidasiLaporan::create([
            'laporan_id' => $this->laporan->id,
            'admin_id' => $this->admin->id,
            'hasil_validasi' => 'valid',
        ]);

        $this->assertInstanceOf(LaporanBencana::class, $validasi->laporan);
        $this->assertEquals($this->laporan->id, $validasi->laporan->id);
    }

    public function test_belongs_to_admin(): void
    {
        $validasi = ValidasiLaporan::create([
            'laporan_id' => $this->laporan->id,
            'admin_id' => $this->admin->id,
            'hasil_validasi' => 'valid',
        ]);

        $this->assertInstanceOf(User::class, $validasi->admin);
        $this->assertEquals($this->admin->id, $validasi->admin->id);
    }

    public function test_is_valid_returns_true_for_valid(): void
    {
        $validasi = ValidasiLaporan::create([
            'laporan_id' => $this->laporan->id,
            'admin_id' => $this->admin->id,
            'hasil_validasi' => 'valid',
        ]);

        $this->assertTrue($validasi->isValid());
    }

    public function test_is_invalid_returns_true_for_invalid(): void
    {
        $validasi = ValidasiLaporan::create([
            'laporan_id' => $this->laporan->id,
            'admin_id' => $this->admin->id,
            'hasil_validasi' => 'invalid',
        ]);

        $this->assertTrue($validasi->isInvalid());
    }

    public function test_is_spam_returns_true_for_spam(): void
    {
        $validasi = ValidasiLaporan::create([
            'laporan_id' => $this->laporan->id,
            'admin_id' => $this->admin->id,
            'hasil_validasi' => 'spam',
        ]);

        $this->assertTrue($validasi->isSpam());
    }

    public function test_is_duplicate_returns_true_for_duplicate(): void
    {
        $validasi = ValidasiLaporan::create([
            'laporan_id' => $this->laporan->id,
            'admin_id' => $this->admin->id,
            'hasil_validasi' => 'duplikat',
        ]);

        $this->assertTrue($validasi->isDuplicate());
    }
}
