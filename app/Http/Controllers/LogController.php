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
    public function index(Request $request)
    {
        $columns = ['categoria', 'descripcion', 'logs.id', 'users.email', 'users.foto', 'matricula', 'nombre', 'apellido_p', 'apellido_m'];
        $logs = Log::leftJoin('users', 'users.id', '=', 'logs.user_id')
                    ->leftJoin('employees', 'users.id', '=', 'employees.user_id')
                    ->select('categoria', 'descripcion', 'logs.id', 'users.email', 'users.foto', 'matricula', 'nombre', 'apellido_p', 'apellido_m')
                    ->when($request->column && $request->operator, function ($query) use ($request) {
                        return $query->getFilteredRows($request->column, $request->operator, $request->value, 'logs');
                    })
                    ->when($request->field && $request->sort, function ($query) use ($request) {
                        return $query->orderBy($request->field, $request->sort);
                    })
                    ->when($request->search, function ($query, $search) use ($request, $columns) {
                        foreach ($columns as $id => $column) {
                            $query->orHaving($column, 'LIKE', '%'.$search.'%');
                        }
                    })
                    ->paginate($perPage = $request->pageSize ?? 100, $columns = ['*'], $pageName = 'logs', $request->page ?? 1);

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
