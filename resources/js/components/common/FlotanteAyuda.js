import React, { useEffect } from 'react'
import ReactDom from 'react-dom'
//import circlesImg from '../images/circles.png'
//import emptyImg from '../images/empty.png'
//import './styles/Card.css'
import '/css/flotanteAyuda.css'


function initializeModals() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
}

export default function FlotanteAyuda() {
    useEffect(() => {
        initializeModals();
    }, [])
    return (
        <div>
            <div className="fixed-action-btn">
                <a className="btn-floating btn-large waves-effect waves-light green-sind modal-trigger" href="#modalHelp"><i className="material-icons">help_outline</i></a>
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
                            <a href="https://www.sntssseccionxxmichoacan.org/" target="_blank">
                                <div className="col s1">
                                    <i className="material-icons" style={{ "color": "#656565", "marginTop": "12px" }}>language</i>
                                </div>
                                <div className="col s11">
                                    <div className="" style={{ "color": "#5C5C5C", "fontSize": "15px", "marginTop": "12px", "paddingLeft": "10px" }}>www.sindicatoxx.com</div>
                                </div>
                            </a>
                        </div>
                        <div className="row" style={{ "margin": "0px" }}>
                            <a href="mailto: escuelasindical@imss.com">
                                <div className="col s1">
                                    <i className="material-icons" style={{ "color": "#656565", "marginTop": "12px" }}>mail_outline</i>
                                </div>
                                <div className="col s11">
                                    <div className="" style={{ "color": "#5C5C5C", "fontSize": "15px", "marginTop": "12px", "paddingLeft": "10px" }}>escuelasindical@imss.com</div>
                                </div>
                            </a>
                        </div>
                        <div className="row" style={{ "margin": "0px" }}>
                            <a href="tel:4433998915">
                                <div className="col s1">
                                    <i className="material-icons" style={{ "color": "#656565", "marginTop": "12px" }}>call</i>
                                </div>
                                <div className="col s11">
                                    <div className="" style={{ "color": "#5C5C5C", "fontSize": "15px", "marginTop": "12px", "paddingLeft": "10px" }}>44 44 44 44 44</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}