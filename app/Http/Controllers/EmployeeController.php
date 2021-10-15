<?php

namespace App\Http\Controllers;

use App\Models\Employee;

use App\Models\Category;
use App\Models\Regime;
use App\Permission\Models\Role;
use App\Models\Unit;

use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        //valida el rol del usuario
        //\Gate::authorize('haveaccess', 'admin.perm');

        return Inertia::render('Empleados/Create', [
            'categories'=> fn () => Category::select('nombre')->get(),
            'regimes'=> fn () => Regime::select('nombre')->get(),
            'roles'=> fn () => Role::select('name')->get(),
            'units'=>  Inertia::lazy(
                fn () => Unit::select('units.id','units.nombre')
                            ->leftJoin('regimes', 'regimes.id', '=', 'units.regime_id')
                            ->when($request->regime, function ($query, $regime) {
                                $query->where('regimes.nombre',$regime);
                            })
                            ->get()
            )
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //valida el rol del usuario
        \Gate::authorize('haveaccess', 'admin.perm');

        $validated = $request->validate([
            
            //---informacion personal---
            'nombre' => ['required','max:255','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'apellido_paterno' => ['required','max:255','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'apellido_materno' => ['nullable','max:255','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'fecha_de_nacimiento' => 'required|date|before:17 years ago',
            'sexo' => 'required|in:h,m,o',
            'antiguedad' => 'required|date|before:today',
            
            //---informacion institucional---            
            'matricula' => 'required|digits_between:7,10|numeric|unique:users,matricula',
            'regimen' => 'required|exists:regimes,nombre',
            'unidad' => 'required|exists:units,nombre',
            'categoria' => 'required|exists:categories,nombre',
            
            //direccion
            'estado' => ['required','max:50','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'ciudad' => ['required','max:60','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'colonia' => ['required','max:100','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'calle' => ['required','max:100','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'numero_exterior' => ['required','max:10','regex:/^(((#|[nN][oO]|[a-zA-Z1-9À-ÖØ-öø-ÿ]*\.?) ?)?\d{1,4}(( ?[a-zA-Z0-9\-]+)+)?)$/i'],
            'numero_interior' => ['nullable','max:10','regex:/^(((#|[nN][oO]|[a-zA-Z1-9À-ÖØ-öø-ÿ]*\.?) ?)?\d{1,4}(( ?[a-zA-Z0-9\-]+)+)?)$/i'],
            'codigo_postal' => ['required','max:9','regex:/^\d{5}$/i'],
            'telefono' => ['nullable','max:20','regex:/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g'],
            
            //---cuenta---
            'email' => 'nullable|email:rfc|max:255|unique:users',
            'foto' => 'required_with:email|image|mimes:jpeg,png,jpg,gif|max:51200',
            'tarjeton_de_pago' => 'required_with:email|file|mimes:jpeg,png,jpg,pdf|max:51200',
            'contrasena' => [
                'required_with:email',
                Password::min(8)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->uncompromised(),
            ],
            'confirmar_contrasena' => 'required_with:email|same:contrasena',
            'rol' => 'required_with:email|exists:roles,name'
        ]);
        // El nuevo usuario es valido...

        //variables para comprobar la subida de archivos
        $foto = null;

        //COMIENZA LA TRANSACCION
        DB::beginTransaction();

        try {
            $regimen = Regime::where("nombre", $request->regimen)->get();

            if($regimen->isEmpty())
            {
                DB::rollBack();
                return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
            }

            $unidad = Unit::where("nombre", $request->unidad)->get();

            if($unidad->isEmpty())
            {
                DB::rollBack();
                return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
            }

            $categoria = Category::where("nombre", $request->categoria)->get();

            if($categoria->isEmpty())
            {
                DB::rollBack();
                return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
            }

            //verifica que la unidad y el regimen esten relacionados
            if($unidad[0]->regime->id != $regimen[0]->id)
            {
                DB::rollBack();
                return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
            }

            $rol = Role::where("name", $request->rol)->get();

            if($rol->isEmpty())
            {
                DB::rollBack();
                return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
            }

            //SE CREA EL NUEVO USUARIO
            $newEmployee = new Employee;
            
            //---informacion personal---
            $newEmployee->nombre = $request->nombre;
            $newEmployee->apellido_p = $request->apellido_paterno;
            $newEmployee->apellido_m = $request->apellido_materno;
            $newEmployee->fecha_nac = $request->fecha_de_nacimiento;
            $newEmployee->sexo = $request->sexo;
            $newEmployee->antiguedad = $request->antiguedad;
            
            //---informacion institucional---
            $newEmployee->matricula = $request->matricula;
            $newEmployee->unit_id = $unidad[0]->id;
            $newEmployee->category_id = $categoria[0]->id;
            
            //---direccion---
            $newEmployee->estado = $request->estado;
            $newEmployee->ciudad = $request->ciudad;
            $newEmployee->colonia = $request->colonia;
            $newEmployee->calle = $request->calle;
            $newEmployee->num_ext = $request->numero_exterior;
            $newEmployee->num_int = $request->numero_interior;
            $newEmployee->cp = $request->codigo_postal;
            
            //---cuenta---
            //guarda la foto
            $foto = $request->file('foto')->store('public/fotos_perfil');
            $newEmployee->foto = $request->file('foto')->hashName();

            $newEmployee->email = $request->email;
            $newEmployee->password = \Hash::make($request->contrasena);
            
            //SE GUARDA EL NUEVO USUARIO
            $newEmployee->save();
            
            //se asigna el rol
            $newEmployee->roles()->sync([$rol[0]->id]);

            //SE CREA EL LOG
            // $newLog = new Log;
            
            // $newLog->categoria = 'create';
            // $newLog->user_id = Auth::id();
            // $newLog->accion =
            // '{
            //     users: {
            //         nombre: ' . $request->nombre . ',\n
            //         apellido_p: ' . $request->apellido_paterno . ',\n
            //         apellido_m: ' . $request->apellido_materno . ',\n
            //         fecha_nac: ' . $request->fecha_de_nacimiento . ',\n
            //         sexo: '. $request->sexo. ',\n
            //         matricula: ' . $request->matricula . ',\n
            //         unit_id: '.$unidad[0]->id. ',\n
            //         category_id: ' . $categoria[0]->id . ',\n
            //         estado: ' . $request->estado . ',\n
            //         ciudad: ' . $request->ciudad . ',\n
            //         colonia: ' . $request->colonia . ',\n
            //         calle: ' . $request->calle . ',\n
            //         num_ext: ' . $request->numero_exterior . ',\n
            //         num_int: ' . $request->numero_interior . ',\n
            //         cp: ' . $request->codigo_postal . ',\n
            //         email: ' . $request->email .
            //     '}
            // }';

            // $newLog->descripcion = 'El usuario '.Auth::user()->email.' ha registrado un nuevo usuario: '. $newUser->email;
                
            // //SE GUARDA EL LOG
            // $newLog->save();
            
            
            if(!$newUser)
            {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if($foto)
                {
                    \Storage::delete($foto);
                }
                //si hay tarjeton se elimina del servidor
                if($tarjeton_pago)
                {
                    \Storage::delete($tarjeton_pago);
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
                //si hay tarjeton se elimina del servidor
                if($tarjeton_pago)
                {
                    \Storage::delete($tarjeton_pago);
                }
                return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el usuario, inténtelo más tarde.');
            }

            //SE HACE COMMIT
            DB::commit();
            
            //REDIRECCIONA A LA VISTA DE USUARIOS
            return \Redirect::route('usuarios')->with('success','El usuario ha sido registrado con éxito!');
        } catch (\Exception $e) {
            DB::rollBack();

            //si hay foto se elimina del servidor
            if($foto)
            {
                \Storage::delete($foto);
            }
            //si hay tarjeton se elimina del servidor
            if($tarjeton_pago)
            {
                \Storage::delete($tarjeton_pago);
            }
            return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el usuario, inténtelo más tarde.');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function show(Employee $employee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function edit(Employee $employee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Employee $employee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function destroy(Employee $employee)
    {
        //
    }
}
