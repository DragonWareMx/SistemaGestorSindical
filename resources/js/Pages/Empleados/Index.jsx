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

import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';

import RenderCellExpand from '../../components/Common/RenderCellExpand'
import DataGridPlus from '../../components/common/DataGridPlus';

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
            <InertiaLink href={route('employees.edit', params.row.uuid)} style={{ textDecoration: 'none', color: 'gray' }}><EditIcon /></InertiaLink>
        ),
        sortable: false,
        filterable: false,
        disableExport: true
    },
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'matricula', headerName: 'MATRICULA', width: 120 },
    {
        field: 'nombre',
        headerName: 'NOMBRE',
        width: 200,
        renderCell: RenderCellExpand,
    },
    {
        field: 'edad',
        headerName: 'EDAD',
        width: 100,
        valueFormatter: (params) => {
            return `${params.value} años`;
        },
        type: 'number',
    },
    {
        field: 'fecha_nac',
        headerName: 'FECHA NACIMIENTO',
        width: 170,
        type: 'date',
    },
    {
        field: 'sexo',
        headerName: 'SEXO',
        width: 100,
        valueFormatter: (params) => {
            return params.value ?? 'vacío'
        }
    },
    {
        field: 'antiguedad',
        headerName: 'ANTIGÜEDAD',
        width: 120,
        type: 'date',
    },
    {
        field: 'categoria',
        headerName: 'CATEGORÍA',
        width: 120,
        renderCell: RenderCellExpand,
    },
    {
        field: 'unidad',
        headerName: 'UNIDAD',
        width: 250,
        renderCell: RenderCellExpand,
    },
    {
        field: 'regime',
        headerName: 'RÉGIMEN',
        width: 120,
        renderCell: RenderCellExpand,
    },
    {
        field: 'tel',
        headerName: 'TELÉFONO',
        width: 120,
        valueFormatter: (params) => {
            return params.value ?? 'vacío'
        }
    },
    {
        field: 'direccion',
        headerName: 'DIRECCIÓN',
        width: 300,
        valueFormatter: (params) => {
            return params.value ? params.value.length > 0 ? params.value : 'vacío' : 'vacío'
        },
        renderCell: RenderCellExpand,
    },
    {
        field: 'usuario',
        headerName: 'USUARIO',
        width: 120,
        valueGetter: (params) => {
            if (params.row.user_id)
                return "Si"
            else
                return "No"
        },
        valueFormatter: (params) => {
            return params.value
        },
        filterable: false
    },
    {
        field: 'created_at',
        headerName: 'FECHA REGISTRO',
        width: 200,
        valueFormatter: (params) => {
            return dateFormat(params.value)
        },
        type: 'dateTime'
    },
];

const Index = ({ employees }) => {
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

    
    const botones =
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
        <Grid item>
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
    
    return (
        <>
            <div className="row">
                <Container>
                    <div className="col contenedor s12">
                        <div className="card darken-1 cardUsers">
                            <InertiaLink className="btn-floating btn-large waves-effect waves-light green-sind button-addUser" href={route('employees.create')}><i className="material-icons">add</i></InertiaLink>
                            <div className="card-content">
                                <span className="card-title">Empleados</span>
                                <Alertas />
                                <DataGridPlus 
                                    rowsJson={employees}
                                    columns={columns}
                                    tableName={'employees'}
                                    mode='server'
                                    extra={botones}
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}

Index.layout = page => <Layout children={page} title="Escuela Sindical - Empleados" pageTitle="Empleados" />

export default Index