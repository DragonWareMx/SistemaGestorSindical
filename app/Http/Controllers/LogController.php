<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $logs = Log::leftJoin('users', 'users.id', '=', 'logs.user_id')
                    ->leftJoin('employees', 'users.id', '=', 'employees.user_id')
                    ->select('categoria', 'descripcion', 'logs.id', 'users.email', 'users.foto', 'matricula', 'nombre', 'apellido_p', 'apellido_m')
                    ->orderBy('id', 'desc')
                    ->take(2000)
                    ->get();
        // $employees = Employee::with('category:nombre,id', 'unit:nombre,id,regime_id', 'unit.regime:nombre,id', 'user:id')
        // ->when($request->deleted == "true", function ($query, $deleted) {
        //     return $query->onlyTrashed();
        // })
        // ->when($request->user == "true", function ($query, $user) {
        //     return $query->whereHas('user');
        // })
        // ->get(['id', 'uuid', 'nombre', 'apellido_p', 'apellido_m', 'fecha_nac', 'sexo', 'antiguedad', 'estado', 'ciudad', 'colonia', 'calle', 'cp', 'num_ext', 'num_int', 'tel', 'matricula', 'category_id', 'unit_id', 'user_id']);

        return Inertia::render('Logs/Index', [
            'logs' => Inertia::lazy(fn () => $logs),
            'exists' => Log::exists()
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
     * @param  \App\Models\Log  $log
     * @return \Illuminate\Http\Response
     */
    public function show(Log $log)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Log  $log
     * @return \Illuminate\Http\Response
     */
    public function edit(Log $log)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Log  $log
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Log $log)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Log  $log
     * @return \Illuminate\Http\Response
     */
    public function destroy(Log $log)
    {
        //
    }
}
