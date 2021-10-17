<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IssueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('issues')->insert([
            'uuid'=>'1549567846',
            'num_oficio'=>'164553',
            'observaciones' => 'Lorem ipsum dolor et',
        ]);
        DB::table('employee_issue')->insert([
            'employee_id'=>'1',
            'issue_id' => '1',
            'castigado'=>1,
            'inicio_sancion'=>'2021-10-12',
            'termino_sancion'=>'2021-11-12',
            'sancion'=>'lorem ipsum dolor ed dolor et istum at lorem ipsum',
        ]);
        DB::table('employee_issue')->insert([
            'employee_id'=>'2',
            'issue_id' => '1',
            'castigado'=>0,
        ]);

        DB::table('issues')->insert([
            'uuid'=>'9854816487',
            'num_oficio'=>'215468',
            'observaciones' => 'et lorem dolor et Lorem ipsum dolor et',
        ]);
        DB::table('employee_issue')->insert([
            'employee_id'=>'1',
            'issue_id' => '2',
            'castigado'=>0,
        ]);
        DB::table('employee_issue')->insert([
            'employee_id'=>'2',
            'issue_id' => '2',
            'castigado'=>1,
            'inicio_sancion'=>'2021-11-23',
            'termino_sancion'=>'2021-11-30',
            'sancion'=>'lorem ipsum dolor ed dolor et istum at lorem ipsum',
        ]);
    }
}
