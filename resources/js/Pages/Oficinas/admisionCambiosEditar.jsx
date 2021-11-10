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

import Eliminar from '../../components/common/Eliminar'

import { es } from "date-fns/locale";

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


const Edit = ({ register, employees, employee, relative, add_date}) => {
    //errores de la validacion de laravel
    const { errors } = usePage().props
    const { auth } = usePage().props;

    const classes = useStyles();

    //valores para formulario
    const [values, setValues] = useState({
        empleado: employee || null,
        familiar: relative || null,
        parentesco: register.parentesco || '',
    })

    //variable para permitir editar
    const [editar, setEditar] = useState(true);

    //actualiza los hooks cada vez que se modifica un input
    function handleChange(e) {
        const key = e.target.id;
        const value = e.target.value
        setValues(values => ({
            ...values,
            [key]: value,
        }))
    }

    //manda el formulario
    function handleSubmit(e) {
        e.preventDefault()
        // console.log(values);
        //  se debe validar que la ultima fecha de ingreso no sea menor a 10 anos
        var fecha = new Date();
        fecha.setMonth(fecha.getMonth() - 120);

        if(values.empleado !== null && values.familiar !== null)
        {
            if(values.empleado !== values.familiar){
                // if(values.empleado.ingreso_bolsa < fecha){
                    Inertia.post(route('admisionCambiosRelativeStore', register.er_id), values,
                        {
                            onError: () => {
                                
                            }
                        }
                    )
                // }
                // else {
                //     handleClickOpenAlert3();
                // }
            }
            else {
                handleClickOpenAlert();
            }
        }
        else {
            handleClickOpenAlert2();
        }
    }

    //boton de cancelar
    function cancelEditUser() {
        Inertia.get(route('admisionCambios'))
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

    const defaultProps2 = {
        options: employees,
        getOptionLabel: (option) => option.matricula + " " + option.nombre + " " + option.apellido_p + " " + (option.apellido_m ? option.apellido_m : ""),
        onChange: (event, newValue) => {
            setValues({
                ...values,
                familiar: newValue
                    ? newValue
                    : null,
            });
        }
    };

    //esto de aqui es provisional :v
    const [emploInfo, setEmploInfo] = useState({
        empleados: []
    });

    const [famInfo, setFamInfo] = useState({
        familiar: []
    });

    const agregarEmpleado = () => {
        // if (values.empleado) {
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
                });
                setEmploInfo({ empleados: arr });
                document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0].click();
            }
            else {
                handleClickOpenAlert();
            }
        // }
        // else {
        //     handleClickOpenAlert2();
        // }

    }

    const agregarFamiliar = () => {
        // if (values.familiar) {
            var arr = famInfo.familiar.slice();
            var bandera = true;
            arr.map(fam => {
                if (fam.id == values.familiar.id) {
                    bandera = false;
                }
            });

            if (bandera) {
                arr.push({
                    nombre: values.familiar.nombre + ' ' + values.familiar.apellido_p + ' ' + values.familiar.apellido_m,
                    matricula: values.familiar.matricula,
                    id: values.familiar.id,
                });
                setFamInfo({ familiar: arr });
                document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0].click();
            }
            else {
                handleClickOpenAlert();
            }
        // }
        // else {
        //     handleClickOpenAlert2();
        // }

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

    const handleChangeTextarea = (event) => {
        setValues(values => ({
            ...values,
            parentesco: event.target.value,
        }))
    }

    const handleChangeTextarea2 = (event) => {
        setValues(values => ({
            ...values,
            zona: event.target.value,
        }))
    }

    const permitirEditar= () => {
        setEditar(false);

        document.getElementById('btn-editar').style.display = "none";
        document.getElementById('bolsa2').style.display = "none";
        document.getElementById('btns-form').style.display = "flex";
        document.getElementById('btn-add').style.display = "flex";
        document.getElementById('bolsa1').style.display = "flex";
    }    

    return (
        <div className="row">
            <Container>
                <div className="col contenedor s12">
                    <div className="card darken-1 cardUsers">
                        <div className="card-content">
                            <div className="col s12 m9 l10 xl10 titulo-modulo left" style={{ marginTop: "15px" }}>
                                {/* regresar */}
                                <InertiaLink href={route('admisionCambios')} className="icon-back-course tooltipped" data-position="left" data-tooltip="Regresar"><i className="material-icons">keyboard_backspace</i></InertiaLink>
                                REGISTRO
                            </div>

                            <div className="col s12">
                                <Alertas />
                            </div>
                            {/* ----Formulario---- */}
                            <form onSubmit={handleSubmit}>
                                <div className="row div-form-register" style={{ "padding": "3%" }}>
                                    <div className="col s12 m12 div-division">

                                        <div className="col s12" style={{ marginTop: '10px' }}>
                                            <Autocomplete

                                                {...defaultProps}
                                                renderInput={(params) => (
                                                    <TextField {...params} id="empleado" className={classes.textField} label="Empleado" variant="standard" onChange={agregarEmpleado} />
                                                )}
                                                defaultValue={{ matricula: employee.matricula, nombre: employee.nombre, apellido_p: employee.apellido_p, apellido_m: employee.apellido_m }}
                                                disabled
                                            />
                                            {
                                                errors.empleado &&
                                                <div className="helper-text" data-error={errors.empleado} style={{ "marginBottom": "10px" }}>{errors.empleado}</div>
                                            }
                                        </div>

                                        <div id="bolsa1" className="col s12" style={{ marginTop: '10px', display: 'none' }}>
                                            Último ingreso a bolsa: {values.empleado === null ? "Seleccione un empleado" : (values.empleado.ingreso_bolsa === null ? 'No tiene' : values.empleado.ingreso_bolsa)}
                                        </div>

                                        <div id="bolsa2" className="col s12" style={{ marginTop: '10px' }}>
                                            Ingreso a bolsa: {add_date.ingreso_bolsa}
                                        </div>

                                        <div className="col s12" style={{ marginTop: '10px' }}>
                                            <Autocomplete
                                                {...defaultProps2}
                                                renderInput={(params) => (
                                                    <TextField {...params} id="familiar" className={classes.textField} label="Familiar" variant="standard" onChange={agregarFamiliar} />
                                                )}
                                                defaultValue={{ matricula: relative.matricula, nombre: relative.nombre, apellido_p: relative.apellido_p, apellido_m: relative.apellido_m }}
                                                disabled={editar}
                                            />
                                            {
                                                errors.familiar &&
                                                <div className="helper-text" data-error={errors.familiar} style={{ "marginBottom": "10px" }}>{errors.familiar}</div>
                                            }

                                            <InertiaLink href={route('admisionCambiosNewFamiliar')}><Button id="btn-add" variant="outlined" startIcon={<AddCircleOutlineIcon />} color="success"  style={{ float: "right", marginTop: '5px', display: "none" }}>Nuevo</Button></InertiaLink>
                                        </div>

                                        <div class="input-field col s12" style={{ marginTop: '15px' }}>
                                            <textarea id="textarea1" class="materialize-textarea" onChange={handleChangeTextarea} value={values.parentesco} disabled={editar}></textarea>
                                            <label for="textarea1">Parentesco</label>
                                        </div>

                                        {/* <div class="input-field col s12" style={{ marginTop: '15px' }}>
                                            <textarea id="textarea2" class="materialize-textarea" onChange={handleChangeTextarea2} values={values.zona}></textarea>
                                            <label for="textarea2">Zona</label>
                                        </div> */}
                                    </div>

                                </div>
                                <div id="btns-form" className="row container-buttons" style={{display:'none'}}>
                                    <button type="button" className=" center-align  btn waves-effect waves-light cancelar" style={{ marginRight: "15px" }} onClick={cancelEditUser}>Cancelar</button>
                                    {(() => {
                                        if (auth.user.roles['0'].slug == 'admin' || auth.user.roles['0'].name == 'secGen' || auth.user.roles['0'].name == 'respAC') {
                                            return <Eliminar oficina={'Admision y Cambios'} ruta={'admisionCambiosDestroy'} id={register.er_id} />
                                        }
                                    })()}
                                    <button type="submit" className=" center-align btn waves-effect waves-light guardar" style={{ marginRight: "3%", marginLeft: "0" }}>
                                        Guardar
                                        <i className="material-icons right">save</i>
                                    </button>
                                </div>
                            </form>
                            <div className="row container-buttons" id="btn-editar">
                                <button  className=" center-align btn waves-effect waves-light guardar" style={{ marginRight: "3%", marginLeft: "0" }} onClick={permitirEditar}>
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
                        El empleado y el familiar no pueden ser el mismo
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
                        Primero selecciona un empleado y un familiar para poder continuar
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAlert2}>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openAlert3}
                onClose={handleCloseAlert3}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Error"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        El último ingreso a bolsa no puede ser menor a 10 años
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAlert3}>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

Edit.layout = page => <Layout children={page} title="Escuela Sindical - Admisión y Cambios" pageTitle="Admisión y Cambios" />

export default Edit
