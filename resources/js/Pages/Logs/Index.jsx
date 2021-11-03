import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import { Inertia } from '@inertiajs/inertia'
import route from 'ziggy-js';
import { InertiaLink } from '@inertiajs/inertia-react';
import { Container } from '@mui/material';
import Pagination from '@mui/material/Pagination';

//componentes
import Alertas from '../../components/common/Alertas';

//estilos
import '/css/usersStyle.css'
import '/css/users.css'

//buscador
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import {
  DataGrid,
  useGridApiContext,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarExport,
  useGridState,
  GridOverlay,
  esES
} from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';

import { ThemeProvider } from '@mui/material/styles';

const themeEs = createTheme(
    {
        palette: {
            primary: { main: '#134E39' },
        },
    },
    esES,
);

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
(theme) =>
    createStyles({
    root: {
        padding: theme.spacing(0.5, 0.5, 0),
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    textField: {
        [theme.breakpoints.down('xs')]: {
        width: '100%',
        },
        margin: theme.spacing(1, 0.5, 1.5),
        '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(0.5),
        },
        '& .MuiInput-underline:before': {
        borderBottom: `none`,
        },
        '& .MuiInput-underline:after': {
            borderBottom: "none",
        },
        '& .MuiInput-underline:focus': {
            borderBottom: "none",
        },
        '& .MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before' : {
            borderBottom: "0px solid white",
        },
        '& .css-1480iag-MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before' : {
            borderBottom: "0px solid white",
        },
    },
    rootOverlay: {
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
{ defaultTheme },
);

function CustomNoRowsOverlay() {
    const classes = useStyles();
  
    return (
      <GridOverlay className={classes.rootOverlay}>
        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <div className={classes.label}>Sin registros</div>
      </GridOverlay>
    );
  }
  
function QuickSearchToolbar(props) {
    const classes = useStyles();

    const [checked, setChecked] = React.useState(false);
    const [checkedU, setCheckedU] = React.useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);

        Inertia.reload({ data: { deleted: event.target.checked } })
    };

    const handleChangeU = (event) => {
        setCheckedU(event.target.checked);

        Inertia.reload({ data: { user: event.target.checked } })
    };

    return (
        <div className={classes.root}>
            <div>
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />

                {/* <Grid style={{ margin: 4 }} container>
                    {/* <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={handleChange}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="Ver eliminados"
                        />
                    </Grid> */}
                    {/* <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkedU}
                                    onChange={handleChangeU}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="Ver empleados con usuario"
                        />
                    </Grid> 
                </Grid> */}
            </div>
            <TextField
                variant="standard"
                value={props.value}
                onChange={props.onChange}
                placeholder="Buscar…"
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
        </div>
    );
}

QuickSearchToolbar.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

  
function CustomPagination() {
    const apiRef = useGridApiContext();
    const [state] = useGridState(apiRef);
    const classes = useStyles();
  
    console.log(state.rows.totalRowCount)
    return (
        <>
            <div style={{marginRight: "auto", marginLeft: "12px"}}>
                Total de registros: {state.rows.totalRowCount}
            </div>
            <div style={{ alignItems: "right"}}>

            <Pagination
                color="primary"
                count={state.pagination.pageCount}
                page={state.pagination.page + 1}
                onChange={(event, value) => apiRef.current.setPage(value - 1)}
                style={{backgroundColor: 'white', '-webkit-box-shadow': "none", "box-shadow": "none"}}
            />
            </div>
        </>
    );
}

function CustomLoadingOverlay() {
    const classes = useStyles();

    return (
      <GridOverlay className={classes.rootOverlay}>
        <div style={{ position: 'absolute', top: 0, width: '100%' }}>
          <LinearProgress />
        </div>

        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <div className={classes.label}>Cargando datos...</div>
      </GridOverlay>
    );
  }

function getFullName(params) {
    return `${params.value || ""} ${params.getValue(params.id, "apellido_p") || ""
        } ${params.getValue(params.id, "apellido_m") || ""}`
}


function getCategory(params) {
    return `${params.row.category ? params.row.category.nombre || "Sin categoría" : "Sin categoría"}`
}

function getUnit(params) {
    return `${params.row.unit ? params.row.unit.nombre || "Sin unidad" : "Sin unidad"}`
}

function getRegime(params) {
    return `${params.row.unit ? params.row.unit.regime ? params.row.unit.regime.nombre || "Sin régimen" : "Sin régimen" : "Sin régimen"}`
}

function getAddress(params) {
    if (!params.getValue(params.id, "calle"))
        return null
    return `${params.getValue(params.id, "calle") || ""} ${params.getValue(params.id, "num_ext") || ""} ${params.getValue(params.id, "num_int") || ""}, colonia ${params.getValue(params.id, "colonia") || ""}, código postal ${params.getValue(params.id, "cp") || ""}, ${params.getValue(params.id, "ciudad") || ""}, ${params.getValue(params.id, "estado") || ""}`
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
        field: 'foto',
        headerName: 'FOTO',
        sortable: false,
        filterable: false,
        width: 70,
        renderCell: (params) => {
            return (
                <div>
                    <img src={params.value ? "/storage/fotos_perfil/" + params.value : "/img/avatar1.png"} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", margin: 'auto' }} />
                </div>
            )
        },
        disableExport: true
    },
    { field: 'email', headerName: 'CORREO', width: 200 },
    { field: 'matricula', headerName: 'MATRICULA', width: 120 },
    {
        field: 'nombre',
        headerName: 'NOMBRE',
        editable: false,
        disableColumnSelector: false,
        width: 200,
        valueGetter: getFullName,
        sortComparator: (v1, v2, cellParams1, cellParams2) =>
            getFullName(cellParams1).localeCompare(getFullName(cellParams2)),
    },
    // {
    //     field: 'edad',
    //     headerName: 'EDAD',
    //     editable: false,
    //     valueGetter: (params) => {
    //         return getAge(params.getValue(params.id, "fecha_nac"))
    //     },
    //     width: 100,
    // },
    // {
    //     field: 'fecha_nac',
    //     headerName: 'FECHA NACIMIENTO',
    //     editable: false,
    //     width: 170,
    //     valueFormatter: (params) => {
    //         return `${params.value}`;
    //     },
    // },
    // {
    //     field: 'sexo',
    //     headerName: 'SEXO',
    //     editable: false,
    //     width: 100,
    //     valueGetter: (params) => {
    //         if (params.value == 'h') return "hombre"
    //         else if (params.value == 'm') return "mujer"
    //         else return "otro"
    //     },
    // },
    {
        field: 'descripcion',
        headerName: 'DESCRIPCIÓN',
        width: 500,
    },
    {
        field: 'categoria',
        headerName: 'CATEGORÍA',
        width: 120,
    },
    // {
    //     field: 'category',
    //     headerName: 'CATEGORÍA',
    //     width: 120,
    //     valueGetter: getCategory,
    //     sortComparator: (v1, v2, cellParams1, cellParams2) =>
    //         getAddress(cellParams1).localeCompare(getAddress(cellParams2)),
    // },
    // {
    //     field: 'unit',
    //     headerName: 'UNIDAD',
    //     width: 250,
    //     valueGetter: getUnit,
    //     sortComparator: (v1, v2, cellParams1, cellParams2) =>
    //         getAddress(cellParams1).localeCompare(getAddress(cellParams2)),
    // },
    // {
    //     field: 'regime',
    //     headerName: 'RÉGIMEN',
    //     width: 120,
    //     valueGetter: getRegime,
    //     sortComparator: (v1, v2, cellParams1, cellParams2) =>
    //         getAddress(cellParams1).localeCompare(getAddress(cellParams2)),
    // },
    // {
    //     field: 'tel',
    //     headerName: 'TELÉFONO',
    //     width: 120,
    //     valueFormatter: (params) => {
    //         return params.value ?? 'Sin teléfono'
    //     }
    // },
    // {
    //     field: 'direccion',
    //     headerName: 'DIRECCIÓN',
    //     width: 700,
    //     valueGetter: getAddress,
    //     sortComparator: (v1, v2, cellParams1, cellParams2) =>
    //         getAddress(cellParams1).localeCompare(getAddress(cellParams2)),
    //     valueFormatter: (params) => {
    //         return params.value ?? 'Sin dirección registrada'
    //     }
    // },
    // {
    //     field: 'usuario',
    //     headerName: 'USUARIO',
    //     width: 120,
    //     valueGetter: (params) => {
    //         if (params.row.user)
    //             return "Si"
    //         else
    //             return "No"
    //     },
    //     sortComparator: (v1, v2, cellParams1, cellParams2) =>
    //         getAddress(cellParams1).localeCompare(getAddress(cellParams2)),
    //     valueFormatter: (params) => {
    //         return params.value
    //     }
    // },
];

const Index = ({ logs, exists }) => {
    const [searchText, setSearchText] = React.useState('');
    const [rows, setRows] = React.useState(logs);
    const [loading, setLoading] = React.useState(true);

    const requestSearch = (searchValue) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = logs.filter((row) => {
            return Object.keys(row).some((field) => {
                return searchRegex.test(row[field] ? row[field].toString() : "");
            });
        });
        setRows(filteredRows);
    };

    React.useEffect(() => {
        setRows(logs);
    }, [logs]);

    useEffect(() => {
        if(exists && !logs){
            Inertia.reload({only: ['logs']})
        }
        else if(loading && exists && logs){
            setLoading(false)
        }
        else if(!exists){
            setLoading(false)
            console.log('sin datos')
        }
        console.log("cargo la pagina")
    });

    return (
        <>
            <div className="row">
                <Container>
                    <div className="col contenedor s12">
                        <div className="card darken-1 cardUsers">
                            {/* <InertiaLink className="btn-floating btn-large waves-effect waves-light green-sind button-addUser" href={route('logs.create')}><i className="material-icons">add</i></InertiaLink> */}
                            <div className="card-content">
                                <span className="card-title">Empleados</span>
                                <Alertas />

                                <div style={{ height: 500, width: '100%' }}>
                                    <ThemeProvider theme={themeEs}>
                                    <DataGrid
                                        pagination
                                        components={{
                                            Toolbar: QuickSearchToolbar,
                                            Pagination: CustomPagination,
                                            LoadingOverlay: CustomLoadingOverlay,
                                            NoRowsOverlay: CustomNoRowsOverlay,
                                        }}
                                        pageSize={100}
                                        rowsPerPageOptions={[100, 50, 20, 10]}
                                        rows={rows ?? []}
                                        columns={columns}
                                        componentsProps={{
                                        toolbar: {
                                            value: searchText,
                                            onChange: (event) => requestSearch(event.target.value),
                                            clearSearch: () => requestSearch(''),
                                        },
                                        }}
                                        loading={loading}
                                        disableSelectionOnClick
                                    />
                                    </ThemeProvider >
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}

Index.layout = page => <Layout children={page} title="Escuela Sindical - Bitácora" pageTitle="Bitácora" />

export default Index