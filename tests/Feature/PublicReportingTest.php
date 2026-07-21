<?php

namespace Tests\Feature;

use App\Models\JenisBencana;
use App\Models\LaporanBencana;
use App\Models\StatusLaporan;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class PublicReportingTest extends TestCase
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
        JenisBencana::create(['id' => 3, 'kode' => 'LONGSOR', 'nama_bencana' => 'Longsor', 'warna' => '#795548']);
    }

    public function test_can_view_public_reporting_page(): void
    {
        $response = $this->get('/public/lapor-bencana');

        $response->assertStatus(200);
    }

    public function test_can_view_track_report_page(): void
    {
        $response = $this->get('/public/lacak-laporan');

        $response->assertStatus(200);
    }

    public function test_can_submit_report(): void
    {
        $jenisBencana = JenisBencana::first();

        $response = $this->post('/public/lapor-bencana', [
            'nama_pelapor' => 'Test User',
            'no_hp' => '081234567890',
            'email' => 'test@example.com',
            'jenis_bencana_id' => $jenisBencana->id,
            'judul' => 'Test Flood Report',
            'deskripsi' => 'Test description of the flood incident',
            'alamat' => 'Test Address, Test Village',
            'kabupaten' => 'Indramayu',
            'kecamatan' => 'Karangampel',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ], ['Accept' => 'application/json']);

        $response->assertStatus(201);
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('laporan_bencana', [
            'judul' => 'Test Flood Report',
            'sumber_data' => 'website',
        ]);
    }

    public function test_report_submission_requires_validation(): void
    {
        $response = $this->post('/public/lapor-bencana', [
            'nama_pelapor' => '',
            'jenis_bencana_id' => '',
            'judul' => '',
            'deskripsi' => '',
            'alamat' => '',
            'kecamatan' => '',
            'latitude' => '',
            'longitude' => '',
        ], ['Accept' => 'application/json']);

        $response->assertStatus(422);
    }

    public function test_can_track_valid_report(): void
    {
        $jenisBencana = JenisBencana::first();
        $status = StatusLaporan::first();

        $laporan = LaporanBencana::create([
            'kode_laporan' => 'LAP-2026-0001',
            'jenis_bencana_id' => $jenisBencana->id,
            'status_id' => $status->id,
            'judul' => 'Test Report',
            'alamat' => 'Test Address',
            'kecamatan' => 'Test',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ]);

        $response = $this->get('/public/lacak-laporan', [
            'kode_laporan' => 'LAP-2026-0001',
        ]);

        $response->assertStatus(200);
    }

    public function test_cannot_track_invalid_report_code(): void
    {
        $response = $this->get('/public/lacak-laporan', [
            'kode_laporan' => 'LAP-INVALID-0000',
        ]);

        $response->assertStatus(200);
    }

    public function test_generates_unique_kode_on_submission(): void
    {
        $jenisBencana = JenisBencana::first();

        $response1 = $this->post('/public/lapor-bencana', [
            'nama_pelapor' => 'User 1',
            'no_hp' => '081234567891',
            'jenis_bencana_id' => $jenisBencana->id,
            'judul' => 'Report 1',
            'deskripsi' => 'Description 1',
            'alamat' => 'Address 1',
            'kabupaten' => 'Indramayu',
            'kecamatan' => 'Test',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ], ['Accept' => 'application/json']);

        $kode1 = $response1->json('data.kode_laporan');

        $response2 = $this->post('/public/lapor-bencana', [
            'nama_pelapor' => 'User 2',
            'no_hp' => '081234567892',
            'jenis_bencana_id' => $jenisBencana->id,
            'judul' => 'Report 2',
            'deskripsi' => 'Description 2',
            'alamat' => 'Address 2',
            'kecamatan' => 'Test',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ], ['Accept' => 'application/json']);

        $kode2 = $response2->json('data.kode_laporan');

        $this->assertNotEquals($kode1, $kode2);
    }

    public function test_phone_number_is_normalized(): void
    {
        $jenisBencana = JenisBencana::first();

        $response = $this->post('/public/lapor-bencana', [
            'nama_pelapor' => 'Test User',
            'no_hp' => '0812-3456-7890',
            'jenis_bencana_id' => $jenisBencana->id,
            'judul' => 'Test Report',
            'deskripsi' => 'Test Description',
            'alamat' => 'Test Address',
            'kabupaten' => 'Indramayu',
            'kecamatan' => 'Test',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ], ['Accept' => 'application/json']);

        $response->assertStatus(201);
    }
}
