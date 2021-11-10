import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import route from 'ziggy-js';
import { InertiaLink } from '@inertiajs/inertia-react';

import VisibilityIcon from '@mui/icons-material/Visibility';

// Hojas de estilos
import '/css/usersStyle.css'
import '/css/users.css'

import Alertas from '../../components/common/Alertas';
import DataGridPlus from '../../components/common/DataGridPlus';
import { Container } from '@mui/material';

const admisionCambios = ({ employees }) => {

  const columns = [
    {
      field: "",
      headerName: "VER",
      flex: 0.2,
      renderCell: (params) => (
        <InertiaLink href={route('admisionCambiosRelative', params.row.er_id)} style={{ textDecoration: 'none', color: 'gray' }}><VisibilityIcon /></InertiaLink>
      ),
      sortable: false,
      filterable: false,
      disableExport: true,
    },
    {
      field: 'id',
      headerName: 'NO.',
      editable: false,
      disableColumnSelector: false,
      flex: 0.1,
    },
    {
      field: 'nombreRelative',
      headerName: 'NOMBRE DEL EMPLEADO',
      editable: false,
      disableColumnSelector: false,
      flex: 0.3,
    },
    {
      field: 'tel',
      headerName: 'TELÉFONO',
      editable: false,
      flex: 0.3,
    },
    {
      field: 'estatus',
      headerName: 'ESTATUS',
      editable: false,
      flex: 0.3,
    },
    {
      field: 'categoria',
      headerName: 'CATEGORIA',
      editable: false,
      flex: 0.4,
    },
    {
      field: 'nombreEmployee',
      headerName: 'NOMBRE DEL FAMILIAR',
      editable: false,
      flex: 0.4,
    },
    {
      field: 'parentesco',
      headerName: 'PARENTESCO',
      editable: false,
      flex: 0.3,
    },
  ]

  return (
    <>
      <div className="row contenedor">
        <Container>
          <div className="col contenedor s12">
            <div className="card darken-1 cardUsers">
              <InertiaLink className="btn-floating btn-large waves-effect waves-light green-sind button-addUser" href={route('admisionCambiosCreate')}><i className="material-icons">add</i></InertiaLink>
              <div className="card-content">
                <span className="card-title">Admisión y Cambios</span>
                <Alertas />
                <DataGridPlus
                  rowsJson={employees}
                  columns={columns}
                  tableName={'employees'}
                  mode='server'
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>)
}

admisionCambios.layout = page => <Layout children={page} title="Admisión y Cambios" pageTitle="Admisión y Cambios" />

export default admisionCambios