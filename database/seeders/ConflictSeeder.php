<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConflictSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('conflicts')->insert([
            'uuid'=>'5684136574',
            'num_oficio'=>'658547',
            'observaciones' => 'Lorem ipsum dolor et Lorem ipsum dolor et',
            'tipo'=>'conflictos',
        ]);
        DB::table('conflict_employee')->insert([
            'employee_id'=>'1',
            'conflict_id' => '1',
            'castigado'=>0,
            'resolutivo'=>'Lorem ip´sum dolor et inmune at et si',
        ]);
        DB::table('conflicts')->insert([
            'uuid'=>'5487584962',
            'num_oficio'=>'632145',
            'observaciones' => 'Lorem ipsum dolor et Lorem ipsum dolor et',
            'tipo'=>'conflictos',
        ]);
        DB::table('conflict_employee')->insert([
            'employee_id'=>'2',
            'conflict_id' => '2',
            'castigado'=>1,
            'resolutivo'=>'Lorem ip´sum dolor et inmune at et si',
            'sancion'=>'lorem ipsum dolor ent sancion',
            'inicio_sancion'=>'2021-11-26',
            'termino_sancion'=>'2021-12-09',
        ]);
        DB::table('conflicts')->insert([
            'uuid'=>'84598454154',
            'num_oficio'=>'632111',
            'observaciones' => 'Lorem ipsum dolor et Lorem ipsum dolor et',
            'tipo'=>'secretaria',
        ]);
        DB::table('conflict_employee')->insert([
            'employee_id'=>'1',
            'conflict_id' => '3',
            'castigado'=>1,
            'resolutivo'=>'Lorem ip´sum dolor et inmune at et si',
            'sancion'=>'lorem ipsum dolor ent sancion',
            'inicio_sancion'=>'2021-11-26',
            'termino_sancion'=>'2021-12-09',
        ]);
    }
}
