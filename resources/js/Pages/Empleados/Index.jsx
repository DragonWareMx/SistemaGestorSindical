import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import { Inertia } from '@inertiajs/inertia'
import route from 'ziggy-js';
import { InertiaLink } from '@inertiajs/inertia-react';
import { Container } from '@mui/material';

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
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';

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
        borderBottom: `1px solid ${theme.palette.divider}`,
        },
    },
    }),
{ defaultTheme },
);
  
function QuickSearchToolbar(props) {
const classes = useStyles();

const [checked, setChecked] = React.useState(false);
const [checkedU, setCheckedU] = React.useState(false);
  
const handleChange = (event) => {
    setChecked(event.target.checked);

    Inertia.reload({data: {deleted: event.target.checked}})
};

const handleChangeU = (event) => {
    setCheckedU(event.target.checked);

    Inertia.reload({data: {user: event.target.checked}})
};

return (
    <div className={classes.root}>
    <div>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />

        <Grid style={{margin: 4}} container>
            <Grid row>
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
            </Grid>
            <Grid row>
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
        </Grid>
    </div>
    <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
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

function getFullName(params) {
    return `${params.value || ""} ${
        params.getValue(params.id, "apellido_p") || ""
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
    {
        field: "",
        headerName: "",
        width:50,
        renderCell: (params) => (
          <InertiaLink href={route('employees.edit', params.row.uuid)} style={{textDecoration: 'none', color: 'gray'}}><EditIcon/></InertiaLink>
        ),
        sortable: false,
        editable: false,
    },
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'matricula', headerName: 'MATRICULA', width: 120 },
    {
        field: 'nombre',
        headerName: 'NOMBRE',
        editable: false,
        disableColumnSelector:false,
        width: 200,
        valueGetter: getFullName,
        sortComparator: (v1, v2, cellParams1, cellParams2) =>
          getFullName(cellParams1).localeCompare(getFullName(cellParams2)),
    },
    {
        field: 'edad',
        headerName: 'EDAD',
        editable: false,
        valueGetter: (params) => {
            return getAge(params.getValue(params.id, "fecha_nac"))},
        width: 100,
    },
    {
        field: 'fecha_nac',
        headerName: 'FECHA NACIMIENTO',
        editable: false,
        width: 170,
        valueFormatter: (params) => {
          return `${params.value}`;
        },
    },
    {
      field: 'sexo',
      headerName: 'SEXO',
      editable: false,
      width: 100,
      valueGetter: (params) => {
          if(params.value == 'h') return "hombre"
          else if (params.value == 'm') return "mujer"
          else return "otro"
      },
    },
    {
        field: 'antiguedad',
        headerName: 'ANTIGÜEDAD',
        width: 120,
    },
    {
        field: 'category',
        headerName: 'CATEGORÍA',
        width: 120,
        valueGetter: getCategory,
        sortComparator: (v1, v2, cellParams1, cellParams2) =>
            getAddress(cellParams1).localeCompare(getAddress(cellParams2)),
    },
    {
        field: 'unit',
        headerName: 'UNIDAD',
        width: 250,
        valueGetter: getUnit,
        sortComparator: (v1, v2, cellParams1, cellParams2) =>
            getAddress(cellParams1).localeCompare(getAddress(cellParams2)),
    },
    {
        field: 'regime',
        headerName: 'RÉGIMEN',
        width: 120,
        valueGetter: getRegime,
        sortComparator: (v1, v2, cellParams1, cellParams2) =>
            getAddress(cellParams1).localeCompare(getAddress(cellParams2)),
    },
    {
        field: 'tel',
        headerName: 'TELÉFONO',
        width: 120,
    },
    {
        field: 'direccion',
        headerName: 'DIRECCIÓN',
        width: 700,
        valueGetter: getAddress,
        sortComparator: (v1, v2, cellParams1, cellParams2) =>
            getAddress(cellParams1).localeCompare(getAddress(cellParams2)),
    },
];

const Index = ({ employees }) => {
    const [searchText, setSearchText] = React.useState('');
    const [rows, setRows] = React.useState(employees);

    const requestSearch = (searchValue) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = employees.filter((row) => {
            return Object.keys(row).some((field) => {
            return searchRegex.test(row[field] ? row[field].toString() : "");
            });
        });
        setRows(filteredRows);
    };
    
    React.useEffect(() => {
        setRows(employees);
    }, [employees]);

    return (
        <>
            <div className="row">
                <Container>
                    <div className="col contenedor s12">
                        <div className="card darken-1 cardUsers">
                            <InertiaLink className="btn-floating btn-large waves-effect waves-light green-sind button-addUser" href={route('employees.create')}><i className="material-icons">add</i></InertiaLink>
                            <div className="card-content">
                                <span className="card-title">Empleados</span>
                                <Alertas/>

                                <div style={{ height: 400, width: '100%' }}>
                                    <DataGrid
                                        components={{ Toolbar: QuickSearchToolbar }}
                                        rows={rows}
                                        columns={columns}
                                        componentsProps={{
                                        toolbar: {
                                            value: searchText,
                                            onChange: (event) => requestSearch(event.target.value),
                                            clearSearch: () => requestSearch(''),
                                        },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}

Index.layout = page => <Layout children={page} title="Escuela Sindical - Empleados" pageTitle="EMPLEADOS" />

export default Index