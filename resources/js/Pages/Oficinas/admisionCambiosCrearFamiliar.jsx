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


const Create = ({ categories, regimes, units, roles }) => {
    //errores de la validacion de laravel
    const { errors } = usePage().props

    //valores para formulario
    const [values, setValues] = useState({
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        fecha_de_nacimiento: "",
        sexo: "",
        antiguedad: "",

        estado: "",
        ciudad: "",
        colonia: "",
        calle: "",
        codigo_postal: "",
        numero_exterior: "",
        numero_interior: "",
        telefono: "",

        matricula: "",
        regimen: "",
        unidad: "",
        categoria: "",

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
        Inertia.post(route('admisionCambiosStoreFamiliar'), values,
            {
                onError: () => {
                    Inertia.reload({ only: ['units'], data: { regime: values.regimen } })
                }
            }
        )
    }

    //boton de cancelar
    function cancelEditUser() {
        Inertia.get(route('admisionCambiosCreate'));
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
        initializeDatePicker();

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

        var elems2 = document.querySelectorAll('.datepicker2');
        var options2 = {
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
                    antiguedad: document.getElementById("antiguedad").value,
                }))
            },
        };
        const instancesDate2 = M.Datepicker.init(elems2, options2);
    }

    //se ejecuta cuando la pagina se renderiza
    useEffect(() => {
        initializeSelects();
        if (values.regimen)
            Inertia.reload({ only: ['units'], data: { regime: values.regimen } })
    }, [])

    return (
        <div className="row">
            <Container>
            <div className="col contenedor s12">
                <div className="card darken-1 cardUsers">
                    <div className="card-content">
                        <div className="col s12 m9 l10 xl10 titulo-modulo left" style={{marginTop:"15px"}}>
                            {/* regresar */}
                            <InertiaLink  href={route('admisionCambiosCreate')}  className="icon-back-course tooltipped" data-position="left" data-tooltip="Regresar"><i className="material-icons">keyboard_backspace</i></InertiaLink>
                            AGREGAR EMPLEADO
                        </div>
                        
                        <div className="col s12">
                            <Alertas />
                        </div>
                        {/* ----Formulario---- */}
                        <form onSubmit={handleSubmit}>
                            <div className="row div-form-register" style={{ "padding": "3%" }}>
                                <div className="col s12 m6 div-division user-form-border">
                                    <p className="titles-sub" style={{ "margin": "1em 0px 1em 3%" }}>INFORMACIÓN PERSONAL</p>

                                    <div className="input-field col s12">
                                        <input id="nombre" type="text" className={errors.nombre ? "validate form-control invalid" : "validate form-control"} name="nombre" required autoComplete="nombre" value={values.nombre} onChange={handleChange} autoFocus maxLength="255" />
                                        <label htmlFor="nombre">Nombre</label>
                                        {
                                            errors.nombre &&
                                            <span className="helper-text" data-error={errors.nombre} style={{ "marginBottom": "10px" }}>{errors.nombre}</span>
                                        }
                                    </div>

                                    <div className="input-field col s12 input-50-re">
                                        <input id="apellido_paterno" type="text" className={errors.apellido_paterno ? "validate form-control invalid" : "validate form-control"} name="apellido_paterno" value={values.apellido_paterno} onChange={handleChange} required autoComplete="apellido_paterno" maxLength="255" />
                                        <label htmlFor="apellido_paterno">Apellido Paterno</label>
                                        {
                                            errors.apellido_paterno &&
                                            <span className="helper-text" data-error={errors.apellido_paterno} style={{ "marginBottom": "10px" }}>{errors.apellido_paterno}</span>
                                        }
                                    </div>

                                    <div className="input-field col s12 input-50-re">
                                        <input id="apellido_materno" type="text" className={errors.apellido_materno ? "validate form-control invalid" : "validate form-control"} name="apellido_materno" value={values.apellido_materno} onChange={handleChange} autoComplete="apellido_materno" maxLength="255" />
                                        <label htmlFor="apellido_materno">Apellido Materno (Op)</label>
                                        {
                                            errors.apellido_materno &&
                                            <span className="helper-text" data-error={errors.apellido_materno} style={{ "marginBottom": "10px" }}>{errors.apellido_materno}</span>
                                        }
                                    </div>

                                    <div className="input-field col s6 input-50-re">
                                        <input id="fecha_de_nacimiento" type="text" className={errors.fecha_de_nacimiento ? "validate datepicker invalid" : "validate datepicker"} name="fecha_de_nacimiento" required autoComplete="fecha_de_nacimiento" value={values.fecha_de_nacimiento} readOnly />
                                        <label htmlFor="fecha_de_nacimiento">Fec. Nacimiento</label>
                                        {
                                            errors.fecha_de_nacimiento &&
                                            <span className="helper-text" data-error={errors.fecha_de_nacimiento} style={{ "marginBottom": "10px" }}>{errors.fecha_de_nacimiento}</span>
                                        }
                                    </div>

                                    <div className="input-field col s6 input-50-re">
                                        <select id="sexo" name="sexo" autoComplete="sexo" value={values.sexo} onChange={handleChange} className={errors.sexo ? "input-field invalid" : "input-field"}>
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

                                    <div className="input-field col s12 input-50-re">
                                        <input id="antiguedad" type="text" className={errors.antiguedad ? "validate datepicker2 invalid" : "validate datepicker2"} required name="antiguedad" autoComplete="antiguedad" value={values.antiguedad} readOnly />
                                        <label htmlFor="antiguedad">Antigüedad</label>
                                        {
                                            errors.antiguedad &&
                                            <span className="helper-text" data-error={errors.antiguedad} style={{ "marginBottom": "10px" }}>{errors.antiguedad}</span>
                                        }
                                    </div>

                                    <p className="titles-sub" style={{ "margin": "1em 0px 1em 3%" }}>DIRECCIÓN (OPCIONAL)</p>

                                    <div className="input-field col s12 ">
                                        <input  maxLength="50" id="estado" type="text" className={errors.estado ? "validate form-control invalid" : "validate"} name="estado" value={values.estado} autoComplete="estado" onChange={handleChange} />
                                        <label htmlFor="estado">Estado</label>
                                        {
                                            errors.estado &&
                                            <span className="helper-text" data-error={errors.estado} style={{ "marginBottom": "10px" }}>{errors.estado}</span>
                                        }
                                    </div>

                                    <div className="input-field col s6 input-50-re">
                                        <input  maxLength="60" id="ciudad" type="text" className={errors.ciudad ? "validate form-control invalid" : "validate"} name="ciudad" value={values.ciudad} autoComplete="ciudad" onChange={handleChange} />
                                        <label htmlFor="ciudad">Ciudad</label>
                                        {
                                            errors.ciudad &&
                                            <span className="helper-text" data-error={errors.ciudad} style={{ "marginBottom": "10px" }}>{errors.ciudad}</span>
                                        }
                                    </div>

                                    <div className="input-field col s6 input-50-re">
                                        <input  maxLength="100" id="colonia" type="text" className={errors.colonia ? "validate form-control invalid" : "validate"} name="colonia" value={values.colonia} autoComplete="colonia" onChange={handleChange} />
                                        <label htmlFor="colonia">Colonia</label>
                                        {
                                            errors.colonia &&
                                            <span className="helper-text" data-error={errors.colonia} style={{ "marginBottom": "10px" }}>{errors.colonia}</span>
                                        }
                                    </div>

                                    <div className="input-field col s6 input-50-re">
                                        <input  maxLength="100" id="calle" type="text" className={errors.calle ? "validate form-control invalid" : "validate"} name="calle" value={values.calle} autoComplete="calle" onChange={handleChange} />
                                        <label htmlFor="calle">Calle</label>
                                        {
                                            errors.calle &&
                                            <span className="helper-text" data-error={errors.calle} style={{ "marginBottom": "10px" }}>{errors.calle}</span>
                                        }
                                    </div>

                                    <div className="input-field col s6 input-50-re">
                                        <input  maxLength="9" id="codigo_postal" type="text" className={errors.codigo_postal ? "validate form-control invalid" : "validate"} name="codigo_postal" value={values.codigo_postal} autoComplete="codigo_postal" onChange={handleChange} />
                                        <label htmlFor="codigo_postal">Código Postal</label>
                                        {
                                            errors.codigo_postal &&
                                            <span className="helper-text" data-error={errors.codigo_postal} style={{ "marginBottom": "10px" }}>{errors.codigo_postal}</span>
                                        }
                                    </div>

                                    <div className="input-field col s6 input-50-re">
                                        <input  maxLength="10" id="numero_exterior" type="text" className={errors.numero_exterior ? "validate form-control invalid" : "validate"} name="numero_exterior" value={values.numero_exterior} autoComplete="numero_exterior" onChange={handleChange} />
                                        <label htmlFor="numero_exterior">No. Exterior</label>
                                        {
                                            errors.numero_exterior &&
                                            <span className="helper-text" data-error={errors.numero_exterior} style={{ "marginBottom": "10px" }}>{errors.numero_exterior}</span>
                                        }
                                    </div>

                                    <div className="input-field col s6 input-50-re">
                                        <input  maxLength="10" id="numero_interior" type="text" className={errors.numero_interior ? "validate form-control invalid" : "validate"} name="numero_interior" value={values.numero_interior} autoComplete="numero_interior" onChange={handleChange} />
                                        <label htmlFor="numero_interior">No. Interior (opcional)</label>
                                        {
                                            errors.numero_interior &&
                                            <span className="helper-text" data-error={errors.numero_interior} style={{ "marginBottom": "10px" }}>{errors.numero_interior}</span>
                                        }
                                    </div>

                                    <div className="input-field col s12 input-50-re">
                                        <input  maxLength="25" id="telefono" type="text" className={errors.telefono ? "validate form-control invalid" : "validate"} name="telefono" value={values.telefono} autoComplete="telefono" onChange={handleChange} />
                                        <label htmlFor="telefono">Teléfono (opcional)</label>
                                        {
                                            errors.telefono &&
                                            <span className="helper-text" data-error={errors.telefono} style={{ "marginBottom": "10px" }}>{errors.telefono}</span>
                                        }
                                    </div>
                                </div>
                                
                                <div className="col s12 m6 div-division">
                                    <p className="titles-sub" style={{"marginLeft":"3%", marginBottom: "15px"}}>INFORMACIÓN INSTITUCIONAL</p>

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

Create.layout = page => <Layout children={page} title="Escuela Sindical - Empleado" pageTitle="Empleado" />

export default Create