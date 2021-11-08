import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia'
import {
    DataGrid,
    esES,

    //ToolBar
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector,

    //Pagination
    useGridApiContext,
    useGridState,

    //No Rows Overlay
    GridOverlay
} from '@mui/x-data-grid';

//Componentes
import Grid from '@mui/material/Grid';
//  ToolBar
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
//  Pagination
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

//  Loading Overlay
import LinearProgress from '@mui/material/LinearProgress';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';

//Iconos
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
/**
 * METODO PARA FILTRO
 * 
 * function queryFilter($query, $column, $operator, $value, $table){
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
 * Ejemplo de columna para MUI 5:
 * 
 * const columns = [
 *  {
 *      field: Nombre del campo,
 *      headerName: The title of the column rendered in the column header cell.
 *      description: The description of the column rendered as tooltip if the column header name is not fully displayed.
 *      width: By default, the columns have a width of 100px.
 *      minWidth: By default, the columns have a minimum width of 50px. 
 *      flex: No usar si se usa width.
 *      hide: Set the column definition attribute hide to true to hide the column.
 *      resizable: By default, DataGridPro allows all columns to be resized by dragging the right portion of the column separator.
 *      valueGetter: Sometimes a column might not have a corresponding value, or you might want to render a combination of different fields.
 *      sortComparator: You need to set a sortComparator for the column sorting to work when setting the valueGetter attribute.
 *      valueSetter: The value setter is to be used when editing rows and it is the counterpart of the value getter. It allows to customize how the entered value is stored in the row.
 *      valueFormatter: The value formatter allows you to convert the value before displaying it. Common use cases include converting a JavaScript Date object to a date string or a Number into a formatted number (e.g. "1,000.50").
 *      valueParser: The value parser allows you to convert the user-entered value to another one used for filtering or editing. Common use cases include parsing date strings to JavaScript Date objects or formatted numbers (e.g. "1,000.50") into Number. It can be understood as the inverse of valueFormatter.
 *      renderCell: By default, the grid render the value as a string in the cell. The renderCell method of the column definitions is similar to valueFormatter. However, it trades to be able to only render in a cell in exchange for allowing to return a React node (instead of a string).
 *      renderEditCell: For the "edit mode", set the renderEditCell function to customize the edit component.
 *      renderHeader: You can customize the look of each header with the renderHeader method. It takes precedence over the headerName property.
 *      type: 'string' (default), 'number', 'date', 'dateTime', 'boolean', 'singleSelect', 'actions'
 *  }
 * ]
 * 
 * ------------------SI SE UTILIZA MODO SERVIDOR------------------
 * 
 * Todas las columnas seleccionadas deben tener un nombre unico. Si se hace join con una tabla que tiene dos columnas con el mismo nombre
 * (ejemplo: user.correo y person.correo) al hacer el select se tiene que aplicar un alias para evitar ambiguedades (ejemplo: user.correo AS correo_user)
 * 
 * Para que los FILTROS funcionen necesitas agregar la siguiente consulta:
 * 
 * ->when($request->column && $request->operator, function ($query) use ($request) {
        return $query->getFilteredRows($request->column, $request->operator, $request->value, 'nombre_de_la_tabla');
    })
    Para que el SORT funcione es necesario agregar la siguiente consulta:
    
    ->when($request->field && $request->sort, function ($query) use ($request) {
        return $query->orderBy($request->field, $request->sort);
    })
    IMPORTANTE: Cuando se usa filtro y sort del lado del servidor hay que tener cuidado con las columnas que no estan
    en la base de datos, por ejemplo una columna calculada en el lado del cliente. Si tenemos una columna asi puede
    crashear el programa cuando intentamos hacer un sort en el lado del servidor o se quiere aplicar un filtro a esa
    columna. Hay dos maneras de arreglar esto:
    1.- Tomar en cuenta esa columna en el servidor para que sea ignorada.
    2.- Deshabilitar el filtrado y el sort en las columnas extras del DataGrid.
    Para que la BUSQUEDA funcione es necesario tener un arreglo con los nombres de todas las columnas (con sus alias)
    y agregar la siguiente consulta:
    $columns = ["users.id", "correo", "tel", "socio", "identificacion", "prioridad", "fecha_registro", "foto", "direccion", "nombre"];
    ->when($request->search, function ($query, $search) use ($request, $columns) {
        foreach ($columns as $id => $column) {
            $query->orHaving($column, 'LIKE', '%'.$search.'%');
        }
    })
    IMPORTANTE: Noten que la columna id si tiene especificada su tabla, si la consulta tiene joins es necesario hacer esto
    para evitar errores de ambiguedad.
    Para que la PAGINACION funcione es necesario agregar la siguiente linea:
    ->paginate($perPage = $request->pageSize ?? 100, $columns = ['*'], $pageName = 'nombre_de_la_tabla', $request->page ?? 1);
 */

/**
 * 
 * @param {*} rowsJson - Son las consultas que llegan del servidor, en forma de json.
 * @param {*} columns - Son las columnas de la tabla en forma de json, con su configuracion.
 * @param {*} mode - (server o client) Nos indica si las funciones de la tabla como la paginación se hará en el lado del cliente o en el lado del servidor.
 * @param {*} tableName - SOLO ES NECESARIO EN MODO SERVIDOR O CON LAZYLOAD. Es el nombre de la tabla en la base de datos, por ejemplo: users.
 * @param {*} lazyLoad - SOLO ES NECESARIO EN MODO SERVIDOR(true o False) Si es true la tabla se mostrará vacia y esperará al servidor para recibir los datos.
 */
const DataGridPlus = ({rowsJson, columns, tableName, extra, lazyLoad, mode, disableSelectionOnClick, checkboxSelection}) => {
    const [rows, setRows] = useState(
        lazyLoad ?
            []
        :
            mode && mode == 'server' ?
                rowsJson ?
                    rowsJson.data
                :
                 []
            :
                rowsJson
    );

    //*****Search*****
    const [searchText, setSearchText] = useState('');
    
    const requestSearch = (searchValue) => {
        setSearchText(searchValue);

        //Server-Side
        if(mode && mode == 'server'){
            Inertia.reload({
                only: [tableName],
                data: {
                    search: searchValue,
                },
                replace: true
            })
            setLoading(true)

            return
        }

        //Client-Side
        else{
            if(!rowsJson || rowsJson.length == 0)
                return
            
            const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
            const filteredRows = rowsJson.filter((row) => {
                return Object.keys(row).some((field) => {
                    return searchRegex.test(row[field] ? row[field].toString() : "");
                });
            });
            setRows(filteredRows);
        }
    };

    //cada vez que cambia el rowsJson significa que ya termino de cargar los datos
    useEffect(() => {
        if(mode && mode == 'server'){
            if(noRowsLoading && rowsJson){
                setNoRowsLoading(false)
                setLoading(false)
                setRows(rowsJson.data);
            }
            else if(!noRowsLoading && rowsJson){
                setLoading(false)
                setRows(rowsJson.data);
            }
        }
        else{
            if(noRowsLoading && rowsJson){
                setNoRowsLoading(false)
                setLoading(false)
                setRows(rowsJson)
            }
            else if(!noRowsLoading){
                setLoading(false)
                setRows(rowsJson);
            }
        }
    }, [rowsJson]);

    //*****Loading Overlay*****
    const [loading, setLoading] = useState(lazyLoad ?? false);
    const [noRowsLoading, setNoRowsLoading] = useState(lazyLoad ?? false)

    //*****Pagination*****
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);

    const loadPagedRowsServerSide = () => {
        Inertia.reload({
            only: [tableName],
            data: {
                page: page + 1,
                pageSize: pageSize
            },
            replace: true
        })
        setLoading(true)
    }

    useEffect(() => {
        if(mode && mode == 'server'){
            loadPagedRowsServerSide()
        }
    }, [page]);

    useEffect(() => {
        if(page == 0){
            if(mode && mode == 'server'){
                loadPagedRowsServerSide()
            }
        }
        else
            setPage(0)
    }, [pageSize]);

    //*****Filters*****
    const [filter, setFilter] = useState({});

    const onFilterChange = React.useCallback((filterModel) => {
        setFilter(filterModel.items[0]);
    }, []);

    useEffect(() => {
        if(filter && mode && mode == 'server'){
            Inertia.reload({
                only: [tableName],
                data: {
                    column: filter.columnField,
                    operator: filter.operatorValue,
                    value: filter.value
                },
                replace: true
            })
            setLoading(true)
        }
    }, [filter]);

    //*****Selection*****
    const [selectionModel, setSelectionModel] = useState([]);
    const prevSelectionModel = React.useRef(selectionModel);

    //Sorting
    const [sortModel, setSortModel] = useState();

    const handleSortModelChange = (newModel) => {
        setSortModel(newModel);
    };

    useEffect(() => {
        if(sortModel && mode && mode == 'server'){
            Inertia.reload({
                only: [tableName],
                data: sortModel[0] ?? {field: null, sort: null},
                replace: true
            })
            setLoading(true)
        }
    }, [sortModel]);

    useEffect(() => {
        if(lazyLoad)
            Inertia.reload({
                only: [tableName],
                replace: true
            })
    }, []);
    
    return (
        <ThemeProvider theme={theme}>
            <div style={{ height: 600, width: '100%' }}>
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}

                                components={{
                                    Toolbar: Toolbar,
                                    Pagination: PaginationDataGrid,
                                    NoRowsOverlay: NoRowsOverlay,
                                    LoadingOverlay: LoadingOverlay,
                                }}
                                componentsProps={{
                                    toolbar: {
                                        value: searchText,
                                        onChange: (event) => requestSearch(event.target.value),
                                        clearSearch: () => requestSearch(''),
                                        extra: extra
                                    },
                                    loadingOverlay: {
                                        icon: noRowsLoading
                                    },
                                }}

                                checkboxSelection={checkboxSelection ?? false}
                                disableSelectionOnClick={disableSelectionOnClick ?? true}

                                onPageChange={(newPage) => setPage(newPage)}
                                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                pagination
                                paginationMode={mode ?? 'client'}      
                                rowCount={
                                    mode && mode == 'server' ?
                                        rowsJson ?
                                            rowsJson.total
                                        :
                                            0
                                    :
                                        rows.length
                                }

                                filterMode={mode ?? 'client'}
                                onFilterModelChange={onFilterChange}

                                sortingMode={mode ?? 'client'}
                                sortModel={sortModel}
                                onSortModelChange={handleSortModelChange}
                                
                                loading={loading}
                            />
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}

//****************************** ToolBar ******************************

function Toolbar(props) {
    const classes = useStyles();

    return (
        <Grid container className={classes.toolBarRoot}>
            <Grid item xs={12} md style={{marginBottom: 10, marginLeft: 5, marginTop: 7, marginRight: 7}}>
                <TextField
                    value={props.value}
                    onChange={props.onChange}
                    placeholder="Buscar..."
                    className={classes.textField}
                    InputProps={{
                    startAdornment: <SearchIcon fontSize="small" />,
                    endAdornment: (
                        <IconButton
                        title="Clear"
                        aria-label="Clear"
                        size="small"
                        style={{ visibility: props.value ? 'visible' : 'hidden' }}
                        onClick={props.clearSearch}
                        >
                        <ClearIcon fontSize="small" />
                        </IconButton>
                    ),
                    }}
                />
            </Grid>

            <Grid
                container
                style={{marginBottom: 10, marginLeft: 5, marginTop: 7, marginRight: 10}}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Grid item xs="auto">
                    <GridToolbarColumnsButton />
                </Grid>
                <Grid item xs="auto" container>
                    <GridToolbarFilterButton />
                </Grid>
                <Grid item xs="auto" container>
                    <GridToolbarDensitySelector />
                </Grid>
                <Grid item xs="auto" container>
                    <GridToolbarExport />
                </Grid>
                
                {props.extra}
            </Grid>
        </Grid>
    );
}

Toolbar.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    extra: PropTypes.object
};

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

//****************************** Pagination ******************************
function PaginationDataGrid() {
    const apiRef = useGridApiContext();
    const [state] = useGridState(apiRef);

    const [rowsPerPage, setRowsPerPage] = useState(100);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    useEffect(() => {
        apiRef.current.setPage(0);
        apiRef.current.setPageSize(rowsPerPage)
    }, [rowsPerPage]);
  
    return (
    <>
    <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
    >
        <Grid item xs={12} md="auto" style={{paddingLeft: 10}}>
            Total de resultados: {state.pagination.rowCount}
        </Grid>
        <Grid 
            item 
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            xs={12}
            md
            style={{paddingRight: 10}}
        >
            <Grid item>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 10 }}>
                    <Grid container alignItems="center">
                        <Grid item style={{marginRight: 5}}>
                            Filas por página:
                        </Grid>
                        <Grid item>
                            <Select
                                id="rowsPerPage"
                                value={rowsPerPage}
                                onChange={handleChangeRowsPerPage}
                            >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                </FormControl>
            </Grid>
                <Grid item>
                    <Pagination
                        color="primary"
                        page={state.pagination.page + 1}
                        count={state.pagination.pageCount}
                        // @ts-expect-error
                        renderItem={(props2) => <PaginationItem {...props2} />}
                        onChange={(event, value) => apiRef.current.setPage(value - 1)}
                        style={{backgroundColor: 'white', '-webkit-box-shadow': "none", "box-shadow": "none"}}
                    />
                </Grid>
        </Grid>
    </Grid>
    </>
    );
}

//****************************** NoRowsOverlay ******************************

function NoRowsOverlay() {
    const classes = useStyles();
  
    return (
        <GridOverlay className={classes.overlayRoot}>
            <a target="_blank" href="https://storyset.com/search">
                <img width="200" alt="https://storyset.com/search" src="/img/Story Set/personal-files-animate.svg"/>
            </a>
            <div className={classes.label}><b>Sin resultados</b></div>
        </GridOverlay>
    );
}

//****************************** LoadingOverlay ******************************
/**
 * 
 * @param {*} props 
 * icon (Boolean): Si es True se muestra el icono de búsqueda. Esto se puede mostrar cuando
 * no haya ningun row en la tabla.
 * @returns 
 */
function LoadingOverlay(props) {
    const classes = useStyles();
    return (
      <GridOverlay className={classes.overlayRoot}>
        <div style={{ position: 'absolute', top: 0, width: '100%' }}>
          <LinearProgress />
        </div>
        {props.icon &&
            <>
                <a target="_blank" href="https://storyset.com/search">
                    <img width="200" alt="https://storyset.com/search" src="/img/Story Set/fast-loading-animate.svg"/>
                </a>
                <div className={classes.label}><b>Cargando datos...</b></div>
            </>
        }
      </GridOverlay>
    );
}

const theme = createTheme(
    {
        palette: {
            primary: { main: '#134E39' },
        },
    },
    esES,
);
const useStyles = makeStyles(
  (theme) =>
    createStyles({
    //ToolBar
      toolBarRoot: {
        padding: theme.spacing(0.5, 0.5, 0),
        marginRight: 15,
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      },
      textField: {
        [theme.breakpoints.down('xs')]: {
          width: '100%',
        },
        width: '100%',
        
        '& .MuiSvgIcon-root': {
          marginRight: theme.spacing(0.5),
        },
        '& .MuiInput-underline:before': {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },

        background: 'transparent',
        '& label.Mui-focused': {
            color: '#8D9EAB',
        },
        '& label': {
            color: '#8D9EAB',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#8D9EAB',
        },
        '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            '& fieldset': {
                border: ' 0.5px solid #919EAB',
            },
            '&:hover fieldset': {
                border: ' 0.5px solid #919EAB',
            },
            '&.Mui-focused fieldset': {
                border: ' 0.5px solid #919EAB',
            },
        },
    },

    //No Rows Overlay
    overlayRoot: {
        flexDirection: 'column',
        '& .ant-empty-img-1': {
          fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
        },
        '& .ant-empty-img-2': {
          fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
        },
        '& .ant-empty-img-3': {
          fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
        },
        '& .ant-empty-img-4': {
          fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
        },
        '& .ant-empty-img-5': {
          fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
          fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
        },
      },
      label: {
        marginTop: theme.spacing(1),
      },
    }),
  { theme },
);

export default DataGridPlus