import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import route from 'ziggy-js';
import { InertiaLink } from '@inertiajs/inertia-react';
import Alertas from '../../components/common/Alertas';

import VisibilityIcon from '@mui/icons-material/Visibility';

// Hojas de estilos
import '/css/usersStyle.css'
import '/css/users.css'

import DataGridPlus from '../../components/common/DataGridPlus';
import Alertas from '../../components/common/Alertas';
import { Container } from '@mui/material';

const secretariaInterior = ({ elections }) => {

  const columns = [
    {
      field: "",
      headerName: "VER",
      flex: 0.2,
      minWidth: 80,
      renderCell: (params) => (
        <InertiaLink href={route('secretariaInterior.election', params.row.id)} style={{ textDecoration: 'none', color: 'gray' }}><VisibilityIcon /></InertiaLink>
      ),
      sortable: false,
      editable: false,
      filterable: false,
    },
    {
      field: 'id',
      headerName: 'NO.',
      flex: 0.1,
      minWidth: 80,
    },
    {
      field: 'num_oficio',
      headerName: 'OFICIO',
      flex: 0.3,
      minWidth: 100,
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
      minWidth: 150,
    },
    {
      field: 'fecha',
      headerName: 'FECHA DE ELECCIÓN',
      flex: 0.4,
      minWidth: 150,
      type: 'date',
    },
    {
      field: 'fecha_voto',
      headerName: 'FECHA DE VOTACIÓN',
      flex: 0.4,
      minWidth: 150,
      type: 'date',
    },
  ]

  return (
    <>
      <div className="row">
        <Container>
          <div className="col contenedor s12">
            <div className="card darken-1 cardUsers">
              <InertiaLink className="btn-floating btn-large waves-effect waves-light green-sind button-addUser" href={route('secretariaInterior.create')}><i className="material-icons">add</i></InertiaLink>
              <div className="card-content">
                <span className="card-title">Secretaria del Interior</span>
                <Alertas />
                <DataGridPlus 
                    rowsJson={elections}
                    columns={columns}
                    tableName={'elections'}
                    mode='server'
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>)
}

secretariaInterior.layout = page => <Layout children={page} title="Secretaria del Interior" pageTitle="Secretaria del Interior" />

export default secretariaInterior