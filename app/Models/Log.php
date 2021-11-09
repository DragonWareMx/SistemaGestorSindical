<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Scopes;

class Log extends Model
{
    use HasFactory, Scopes;

    public function user(){
        return $this->belongsTo('App\Models\User');
    }
    
    use SoftDeletes;
}
