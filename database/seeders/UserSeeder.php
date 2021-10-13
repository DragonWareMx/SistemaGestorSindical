<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('users')->insert([
            'name' => 'John Penneth',
            'email' =>  'test@dragonware.com.mx',
            'password' => Hash::make('viledruid9000'),
        ]);

        DB::table('users')->insert([
            'name' => 'Leonardo Lopez',
            'email' =>  'lopez_lopez_daniel@hotmail.com',
            'password' => Hash::make('viledruid9000'),
        ]);
    }
}