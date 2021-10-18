import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import FlotanteAyuda from '../../components/common/FlotanteAyuda';
import route from 'ziggy-js';
import { InertiaLink } from '@inertiajs/inertia-react';

import '../../styles/profileStyle.css'

function initializeMat() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
}

const Perfil = ({ user }) => {
    function transformaFecha(fecha) {
        const dob = new Date(fecha);
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
            'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const day = dob.getDate();
        const monthIndex = dob.getMonth();
        const year = dob.getFullYear();

        var del = "del"
        if(year < 2000)
            del = "de"

        return `${day} de ${monthNames[monthIndex]} `+ del +` ${year}`;
    }

    useEffect(() => {
        initializeMat();
    }, [])

    return (
        <>
            <div className="row">
                <div className="col s12 m4">
                    <div className="row">
                        <div className="col s12" style={{ "marginTop": "30px" }}>
                            <div className="card">
                                <div className="card-content">
                                    <div className="row">
                                        <div className="col s12 center-align">
                                            <div className="center-align">
                                                <img src={user.foto ? "/storage/fotos_perfil/"+user.foto : "/storage/fotos_perfil/avatar1.jpg"} alt="foto de perfil" className="img-profile" />
                                            </div>
                                        </div>
                                        <div className="col s12 center-align">
                                            <div className="profile-txt-category">
                                                {user.roles ? user.roles.length > 0 ? user.roles[0].name : "Sin rol" : "Sin rol"}
                                            </div>
                                            <div className="profile-txt-name">
                                                {user.nombre} {user.apellido_p} {user.apellido_m}
                                            </div>
                                            <div className="profile-txt-active-since">
                                                Activo desde {user.created_at ? transformaFecha(user.created_at) : "el inicio de los tiempos"}
                                            </div>
                                            <div className="profile-txt-email valign-wrapper truncate"><i className="material-icons profile-icon-email">mail_outline</i>{user.email}</div>
                                        </div>
                                        {/* Boton de enviar mensaje */}
                                        <div className="col s12 center-align" style={{ "padding": "0%" }}>
                                            <a className="waves-effect waves-light btn boton-verde" href={"mailto:"+user.email}><i className="material-icons right" style={{ "fontSize": "18px" }}>send</i>Mensaje</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col s12 m8">
                    <div className="row">
                        <div className="col s12">
                            <div className="card">
                                <div className="card-content">
                                    <div className="title-section">
                                        INFORMACIÓN PERSONAL
                                    </div>
                                    <div className="info-section">
                                        Tu información personal no será visible para el público.
                                    </div>
                                    <div className="row">
                                        <div className="col s12 m6" style={{ "marginTop": "15px" }}>
                                            <div className="titles-sub">
                                                INFORMACIÓN PERSONAL
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Fecha de Nacimiento:</b> {transformaFecha(user.fecha_nac)}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Sexo:</b> {user.sexo == 'h' && "Hombre"}{user.sexo == 'm' && "Mujer"}{user.sexo == 'o' && "Otro"}
                                            </div>
                                        </div>
                                        <div className="col s12 m6" style={{ "marginTop": "15px" }}>
                                            <div className="titles-sub">
                                                INFORMACIÓN INSTITUCIONAL
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Matrícula:</b> {user.matricula}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Régimen:</b> {user.unit ? user.unit.regime ? user.unit.regime.nombre ?? "Sin régimen" : "Sin régimen" : "Sin régimen"}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Unidad:</b> {user.unit ? user.unit.nombre ?? "Sin unidad" : "Sin unidad"}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Categoría:</b> {user.category ? user.category.nombre : "Sin categoría"}
                                            </div>
                                        </div>
                                        <div className="col s12 m6" style={{ "marginTop": "15px" }}>
                                            <div className="titles-sub">
                                                DIRECCIÓN
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Estado:</b> {user.estado}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Ciudad:</b> {user.ciudad}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Colonia:</b> {user.colonia}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Calle:</b> {user.calle}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>No. Exterior:</b> {user.num_ext}
                                            </div>
                                            {user.num_int &&
                                            <div className="info-txt-format">
                                                <b>No. Exterior:</b> {user.num_int}
                                            </div>
                                            }
                                            <div className="info-txt-format">
                                                <b>Código Postal:</b> {user.cp}
                                            </div>
                                        </div>
                                        {/* Boton de editar */}
                                        <div className="col s12 m12 right-align" style={{ "marginTop": "25px" }}>
                                            <InertiaLink href={route('perfil.edit')} className="waves-effect waves-light btn boton-verde"><i className="material-icons right" style={{ "fontSize": "18px" }}>settings</i>Configuración</InertiaLink>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FlotanteAyuda />
        </>
    )
}

Perfil.layout = page => <Layout children={page} title="Escuela Sindical - Perfil" pageTitle="PERFIL" />

export default Perfil