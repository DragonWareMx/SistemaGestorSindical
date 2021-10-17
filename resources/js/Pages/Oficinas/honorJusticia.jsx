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
} from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';

// Hojas de estilos
import '/css/usersStyle.css'

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
        '& .MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before' : {
            borderBottom: `0px solid white`,
        },
        '& .css-1480iag-MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before' : {
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
          placeholder="Search…"
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

const honorJusticia = ({usuarios}) => {
    const classes = useStyles();
    
    const {data} = [
        {
            field: 'nombre',
            headerName: 'NOMBRE',
            editable: false,
            disableColumnSelector:false,
            flex: 1,
        },
        {
            field: 'marca',
            headerName: 'MARCA',
            editable: false,
            flex: 0.5,
        },
        // matricua,nombre,unidad de ascripcion
    ]
    const columns = [
        {
          field: 'id',
          headerName: 'No.',
          editable: false,
          disableColumnSelector:false,
          flex: 0.5,
        },
        {
          field: 'name',
          headerName: 'Nombre',
          editable: false,
          disableColumnSelector:false,
          flex: 1,
      },
      {
          field: 'email',
          headerName: 'Correo',
          editable: false,
          flex: 0.5,
      },
      {
        field: 'password',
        headerName: 'Unidad de ascripcion',
        editable: false,
        flex: 0.5,
      },
    ]
    
      const [searchText, setSearchText] = React.useState('');
      const [rows, setRows] = React.useState(usuarios);
    
      const requestSearch = (searchValue) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = usuarios.filter((row) => {
          return Object.keys(row).some((field) => {
            return searchRegex.test(row[field].toString());
          });
        });
        setRows(filteredRows);
      };
    
      React.useEffect(() => {
        setRows(usuarios);
      }, [usuarios]);
    return (
        <> 
            <div className="row contenedor">
                <div className="col contenedor s12">
                    <div className="card darken-1 cardUsers">
                        <div className="card-content">
                            <span className="card-title">Honor y Justicia</span>
                            <div style={{ height: 400, width: '100%' }}>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>)
}




honorJusticia.layout = page => <Layout children={page} title="Honor y Justicia" pageTitle="Honor y Justicia"/>

export default honorJusticia