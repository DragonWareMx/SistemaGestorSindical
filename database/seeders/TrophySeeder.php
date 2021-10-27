<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TrophySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('trophies')->insert([
            'nombre'=>'Premio a la acción',
            'observaciones' => 'Lorem ipsum dolor et etd dolor etedipsum jomi.',
        ]);
        DB::table('employee_trophie')->insert([
            'employee_id'=>'1',
            'trophie_id' => '1',
        ]);
    }
}
