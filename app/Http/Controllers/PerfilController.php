<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Auth;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Str;
use App\Models\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

class PerfilController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    //  funcion que devuelve los datos dle usuario para mostrarlos en la vista del perfil
    public function index()
    {
        $usuario = User::with(
                            'employee:user_id,nombre,apellido_p,apellido_m,fecha_nac,sexo,matricula,antiguedad,calle,num_ext,num_int,colonia,ciudad,estado,cp,tel,created_at,unit_id,category_id',
                            'employee.unit:id,nombre,regime_id',
                            'employee.unit.regime:nombre,id',
                            'employee.category:nombre,id',
                            'roles:name',
                        )
                        ->where('users.id',Auth::id())
                        ->first();

        // dd($usuario);
        return Inertia::render('Perfil/Perfil',['user'=>$usuario]);
    }

    //vista donde se puede ver el perfil público de otros estudiantes y profesores
    // public function verPerfil($id)
    // {
    //     $usuario = User::with('roles:name','teacherCourses')
    //                 ->select('nombre','apellido_p','apellido_m','created_at','email','foto','id')
    //                 ->findOrFail($id);
                
    //     $cursos = $usuario->teacherCourses->count();

    //     $participantes = 0;

    //     foreach ($usuario->teacherCourses as $curso) {
    //         $participantes += $curso->users()->get()->count();
    //     }

    //     return Inertia::render('Perfil/PerfilPublico',['user'=>$usuario, 'cursos' => $cursos, 'participantes' => $participantes]);
    // }

    //  funcion que devuelve los datos del usuario para mostrarlos en la pantalla de configuracion del perfil
    public function edit()
    {
        $usuario = User::with(
            'employee:user_id,nombre,apellido_p,apellido_m,fecha_nac,sexo,matricula,antiguedad,calle,num_ext,num_int,colonia,ciudad,estado,cp,tel,created_at,deleted_at,unit_id,category_id',
            'employee.unit:id,nombre,regime_id',
            'employee.unit.regime:nombre,id',
            'employee.category:nombre,id',
            'roles:name',
        )
        ->where('users.id',Auth::id())
        ->first();

        return Inertia::render('Perfil/Configuracion',['user'=>$usuario]);
    }

    // public function update(Request $request)
    // {
    //     $validated = $request->validate([
    //         'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:51200',

    //         //---informacion personal---
    //         'nombre' => ['required','max:255','regex:/^[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*$/i'],
    //         'apellido_paterno' => ['required','max:255','regex:/^[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*$/i'],
    //         'apellido_materno' => ['nullable','max:255','regex:/^[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*$/i'],
    //         'fecha_de_nacimiento' => 'required|date|before:17 years ago',
    //         'sexo' => 'required|in:h,m,o',

    //         //direccion
    //         'estado' => ['required','max:50','regex:/^[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*$/i'],
    //         'ciudad' => ['required','max:60','regex:/^[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*$/i'],
    //         'colonia' => ['required','max:100','regex:/^[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*$/i'],
    //         'calle' => ['required','max:100','regex:/^[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*$/i'],
    //         'numero_exterior' => ['required','max:10','regex:/^(((#|[nN][oO]|[a-zA-Z1-9À-ÖØ-öø-ÿ]*\.?) ?)?\d{1,4}(( ?[a-zA-Z0-9\-]+)+)?)$/i'],
    //         'numero_interior' => ['nullable','max:10','regex:/^(((#|[nN][oO]|[a-zA-Z1-9À-ÖØ-öø-ÿ]*\.?) ?)?\d{1,4}(( ?[a-zA-Z0-9\-]+)+)?)$/i'],
    //         'codigo_postal' => ['required','max:9','regex:/^\d{5}$/i'],


    //         'cambiar_contrasena' => 'required|boolean',
    //         'contrasena' => [
    //             'nullable',
    //             Password::min(8)
    //                 ->mixedCase()
    //                 ->letters()
    //                 ->numbers()
    //                 ->uncompromised(),
    //         ],
    //         'confirmar_contrasena' => 'required_with:contrasena|same:contrasena',
    //     ]);
    //     // El usuario es valido...

    //     //si hay cambio de contraseña valida que no sea nula
    //     if($request->cambiar_contrasena){
    //         if(is_null($request->contrasena)){
    //             DB::rollBack();
    //             return \Redirect::back()->with('error','La nueva contraseña no ha sido introducida.');
    //         }
    //     }

    //     //variables para comprobar la subida de archivos
    //     $foto = null;

    //     //COMIENZA LA TRANSACCION
    //     DB::beginTransaction();

    //     try {

    //         //SE ENCUENTRA EL USUARIO LOGGEADO
    //         $user = User::find(Auth::User()->id);

    //         //guarda la foto
    //         if(!is_null($request->file('foto'))){
    //             if($user->foto){
    //                 \Storage::delete('public/fotos_perfil/'.$user->foto);
    //             }
    //             $foto = $request->file('foto')->store('public/fotos_perfil');
    //             $user->foto = $request->file('foto')->hashName();
    //         }
            
    //         //---informacion personal---
    //         $user->nombre = $request->nombre;
    //         $user->apellido_p = $request->apellido_paterno;
    //         $user->apellido_m = $request->apellido_materno;
    //         $user->fecha_nac = $request->fecha_de_nacimiento;
    //         $user->sexo = $request->sexo;
            
    //         //---direccion---
    //         $user->estado = $request->estado;
    //         $user->ciudad = $request->ciudad;
    //         $user->colonia = $request->colonia;
    //         $user->calle = $request->calle;
    //         $user->num_ext = $request->numero_exterior;
    //         $user->num_int = $request->numero_interior;
    //         $user->cp = $request->codigo_postal;
            
    //         //---cuenta---
    //         if($request->cambiar_contrasena){
    //             $user->password = \Hash::make($request->contrasena);
    //         }

    //         //SE GUARDA EL NUEVO USUARIO
    //         $user->save();

    //         //SE CREA EL LOG
    //         $newLog = new Log;
            
    //         $newLog->categoria = 'update';
    //         $newLog->user_id = Auth::id();
    //         $newLog->accion =
    //         '{
    //             users: {
    //                 nombre: ' . $request->nombre . ',\n
    //                 apellido_p: ' . $request->apellido_paterno . ',\n
    //                 apellido_m: ' . $request->apellido_materno . ',\n
    //                 fecha_nac: ' . $request->fecha_de_nacimiento . ',\n
    //                 sexo: '. $request->sexo. ',\n

    //                 estado: ' . $request->estado . ',\n
    //                 ciudad: ' . $request->ciudad . ',\n
    //                 colonia: ' . $request->colonia . ',\n
    //                 calle: ' . $request->calle . ',\n
    //                 num_ext: ' . $request->numero_exterior . ',\n
    //                 num_int: ' . $request->numero_interior . ',\n
    //                 cp: ' . $request->codigo_postal . ',\n

                    
    //             }
    //         }';

    //         $newLog->descripcion = 'El usuario '.Auth::user()->email.' ha actualizado sus datos';
                
    //         //SE GUARDA EL LOG
    //         $newLog->save();
            
            
    //         if(!$user)
    //         {
    //             DB::rollBack();
    //             //si hay foto se elimina del servidor
    //             if($foto)
    //             {
    //                 \Storage::delete($foto);
    //             }

    //             return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el usuario, inténtelo más tarde.');
    //         }
    //         if(!$newLog)
    //         {
    //             DB::rollBack();
    //             //si hay foto se elimina del servidor
    //             if($foto)
    //             {
    //                 \Storage::delete($foto);
    //             }
                
    //             return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el usuario, inténtelo más tarde.');
    //         }

    //         //SE HACE COMMIT
    //         DB::commit();
            
    //         //REDIRECCIONA A LA VISTA DE USUARIOS
    //         return \Redirect::back()->with('success','El usuario ha sido editado con éxito!');
    //     } catch (\Exception $e) {
    //         DB::rollBack();

    //         //si hay foto se elimina del servidor
    //         if($foto)
    //         {
    //             \Storage::delete($foto);
    //         }
            
    //         return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el usuario, inténtelo más tarde.');
    //     }
    // }

    //  funcion para actualizar los datos del perfil
    public function update(Request $request)
    {
        //valida el rol del usuario
        // \Gate::authorize('haveaccess', 'admin.perm');

        $validated = $request->validate([ 
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:51200',

            //---informacion personal---
            'nombre' => ['required','max:255','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'apellido_paterno' => ['required','max:255','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'apellido_materno' => ['nullable','max:255','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'fecha_de_nacimiento' => 'required|date|before:17 years ago',
            'sexo' => 'required|in:h,m,o',

            //---cambio de contrasena---
            'cambiar_contrasena' => 'required|boolean',
            'contrasena' => [
                'nullable',
                Password::min(8)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->uncompromised(),
            ],
            'confirmar_contrasena' => 'required_with:contrasena|same:contrasena',
        ]);
        //si se introdujo algun dato para la direccion se validan los campos
        if($request->estado || $request->ciudad || $request->colonia || $request->calle || $request->numero_exterior || $request->numero_interior || $request->codigo_postal || $request->telefono){
            $validated = $request->validate([ 
                //direccion
                'estado' => ['required','max:50','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'ciudad' => ['required','max:60','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'colonia' => ['required','max:100','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'calle' => ['required','max:100','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'numero_exterior' => ['required','max:10','regex:/^(((#|[nN][oO]|[a-zA-Z1-9À-ÖØ-öø-ÿ]*\.?) ?)?\d{1,4}(( ?[a-zA-Z0-9\-]+)+)?)$/i'],
                'numero_interior' => ['nullable','max:10','regex:/^(((#|[nN][oO]|[a-zA-Z1-9À-ÖØ-öø-ÿ]*\.?) ?)?\d{1,4}(( ?[a-zA-Z0-9\-]+)+)?)$/i'],
                'codigo_postal' => ['required','max:9','regex:/^\d{5}$/i'],
                'telefono' => ['nullable','max:25','regex:/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.0-9]*$/i'],
            ]);
        }
        // El nuevo empleado es valido...

        //si hay cambio de contraseña valida que no sea nula
        if($request->cambiar_contrasena){
            if(is_null($request->contrasena)){
                DB::rollBack();
                return \Redirect::back()->with('error','La nueva contraseña no ha sido introducida.');
            }
        }

        //variables para comprobar la subida de archivos
        $foto = null;

        //COMIENZA LA TRANSACCION
        DB::beginTransaction();

        try {
            //SE CREA EL NUEVO EMPLEADO
            $employee = Employee::where('user_id',Auth::id())->first();
            
            //SE CREA EL NUEVO USUARIO
            $user = User::find(Auth::User()->id);
            // $user = User::findOrFail($id);
            
            //---informacion personal---
            $employee->nombre = $request->nombre;
            $employee->apellido_p = $request->apellido_paterno;
            $employee->apellido_m = $request->apellido_materno;
            $employee->fecha_nac = $request->fecha_de_nacimiento;
            $employee->sexo = $request->sexo;
            
            //---direccion---
            $employee->estado = $request->estado;
            $employee->ciudad = $request->ciudad;
            $employee->colonia = $request->colonia;
            $employee->calle = $request->calle;
            $employee->num_ext = $request->numero_exterior;
            $employee->num_int = $request->numero_interior;
            $employee->cp = $request->codigo_postal;
            $employee->tel = $request->telefono;
            
            //guarda la foto
            if(!is_null($request->file('foto'))){
                if($user->foto){
                    \Storage::delete('public/fotos_perfil/'.$user->foto);
                }
                $foto = $request->file('foto')->store('public/fotos_perfil');
                $user->foto = $request->file('foto')->hashName();
            }

            //---cuenta---
            $user->email = $request->email;

            if($request->cambiar_contrasena){
                $user->password = \Hash::make($request->contrasena);
            }

            //SE GUARDA EL NUEVO USUARIO
            $user->save();
            
            //SE GUARDA EL NUEVO EMPLEADO
            $employee->save();

            //guarda la foto
            if(!is_null($request->file('foto'))){
                if($user->foto){
                    \Storage::delete('public/fotos_perfil/'.$user->foto);
                }
                $foto = $request->file('foto')->store('public/fotos_perfil');
                $user->foto = $request->file('foto')->hashName();
            }

            //SE CREA EL LOG
            $newLog = new Log;
            
            $newLog->uuid = Str::uuid();

            $newLog->categoria = 'update';
            $newLog->user_id = Auth::id();
            $newLog->accion =
            '{
                employees: {
                    nombre: ' . $request->nombre . ',\n
                    apellido_p: ' . $request->apellido_paterno . ',\n
                    apellido_m: ' . $request->apellido_materno . ',\n
                    fecha_nac: ' . $request->fecha_de_nacimiento . ',\n
                    sexo: '. $request->sexo. ',\n
                    antiguedad: ' . $request->antiguedad . ',\n
                    estado: ' . $request->estado . ',\n
                    ciudad: ' . $request->ciudad . ',\n
                    colonia: ' . $request->colonia . ',\n
                    calle: ' . $request->calle . ',\n
                    num_ext: ' . $request->numero_exterior . ',\n
                    num_int: ' . $request->numero_interior . ',\n
                    cp: ' . $request->codigo_postal . ',\n'.
                '}
            }';

            $newLog->descripcion = 'El usuario '.Auth::user()->email.' ha editado su perfil';
                
            //SE GUARDA EL LOG
            $newLog->save();
            
            if(!$employee)
            {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if($foto)
                {
                    \Storage::delete($foto);
                }

                return \Redirect::back()->with('error','Ha ocurrido un error al intentar editar el perfil, inténtelo más tarde.');
            }

            if(!$newLog)
            {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if($foto)
                {
                    \Storage::delete($foto);
                }
                return \Redirect::back()->with('error','Ha ocurrido un error al intentar editar el perfil, inténtelo más tarde.');
            }

            //SE HACE COMMIT
            DB::commit();
            
            //REDIRECCIONA A LA VISTA DEL EMPLEADO
            return \Redirect::back()->with('success','El perfil ha sido editado con éxito!');
        } catch (\Exception $e) {
            DB::rollBack();
            
            //si hay foto se elimina del servidor
            if($foto)
            {
                \Storage::delete($foto);
            }

            dd($e);
            return \Redirect::back()->with('error','Ha ocurrido un error al intentar editar el perfil, inténtelo más tarde.');
        }
    }

}
