<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Auth;
class SecretariaTrabajo
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()){
            if (Auth::user()->roles[0]->slug != 'admin' && Auth::user()->roles[0]->slug != 'secGen'
            && Auth::user()->roles[0]->slug != 'respST' && Auth::user()->roles[0]->slug != 'asistST') {
                return redirect()->route('home');
            }
        }
        else{
            return redirect()->route('login');
        }
        return $next($request);
    }
}
