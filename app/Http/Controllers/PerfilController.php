<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Auth;
use App\Models\User;
use App\Models\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

class PerfilController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $usuario = User::with('category:nombre,id','roles:name','unit:id,nombre,regime_id','unit.regime:nombre,id')
                    ->where('users.id',Auth::id())
                    ->first();

        return Inertia::render('Perfil/Perfil',['user'=>$usuario]);
    }

    //vista donde se puede ver el perfil público de otros estudiantes y profesores
    public function verPerfil($id)
    {
        $usuario = User::with('roles:name','teacherCourses')
                    ->select('nombre','apellido_p','apellido_m','created_at','email','foto','id')
                    ->findOrFail($id);
                
        $cursos = $usuario->teacherCourses->count();

        $participantes = 0;

        foreach ($usuario->teacherCourses as $curso) {
            $participantes += $curso->users()->get()->count();
        }

        return Inertia::render('Perfil/PerfilPublico',['user'=>$usuario, 'cursos' => $cursos, 'participantes' => $participantes]);
    }

    public function edit()
    {
        return Inertia::render('Perfil/Configuracion', [
            'user' => User::findOrFail(Auth::User()->id),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:51200',

            //---informacion personal---
            'nombre' => ['required','max:255','regex:/^[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*$/i'],
            'apellido_paterno' => ['required','max:255','regex:/^[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*$/i'],
            'apellido_materno' => ['nullable','max:255','regex:/^[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*$/i'],
            'fecha_de_nacimiento' => 'required|date|before:17 years ago',
            'sexo' => 'required|in:h,m,o',

            //direccion
            'estado' => ['required','max:50','regex:/^[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*$/i'],
            'ciudad' => ['required','max:60','regex:/^[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*$/i'],
            'colonia' => ['required','max:100','regex:/^[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*$/i'],
            'calle' => ['required','max:100','regex:/^[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*$/i'],
            'numero_exterior' => ['required','max:10','regex:/^(((#|[nN][oO]|[a-zA-Z1-9À-ÖØ-öø-ÿ]*\.?) ?)?\d{1,4}(( ?[a-zA-Z0-9\-]+)+)?)$/i'],
            'numero_interior' => ['nullable','max:10','regex:/^(((#|[nN][oO]|[a-zA-Z1-9À-ÖØ-öø-ÿ]*\.?) ?)?\d{1,4}(( ?[a-zA-Z0-9\-]+)+)?)$/i'],
            'codigo_postal' => ['required','max:9','regex:/^\d{5}$/i'],


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
        // El usuario es valido...

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

            //SE ENCUENTRA EL USUARIO LOGGEADO
            $user = User::find(Auth::User()->id);

            //guarda la foto
            if(!is_null($request->file('foto'))){
                if($user->foto){
                    \Storage::delete('public/fotos_perfil/'.$user->foto);
                }
                $foto = $request->file('foto')->store('public/fotos_perfil');
                $user->foto = $request->file('foto')->hashName();
            }
            
            //---informacion personal---
            $user->nombre = $request->nombre;
            $user->apellido_p = $request->apellido_paterno;
            $user->apellido_m = $request->apellido_materno;
            $user->fecha_nac = $request->fecha_de_nacimiento;
            $user->sexo = $request->sexo;
            
            //---direccion---
            $user->estado = $request->estado;
            $user->ciudad = $request->ciudad;
            $user->colonia = $request->colonia;
            $user->calle = $request->calle;
            $user->num_ext = $request->numero_exterior;
            $user->num_int = $request->numero_interior;
            $user->cp = $request->codigo_postal;
            
            //---cuenta---
            if($request->cambiar_contrasena){
                $user->password = \Hash::make($request->contrasena);
            }

            //SE GUARDA EL NUEVO USUARIO
            $user->save();

            //SE CREA EL LOG
            $newLog = new Log;
            
            $newLog->categoria = 'update';
            $newLog->user_id = Auth::id();
            $newLog->accion =
            '{
                users: {
                    nombre: ' . $request->nombre . ',\n
                    apellido_p: ' . $request->apellido_paterno . ',\n
                    apellido_m: ' . $request->apellido_materno . ',\n
                    fecha_nac: ' . $request->fecha_de_nacimiento . ',\n
                    sexo: '. $request->sexo. ',\n

                    estado: ' . $request->estado . ',\n
                    ciudad: ' . $request->ciudad . ',\n
                    colonia: ' . $request->colonia . ',\n
                    calle: ' . $request->calle . ',\n
                    num_ext: ' . $request->numero_exterior . ',\n
                    num_int: ' . $request->numero_interior . ',\n
                    cp: ' . $request->codigo_postal . ',\n

                    
                }
            }';

            $newLog->descripcion = 'El usuario '.Auth::user()->email.' ha actualizado sus datos';
                
            //SE GUARDA EL LOG
            $newLog->save();
            
            
            if(!$user)
            {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if($foto)
                {
                    \Storage::delete($foto);
                }

                return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el usuario, inténtelo más tarde.');
            }
            if(!$newLog)
            {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if($foto)
                {
                    \Storage::delete($foto);
                }
                
                return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el usuario, inténtelo más tarde.');
            }

            //SE HACE COMMIT
            DB::commit();
            
            //REDIRECCIONA A LA VISTA DE USUARIOS
            return \Redirect::back()->with('success','El usuario ha sido editado con éxito!');
        } catch (\Exception $e) {
            DB::rollBack();

            //si hay foto se elimina del servidor
            if($foto)
            {
                \Storage::delete($foto);
            }
            
            return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el usuario, inténtelo más tarde.');
        }
    }

}
