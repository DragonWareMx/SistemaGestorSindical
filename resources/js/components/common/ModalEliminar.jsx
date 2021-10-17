import React, { useEffect, useState } from 'react'
import { InertiaLink } from '@inertiajs/inertia-react'

export default function ModalEliminar({nombre, tipo, url}) {

    function initializeModal() {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems);
    }

    useEffect(() => {
        initializeModal();
    }, [])

    return (
        <div id="modalEliminar" className="modal">
            <div className="modal-content">
                <h4 style={{"color":"#c62828"}}>Eliminar {tipo} {nombre}</h4>
                <p>¿Estás seguro de que deseas eliminar este {tipo}?</p>
                </div>
                <div className="modal-footer">
                <a className="modal-close waves-effect waves-green btn-flat">Cancelar</a>
                <InertiaLink href={url} method="delete" as="button" type="button"  className="modal-close waves-effect waves-green btn-flat" style={{"color":"#c62828"}}>Eliminar</InertiaLink>
            </div>
        </div>
    )
}