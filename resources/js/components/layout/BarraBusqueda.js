import React, { useEffect, useState } from 'react';
import { InertiaLink } from "@inertiajs/inertia-react"
import { Inertia } from '@inertiajs/inertia'
import route from 'ziggy-js';
import { usePage } from '@inertiajs/inertia-react'

//componentes
import FlotanteAyuda from '../../components/common/FlotanteAyuda';
import FlotanteProfe from '../../components/common/FlotanteProfe';
import FlotanteAdmin from '../../components/common/FlotanteAdmin';
import Notificaciones from '../common/Notificaciones';


function openNav() {
    var menu = document.getElementById("slide-out");
    var amburger = document.getElementById("amburger");

    menu.classList.remove("menu-cerrado");
    menu.classList.add("menu-abierto");
    document.body.style.transition = "ease-in-out";
    document.body.style.transitionDuration = "500ms";
    if (window.innerWidth > 992) {
        document.body.style.paddingLeft = "300px";
        amburger.style.display = "none";
    }
}

function closeNav() {
    var menu = document.getElementById("slide-out");
    var amburger = document.getElementById("amburger");

    menu.classList.add("menu-cerrado");
    menu.classList.remove("menu-abierto");
    document.body.style.transition = "ease-in-out";
    document.body.style.transitionDuration = "500ms";
    if (window.innerWidth > 992)
        document.body.style.paddingLeft = "60px";
    else {
        document.body.style.paddingLeft = "0px";
        amburger.style.display = "block";
    }
}

function growSearchBar() {
    if (window.innerWidth <= 600) {
        var barraRight = document.getElementById('main-bar-backNoti');
        barraRight.classList.add('hide');
        var barraRightFoto = document.getElementById('main-bar-right');
        barraRightFoto.classList.add('main-bar-right-grown');
        var barraSearch = document.getElementById('main-bar-search');
        barraSearch.classList.add('barraSearch-grown');
        var enter = document.getElementById('enter-search');
        enter.classList.remove('hide-on-small-only');
    }
}

function shrinkSearchBar() {
    if (window.innerWidth <= 600) {
        var barraRight = document.getElementById('main-bar-backNoti');
        barraRight.classList.remove('hide');
        var barraRightFoto = document.getElementById('main-bar-right');
        barraRightFoto.classList.remove('main-bar-right-grown');
        var barraSearch = document.getElementById('main-bar-search');
        barraSearch.classList.remove('barraSearch-grown');
        var enter = document.getElementById('enter-search');
        enter.classList.add('hide-on-small-only');
    }
}

export default function BarraBusqueda() {
    const { auth } = usePage().props;
    const { busqueda } = usePage().props;

    //para la búsqueda
    const [values, setValues] = useState({
        busqueda: ""
    })

    function handleChange(e) {
        const key = e.target.id;
        const value = e.target.value
        setValues(values => ({
            ...values,
            [key]: value,
        }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        Inertia.get(route('cursosBuscar'), values)
    }

    //se ejecuta cuando se monta el componente, inicializa materialize y el buscador
    useEffect(() => {
        //si hay una busqueda en el url se pone en el input
        if (busqueda) {
            const elem = document.getElementById('busqueda');
            elem.value = busqueda;
            setValues(values => ({
                ...values,
                busqueda: busqueda
            }))
        }
    }, [])

    return (
        <div>
            {/* bara de busqueda superior */}
            <div className="main-bar yellow">

                <a id="amburger" onClick={openNav} data-target="slide-out" className="menu-celular waves-effect waves-light sidenav-trigger"><i className="material-icons">menu</i></a>

                {/* Parte izquierda de la barra superior */}

                {/* Parte derecha de la barra superior*/}
                <div className="main-bar-right" id="main-bar-right" style={{ marginRight: '0px' }}>
                    <div className="main-bar-right-rightSide">
                        <div className="truncate">
                            <InertiaLink href={route('perfil')}>
                                <span className="main-username">Pepito Pérez</span>
                            </InertiaLink>
                        </div>
                        <div>
                            <InertiaLink href={route('perfil')}>
                                <img className="main-userimage" src={"/img/avatar1.png"} alt="" />
                            </InertiaLink>
                        </div>
                    </div>
                </div>
            </div>
            {/* contenido */}
            <div className="main-bar-background" />
            {/* Los botonsitos */}
            {/* {auth.roles[0].slug == 'alumno' && <FlotanteAyuda />}
            {auth.roles[0].slug == 'ponente' && <FlotanteProfe />}
            {auth.roles[0].slug == 'admin' && <FlotanteAdmin />} */}
        </div>
    );
}
