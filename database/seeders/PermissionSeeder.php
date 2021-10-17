<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Permission\Models\Role;
use App\Permission\Models\Permission;
use App\Models\User;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $rolAdmin = Role::create([
            'name' => 'Administrador',
            'slug' => 'admin',
            'description' => 'Administrador',
            'full-access' => 'no'
        ]);
        // $rolPonente = Role::create([
        //     'name' => 'Ponente',
        //     'slug' => 'ponente',
        //     'description' => 'ponente',
        //     'full-access' => 'no'
        // ]);
        // $rolAlumno = Role::create([
        //     'name' => 'Alumno',
        //     'slug' => 'alumno',
        //     'description' => 'alumno',
        //     'full-access' => 'no'
        // ]);


        // $user1 = User::find(1);
        // $user2 = User::find(2);
        // $user3 = User::find(3);
        // $user4 = User::find(4);
        // $user5 = User::find(5);
        // $user6 = User::find(6);
        // $user7 = User::find(7);
        // $user8 = User::find(8);
        // $user9 = User::find(9);
        // $user10 = User::find(10);
        // $user11 = User::find(11);
        // $user12 = User::find(12);
        // $user13 = User::find(13);
        // $user14 = User::find(14);

        // $user1->roles()->sync([$rolAdmin->id]);
        // $user2->roles()->sync([$rolAdmin->id]);
        // $user3->roles()->sync([$rolPonente->id]);
        // $user4->roles()->sync([$rolAlumno->id]);
        // $user5->roles()->sync([$rolAlumno->id]);
        // $user6->roles()->sync([$rolAlumno->id]);
        // $user7->roles()->sync([$rolAdmin->id]);
        // $user8->roles()->sync([$rolPonente->id]);
        // $user9->roles()->sync([$rolAlumno->id]);
        // $user10->roles()->sync([$rolAlumno->id]);
        // $user11->roles()->sync([$rolAlumno->id]);
        // $user12->roles()->sync([$rolAlumno->id]);
        // $user13->roles()->sync([$rolAlumno->id]);
        // $user14->roles()->sync([$rolAlumno->id]);


        //permisos
        // $permission_all = [];
        // $permission_pon = [];
        // $permission_adm = [];
        // $permission_al = [];


        ///////////////permisos para Usuarios//////////////////////////////////////////////////////////////////////////
        // $permission = Permission::create([
        //     'name' => 'Alumno',
        //     'slug' => 'alumno.perm',
        //     'description' => 'El usuario es un Alumno'
        // ]);
        // $permission_all[] = $permission->id;
        // $permission_al[] = $permission->id;

        // $permission = Permission::create([
        //     'name' => 'Admin',
        //     'slug' => 'admin.perm',
        //     'description' => 'El usuario es un Admin'
        // ]);
        // $permission_all[] = $permission->id;
        // $permission_adm[] = $permission->id;

        // $permission = Permission::create([
        //     'name' => 'Ponente',
        //     'slug' => 'ponente.perm',
        //     'description' => 'El usuario es un Ponente'
        // ]);
        // $permission_all[] = $permission->id;
        // $permission_pon[] = $permission->id;

        // $rolAdmin->permissions()->sync($permission_adm);
        // $rolPonente->permissions()->sync($permission_pon);
        // $rolAlumno->permissions()->sync($permission_al);
    }
}