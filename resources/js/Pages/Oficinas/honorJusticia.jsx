import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import route from 'ziggy-js';
import { InertiaLink } from '@inertiajs/inertia-react';
import Alertas from '../../components/common/Alertas';

import VisibilityIcon from '@mui/icons-material/Visibility';

//estilos
import '/css/usersStyle.css'
import '/css/users.css'

import RenderCellExpand from '../../components/common/RenderCellExpand'
import DataGridPlus from '../../components/common/DataGridPlus';

import { Container } from '@mui/material';

const honorJusticia = ({ issues }) => {

  const columns = [
    {
      field: "",
      headerName: "VER",
      renderCell: (params) => (
        <InertiaLink href={route('honor.issue', params.row.num_oficio)} style={{ textDecoration: 'none', color: 'gray' }}><VisibilityIcon /></InertiaLink>
      ),
      flex: 0.2,
      minWidth: 80,
      sortable: false,
      filterable: false,
      disableExport: true
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
      renderCell: RenderCellExpand,
    },
    {
      field: 'matricula',
      headerName: 'MATRICULA',
      flex: 0.4,
      minWidth: 100,
      renderCell: RenderCellExpand,
      valueFormatter: (params) => {
        return params.value ?? 'vacío'
      }
    },
    {
      field: 'nombre',
      headerName: 'NOMBRE',
      flex: 0.4,
      minWidth: 150,
      renderCell: RenderCellExpand,
      valueFormatter: (params) => {
        return params.value ?? 'vacío'
      }
    },
    {
      field: 'castigado',
      headerName: 'CASTIGADO',
      flex: 0.4,
      minWidth: 150,
      type: 'boolean',
      valueFormatter: (params) => {
        return params.value ?? 'vacío'
      }
    },
    {
      field: 'inicio_sancion',
      headerName: 'INICIO DE SANCION',
      flex: 0.4,
      minWidth: 150,
      type: 'date',
      valueFormatter: (params) => {
        return params.value ?? 'vacío'
      }
    },
    {
      field: 'termino_sancion',
      headerName: 'TÉRMINO DE SANCION',
      flex: 0.4,
      minWidth: 150,
      type: 'date',
      valueFormatter: (params) => {
        return params.value ?? 'vacío'
      }
    },
    {
      field: 'sancion',
      headerName: 'SANCIÓN',
      flex: 0.4,
      minWidth: 150,
      renderCell: RenderCellExpand,
      valueFormatter: (params) => {
        return params.value ?? 'vacío'
      }
    },
  ]

  return (
    <>
      <div className="row">
        <Container>
          <div className="col contenedor s12">
            <div className="card darken-1 cardUsers">
              <InertiaLink className="btn-floating btn-large waves-effect waves-light green-sind button-addUser" href={route('honor.create')}><i className="material-icons">add</i></InertiaLink>
              <div className="card-content">
                <span className="card-title">Honor y Justicia</span>
                <Alertas />
                <DataGridPlus
                  rowsJson={issues}
                  columns={columns}
                  tableName={'issues'}
                  mode='server'
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>)
}




honorJusticia.layout = page => <Layout children={page} title="Honor y Justicia" pageTitle="Honor y Justicia" />

export default honorJusticia