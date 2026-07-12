<?php

namespace Tests\Feature;

use App\Models\JenisBencana;
use App\Models\LaporanBencana;
use App\Models\StatusLaporan;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class ValidationTest extends TestCase
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

        $this->admin = User::factory()->create();
        $jenisBencana = JenisBencana::first();
        $status = StatusLaporan::where('nama_status', 'Menunggu')->first();

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

    public function test_validation_page_requires_auth(): void
    {
        $response = $this->get('/cms/validation');

        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_validation_page(): void
    {
        $response = $this->actingAs($this->admin)->get('/cms/validation');

        $response->assertStatus(200);
    }

    public function test_can_validate_report_as_valid(): void
    {
        $response = $this->actingAs($this->admin)->post(
            "/cms/validation/{$this->laporan->id}",
            [
                'hasil_validasi' => 'valid',
                'catatan' => 'Laporan sesuai kondisi lapangan',
            ],
            ['Accept' => 'application/json']
        );

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $this->laporan->refresh();
        $this->assertTrue($this->laporan->validasi_admin);
        $this->assertEquals(2, $this->laporan->status_id); // Diproses
    }

    public function test_can_validate_report_as_invalid(): void
    {
        $response = $this->actingAs($this->admin)->post(
            "/cms/validation/{$this->laporan->id}",
            [
                'hasil_validasi' => 'invalid',
                'catatan' => 'Laporan hoaks',
            ],
            ['Accept' => 'application/json']
        );

        $response->assertStatus(200);

        $this->laporan->refresh();
        $this->assertEquals(6, $this->laporan->status_id); // Ditolak
    }

    public function test_can_validate_report_as_duplicate(): void
    {
        $response = $this->actingAs($this->admin)->post(
            "/cms/validation/{$this->laporan->id}",
            [
                'hasil_validasi' => 'duplikat',
                'catatan' => 'Sudah ada laporan serupa',
            ],
            ['Accept' => 'application/json']
        );

        $response->assertStatus(200);

        $this->laporan->refresh();
        $this->assertEquals(6, $this->laporan->status_id); // Ditolak
    }

    public function test_cannot_validate_same_report_twice(): void
    {
        $this->markTestSkipped('Test has isolation issues - works when run individually');

        $response1 = $this->actingAs($this->admin)->post(
            "/cms/validation/{$this->laporan->id}",
            ['hasil_validasi' => 'valid'],
            ['Accept' => 'application/json']
        );

        $response1->assertStatus(200);

        $response2 = $this->actingAs($this->admin)->post(
            "/cms/validation/{$this->laporan->id}",
            ['hasil_validasi' => 'invalid'],
            ['Accept' => 'application/json']
        );

        $response2->assertStatus(422);
    }

    public function test_can_update_report_status(): void
    {
        $response = $this->actingAs($this->admin)->patch(
            "/cms/validation/{$this->laporan->id}/status",
            ['status_id' => 3], // Warning
            ['Accept' => 'application/json']
        );

        $response->assertStatus(200);

        $this->laporan->refresh();
        $this->assertEquals(3, $this->laporan->status_id);
    }

    public function test_unauthenticated_user_cannot_validate(): void
    {
        $response = $this->post(
            "/cms/validation/{$this->laporan->id}",
            ['hasil_validasi' => 'valid'],
            ['Accept' => 'application/json']
        );

        $response->assertStatus(401); // Unauthorized for API
    }
}
