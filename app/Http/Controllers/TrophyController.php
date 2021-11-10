<?php

namespace App\Http\Controllers;

use App\Models\Trophy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Employee;
use App\Permission\Models\Role;

class TrophyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $columns = ['matricula', 'employee_trophie.id', 'premio', 'observaciones', 'nombre'];
        $trophies = Trophy::join('employee_trophie', 'trophies.id', 'employee_trophie.trophie_id')
            ->leftJoin('employees', 'employee_trophie.employee_id', 'employees.id')
            ->select('matricula', 'employee_trophie.id as id', 'trophies.nombre as premio', 'trophies.observaciones as observaciones')
            ->selectRaw("CONCAT_WS(' ', employees.nombre , apellido_p , apellido_m) AS nombre")
            ->DataGridPlus($request, $columns, 'employee_trophie', 20000);

        return Inertia::render('Oficinas/accionFemenil', ['trophies' => $trophies]);
    }

    public function trophy($id)
    {
        $win = DB::table('employee_trophie')->where('id', $id)->first();
        $employee = Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'id')->findOrFail($win->employee_id);
        $trophy = Trophy::findOrFail($win->trophie_id);
        $employees = Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'id')->get();
        $trophies = Trophy::get();

        return Inertia::render('Oficinas/femenilEditar', [
            'win' => $win,
            'employee' => $employee,
            'trophy' => $trophy,
            'employees' => $employees,
            'trophies' => $trophies,
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
        return Inertia::render('Oficinas/femenilCrear', [
            'employees' => fn () => Employee::select('matricula', 'nombre', 'apellido_p', 'apellido_m', 'id')
                ->get(),
            'trophies' => fn () => Trophy::select('id', 'nombre')->get()
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
        //falta validar el request
        $trophy = Trophy::find($request->nombre);

        DB::beginTransaction();
        try {
            //code...
            $trophy->employees()->attach($request->empleado);
            $trophy->save();
            DB::commit();
            return redirect()->back()->with('success', 'El registro se creó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return redirect()->back()->with('error', "Ocurrió un error inesperado: " . $th->getMessage());
        }
        //falta el log
    }

    public function trophie(Request $request)
    {
        //FALTA EL LOG Y PONER LA TRANSACTION
        $premio = new Trophy();
        $premio->nombre = $request->nombre;
        $premio->observaciones = $request->observaciones;

        $premio->save();

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Trophy  $trophy
     * @return \Illuminate\Http\Response
     */
    public function show(Trophy $trophy)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Trophy  $trophy
     * @return \Illuminate\Http\Response
     */
    public function edit(Trophy $trophy)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Trophy  $trophy
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request,  $trophy)
    {
        DB::beginTransaction();
        try {
            //code...
            //falta validar el request
            $trophy = DB::table('employee_trophie')->where('employee_id', $request->oldempleado)->where('trophie_id', $request->oldnombre)
                ->update([
                    'trophie_id' => $request->nombre['id']
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
     * @param  \App\Models\Trophy  $trophy
     * @return \Illuminate\Http\Response
     */
    public function destroy($uuid, Request $request)
    {
        //
        DB::beginTransaction();
        try {
            $empleado = Employee::where('matricula', $uuid)->firstOrFail();
            $trofeo = Trophy::findOrFail($request->trofeo);
            $trofeo->employees()->detach($empleado);
            DB::commit();
            return redirect()->route('accionFemenil')->with('success', 'El registro se eliminó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return redirect()->route('accionFemenil')->with('error', "Ocurrió un error inesperado: " . $th->getMessage());
        }
    }
}