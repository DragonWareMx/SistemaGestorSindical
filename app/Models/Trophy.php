<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Scopes;

class Trophy extends Model
{
    use HasFactory, Scopes;

    public function employees()
    {
        return $this->belongsToMany(Employee::class,'employee_trophie','employee_id','trophie_id');
    }
}
