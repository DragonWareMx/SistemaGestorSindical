<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Regime extends Model
{
    use HasFactory;

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    use SoftDeletes;
}
