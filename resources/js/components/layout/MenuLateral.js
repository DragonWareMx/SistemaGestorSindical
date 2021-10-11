import React, { useEffect } from 'react';
import { InertiaLink, usePage } from "@inertiajs/inertia-react"
import route from 'ziggy-js';
import ModalLogout from '../common/ModalLogout';

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

function closeNav2() {
  var elems = document.querySelectorAll('.sidenav');
  openNav();
  closeNav();
}

function handleContentLoaded() {
  var elems = document.querySelectorAll('.sidenav');
  var options;
  var instances = M.Sidenav.init(elems, options);
}

function initializeTooltip() {
  var elems = document.querySelectorAll('.tooltipped');
  var instances = M.Tooltip.init(elems);
}

export default function MenuLateral() {
  const { auth } = usePage().props;
  useEffect(() => {
    handleContentLoaded();
    initializeTooltip();
    window.addEventListener('resize', closeNav2);
  }, [])

  function isUrl(url) {
    return window.location.href.indexOf(url) > -1
  }

  return (
    <div>
      {/* menu lateral extendido */}
      <div id="menu-grande">
        <ul id="slide-out" className="sidenav sidenav-fixed scroll-menu" style={{ color: 'rgba(38, 50, 56, 0.8)' }}>
          <li>
            <div>
              <div className="center-align" style={{ zIndex: 100, height: '150px' }}>
                <img src="img/imagenes/Classroom-cuate.svg" style={{ position: 'relative', height: '150px' }} />
              </div>
              <InertiaLink href={'#'} className="icono-menu">
                <div className="menu-profile-info">
                  <img style={{ marginLeft: '10px' }} src={"/storage/fotos_perfil/"} className="main-userimage" />
                  <div className="profile-info-name truncate">Pepito Pérez</div>
                </div>
              </InertiaLink>
            </div>
          </li>
          {/* INICIO */}
          <li>
            <InertiaLink href={'#'} className={isUrl("inicio") ? "icono-menu current-menu-text" : "icono-menu"}>
              <i className={isUrl("inicio") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>home</i>
                  Inicio
            </InertiaLink>
          </li>

          {/* USUARIOS */}
          {/* {auth && auth.roles && auth.roles.length > 0 && auth.roles[0].name == "Administrador" && */}
            <li>
              <InertiaLink href={'#'} className={isUrl("usuarios") ? "icono-menu current-menu-text" : "icono-menu"}>
                <i className={isUrl("usuarios") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>people</i>
                    Usuarios
                </InertiaLink>
            </li>
          {/* } */}

          {/* CURSOS */}
          <li>
            <a className="subheader division-menu">
              CURSOS
            </a>
          </li>
          {/* {auth && auth.roles && auth.roles.length > 0 && auth.roles[0].name != "Administrador" && */}
          <li>
            <InertiaLink href={'#'} className="icono-menu" className={isUrl("cursos") ? "icono-menu current-menu-text" : "icono-menu"}>
              <i className={isUrl("cursos") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>school</i>
              Mis cursos
            </InertiaLink>
          </li>
          {/* } */}

          {/* BUSCAR CURSOS */}
          <li>
            <InertiaLink href={'#'} className={isUrl("buscar") ? "icono-menu current-menu-text" : "icono-menu"}>
              <i className={isUrl("buscar") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>search</i>Buscar cursos
            </InertiaLink>
          </li>

          {/* SISTEMA */}
          <li><a className="subheader division-menu">SISTEMA</a></li>

          {/* REPORTES */}
          {/* {auth && auth.roles && auth.roles.length > 0 && auth.roles[0].name == "Administrador" && */}
          <li>
            <InertiaLink href={'#'} className={isUrl("reportes") ? "icono-menu current-menu-text" : "icono-menu"}>
              <i className={isUrl("reportes") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>assignment_late</i>Reportes
            </InertiaLink>
          </li>
          {/* } */}

          {/* SOLICITUDES */}
          {/* {auth && auth.roles && auth.roles.length > 0 && auth.roles[0].name == "Administrador" && */}
          <li>
            <InertiaLink href={'#'} className={isUrl("solicitudes") ? "icono-menu current-menu-text" : "icono-menu"}>
              <i className={isUrl("solicitudes") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>create_new_folder</i>Solicitudes
            </InertiaLink>
          </li>
          {/* } */}

          {/* BITACORA */}
          {/* {auth && auth.roles && auth.roles.length > 0 && auth.roles[0].name == "Administrador" && */}
            <li>
              <InertiaLink href={'#'} className={isUrl("log") ? "icono-menu current-menu-text" : "icono-menu"}>
                <i className={isUrl("log") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>history</i>Bitácora
              </InertiaLink>
            </li>
          {/* } */}

          {/* PERFIL */}
          <li>
            <InertiaLink href={'#'} className="icono-menu" className={isUrl("perfil") ? "icono-menu current-menu-text" : "icono-menu"}>
              <i className={isUrl("perfil") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>settings</i>Configuración
              </InertiaLink>
          </li>

          <li>
            <button className="icono-menu logout-grande modal-trigger" data-target="modalCerrarSesion" type="button"><i className="material-icons icono-menu">logout</i>Cerrar sesión</button>
          </li>
          <div className="center-align" style={{ marginTop: '25px' }}>
            <a onClick={closeNav} className="btn-floating btn-large waves-effect waves-light sidenav-close" style={{ backgroundColor: '#108058' }}><i className="material-icons">arrow_back</i></a>
          </div>
          <div className="row" style={{ marginTop: '50px' }}>
            <div className="col s5 center-align">
              <img src="/img/imagenes/LogoNacional2.png" alt="logo" />
            </div>
            <div className="col s7 valign-wrapper" style={{ height: '64px' }}>
              Escuela Sindical
              </div>
          </div>
        </ul>
      </div>

      {/* menu lateral comprimido */}
      <div className="menu-compacto center-align">
        <div className="col s12">
          <img src="/img/imagenes/LogoNacional2.png" alt="logo" className="imagen-menu-compacto tooltipped" data-position="right" data-tooltip="Escuela Sindical" />
        </div>
        <div className="col s12">
          <InertiaLink href={'#'} className="icono-menu">
            <i className={isUrl("inicio") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Inicio">home</i>
          </InertiaLink>
        </div>

        {/* USUARIOS */}
        {/* {auth && auth.roles && auth.roles.length > 0 && auth.roles[0].name == "Administrador" && */}
          <div className="col s12">
            <InertiaLink href={'#'} className="icono-menu">
              <i className={isUrl("usuarios") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Usuarios">people</i>
            </InertiaLink>
          </div>
        {/* } */}

        <div className="col s12">
          <InertiaLink href={'#'} className="icono-menu">
            <i className={isUrl("cursos") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Mis cursos">school</i>
          </InertiaLink>
        </div>
        <div className="col s12">
          <InertiaLink href={'#'} className="icono-menu">
            <i className={isUrl("buscar") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Buscar cursos">search</i>
          </InertiaLink>
        </div>

        {/* {auth && auth.roles && auth.roles.length > 0 && auth.roles[0].name == "Administrador" && */}
        <div className="col s12">
          <InertiaLink href={'#'} className="icono-menu">
            <i className={isUrl("reportes") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Reportes">assignment_late</i>
          </InertiaLink>
        </div>
        {/* } */}

        {/* {auth && auth.roles && auth.roles.length > 0 && auth.roles[0].name == "Administrador" && */}
        <div className="col s12">
          <InertiaLink href={'#'} className="icono-menu">
            <i className={isUrl("solicitudes") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Solicitudes">create_new_folder</i>
          </InertiaLink>
        </div>
        {/* } */}

        {/* BITACORA */}
        {/* {auth && auth.roles && auth.roles.length > 0 && auth.roles[0].name == "Administrador" && */}
          <div className="col s12">
            <InertiaLink href={'#'} className="icono-menu">
              <i className={isUrl("log") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Bitácora">history</i>
            </InertiaLink>
          </div>
        {/* } */}

        {/* PERFIL */}
        <div className="col s12">
          <InertiaLink href={'#'} className="icono-menu">
            <i className={isUrl("perfil") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Configuración">settings</i>
          </InertiaLink>
        </div>

        <div className="col s12">
          <button data-target="modalCerrarSesion" className="icono-menu logout-chico modal-trigger" >
            <i className="material-icons tooltipped icono-menu-compacto icono-menu" data-position="right" data-tooltip="Cerrar sesión">logout</i>
          </button>
        </div>

        <div className="col s12 center-align" style={{ marginTop: '10px' }}>
          <a onClick={openNav} data-target="slide-out" className="btn-floating btn-medium waves-effect waves-light sidenav-trigger tooltipped" style={{ backgroundColor: '#108058' }} data-position="right" data-tooltip="Abrir menú"><i className="material-icons">arrow_forward</i></a>
        </div>
      </div>
      <ModalLogout></ModalLogout>
    </div>
  );
}
