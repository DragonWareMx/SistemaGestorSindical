import React, { useEffect, useState, createRef } from 'react';
import Layout from '../../layouts/Layout';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'

import '/css/users.css'
import '/css/infoAlumno.css'
import '/css/register.css'
import '/css/modulos.css'
import '/css/participantes.css'
import route from 'ziggy-js';
import { Inertia } from '@inertiajs/inertia';
import Alertas from '../../components/common/Alertas';
import { Container } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { createStyles, makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';


//tabla
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterDateFns';
import IconButton from '@mui/material/IconButton';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { es } from "date-fns/locale";

import Eliminar from '../../components/common/Eliminar'

// import moment from "moment";
// import "moment/locale/es-mx";


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
                    borderBottom: "none",
                },
                '& .MuiInput-underline:focus': {
                    borderBottom: "none",
                },
                '& .MuiInput-underline:hover': {
                    borderBottom: "none",
                },
                '& .MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before': {
                    borderBottom: "none",
                },
                '& .css-ghsjzk-MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before': {
                    borderBottom: "none",
                },
            },
        }),
    { defaultTheme },
);


const Edit = ({ employees, conflict }) => {
    //errores de la validacion de laravel
    const { errors } = usePage().props

    const classes = useStyles();

    //valores para formulario
    const [values, setValues] = useState({
        num_oficio: conflict.num_oficio || '',
        observaciones: conflict.observaciones || '',
        empleado: null,
        editar: true,
        resolutivo: ''
    })

    //actualiza los hooks cada vez que se modifica un input
    function handleChange(e) {
        const key = e.target.id;
        const value = e.target.value
        setValues(values => ({
            ...values,
            [key]: value,
        }))
    }

    //manda el forumulario
    function handleSubmit(e) {
        e.preventDefault()
        if (emploInfo.empleados.length > 0) {
            Inertia.post(route('conflicts.update', conflict.num_oficio), {
                conflict: values,
                empleados: emploInfo.empleados
            },
                {
                    onSuccess: () => {
                        window.location.reload(false);
                    }
                }
            )
        }
        else {
            handleClickOpenAlert3();
        }
    }

    //boton de cancelar
    function cancelEditUser() {
        window.location.reload(false);
    }

    function initializeSelects() {
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems);
        var elems = document.querySelectorAll('.autocomplete');
        var instances = M.Autocomplete.init(elems);
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems);

        M.updateTextFields();
    }

    //se ejecuta cuando la pagina se renderiza
    useEffect(() => {
        initializeSelects();
    }, [])

    const defaultProps = {
        options: employees,
        getOptionLabel: (option) => option.matricula + " " + option.nombre + " " + option.apellido_p + " " + (option.apellido_m ? option.apellido_m : ""),
        onChange: (event, newValue) => {
            setValues({
                ...values,
                empleado: newValue
                    ? newValue
                    : null,
            });
        }
    };

    //esto de aqui es provisional :v
    const [emploInfo, setEmploInfo] = useState({
        empleados: conflict.employees
    });

    function agregarEmpleado() {
        if (values.empleado) {
            var arr = emploInfo.empleados.slice();
            var bandera = true;
            arr.map(emp => {
                if (emp.id == values.empleado.id) {
                    bandera = false;
                }
            });

            if (bandera) {
                arr.push({
                    nombre: values.empleado.nombre + ' ' + values.empleado.apellido_p + ' ' + values.empleado.apellido_m,
                    matricula: values.empleado.matricula,
                    id: values.empleado.id,
                    // castigado: false,
                    // inicio_sancion: '',
                    // termino_sancion: '',
                    // sancion: '',
                    // resolutivo:'',
                    pivot: {
                        castigado: false,
                        inicio_sancion: '',
                        termino_sancion: '',
                        sancion: '',
                        resolutivo: '',
                    },
                });
                setEmploInfo({ empleados: arr });
                document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0].click();
            }
            else {
                handleClickOpenAlert();
            }
        }
        else {
            handleClickOpenAlert2();
        }

    }

    function removeEmpleado(index) {
        var arr = emploInfo.empleados.slice();
        arr.splice(index, 1);
        setEmploInfo({ empleados: arr });
    }

    const [openAlert, setOpenAlert] = React.useState(false);

    const handleClickOpenAlert = () => {
        setOpenAlert(true);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const [openAlert2, setOpenAlert2] = React.useState(false);

    const handleClickOpenAlert2 = () => {
        setOpenAlert2(true);
    };

    const handleCloseAlert2 = () => {
        setOpenAlert2(false);
    };

    const [openAlert3, setOpenAlert3] = React.useState(false);

    const handleClickOpenAlert3 = () => {
        setOpenAlert3(true);
    };

    const handleCloseAlert3 = () => {
        setOpenAlert3(false);
    };

    function handleChangeSancionado(index) {
        var arr = emploInfo.empleados.slice();
        arr[index].pivot.castigado = !arr[index].pivot.castigado;
        setEmploInfo({ empleados: arr });
    }

    function handleChangeDate(newValue, index) {
        var arr = emploInfo.empleados.slice();
        arr[index].pivot.inicio_sancion = newValue;
        setEmploInfo({ empleados: arr });
    };

    function handleChangeDateTermino(newValue, index) {
        var arr = emploInfo.empleados.slice();
        arr[index].pivot.termino_sancion = newValue;
        setEmploInfo({ empleados: arr });
    };

    function handleChangeText(event, index) {
        var arr = emploInfo.empleados.slice();
        arr[index].pivot.sancion = event.target.value;
        setEmploInfo({ empleados: arr });
    };
    function handleChangeResol(event, index) {
        var arr = emploInfo.empleados.slice();
        arr[index].pivot.resolutivo = event.target.value;
        setEmploInfo({ empleados: arr });
    };

    const handleChangeTextarea = (event) => {
        setValues(values => ({
            ...values,
            observaciones: event.target.value,
        }))
    }

    function editar() {
        document.getElementById('btn-editar').style.display = "none";
        document.getElementById('btns-form').style.display = "flex";
        document.getElementById('btn-add').style.display = "flex";
        document.getElementById('id-complete').style.display = "block";

        setValues(values => ({
            ...values,
            editar: false,
        }))
    }

    return (
        <div className="row">
            <Container>
                <div className="col contenedor s12">
                    <div className="card darken-1 cardUsers">
                        <div className="card-content">
                            <div className="col s12 m9 l10 xl10 titulo-modulo left" style={{ marginTop: "15px" }}>
                                {/* regresar */}
                                <InertiaLink href={route('conflicts')} className="icon-back-course tooltipped" data-position="left" data-tooltip="Regresar"><i className="material-icons">keyboard_backspace</i></InertiaLink>
                                REGISTRO
                            </div>

                            <div className="col s12">
                                <Alertas />
                            </div>
                            {/* ----Formulario---- */}
                            <form onSubmit={handleSubmit}>
                                <div className="row div-form-register" style={{ "padding": "3%" }}>
                                    <div className="col s12 m12 div-division">

                                        <div className="input-field col s12" style={{ marginTop: '15px' }}>
                                            <input disabled id="num_oficio" type="text" className={errors.num_oficio ? "validate form-control invalid" : "validate form-control"} name="num_oficio" value={values.num_oficio} required onChange={handleChange} readOnly onFocus={(e) => { e.target.removeAttribute("readonly") }} />
                                            <label htmlFor="num_oficio">Numero de oficio</label>
                                            {
                                                errors.num_oficio &&
                                                <span className="helper-text" data-error={errors.num_oficio} style={{ "marginBottom": "10px" }}>{errors.num_oficio}</span>
                                            }
                                        </div>
                                        <div class="input-field col s12" style={{ marginTop: '15px' }}>
                                            <textarea disabled={values.editar} id="textarea1" class="materialize-textarea" onChange={handleChangeTextarea} value={values.observaciones}></textarea>
                                            <label for="textarea1">Observaciones</label>
                                        </div>
                                        <div className="col s12" style={{ marginTop: '10px' }}>
                                            <div className="col s12" style={{ display: 'none' }} id="id-complete">
                                                <Autocomplete
                                                    {...defaultProps}
                                                    renderInput={(params) => (
                                                        <TextField {...params} id="empleado" className={classes.textField} label="Empleado" variant="standard" />
                                                    )}
                                                />
                                            </div>
                                            {
                                                errors.empleado &&
                                                <div className="helper-text" data-error={errors.empleado} style={{ "marginBottom": "10px" }}>{errors.empleado}</div>
                                            }
                                            <Button id="btn-add" variant="outlined" startIcon={<AddCircleOutlineIcon />} color="success" onClick={agregarEmpleado} style={{ float: "right", marginTop: '5px', marginBottom: '10px', display: 'none' }}>Agregar</Button>

                                            <TableContainer component={Paper}>
                                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell></TableCell>
                                                            <TableCell>Empleado</TableCell>
                                                            <TableCell align="center">Castigado</TableCell>
                                                            <TableCell align="center">Fecha Inicio</TableCell>
                                                            <TableCell align="center">Fecha Termino</TableCell>
                                                            <TableCell align="center">Sanción</TableCell>
                                                            <TableCell align="center">Resolutivo</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {emploInfo.empleados.map((trabajador, index) => (
                                                            <TableRow
                                                                key={index}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell scope="row">
                                                                    <IconButton disabled={values.editar} aria-label="delete" color="error" onClick={() => (removeEmpleado(index))}>
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {trabajador.matricula + ' - ' + trabajador.nombre}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Checkbox
                                                                        disabled={values.editar}
                                                                        checked={emploInfo.empleados[index].pivot.castigado}
                                                                        onClick={() => (handleChangeSancionado(index))}
                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <LocalizationProvider dateAdapter={DateAdapter} locale={es}>
                                                                        <MobileDatePicker
                                                                            disabled={values.editar}
                                                                            label="Fecha de inicio"
                                                                            inputFormat="dd/MM/yyyy"
                                                                            clearable
                                                                            clearText="Limpiar"
                                                                            cancelText="Cancelar"
                                                                            value={emploInfo.empleados[index].pivot.inicio_sancion}
                                                                            onChange={(date) => (handleChangeDate(date, index))}
                                                                            renderInput={(params) => <TextField {...params} style={{}} />}
                                                                        />
                                                                    </LocalizationProvider>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <LocalizationProvider dateAdapter={DateAdapter} locale={es}>
                                                                        <MobileDatePicker
                                                                            disabled={values.editar}
                                                                            label="Fecha de termino"
                                                                            inputFormat="dd/MM/yyyy"
                                                                            clearable
                                                                            clearText="Limpiar"
                                                                            cancelText="Cancelar"
                                                                            value={emploInfo.empleados[index].pivot.termino_sancion}
                                                                            onChange={(date) => (handleChangeDateTermino(date, index))}
                                                                            renderInput={(params) => <TextField {...params} />}
                                                                        />
                                                                    </LocalizationProvider>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        disabled={values.editar}
                                                                        id="outlined-multiline-flexible"
                                                                        label="Sanción"
                                                                        multiline
                                                                        maxRows={6}
                                                                        value={emploInfo.empleados[index].pivot.sancion}
                                                                        onChange={(event) => (handleChangeText(event, index))}
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        disabled={values.editar}
                                                                        id="outlined-multiline-flexible"
                                                                        label="Resolutivo"
                                                                        multiline
                                                                        maxRows={6}
                                                                        value={emploInfo.empleados[index].pivot.resolutivo}
                                                                        onChange={(event) => (handleChangeResol(event, index))}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </div>
                                    </div>

                                </div>
                                <div className="row container-buttons" style={{ display: 'none' }} id="btns-form">
                                    <button type="button" className=" center-align  btn waves-effect waves-light cancelar" style={{ marginRight: "15px" }} onClick={cancelEditUser}>Cancelar</button>
                                    <Eliminar oficina={'Conflictos'} ruta={'conflicts.delete'} id={conflict.uuid} />
                                    < button type="submit" className=" center-align btn waves-effect waves-light guardar" style={{ marginRight: "3%", marginLeft: "0" }}>
                                        Guardar
                                        <i className="material-icons right">save</i>
                                    </button>
                                </div>
                            </form>
                            <div className="row container-buttons">
                                < button id="btn-editar" onClick={editar} className=" center-align btn waves-effect waves-light guardar" style={{ marginRight: "3%", marginLeft: "0" }}>
                                    Editar
                                    <i className="material-icons right">edit</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            </Container >
            <Dialog
                open={openAlert}
                onClose={handleCloseAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Error"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Este empleado ya se encuentra seleccionado.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAlert}>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openAlert2}
                onClose={handleCloseAlert2}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Error"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Primero selecciona un empleado para poder continuar
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAlert2}>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

Edit.layout = page => <Layout children={page} title="Escuela Sindical - Conflictos" pageTitle="Conflictos" />

export default Edit
