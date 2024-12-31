<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create the roles
        $adminRole = Role::create(['name' => 'admin']);
        $userRole = Role::create(['name' => 'user']);

        // Create a default admin user (you can customize this)
        $adminUser = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'), // Hash the password
        ]);

        // Create a default regular user
        $regularUser = User::factory()->create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => bcrypt('password'), // Hash the password
        ]);

        // Assign the roles to the users
        $adminUser->assignRole($adminRole);
        $regularUser->assignRole($userRole);

        //You can create more users and assign roles as needed
        User::factory(5)->create()->each(function ($user) use ($userRole) {
            $user->assignRole($userRole);
        });

        User::factory(2)->create()->each(function ($user) use ($adminRole) {
            $user->assignRole($adminRole);
        });

    }
}
