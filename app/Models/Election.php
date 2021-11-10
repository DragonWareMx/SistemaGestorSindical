<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Scopes;

class Election extends Model
{
    use HasFactory, Scopes;

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'election_employee', 'election_id', 'employee_id')->withPivot(['num_oficio','fecha_voto']);
    }
}