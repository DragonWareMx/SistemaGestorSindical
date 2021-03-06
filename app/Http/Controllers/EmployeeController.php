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
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Image;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // $employees = Employee::with('category:nombre,id', 'unit:nombre,id,regime_id', 'unit.regime:nombre,id', 'user:id')
        // ->when($request->deleted == "true", function ($query, $deleted) {
        //     return $query->onlyTrashed();
        // })
        // ->when($request->user == "true", function ($query, $user) {
        //     return $query->whereHas('user');
        // })
        // ->get(['id', 'uuid', 'nombre', 'apellido_p', 'apellido_m', 'fecha_nac', 'sexo', 'antiguedad', 'estado', 'ciudad', 'colonia', 'calle', 'cp', 'num_ext', 'num_int', 'tel', 'matricula', 'category_id', 'unit_id', 'user_id']);
        $columns = ['employees.user_id', 'employees.id', 'employees.uuid', 'nombre', 'fecha_nac', 'sexo', 'antiguedad', 'direccion', 'tel', 'matricula', 'category_id', 'unit_id', 'user_id', 'categoria', 'unidad', 'regime', 'employees.created_at'];
        $employees = Employee::select('employees.id', 'employees.uuid', 'fecha_nac', 'sexo', 'antiguedad', 'tel', 'matricula', 'category_id', 'unit_id', 'user_id', 'categories.nombre AS categoria', 'units.nombre AS unidad', 'regimes.nombre AS regime', 'employees.created_at')
                            ->selectRaw("CONCAT_WS(' ', employees.nombre , apellido_p , apellido_m) AS nombre, CONCAT_WS(' ', calle , CONCAT('#', num_ext) , num_int, CONCAT(colonia, ', '),ciudad, estado, cp) AS direccion, TIMESTAMPDIFF(YEAR, fecha_nac, CURDATE()) AS edad")
                            ->leftJoin('users', 'users.id', '=', 'employees.user_id')
                            ->leftJoin('categories', 'categories.id', '=', 'employees.category_id')
                            ->leftJoin('units', 'units.id', '=', 'employees.unit_id')
                            ->leftJoin('regimes', 'regimes.id', '=', 'units.regime_id')
                            ->when($request->deleted == "true", function ($query, $deleted) {
                                return $query->onlyTrashed();
                            })
                            ->when($request->user == "true", function ($query, $user) {
                                return $query->whereHas('user');
                            })
                            ->DataGridPlus($request, $columns, 'employees', 20000);

        return Inertia::render('Empleados/Index', [
            'employees' => fn () => $employees,
        ]);
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
            'categories' => fn () => Category::select('nombre')->get(),
            'regimes' => fn () => Regime::select('nombre')->get(),
            'roles' => fn () => Role::select('name')->get(),
            'units' =>  Inertia::lazy(
                fn () => Unit::select('units.id', 'units.nombre')
                    ->leftJoin('regimes', 'regimes.id', '=', 'units.regime_id')
                    ->when($request->regime, function ($query, $regime) {
                        $query->where('regimes.nombre', $regime);
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
            'nombre' => ['required', 'max:255', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'apellido_paterno' => ['required', 'max:255', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'apellido_materno' => ['nullable', 'max:255', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'fecha_de_nacimiento' => 'required|date|before:17 years ago',
            'sexo' => 'required|in:hombre,mujer,otro',
            'antiguedad' => 'nullable|date|before:tomorrow',

            //---informacion institucional---
            'matricula' => 'required|digits_between:7,10|numeric|unique:employees,matricula',
            'regimen' => 'required|exists:regimes,nombre',
            'unidad' => 'required|exists:units,nombre',
            'categoria' => 'required|exists:categories,nombre',
        ]);

        //si se introdujo algun dato para la direccion se validan los campos
        if ($request->estado || $request->ciudad || $request->colonia || $request->calle || $request->numero_exterior || $request->numero_interior || $request->codigo_postal || $request->telefono) {
            $validated = $request->validate([
                //direccion
                'estado' => ['required', 'max:50', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'ciudad' => ['required', 'max:60', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'colonia' => ['required', 'max:100', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'calle' => ['required', 'max:100', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'numero_exterior' => ['required', 'max:10', 'regex:/^(((#|[nN][oO]|[a-zA-Z1-9??-????-????-??]*\.?) ?)?\d{1,4}(( ?[a-zA-Z0-9\-]+)+)?)$/i'],
                'numero_interior' => ['nullable', 'max:10', 'regex:/^(((#|[nN][oO]|[a-zA-Z1-9??-????-????-??]*\.?) ?)?\d{1,4}(( ?[a-zA-Z0-9\-]+)+)?)$/i'],
                'codigo_postal' => ['required', 'max:9', 'regex:/^\d{5}$/i'],
                'telefono' => ['nullable', 'max:25', 'regex:/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.0-9]*$/i'],
            ]);
        }
        // El nuevo empleado es valido...

        //nos sirve para saber si se esta creando un nuevo usuario
        $user = false;
        $newUser = null;
        //valida los datos del usuario
        if ($request->email || $request->contrasena || $request->confirmar_contrasena || $request->rol) {
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

            if ($regimen->isEmpty()) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            $unidad = Unit::where("nombre", $request->unidad)->get();

            if ($unidad->isEmpty()) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            $categoria = Category::where("nombre", $request->categoria)->get();

            if ($categoria->isEmpty()) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            //verifica que la unidad y el regimen esten relacionados
            if ($unidad[0]->regime->id != $regimen[0]->id) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            //si hay usuario se registra
            if ($user) {
                $rol = Role::where("name", $request->rol)->get();

                if ($rol->isEmpty()) {
                    DB::rollBack();
                    return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
                }

                $newUser = new User;

                // ---se crea el usuario---
                if ($request->foto) {
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
                $newUser->uuid = Str::uuid();
                $newUser->save();

                // se asigna el rol
                $newUser->roles()->saveMany($rol);
            }

            //SE CREA EL NUEVO EMPLEADO
            $newEmployee = new Employee;

            $newEmployee->uuid = Str::uuid();

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
            $newEmployee->tel = $request->telefono;

            //SE GUARDA EL NUEVO USUARIO
            $newEmployee->save();

            //si hay usuario se asigna el empleado
            if ($user) {
                if (!$newUser) {
                    DB::rollBack();
                    //si hay foto se elimina del servidor
                    if ($foto) {
                        \Storage::delete($foto);
                    }

                    return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
                }

                //se asigna el empleado al usuario
                $newUser->employee()->save($newEmployee);
            }

            //SE CREA EL LOG
            $newLog = new Log;

            $newLog->uuid = Str::uuid();

            $newLog->categoria = 'create';
            $newLog->user_id = Auth::id();
            $newLog->accion =
                '{
                users: {
                    nombre: ' . $request->nombre . ',\n
                    apellido_p: ' . $request->apellido_paterno . ',\n
                    apellido_m: ' . $request->apellido_materno . ',\n
                    fecha_nac: ' . $request->fecha_de_nacimiento . ',\n
                    sexo: ' . $request->sexo . ',\n
                    antiguedad: ' . $request->antiguedad . ',\n
                    matricula: ' . $request->matricula . ',\n
                    unit_id: ' . $unidad[0]->id . ',\n
                    category_id: ' . $categoria[0]->id . ',\n
                    estado: ' . $request->estado . ',\n
                    ciudad: ' . $request->ciudad . ',\n
                    colonia: ' . $request->colonia . ',\n
                    calle: ' . $request->calle . ',\n
                    num_ext: ' . $request->numero_exterior . ',\n
                    num_int: ' . $request->numero_interior . ',\n
                    cp: ' . $request->codigo_postal . ',\n' .
                '}
            }';

            $newLog->descripcion = 'El usuario ' . Auth::user()->email . ' ha registrado un nuevo empleado con la matricula: ' . $newEmployee->matricula;

            //SE GUARDA EL LOG
            $newLog->save();

            if (!$newEmployee) {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if ($foto) {
                    \Storage::delete($foto);
                }

                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            if (!$newLog) {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if ($foto) {
                    \Storage::delete($foto);
                }
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            //SE HACE COMMIT
            DB::commit();

            //REDIRECCIONA A LA VISTA DE USUARIOS
            return \Redirect::route('employees.index')->with('success', 'El empleado ha sido registrado con ??xito!');
        } catch (\Exception $e) {
            DB::rollBack();

            //si hay foto se elimina del servidor
            if ($foto) {
                \Storage::delete($foto);
            }

            return \Redirect::back()->with('error', "Ocurri?? un error inesperado al tratar de ingresar el empleado: " . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function edit($uuid, Request $request)
    {
        //valida el rol del usuario
        //\Gate::authorize('haveaccess', 'admin.perm');

        $employee = Employee::withTrashed()->with([
            'category:id,nombre',
            'unit:id,nombre,regime_id',
            'unit.regime:id,nombre',
            'user:id,email,foto,uuid'
        ])
            ->where('uuid', '=', $uuid)
            ->firstOrFail();

        return Inertia::render('Empleados/Edit', [
            'employee' => $employee,
            'categories' => fn () => Category::select('id', 'nombre')->get(),
            'regimes' => fn () => Regime::select('id', 'nombre')->get(),
            'units' =>  Inertia::lazy(
                fn () => Unit::select('units.id', 'units.nombre')
                    ->leftJoin('regimes', 'regimes.id', '=', 'units.regime_id')
                    ->when($request->regime, function ($query, $regime) {
                        $query->where('regimes.nombre', $regime);
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
    public function update(Request $request, $id)
    {
        //valida el rol del usuario
        // \Gate::authorize('haveaccess', 'admin.perm');

        $validated = $request->validate([
            //---informacion personal---
            'nombre' => ['required', 'max:255', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'apellido_paterno' => ['required', 'max:255', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'apellido_materno' => ['nullable', 'max:255', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'fecha_de_nacimiento' => 'required|date|before:17 years ago',
            'sexo' => 'required|in:hombre,mujer,otro',
            'antiguedad' => 'nullable|date|before:tomorrow',

            //---informacion institucional---
            'matricula' => 'required|digits_between:7,10|numeric|unique:employees,matricula,' . $id,
            'regimen' => 'required|exists:regimes,nombre',
            'unidad' => 'required|exists:units,nombre',
            'categoria' => 'required|exists:categories,nombre',
            'desvincular' => 'required|boolean',
        ]);
        //si se introdujo algun dato para la direccion se validan los campos
        if ($request->estado || $request->ciudad || $request->colonia || $request->calle || $request->numero_exterior || $request->numero_interior || $request->codigo_postal || $request->telefono) {
            $validated = $request->validate([
                //direccion
                'estado' => ['required', 'max:50', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'ciudad' => ['required', 'max:60', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'colonia' => ['required', 'max:100', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'calle' => ['required', 'max:100', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'numero_exterior' => ['required', 'max:10', 'regex:/^(((#|[nN][oO]|[a-zA-Z1-9??-????-????-??]*\.?) ?)?\d{1,4}(( ?[a-zA-Z0-9\-]+)+)?)$/i'],
                'numero_interior' => ['nullable', 'max:10', 'regex:/^(((#|[nN][oO]|[a-zA-Z1-9??-????-????-??]*\.?) ?)?\d{1,4}(( ?[a-zA-Z0-9\-]+)+)?)$/i'],
                'codigo_postal' => ['required', 'max:9', 'regex:/^\d{5}$/i'],
                'telefono' => ['nullable', 'max:25', 'regex:/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.0-9]*$/i'],
            ]);
        }
        // El nuevo empleado es valido...

        //variables para comprobar la subida de archivos
        $foto = null;

        //COMIENZA LA TRANSACCION
        DB::beginTransaction();

        try {
            $regimen = Regime::where("nombre", $request->regimen)->get();

            if ($regimen->isEmpty()) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            $unidad = Unit::where("nombre", $request->unidad)->get();

            if ($unidad->isEmpty()) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            $categoria = Category::where("nombre", $request->categoria)->get();

            if ($categoria->isEmpty()) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            //verifica que la unidad y el regimen esten relacionados
            if ($unidad[0]->regime->id != $regimen[0]->id) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            //SE CREA EL NUEVO EMPLEADO
            $employee = Employee::findOrFail($id);

            //---informacion personal---
            $employee->nombre = $request->nombre;
            $employee->apellido_p = $request->apellido_paterno;
            $employee->apellido_m = $request->apellido_materno;
            $employee->fecha_nac = $request->fecha_de_nacimiento;
            $employee->sexo = $request->sexo;
            $employee->antiguedad = $request->antiguedad;

            //---informacion institucional---
            $employee->matricula = $request->matricula;
            $employee->unit_id = $unidad[0]->id;
            $employee->category_id = $categoria[0]->id;

            //---direccion---
            $employee->estado = $request->estado;
            $employee->ciudad = $request->ciudad;
            $employee->colonia = $request->colonia;
            $employee->calle = $request->calle;
            $employee->num_ext = $request->numero_exterior;
            $employee->num_int = $request->numero_interior;
            $employee->cp = $request->codigo_postal;
            $employee->tel = $request->telefono;

            if ($request->desvincular)
                $employee->user_id = null;

            //SE GUARDA EL NUEVO USUARIO
            $employee->save();

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
                    sexo: ' . $request->sexo . ',\n
                    antiguedad: ' . $request->antiguedad . ',\n
                    matricula: ' . $request->matricula . ',\n
                    unit_id: ' . $unidad[0]->id . ',\n
                    category_id: ' . $categoria[0]->id . ',\n
                    estado: ' . $request->estado . ',\n
                    ciudad: ' . $request->ciudad . ',\n
                    colonia: ' . $request->colonia . ',\n
                    calle: ' . $request->calle . ',\n
                    num_ext: ' . $request->numero_exterior . ',\n
                    num_int: ' . $request->numero_interior . ',\n
                    cp: ' . $request->codigo_postal . ',\n' .
                '}
            }';

            $newLog->descripcion = 'El usuario ' . Auth::user()->email . ' ha editado al empleado con la matricula: ' . $employee->matricula;

            //SE GUARDA EL LOG
            $newLog->save();

            if (!$employee) {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if ($foto) {
                    \Storage::delete($foto);
                }

                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar editar el empleado, int??ntelo m??s tarde.');
            }

            if (!$newLog) {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if ($foto) {
                    \Storage::delete($foto);
                }
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar editar el empleado, int??ntelo m??s tarde.');
            }

            //SE HACE COMMIT
            DB::commit();

            //REDIRECCIONA A LA VISTA DEL EMPLEADO
            return \Redirect::back()->with('success', 'El empleado ha sido editado con ??xito!');
        } catch (\Exception $e) {
            DB::rollBack();

            //si hay foto se elimina del servidor
            if ($foto) {
                \Storage::delete($foto);
            }

            return \Redirect::back()->with('error', "Ocurri?? un error inesperado: " . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //valida el rol del usuario
        //\Gate::authorize('haveaccess', 'admin.perm');

        DB::beginTransaction();
        try {
            $employee = Employee::findOrFail($id);

            if (!$employee) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar eliminar el empleado, int??ntelo m??s tarde.');
            }

            $userEmployee = Auth::user()->employee()->first();
            if ($userEmployee && $employee->id == Auth::user()->employee()->first()->id) {
                DB::rollBack();
                return \Redirect::back()->with('message', '??No puedes eliminar tu propio empleado!');
            }
            $employee->user_id = null;
            $employee->save();

            $employee->delete();

            //SE CREA EL LOG
            $newLog = new Log;
            $newLog->uuid = Str::uuid();

            $newLog->categoria = 'delete';
            $newLog->user_id = Auth::id();
            $newLog->accion =
                '{
                employees: {
                    id: ' . $id .
                '}
            }';

            $newLog->descripcion = 'El usuario ' . Auth::user()->email . ' ha eliminado al empleado con matricula: ' . $employee->matricula;

            $newLog->save();

            DB::commit();
            return \Redirect::back()->with('success', '??Empleado eliminado con ??xito!');
        } catch (\Exception $e) {
            DB::rollBack();

            return \Redirect::back()->with('error', "Ocurri?? un error inesperado al intentar eliminar el empleado: " . $e->getMessage());
        }
    }

    /**
     * Restore the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function restore($id)
    {
        //valida el rol del usuario
        //\Gate::authorize('haveaccess', 'admin.perm');

        DB::beginTransaction();
        try {
            $employee = Employee::withTrashed()->find($id);

            if (!$employee) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar restaurar el empleado, int??ntelo m??s tarde.');
            }

            $employee->restore();

            //SE CREA EL LOG
            $newLog = new Log;

            $newLog->uuid = Str::uuid();

            $newLog->categoria = 'restore';
            $newLog->user_id = Auth::id();
            $newLog->accion =
                '{
                employee: {
                    id: ' . $id .
                '}
            }';

            $newLog->descripcion = 'El usuario ' . Auth::user()->email . ' ha restaurado al empleado: ' . $employee->matricula;

            $newLog->save();

            DB::commit();
            return \Redirect::back()->with('success', '??Empleado restaurado con ??xito!');
        } catch (\Exception $e) {
            DB::rollBack();
            return \Redirect::back()->with('error', "Ocurri?? un error inesperado al intentar restaurar el empleado: " . $e->getMessage());
        }
    }

    public function admisionCambios(Request $request){
        $columns = ['relatives.id','relatives.uuid','nombreRelative','relatives.tel','nombreEmployee','relatives.estatus','categoria','parentesco','er_id'];
        $employees = Employee::join('employee_relative','employees.id','employee_relative.employee_id')
        ->join('employees as relatives','employee_relative.relative_id','relatives.id')
        ->join('categories','relatives.category_id','categories.id')
        ->select('relatives.id','relatives.uuid','relatives.tel','relatives.estatus','categories.nombre as categoria','employee_relative.parentesco','employee_relative.id as er_id')
        ->selectRaw("CONCAT_WS(' ', employees.nombre , employees.apellido_p , employees.apellido_m) AS nombreEmployee, CONCAT_WS(' ', relatives.nombre , relatives.apellido_p , relatives.apellido_m) AS nombreRelative")
        ->DataGridPlus($request, $columns, 'relatives', 20000);

        return Inertia::render('Oficinas/admisionCambios', ['employees' => $employees]);
    }

    public function admisionCambiosRelative($er_id)
    {
        // dd('Welcome to the relative and employee information view', $uuid);

        $employees = Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'employees.id as id', 'antiguedad')
            ->selectRaw('(select ingreso_bolsa from employee_relative where employee_id = employees.id order by ingreso_bolsa desc limit 1) as ingreso_bolsa')
            ->leftJoin('employee_relative', 'employees.id', 'employee_relative.employee_id')
            ->groupBy('employees.id', 'matricula', 'nombre', 'apellido_p', 'apellido_m', 'antiguedad')
            ->get();

        $registro = Employee::
            select('employee_id', 'relative_id', 'parentesco', 'ingreso_bolsa', 'employee_relative.id as er_id')
            ->join('employee_relative','employees.id','employee_relative.employee_id')
            ->where('employee_relative.id','=',$er_id)
            ->first();

        $fecha = Employee::select('ingreso_bolsa')
            ->join('employee_relative', 'employees.id', 'employee_relative.employee_id')
            ->where('employee_relative.id', '=', $er_id)
            ->first();

        // dd($registro);

        $empleado = Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'employees.id as id', 'antiguedad')
            ->selectRaw('(select ingreso_bolsa from employee_relative where employee_id = employees.id order by ingreso_bolsa desc limit 1) as ingreso_bolsa')
            ->find($registro->employee_id);
        $familiar = Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'employees.id as id', 'antiguedad')
            ->selectRaw('(select ingreso_bolsa from employee_relative where employee_id = employees.id order by ingreso_bolsa desc limit 1) as ingreso_bolsa')
            ->find($registro->relative_id);

        // dd(Auth::user()->roles());

        return Inertia::render('Oficinas/admisionCambiosEditar', ['employees' => $employees, 'register' => $registro, 'employee' => $empleado, 'relative' => $familiar, 'add_date' => $fecha]);
    }

    public function admisionCambiosRelativeStore(Request $request,$id){
        // dd($id);
        //COMIENZA LA TRANSACCION
        DB::beginTransaction();

        try{

            $registro = DB::table('employee_relative')->where('id','=',$id)
                ->update([
                    'relative_id' => $request->familiar['id'],
                    'parentesco' => $request['parentesco'],
                ]);

            // $employee->relatives()->sync($familiar['id'], $data);

            //SE CREA EL LOG
            $newLog = new Log;

            $newLog->uuid = Str::uuid();

            $newLog->categoria = 'create';
            $newLog->user_id = Auth::id();
            $newLog->accion =
            '{
                employee_relative: {
                    parentesco: ' . $request->parentesco . ',\n'.
                '}
            }';

            $newLog->descripcion = 'El usuario '.Auth::user()->email.' ha actualizado un registro en la oficina de accion y cambios';

            //SE GUARDA EL LOG
            $newLog->save();

            if(!$registro)
            {
                DB::rollBack();

                return \Redirect::back()->with('error','Ha ocurrido un error al intentar actualizar el registro, int??ntelo m??s tarde.');
            }

            if(!$newLog)
            {
                DB::rollBack();

                return \Redirect::back()->with('error','Ha ocurrido un error al intentar actualizar el registro, int??ntelo m??s tarde.');
            }

            //SE HACE COMMIT
            DB::commit();

            //SE REDIRIGE A LA OFICINA DE ADMISION Y CAMBIOS
            return \Redirect::route('admisionCambios')->with('success','El registro se ha actualizado con ??xito!');

        } catch (\Exception $e) {
            DB::rollBack();

            return \Redirect::back()->with('error','Ha ocurrido un error al intentar actualizar el registro, int??ntelo m??s tarde.');
        }
    }

    public function admisionCambiosDestroy($id){
        // dd($id);
        DB::beginTransaction();
        try{
            $registro = DB::table('employee_relative')->where('id','=',$id)->delete();

            //SE CREA EL LOG
            $newLog = new Log;
            $newLog->uuid = Str::uuid();

            $newLog->categoria = 'delete';
            $newLog->user_id = Auth::id();
            $newLog->accion =
            '{
                employee_relative: {
                    id: ' . $id .
                '}
            }';

            $newLog->descripcion = 'El usuario '.Auth::user()->email.' ha eliminado un registro en Admision y Cambios.';

            $newLog->save();

            DB::commit();
            return \Redirect::Route('admisionCambios')->with('success','??Registro eliminado con ??xito!');
        } catch (\Exception $e) {
            DB::rollBack();

            return \Redirect::back()->with('error','Ha ocurrido un error al intentar eliminar el registro, int??ntelo m??s tarde.');
        }
    }

    public function admisionCambiosCreate()
    {
        //

        $employees = Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'employees.id as id', 'antiguedad')
            ->selectRaw('(select ingreso_bolsa from employee_relative where employee_id = employees.id order by ingreso_bolsa desc limit 1) as ingreso_bolsa')
            ->leftJoin('employee_relative', 'employees.id', 'employee_relative.employee_id')
            ->groupBy('employees.id', 'matricula', 'nombre', 'apellido_p', 'apellido_m', 'antiguedad')
            ->get();

        return Inertia::render('Oficinas/admisionCambiosCrear', [
            'roles' => fn () => Role::select('name')->get(),
            'employees' => $employees
        ]);
    }

    public function admisionCambiosStore(Request $request)
    {

        //COMIENZA LA TRANSACCION
        DB::beginTransaction();

        try {
            $employee = Employee::find($request->empleado['id']);
            $familiar = Employee::find($request->familiar['id']);

            $data = [
                'parentesco' => $request['parentesco'],
                'ingreso_bolsa' => Carbon::now()->format('Y-m-d')
            ];

            $employee->relatives()->attach($familiar['id'], $data);

            //SE CREA EL LOG
            $newLog = new Log;

            $newLog->uuid = Str::uuid();

            $newLog->categoria = 'create';
            $newLog->user_id = Auth::id();
            $newLog->accion =
                '{
                employee_relative: {
                    parentesco: ' . $request->parentesco . ',\n' .
                '}
            }';

            $newLog->descripcion = 'El usuario ' . Auth::user()->email . ' ha registrado un nuevo familiar con la matricula: ' . $familiar->matricula;

            //SE GUARDA EL LOG
            $newLog->save();

            if (!$employee) {
                DB::rollBack();

                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el familiar, int??ntelo m??s tarde.');
            }

            if (!$familiar) {
                DB::rollBack();

                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el familiar, int??ntelo m??s tarde.');
            }

            if (!$newLog) {
                DB::rollBack();

                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el familiar, int??ntelo m??s tarde.');
            }

            //SE HACE COMMIT
            DB::commit();

            //SE REDIRIGE A LA OFICINA DE ADMISION Y CAMBIOS
            return \Redirect::route('admisionCambios')->with('success', 'El familiar ha sido registrado con ??xito!');
        } catch (\Exception $e) {
            DB::rollBack();

            return \Redirect::back()->with('error', "Ocurri?? un error inesperado al intentar registrar el familiar: " . $e->getMessage());
        }
    }

    public function admisionCambiosNewFamiliar(Request $request)
    {
        return Inertia::render('Oficinas/admisionCambiosCrearFamiliar', [
            'categories' => fn () => Category::select('nombre')->get(),
            'regimes' => fn () => Regime::select('nombre')->get(),
            'roles' => fn () => Role::select('name')->get(),
            'units' =>  Inertia::lazy(
                fn () => Unit::select('units.id', 'units.nombre')
                    ->leftJoin('regimes', 'regimes.id', '=', 'units.regime_id')
                    ->when($request->regime, function ($query, $regime) {
                        $query->where('regimes.nombre', $regime);
                    })
                    ->get()
            )
        ]);
    }

    public function admisionCambiosStoreFamiliar(Request $request)
    {
        //valida el rol del usuario
        // \Gate::authorize('haveaccess', 'admin.perm');

        $validated = $request->validate([
            //---informacion personal---
            'nombre' => ['required', 'max:255', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'apellido_paterno' => ['required', 'max:255', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'apellido_materno' => ['nullable', 'max:255', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
            'fecha_de_nacimiento' => 'required|date|before:17 years ago',
            'sexo' => 'required|in:h,m,o',
            'antiguedad' => 'nullable|date|before:tomorrow',

            //---informacion institucional---
            'matricula' => 'required|digits_between:7,10|numeric|unique:employees,matricula',
            'regimen' => 'required|exists:regimes,nombre',
            'unidad' => 'required|exists:units,nombre',
            'categoria' => 'required|exists:categories,nombre',
        ]);

        //si se introdujo algun dato para la direccion se validan los campos
        if ($request->estado || $request->ciudad || $request->colonia || $request->calle || $request->numero_exterior || $request->numero_interior || $request->codigo_postal || $request->telefono) {
            $validated = $request->validate([
                //direccion
                'estado' => ['required', 'max:50', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'ciudad' => ['required', 'max:60', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'colonia' => ['required', 'max:100', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'calle' => ['required', 'max:100', 'regex:/^[A-Za-z0-9??-????-????-??_! \"#$%&\'()*+,\-.\\:\/;=?@^_]+$/'],
                'numero_exterior' => ['required', 'max:10', 'regex:/^(((#|[nN][oO]|[a-zA-Z1-9??-????-????-??]*\.?) ?)?\d{1,4}(( ?[a-zA-Z0-9\-]+)+)?)$/i'],
                'numero_interior' => ['nullable', 'max:10', 'regex:/^(((#|[nN][oO]|[a-zA-Z1-9??-????-????-??]*\.?) ?)?\d{1,4}(( ?[a-zA-Z0-9\-]+)+)?)$/i'],
                'codigo_postal' => ['required', 'max:9', 'regex:/^\d{5}$/i'],
                'telefono' => ['nullable', 'max:25', 'regex:/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.0-9]*$/i'],
            ]);
        }
        // El nuevo empleado es valido...

        //nos sirve para saber si se esta creando un nuevo usuario
        $user = false;
        $newUser = null;

        //COMIENZA LA TRANSACCION
        DB::beginTransaction();

        try {
            $regimen = Regime::where("nombre", $request->regimen)->get();

            if ($regimen->isEmpty()) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            $unidad = Unit::where("nombre", $request->unidad)->get();

            if ($unidad->isEmpty()) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            $categoria = Category::where("nombre", $request->categoria)->get();

            if ($categoria->isEmpty()) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            //verifica que la unidad y el regimen esten relacionados
            if ($unidad[0]->regime->id != $regimen[0]->id) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }


            //SE CREA EL NUEVO EMPLEADO
            $newEmployee = new Employee;

            $newEmployee->uuid = Str::uuid();

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
            $newEmployee->tel = $request->telefono;

            //SE GUARDA EL NUEVO USUARIO
            $newEmployee->save();

            //SE CREA EL LOG
            $newLog = new Log;

            $newLog->uuid = Str::uuid();

            $newLog->categoria = 'create';
            $newLog->user_id = Auth::id();
            $newLog->accion =
                '{
                users: {
                    nombre: ' . $request->nombre . ',\n
                    apellido_p: ' . $request->apellido_paterno . ',\n
                    apellido_m: ' . $request->apellido_materno . ',\n
                    fecha_nac: ' . $request->fecha_de_nacimiento . ',\n
                    sexo: ' . $request->sexo . ',\n
                    antiguedad: ' . $request->antiguedad . ',\n
                    matricula: ' . $request->matricula . ',\n
                    unit_id: ' . $unidad[0]->id . ',\n
                    category_id: ' . $categoria[0]->id . ',\n
                    estado: ' . $request->estado . ',\n
                    ciudad: ' . $request->ciudad . ',\n
                    colonia: ' . $request->colonia . ',\n
                    calle: ' . $request->calle . ',\n
                    num_ext: ' . $request->numero_exterior . ',\n
                    num_int: ' . $request->numero_interior . ',\n
                    cp: ' . $request->codigo_postal . ',\n' .
                '}
            }';

            $newLog->descripcion = 'El usuario ' . Auth::user()->email . ' ha registrado un nuevo empleado con la matricula: ' . $newEmployee->matricula;

            //SE GUARDA EL LOG
            $newLog->save();

            if (!$newEmployee) {
                DB::rollBack();

                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            if (!$newLog) {
                DB::rollBack();

                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, int??ntelo m??s tarde.');
            }

            //SE HACE COMMIT
            DB::commit();

            //REDIRECCIONA A LA VISTA DE AGREGAR NUEVO REGISTRO EN ADMISION Y CAMBIOS
            return \Redirect::route('admisionCambiosCreate')->with('success', 'El empleado ha sido registrado con ??xito!');
        } catch (\Exception $e) {
            DB::rollBack();

            return \Redirect::back()->with('error', "Ocurri?? un error inesperado al intentar registrar el empleado: " . $e->getMessage());
        }
    }
}