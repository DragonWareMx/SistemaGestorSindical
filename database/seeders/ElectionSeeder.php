<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ElectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('elections')->insert([
            'fecha' => '2020-08-02',
        ]);
        DB::table('election_employee')->insert([
            'employee_id'=>'1',
            'num_oficio' => 'SDJ13',
            'fecha_voto'=>'2020-08-03',
            'election_id'=>1,
        ]);


        DB::table('elections')->insert([
            'fecha' => '2021-11-11',
        ]);
        DB::table('election_employee')->insert([
            'employee_id'=>'2',
            'num_oficio' => 'AKLK3',
            'fecha_voto'=>'2021-11-12',
            'election_id'=>2,
        ]);
    }
}
