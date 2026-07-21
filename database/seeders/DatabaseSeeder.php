<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            PermissionSeeder::class,
            JenisBencanaSeeder::class,
            StatusLaporanSeeder::class,
            WilayahApiSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'is_admin' => true,
        ]);

        $this->call(DummyDataSeeder::class);
    }
}
