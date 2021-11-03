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
    public function index()
    {
        $conflicts = Conflict::
            where('tipo','conflictos')
            ->leftJoin('conflict_employee','conflicts.id','conflict_employee.conflict_id')
            ->leftJoin('employees','conflict_employee.employee_id','employees.id')
            ->select('num_oficio','employees.nombre','inicio_sancion','termino_sancion','matricula','apellido_p','conflict_employee.id as id','conflicts.uuid as uuid')
            ->get();
        return Inertia::render('Oficinas/conflictos',['conflicts' => $conflicts]);
    }

    public function conflict($uuid){
        dd($uuid);
    }

    public function secretariaTrabajo()
    {
        $conflicts = Conflict::
            where('tipo','secretaria')
            ->leftJoin('conflict_employee','conflicts.id','conflict_employee.conflict_id')
            ->leftJoin('employees','conflict_employee.employee_id','employees.id')
            ->select('num_oficio','employees.nombre','inicio_sancion','termino_sancion','matricula','apellido_p','conflict_employee.id as id','conflicts.uuid as uuid')
            ->get();
        return Inertia::render('Oficinas/secretariaTrabajo',['conflicts' => $conflicts]);
    }

    public function secretariaTrabajoConflict($uuid){
        dd($uuid);
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
                    'inicio_sancion' => Carbon::parse($empleado['fecha_inicio']),
                    'termino_sancion' => Carbon::parse($empleado['fecha_termino']),
                    'sancion' => $empleado['sancion'],
                    'resolutivo'=>$empleado['resolutivo'],
                    'castigado' => $empleado['sancionado']
                ];
                $conflicto->employees()->attach($empleado['id'], $data);
            }

            DB::commit();
            return redirect()->back()->with('success', 'El registro se creó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            dd($th);
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
    public function update(Request $request, Conflict $conflict)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Conflict  $conflict
     * @return \Illuminate\Http\Response
     */
    public function destroy(Conflict $conflict)
    {
        //
    }
}
