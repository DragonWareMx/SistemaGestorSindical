import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/Layout';
import FlotanteAyuda from '../../components/common/FlotanteAyuda';

import '../../styles/profileStyle.css'

function initializeMat() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
}

const PerfilPublico = ({ user, cursos, participantes }) => {
    useEffect(() => {
        initializeMat();
    }, [])

    function transformaFecha(fecha) {
        const dob = new Date(fecha);
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
            'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const day = dob.getDate();
        const monthIndex = dob.getMonth();
        const year = dob.getFullYear();
        return `${day} de ${monthNames[monthIndex]} del ${year}`;
    }

    return (
        <>
            <div className="row">
                <div className="col s12 m8 l5 xl5">
                    <div className="row">
                        <div className="col s12" style={{ "marginTop": "30px" }}>
                            <div className="card">
                                <div className="card-content">
                                    <div className="row">
                                        <div className="col s12 center-align">
                                            <div className="center-align">
                                                <img src={"/storage/fotos_perfil/" + user.foto} alt="foto de perfil" className="img-profile" />
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

                                            {user.roles && user.roles.length > 0 && user.roles[0].name == "Ponente" && cursos > 0 &&
                                                <div className="profile-txt-name">
                                                    <i className="material-icons profile-icon-email">play_circle_filled</i> {cursos} cursos
                                                </div>
                                            }
                                            {user.roles && user.roles.length > 0 && user.roles[0].name == "Ponente" && participantes > 0 &&
                                                <div className="profile-txt-name">
                                                    <i className="material-icons profile-icon-email">people</i>{participantes} participantes
                                                </div>
                                            }
                                            <div className="profile-txt-email valign-wrapper truncate"><i className="material-icons profile-icon-email">mail_outline</i>{user.email}</div>
                                        </div>
                                        {/* Boton de enviar mensaje */}
                                        <div className="col s12 center-align" style={{ "padding": "0%"}}>
                                            <a className="waves-effect waves-light btn boton-verde" href={"mailto:"+user.email}><i className="material-icons right" style={{ "fontSize": "18px" }}>send</i>Mensaje</a>
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

PerfilPublico.layout = page => <Layout children={page} title="Escuela Sindical - Usuario" pageTitle="PERFIL" />

export default PerfilPublico