import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'

import '/css/usersStyle.css'
import '/css/infoAlumno.css'
import '/css/modulos.css'
import '/css/participantes.css'
import '/css/register.css'
import '/css/users.css'
import route from 'ziggy-js';
import { Inertia } from '@inertiajs/inertia';
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { createStyles, makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';

//COMPONENTES
import Alertas from '../../components/common/Alertas';
import ModalEliminar from '../../components/common/ModalEliminar';
import ModalRestaurar from '../../components/common/ModalRestaurar';

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

const Edit = ({ user, roles, employees }) => {
    //errores de la validacion de laravel
    const { errors } = usePage().props

    const classes = useStyles();

    //valores para formulario
    const [values, setValues] = useState({
        _method: 'patch',

        email: user.email,
        foto: null,
        contrasena: "",
        confirmar_contrasena: "",
        rol: user.roles ? user.roles.length > 0 ? user.roles[0].name : "" : "",

        created_at: parseFecha(user.created_at),
        deleted_at: user.deleted_at,

        cambiar_empleado: false,
        cambiar_contrasena: false
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
        Inertia.post(route('users.update', user.id), values,
            {
                onError: () => {
                    Inertia.reload({ only: ['units'], data: { regime: values.regimen } })
                },
                onSuccess: () => {
                    setValues(values => ({
                        ...values,
                        cambiar_contrasena: false,
                    }))
                    M.updateTextFields();     
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

        var elems = document.querySelectorAll('.collapsible')
        var instances = M.Collapsible.init(elems)

        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems);

        var elems = document.querySelectorAll('.dropdown-trigger');
        var options;
        var instances = M.Dropdown.init(elems, ({inDuration: 300,
            outDuration: 225,
            constrainWidth: false,
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            stopPropogation: true})
        );

        initializeDatePicker();

        M.updateTextFields();
    }

    function initializeDatePicker() {
        var elems = document.querySelectorAll('.datepicker');
        var options = {
            format: 'yyyy-mm-dd',
            setDefaultDate: true,
            defaultDate: new Date(values.fecha_de_nacimiento),
            i18n: {
                months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                weekdaysAbbrev: ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'],
                selectMonths: true,
                selectYears: 100, // Puedes cambiarlo para mostrar más o menos años
                today: 'Hoy',
                clear: 'Limpiar',
                close: 'Ok',
                cancel: 'Cancelar',
                labelMonthNext: 'Siguiente mes',
                labelMonthPrev: 'Mes anterior',
                labelMonthSelect: 'Selecciona un mes',
                labelYearSelect: 'Selecciona un año',
            },
            onClose: ()=>{
                setValues(values => ({
                    ...values,
                    fecha_de_nacimiento: document.getElementById("fecha_de_nacimiento").value,
                }))
            },
          };
        const instancesDate = M.Datepicker.init(elems, options);
    }

    function cambiarContrasena(){
        setValues(values => ({
            ...values,
            cambiar_contrasena: !values.cambiar_contrasena,
        }))

        if(!values.cambiar_contrasena == false)
        {
            setValues(values => ({
                ...values,
                contrasena: "",
                confirmar_contrasena: ""
            }))
        }
    }

    function cambiarEmpleado(){
        setValues(values => ({
            ...values,
            cambiar_empleado: !values.cambiar_empleado,
        }))

        if(!values.cambiar_empleado == false)
        {
            setValues(values => ({
                ...values,
                empleado: null,
            }))
        }
    }

    //para mostrar la fecha de registro
    function parseFecha(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    //se ejecuta cuando la pagina se renderiza
    useEffect(() => {
        initializeSelects();
        if (values.regimen)
            Inertia.reload({ only: ['units'], data: { regime: values.regimen } })
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
        <>
            <div className="row">
                <Container>
                <div className="col contenedor s12">
                    <div className="card darken-1 cardUsers">
                        <div className="card-content">
                            
                            <div className="col s12 m9 l10 xl10 titulo-modulo left" style={{marginTop:"15px"}}>
                                {/* regresar */}
                                <InertiaLink  href={route('users.index')}  className="icon-back-course tooltipped" data-position="left" data-tooltip="Regresar"><i className="material-icons">keyboard_backspace</i></InertiaLink>
                                EDITAR USUARIO
                            </div>

                            <div className="col s12">
                                <div style={{margin: "auto"}}>
                                    <Alertas />
                                </div>
                            </div>

                            {user.deleted_at &&
                            <div className="errores col s12">
                                <ul>
                                    <li className="alert_message">
                                        <div className="col s11">Este usuario ha sido eliminado.</div>
                                        <button data-target="modalRestaurar" type="button" className="col s3 m2 center-align modal-trigger" style={{ "border": "none", "backgroundColor": "transparent", "color": "#515B60", "cursor": "pointer", marginLeft: "3%", marginRight: "auto" }}>Restaurar</button>
                                    </li>
                                </ul>  
                            </div>
                            }

                            {/* ----Formulario---- */}
                            <form onSubmit={handleSubmit}>
                                <div className="row div-form-register" style={{ "padding": "3%" }}>
                                    <div className="col s12 m6 div-division user-form-border">
                                        <p className="titles-sub" style={{ "margin": "1em 0px 1em 3%" }}>CUENTA</p>

                                        <div className="col s12" style={{ "display": "flex", "justifyContent": "center", "flexDirection": "column", "marginTop": "5px", "marginBottom": "5px" }}>
                                        <img id="profileImage" onClick={clickFoto} src={user.foto ? "/storage/fotos_perfil/" + user.foto : "/img/avatar1.png"}></img>
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
                                        <input  id="email" type="email" className={errors.email ? "validate form-control invalid" : "validate form-control"} name="email" value={values.email} onChange={handleChange} readOnly />
                                        <label htmlFor="email">Correo electrónico</label>
                                        {
                                            errors.email &&
                                            <span className="helper-text" data-error={errors.email} style={{ "marginBottom": "10px" }}>{errors.email}</span>
                                        }

                                        <p style={{"marginTop":"0px","fontFamily":"Montserrat","fontSize":"13px",color:"rgb(159, 157, 157)", cursor:"pointer"}}>¿Cambiar contraseña?</p>
                                        
                                        <div className="switch"  style={{"marginBottom":"15px"}}>
                                            <label>
                                            No
                                            <input id="cambiar_contrasena" type="checkbox"  checked={values.cambiar_contrasena} onChange={cambiarContrasena} />
                                            <span className="lever"></span>
                                            Sí
                                            </label>
                                        </div>
                                    </div>

                                    {values.cambiar_contrasena &&
                                    <>
                                        <div className="input-field col s12" style={{"marginBottom":"5px"}}>
                                            <i className="material-icons prefix">lock</i>
                                            <input  id="contrasena" type="password" className={errors.contrasena ? "validate form-control invalid" : "validate form-control"} name="contrasena" value={values.contrasena} required onChange={handleChange} />
                                            <label htmlFor="contrasena">Nueva contraseña</label>
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
                                    </>
                                    }

                                    <div className="col s12">
                                        <div className="input-field select-wrapper">
                                            <input placeholder="Selecciona un rol"  id="rol" list="roles" type="text" className={errors.rol ? "datalist-register validate form-control invalid" : "datalist-register validate"} value={values.rol} onChange={handleChange} autoComplete="off" />
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

                                    <div className="input-field col s12 input-50-re">
                                        {values.created_at ?
                                            <>
                                                <input disabled={true} id="created_at" max="2004-01-01" type="date" name="created_at" required autoComplete="created_at" value={values.created_at} />
                                                <label htmlFor="created_at">Fecha de Registro</label>
                                            </>
                                            :
                                            <>
                                                <label htmlFor="created_at">Sin fecha de registro</label>
                                            </>
                                        }
                                    </div>

                                    </div>

                                    <div className="col s12 m6 div-division">
                                        <p className="titles-sub" style={{ "margin": "1em 0px 1em 3%", marginBottom: "20px" }}>INFORMACIÓN INSTITUCIONAL</p>

                                            {user.employee ?
                                                <Grid container>
                                                    <InertiaLink href={route('employees.edit', user.employee.uuid)} style={{width: "100%", textDecoration: "none", color: "rgba(0,0,0,0.87)"}}>
                                                    <div className="col s12" style={{ "display": "flex", "justifyContent": "center", "flexDirection": "column", "marginTop": "5px", "marginBottom": "5px" }}>
                                                        <p><b>Matricula:</b> {user.employee.matricula}</p>
                                                        <p><b>Nombre:</b> {user.employee.nombre} {user.employee.apellido_p} {user.employee.apellido_m}</p>
                                                        <p><b>Regimen:</b> {user.employee.unit && user.employee.unit.regime.nombre || "Sin régimen"}</p>
                                                        <p><b>Unidad:</b> {user.employee.unit && user.employee.unit.nombre || "Sin unidad"}</p>
                                                        <p><b>Categoría:</b> {user.employee.category && user.employee.category.nombre || "Sin categoría"}</p>
                                                        <b>Ver empleado</b>
                                                    </div>
                                                    </InertiaLink>
                                                </Grid>
                                            :
                                                <Grid container style={{padding: "0 .75rem"}}>
                                                    Este usuario no tiene ningún empleado asociado.
                                                </Grid>
                                            }

                                            <p style={{"marginTop":"0px","fontFamily":"Montserrat","fontSize":"13px",color:"rgb(159, 157, 157)", cursor:"pointer"}}>¿Cambiar empleado?</p>
                                            
                                            <div className="switch"  style={{"marginBottom":"15px"}}>
                                                <label>
                                                No
                                                <input id="cambiar_empleado" type="checkbox"  checked={values.cambiar_empleado} onChange={cambiarEmpleado} />
                                                <span className="lever"></span>
                                                Sí
                                                </label>
                                            </div>

                                            {values.cambiar_empleado &&
                                            <>
                                                <Autocomplete
                                                    {...defaultProps}
                                                    renderInput={(params) => (
                                                    <TextField {...params} id="empleado" className={classes.textField} label="Empleado" variant="standard" />
                                                    )}
                                                />
                                                {
                                                    errors.contrasena &&
                                                    <div className="helper-text" data-error={errors.contrasena} style={{ "marginBottom": "10px" }}>{errors.contrasena}</div>
                                                }
                                            </>
                                            }
                                    </div>
                                </div>
                                <div className="row container-buttons">
                                    {
                                    !user.deleted_at && 
                                        <button data-target="modalEliminar" type="button" className="col s3 m2 center-align modal-trigger" style={{ "border": "none", "backgroundColor": "transparent", "color": "#515B60", "cursor": "pointer", marginLeft: "3%", marginRight: "auto" }}><i className="material-icons">delete</i></button>
                                    }
                                    <button type="button" className=" center-align  btn waves-effect waves-light cancelar" style={{ marginRight: "15px" }} onClick={cancelEditUser}>Cancelar</button>
                                    < button type="submit" className=" center-align btn waves-effect waves-light guardar" style={{ marginRight: "3%", marginLeft: "0" }}>
                                        Guardar
                                            < i className="material-icons right" > save</i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                </Container>
            </div >

            <ModalEliminar url={route('users.delete', user.id)} nombre={user.email} tipo="usuario" />
            
            <ModalRestaurar url={route('users.restore',user.id)} nombre={user.email} tipo="usuario" />
        </>
    )
}

Edit.layout = page => <Layout children={page} title="Escuela Sindical - Comité" pageTitle="Comité" />

export default Edit