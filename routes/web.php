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

//Usuarios
Route::name('employees.')->middleware('auth')->group(function () {
    Route::get('/empleados', [App\Http\Controllers\EmployeeController::class, 'index'])->name('index');
    Route::get('/empleados/crear', [App\Http\Controllers\EmployeeController::class, 'create'])->name('create');
    Route::post('/empleados', [App\Http\Controllers\EmployeeController::class, 'store'])->name('store');
    Route::get('/empleados/{id}/editar', [App\Http\Controllers\EmployeeController::class, 'edit'])->name('edit');
    Route::patch('/empleados/{id}', [App\Http\Controllers\EmployeeController::class, 'update'])->name('update');
    Route::delete('empleados/{id}',  [App\Http\Controllers\EmployeeController::class, 'destroy'])->name('delete');
    Route::put('empleados/{id}/restore',  [App\Http\Controllers\EmployeeController::class, 'restore'])->name('restore');
});

// RUTAS OFICINAS
Route::get('/honor-y-justicia', [App\Http\Controllers\issueController::class, 'index'])->name('honor');
Route::get('/honor-y-justicia/{id}', [App\Http\Controllers\issueController::class, 'issue'])->name('honor.issue');
//Conflictos
Route::get('/conflictos', [App\Http\Controllers\conflictController::class, 'index'])->name('conflicts');
Route::get('/conflictos/{id}', [App\Http\Controllers\conflictController::class, 'conflict'])->name('conflicts.conflict');
//Secretaria del Interior
Route::get('/secretaria-del-interior', [App\Http\Controllers\conflictController::class, 'secretariaInterior'])->name('secretariaInterior');
Route::get('/secretaria-del-interior/{id}', [App\Http\Controllers\conflictController::class, 'secretariaInteriorConflict'])->name('secretariaInterior.conflict');

Auth::routes(['register' => false]);

//Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

//--------PERFIL--------
Route::get('/perfil', [App\Http\Controllers\PerfilController::class, 'index'])->name('perfil');
// Route::get('/perfil/publico/{id}', [App\Http\Controllers\PerfilController::class, 'verPerfil'])->name('perfil.public');
Route::get('/perfil/configuracion', [App\Http\Controllers\PerfilController::class, 'edit'])->name('perfil.edit');
Route::patch('/perfil/configuracion', [App\Http\Controllers\PerfilController::class, 'update'])->name('perfil.update');