import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import { Container } from '@mui/material';

//componentes
import Alertas from '../../components/common/Alertas';
import RenderCellExpand from '../../components/Common/RenderCellExpand'

//estilos
import '/css/usersStyle.css'
import '/css/users.css'

import DataGridPlus from '../../components/common/DataGridPlus';

function getFullName(params) {
    return `${params.value || ""} ${params.getValue(params.id, "apellido_p") || ""
        } ${params.getValue(params.id, "apellido_m") || ""}`
}

const columns = [
    {
      field: 'id',
      headerName: 'ID',
      minidth: 100 },
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
    {
      field: 'email',
      headerName: 'CORREO',
      width: 200,
      renderCell: RenderCellExpand,
    },
    { field: 'matricula', headerName: 'MATRICULA', width: 120 },
    {
        field: 'nombre',
        headerName: 'NOMBRE',
        width: 200,
        renderCell: RenderCellExpand,
    },
    {
        field: 'descripcion',
        headerName: 'DESCRIPCIÓN',
        renderCell: RenderCellExpand,
        width: 300,
    },
    {
        type: 'string',
        field: 'categoria',
        headerName: 'CATEGORÍA',
        width: 120,
        valueFormatter: (params) => {
            if(params.value == 'create')
                return 'Registro'
            else if (params.value == 'update')
                return 'Actualización'
            else if(params.value == 'delete')
                return 'Eliminación'
            else if(params.value == 'restore')
                return 'Restauración'
        },
        type: 'singleSelect',
        valueOptions: ['Registro', 'Actualización', 'Eliminación', 'Restauración']
    },
];

const Index = ({ logs }) => {
    return (
        <>
            <div className="row">
                <Container>
                    <div className="col contenedor s12">
                        <div className="card darken-1 cardUsers">
                            {/* <InertiaLink className="btn-floating btn-large waves-effect waves-light green-sind button-addUser" href={route('logs.create')}><i className="material-icons">add</i></InertiaLink> */}
                            <div className="card-content">
                                <span className="card-title">Bitácora</span>
                                <Alertas />

                                <DataGridPlus 
                                  rowsJson={logs}
                                  columns={columns}
                                  tableName={'logs'}
                                  mode='server'
                                />
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