<?php

namespace App\Http\Controllers;

use App\Models\Conflict;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Auth;
use Illuminate\Support\Facades\DB;

use App\Models\Issue;
use App\Models\Employee;
use App\Permission\Models\Role;
use Carbon\Carbon;
use Illuminate\Support\Str;


class ConflictController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $columns = ['num_oficio', 'nombre', 'inicio_sancion', 'termino_sancion', 'matricula', 'conflict_employee.id', 'conflicts.uuid', 'castigado', 'sancion'];
        $conflicts = Conflict::where('tipo', 'conflictos')
            ->join('conflict_employee', 'conflicts.id', 'conflict_employee.conflict_id')
            ->leftJoin('employees', 'conflict_employee.employee_id', 'employees.id')
            ->select('num_oficio', 'inicio_sancion', 'termino_sancion', 'matricula', 'conflict_employee.id as id', 'conflicts.uuid as uuid', 'castigado', 'sancion', 'resolutivo')
            ->selectRaw("CONCAT_WS(' ', employees.nombre , apellido_p , apellido_m) AS nombre")
            ->when($request->column && $request->operator, function ($query) use ($request) {
                return $query->getFilteredRows($request->column, $request->operator, $request->value, 'conflict_employee');
            })
            ->when($request->field && $request->sort, function ($query) use ($request) {
                return $query->orderBy($request->field, $request->sort);
            })
            ->when($request->search, function ($query, $search) use ($request, $columns) {
                foreach ($columns as $id => $column) {
                    $query->orHaving($column, 'LIKE', '%'.$search.'%');
                }
            })
            ->paginate($perPage = $request->pageSize ?? 100, $columns = ['*'], $pageName = 'nombre_de_la_tabla', $request->page ?? 1);

        return Inertia::render('Oficinas/conflictos', ['conflicts' => $conflicts]);
    }

    public function conflict($uuid)
    {
        $conflict = Conflict::where('uuid', $uuid)
            ->with('employees:nombre,matricula,apellido_p,apellido_m,id')
            ->first();


        foreach ($conflict['employees'] as $employee) {
            if ($employee->pivot['inicio_sancion']) {
                $date = $employee->pivot['inicio_sancion'];
                $date = Carbon::parse($date)->addDays(1);
                $employee->pivot['inicio_sancion'] = $date->toDateString();
            }
            if ($employee->pivot['termino_sancion']) {
                $date = $employee->pivot['termino_sancion'];
                $date = Carbon::parse($date)->addDays(1);
                $employee->pivot['termino_sancion'] = $date->toDateString();
            }
        }


        return Inertia::render('Oficinas/conflictEditar', [
            'conflict' => $conflict,
            'employees' => fn () => Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'id')
                ->get()
        ]);
    }

    public function secretariaTrabajo(Request $request)
    {
        $columns = ['num_oficio', 'nombre', 'inicio_sancion', 'termino_sancion', 'matricula', 'conflict_employee.id', 'conflicts.uuid', 'castigado', 'sancion'];
        $conflicts = Conflict::where('tipo', 'secretaria')
            ->join('conflict_employee', 'conflicts.id', 'conflict_employee.conflict_id')
            ->leftJoin('employees', 'conflict_employee.employee_id', 'employees.id')
            ->select('num_oficio', 'inicio_sancion', 'termino_sancion', 'matricula', 'conflict_employee.id as id', 'conflicts.uuid as uuid', 'castigado', 'sancion', 'resolutivo')
            ->selectRaw("CONCAT_WS(' ', employees.nombre , apellido_p , apellido_m) AS nombre")
            ->when($request->column && $request->operator, function ($query) use ($request) {
                return $query->getFilteredRows($request->column, $request->operator, $request->value, 'conflict_employee');
            })
            ->when($request->field && $request->sort, function ($query) use ($request) {
                return $query->orderBy($request->field, $request->sort);
            })
            ->when($request->search, function ($query, $search) use ($request, $columns) {
                foreach ($columns as $id => $column) {
                    $query->orHaving($column, 'LIKE', '%'.$search.'%');
                }
            })
            ->paginate($perPage = $request->pageSize ?? 100, $columns = ['*'], $pageName = 'nombre_de_la_tabla', $request->page ?? 1);

        return Inertia::render('Oficinas/secretariaTrabajo', ['conflicts' => $conflicts]);
    }

    public function secretariaTrabajoConflict($uuid)
    {
        $conflict = Conflict::where('uuid', $uuid)
            ->with('employees:nombre,matricula,apellido_p,apellido_m,id')
            ->first();


        foreach ($conflict['employees'] as $employee) {
            if ($employee->pivot['inicio_sancion']) {
                $date = $employee->pivot['inicio_sancion'];
                $date = Carbon::parse($date)->addDays(1);
                $employee->pivot['inicio_sancion'] = $date->toDateString();
            }
            if ($employee->pivot['termino_sancion']) {
                $date = $employee->pivot['termino_sancion'];
                $date = Carbon::parse($date)->addDays(1);
                $employee->pivot['termino_sancion'] = $date->toDateString();
            }
        }
        // dd($conflict);

        return Inertia::render('Oficinas/secretariaTrabajoEditar', ['conflict' => $conflict, 'employees' => fn () => Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'id')
            ->get()]);
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function secretariaTrabajoCreate()
    {
        //
        return Inertia::render('Oficinas/secretariaTrabajoCrear', [
            'roles' => fn () => Role::select('name')->get(),
            'employees' => fn () => Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'id')
                ->get()
        ]);
    }

    public function secretariaTrabajoStore(Request $request)
    {
        //FALTA VALIDATES
        $conflict = Conflict::where('num_oficio', $request->conflict['num_oficio'])->first();
        if ($conflict) {
            return redirect()->back()->with('error', 'El numero de oficio tiene que ser único, intenta con otro');
        }

        DB::beginTransaction();
        try {
            $conflicto = new Conflict();
            $conflicto->num_oficio = $request->conflict['num_oficio'];
            $conflicto->observaciones = $request->conflict['observaciones'];
            $conflicto->uuid = Str::uuid();
            $conflicto->tipo = 'secretaria';
            $conflicto->save();

            foreach ($request->empleados as $empleado) {
                # code...
                $data = [
                    'inicio_sancion' => Carbon::parse($empleado['fecha_inicio'])->subDays(1),
                    'termino_sancion' => Carbon::parse($empleado['fecha_termino'])->subDays(1),
                    'sancion' => $empleado['sancion'],
                    'resolutivo' => $empleado['resolutivo'],
                    'castigado' => $empleado['sancionado']
                ];
                $conflicto->employees()->attach($empleado['id'], $data);
            }

            DB::commit();
            return redirect()->back()->with('success', 'El registro se creó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return redirect()->back()->with('error', 'Ocurrió un error inesperado, por favor inténtalo más tarde!');
        }
        //FALTA LOG
    }

    public function secretariaTrabajoConflictUpdate(Request $request, $conflicto)
    {
        // dd($request);
        DB::beginTransaction();
        try {
            $conflicto = Conflict::where('num_oficio', $conflicto)->first();
            $conflicto->observaciones = $request->conflict['observaciones'];
            $conflicto->save();

            $conflicto->employees()->detach();
            foreach ($request->empleados as $empleado) {
                # code...
                if ($empleado['pivot']['inicio_sancion'] && $empleado['pivot']['termino_sancion']) {
                    $data = [
                        'inicio_sancion' => Carbon::parse($empleado['pivot']['inicio_sancion'])->subDays(1),
                        'termino_sancion' => Carbon::parse($empleado['pivot']['termino_sancion'])->subDays(1),
                        'sancion' => $empleado['pivot']['sancion'],
                        'resolutivo' => $empleado['pivot']['resolutivo'],
                        'castigado' => $empleado['pivot']['castigado']
                    ];
                } else {
                    $data = [
                        'sancion' => $empleado['pivot']['sancion'],
                        'resolutivo' => $empleado['pivot']['resolutivo'],
                        'castigado' => $empleado['pivot']['castigado']
                    ];
                }

                $conflicto->employees()->attach($empleado['id'], $data);
            }

            DB::commit();
            return redirect()->back()->with('success', 'El registro se editó con éxito!');
        } catch (\Throwable $th) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Ocurrió un error inesperado, por favor inténtalo más tarde!');
        }
        //FALTA LOG
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
        return Inertia::render('Oficinas/conflictCrear', [
            'roles' => fn () => Role::select('name')->get(),
            'employees' => fn () => Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'id')
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
        //FALTA VALIDATES
        $conflict = Conflict::where('num_oficio', $request->conflict['num_oficio'])->first();
        if ($conflict) {
            return redirect()->back()->with('error', 'El numero de oficio tiene que ser único, intenta con otro');
        }

        DB::beginTransaction();
        try {
            $conflicto = new Conflict();
            $conflicto->num_oficio = $request->conflict['num_oficio'];
            $conflicto->observaciones = $request->conflict['observaciones'];
            $conflicto->uuid = Str::uuid();
            $conflicto->tipo = 'conflictos';
            $conflicto->save();

            foreach ($request->empleados as $empleado) {
                # code...
                $data = [
                    'inicio_sancion' => Carbon::parse($empleado['fecha_inicio'])->subDays(1),
                    'termino_sancion' => Carbon::parse($empleado['fecha_termino'])->subDays(1),
                    'sancion' => $empleado['sancion'],
                    'resolutivo' => $empleado['resolutivo'],
                    'castigado' => $empleado['sancionado']
                ];
                $conflicto->employees()->attach($empleado['id'], $data);
            }

            DB::commit();
            return redirect()->back()->with('success', 'El registro se creó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            // dd($th);
            return redirect()->back()->with('error', 'Ocurrió un error inesperado, por favor inténtalo más tarde!');
        }
        //FALTA LOG
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Conflict  $conflict
     * @return \Illuminate\Http\Response
     */
    public function show(Conflict $conflict)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Conflict  $conflict
     * @return \Illuminate\Http\Response
     */
    public function edit(Conflict $conflict)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Conflict  $conflict
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $conflict)
    {
        DB::beginTransaction();
        try {
            $conflicto = Conflict::where('num_oficio', $conflict)->first();
            $conflicto->observaciones = $request->conflict['observaciones'];
            $conflicto->save();

            $conflicto->employees()->detach();
            foreach ($request->empleados as $empleado) {
                # code...
                if ($empleado['pivot']['inicio_sancion'] && $empleado['pivot']['termino_sancion']) {
                    $data = [
                        'inicio_sancion' => Carbon::parse($empleado['pivot']['inicio_sancion'])->subDays(1),
                        'termino_sancion' => Carbon::parse($empleado['pivot']['termino_sancion'])->subDays(1),
                        'sancion' => $empleado['pivot']['sancion'],
                        'resolutivo' => $empleado['pivot']['resolutivo'],
                        'castigado' => $empleado['pivot']['castigado']
                    ];
                } else {
                    $data = [
                        'sancion' => $empleado['pivot']['sancion'],
                        'resolutivo' => $empleado['pivot']['resolutivo'],
                        'castigado' => $empleado['pivot']['castigado']
                    ];
                }

                $conflicto->employees()->attach($empleado['id'], $data);
            }

            DB::commit();
            return redirect()->back()->with('success', 'El registro se editó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            // dd($th);
            return redirect()->back()->with('error', 'Ocurrió un error inesperado, por favor inténtalo más tarde!');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Conflict  $conflict
     * @return \Illuminate\Http\Response
     */
    public function destroy($uuid)
    {
        //
        DB::beginTransaction();
        try {
            $entrada = Conflict::where('uuid', $uuid)->firstOrFail();
            $entrada->delete();
            DB::commit();
            return redirect()->route('conflicts')->with('success', 'El registro se eliminó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return redirect()->route('conflicts')->with('error', 'Ocurrió un error inesperado, por favor inténtalo más tarde!');
        }
    }

    public function destroyTrabajo($uuid)
    {
        //
        DB::beginTransaction();
        try {
            $entrada = Conflict::where('uuid', $uuid)->firstOrFail();
            $entrada->delete();
            DB::commit();
            return redirect()->route('secretariaTrabajo')->with('success', 'El registro se eliminó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return redirect()->route('secretariaTrabajo')->with('error', 'Ocurrió un error inesperado, por favor inténtalo más tarde!');
        }
    }
}