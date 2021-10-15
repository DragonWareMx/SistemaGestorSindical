<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('units')->insert([
            'nombre' => 'HGZ 83 - Morelia',
            'regime_id' => 1
        ]);
        DB::table('units')->insert([
            'nombre' => 'HGZ MF 12 - Lázaro Cárdenas',
            'regime_id' => 1
        ]);
        DB::table('units')->insert([
            'nombre' => 'UMF 10 - Jungapeo',
            'regime_id' => 2
        ]);
    }
}
