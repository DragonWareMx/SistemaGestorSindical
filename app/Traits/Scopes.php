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

    /**
     * 
     */
    function scopeDataGridPlus($query, $request, $columns, $tableName, $rows = 10000){
        if($request->modo && $request->modo == 'client')
            return $query->take($rows)->get();
        
        return $query->when($request->column && $request->operator, function ($queryF) use ($request, $tableName) {
            return $queryF->getFilteredRows($request->column, $request->operator, $request->value, $tableName);
        })
        ->when($request->field && $request->sort, function ($queryF) use ($request) {
            if($request->field == 'usuario')
                return $queryF->orderBy('user_id', $request->sort);

            return $queryF->orderBy($request->field, $request->sort);
        })
        ->when($request->search, function ($queryF, $search) use ($request, $columns) {
            foreach ($columns as $id => $column) {
                $queryF->orHaving($column, 'LIKE', '%'.$search.'%');
            }
        })
        ->paginate($perPage = $request->pageSize ?? 100, $columns = $columns, $pageName = 'page',$request->page ?? 1);
    }
}