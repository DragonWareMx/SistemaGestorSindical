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


const femenilEditar = ({win,employee,trophy,employees, trophies }) => {
    //errores de la validacion de laravel
    const { errors } = usePage().props

    const classes = useStyles();

    //valores para formulario
    const [values, setValues] = useState({
        empleado: employee.id || null,
        editar: true,
        nombre: trophy || '',
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
        Inertia.post(route('accionFemenil.update',employee.id), values,
            {
                onSuccess: () => {
                    window.location.reload(false);
                }
            }
        )
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
            });
        }
    };

    function editar(){
        document.getElementById('btn-editar').style.display="none";
        document.getElementById('btns-form').style.display="flex";
        document.getElementById('btn-add').style.display="flex";
        document.getElementById('observaciones').style.display="none";

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
                                <InertiaLink href={route('accionFemenil')} className="icon-back-course tooltipped" data-position="left" data-tooltip="Regresar"><i className="material-icons">keyboard_backspace</i></InertiaLink>
                                REGISTRO
                            </div>

                            <Alertas />
                            {/* ----Formulario---- */}
                            <form onSubmit={handleSubmit}>
                                <div className="row div-form-register" style={{ "padding": "3%" }}>
                                    <div className="col s12 m12 div-division">
                                        <div className="col s12">
                                            <Autocomplete
                                                disabled={values.editar}
                                                {...defaultProps}
                                                renderInput={(params) => (
                                                    <TextField {...params} id="empleado" className={classes.textField} required label="Empleado" variant="standard" />
                                                )}
                                                defaultValue={{matricula:employee.matricula,nombre:employee.nombre,apellido_p:employee.apellido_p,apellido_m:employee.apellido_m}}
                                            />
                                            {
                                                errors.empleado &&
                                                <div className="helper-text" data-error={errors.empleado} style={{ "marginBottom": "10px" }}>{errors.empleado}</div>
                                            }
                                        </div>

                                        <div className="col s12" style={{marginBottom:'25px'}}>
                                            <Autocomplete
                                                disabled={values.editar}
                                                {...defaultPropsTrophie}
                                                renderInput={(params) => (
                                                    <TextField {...params} id="nombre" className={classes.textField} required label="Nombre" variant="standard" />
                                                )}
                                                defaultValue={{nombre:trophy.nombre}}
                                            />
                                            {
                                                errors.nombre &&
                                                <div className="helper-text" data-error={errors.nombre} style={{ "marginBottom": "10px" }}>{errors.nombre}</div>
                                            }
                                        </div>
                                        <div  className="col s12" style={{display:'none'}} id="btn-add">
                                            <AgregarCosa
                                                    cosa={'nombre'}
                                                    foto={false}
                                            ></AgregarCosa>
                                        </div>
                                        <div id="observaciones" style={{diplay:'flex',flexWrap:'wrap',marginLeft:'12px'}}>
                                            <div style={{fontFamily:'Montserrat',fontSize:'14px',color:'#134e39'}}>OBSERVACIONES</div>
                                            {trophy.observaciones}
                                        </div>
                                    </div>
                                </div>
                                <div className="row container-buttons" style={{display:'none'}}  id="btns-form">
                                    <button type="button" className=" center-align  btn waves-effect waves-light cancelar" style={{ marginRight: "15px" }} onClick={cancelEditUser}>Cancelar</button>
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
                </div>
            </Container>
        </div>
    )
}

femenilEditar.layout = page => <Layout children={page} title="Escuela Sindical - Acción femenil" pageTitle="ACCIÓN FEMENIL" />

export default femenilEditar
