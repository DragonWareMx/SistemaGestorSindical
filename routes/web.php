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
    Route::get('/comite', [App\Http\Controllers\UserController::class, 'index'])->name('index');
    Route::get('/comite/crear', [App\Http\Controllers\UserController::class, 'create'])->name('create');
    Route::post('/comite', [App\Http\Controllers\UserController::class, 'store'])->name('store');
    Route::get('/comite/{id}/editar', [App\Http\Controllers\UserController::class, 'edit'])->name('edit');
    Route::patch('/comite/{id}', [App\Http\Controllers\UserController::class, 'update'])->name('update');
    Route::delete('comite/{id}',  [App\Http\Controllers\UserController::class, 'destroy'])->name('delete');
    Route::put('comite/{id}/restore',  [App\Http\Controllers\UserController::class, 'restore'])->name('restore');
});

//Empleados
Route::name('employees.')->middleware('auth')->group(function () {
    Route::get('/empleados', [App\Http\Controllers\EmployeeController::class, 'index'])->name('index');
    Route::get('/empleados/crear', [App\Http\Controllers\EmployeeController::class, 'create'])->name('create');
    Route::post('/empleados', [App\Http\Controllers\EmployeeController::class, 'store'])->name('store');
    Route::get('/empleados/{id}/editar', [App\Http\Controllers\EmployeeController::class, 'edit'])->name('edit');
    Route::patch('/empleados/{id}', [App\Http\Controllers\EmployeeController::class, 'update'])->name('update');
    Route::delete('empleados/{id}',  [App\Http\Controllers\EmployeeController::class, 'destroy'])->name('delete');
    Route::put('empleados/{id}/restore',  [App\Http\Controllers\EmployeeController::class, 'restore'])->name('restore');
});

//Bitacora
Route::name('logs.')->middleware('admin')->group(function () {
    Route::get('/bitacora', [App\Http\Controllers\LogController::class, 'index'])->name('index');
    // Route::get('/bitacora/crear', [App\Http\Controllers\EmployeeController::class, 'create'])->name('create');
    // Route::post('/bitacora', [App\Http\Controllers\EmployeeController::class, 'store'])->name('store');
    // Route::get('/bitacora/{id}/editar', [App\Http\Controllers\EmployeeController::class, 'edit'])->name('edit');
    // Route::patch('/bitacora/{id}', [App\Http\Controllers\EmployeeController::class, 'update'])->name('update');
    // Route::delete('bitacora/{id}',  [App\Http\Controllers\EmployeeController::class, 'destroy'])->name('delete');
    // Route::put('bitacora/{id}/restore',  [App\Http\Controllers\EmployeeController::class, 'restore'])->name('restore');
});

// RUTAS OFICINAS
Route::get('/honor-y-justicia', [App\Http\Controllers\IssueController::class, 'index'])->name('honor')->middleware('hyj');
Route::get('/honor-y-justicia/ver/{id}', [App\Http\Controllers\IssueController::class, 'issue'])->name('honor.issue')->middleware('hyj');;
Route::post('/honor-y-justicia/ver/{id}', [App\Http\Controllers\IssueController::class, 'update'])->name('honor.update')->middleware('hyj');
Route::get('/honor-y-justicia/crear', [App\Http\Controllers\IssueController::class, 'create'])->name('honor.create')->middleware('hyj');;
Route::post('/honor-y-justicia/crear', [App\Http\Controllers\IssueController::class, 'store'])->name('honor.store')->middleware('hyj');;
Route::delete('/honor-y-justicia/delete/{uuid}', [App\Http\Controllers\IssueController::class, 'destroy'])->name('honor.delete')->middleware('hyj');;
//Conflictos
Route::get('/conflictos', [App\Http\Controllers\ConflictController::class, 'index'])->name('conflicts')->middleware('conflict');
Route::get('/conflictos/ver/{id}', [App\Http\Controllers\ConflictController::class, 'conflict'])->name('conflicts.conflict')->middleware('conflict');
Route::post('/conflictos/ver/{id}', [App\Http\Controllers\ConflictController::class, 'update'])->name('conflicts.update')->middleware('conflict');
Route::get('/conflictos/crear', [App\Http\Controllers\ConflictController::class, 'create'])->name('conflicts.create')->middleware('conflict');
Route::post('/conflictos/store', [App\Http\Controllers\ConflictController::class, 'store'])->name('conflicts.store')->middleware('conflict');
Route::delete('/conflictos/delete/{uuid}', [App\Http\Controllers\ConflictController::class, 'destroy'])->name('conflicts.delete')->middleware('conflict');
//Secretaria del trabajo
Route::get('/secretaria-del-trabajo', [App\Http\Controllers\ConflictController::class, 'secretariaTrabajo'])->name('secretariaTrabajo')->middleware('st');
Route::get('/secretaria-del-trabajo/ver/{id}', [App\Http\Controllers\ConflictController::class, 'secretariaTrabajoConflict'])->name('secretariaTrabajo.conflict')->middleware('st');
Route::get('/secretaria-del-trabajo/crear', [App\Http\Controllers\ConflictController::class, 'secretariaTrabajoCreate'])->name('secretariaTrabajo.create')->middleware('st');
Route::post('/secretaria-del-trabajo/crear', [App\Http\Controllers\ConflictController::class, 'secretariaTrabajoStore'])->name('secretariaTrabajo.store')->middleware('st');
Route::delete('/secretaria-del-trabajo/delete/{uuid}', [App\Http\Controllers\ConflictController::class, 'destroyTrabajo'])->name('secretariaTrabajo.delete')->middleware('st');
// Secreteria del interior
Route::get('/secretaria-del-interior', [App\Http\Controllers\ElectionController::class, 'index'])->name('secretariaInterior')->middleware('si');
Route::get('/secretaria-del-interior/ver/{id}', [App\Http\Controllers\ElectionController::class, 'secretariaInteriorElection'])->name('secretariaInterior.election')->middleware('si');
Route::post('/secretaria-del-interior/ver/{id}', [App\Http\Controllers\ElectionController::class, 'update'])->name('secretariaInterior.update')->middleware('si');
Route::get('/secretaria-del-interior/crear', [App\Http\Controllers\ElectionController::class, 'create'])->name('secretariaInterior.create')->middleware('si');
Route::post('/secretaria-del-interior/crear', [App\Http\Controllers\ElectionController::class, 'store'])->name('secretariaInterior.store')->middleware('si');
Route::post('/secretaria-del-interior/votacion/crear', [App\Http\Controllers\ElectionController::class, 'votacion'])->name('secretariaInterior.votacion')->middleware('si');
Route::delete('/secretaria-del-interior/delete/{uuid}', [App\Http\Controllers\ElectionController::class, 'destroy'])->name('secretariaInterior.delete')->middleware('si');

//Admisi??n y cambios
Route::get('/admision-y-cambios', [App\Http\Controllers\EmployeeController::class, 'admisionCambios'])->name('admisionCambios')->middleware('ac');
Route::get('/admision-y-cambios/ver/{id}', [App\Http\Controllers\EmployeeController::class, 'admisionCambiosRelative'])->name('admisionCambiosRelative')->middleware('ac');
Route::post('/admision-y-cambios/ver/{id}', [App\Http\Controllers\EmployeeController::class, 'admisionCambiosRelativeStore'])->name('admisionCambiosRelativeStore')->middleware('ac');
Route::get('/admision-y-cambios/crear', [App\Http\Controllers\EmployeeController::class, 'admisionCambiosCreate'])->name('admisionCambiosCreate')->middleware('ac');
Route::post('/admision-y-cambios/crear', [App\Http\Controllers\EmployeeController::class, 'admisionCambiosStore'])->name('admisionCambiosStore')->middleware('ac');
Route::get('/admision-y-cambios/crear-familiar', [App\Http\Controllers\EmployeeController::class, 'admisionCambiosNewFamiliar'])->name('admisionCambiosNewFamiliar')->middleware('ac');
Route::post('/admision-y-cambios/crear-familiar', [App\Http\Controllers\EmployeeController::class, 'admisionCambiosStoreFamiliar'])->name('admisionCambiosStoreFamiliar')->middleware('ac');
Route::delete('/admision-y-cambios/delete/{id}', [App\Http\Controllers\EmployeeController::class, 'admisionCambiosDestroy'])->name('admisionCambiosDestroy')->middleware('ac');

//Acci??n Femenil
Route::get('/accion-femenil', [App\Http\Controllers\TrophyController::class, 'index'])->name('accionFemenil')->middleware('af');
Route::get('/accion-femenil/ver/{id}', [App\Http\Controllers\TrophyController::class, 'trophy'])->name('accionFemenil.trophy')->middleware('af');
Route::post('/accion-femenil/ver/{id}', [App\Http\Controllers\TrophyController::class, 'update'])->name('accionFemenil.update')->middleware('af');
Route::get('/accion-femenil/crear', [App\Http\Controllers\TrophyController::class, 'create'])->name('accionFemenil.create')->middleware('af');
Route::post('/accion-femenil/trophie/crear', [App\Http\Controllers\TrophyController::class, 'trophie'])->name('trophie.create')->middleware('af');
Route::post('/accion-femenil/store', [App\Http\Controllers\TrophyController::class, 'store'])->name('accionFemenil.store')->middleware('af');
Route::delete('/accion-femenil/delete/{uuid}', [App\Http\Controllers\TrophyController::class, 'destroy'])->name('accionFemenil.destroy')->middleware('af');


Auth::routes(['register' => false]);

//Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

//--------PERFIL--------
Route::get('/perfil', [App\Http\Controllers\PerfilController::class, 'index'])->name('perfil');
// Route::get('/perfil/publico/{id}', [App\Http\Controllers\PerfilController::class, 'verPerfil'])->name('perfil.public');
Route::get('/perfil/configuracion', [App\Http\Controllers\PerfilController::class, 'edit'])->name('perfil.edit');
Route::patch('/perfil/configuracion', [App\Http\Controllers\PerfilController::class, 'update'])->name('perfil.update');