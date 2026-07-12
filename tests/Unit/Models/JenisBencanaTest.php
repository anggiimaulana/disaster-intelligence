<?php

namespace Tests\Unit\Models;

use App\Models\JenisBencana;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class JenisBencanaTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        JenisBencana::create(['id' => 1, 'kode' => 'BANJIR', 'nama_bencana' => 'Banjir', 'warna' => '#2196F3']);
        JenisBencana::create(['id' => 2, 'kode' => 'ROB', 'nama_bencana' => 'Banjir Rob', 'warna' => '#00BCD4']);
        JenisBencana::create(['id' => 3, 'kode' => 'ABRASI', 'nama_bencana' => 'Abrasi', 'warna' => '#FF9800']);
        JenisBencana::create(['id' => 4, 'kode' => 'LONGSOR', 'nama_bencana' => 'Longsor', 'warna' => '#795548']);
        JenisBencana::create(['id' => 5, 'kode' => 'CUACA', 'nama_bencana' => 'Cuaca Ekstrem', 'warna' => '#9C27B0']);
        JenisBencana::create(['id' => 6, 'kode' => 'KEBAKARAN', 'nama_bencana' => 'Kebakaran', 'warna' => '#F44336']);
    }

    public function test_can_get_all_bencana_types(): void
    {
        $count = JenisBencana::count();

        $this->assertGreaterThanOrEqual(6, $count);
    }

    public function test_has_banjir_type(): void
    {
        $banjir = JenisBencana::where('kode', 'BANJIR')->first();

        $this->assertNotNull($banjir);
        $this->assertEquals('Banjir', $banjir->nama_bencana);
        $this->assertEquals('#2196F3', $banjir->warna);
    }

    public function test_has_rob_type(): void
    {
        $rob = JenisBencana::where('kode', 'ROB')->first();

        $this->assertNotNull($rob);
        $this->assertEquals('Banjir Rob', $rob->nama_bencana);
    }

    public function test_has_longsor_type(): void
    {
        $longsor = JenisBencana::where('kode', 'LONGSOR')->first();

        $this->assertNotNull($longsor);
        $this->assertEquals('Longsor', $longsor->nama_bencana);
    }

    public function test_has_many_laporan_bencana(): void
    {
        $jenis = JenisBencana::first();

        $this->assertInstanceOf(HasMany::class, $jenis->laporanBencana());
    }
}
