<?php

namespace Tests\Unit\Models;

use App\Models\Wilayah;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class WilayahTest extends TestCase
{
    use DatabaseMigrations;

    public function test_can_create_wilayah(): void
    {
        $wilayah = Wilayah::create([
            'provinsi' => 'Jawa Barat',
            'kabupaten' => 'Indramayu',
            'kecamatan' => 'Karangampel',
            'desa' => 'Karanganyar',
            'kodepos' => '45283',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ]);

        $this->assertDatabaseHas('wilayah', [
            'kecamatan' => 'Karangampel',
            'desa' => 'Karanganyar',
        ]);
    }

    public function test_full_address_accessor(): void
    {
        $wilayah = Wilayah::create([
            'provinsi' => 'Jawa Barat',
            'kabupaten' => 'Indramayu',
            'kecamatan' => 'Karangampel',
            'desa' => 'Karanganyar',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ]);

        $this->assertStringContainsString('Karanganyar', $wilayah->full_address);
        $this->assertStringContainsString('Karangampel', $wilayah->full_address);
        $this->assertStringContainsString('Indramayu', $wilayah->full_address);
        $this->assertStringContainsString('Jawa Barat', $wilayah->full_address);
    }

    public function test_has_many_laporan_bencana(): void
    {
        $wilayah = Wilayah::create([
            'provinsi' => 'Jawa Barat',
            'kabupaten' => 'Indramayu',
            'kecamatan' => 'Test',
            'latitude' => -6.3265,
            'longitude' => 108.3241,
        ]);

        $this->assertInstanceOf(HasMany::class, $wilayah->laporanBencana());
    }
}
