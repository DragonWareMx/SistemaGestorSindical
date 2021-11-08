import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import { Inertia } from '@inertiajs/inertia'
import route from 'ziggy-js';
import { InertiaLink } from '@inertiajs/inertia-react';
import Alertas from '../../components/common/Alertas';

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

//estilos
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

const honorJusticia = ({ issues }) => {

  const columns = [
    {
      field: 'id',
      headerName: 'NO.',
      editable: false,
      disableColumnSelector: false,
      flex: 0.1,
    },
    {
      field: 'num_oficio',
      headerName: 'OFICIO',
      editable: false,
      disableColumnSelector: false,
      flex: 0.3,
    },
    {
      field: 'matricula',
      headerName: 'MATRICULA',
      editable: false,
      flex: 0.4,
    },
    {
      field: 'nombre',
      headerName: 'NOMBRE',
      editable: false,
      flex: 0.4,
    },
    {
      field: 'apellido_p',
      headerName: 'APELLIDO',
      editable: false,
      flex: 0.4,
    },
    {
      field: 'inicio_sancion',
      headerName: 'INICIO DE SANCION',
      editable: false,
      flex: 0.4,
    },
    {
      field: 'termino_sancion',
      headerName: 'TÉRMINO DE SANCION',
      editable: false,
      flex: 0.4,
    },
    {
      field: "",
      headerName: "VER",
      flex: 0.2,
      renderCell: (params) => (
        <InertiaLink href={route('honor.issue', params.row.num_oficio)} style={{ textDecoration: 'none', color: 'gray' }}><VisibilityIcon /></InertiaLink>
      ),
      sortable: false,
      editable: false,
    }
  ]

  const [searchText, setSearchText] = React.useState('');
  const [rows, setRows] = React.useState(issues);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = issues.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field] ? row[field].toString() : "");
      });
    });
    setRows(filteredRows);
  };

  React.useEffect(() => {
    setRows(issues);
  }, [issues]);
  return (
    <>
      <div className="row">
        <div className="col contenedor s12">
          <div className="card darken-1 cardUsers">
            <InertiaLink className="btn-floating btn-large waves-effect waves-light green-sind button-addUser" href={route('honor.create')}><i className="material-icons">add</i></InertiaLink>
            <div className="card-content">
              <span className="card-title">Honor y Justicia</span>
              <div className="col s12">
                <Alertas />
              </div>
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




honorJusticia.layout = page => <Layout children={page} title="Honor y Justicia" pageTitle="Honor y Justicia" />

export default honorJusticia