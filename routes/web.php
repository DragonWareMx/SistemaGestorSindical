<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('/inertia');
});

Route::get('/inertia', function () {
    return Inertia::render('Ejemplo');
})->name('home')->middleware('auth');

//Usuarios
Route::name('users.')->middleware('auth')->group(function () {
    Route::get('/usuarios', [App\Http\Controllers\UserController::class, 'index'])->name('index');
    Route::get('/usuarios/crear', [App\Http\Controllers\UserController::class, 'create'])->name('create');
    Route::post('/usuarios', [App\Http\Controllers\UserController::class, 'store'])->name('store');
    Route::get('/usuarios/{id}/editar', [App\Http\Controllers\UserController::class, 'edit'])->name('edit');
    Route::patch('/usuarios/{id}', [App\Http\Controllers\UserController::class, 'update'])->name('update');
    Route::delete('usuarios/{id}',  [App\Http\Controllers\UserController::class, 'destroy'])->name('delete');
    Route::put('usuarios/{id}/restore',  [App\Http\Controllers\UserController::class, 'restore'])->name('restore');
});

// RUTAS OFICINAS
Route::get('/honor-y-justicia', [App\Http\Controllers\issueController::class, 'index'])->name('honor');

Auth::routes(['register' => false]);

//Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');