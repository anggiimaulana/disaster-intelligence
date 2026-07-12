<?php

namespace Tests\Unit\Models;

use App\Models\JenisBencana;
use App\Models\LaporanBencana;
use App\Models\StatusLaporan;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class LaporanBencanaTest extends TestCase
{
    use DatabaseMigrations;

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
        JenisBencana::create(['id' => 3, 'kode' => 'ABRASI', 'nama_bencana' => 'Abrasi', 'warna' => '#FF9800']);
        JenisBencana::create(['id' => 4, 'kode' => 'LONGSOR', 'nama_bencana' => 'Longsor', 'warna' => '#795548']);
        JenisBencana::create(['id' => 5, 'kode' => 'CUACA', 'nama_bencana' => 'Cuaca Ekstrem', 'warna' => '#9C27B0']);
        JenisBencana::create(['id' => 6, 'kode' => 'KEBAKARAN', 'nama_bencana' => 'Kebakaran', 'warna' => '#F44336']);
    }

    public function test_can_create_laporan_bencana(): void
    {
        $jenisBencana = JenisBencana::first();
        $status = StatusLaporan::first();

        $laporan = LaporanBencana::create([
            'kode_laporan' => 'LAP-2026-0001',
            'jenis_bencana_id' => $jenisBencana->id,
            'status_id' => $status->id,
            'judul' => 'Test Flood Report',
            'deskripsi' => 'Test description',
            'alamat' => 'Test address',
            'kecamatan' => 'Test Kecamatan',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
            'tingkat_keparahan' => 'Sedang',
            'sumber_data' => 'website',
        ]);

        $this->assertDatabaseHas('laporan_bencana', [
            'kode_laporan' => 'LAP-2026-0001',
            'judul' => 'Test Flood Report',
        ]);
    }

    public function test_generates_unique_kode(): void
    {
        $kode1 = LaporanBencana::generateKode();
        $this->assertMatchesRegularExpression('/^LAP-\d{8}-[A-Z]{4}\d{4}-0\d+$/', $kode1);

        $jenisBencana = JenisBencana::first();
        $status = StatusLaporan::first();

        LaporanBencana::create([
            'kode_laporan' => $kode1,
            'jenis_bencana_id' => $jenisBencana->id,
            'status_id' => $status->id,
            'judul' => 'Test',
            'alamat' => 'Test',
            'kecamatan' => 'Test',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ]);

        $kode2 = LaporanBencana::generateKode();
        $this->assertNotEquals($kode1, $kode2);
    }

    public function test_belongs_to_jenis_bencana(): void
    {
        $jenisBencana = JenisBencana::first();
        $status = StatusLaporan::first();

        $laporan = LaporanBencana::create([
            'kode_laporan' => 'LAP-2026-0001',
            'jenis_bencana_id' => $jenisBencana->id,
            'status_id' => $status->id,
            'judul' => 'Test',
            'alamat' => 'Test',
            'kecamatan' => 'Test',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ]);

        $this->assertInstanceOf(JenisBencana::class, $laporan->jenisBencana);
        $this->assertEquals($jenisBencana->id, $laporan->jenisBencana->id);
    }

    public function test_belongs_to_status(): void
    {
        $jenisBencana = JenisBencana::first();
        $status = StatusLaporan::where('nama_status', 'Menunggu')->first();

        $laporan = LaporanBencana::create([
            'kode_laporan' => 'LAP-2026-0001',
            'jenis_bencana_id' => $jenisBencana->id,
            'status_id' => $status->id,
            'judul' => 'Test',
            'alamat' => 'Test',
            'kecamatan' => 'Test',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ]);

        $this->assertInstanceOf(StatusLaporan::class, $laporan->status);
        $this->assertEquals('Menunggu', $laporan->status->nama_status);
    }

    public function test_is_validated_returns_correct_value(): void
    {
        $jenisBencana = JenisBencana::first();
        $status = StatusLaporan::first();

        $laporan = LaporanBencana::create([
            'kode_laporan' => 'LAP-2026-0001',
            'jenis_bencana_id' => $jenisBencana->id,
            'status_id' => $status->id,
            'validasi_ai' => true,
            'validasi_admin' => true,
            'judul' => 'Test',
            'alamat' => 'Test',
            'kecamatan' => 'Test',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ]);

        $this->assertTrue($laporan->isValidated());

        $laporan->validasi_admin = false;
        $laporan->save();

        $this->assertFalse($laporan->isValidated());
    }

    public function test_needs_validation_returns_correct_value(): void
    {
        $jenisBencana = JenisBencana::first();
        $menungguStatus = StatusLaporan::where('nama_status', 'Menunggu')->first();
        $diprosesStatus = StatusLaporan::where('nama_status', 'Diproses')->first();

        $laporan1 = LaporanBencana::create([
            'kode_laporan' => 'LAP-2026-0001',
            'jenis_bencana_id' => $jenisBencana->id,
            'status_id' => $menungguStatus->id,
            'validasi_admin' => false,
            'judul' => 'Test',
            'alamat' => 'Test',
            'kecamatan' => 'Test',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ]);

        $this->assertTrue($laporan1->needsValidation());

        $laporan2 = LaporanBencana::create([
            'kode_laporan' => 'LAP-2026-0002',
            'jenis_bencana_id' => $jenisBencana->id,
            'status_id' => $diprosesStatus->id,
            'validasi_admin' => false,
            'judul' => 'Test',
            'alamat' => 'Test',
            'kecamatan' => 'Test',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ]);

        $this->assertFalse($laporan2->needsValidation());
    }

    public function test_scope_pending(): void
    {
        $jenisBencana = JenisBencana::first();
        $menungguStatus = StatusLaporan::where('nama_status', 'Menunggu')->first();
        $diprosesStatus = StatusLaporan::where('nama_status', 'Diproses')->first();

        LaporanBencana::create([
            'kode_laporan' => 'LAP-2026-0001',
            'jenis_bencana_id' => $jenisBencana->id,
            'status_id' => $menungguStatus->id,
            'judul' => 'Pending Report',
            'alamat' => 'Test',
            'kecamatan' => 'Test',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ]);

        LaporanBencana::create([
            'kode_laporan' => 'LAP-2026-0002',
            'jenis_bencana_id' => $jenisBencana->id,
            'status_id' => $diprosesStatus->id,
            'judul' => 'Processed Report',
            'alamat' => 'Test',
            'kecamatan' => 'Test',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ]);

        $pending = LaporanBencana::pending()->get();

        $this->assertCount(1, $pending);
        $this->assertEquals('Pending Report', $pending->first()->judul);
    }
}
