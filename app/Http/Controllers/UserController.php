<?php

namespace App\Http\Controllers;

use App\Models\User;

use App\Models\Category;
use App\Models\Regime;
use App\Models\Unit;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::get();

        return $users;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //valida el rol del usuario
        //\Gate::authorize('haveaccess', 'admin.perm');

        return Inertia::render('Usuarios/Create', [
            'categories'=> fn () => Category::select('nombre')->get(),
            'regimes'=> fn () => Regime::select('nombre')->get(),
            // 'roles'=> fn () => Role::select('name')->get(),
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
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit($id, Request $request)
    {
        //valida el rol del usuario
        //\Gate::authorize('haveaccess', 'admin.perm');

        return Inertia::render('Usuarios/Edit', [
            'user' => User::withTrashed()->with([
                    'category:id,nombre',
                    'unit:id,nombre,regime_id', 
                    'unit.regime:id,nombre',
                    'roles:name'
                ])
                ->findOrFail($id),
            'categories'=> fn () => Category::select('id','nombre')->get(),
            'regimes'=> fn () => Regime::select('id','nombre')->get(),
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
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        //
    }

    /**
     * Restore the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function restore(User $user)
    {
        //
    }
}
