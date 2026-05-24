<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'Super Admin',
            'School Admin',
            'Principal',
            'Teacher',
            'Accountant',
            'Student',
            'Parent',
            'Librarian',
            'Transport Manager',
            'Receptionist'
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }
    }
}
