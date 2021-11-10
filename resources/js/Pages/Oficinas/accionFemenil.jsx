import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import route from 'ziggy-js';
import { InertiaLink } from '@inertiajs/inertia-react';

import VisibilityIcon from '@mui/icons-material/Visibility';

// Hojas de estilos
import '/css/usersStyle.css'
import '/css/users.css'


import RenderCellExpand from '../../components/Common/RenderCellExpand'
import Alertas from '../../components/common/Alertas';
import DataGridPlus from '../../components/common/DataGridPlus';
import { Container } from '@mui/material';

const accionFemenil = ({ trophies }) => {

  const columns = [
    {
      field: "",
      headerName: "VER",
      flex: 0.2,
      minWidth: 80,
      renderCell: (params) => (
        <InertiaLink href={route('accionFemenil.trophy', params.row.id)} style={{ textDecoration: 'none', color: 'gray' }}><VisibilityIcon /></InertiaLink>
      ),
      sortable: false,
      filterable: false,
      disableExport: true,
    },
    {
      field: 'id',
      headerName: 'NO.',
      flex: 0.1,
      minWidth: 80,
    },
    {
      field: 'matricula',
      headerName: 'MATRICULA',
      flex: 0.4,
      minWidth: 100,
    },
    {
      field: 'nombre',
      headerName: 'NOMBRE',
      flex: 0.4,
      minWidth: 100,
      renderCell: RenderCellExpand,
    },
    {
      field: 'premio',
      headerName: 'PREMIO',
      flex: 0.4,
      minWidth: 100,
      renderCell: RenderCellExpand,
    },
    {
      field: 'observaciones',
      headerName: 'OBSERVACIONES',
      editable: false,
      flex: 0.5,
      minWidth: 100,
      renderCell: RenderCellExpand,
    },
  ]

  return (
    <>
      <div className="row contenedor">
        <Container>
          <div className="col contenedor s12">
            <div className="card darken-1 cardUsers">
              <InertiaLink className="btn-floating btn-large waves-effect waves-light green-sind button-addUser" href={route('accionFemenil.create')}><i className="material-icons">add</i></InertiaLink>
              <div className="card-content">
                <span className="card-title">Acción Femenil</span>
                <Alertas />
                <DataGridPlus 
                    rowsJson={trophies}
                    columns={columns}
                    tableName={'trophies'}
                    mode='server'
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>)
}

accionFemenil.layout = page => <Layout children={page} title="Acción Femenil" pageTitle="Acción Femenil" />

export default accionFemenil
