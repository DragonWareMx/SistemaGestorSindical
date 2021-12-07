import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import route from 'ziggy-js';
import { InertiaLink } from '@inertiajs/inertia-react';

import VisibilityIcon from '@mui/icons-material/Visibility';

// Hojas de estilos
import '/css/usersStyle.css'
import '/css/users.css'

import { Container } from '@mui/material';
import RenderCellExpand from '../../components/common/RenderCellExpand'
import DataGridPlus from '../../components/common/DataGridPlus';
import Alertas from '../../components/common/Alertas';

const conflictos = ({ conflicts }) => {

  const columns = [
    {
      field: "",
      headerName: "VER",
      flex: 0.2,
      minWidth: 80,
      renderCell: (params) => (
        <InertiaLink href={route('conflicts.conflict', params.row.uuid)} style={{ textDecoration: 'none', color: 'gray' }}><VisibilityIcon /></InertiaLink>
      ),
      sortable: false,
      editable: false,
      filterable: false,
    },
    {
      field: 'id',
      headerName: 'NO.',
      editable: false,
      disableColumnSelector: false,
      flex: 0.1,
      minWidth: 80,
    },
    {
      field: 'num_oficio',
      headerName: 'OFICIO',
      editable: false,
      disableColumnSelector: false,
      flex: 0.3,
      minWidth: 150,
      renderCell: RenderCellExpand,
    },
    {
      field: 'matricula',
      headerName: 'MATRICULA',
      editable: false,
      flex: 0.4,
      minWidth: 150,
      renderCell: RenderCellExpand,
      valueFormatter: (params) => {
        return params.value ?? 'vacío'
      }
    },
    {
      field: 'nombre',
      headerName: 'NOMBRE',
      editable: false,
      flex: 0.4,
      minWidth: 200,
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
      editable: false,
      flex: 0.4,
      minWidth: 100,
      valueFormatter: (params) => {
        return params.value ?? 'vacío'
      },
      type: 'date'
    },
    {
      field: 'termino_sancion',
      headerName: 'TÉRMINO DE SANCION',
      editable: false,
      flex: 0.4,
      minWidth: 100,
      valueFormatter: (params) => {
        return params.value ?? 'vacío'
      },
      type: 'date'
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
    {
      field: 'resolutivo',
      headerName: 'RESOLUTIVO',
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
      <div className="row contenedor">
        <Container>
          <div className="col contenedor s12">
            <div className="card darken-1 cardUsers">
              <InertiaLink className="btn-floating btn-large waves-effect waves-light green-sind button-addUser" href={route('conflicts.create')}><i className="material-icons">add</i></InertiaLink>
              <div className="card-content">
                <span className="card-title">Conflictos</span>
                <Alertas />
                <DataGridPlus
                  rowsJson={conflicts}
                  columns={columns}
                  tableName={'conflicts'}
                  mode='server'
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>)
}

conflictos.layout = page => <Layout children={page} title="Conflictos" pageTitle="Conflictos" />

export default conflictos
