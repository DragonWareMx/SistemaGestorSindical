<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Trophy extends Model
{
    use HasFactory;

    public function employees()
    {
        return $this->belongsToMany(Employee::class,'employee_trophies','employee_id','trophie_id');
    }
}
