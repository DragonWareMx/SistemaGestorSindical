import React, { useEffect, useState } from 'react'
import { InertiaLink } from '@inertiajs/inertia-react'

export default function ModalRestaurar({nombre, tipo, url}) {

    function initializeModal() {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems);
    }

    useEffect(() => {
        initializeModal();
    }, [])

    return (
        <div id="modalRestaurar" className="modal">
            <div className="modal-content">
                <h4 style={{"color":"#419779"}}>Restaurar {tipo} {nombre}</h4>
                <p>¿Estás seguro de que deseas restaurar este {tipo}?</p>
                </div>
                <div className="modal-footer">
                <a className="modal-close waves-effect waves-green btn-flat">Cancelar</a>
                <InertiaLink href={url} method="put" as="button" type="button"  className="modal-close waves-effect waves-green btn-flat" style={{"cursor":"pointer", color: "#419779"}}>Restaurar</InertiaLink>
            </div>
        </div>
    )
}