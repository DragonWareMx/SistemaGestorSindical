import React, { useEffect, useState } from 'react';
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

import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterDateFns';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';


import { es } from "date-fns/locale";

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


const secretariaIEditar = ({ vote, employee, election, employees, elections }) => {
    //errores de la validacion de laravel
    const { errors } = usePage().props

    const classes = useStyles();

    console.log(elections)

    //valores para formulario
    const [values, setValues] = useState({
        num_oficio: vote.num_oficio || '',
        empleado: employee.id || null,
        eleccion: election.id || null,
        fecha: vote.fecha_voto || '',
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
        Inertia.post(route('secretariaInterior.store'), values,
            {
                onError: () => {
                    // Inertia.reload({ only: ['units'], data: { regime: values.regimen } })
                }
            }
        )
    }

    //boton de cancelar
    function cancelEditUser() {
        Inertia.get(route('users.index'))
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
                    ? newValue.id
                    : null,
            });
        }
    };

    const defaultPropsElection = {
        options: elections,
        getOptionLabel: (option) => option.fecha,
        onChange: (event, newValue) => {
            setValues({
                ...values,
                eleccion: newValue
                    ? newValue.id
                    : null,
            });
        }
    };

    //aqui va lo nuevo

    const handleChangeFecha = (newValue) => {
        setValues({
            ...values,
            fecha: newValue
        });
    };

    const [openAlert, setOpenAlert] = useState(false);

    const handleClickOpenAlert = () => {
        setOpenAlert(true);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
        setFechav('');
    };

    const [fechav, setFechav] = useState(new Date());

    const handleChangeFechav = (newValue) => {
        setFechav(newValue);
    };

    function handleSubmitEleccion(e) {
        e.preventDefault()
        Inertia.post(route('secretariaInterior.votacion'), {
            fecha_votacion: fechav
        },
            {
                onSuccess: () => {
                    handleCloseAlert();
                    Inertia.reload({ only: ['elections'] })
                },
                onError: () => {
                    // Inertia.reload({ only: ['units'], data: { regime: values.regimen } })
                }
            }
        )
    }

    return (
        <div className="row">
            <Container>
                <div className="col contenedor s12">
                    <div className="card darken-1 cardUsers">
                        <div className="card-content">
                            <div className="col s12 m9 l10 xl10 titulo-modulo left" style={{ marginTop: "15px" }}>
                                {/* regresar */}
                                <InertiaLink href={route('secretariaInterior')} className="icon-back-course tooltipped" data-position="left" data-tooltip="Regresar"><i className="material-icons">keyboard_backspace</i></InertiaLink>
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
                                        <div className="col s12">
                                            <Autocomplete
                                                {...defaultProps}
                                                renderInput={(params) => (
                                                    <TextField {...params} id="empleado" className={classes.textField} required label="Empleado" variant="standard" />
                                                )}
                                                defaultValue={{ matricula: employee.matricula, nombre: employee.nombre, apellido_p: employee.apellido_p, apellido_m: employee.apellido_m }}
                                                disabled
                                            />
                                            {
                                                errors.empleado &&
                                                <div className="helper-text" data-error={errors.empleado} style={{ "marginBottom": "10px" }}>{errors.empleado}</div>
                                            }
                                        </div>
                                        <div className="col s12">
                                            <Autocomplete
                                                {...defaultPropsElection}
                                                renderInput={(params) => (
                                                    <TextField {...params} id="votacion" className={classes.textField} required label="Votación" variant="standard" />
                                                )}
                                                defaultValue={{ fecha: election.fecha }}
                                                disabled
                                            />
                                            {
                                                errors.eleccion &&
                                                <div className="helper-text" data-error={errors.eleccion} style={{ "marginBottom": "10px" }}>{errors.eleccion}</div>
                                            }
                                            <div style={{ display: 'flex' }}>
                                                <Button variant="outlined" style={{ marginTop: 10, marginLeft: 'auto', marginRight: 0, display: 'none' }} color='success' onClick={handleClickOpenAlert} endIcon={<AddCircleIcon />}>
                                                    Agregar Votación
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="input-field col s12" style={{ marginTop: '25px' }}>
                                            <LocalizationProvider dateAdapter={DateAdapter} locale={es}>
                                                <MobileDatePicker
                                                    disabled
                                                    label="Fecha de voto"
                                                    inputFormat="dd/MM/yyyy"
                                                    clearable
                                                    clearText="Limpiar"
                                                    cancelText="Cancelar"
                                                    value={values.fecha}
                                                    disableHighlightToday={true}
                                                    onChange={handleChangeFecha}
                                                    renderInput={(params) => <TextField {...params} required style={{ width: '100%' }} />}
                                                />
                                            </LocalizationProvider>
                                            {
                                                errors.fecha &&
                                                <div className="helper-text" data-error={errors.fecha} style={{ "marginBottom": "10px", color: 'red' }}>{errors.fecha}</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="row container-buttons" style={{ display: 'none' }}>
                                    <button type="button" className=" center-align  btn waves-effect waves-light cancelar" style={{ marginRight: "15px" }} onClick={cancelEditUser}>Cancelar</button>
                                    < button type="submit" className=" center-align btn waves-effect waves-light guardar" style={{ marginRight: "3%", marginLeft: "0" }}>
                                        Guardar
                                        <i className="material-icons right">save</i>
                                    </button>
                                </div>
                            </form>
                            <div className="row container-buttons">
                                < button className=" center-align btn waves-effect waves-light guardar" style={{ marginRight: "3%", marginLeft: "0" }}>
                                    Editar
                                    <i className="material-icons right">edit</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            <Dialog
                open={openAlert}
                onClose={handleCloseAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Crear Votación"}
                </DialogTitle>
                <DialogContent style={{ paddingTop: 15 }}>
                    <LocalizationProvider dateAdapter={DateAdapter} locale={es}>
                        <MobileDatePicker
                            label="Fecha de la votación"
                            inputFormat="dd/MM/yyyy"
                            clearable
                            clearText="Limpiar"
                            cancelText="Cancelar"
                            value={fechav}
                            disableHighlightToday={true}
                            onChange={handleChangeFechav}
                            renderInput={(params) => <TextField {...params} required style={{ width: '100%' }} />}
                        />
                    </LocalizationProvider>
                    {
                        errors.fecha_votacion &&
                        <div className="helper-text" data-error={errors.fecha_votacion} style={{ "marginBottom": "10px", color: 'red' }}>{errors.fecha_votacion}</div>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAlert}>Cancelar</Button>
                    <Button onClick={handleSubmitEleccion}>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

secretariaIEditar.layout = page => <Layout children={page} title="Escuela Sindical - Secretaria del Interior" pageTitle="SECRETARIA DEL INTERIOR" />

export default secretariaIEditar
