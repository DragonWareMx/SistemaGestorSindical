import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import { Inertia } from '@inertiajs/inertia'
import route from 'ziggy-js';
import { InertiaLink } from '@inertiajs/inertia-react';

// componentes
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  esES
} from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Hojas de estilos
import '/css/usersStyle.css'
import '/css/users.css'

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
          borderBottom: `none`,
        },
        '& .MuiInput-underline:focus': {
          borderBottom: `none`,
        },
        '& .MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before': {
          borderBottom: `0px solid white`,
        },
        '& .css-1480iag-MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before': {
          borderBottom: `0px solid white`,
        },
      },

    }),
  { defaultTheme },
);

function QuickSearchToolbar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
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

const admisionCambios = ({ employees }) => {

  const columns = [
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
    {
      field: "",
      headerName: "VER",
      flex: 0.2,
      renderCell: (params) => (
        <InertiaLink href={route('admisionCambiosRelative', params.row.er_id)} style={{ textDecoration: 'none', color: 'gray' }}><VisibilityIcon /></InertiaLink>
      ),
      sortable: false,
      editable: false,
    }
  ]

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
      <div className="row contenedor">
        <div className="col contenedor s12">
          <div className="card darken-1 cardUsers">
            <InertiaLink className="btn-floating btn-large waves-effect waves-light green-sind button-addUser" href={route('admisionCambiosCreate')}><i className="material-icons">add</i></InertiaLink>
            <div className="card-content">
              <span className="card-title">Admisión y Cambios</span>
              <div style={{ height: '60vh', width: '100%' }}>
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
      </div>
    </>)
}

admisionCambios.layout = page => <Layout children={page} title="Admisión y Cambios" pageTitle="Admisión y Cambios" />

export default admisionCambios