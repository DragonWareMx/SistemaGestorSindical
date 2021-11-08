<?php
namespace App\Traits;

trait Scopes
{
    function scopeGetFilteredRows($query, $column, $operator, $value, $table){
        if($column == 'id')
            $column = $table.'.id';

        switch ($operator) {
            //STRING
            case 'contains':
                if($value)
                    return $query->having($column, 'LIKE', '%' . $value . '%');
                else
                    return $query;
                break;
            case 'startsWith':
                if($value)
                    return $query->having($column, 'LIKE', $value . '%');
                else
                    return $query;
                break;
            case 'endsWith':
                if($value)
                    return $query->having($column, 'LIKE', '%' . $value);
                else
                    return $query;
                break;
            case 'equals':
                if($value)
                    return $query->having($column, '=', $value);
                else
                    return $query;
                break;
            case 'contains':
                if($value)
                    return $query->having($column, 'LIKE', '%' . $value . '%');
                else
                    return $query;
                break;
            
            //DATETIME/DATE
            case 'is':
                if($value){
                    if($value == 'true')
                        return $query->havingRaw($column." = TRUE");
                    else if($value == 'false')
                        return $query->havingRaw($column." = FALSE");
                    else
                        return $query->havingRaw("DATE(".$column.") = DATE('".$value."')");
                }
                else
                    return $query;
                break;
            case 'not':
                if($value)
                    return $query->havingRaw("DATE(".$column.") != DATE('".$value."')");
                else
                    return $query;
                break;
            case 'after':
                if($value)
                    return $query->havingRaw("DATE(".$column.") > DATE('".$value."')");
                else
                    return $query;
                break;
            case 'onOrAfter':
                if($value)
                    return $query->havingRaw("DATE(".$column.") >= DATE('".$value."')");
                else
                    return $query;
                break;
            case 'before':
                if($value)
                    return $query->havingRaw("DATE(".$column.") < DATE('".$value."')");
                else
                    return $query;
                break;
            case 'onOrBefore':
                if($value)
                    return $query->havingRaw("DATE(".$column.") <= DATE('".$value."')");
                else
                    return $query;
                break;
            
            //NUMBER
            case '=':
                if($value)
                    return $query->having($column, '=', $value);
                else
                    return $query;
                break;
            case '!=':
                if($value)
                    return $query->having($column, '!=', $value);
                else
                    return $query;
                break;
            case '>':
                if($value)
                    return $query->having($column, '>', $value);
                else
                    return $query;
                break;
            case '>=':
                if($value)
                    return $query->having($column, '>=', $value);
                else
                    return $query;
                break;
            case '<':
                if($value)
                    return $query->having($column, '<', $value);
                else
                    return $query;
                break;
            case '<=':
                if($value)
                    return $query->having($column, '<=', $value);
                else
                    return $query;
                break;

            //GENERAL
            case 'isEmpty':
                return $query->havingRaw($column.' IS NULL')
                ->orHavingRaw($column." = ''");
                break;
            case 'isNotEmpty':
                return $query->havingRaw($column.' IS NOT NULL');
                break;
            default:
                return $query;
                break;
        }
    }
}