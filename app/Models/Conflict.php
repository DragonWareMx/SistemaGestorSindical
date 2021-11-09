<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Scopes;

class Conflict extends Model
{
    use HasFactory, Scopes;

    public function employees()
    {
        return $this->belongsToMany(Employee::class)->withPivot(['sancion','inicio_sancion','termino_sancion','castigado','resolutivo']);
    }
}
