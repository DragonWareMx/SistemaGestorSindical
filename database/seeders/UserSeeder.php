<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
            'uuid' => Str::uuid(),
            'email' =>  'test@dragonware.com.mx',
            'password' => Hash::make('viledruid9000'),
        ]);

        DB::table('users')->insert([
            'uuid' => Str::uuid(),
            'email' =>  'lopez_lopez_daniel@hotmail.com',
            'password' => Hash::make('viledruid9000'),
        ]);

        DB::table('users')->insert([
            'uuid' => Str::uuid(),
            'email' =>  'responsableHJ@hotmail.com',
            'password' => Hash::make('viledruid9000'),
        ]);

        DB::table('users')->insert([
            'uuid' => Str::uuid(),
            'email' =>  'asistenteHJ@hotmail.com',
            'password' => Hash::make('viledruid9000'),
        ]);

        DB::table('users')->insert([
            'uuid' => Str::uuid(),
            'email' =>  'responsableConflict@hotmail.com',
            'password' => Hash::make('viledruid9000'),
        ]);

        DB::table('users')->insert([
            'uuid' => Str::uuid(),
            'email' =>  'asistenteConflict@hotmail.com',
            'password' => Hash::make('viledruid9000'),
        ]);

        DB::table('users')->insert([
            'uuid' => Str::uuid(),
            'email' =>  'responsableSI@hotmail.com',
            'password' => Hash::make('viledruid9000'),
        ]);

        DB::table('users')->insert([
            'uuid' => Str::uuid(),
            'email' =>  'asistenteSI@hotmail.com',
            'password' => Hash::make('viledruid9000'),
        ]);

        DB::table('users')->insert([
            'uuid' => Str::uuid(),
            'email' =>  'responsableST@hotmail.com',
            'password' => Hash::make('viledruid9000'),
        ]);

        DB::table('users')->insert([
            'uuid' => Str::uuid(),
            'email' =>  'asistenteST@hotmail.com',
            'password' => Hash::make('viledruid9000'),
        ]);

        DB::table('users')->insert([
            'uuid' => Str::uuid(),
            'email' =>  'responsableAF@hotmail.com',
            'password' => Hash::make('viledruid9000'),
        ]);

        DB::table('users')->insert([
            'uuid' => Str::uuid(),
            'email' =>  'asistenteAF@hotmail.com',
            'password' => Hash::make('viledruid9000'),
        ]);

        DB::table('users')->insert([
            'uuid' => Str::uuid(),
            'email' =>  'responsableAC@hotmail.com',
            'password' => Hash::make('viledruid9000'),
        ]);

        DB::table('users')->insert([
            'uuid' => Str::uuid(),
            'email' =>  'asistenteAC@hotmail.com',
            'password' => Hash::make('viledruid9000'),
        ]);

    }
}
