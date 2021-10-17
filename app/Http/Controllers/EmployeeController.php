<?php

namespace App\Http\Controllers;

use App\Models\Employee;

use Illuminate\Support\Facades\Auth;
use App\Models\Category;
use App\Models\Regime;
use App\Permission\Models\Role;
use App\Models\Unit;
use App\Models\User;
use App\Models\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

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
        $employees = Employee::get();

        return $employees;
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
        // \Gate::authorize('haveaccess', 'admin.perm');

        $validated = $request->validate([ 
            //---informacion personal---
            'nombre' => ['required','max:255','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'apellido_paterno' => ['required','max:255','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'apellido_materno' => ['nullable','max:255','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'fecha_de_nacimiento' => 'required|date|before:17 years ago',
            'sexo' => 'required|in:h,m,o',
            'antiguedad' => 'required|date|before:tomorrow',
            
            //---informacion institucional---            
            'matricula' => 'required|digits_between:7,10|numeric|unique:employees,matricula',
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
            'telefono' => ['nullable','max:25','regex:/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.0-9]*$/i'],
        ]);
        // El nuevo empleado es valido...

        //nos sirve para saber si se esta creando un nuevo usuario
        $user = false;
        $newUser = null;
        //valida los datos del usuario
        if($request->email || $request->contrasena || $request->confirmar_contrasena || $request->rol){
            $user = true;
            $validated = $request->validate([
                //---cuenta---
                'email' => 'required|email:rfc|max:255|unique:users',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:51200',
                'contrasena' => [
                    'required',
                    Password::min(8)
                        ->mixedCase()
                        ->letters()
                        ->numbers()
                        ->uncompromised(),
                ],
                'confirmar_contrasena' => 'required|same:contrasena',
                'rol' => 'required|exists:roles,name'
            ]);
        }

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

            //si hay usuario se registra
            if($user){
                 $rol = Role::where("name", $request->rol)->get();

                if($rol->isEmpty())
                {
                    DB::rollBack();
                    return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
                }

                $newUser = new User;

                // ---se crea el usuario---
                if($request->foto)
                {
                    //guarda la foto
                    $foto = $request->file('foto')->store('public/fotos_perfil');
                    $fileName = $request->file('foto')->hashName();
                    $newUser->foto = $fileName;
    
                    $image = Image::make(Storage::get($foto));
    
                    $image->resize(1280, null, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
    
                    Storage::put($foto, (string) $image->encode('jpg', 30));
                }

                $newUser->email = $request->email;
                $newUser->password = \Hash::make($request->contrasena);
                $newUser->save();

                // se asigna el rol
                $newUser->roles()->saveMany($rol);
            }

            //SE CREA EL NUEVO EMPLEADO
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
            
            //SE GUARDA EL NUEVO USUARIO
            $newEmployee->save();

            //si hay usuario se asigna el empleado
            if($user)
            {
                if(!$newUser)
                {
                    DB::rollBack();
                    //si hay foto se elimina del servidor
                    if($foto)
                    {
                        \Storage::delete($foto);
                    }

                    return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
                }

                //se asigna el empleado al usuario
                $newUser->employee()->save($newEmployee);
            }

            //SE CREA EL LOG
            $newLog = new Log;
            
            $newLog->categoria = 'create';
            $newLog->user_id = Auth::id();
            $newLog->accion =
            '{
                users: {
                    nombre: ' . $request->nombre . ',\n
                    apellido_p: ' . $request->apellido_paterno . ',\n
                    apellido_m: ' . $request->apellido_materno . ',\n
                    fecha_nac: ' . $request->fecha_de_nacimiento . ',\n
                    sexo: '. $request->sexo. ',\n
                    antiguedad: ' . $request->antiguedad . ',\n
                    matricula: ' . $request->matricula . ',\n
                    unit_id: '.$unidad[0]->id. ',\n
                    category_id: ' . $categoria[0]->id . ',\n
                    estado: ' . $request->estado . ',\n
                    ciudad: ' . $request->ciudad . ',\n
                    colonia: ' . $request->colonia . ',\n
                    calle: ' . $request->calle . ',\n
                    num_ext: ' . $request->numero_exterior . ',\n
                    num_int: ' . $request->numero_interior . ',\n
                    cp: ' . $request->codigo_postal . ',\n'.
                '}
            }';

            $newLog->descripcion = 'El usuario '.Auth::user()->email.' ha registrado un nuevo empleado con la matricula: '. $newEmployee->matricula;
                
            //SE GUARDA EL LOG
            $newLog->save();
            
            if(!$newEmployee)
            {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if($foto)
                {
                    \Storage::delete($foto);
                }

                return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
            }

            if(!$newLog)
            {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if($foto)
                {
                    \Storage::delete($foto);
                }
                return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
            }

            //SE HACE COMMIT
            DB::commit();
            
            //REDIRECCIONA A LA VISTA DE USUARIOS
            return \Redirect::route('employees.index')->with('success','El empleado ha sido registrado con éxito!');
        } catch (\Exception $e) {
            DB::rollBack();
            
            //si hay foto se elimina del servidor
            if($foto)
            {
                \Storage::delete($foto);
            }

            return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
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
    public function edit($id, Request $request)
    {
        //valida el rol del usuario
        //\Gate::authorize('haveaccess', 'admin.perm');

        $employee = Employee::withTrashed()->with([
            'category:id,nombre',
            'unit:id,nombre,regime_id', 
            'unit.regime:id,nombre',
        ])
        ->findOrFail($id);

        return Inertia::render('Empleados/Edit', [
            'employee' => $employee,
            'categories'=> fn () => Category::select('id','nombre')->get(),
            'regimes'=> fn () => Regime::select('id','nombre')->get(),
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
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Employee $employee)
    {
        //valida el rol del usuario
        // \Gate::authorize('haveaccess', 'admin.perm');

        $validated = $request->validate([ 
            //---informacion personal---
            'nombre' => ['required','max:255','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'apellido_paterno' => ['required','max:255','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'apellido_materno' => ['nullable','max:255','regex:/^[A-Za-z0-9À-ÖØ-öø-ÿ_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'fecha_de_nacimiento' => 'required|date|before:17 years ago',
            'sexo' => 'required|in:h,m,o',
            'antiguedad' => 'required|date|before:tomorrow',
            
            //---informacion institucional---            
            'matricula' => 'required|digits_between:7,10|numeric|unique:employees,matricula',
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
            'telefono' => ['nullable','max:25','regex:/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.0-9]*$/i'],
        ]);
        // El nuevo empleado es valido...

        //nos sirve para saber si se esta creando un nuevo usuario
        $user = false;
        $newUser = null;
        //valida los datos del usuario
        if($request->email || $request->contrasena || $request->confirmar_contrasena || $request->rol){
            $user = true;
            $validated = $request->validate([
                //---cuenta---
                'email' => 'required|email:rfc|max:255|unique:users',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:51200',
                'contrasena' => [
                    'required',
                    Password::min(8)
                        ->mixedCase()
                        ->letters()
                        ->numbers()
                        ->uncompromised(),
                ],
                'confirmar_contrasena' => 'required|same:contrasena',
                'rol' => 'required|exists:roles,name'
            ]);
        }

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

            //si hay usuario se registra
            if($user){
                 $rol = Role::where("name", $request->rol)->get();

                if($rol->isEmpty())
                {
                    DB::rollBack();
                    return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
                }

                $newUser = new User;

                // ---se crea el usuario---
                if($request->foto)
                {
                    //guarda la foto
                    $foto = $request->file('foto')->store('public/fotos_perfil');
                    $fileName = $request->file('foto')->hashName();
                    $newUser->foto = $fileName;
    
                    $image = Image::make(Storage::get($foto));
    
                    $image->resize(1280, null, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
    
                    Storage::put($foto, (string) $image->encode('jpg', 30));
                }

                $newUser->email = $request->email;
                $newUser->password = \Hash::make($request->contrasena);
                $newUser->save();

                // se asigna el rol
                $newUser->roles()->saveMany($rol);
            }

            //SE CREA EL NUEVO EMPLEADO
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
            
            //SE GUARDA EL NUEVO USUARIO
            $newEmployee->save();

            //si hay usuario se asigna el empleado
            if($user)
            {
                if(!$newUser)
                {
                    DB::rollBack();
                    //si hay foto se elimina del servidor
                    if($foto)
                    {
                        \Storage::delete($foto);
                    }

                    return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
                }

                //se asigna el empleado al usuario
                $newUser->employee()->save($newEmployee);
            }

            //SE CREA EL LOG
            $newLog = new Log;
            
            $newLog->categoria = 'create';
            $newLog->user_id = Auth::id();
            $newLog->accion =
            '{
                users: {
                    nombre: ' . $request->nombre . ',\n
                    apellido_p: ' . $request->apellido_paterno . ',\n
                    apellido_m: ' . $request->apellido_materno . ',\n
                    fecha_nac: ' . $request->fecha_de_nacimiento . ',\n
                    sexo: '. $request->sexo. ',\n
                    antiguedad: ' . $request->antiguedad . ',\n
                    matricula: ' . $request->matricula . ',\n
                    unit_id: '.$unidad[0]->id. ',\n
                    category_id: ' . $categoria[0]->id . ',\n
                    estado: ' . $request->estado . ',\n
                    ciudad: ' . $request->ciudad . ',\n
                    colonia: ' . $request->colonia . ',\n
                    calle: ' . $request->calle . ',\n
                    num_ext: ' . $request->numero_exterior . ',\n
                    num_int: ' . $request->numero_interior . ',\n
                    cp: ' . $request->codigo_postal . ',\n'.
                '}
            }';

            $newLog->descripcion = 'El usuario '.Auth::user()->email.' ha registrado un nuevo empleado con la matricula: '. $newEmployee->matricula;
                
            //SE GUARDA EL LOG
            $newLog->save();
            
            if(!$newEmployee)
            {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if($foto)
                {
                    \Storage::delete($foto);
                }

                return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
            }

            if(!$newLog)
            {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if($foto)
                {
                    \Storage::delete($foto);
                }
                return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
            }

            //SE HACE COMMIT
            DB::commit();
            
            //REDIRECCIONA A LA VISTA DE USUARIOS
            return \Redirect::route('employees.index')->with('success','El empleado ha sido registrado con éxito!');
        } catch (\Exception $e) {
            DB::rollBack();
            
            //si hay foto se elimina del servidor
            if($foto)
            {
                \Storage::delete($foto);
            }

            return \Redirect::back()->with('error','Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
        }
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
