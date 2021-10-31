<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConflictEmployeeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('conflict_employee', function (Blueprint $table) {
            $table->id();
            $table->text('resolutivo');
            $table->boolean('castigado')->default(false);
            $table->date('inicio_sancion')->nullable();
            $table->date('termino_sancion')->nullable();
            $table->text('sancion')->nullable();

            $table->timestamps();

            $table->unsignedBigInteger('employee_id');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');

            $table->unsignedBigInteger('conflict_id');
            $table->foreign('conflict_id')->references('id')->on('conflicts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('conflict_employee');
    }
}
