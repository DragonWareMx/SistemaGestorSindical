<?php

namespace App\Http\Controllers;

use App\Models\Employee;

use App\Models\Category;
use App\Models\Regime;
use App\Permission\Models\Role;
use App\Models\Unit;

use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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

        return Inertia::render('Empleados/Create', [
            'categories'=> fn () => Category::select('nombre')->get(),
            'regimes'=> fn () => Regime::select('nombre')->get(),
            'roles'=> fn () => Role::select('name')->get(),
            'units'=>  Inertia::lazy(
                fn () => Unit::select('units.id','units.nombre')
                            ->leftJoin('regimes', 'regimes.id', '=', 'units.regime_id')
                            ->when($request->regime, function ($query, $regime) {
                                $query->where('regimes.nombre',$regime);
                            })
                            ->get()
            )
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
     * @param  \App\Models\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function show(Employee $employee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function edit(Employee $employee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Employee $employee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function destroy(Employee $employee)
    {
        //
    }
}
