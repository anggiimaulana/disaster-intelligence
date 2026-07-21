<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'manage users',
            'manage roles',
            'manage settings',
            'manage incidents',
            'manage analysis',
            'manage validation',
            'manage alerts',
            'manage news',
            'manage preparedness',
            'manage faq',
            'manage disaster types',
            'manage regencies',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        $superAdmin = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => 'web']);
        $superAdmin->syncPermissions(Permission::all());

        $operator = Role::firstOrCreate(['name' => 'operator', 'guard_name' => 'web']);
        $operator->syncPermissions([
            'manage incidents',
            'manage validation',
            'manage alerts',
            'manage analysis',
        ]);

        $viewer = Role::firstOrCreate(['name' => 'viewer', 'guard_name' => 'web']);
        $viewer->syncPermissions([
            'manage incidents',
        ]);
    }
}
