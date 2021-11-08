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
        $rolSecGeneral = Role::create([
            'name' => 'Secretario General',
            'slug' => 'secGen',
            'description' => 'Secretario General',
            'full-access' => 'no'
        ]);
        $rolResponsableHJ = Role::create([
            'name' => 'Responsable de Oficina de Honor y Justicia',
            'slug' => 'respHJ',
            'description' => 'Responsable de Oficina de Honor y Justicia',
            'full-access' => 'no'
        ]);
        $rolAsistenteHJ = Role::create([
            'name' => 'Asistente de Oficina de Honor y Justicia',
            'slug' => 'asistHJ',
            'description' => 'Responsable de Oficina de Honor y Justicia',
            'full-access' => 'no'
        ]);
        $rolResponsableConflict = Role::create([
            'name' => 'Responsable de Oficina de Conflictos',
            'slug' => 'respConflict',
            'description' => 'Responsable de Oficina de Conflictos',
            'full-access' => 'no'
        ]);
        $rolAsistenteConflict = Role::create([
            'name' => 'Asistente de Oficina de Conflictos',
            'slug' => 'asistConflict',
            'description' => 'Asistente de Oficina de Conflictos',
            'full-access' => 'no'
        ]);
        $rolResponsableSI = Role::create([
            'name' => 'Responsable de Oficina de Secretaría del Interior',
            'slug' => 'respSI',
            'description' => 'Responsable de Oficina de Secretaría del Interior',
            'full-access' => 'no'
        ]);
        $rolAsistenteSI = Role::create([
            'name' => 'Asistente de Oficina de Secretaría del Interior',
            'slug' => 'asistSI',
            'description' => 'Asistente de Oficina de Secretaría del Interior',
            'full-access' => 'no'
        ]);
        $rolResponsableST = Role::create([
            'name' => 'Responsable de Oficina de Secretaría del Trabajo',
            'slug' => 'respST',
            'description' => 'Responsable de Oficina de Secretaría del Trabajo',
            'full-access' => 'no'
        ]);
        $rolAsistenteST = Role::create([
            'name' => 'Asistente de Oficina de Secretaría del Trabajo',
            'slug' => 'asistST',
            'description' => 'Asistente de Oficina de Secretaría del Trabajo',
            'full-access' => 'no'
        ]);
        $rolResponsableAF = Role::create([
            'name' => 'Responsable de Oficina Acción Femenil',
            'slug' => 'respAF',
            'description' => 'Responsable de Oficina Acción Femenil',
            'full-access' => 'no'
        ]);
        $rolAsistenteAF = Role::create([
            'name' => 'Asistente de Oficina Acción Femenil',
            'slug' => 'asistAF',
            'description' => 'Asistente de Oficina Acción Femenil',
            'full-access' => 'no'
        ]);
        $rolResponsableAC = Role::create([
            'name' => 'Responsable de Oficina de Admisión y Cambios',
            'slug' => 'respAC',
            'description' => 'Responsable de Oficina de Admisión y Cambios',
            'full-access' => 'no'
        ]);
        $rolAsistenteAC = Role::create([
            'name' => 'Asistente de Oficina de Admisión y Cambios',
            'slug' => 'asistAC',
            'description' => 'Asistente de Oficina de Admisión y Cambios',
            'full-access' => 'no'
        ]);

        $user1 = User::find(1);
        $user2 = User::find(2);
        $user3 = User::find(3);
        $user4 = User::find(4);
        $user5 = User::find(5);
        $user6 = User::find(6);
        $user7 = User::find(7);
        $user8 = User::find(8);
        $user9 = User::find(9);
        $user10 = User::find(10);
        $user11 = User::find(11);
        $user12 = User::find(12);
        $user13 = User::find(13);
        $user14 = User::find(14);

        $user1->roles()->sync([$rolAdmin->id]);
        $user2->roles()->sync([$rolSecGeneral->id]);
        $user3->roles()->sync([$rolResponsableHJ->id]);
        $user4->roles()->sync([$rolAsistenteHJ->id]);
        $user5->roles()->sync([$rolResponsableConflict->id]);
        $user6->roles()->sync([$rolAsistenteConflict->id]);
        $user7->roles()->sync([$rolResponsableSI->id]);
        $user8->roles()->sync([$rolAsistenteSI->id]);
        $user9->roles()->sync([$rolResponsableST->id]);
        $user10->roles()->sync([$rolAsistenteST->id]);
        $user11->roles()->sync([$rolResponsableAF->id]);
        $user12->roles()->sync([$rolAsistenteAF->id]);
        $user13->roles()->sync([$rolResponsableAC->id]);
        $user14->roles()->sync([$rolAsistenteAC->id]);

        //permisos
        $permission_all = [];
        $permission_adm = [];
        $permission_sg = [];
        $permission_rhj = [];
        $permission_ahj = [];
        $permission_rconf = [];
        $permission_aconf = [];
        $permission_rsi = [];
        $permission_asi = [];
        $permission_rst = [];
        $permission_ast = [];
        $permission_raf = [];
        $permission_aaf = [];
        $permission_rac = [];
        $permission_aac = [];


        ///////////////permisos para Usuarios//////////////////////////////////////////////////////////////////////////
        $permission = Permission::create([
            'name' => 'Admin',
            'slug' => 'admin.perm',
            'description' => 'El usuario es un Administrador'
        ]);
        $permission_all[] = $permission->id;
        $permission_adm[] = $permission->id;

        $permission = Permission::create([
            'name' => 'SecGen',
            'slug' => 'sg.perm',
            'description' => 'El usuario es un Secretario General'
        ]);
        $permission_all[] = $permission->id;
        $permission_sg[] = $permission->id;

        $permission = Permission::create([
            'name' => 'respHJ',
            'slug' => 'rhj.perm',
            'description' => 'El usuario es un Responsable de Oficina'
        ]);
        $permission_all[] = $permission->id;
        $permission_rhj[] = $permission->id;


        $permission = Permission::create([
            'name' => 'asistHJ',
            'slug' => 'ahj.perm',
            'description' => 'El usuario es un Asistente de Oficina'
        ]);
        $permission_all[] = $permission->id;
        $permission_ahj[] = $permission->id;

        $permission = Permission::create([
            'name' => 'respConflict',
            'slug' => 'rconf.perm',
            'description' => 'El usuario es un Responsable de Oficina'
        ]);
        $permission_all[] = $permission->id;
        $permission_rconf[] = $permission->id;


        $permission = Permission::create([
            'name' => 'asistConflict',
            'slug' => 'aconf.perm',
            'description' => 'El usuario es un Asistente de Oficina'
        ]);
        $permission_all[] = $permission->id;
        $permission_aconf[] = $permission->id;

        $permission = Permission::create([
            'name' => 'respSI',
            'slug' => 'rsi.perm',
            'description' => 'El usuario es un Responsable de Oficina'
        ]);
        $permission_all[] = $permission->id;
        $permission_rsi[] = $permission->id;


        $permission = Permission::create([
            'name' => 'asistSI',
            'slug' => 'asi.perm',
            'description' => 'El usuario es un Asistente de Oficina'
        ]);
        $permission_all[] = $permission->id;
        $permission_asi[] = $permission->id;

        $permission = Permission::create([
            'name' => 'respST',
            'slug' => 'rst.perm',
            'description' => 'El usuario es un Responsable de Oficina'
        ]);
        $permission_all[] = $permission->id;
        $permission_rst[] = $permission->id;


        $permission = Permission::create([
            'name' => 'asistST',
            'slug' => 'ast.perm',
            'description' => 'El usuario es un Asistente de Oficina'
        ]);
        $permission_all[] = $permission->id;
        $permission_ast[] = $permission->id;

        $permission = Permission::create([
            'name' => 'respAF',
            'slug' => 'raf.perm',
            'description' => 'El usuario es un Responsable de Oficina'
        ]);
        $permission_all[] = $permission->id;
        $permission_raf[] = $permission->id;


        $permission = Permission::create([
            'name' => 'asistAF',
            'slug' => 'aaf.perm',
            'description' => 'El usuario es un Asistente de Oficina'
        ]);
        $permission_all[] = $permission->id;
        $permission_aaf[] = $permission->id;

        $permission = Permission::create([
            'name' => 'respAC',
            'slug' => 'rac.perm',
            'description' => 'El usuario es un Responsable de Oficina'
        ]);
        $permission_all[] = $permission->id;
        $permission_rac[] = $permission->id;


        $permission = Permission::create([
            'name' => 'asistAC',
            'slug' => 'aac.perm',
            'description' => 'El usuario es un Asistente de Oficina'
        ]);
        $permission_all[] = $permission->id;
        $permission_aac[] = $permission->id;


        $rolAdmin->permissions()->sync($permission_adm);
        $rolSecGeneral->permissions()->sync($permission_sg);
        $rolResponsableHJ->permissions()->sync($permission_rhj);
        $rolAsistenteHJ->permissions()->sync($permission_ahj);
        $rolResponsableConflict->permissions()->sync($permission_rconf);
        $rolAsistenteConflict->permissions()->sync($permission_aconf);
        $rolResponsableSI->permissions()->sync($permission_rsi);
        $rolAsistenteSI->permissions()->sync($permission_asi);
        $rolResponsableST->permissions()->sync($permission_rst);
        $rolAsistenteST->permissions()->sync($permission_ast);
        $rolResponsableAF->permissions()->sync($permission_raf);
        $rolAsistenteAF->permissions()->sync($permission_aaf);
        $rolResponsableAC->permissions()->sync($permission_rac);
        $rolAsistenteAC->permissions()->sync($permission_aac);
    }
}
