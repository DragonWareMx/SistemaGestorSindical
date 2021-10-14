import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import { InertiaLink, usePage } from '@inertiajs/inertia-react'

import '/css/usersStyle.css'
import '/css/infoAlumno.css'
import '/css/modulos.css'
import '/css/participantes.css'
import '/css/register.css'
import route from 'ziggy-js';
import { Inertia } from '@inertiajs/inertia';

//COMPONENTES
import Alertas from '../../components/common/Alertas';
import ModalEliminar from '../../components/common/ModalEliminar';
import ModalRestaurar from '../../components/common/ModalRestaurar';



const Edit = ({ user, categories, regimes, units, roles }) => {
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
        matricula: user.matricula || "",
        categoria: user.category && user.category.nombre || "",
        unidad: user.unit && user.unit.nombre || "",
        regimen: user.unit && user.unit.regime.nombre || "",
        estado: user.estado || "",
        ciudad: user.ciudad || "",
        colonia: user.colonia || "",
        calle: user.calle || "",
        codigo_postal: user.cp || "",
        numero_exterior: user.num_ext || "",
        numero_interior: user.num_int || "",
        tarjeton_de_pago: "",
        created_at: parseFecha(user.created_at),
        foto: null,
        deleted_at: user.deleted_at,
        rol: user.roles[0].name || "",
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
        Inertia.post(route('usuarios.update', user.id), values,
            {
                onError: () => {
                    Inertia.reload({ only: ['units'], data: { regime: values.regimen } })
                },
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
        Inertia.get(route('usuarios'))
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

    function changeTarjeton(e){
        var inputFotos = document.getElementById('tarjeton_de_pago');
        if (inputFotos.files && inputFotos.files[0]) {
            setValues(values => ({
                ...values,
                tarjeton_de_pago: inputFotos.files[0],
            }))
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

    function cambiarTarjeton(){
        setValues(values => ({
            ...values,
            cambiar_tarjeton: !values.cambiar_tarjeton,
        }))

        if(!values.cambiar_tarjeton == false)
        {
            setValues(values => ({
                ...values,
                tarjeton_de_pago: ""
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

    return (
        <>
            <div className="row">
                <div className="col contenedor s12">
                    <div className="card darken-1 cardUsers">
                        <div className="card-content">
                            
                            <div className="col s12 m9 l10 xl10 titulo-modulo left" style={{marginTop:"15px"}}>
                                {/* regresar */}
                                <InertiaLink  href={route('usuarios')}  className="icon-back-course tooltipped" data-position="left" data-tooltip="Regresar"><i className="material-icons">keyboard_backspace</i></InertiaLink>
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
                                        <p className="titles-sub" style={{ "margin": "1em 0px 1em 3%" }}>INFORMACIÓN PERSONAL</p>

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
                                            <input  id="nombre" type="text" className={errors.nombre ? "validate form-control invalid" : "validate form-control"} name="nombre" required autoComplete="nombre" value={values.nombre} onChange={handleChange} autoFocus maxLength="255" />
                                            <label htmlFor="nombre">Nombre</label>
                                            {
                                                errors.nombre &&
                                                <span className="helper-text" data-error={errors.nombre} style={{ "marginBottom": "10px" }}>{errors.nombre}</span>
                                            }
                                        </div>

                                        <div className="input-field col s12 input-50-re">
                                            <input  id="apellido_paterno" type="text" className={errors.apellido_paterno ? "validate form-control invalid" : "validate form-control"} name="apellido_paterno" value={values.apellido_paterno} onChange={handleChange} required autoComplete="apellido_paterno" maxLength="255" />
                                            <label htmlFor="apellido_paterno">Apellido Paterno</label>
                                            {
                                                errors.apellido_paterno &&
                                                <span className="helper-text" data-error={errors.apellido_paterno} style={{ "marginBottom": "10px" }}>{errors.apellido_paterno}</span>
                                            }

                                        </div>

                                        <div className="input-field col s12 input-50-re">
                                            <input  id="apellido_materno" type="text" className={errors.apellido_materno ? "validate form-control invalid" : "validate form-control"} name="apellido_materno" value={values.apellido_materno} onChange={handleChange} autoComplete="apellido_materno" maxLength="255" />
                                            <label htmlFor="apellido_materno">Apellido Materno (opcional)</label>
                                            {
                                                errors.apellido_materno &&
                                                <span className="helper-text" data-error={errors.apellido_materno} style={{ "marginBottom": "10px" }}>{errors.apellido_materno}</span>
                                            }
                                        </div>

                                        <div className="input-field col s6 input-50-re">
                                            <input  id="fecha_de_nacimiento" type="text" className={errors.fecha_de_nacimiento ? "validate datepicker invalid" : "validate datepicker"} name="fecha_de_nacimiento" required autoComplete="fecha_de_nacimiento" value={values.fecha_de_nacimiento} readOnly />
                                            <label htmlFor="fecha_de_nacimiento">Fec. Nacimiento</label>
                                            {
                                                errors.fecha_de_nacimiento &&
                                                <span className="helper-text" data-error={errors.fecha_de_nacimiento} style={{ "marginBottom": "10px" }}>{errors.fecha_de_nacimiento}</span>
                                            }
                                        </div>

                                        <div className="input-field col s6 input-50-re">
                                            <select  id="sexo" name="sexo" autoComplete="sexo" value={values.sexo} onChange={handleChange} className={errors.sexo ? "input-field invalid" : "input-field"}>
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

                                        <p className="titles-sub" style={{ "margin": "1em 0px 1em 3%", "marginBottom":"20px"}}>DIRECCIÓN</p>

                                        <div className="input-field col s12 ">
                                            <input  maxLength="50" id="estado" type="text" className={errors.estado ? "validate form-control invalid" : "validate"} name="estado" value={values.estado} required autoComplete="estado" onChange={handleChange} />
                                            <label htmlFor="estado">Estado</label>
                                            {
                                                errors.estado &&
                                                <span className="helper-text" data-error={errors.estado} style={{ "marginBottom": "10px" }}>{errors.estado}</span>
                                            }
                                        </div>

                                        <div className="input-field col s6 input-50-re">
                                            <input  maxLength="60" id="ciudad" type="text" className={errors.ciudad ? "validate form-control invalid" : "validate"} name="ciudad" value={values.ciudad} required autoComplete="ciudad" onChange={handleChange} />
                                            <label htmlFor="ciudad">Ciudad</label>
                                            {
                                                errors.ciudad &&
                                                <span className="helper-text" data-error={errors.ciudad} style={{ "marginBottom": "10px" }}>{errors.ciudad}</span>
                                            }
                                        </div>

                                        <div className="input-field col s6 input-50-re">
                                            <input  maxLength="100" id="colonia" type="text" className={errors.colonia ? "validate form-control invalid" : "validate"} name="colonia" value={values.colonia} required autoComplete="colonia" onChange={handleChange} />
                                            <label htmlFor="colonia">Colonia</label>
                                            {
                                                errors.colonia &&
                                                <span className="helper-text" data-error={errors.colonia} style={{ "marginBottom": "10px" }}>{errors.colonia}</span>
                                            }
                                        </div>

                                        <div className="input-field col s6 input-50-re">
                                            <input  maxLength="100" id="calle" type="text" className={errors.calle ? "validate form-control invalid" : "validate"} name="calle" value={values.calle} required autoComplete="calle" onChange={handleChange} />
                                            <label htmlFor="calle">Calle</label>
                                            {
                                                errors.calle &&
                                                <span className="helper-text" data-error={errors.calle} style={{ "marginBottom": "10px" }}>{errors.calle}</span>
                                            }
                                        </div>

                                        <div className="input-field col s6 input-50-re">
                                            <input  maxLength="9" id="codigo_postal" type="text" className={errors.codigo_postal ? "validate form-control invalid" : "validate"} name="codigo_postal" value={values.codigo_postal} required autoComplete="codigo_postal" onChange={handleChange} />
                                            <label htmlFor="codigo_postal">Código Postal</label>
                                            {
                                                errors.codigo_postal &&
                                                <span className="helper-text" data-error={errors.codigo_postal} style={{ "marginBottom": "10px" }}>{errors.codigo_postal}</span>
                                            }
                                        </div>

                                        <div className="input-field col s6 input-50-re">
                                            <input  maxLength="10" id="numero_exterior" type="text" className={errors.numero_exterior ? "validate form-control invalid" : "validate"} name="numero_exterior" value={values.numero_exterior} required autoComplete="numero_exterior" onChange={handleChange} />
                                            <label htmlFor="numero_exterior">No. Exterior</label>
                                            {
                                                errors.numero_exterior &&
                                                <span className="helper-text" data-error={errors.numero_exterior} style={{ "marginBottom": "10px" }}>{errors.numero_exterior}</span>
                                            }
                                        </div>

                                        <div className="input-field col s6 input-50-re">
                                            <input  maxLength="10" id="numero_interior" type="text" className={errors.numero_interior ? "validate form-control invalid" : "validate"} name="numero_interior" value={values.numero_interior} autoComplete="numero_interior" onChange={handleChange} />
                                            <label htmlFor="numero_interior">No. Interior (Op)</label>
                                            {
                                                errors.numero_interior &&
                                                <span className="helper-text" data-error={errors.numero_interior} style={{ "marginBottom": "10px" }}>{errors.numero_interior}</span>
                                            }
                                        </div>

                                    </div>

                                    <div className="col s12 m6 div-division">
                                        <p className="titles-sub" style={{ "margin": "1em 0px 1em 3%", marginBottom: "20px" }}>INFORMACIÓN INSTITUCIONAL</p>

                                        <div className="input-field col s12">
                                            <input  id="matricula" type="text" className={errors.matricula ? "validate form-control invalid" : "validate"} name="matricula" value={values.matricula} onChange={handleChange} required autoComplete="matricula" maxLength="10" />
                                            <label htmlFor="matricula">Matrícula</label>
                                            {
                                                errors.matricula &&
                                                <span className="helper-text" data-error={errors.matricula} style={{ "marginBottom": "10px" }}>{errors.matricula}</span>
                                            }
                                        </div>

                                        <div className="input-field col s12">
                                            <select  id="regimen" name="regimen" value={values.regimen} onChange={handleChange}>
                                                <option value="" disabled>Selecciona una opción</option>
                                                {regimes && regimes.length > 0 &&
                                                    regimes.map(regime => (
                                                        <option key={regime.nombre} value={regime.nombre}>{regime.nombre}</option>
                                                    ))
                                                }
                                            </select>
                                            <label>Regimen</label>
                                            {
                                                errors.regimen &&
                                                <span className="helper-text" data-error={errors.regimen} style={{ "marginBottom": "10px", color: "#F44336" }}>{errors.regimen}</span>
                                            }
                                        </div>

                                        <div className="col s12" style={{ "marginTop": "5px" }}>
                                            <div className="input-field select-wrapper">
                                                <input placeholder={values.regimen ? "Selecciona una unidad" : "Selecciona primerio un régimen"}  id="unidad" list="unidades" type="text" className={errors.unidad ? "datalist-register validate form-control invalid" : "datalist-register validate"} value={values.unidad} onChange={handleChange} required autoComplete="off" />
                                                <label htmlFor="unidad">Unidad</label>
                                                <svg className="caret" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>
                                                {
                                                    errors.unidad &&
                                                    <span className="helper-text" data-error={errors.unidad} style={{ "marginBottom": "10px" }}>{errors.unidad}</span>
                                                }
                                            </div>
                                            <datalist id="unidades">
                                                {
                                                    units && units.length > 0 &&
                                                    units.map(units => (
                                                        <option key={units.nombre} value={units.nombre} />
                                                    ))
                                                }
                                            </datalist>
                                        </div>

                                        <div className="col s12">
                                            <div className="input-field select-wrapper">
                                                <input placeholder="Selecciona una categoría"  id="categoria" list="categorias" type="text" className={errors.unidad ? "datalist-register validate form-control invalid" : "datalist-register validate"} value={values.categoria} onChange={handleChange} required autoComplete="off" />
                                                <svg className="caret" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>
                                                <label htmlFor="categoria">Categoría</label>
                                                {
                                                    errors.categoria &&
                                                    <span className="helper-text" data-error={errors.categoria} style={{ "marginBottom": "10px" }}>{errors.categoria}</span>
                                                }
                                            </div>
                                            <datalist id="categorias">
                                                {
                                                    categories && categories.length > 0 &&
                                                    categories.map(category => (
                                                        <option key={category.nombre} value={category.nombre} />
                                                    ))
                                                }
                                            </datalist>
                                        </div>

                                        <div className="area col s12" style={{marginBottom:"4%"}}>
                                            
                                            {!values.cambiar_tarjeton &&
                                                <p style={{ "marginTop": "0px", "fontFamily": "Montserrat", "fontSize": "13px" }}>Tarjetón de pago <a target="_blank" href={user == null || user.tarjeton_pago == null ? null : "/storage/tarjetones_pago/" + user.tarjeton_pago}>{user != null && user.tarjeton_pago}</a><i style={{ "color": "#7E7E7E" }} className="material-icons tiny">description</i></p>
                                            }

                                            <p style={{"marginTop":"0px","fontFamily":"Montserrat","fontSize":"13px",color:"rgb(159, 157, 157)", cursor:"pointer"}}>¿Cambiar tarjetón de pago?</p>
                                            
                                            <div className="switch">
                                                <label>
                                                No
                                                <input id="cambiar_tarjeton" type="checkbox" checked={values.cambiar_tarjeton} onChange={cambiarTarjeton} />
                                                <span className="lever"></span>
                                                Sí
                                                </label>
                                            </div>

                                            {values.cambiar_tarjeton &&
                                            <>
                                                <p style={{"marginTop":"0px","fontFamily":"Montserrat","fontSize":"13px",color:"rgb(159, 157, 157)", cursor:"pointer"}}>Tarjetón de pago<i className="material-icons tiny tooltipped" data-position="top" data-tooltip="Archivo (PDF o imagen) para validar que seas un usuario activo">help_outline</i></p>
                                                <div className="file-field input-field" style={{"border": "1px dashed rgba(159, 157, 157, 0.6)", boxSizing: "border-box", borderRadius: "4px"}}>
                                                    <div className="col s12">
                                                    <span style={{fontSize:"12px", textAlign: "center", paddingTop:"10px"}} className="col s12">Arrastre aquí el archivo o <b>clic</b> para seleccionarlo</span>
                                                    <input type="file" accept="image/png, image/jpeg, image/jpg, application/pdf"  className={errors.tarjeton_de_pago ? "form-control is-invalid" : "form-control"} id="tarjeton_de_pago" name="tarjeton_de_pago" required autoComplete="tarjeton" onChange={changeTarjeton} />
                                                    {
                                                        errors.tarjeton_de_pago && 
                                                        <span className="helper-text" data-error={errors.tarjeton_de_pago} style={{"marginBottom":"10px", color: "#F44336"}}>{errors.tarjeton_de_pago}</span>
                                                    }
                                                    </div>
                                                    <div className="file-path-wrapper">
                                                        <input className="file-path validate" type="text" />
                                                    </div>
                                                </div>
                                            </>
                                            }
                                        </div>

                                        <p className="titles-sub" style={{ "margin": "1em 0px 1em 3%", "marginBottom":"20px" }}>CUENTA</p>

                                        <div className="input-field col s12">
                                            {/* <i className="material-icons prefix">account_circle</i> */}
                                            <input  id="email" type="email" className={errors.email ? "validate form-control invalid" : "validate form-control"} name="email" value={values.email} required autoComplete="email" onChange={handleChange} />
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

                    {user.roles && user.roles.length > 0 && user.roles[0].name == "Alumno" &&
                    <ul className="collapsible">
                        <li className="active">
                            <div className="collapsible-header" style={{"color":"#108058"}}><i className="material-icons">school</i>Cursos</div>
                            <div className="collapsible-body collapsible-padding padding3">

                                <div style={{"fontSize":"17px","color":"#134E39","marginTop":"15px"}}>CURSOS ACTUALES</div>
                                    {user.active_courses &&  user.active_courses.length > 0 ? 
                                        <div className="row">
                                            {user.active_courses.map(curso=>(
                                                <div key={curso.id}><CourseCard curso={curso} actuales={true}/></div>
                                            ))}
                                        </div>
                                        : 
                                        <div>Este usuario no pertenece a ningún curso activo</div>
                                    }

                                <div style={{"fontSize":"17px","color":"#134E39","marginTop":"15px"}}>HISTORIAL DE CURSOS</div>
                                    {
                                    user.finished_courses &&  user.finished_courses.length > 0 ? 
                                    <div className="row">
                                        {user.finished_courses.map(curso=>(
                                            <div key={curso.id}><CourseCard curso={curso} actuales={false}/></div>
                                        ))}
                                    </div>
                                    : 
                                    <div>Este usuario aún no tiene cursos terminados</div>
                                    }
                                </div>
                        </li>
                    </ul>
                    }

                    {user.roles && user.roles.length > 0 && user.roles[0].name == "Ponente" &&
                    <ul className="collapsible">
                        <li className="active">
                            <div className="collapsible-header" style={{"color":"#108058"}}><i className="material-icons">school</i>Cursos</div>
                            <div className="collapsible-body collapsible-padding padding3">

                                <div style={{"fontSize":"17px","color":"#134E39","marginTop":"15px"}}>CURSOS ACTUALES</div>
                                    {user.teacher_active_courses &&  user.teacher_active_courses.length > 0 ? 
                                        <div className="row">
                                            {user.teacher_active_courses.map(curso=>(
                                                <div key={curso.id}><CourseCard curso={curso} actuales={true}/></div>
                                            ))}
                                        </div>
                                        : 
                                        <div>Este usuario no pertenece a ningún curso activo</div>
                                    }

                                <div style={{"fontSize":"17px","color":"#134E39","marginTop":"15px"}}>HISTORIAL DE CURSOS</div>
                                    {
                                    user.teacher_finished_courses &&  user.teacher_finished_courses.length > 0 ? 
                                    <div className="row">
                                        {user.teacher_finished_courses.map(curso=>(
                                            <div key={curso.id}><CourseCard curso={curso} actuales={false}/></div>
                                        ))}
                                    </div>
                                    : 
                                    <div>Este usuario aún no tiene cursos terminados</div>
                                    }
                                </div>
                        </li>
                    </ul>
                    }
                </div>
            </div >

            <ModalEliminar url={route('usuarios.delete', user.id)} nombre={user.nombre} tipo="usuario" />
            
            <ModalRestaurar url={route('usuarios.restore',user.id)} nombre={user.nombre} tipo="usuario" />
        </>
    )
}

Edit.layout = page => <Layout children={page} title="Escuela Sindical - Usuarios" pageTitle="USUARIOS" />

export default Edit