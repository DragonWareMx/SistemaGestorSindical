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
        '& .MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before' : {
            borderBottom: "none",
        },
        '& .css-ghsjzk-MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before' : {
            borderBottom: "none",
        },
    },
    }),
{ defaultTheme },
);


const Create = ({ roles, employees }) => {
    //errores de la validacion de laravel
    const { errors } = usePage().props

    const classes = useStyles();

    //valores para formulario
    const [values, setValues] = useState({
        foto: null,
        email: "",
        contrasena: "",
        confirmar_contrasena: "",
        rol: "",
        empleado: null
    })

    //actualiza los hooks cada vez que se modifica un input
    function handleChange(e) {
        const key = e.target.id;
        const value = e.target.value
        setValues(values => ({
            ...values,
            [key]: value,
        }))

        if (key == "regimen") {
            Inertia.reload({ only: ['units'], data: { regime: value } })
            setValues(values => ({
                ...values,
                unidad: "",
            }))
        }
    }

    //manda el forumulario
    function handleSubmit(e) {
        e.preventDefault()
        Inertia.post(route('users.store'), values,
            {
                onError: () => {
                    Inertia.reload({ only: ['units'], data: { regime: values.regimen } })
                }
            }
        )
    }

    //boton de cancelar
    function cancelEditUser() {
        Inertia.get(route('users.index'))
    }

    function clickFoto() {
        document.getElementById("foto").click();
    }

    function changeFoto() {
        var inputFotos = document.getElementById('foto');
        if (inputFotos.files && inputFotos.files[0]) {
            setValues(values => ({
                ...values,
                foto: inputFotos.files[0],
            }))
            document.getElementById("profileImage").src = window.URL.createObjectURL(inputFotos.files[0]);
        }
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

    return (
        <div className="row">
            <Container>
            <div className="col contenedor s12">
                <div className="card darken-1 cardUsers">
                    <div className="card-content">
                        <div className="col s12 m9 l10 xl10 titulo-modulo left" style={{marginTop:"15px"}}>
                            {/* regresar */}
                            <InertiaLink  href={route('users.index')}  className="icon-back-course tooltipped" data-position="left" data-tooltip="Regresar"><i className="material-icons">keyboard_backspace</i></InertiaLink>
                            AGREGAR USUARIO
                        </div>
                        
                        <Alertas />
                        {/* ----Formulario---- */}
                        <form onSubmit={handleSubmit}>
                            <div className="row div-form-register" style={{ "padding": "3%" }}>
                                <div className="col s12 m12 div-division">
                                    <p className="titles-sub" style={{ "margin": "1em 0px 1em 3%" }}>CUENTA</p>

                                    <div className="col s12" style={{ "display": "flex", "justifyContent": "center", "flexDirection": "column", "marginTop": "5px", "marginBottom": "5px" }}>
                                        <img id="profileImage" onClick={clickFoto} src={"/img/avatar1.png"}></img>
                                        <p id="txt-profile" style={{ "cursor": "pointer" }} onClick={clickFoto}>Foto de perfil</p>
                                    </div>

                                    <div className="input-field">
                                        <input id="foto" type="file" className={errors.foto ? "imageUpload validate form-control invalid" : "imageUpload validate form-control"}
                                            name="foto" placeholder="Photo" accept="image/png, image/jpeg, image/jpg, image/gif" onChange={changeFoto}></input>
                                        {
                                            errors.foto &&
                                            <span className="helper-text" data-error={errors.foto} style={{ "marginBottom": "125px", color: "#F44336", maxHeight: "18px" }}>{errors.foto}</span>
                                        }
                                    </div>

                                    <div className="input-field col s12">
                                        <i className="material-icons prefix">account_circle</i>
                                        <input  id="email" type="email" className={errors.email ? "validate form-control invalid" : "validate form-control"} name="email" value={values.email} required onChange={handleChange} readOnly onFocus={(e) => {e.target.removeAttribute("readonly")}} />
                                        <label htmlFor="email">Correo electrónico</label>
                                        {
                                            errors.email &&
                                            <span className="helper-text" data-error={errors.email} style={{ "marginBottom": "10px" }}>{errors.email}</span>
                                        }
                                    </div>

                                    <div className="input-field col s12">
                                        <i className="material-icons prefix">lock</i>
                                        <input  id="contrasena" type="password" className={errors.contrasena ? "validate form-control invalid" : "validate form-control"} name="contrasena" value={values.contrasena} required onChange={handleChange} />
                                        <label htmlFor="contrasena">Contraseña</label>
                                        {
                                            errors.contrasena &&
                                            <span className="helper-text" data-error={errors.contrasena} style={{ "marginBottom": "10px" }}>{errors.contrasena}</span>
                                        }
                                    </div>

                                    <div className="input-field col s12">
                                        <i className="material-icons prefix">lock</i>
                                        <input  id="confirmar_contrasena" type="password" className={errors.confirmar_contrasena ? "validate form-control invalid" : "validate form-control"} name="confirmar_contrasena" value={values.confirmar_contrasena} required onChange={handleChange} />
                                        <label htmlFor="confirmar_contrasena">Confirmar contraseña</label>
                                        {
                                            errors.confirmar_contrasena &&
                                            <span className="helper-text" data-error={errors.confirmar_contrasena} style={{ "marginBottom": "10px" }}>{errors.confirmar_contrasena}</span>
                                        }
                                    </div>

                                    <div className="col s12">
                                        <div className="input-field select-wrapper">
                                            <input placeholder="Selecciona un rol"  id="rol" list="roles" type="text" className={errors.rol ? "datalist-register validate form-control invalid" : "datalist-register validate"} value={values.rol} onChange={handleChange} required autoComplete="off" />
                                            <svg className="caret" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>
                                            <label htmlFor="rol">Rol</label>
                                            {
                                                errors.rol &&
                                                <span className="helper-text" data-error={errors.rol} style={{ "marginBottom": "10px" }}>{errors.rol}</span>
                                            }
                                        </div>
                                        <datalist id="roles">
                                            {
                                                roles && roles.length > 0 &&
                                                roles.map(rol => (
                                                    <option key={rol.name} value={rol.name} />
                                                ))
                                            }
                                        </datalist>
                                    </div>

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
                                        <InertiaLink href={route('employees.create')} style={{color: "black", textAlign: "right"}}>Crear empleado</InertiaLink>
                                    </div>
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

Create.layout = page => <Layout children={page} title="Escuela Sindical - Usuarios" pageTitle="USUARIOS" />

export default Create