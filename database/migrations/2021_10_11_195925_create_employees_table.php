<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();

            $table->string('matricula', 10)->unique();

            //datos personales
            $table->string('nombre');
            $table->string('apellido_p');
            $table->string('apellido_m')->nullable();

            $table->date('fecha_nac');
            $table->enum('sexo', ['hombre', 'mujer', 'otro']);
            $table->date('antiguedad');

            //direccion
            $table->string('calle', 100)->nullable();
            $table->string('num_ext', 10)->nullable();
            $table->string('num_int', 10)->nullable();
            $table->string('colonia', 100)->nullable();
            $table->string('ciudad', 60)->nullable();
            $table->string('estado', 50)->nullable();
            $table->string('cp', 9)->nullable();
            $table->string('tel', 25)->nullable();

            // Empleado aceptado o no por la tabla admision y cambios
            $table->enum('estatus', ['Aceptado', 'Rechazado', 'Pendiente'])->nullable();

            //llaves foraneas
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            $table->unsignedBigInteger('category_id')->nullable();
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');

            $table->unsignedBigInteger('unit_id')->nullable();
            $table->foreign('unit_id')->references('id')->on('units')->onDelete('set null');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');
    }
}