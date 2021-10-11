import { InertiaLink, useRemember } from '@inertiajs/inertia-react';
import React, { useEffect } from 'react'
import '/css/flotanteAyuda.css'
import route from 'ziggy-js';

function initializeModals() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems);
    var elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems);
}


export default function FlotanteProfe() {
    useEffect(() => {
        initializeModals();
    }, [])
    return (
        <div>
            <div className="fixed-action-btn">
                <a className="btn-floating btn-large green-sind">
                    <i className="large material-icons">mode_edit</i>
                </a>
                <ul>
                    <li><a className="btn-floating blue-grey lighten-1 modal-trigger tooltipped" href="#modalHelp" data-position="left" data-tooltip="Ayuda"><i className="material-icons">help_outline</i></a></li>
                    <li><InertiaLink href={route('entrada.crear')} className="btn-floating orange lighten-1 tooltipped" data-position="left" data-tooltip="Agregar entrada"><i className="material-icons">sticky_note_2</i></InertiaLink></li>
                    {/* <li><InertiaLink href={route('entrada.crear')} className="btn-floating red lighten-1 tooltipped" data-position="left" data-tooltip="Agregar recurso"><i className="material-icons">description</i></InertiaLink></li> */}
                    <li><InertiaLink href={route('module.create')} className="btn-floating blue lighten-1 tooltipped" data-position="left" data-tooltip="Agregar módulo"><i className="material-icons">book</i></InertiaLink></li>
                    <li><InertiaLink href={route('cursos.create')} className="btn-floating purple lighten-3 tooltipped" data-position="left" data-tooltip="Agregar curso"><i className="material-icons">school</i></InertiaLink></li>
                </ul>
            </div>
            <div id="modalHelp" className="modal little-modal">
                <div className="modal-content">
                    <div className="modal-close right"><i className="material-icons">close</i></div>
                    <div className="row">
                        <div className="col s12 center-align">
                            <img src="img/imagenes/ActiveSupport-amico1.png"></img>
                        </div>
                        <div className="col s12 center-align modal-title">¿Necesitas ayuda? Contáctanos</div>
                        <div className="col s12 modal-text">Comunicate con nosostros y mantente en contacto</div>
                        <div className="row" style={{ "margin": "0px" }}>
                            <div className="col s1">
                                <i className="material-icons" style={{ "color": "#656565", "marginTop": "12px" }}>language</i>
                            </div>
                            <div className="col s11">
                                <div className="" style={{ "color": "#5C5C5C", "fontSize": "15px", "marginTop": "12px", "paddingLeft": "10px" }}>www.sindicatoxx.com</div>
                            </div>
                        </div>
                        <div className="row" style={{ "margin": "0px" }}>
                            <div className="col s1">
                                <i className="material-icons" style={{ "color": "#656565", "marginTop": "12px" }}>mail_outline</i>
                            </div>
                            <div className="col s11">
                                <div className="" style={{ "color": "#5C5C5C", "fontSize": "15px", "marginTop": "12px", "paddingLeft": "10px" }}>escuelasindical@imss.com</div>
                            </div>
                        </div>
                        <div className="row" style={{ "margin": "0px" }}>
                            <div className="col s1">
                                <i className="material-icons" style={{ "color": "#656565", "marginTop": "12px" }}>call</i>
                            </div>
                            <div className="col s11">
                                <div className="" style={{ "color": "#5C5C5C", "fontSize": "15px", "marginTop": "12px", "paddingLeft": "10px" }}>44 44 44 44 44</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
