import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'

import '../../styles/usersStyle.css'
import '/css/infoAlumno.css'
import '/css/register.css'
import '/css/modulos.css'
import '/css/participantes.css'
import route from 'ziggy-js';
import { Inertia } from '@inertiajs/inertia';

//COMPONENTES
import Alertas from '../../components/common/Alertas';


const Configuracion = ({ user }) => {
    //errores de la validacion de laravel
    const { errors } = usePage().props

    //valores para formulario
    const [values, setValues] = useState({
        _method: 'patch',
        nombre: user.nombre || "",
        apellido_paterno: user.apellido_p || "",
        apellido_materno: user.apellido_m || "",
        email: user.email || "",
        contrasena: "",
        confirmar_contrasena: "",
        fecha_de_nacimiento: user.fecha_nac || "",
        sexo: user.sexo || "",
        estado: user.estado || "",
        ciudad: user.ciudad || "",
        colonia: user.colonia || "",
        calle: user.calle || "",
        codigo_postal: user.cp || "",
        numero_exterior: user.num_ext || "",
        numero_interior: user.num_int || "",
        tarjeton_de_pago: "",
        foto: null,
        deleted_at: user.deleted_at,
        cambiar_tarjeton: false,
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

    }

    //manda el forumulario
    function handleSubmit(e) {
        e.preventDefault()
        Inertia.post(route('perfil.update'), values,
            {
                onSuccess: () => {
                    setValues(values => ({
                        ...values,
                        cambiar_contrasena: false,
                        cambiar_tarjeton: false
                    }))
                    M.updateTextFields();     
                }
            }
        )
    }

    //boton de cancelar
    function cancelEditUser() {
        Inertia.get(route('perfil'))
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
        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems);
        var elems = document.querySelectorAll('.collapsible')
        var instances = M.Collapsible.init(elems)

        initializeDatePicker()

        M.updateTextFields();
    }

    function initializeDatePicker() {
        var elems = document.querySelectorAll('.datepicker');
        var options = {
            format: 'yyyy-mm-dd',
            setDefaultDate: false,
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

    //se ejecuta cuando la pagina se renderiza
    useEffect(() => {
        initializeSelects();
    }, [])

    return (
        <>
            <div className="row">
                <div className="col contenedor s12">
                    <div className="card darken-1 cardUsers">
                        <div className="card-content">
                            <div className="col s12 m9 l10 xl10 titulo-modulo left" style={{marginTop:"15px"}}>
                                {/* regresar */}
                                <InertiaLink  href={route('perfil')}  className="icon-back-course tooltipped" data-position="left" data-tooltip="Regresar"><i className="material-icons">keyboard_backspace</i></InertiaLink>
                                CONFIGURACIÓN
                            </div>
                            
                            <div className="col s12">
                                <div style={{margin: "auto"}}>
                                    <Alertas />
                                </div>
                            </div>

                            {/* ----Formulario---- */}
                            <form onSubmit={handleSubmit}>
                                <div className="row div-form-register" style={{ "padding": "3%" }}>
                                    <div className="col s12 m6 div-division">
                                        <p className="titles-sub" style={{ "margin": "1em 0px 1em 3%" , "marginBottom":"15px"}}>INFORMACIÓN PERSONAL</p>

                                        <div className="col s12" style={{ "display": "flex", "justifyContent": "center", "flexDirection": "column", "marginTop": "5px", "marginBottom": "5px" }}>
                                            <img id="profileImage" onClick={clickFoto} src={user.foto ? "/storage/fotos_perfil/"+user.foto : "/storage/fotos_perfil/avatar1.jpg"}></img>
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
                                            <input disabled={false} id="nombre" type="text" className={errors.nombre ? "validate form-control invalid" : "validate form-control"} name="nombre" required autoComplete="nombre" value={values.nombre} onChange={handleChange} autoFocus maxLength="255" />
                                            <label htmlFor="nombre">Nombre</label>
                                            {
                                                errors.nombre &&
                                                <span className="helper-text" data-error={errors.nombre} style={{ "marginBottom": "10px" }}>{errors.nombre}</span>
                                            }
                                        </div>

                                        <div className="input-field col s12 input-50-re">
                                            <input disabled={false} id="apellido_paterno" type="text" className={errors.apellido_paterno ? "validate form-control invalid" : "validate form-control"} name="apellido_paterno" value={values.apellido_paterno} onChange={handleChange} required autoComplete="apellido_paterno" maxLength="255" />
                                            <label htmlFor="apellido_paterno">Apellido Paterno</label>
                                            {
                                                errors.apellido_paterno &&
                                                <span className="helper-text" data-error={errors.apellido_paterno} style={{ "marginBottom": "10px" }}>{errors.apellido_paterno}</span>
                                            }

                                        </div>

                                        <div className="input-field col s12 input-50-re">
                                            <input disabled={false} id="apellido_materno" type="text" className={errors.apellido_materno ? "validate form-control invalid" : "validate form-control"} name="apellido_materno" value={values.apellido_materno} onChange={handleChange} autoComplete="apellido_materno" maxLength="255" />
                                            <label htmlFor="apellido_materno">Apellido Materno (opcional)</label>
                                            {
                                                errors.apellido_materno &&
                                                <span className="helper-text" data-error={errors.apellido_materno} style={{ "marginBottom": "10px" }}>{errors.apellido_materno}</span>
                                            }
                                        </div>

                                        <div className="input-field col s12 input-50-re">
                                            <input id="fecha_de_nacimiento" className={errors.fecha_de_nacimiento ? "validate datepicker invalid" : "validate datepicker"} type="text" name="fecha_de_nacimiento" required autoComplete="fecha_de_nacimiento" value={values.fecha_de_nacimiento} readOnly />
                                            <label htmlFor="fecha_de_nacimiento">Fecha de Nacimiento</label>
                                            {
                                                errors.fecha_de_nacimiento &&
                                                <span className="helper-text" data-error={errors.fecha_de_nacimiento} style={{ "marginBottom": "10px" }}>{errors.fecha_de_nacimiento}</span>
                                            }
                                        </div>

                                        <div className="input-field col s12 input-50-re">
                                            <select disabled={false} id="sexo" name="sexo" required autoComplete="sexo" value={values.sexo} onChange={handleChange} className={errors.sexo ? "input-field invalid" : "input-field"}>
                                                <option value="" disabled>Selecciona una opción</option>
                                                <option value="m">Femenino</option>
                                                <option value="h">Masculino</option>
                                                <option value="o">Otro</option>
                                            </select>
                                            <label>Sexo</label>
                                            {
                                                errors.sexo &&
                                                <span className="helper-text" data-error={errors.sexo} style={{ "marginBottom": "10px", color: "#F44336" }}>{errors.sexo}</span>
                                            }
                                        </div>
                                        
                                    </div>

                                    <div className="col s12 m6 div-division user-form-border2">
                                        <p className="titles-sub" style={{ "margin": "1em 0px 1em 3%" , "marginBottom":"25px" }}>DIRECCIÓN</p>

                                        <div className="input-field col s12 ">
                                            <input disabled={false} maxLength="50" id="estado" type="text" className={errors.estado ? "validate form-control invalid" : "validate"} name="estado" value={values.estado} required autoComplete="estado" onChange={handleChange} />
                                            <label htmlFor="estado">Estado</label>
                                            {
                                                errors.estado &&
                                                <span className="helper-text" data-error={errors.estado} style={{ "marginBottom": "10px" }}>{errors.estado}</span>
                                            }
                                        </div>

                                        <div className="input-field col s6 input-50-re">
                                            <input disabled={false} maxLength="60" id="ciudad" type="text" className={errors.ciudad ? "validate form-control invalid" : "validate"} name="ciudad" value={values.ciudad} required autoComplete="ciudad" onChange={handleChange} />
                                            <label htmlFor="ciudad">Ciudad</label>
                                            {
                                                errors.ciudad &&
                                                <span className="helper-text" data-error={errors.ciudad} style={{ "marginBottom": "10px" }}>{errors.ciudad}</span>
                                            }
                                        </div>

                                        <div className="input-field col s6 input-50-re">
                                            <input disabled={false} maxLength="100" id="colonia" type="text" className={errors.colonia ? "validate form-control invalid" : "validate"} name="colonia" value={values.colonia} required autoComplete="colonia" onChange={handleChange} />
                                            <label htmlFor="colonia">Colonia</label>
                                            {
                                                errors.colonia &&
                                                <span className="helper-text" data-error={errors.colonia} style={{ "marginBottom": "10px" }}>{errors.colonia}</span>
                                            }
                                        </div>

                                        <div className="input-field col s6 input-50-re">
                                            <input disabled={false} maxLength="100" id="calle" type="text" className={errors.calle ? "validate form-control invalid" : "validate"} name="calle" value={values.calle} required autoComplete="calle" onChange={handleChange} />
                                            <label htmlFor="calle">Calle</label>
                                            {
                                                errors.calle &&
                                                <span className="helper-text" data-error={errors.calle} style={{ "marginBottom": "10px" }}>{errors.calle}</span>
                                            }
                                        </div>

                                        <div className="input-field col s6 input-50-re">
                                            <input disabled={false} maxLength="10" id="codigo_postal" type="text" className={errors.codigo_postal ? "validate form-control invalid" : "validate"} name="codigo_postal" value={values.codigo_postal} required autoComplete="codigo_postal" onChange={handleChange} />
                                            <label htmlFor="codigo_postal">Código Postal</label>
                                            {
                                                errors.codigo_postal &&
                                                <span className="helper-text" data-error={errors.codigo_postal} style={{ "marginBottom": "10px" }}>{errors.codigo_postal}</span>
                                            }
                                        </div>

                                        <div className="input-field col s6 input-50-re">
                                            <input disabled={false} maxLength="10" id="numero_exterior" type="text" className={errors.numero_exterior ? "validate form-control invalid" : "validate"} name="numero_exterior" value={values.numero_exterior} required autoComplete="numero_exterior" onChange={handleChange} />
                                            <label htmlFor="numero_exterior">No. Exterior</label>
                                            {
                                                errors.numero_exterior &&
                                                <span className="helper-text" data-error={errors.numero_exterior} style={{ "marginBottom": "10px" }}>{errors.numero_exterior}</span>
                                            }
                                        </div>

                                        <div className="input-field col s6 input-50-re">
                                            <input disabled={false} maxLength="10" id="numero_interior" type="text" className={errors.numero_interior ? "validate form-control invalid" : "validate"} name="numero_interior" value={values.numero_interior} autoComplete="numero_interior" onChange={handleChange} />
                                            <label htmlFor="numero_interior">No. Interior (opcional)</label>
                                            {
                                                errors.numero_interior &&
                                                <span className="helper-text" data-error={errors.numero_interior} style={{ "marginBottom": "10px" }}>{errors.numero_interior}</span>
                                            }
                                        </div>

                                        <p className="titles-sub" style={{ "margin": "1em 0px 1em 3%" , "marginBottom":"25px" }}>CUENTA</p>

                                        <div className="input-field col s12">
                                            <input disabled={true} id="email" type="email" className={errors.email ? "validate form-control invalid" : "validate form-control"} name="email" value={values.email} required autoComplete="email" onChange={handleChange} />
                                            <label htmlFor="email">Correo electrónico</label>
                                            {
                                                errors.email &&
                                                <span className="helper-text" data-error={errors.email} style={{ "marginBottom": "10px" }}>{errors.email}</span>
                                            }

                                            <p style={{"marginTop":"0px","fontFamily":"Montserrat","fontSize":"13px",color:"rgb(159, 157, 157)", cursor:"pointer"}}>¿Cambiar contraseña?</p>
                                            
                                            <div className="switch">
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
                                            <div className="input-field col s12">
                                                <i className="material-icons prefix">lock</i>
                                                <input disabled={false} id="contrasena" type="password" className={errors.contrasena ? "validate form-control invalid" : "validate form-control"} name="contrasena" value={values.contrasena} required onChange={handleChange} />
                                                <label htmlFor="contrasena">Nueva contraseña</label>
                                                {
                                                    errors.contrasena &&
                                                    <span className="helper-text" data-error={errors.contrasena} style={{ "marginBottom": "10px" }}>{errors.contrasena}</span>
                                                }
                                            </div>

                                            <div className="input-field col s12">
                                                <i className="material-icons prefix">lock</i>
                                                <input disabled={false} id="confirmar_contrasena" type="password" className={errors.confirmar_contrasena ? "validate form-control invalid" : "validate form-control"} name="confirmar_contrasena" value={values.confirmar_contrasena} required onChange={handleChange} />
                                                <label htmlFor="confirmar_contrasena">Confirmar contraseña</label>
                                                {
                                                    errors.confirmar_contrasena &&
                                                    <span className="helper-text" data-error={errors.confirmar_contrasena} style={{ "marginBottom": "10px" }}>{errors.confirmar_contrasena}</span>
                                                }
                                            </div>
                                        </>
                                        }

                                    </div>
                                </div>
                                <div className="row container-buttons">
                                    <button type="button" className=" center-align  btn waves-effect waves-light cancelar" style={{ marginRight: "15px" }} onClick={cancelEditUser}>Cancelar</button>
                                    <button type="submit" className=" center-align btn waves-effect waves-light guardar" style={{ marginRight: "3%", marginLeft: "0" }}>
                                        Guardar
                                            < i className="material-icons right" > save</i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}

Configuracion.layout = page => <Layout children={page} title="Escuela Sindical - Configuración" pageTitle="CONFIGURACIÓN" />

export default Configuracion