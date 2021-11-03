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
    public function index()
    {
        $trophies = Trophy::join('employee_trophie','trophies.id','employee_trophie.trophie_id')
            ->leftJoin('employees','employee_trophie.employee_id','employees.id')
            ->select('employees.nombre','matricula','apellido_p','employee_trophie.id as id','trophies.nombre as premio','trophies.observaciones as observaciones')
            ->get();
        return Inertia::render('Oficinas/accionFemenil',['trophies' => $trophies]);
    }

    public function trophy($id){
        dd($id);
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
            'trophies' => fn () =>Trophy::select('nombre')->get()
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
        $trophy = Trophy::where('nombre',$request->nombre)->first();

        DB::beginTransaction();
        try {
            //code...
           $trophy->employees()->sync($request->empleado);
           $trophy->save();
            DB::commit();
            return redirect()->back()->with('success', 'El registro se creó con éxito!');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return redirect()->back()->with('error', 'Ocurrió un error inesperado, por favor inténtalo más tarde!');
        }
        //falta el log
    }

    public function trophie(Request $request)
    {
        //FALTA EL LOG Y PONER LA TRANSACTION
        $premio = new Trophy();
        $premio->nombre=$request->nombre;
        $premio->observaciones=$request->observaciones;

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
    public function update(Request $request, Trophy $trophy)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Trophy  $trophy
     * @return \Illuminate\Http\Response
     */
    public function destroy(Trophy $trophy)
    {
        //
    }
}
