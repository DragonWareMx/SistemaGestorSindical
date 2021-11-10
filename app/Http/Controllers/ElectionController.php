<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ElectionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $columns = ['election_employee.id', 'nombre', 'matricula', 'election_employee.num_oficio', 'elections.fecha', 'fecha_voto'];
        $elections = Election::join('election_employee', 'elections.id', 'election_employee.election_id')
            ->leftJoin('employees', 'election_employee.employee_id', 'employees.id')
            ->select('election_employee.id', 'matricula', 'election_employee.num_oficio', 'elections.fecha', 'fecha_voto')
            ->selectRaw("CONCAT_WS(' ', employees.nombre , apellido_p , apellido_m) AS nombre")
            ->when($request->column && $request->operator, function ($query) use ($request) {
                return $query->getFilteredRows($request->column, $request->operator, $request->value, 'election_employee');
            })
            ->when($request->field && $request->sort, function ($query) use ($request) {
                return $query->orderBy($request->field, $request->sort);
            })
            ->when($request->search, function ($query, $search) use ($request, $columns) {
                foreach ($columns as $id => $column) {
                    $query->orHaving($column, 'LIKE', '%' . $search . '%');
                }
            })
            ->paginate($perPage = $request->pageSize ?? 100, $columns = ['*'], $pageName = 'elections', $request->page ?? 1);

        return Inertia::render('Oficinas/secretariaInterior', ['elections' => $elections]);
    }

    public function secretariaInteriorElection($id)
    {
        $vote = DB::table('election_employee')->where('id', $id)->first();
        $employee = Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'id')->findOrFail($vote->employee_id);
        $election = Election::findOrFail($vote->election_id);
        $employees = Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'id')->get();
        $elections = Election::get();

        if ($vote->fecha_voto) {
            $date = $vote->fecha_voto;
            $date = Carbon::parse($date)->addDays(1);
            $vote->fecha_voto = $date->toDateString();
        }


        return Inertia::render('Oficinas/secretariaIEditar', [
            'vote' => $vote,
            'employee' => $employee,
            'election' => $election,
            'employees' => $employees,
            'elections' => $elections,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
        return Inertia::render('Oficinas/secretariaICrear', [
            'employees' => fn () => Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'id')
                ->get(),
            'elections' => fn () => Election::get()
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
        //
        $validated = $request->validate([
            'num_oficio' => 'required|max:255',
            'empleado' => 'required|exists:employees,id',
            'eleccion' => 'required|exists:elections,id',
            'fecha' => 'required|date',
        ]);
        DB::beginTransaction();
        try {

            $eleccion = Election::findOrFail($request->eleccion);
            $data = [
                'fecha_voto' => Carbon::parse($request->fecha)->subDays(1),
                'num_oficio' => $request->num_oficio,
            ];
            $eleccion->employees()->attach($request->empleado, $data);

            DB::commit();
            return redirect()->back()->with('success', 'El registro se creó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            dd($th);
            return redirect()->back()->with('error', "Ocurrió un error inesperado: " . $th->getMessage());
        }
    }

    public function votacion(Request $request)
    {
        $validated = $request->validate([
            'fecha_votacion' => 'required|date',
        ]);

        DB::beginTransaction();
        try {

            $eleccion = new Election();
            $eleccion->fecha = Carbon::parse($request->fecha_votacion)->subDays(1);
            $eleccion->save();
            DB::commit();
            return redirect()->back()->with('success', 'La votación se creó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return redirect()->back()->with('error', "Ocurrió un error inesperado: " . $th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Election  $election
     * @return \Illuminate\Http\Response
     */
    public function show(Election $election)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Election  $election
     * @return \Illuminate\Http\Response
     */
    public function edit(Election $election)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Election  $election
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $vote)
    {
        $validated = $request->validate([
            'num_oficio' => 'required|max:255',
            'empleado' => 'required|exists:employees,id',
            'eleccion' => 'required|exists:elections,id',
            'fecha' => 'required|date',
        ]);
        DB::beginTransaction();
        try {
            // dd($request);
            $voto = DB::table('election_employee')->where('num_oficio', $vote)->update([
                'fecha_voto' => Carbon::parse($request->fecha)->subDays(1),
                'election_id' => $request->eleccion,
            ]);

            DB::commit();
            return redirect()->back()->with('success', 'El registro se editó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            dd($th);
            DB::rollBack();
            return redirect()->back()->with('error', "Ocurrió un error inesperado: " . $th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Election  $election
     * @return \Illuminate\Http\Response
     */
    public function destroy($uuid, Request $request)
    {
        //
        DB::beginTransaction();
        try {
            $empleado = Employee::where('matricula', $uuid)->firstOrFail();
            $eleccion = Election::findOrFail($request->votacion);
            $eleccion->employees()->detach($empleado);
            DB::commit();
            return redirect()->route('secretariaInterior')->with('success', 'El registro se eliminó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return redirect()->route('secretariaInterior')->with('error', "Ocurrió un error inesperado: " . $th->getMessage());
        }
    }
}