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
    GridToolbarExport,
    GridToolbarFilterButton,
    esES
} from '@mui/x-data-grid';
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
                '& .MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before': {
                    borderBottom: "0px solid white",
                },
                '& .css-1480iag-MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before': {
                    borderBottom: "0px solid white",
                },
            },
        }),
    { defaultTheme },
);

function QuickSearchToolbar(props) {
    const classes = useStyles();

    const [checked, setChecked] = React.useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);

        Inertia.reload({ data: { deleted: event.target.checked } })
    };

    return (
        <div className={classes.root}>
            <div>
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />

                <Grid style={{ margin: 4 }} container>
                    <Grid item>
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
                </Grid>
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

function dateFormat(date) {
    if (!date)
        return 'Sin fecha'
    var date = new Date(date)
    var month = date.getMonth()
    if (month < 10) month = '0' + month
    var day = date.getDate()
    if (day < 10) day = '0' + day
    var year = date.getFullYear()
    var hours = date.getHours();
    if (hours < 10) hours = '0' + hours
    var minutes = date.getMinutes();
    if (minutes < 10) minutes = '0' + minutes
    return day + "/" + month + "/" + year + " " + hours + ":" + minutes
}

const columns = [
    {
        field: "",
        headerName: "",
        width: 50,
        renderCell: (params) => (
            <InertiaLink href={route('users.edit', params.row.uuid)} style={{ textDecoration: 'none', color: 'gray' }}><EditIcon /></InertiaLink>
        ),
        sortable: false,
        editable: false,
        disableExport: true
    },
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
    { field: 'email', headerName: 'CORREO', width: 400 },
    {
        field: 'matricula', headerName: 'MATRICULA', width: 120,
        valueGetter: (params) => {
            return params.row.deleted_at != null ? null : params.value
        },
        valueFormatter: (params) => {
            return params.value != null ? params.value : 'Usuario sin empleado'
        }
    },
    {
        field: 'nombre',
        headerName: 'NOMBRE',
        editable: false,
        disableColumnSelector: false,
        width: 400,
        valueGetter: (params) => {
            return params.row.deleted_at != null ? null : params.value
        },
        valueFormatter: (params) => {
            return params.value ? params.value : 'Usuario sin empleado'
        }
    },
    {
        field: 'created_at',
        headerName: 'FECHA REGISTRO',
        editable: false,
        disableColumnSelector: false,
        width: 400,
        valueFormatter: (params) => {
            return dateFormat(params.value)
        }
    },
];

const Index = ({ users }) => {
    const [searchText, setSearchText] = React.useState('');
    const [rows, setRows] = React.useState(users);

    const requestSearch = (searchValue) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = users.filter((row) => {
            return Object.keys(row).some((field) => {
                return searchRegex.test(row[field] ? row[field].toString() : "");
            });
        });
        setRows(filteredRows);
    };

    React.useEffect(() => {
        setRows(users);
    }, [users]);

    return (
        <>
            <div className="row">
                <Container>
                    <div className="col contenedor s12">
                        <div className="card darken-1 cardUsers">
                            <InertiaLink className="btn-floating btn-large waves-effect waves-light green-sind button-addUser" href={route('users.create')}><i className="material-icons">add</i></InertiaLink>
                            <div className="card-content">
                                <span className="card-title">Comité</span>
                                <Alertas />

                                <div style={{ height: 500, width: '100%' }}>
                                    <ThemeProvider theme={themeEs}>
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
                                    </ThemeProvider>

                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}

Index.layout = page => <Layout children={page} title="Escuela Sindical - Comité" pageTitle="COMITÉ" />

export default Index