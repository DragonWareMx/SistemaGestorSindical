<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Scopes;

class Employee extends Model
{
    use HasFactory, SoftDeletes, Scopes;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_relative', 'relative_id', 'employee_id')
            ->withPivot('parentesco','ingreso_bolsa');
    }
    
    public function relatives()
    {
        return $this->belongsToMany(Employee::class, 'employee_relative', 'employee_id', 'relative_id')
            ->withPivot('parentesco','ingreso_bolsa');
    }
}
