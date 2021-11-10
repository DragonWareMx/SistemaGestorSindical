<?php

namespace App\Http\Controllers;

use App\Models\User;

use App\Models\Category;
use App\Models\Regime;
use App\Permission\Models\Role;
use App\Models\Unit;
use App\Models\Employee;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;

use Image;
use Illuminate\Support\Facades\Storage;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $columns = ['users.id', 'users.uuid', 'email', 'matricula', 'users.created_at', 'employees.deleted_at', 'foto', 'nombre'];

        if (Auth::user()->roles[0]->slug == 'admin' || Auth::user()->roles[0]->slug == 'secGen') {
            $users = User::leftJoin('employees', 'users.id', '=', 'employees.user_id')
                ->select('users.id', 'users.uuid', 'email', 'matricula', 'users.created_at', 'employees.deleted_at', 'foto')
                ->selectRaw("CONCAT_WS(' ', nombre , apellido_p , apellido_m) AS nombre")
                ->where('email', '!=', 'test@dragonware.com.mx')
                ->when($request->deleted == "true", function ($query, $deleted) {
                    return $query->onlyTrashed();
                })
                ->when($request->column && $request->operator, function ($query) use ($request) {
                    return $query->getFilteredRows($request->column, $request->operator, $request->value, 'users');
                })
                ->when($request->field && $request->sort, function ($query) use ($request) {
                    return $query->orderBy($request->field, $request->sort);
                })
                ->when($request->search, function ($query, $search) use ($request, $columns) {
                    foreach ($columns as $id => $column) {
                        $query->orHaving($column, 'LIKE', '%' . $search . '%');
                    }
                })
                ->paginate($perPage = $request->pageSize ?? 100, $columns = ['*'], $pageName = 'users', $request->page ?? 1);
        } else {
            if (Auth::user()->roles[0]->slug == 'asistHJ' || Auth::user()->roles[0]->slug == 'respHJ') {
                $users = User::leftJoin('employees', 'users.id', '=', 'employees.user_id')
                    ->select('users.id', 'users.uuid', 'email', 'matricula', 'users.created_at', 'employees.deleted_at', 'foto')
                    ->selectRaw("CONCAT_WS(' ', nombre , apellido_p , apellido_m) AS nombre")
                    ->where('email', '!=', 'test@dragonware.com.mx')
                    ->whereHas('roles', function (Builder $query) {
                        $query->where('slug', '=', 'asistHJ')->orWhere('slug', '=', 'respHJ');
                    })
                    ->when($request->deleted == "true", function ($query, $deleted) {
                        return $query->onlyTrashed();
                    })
                    ->when($request->column && $request->operator, function ($query) use ($request) {
                        return $query->getFilteredRows($request->column, $request->operator, $request->value, 'users');
                    })
                    ->when($request->field && $request->sort, function ($query) use ($request) {
                        return $query->orderBy($request->field, $request->sort);
                    })
                    ->when($request->search, function ($query, $search) use ($request, $columns) {
                        foreach ($columns as $id => $column) {
                            $query->orHaving($column, 'LIKE', '%' . $search . '%');
                        }
                    })
                    ->paginate($perPage = $request->pageSize ?? 100, $columns = ['*'], $pageName = 'users', $request->page ?? 1);
            }
            if (Auth::user()->roles[0]->slug == 'asistConflict' || Auth::user()->roles[0]->slug == 'respConflict') {
                $users = User::leftJoin('employees', 'users.id', '=', 'employees.user_id')
                    ->select('users.id', 'users.uuid', 'email', 'matricula', 'users.created_at', 'employees.deleted_at', 'foto')
                    ->selectRaw("CONCAT_WS(' ', nombre , apellido_p , apellido_m) AS nombre")
                    ->where('email', '!=', 'test@dragonware.com.mx')
                    ->whereHas('roles', function (Builder $query) {
                        $query->where('slug', '=', 'asistConflict')->orWhere('slug', '=', 'respConflict');
                    })
                    ->when($request->deleted == "true", function ($query, $deleted) {
                        return $query->onlyTrashed();
                    })
                    ->when($request->column && $request->operator, function ($query) use ($request) {
                        return $query->getFilteredRows($request->column, $request->operator, $request->value, 'users');
                    })
                    ->when($request->field && $request->sort, function ($query) use ($request) {
                        return $query->orderBy($request->field, $request->sort);
                    })
                    ->when($request->search, function ($query, $search) use ($request, $columns) {
                        foreach ($columns as $id => $column) {
                            $query->orHaving($column, 'LIKE', '%' . $search . '%');
                        }
                    })
                    ->paginate($perPage = $request->pageSize ?? 100, $columns = ['*'], $pageName = 'users', $request->page ?? 1);
            }
            if (Auth::user()->roles[0]->slug == 'asistST' || Auth::user()->roles[0]->slug == 'respST') {
                $users = User::leftJoin('employees', 'users.id', '=', 'employees.user_id')
                    ->select('users.id', 'users.uuid', 'email', 'matricula', 'users.created_at', 'employees.deleted_at', 'foto')
                    ->selectRaw("CONCAT_WS(' ', nombre , apellido_p , apellido_m) AS nombre")
                    ->where('email', '!=', 'test@dragonware.com.mx')
                    ->whereHas('roles', function (Builder $query) {
                        $query->where('slug', '=', 'asistST')->orWhere('slug', '=', 'respST');
                    })
                    ->when($request->deleted == "true", function ($query, $deleted) {
                        return $query->onlyTrashed();
                    })
                    ->when($request->column && $request->operator, function ($query) use ($request) {
                        return $query->getFilteredRows($request->column, $request->operator, $request->value, 'users');
                    })
                    ->when($request->field && $request->sort, function ($query) use ($request) {
                        return $query->orderBy($request->field, $request->sort);
                    })
                    ->when($request->search, function ($query, $search) use ($request, $columns) {
                        foreach ($columns as $id => $column) {
                            $query->orHaving($column, 'LIKE', '%' . $search . '%');
                        }
                    })
                    ->paginate($perPage = $request->pageSize ?? 100, $columns = ['*'], $pageName = 'users', $request->page ?? 1);
            }
            if (Auth::user()->roles[0]->slug == 'asistSI' || Auth::user()->roles[0]->slug == 'respSI') {
                $users = User::leftJoin('employees', 'users.id', '=', 'employees.user_id')
                    ->select('users.id', 'users.uuid', 'email', 'matricula', 'users.created_at', 'employees.deleted_at', 'foto')
                    ->selectRaw("CONCAT_WS(' ', nombre , apellido_p , apellido_m) AS nombre")
                    ->where('email', '!=', 'test@dragonware.com.mx')
                    ->whereHas('roles', function (Builder $query) {
                        $query->where('slug', '=', 'asistSI')->orWhere('slug', '=', 'respSI');
                    })
                    ->when($request->deleted == "true", function ($query, $deleted) {
                        return $query->onlyTrashed();
                    })
                    ->when($request->column && $request->operator, function ($query) use ($request) {
                        return $query->getFilteredRows($request->column, $request->operator, $request->value, 'users');
                    })
                    ->when($request->field && $request->sort, function ($query) use ($request) {
                        return $query->orderBy($request->field, $request->sort);
                    })
                    ->when($request->search, function ($query, $search) use ($request, $columns) {
                        foreach ($columns as $id => $column) {
                            $query->orHaving($column, 'LIKE', '%' . $search . '%');
                        }
                    })
                    ->paginate($perPage = $request->pageSize ?? 100, $columns = ['*'], $pageName = 'users', $request->page ?? 1);
            }
            if (Auth::user()->roles[0]->slug == 'asistAF' || Auth::user()->roles[0]->slug == 'respAF') {
                $users = User::leftJoin('employees', 'users.id', '=', 'employees.user_id')
                    ->select('users.id', 'users.uuid', 'email', 'matricula', 'users.created_at', 'employees.deleted_at', 'foto')
                    ->selectRaw("CONCAT_WS(' ', nombre , apellido_p , apellido_m) AS nombre")
                    ->where('email', '!=', 'test@dragonware.com.mx')
                    ->whereHas('roles', function (Builder $query) {
                        $query->where('slug', '=', 'asistAF')->orWhere('slug', '=', 'respAF');
                    })
                    ->when($request->deleted == "true", function ($query, $deleted) {
                        return $query->onlyTrashed();
                    })
                    ->when($request->column && $request->operator, function ($query) use ($request) {
                        return $query->getFilteredRows($request->column, $request->operator, $request->value, 'users');
                    })
                    ->when($request->field && $request->sort, function ($query) use ($request) {
                        return $query->orderBy($request->field, $request->sort);
                    })
                    ->when($request->search, function ($query, $search) use ($request, $columns) {
                        foreach ($columns as $id => $column) {
                            $query->orHaving($column, 'LIKE', '%' . $search . '%');
                        }
                    })
                    ->paginate($perPage = $request->pageSize ?? 100, $columns = ['*'], $pageName = 'users', $request->page ?? 1);
            }
            if (Auth::user()->roles[0]->slug == 'asistAC' || Auth::user()->roles[0]->slug == 'respAC') {
                $users = User::leftJoin('employees', 'users.id', '=', 'employees.user_id')
                    ->select('users.id', 'users.uuid', 'email', 'matricula', 'users.created_at', 'employees.deleted_at', 'foto')
                    ->selectRaw("CONCAT_WS(' ', nombre , apellido_p , apellido_m) AS nombre")
                    ->where('email', '!=', 'test@dragonware.com.mx')
                    ->whereHas('roles', function (Builder $query) {
                        $query->where('slug', '=', 'asistAC')->orWhere('slug', '=', 'respAC');
                    })
                    ->when($request->deleted == "true", function ($query, $deleted) {
                        return $query->onlyTrashed();
                    })
                    ->when($request->column && $request->operator, function ($query) use ($request) {
                        return $query->getFilteredRows($request->column, $request->operator, $request->value, 'users');
                    })
                    ->when($request->field && $request->sort, function ($query) use ($request) {
                        return $query->orderBy($request->field, $request->sort);
                    })
                    ->when($request->search, function ($query, $search) use ($request, $columns) {
                        foreach ($columns as $id => $column) {
                            $query->orHaving($column, 'LIKE', '%' . $search . '%');
                        }
                    })
                    ->paginate($perPage = $request->pageSize ?? 100, $columns = ['*'], $pageName = 'users', $request->page ?? 1);
            }
        }

        return Inertia::render('Usuarios/Index', [
            'users' => $users
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

        return Inertia::render('Usuarios/Create', [
            'roles' => fn () => Role::select('name')->get(),
            'employees' => fn () => Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'id')
                ->whereDoesntHave('user')
                ->get()
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

        //valida los datos del usuario
        $validated = $request->validate([
            //---cuenta---
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:51200',
            'email' => 'required|email:rfc|max:255|unique:users',
            'contrasena' => [
                'required',
                Password::min(8)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->uncompromised(),
            ],
            'confirmar_contrasena' => 'required|same:contrasena',
            'rol' => 'required|exists:roles,name',
            'empleado' => 'required|exists:employees,id'
        ]);

        //variables para comprobar la subida de archivos
        $foto = null;

        //COMIENZA LA TRANSACCION
        DB::beginTransaction();

        try {
            //si hay usuario se registra
            $rol = Role::where("name", $request->rol)->get();

            if ($rol->isEmpty()) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
            }

            $employee = Employee::findOrFail($request->empleado);

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


            if (!$newUser) {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if ($foto) {
                    \Storage::delete($foto);
                }

                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el empleado, inténtelo más tarde.');
            }

            //se asigna el empleado al usuario
            $newUser->employee()->save($employee);

            //SE CREA EL LOG
            $newLog = new Log;

            $newLog->uuid = Str::uuid();

            $newLog->categoria = 'create';
            $newLog->user_id = Auth::id();
            $newLog->accion =
                '{
                users: {
                    email: ' . $request->email . ',\n
                    rol: ' . $request->rol . ',\n
                    empleado: ' . $request->empleado . ',\n
                }
            }';

            $newLog->descripcion = 'El usuario ' . Auth::user()->email . ' ha registrado un nuevo usuario con el correo: ' . $newUser->email;

            //SE GUARDA EL LOG
            $newLog->save();

            if (!$newLog) {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if ($foto) {
                    \Storage::delete($foto);
                }
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar registrar el usuario, inténtelo más tarde.');
            }

            //SE HACE COMMIT
            DB::commit();

            //REDIRECCIONA A LA VISTA DE USUARIOS
            return \Redirect::route('users.index')->with('success', 'El usuario ha sido registrado con éxito!');
        } catch (\Exception $e) {
            DB::rollBack();

            //si hay foto se elimina del servidor
            if ($foto) {
                \Storage::delete($foto);
            }

            return \Redirect::back()->with('error', "Ocurrió un error inesperado al intentar registrar el usuario: " . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit($uuid, Request $request)
    {
        //valida el rol del usuario
        //\Gate::authorize('haveaccess', 'admin.perm');
        if(Auth::user()->roles[0]->slug != 'admin' && Auth::user()->roles[0]->slug != 'secGen'){
            return \Redirect::back()->with('error','No tienes los permisos necesarios');
        }

        return Inertia::render('Usuarios/Edit', [
            'user' => User::withTrashed()->with([
                'roles:name',
                'employee:user_id,matricula,nombre,apellido_p,apellido_m,uuid,unit_id,category_id',
                'employee.category:id,nombre',
                'employee.unit:id,nombre,regime_id',
                'employee.unit.regime:id,nombre'
            ])
                ->where('uuid', $uuid)
                ->select('id', 'uuid', 'email', 'foto', 'created_at', 'deleted_at')
                ->firstOrFail(),
            'roles' => fn () => Role::select('name')->get(),
            'employees' => fn () => Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'id')
                ->whereDoesntHave('user')
                ->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //valida el rol del usuario
        //\Gate::authorize('haveaccess', 'admin.perm');

        $validated = $request->validate([
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:51200',

            //---cuenta---
            'cambiar_empleado' => 'required|boolean',
            'empleado' => 'nullable|exists:employees,id',
            'email' => 'required|email:rfc|max:255|unique:users,email,' . $id,

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
            'rol' => 'required|exists:roles,name'
        ]);
        // El usuario es valido...

        //si hay cambio de contraseña valida que no sea nula
        if ($request->cambiar_contrasena) {
            if (is_null($request->contrasena)) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'La nueva contraseña no ha sido introducida.');
            }
        }

        //si hay cambio de contraseña valida que no sea nula
        if ($request->cambiar_empleado) {
            if (is_null($request->empleado)) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'No se ha seleccionado el nuevo empleado.');
            }
        }

        //variables para comprobar la subida de archivos
        $foto = null;

        //COMIENZA LA TRANSACCION
        DB::beginTransaction();

        try {
            //se busca el rol en la bd
            $rol = Role::where("name", $request->rol)->get();

            if ($rol->isEmpty()) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar editar el usuario, inténtelo más tarde.');
            }

            //SE CREA EL NUEVO USUARIO
            $user = User::findOrFail($id);

            //guarda el empleado
            if (!is_null($request->empleado)) {
                $employee = Employee::findOrFail($request->empleado);
                $user->employee()->save($employee);
            }

            //guarda la foto
            if (!is_null($request->file('foto'))) {
                if ($user->foto) {
                    \Storage::delete('public/fotos_perfil/' . $user->foto);
                }

                //guarda la foto
                $foto = $request->file('foto')->store('public/fotos_perfil');
                $fileName = $request->file('foto')->hashName();
                $user->foto = $fileName;

                $image = Image::make(Storage::get($foto));

                $image->resize(1280, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });

                Storage::put($foto, (string) $image->encode('jpg', 30));
            }

            //---cuenta---
            $user->email = $request->email;

            if ($request->cambiar_contrasena) {
                $user->password = \Hash::make($request->contrasena);
            }

            //SE GUARDA EL NUEVO USUARIO
            $user->save();

            //se asigna el rol
            $user->roles()->sync([$rol[0]->id]);

            //SE CREA EL LOG
            $newLog = new Log;
            $newLog->uuid = Str::uuid();
            $newLog->categoria = 'update';
            $newLog->user_id = Auth::id();
            $newLog->accion =
                '{
                users: {
                    email: ' . $request->email . ',\n
                    rol: ' . $request->rol . ',\n
                    empleado: ' . $request->empleado .
                '}
            }';

            $newLog->descripcion = 'El usuario ' . Auth::user()->email . ' ha actualizado los datos del usuario: ' . $user->email;

            //SE GUARDA EL LOG
            $newLog->save();


            if (!$user) {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if ($foto) {
                    \Storage::delete($foto);
                }
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar editar el usuario, inténtelo más tarde.');
            }
            if (!$newLog) {
                DB::rollBack();
                //si hay foto se elimina del servidor
                if ($foto) {
                    \Storage::delete($foto);
                }
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar editar el usuario, inténtelo más tarde.');
            }

            //SE HACE COMMIT
            DB::commit();

            //REDIRECCIONA A LA VISTA DE USUARIOS
            return \Redirect::back()->with('success', 'El usuario ha sido editado con éxito!');
        } catch (\Exception $e) {
            DB::rollBack();

            //si hay foto se elimina del servidor
            if ($foto) {
                \Storage::delete($foto);
            }
            //si hay tarjeton se elimina del servidor
            if ($tarjeton_pago) {
                \Storage::delete($tarjeton_pago);
            }

            return \Redirect::back()->with('error', "Ocurrió un error inesperado al intentar editar el usuario: " . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //valida el rol del usuario
        //\Gate::authorize('haveaccess', 'admin.perm');

        DB::beginTransaction();
        try {
            $user = User::findOrFail($id);

            if (!$user) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar eliminar el usuario, inténtelo más tarde.');
            }

            if ($user->id == Auth::id()) {
                DB::rollBack();
                return \Redirect::back()->with('message', '¡No puedes eliminar tu propio usuario!');
            }

            if (!$user->employee()->get()->isEmpty()) {
                $employee = $user->employee()->firstOrFail();
                $employee->user()->dissociate();
                $employee->save();
            }

            $user->delete();

            //SE CREA EL LOG
            $newLog = new Log;
            $newLog->uuid = Str::uuid();
            $newLog->categoria = 'delete';
            $newLog->user_id = Auth::id();
            $newLog->accion =
                '{
                users: {
                    id: ' . $id .
                '}
            }';

            $newLog->descripcion = 'El usuario ' . Auth::user()->email . ' ha eliminado al usuario: ' . $user->email;

            $newLog->save();

            DB::commit();
            return \Redirect::back()->with('success', '¡Usuario eliminado con éxito!');
        } catch (\Exception $e) {
            DB::rollBack();
            return \Redirect::back()->with('error', "Ocurrió un error inesperado al intentar eliminar el usuario: " . $e->getMessage());
        }
    }

    /**
     * Restore the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function restore($id)
    {
        //valida el rol del usuario
        //\Gate::authorize('haveaccess', 'admin.perm');

        DB::beginTransaction();
        try {
            $user = User::withTrashed()->find($id);

            if (!$user) {
                DB::rollBack();
                return \Redirect::back()->with('error', 'Ha ocurrido un error al intentar eliminar el usuario, inténtelo más tarde.');
            }

            if ($user->id == Auth::id()) {
                DB::rollBack();
                return \Redirect::back()->with('message', '¡No puedes eliminar tu propio usuario!');
            }

            $user->restore();

            //SE CREA EL LOG
            $newLog = new Log;
            $newLog->uuid = Str::uuid();
            $newLog->categoria = 'restore';
            $newLog->user_id = Auth::id();
            $newLog->accion =
                '{
                users: {
                    id: ' . $id .
                '}
            }';

            $newLog->descripcion = 'El usuario ' . Auth::user()->email . ' ha restaurado al usuario: ' . $user->email;

            $newLog->save();

            DB::commit();
            return \Redirect::back()->with('success', '¡Usuario restaurado con éxito!');
        } catch (\Exception $e) {
            DB::rollBack();
            return \Redirect::back()->with('error', "Ocurrió un error inesperado al intentar restaurar el usuario: " . $e->getMessage());
        }
    }
}
