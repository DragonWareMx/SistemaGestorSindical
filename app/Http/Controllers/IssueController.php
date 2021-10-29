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
    public function index()
    {

        $issues = Issue::leftJoin('employee_issue', 'issues.id', 'employee_issue.issue_id')
            ->leftJoin('employees', 'employee_issue.employee_id', 'employees.id')
            ->select('num_oficio', 'employees.nombre', 'inicio_sancion', 'termino_sancion', 'matricula', 'apellido_p', 'employee_issue.id as id', 'issues.uuid as uuid')
            ->get();
        return Inertia::render('Oficinas/honorJusticia', ['issues' => $issues]);
    }

    public function issue($uuid)
    {
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
        return Inertia::render('Oficinas/hJCrear', [
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
        // $validated = $request->validate([
        //     'issue.num_oficio' =>  ['required', 'unique:issues,num_oficio', 'max:255'],
        // ]);

        //validacion a mano por que la de laravel no funciona
        $issue = Issue::where('num_oficio', $request->issue['num_oficio'])->first();
        if ($issue) {
            return redirect()->back()->with('error', 'El numero de oficio tiene que ser único, intenta con otro');
        }

        DB::beginTransaction();
        try {
            //code...
            DB::commit();
            $honor = new Issue();
            $honor->num_oficio = $request->issue['num_oficio'];
            $honor->observaciones = $request->issue['observaciones'];
            $honor->uuid = Str::uuid();
            $honor->save();

            foreach ($request->empleados as $empleado) {
                # code...
                $data = [
                    'inicio_sancion' => Carbon::parse($empleado['fecha_inicio']),
                    'termino_sancion' => Carbon::parse($empleado['fecha_termino']),
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
    public function update(Request $request, Issue $issue)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Issue  $issue
     * @return \Illuminate\Http\Response
     */
    public function destroy(Issue $issue)
    {
        //
    }
}