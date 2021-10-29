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
        $trophies = Trophy::
            leftJoin('employee_trophie','trophies.id','employee_trophie.trophie_id')
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
        //
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
