<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Auth;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class officesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function honor(){
        $usuarios = User::get();
        
        return Inertia::render('Oficinas/honorJusticia',['usuarios' => $usuarios]);
    }
}
