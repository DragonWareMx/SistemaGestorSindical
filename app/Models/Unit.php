<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use HasFactory;

    public function regime()
    {
        return $this->belongsTo(Regime::class);
    }

    public function employee()
    {
        return $this->hasMany(Employee::class);
    }

    use SoftDeletes;
}
