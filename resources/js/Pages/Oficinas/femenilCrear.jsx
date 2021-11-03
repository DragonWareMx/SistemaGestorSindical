import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'
import AgregarCosa from '../../components/common/AgregarCosa';

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


const femenilCrear = ({employees, trophies }) => {
    //errores de la validacion de laravel
    const { errors } = usePage().props

    const classes = useStyles();

    //valores para formulario
    const [values, setValues] = useState({
        empleado: null,
        nombre: '',
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
        Inertia.post(route('accionFemenil.store'), values,
            {
                onError: () => {

                }
            }
        )
    }

    //boton de cancelar
    function cancelEditUser() {
        Inertia.get(route('accionFemenil'))
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

    const defaultPropsTrophie = {
        options: trophies,
        getOptionLabel: (option) => option.nombre,
        onChange: (event, newValue) => {
            setValues({
                ...values,
                nombre: newValue
                    ? newValue.id
                    : null,
            });
        }
    };



    return (
        <div className="row">
            <Container>
                <div className="col contenedor s12">
                    <div className="card darken-1 cardUsers">
                        <div className="card-content">
                            <div className="col s12 m9 l10 xl10 titulo-modulo left" style={{ marginTop: "15px" }}>
                                {/* regresar */}
                                <InertiaLink href={route('accionFemenil')} className="icon-back-course tooltipped" data-position="left" data-tooltip="Regresar"><i className="material-icons">keyboard_backspace</i></InertiaLink>
                                AGREGAR REGISTRO
                            </div>

                            <Alertas />
                            {/* ----Formulario---- */}
                            <form onSubmit={handleSubmit}>
                                <div className="row div-form-register" style={{ "padding": "3%" }}>
                                    <div className="col s12 m12 div-division">
                                        <div className="col s12">
                                            <Autocomplete
                                                {...defaultProps}
                                                renderInput={(params) => (
                                                    <TextField {...params} id="empleado" className={classes.textField} required label="Empleado" variant="standard" />
                                                )}
                                            />
                                            {
                                                errors.empleado &&
                                                <div className="helper-text" data-error={errors.empleado} style={{ "marginBottom": "10px" }}>{errors.empleado}</div>
                                            }
                                        </div>

                                        <div className="col s12">
                                            <Autocomplete
                                                {...defaultPropsTrophie}
                                                renderInput={(params) => (
                                                    <TextField {...params} id="nombre" className={classes.textField} required label="Nombre" variant="standard" />
                                                )}
                                            />
                                            {
                                                errors.nombre &&
                                                <div className="helper-text" data-error={errors.nombre} style={{ "marginBottom": "10px" }}>{errors.nombre}</div>
                                            }
                                        </div>
                                        <AgregarCosa
                                                    cosa={'nombre'}
                                                    foto={false}
                                        ></AgregarCosa>
                                    </div>
                                </div>
                                <div className="row container-buttons">
                                    <button type="button" className=" center-align  btn waves-effect waves-light cancelar" style={{ marginRight: "15px" }} onClick={cancelEditUser}>Cancelar</button>
                                    < button type="submit" className=" center-align btn waves-effect waves-light guardar" style={{ marginRight: "3%", marginLeft: "0" }}>
                                        Guardar
                                        <i className="material-icons right">save</i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

femenilCrear.layout = page => <Layout children={page} title="Escuela Sindical - Acción femenil" pageTitle="ACCIÓN FEMENIL" />

export default femenilCrear
