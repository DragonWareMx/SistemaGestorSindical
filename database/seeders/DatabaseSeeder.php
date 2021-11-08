<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        $this->call([
            CategorySeeder::class,
            RegimeSeeder::class,
            UnitSeeder::class,
            UserSeeder::class,
            PermissionSeeder::class,
            EmployeeSeeder::class,
            IssueSeeder::class,
            ConflictSeeder::class,
            TrophySeeder::class,
            ElectionSeeder::class,
        ]);

        Employee::factory()->count(15000)->create();
    }
}
