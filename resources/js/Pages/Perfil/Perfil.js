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
        if (year < 2000)
            del = "de"

        return `${day} de ${monthNames[monthIndex]} ` + del + ` ${year}`;
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
                                                <img src={user.foto ? "/storage/fotos_perfil/" + user.foto : "/img/avatar1.png"} alt="foto de perfil" className="img-profile" />
                                            </div>
                                        </div>
                                        <div className="col s12 center-align">
                                            <div className="profile-txt-category">
                                                {user.roles ? user.roles.length > 0 ? user.roles[0].name : "Sin rol" : "Sin rol"}
                                            </div>
                                            <div className="profile-txt-name">
                                                {user.employee.nombre} {user.employee.apellido_p} {user.employee.apellido_m}
                                            </div>
                                            <div className="profile-txt-active-since">
                                                Activo desde {user.created_at ? transformaFecha(user.created_at) : "el inicio de los tiempos"}
                                            </div>
                                            <div className="profile-txt-email valign-wrapper truncate"><i className="material-icons profile-icon-email">mail_outline</i>{user.email}</div>
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
                                        INFORMACI??N PERSONAL
                                    </div>
                                    <div className="info-section">
                                        Tu informaci??n personal no ser?? visible para el p??blico.
                                    </div>
                                    <div className="row">
                                        <div className="col s12 m6" style={{ "marginTop": "15px" }}>
                                            <div className="titles-sub">
                                                INFORMACI??N PERSONAL
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Fecha de Nacimiento:</b> {transformaFecha(user.employee.fecha_nac)}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Sexo:</b> {user.employee.sexo == 'h' && "Hombre"}{user.employee.sexo == 'm' && "Mujer"}{user.employee.sexo == 'o' && "Otro"}
                                            </div>
                                        </div>
                                        <div className="col s12 m6" style={{ "marginTop": "15px" }}>
                                            <div className="titles-sub">
                                                INFORMACI??N INSTITUCIONAL
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Matr??cula:</b> {user.employee.matricula}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>R??gimen:</b> {user.employee.unit ? user.employee.unit.regime ? user.employee.unit.regime.nombre ?? "Sin r??gimen" : "Sin r??gimen" : "Sin r??gimen"}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Unidad:</b> {user.employee.unit ? user.employee.unit.nombre ?? "Sin unidad" : "Sin unidad"}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Categor??a:</b> {user.employee.category ? user.employee.category.nombre : "Sin categor??a"}
                                            </div>
                                        </div>
                                        <div className="col s12 m6" style={{ "marginTop": "15px" }}>
                                            <div className="titles-sub">
                                                DIRECCI??N
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Estado:</b> {user.employee.estado}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Ciudad:</b> {user.employee.ciudad}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Colonia:</b> {user.employee.colonia}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>Calle:</b> {user.employee.calle}
                                            </div>
                                            <div className="info-txt-format">
                                                <b>No. Exterior:</b> {user.employee.num_ext}
                                            </div>
                                            {user.num_int &&
                                                <div className="info-txt-format">
                                                    <b>No. Exterior:</b> {user.employee.num_int}
                                                </div>
                                            }
                                            <div className="info-txt-format">
                                                <b>C??digo Postal:</b> {user.employee.cp}
                                            </div>
                                        </div>
                                        {/* Boton de editar */}
                                        <div className="col s12 m12 right-align" style={{ "marginTop": "25px" }}>
                                            {/* <InertiaLink href={route('perfil.edit')} className="waves-effect waves-light btn boton-verde"><i className="material-icons right" style={{ "fontSize": "18px" }}>settings</i>Configuraci??n</InertiaLink> */}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

Perfil.layout = page => <Layout children={page} title="Escuela Sindical - Perfil" pageTitle="Perfil" />

export default Perfil