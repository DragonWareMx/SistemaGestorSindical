<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Auth;
use App\Models\Issue;
use Illuminate\Support\Facades\DB;
use App\Models\Employee;
use App\Permission\Models\Role;
use Carbon\Carbon;
use Illuminate\Support\Str;


class IssueController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $columns = ['num_oficio', 'nombre', 'inicio_sancion', 'termino_sancion', 'matricula', 'employee_issue.id', 'issues.uuid', 'sancion', 'castigado'];
        $issues = Issue::join('employee_issue', 'issues.id', 'employee_issue.issue_id')
            ->leftJoin('employees', 'employee_issue.employee_id', 'employees.id')
            ->select('num_oficio', 'inicio_sancion', 'termino_sancion', 'matricula', 'employee_issue.id as id', 'issues.uuid as uuid', 'sancion', 'castigado')
            ->selectRaw("CONCAT_WS(' ', employees.nombre , apellido_p , apellido_m) AS nombre")
            ->when($request->column && $request->operator, function ($query) use ($request) {
                return $query->getFilteredRows($request->column, $request->operator, $request->value, 'employee_issue');
            })
            ->when($request->field && $request->sort, function ($query) use ($request) {
                return $query->orderBy($request->field, $request->sort);
            })
            ->when($request->search, function ($query, $search) use ($request, $columns) {
                foreach ($columns as $id => $column) {
                    $query->orHaving($column, 'LIKE', '%'.$search.'%');
                }
            })
            ->paginate($perPage = $request->pageSize ?? 100, $columns = ['*'], $pageName = 'issues', $request->page ?? 1);

        return Inertia::render('Oficinas/honorJusticia', ['issues' => $issues]);
    }

    public function issue($numOficio)
    {
        $issue = Issue::where('num_oficio', $numOficio)
            ->with('employees:nombre,matricula,apellido_p,apellido_m,id')
            ->first();


        foreach ($issue['employees'] as $employee) {
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

        $employees = Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'id')
            ->get();

        return Inertia::render('Oficinas/hJEditar', ['issue' => $issue, 'employees' => $employees]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
        return Inertia::render('Oficinas/hJCrear', [
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
        // $validated = $request->validate([
        //     'issue.num_oficio' =>  ['required', 'unique:issues,num_oficio', 'max:255'],
        // ]);

        //validacion a mano por que la de laravel no funciona
        $issue = Issue::where('num_oficio', $request->issue['num_oficio'])->first();
        if ($issue) {
            return redirect()->back()->with('error', 'El número de oficio tiene que ser único, intenta con otro');
        }

        DB::beginTransaction();
        try {
            //code...
            $honor = new Issue();
            $honor->num_oficio = $request->issue['num_oficio'];
            $honor->observaciones = $request->issue['observaciones'];
            $honor->uuid = Str::uuid();
            $honor->save();

            foreach ($request->empleados as $empleado) {
                # code...
                $fechaIni = null;
                if ($empleado['fecha_inicio']) {
                    $fechaIni = Carbon::parse($empleado['fecha_inicio']);
                }
                $fechaFin = null;
                if ($empleado['fecha_termino']) {
                    $fechaFin = Carbon::parse($empleado['fecha_termino']);
                }

                $data = [
                    'inicio_sancion' => $fechaIni,
                    'termino_sancion' => $fechaFin,
                    'sancion' => $empleado['sancion'],
                    'castigado' => $empleado['sancionado']
                ];
                $honor->employees()->attach($empleado['id'], $data);
            }

            DB::commit();
            return redirect()->back()->with('success', 'El registro se creó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return redirect()->back()->with('error', 'Ocurrió un error inesperado, por favor inténtalo más tarde!');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Issue  $issue
     * @return \Illuminate\Http\Response
     */
    public function show(Issue $issue)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Issue  $issue
     * @return \Illuminate\Http\Response
     */
    public function edit(Issue $issue)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Issue  $issue
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $issue)
    {
        // dd($request);
        DB::beginTransaction();
        try {
            // dd($request);
            $honor = Issue::where('num_oficio', $issue)->first();
            $honor->observaciones = $request->issue['observaciones'];
            $honor->save();

            $honor->employees()->detach();
            foreach ($request->empleados as $empleado) {
                $fechaIni = null;
                if ($empleado['pivot']['inicio_sancion']) {
                    $fechaIni = Carbon::parse($empleado['pivot']['inicio_sancion'])->subDays(1);
                }
                $fechaFin = null;
                if ($empleado['pivot']['termino_sancion']) {
                    $fechaFin = Carbon::parse($empleado['pivot']['termino_sancion'])->subDays(1);
                }
                $data = [
                    'inicio_sancion' => $fechaIni,
                    'termino_sancion' => $fechaFin,
                    'sancion' => $empleado['pivot']['sancion'],
                    'castigado' => $empleado['pivot']['castigado'],
                ];
                $honor->employees()->attach($empleado['id'], $data);
            }

            DB::commit();
            return redirect()->back()->with('success', 'El registro se editó con éxito!');
        } catch (\Throwable $th) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Ocurrió un error inesperado, por favor inténtalo más tarde!');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Issue  $issue
     * @return \Illuminate\Http\Response
     */
    public function destroy($uuid)
    {
        //
        DB::beginTransaction();
        try {
            $entrada = Issue::where('uuid', $uuid)->firstOrFail();
            $entrada->delete();
            DB::commit();
            return redirect()->route('honor')->with('success', 'El registro se eliminó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return redirect()->route('honor')->with('error', 'Ocurrió un error inesperado, por favor inténtalo más tarde!');
        }
    }
}