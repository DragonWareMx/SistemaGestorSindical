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

import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';

import DataGridPlus from '../../components/common/DataGridPlus';
import RenderCellExpand from '../../components/Common/RenderCellExpand'

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
        filterable: false,
        disableExport: true
    },
    { field: 'id', headerName: 'ID', width: 100 },
    {
        field: 'foto',
        headerName: 'FOTO',
        width: 70,
        renderCell: (params) => {
            return (
                <div>
                    <img src={params.value ? "/storage/fotos_perfil/" + params.value : "/img/avatar1.png"} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", margin: 'auto' }} />
                </div>
            )
        },
        sortable: false,
        filterable: false,
        disableExport: true
    },
    {
        field: 'email',
        headerName: 'CORREO',
        width: 400,
        renderCell: RenderCellExpand,
    },
    {
        field: 'matricula', headerName: 'MATRICULA', width: 120,
        valueGetter: (params) => {
            return params.row.deleted_at != null ? null : params.value
        },
        valueFormatter: (params) => {
            return params.value != null ? params.value : 'Usuario sin empleado'
        },
        renderCell: RenderCellExpand,
    },
    {
        field: 'nombre',
        headerName: 'NOMBRE',
        width: 300,
        valueGetter: (params) => {
            return params.row.deleted_at != null ? null : params.value
        },
        valueFormatter: (params) => {
            return params.value ? params.value : 'Usuario sin empleado'
        },
        renderCell: RenderCellExpand,
    },
    {
        field: 'created_at',
        headerName: 'FECHA REGISTRO',
        width: 200,
        valueFormatter: (params) => {
            return dateFormat(params.value)
        },
    },
];

const Index = ({ users }) => {
    const [checked, setChecked] = React.useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);

        Inertia.reload({ data: { deleted: event.target.checked } })
    };

    const eliminados = 
    <Grid style={{ margin: 4 }} container>
        <Grid item>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        name="checkedB"
                        color="primary"
                        extra={eliminados}
                    />
                }
                label="Ver eliminados"
            />
        </Grid>
    </Grid>
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

                                <DataGridPlus 
                                    rowsJson={users}
                                    columns={columns}
                                    tableName={'users'}
                                    mode='server'
                                    extra={eliminados}
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}

Index.layout = page => <Layout children={page} title="Escuela Sindical - Comité" pageTitle="Comité" />

export default Index