<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('employees')->insert([
            'uuid'=>'1324356478',
            'matricula' => '17121052',
            'nombre'=>'John Doe',
            'apellido_p'=>'Pérez',
            'apellido_m'=>'Segundo',
            'fecha_nac'=>'1997-10-15',
            'sexo'=>'h',
            'antiguedad'=>'2018-01-16',
            'estado'=>'Michoacán',
            'ciudad'=>'Morelia',
            'colonia'=>'Colonia 1',
            'calle'=>'calle 1',
            'num_int'=>'16',
            'num_ext'=>'596',
            'cp'=>'58512',
            'tel'=>'4434044444',
            'user_id'=>'1',
            'category_id'=>'1',
            'unit_id'=>'1',
        ]);
        DB::table('employees')->insert([
            'uuid'=>'1548765819',
            'matricula' => '17121056',
            'nombre'=>'Joaquín',
            'apellido_p'=>'Dimitri',
            'apellido_m'=>'Rodriguez',
            'fecha_nac'=>'1988-11-23',
            'sexo'=>'h',
            'antiguedad'=>'2019-03-02',
            'estado'=>'Michoacán',
            'ciudad'=>'Morelia',
            'colonia'=>'Colonia 1',
            'calle'=>'calle 1',
            'num_int'=>'16',
            'num_ext'=>'596',
            'cp'=>'58512',
            'tel'=>'4434044444',
            'user_id'=>'2',
            'category_id'=>'2',
            'unit_id'=>'2',
        ]);

        DB::table('employees')->insert([
            'uuid'=>'6666666',
            'matricula' => '17121030',
            'nombre'=>'Beatriz',
            'apellido_p'=>'Dama',
            'apellido_m'=>'Piña',
            'fecha_nac'=>'1999-03-02',
            'sexo'=>'m',
            'antiguedad'=>'2017-01-01',
            'estado'=>'Michoacán',
            'ciudad'=>'Morelia',
            'colonia'=>'Centro',
            'calle'=>'Lucha del porvenir',
            'num_int'=>'13',
            'num_ext'=>'13',
            'cp'=>'58960',
            'tel'=>'4444444444',
            'category_id'=>'1',
            'unit_id'=>'2',
            'estatus'=>'Aceptado',
        ]);

        DB::table('employee_relative')->insert([
            'parentesco'=>'hijo',
            'ingreso_bolsa'=>'2020-01-01',
            'employee_id'=>'1',
            'relative_id'=>'3',
        ]);
    }
}
