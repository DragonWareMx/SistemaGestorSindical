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
  console.log(auth.roles)
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
              <InertiaLink href={route('perfil')} className="icono-menu">
                <div className="menu-profile-info">
                  <img style={{ marginLeft: '10px' }} src={auth.user.foto ? "/storage/fotos_perfil/" + auth.user.foto : "/img/avatar1.png"} className="main-userimage" />
                  <div className="profile-info-name truncate">{auth.user.employee.apellido_m ? auth.user.employee.nombre + ' ' + auth.user.employee.apellido_p + ' ' + auth.user.employee.apellido_m : auth.user.employee.nombre + ' ' + auth.user.employee.apellido_p}</div>
                </div>
              </InertiaLink>
            </div>
          </li>
          {/* INICIO */}
          <li>
            <InertiaLink href={'/'} className={isUrl("inicio") ? "icono-menu current-menu-text" : "icono-menu"}>
              <i className={isUrl("inicio") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>home</i>
              Inicio
            </InertiaLink>
          </li>
          {/* COMIT?? */}
          <li>
            <a className="subheader division-menu">
              COMIT??
            </a>
          </li>
          {/* {auth && auth.roles && auth.roles.length > 0 && auth.roles[0].name != "Administrador" && */}
          <li>
            <InertiaLink href={route('users.index')} className="icono-menu" className={isUrl("comite") ? "icono-menu current-menu-text" : "icono-menu"}>
              <i className={isUrl("comite") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>people</i>
              Comit??
            </InertiaLink>
          </li>
          <li>
            <InertiaLink href={route('employees.index')} className="icono-menu" className={isUrl("empleados") ? "icono-menu current-menu-text" : "icono-menu"}>
              <i className={isUrl("empleados") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>badge</i>
              Empleados
            </InertiaLink>
          </li>

          {/* OFICINAS */}
          <li><a className="subheader division-menu">OFICINAS</a></li>

          {/* HONOR Y JUSTICIA */}
          {auth && auth.roles && auth.roles.length > 0 &&
            (auth.roles['0'].name == "Administrador" || auth.roles['0'].name == "Secretario General" || auth.roles['0'].name == "Responsable de Oficina de Honor y Justicia" || auth.roles['0'].name == "Asistente de Oficina de Honor y Justicia") &&
            <li>
              <InertiaLink href={route('honor')} className={isUrl("reportes") ? "icono-menu current-menu-text" : "icono-menu"}>
                <i className={isUrl("honor-y-justicia") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>military_tech</i>Honor y Justicia
              </InertiaLink>
            </li>
          }

          {/* CONFLICTOS */}
          {auth && auth.roles && auth.roles.length > 0 &&
            (auth.roles['0'].name == "Administrador" || auth.roles['0'].name == "Secretario General" || auth.roles['0'].name == "Responsable de Oficina de Conflictos" || auth.roles['0'].name == "Asistente de Oficina de Conflictos") &&

            <li>
              <InertiaLink href={route('conflicts')} className={isUrl("solicitudes") ? "icono-menu current-menu-text" : "icono-menu"}>
                <i className={isUrl("conflictos") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>sports_kabaddi</i>Conflictos
              </InertiaLink>
            </li>
          }

          {/* SECRETAR??A DEL INTERIOR */}
          {auth && auth.roles && auth.roles.length > 0 &&
            (auth.roles['0'].name == "Administrador" || auth.roles['0'].name == "Secretario General" || auth.roles['0'].name == "Responsable de Oficina de Secretar??a del Interior" || auth.roles['0'].name == "Asistente de Oficina de Secretar??a del Interior") &&

            <li>
              <InertiaLink href={route('secretariaInterior')} className={isUrl("solicitudes") ? "icono-menu current-menu-text" : "icono-menu"}>
                <i className={isUrl("secretaria-del-interior") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>light</i>Secretar??a del Interior
              </InertiaLink>
            </li>
          }
          {/* SECRETARIA DEL TRABAJO */}
          {auth && auth.roles && auth.roles.length > 0 &&
            (auth.roles['0'].name == "Administrador" || auth.roles['0'].name == "Secretario General" || auth.roles['0'].name == "Responsable de Oficina de Secretar??a del Trabajo" || auth.roles['0'].name == "Asistente de Oficina de Secretar??a del Trabajo") &&

            <li>
              <InertiaLink href={route('secretariaTrabajo')} className={isUrl("solicitudes") ? "icono-menu current-menu-text" : "icono-menu"}>
                <i className={isUrl("secretaria-del-trabajo") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>work</i>Secretar??a del Trabajo
              </InertiaLink>
            </li>
          }
          {/* ACCION FEMENIL */}
          {auth && auth.roles && auth.roles.length > 0 &&
            (auth.roles['0'].name == "Administrador" || auth.roles['0'].name == "Secretario General" || auth.roles['0'].name == "Responsable de Oficina Acci??n Femenil" || auth.roles['0'].name == "Asistente de Oficina Acci??n Femenil") &&

            <li>
              <InertiaLink href={route('accionFemenil')} className={isUrl("solicitudes") ? "icono-menu current-menu-text" : "icono-menu"}>
                <i className={isUrl("accion-femenil") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>woman</i>Acci??n Femenil
              </InertiaLink>
            </li>
          }
          {/* ADMISI??N Y CAMBIOS */}
          {auth && auth.roles && auth.roles.length > 0 &&
            (auth.roles['0'].name == "Administrador" || auth.roles['0'].name == "Secretario General" || auth.roles['0'].name == "Responsable de Oficina de Admisi??n y Cambios" || auth.roles['0'].name == "Asistente de Oficina de Admisi??n y Cambios") &&

            <li>
              <InertiaLink href={route('admisionCambios')} className={isUrl("solicitudes") ? "icono-menu current-menu-text" : "icono-menu"}>
                <i className={isUrl("admision-y-cambios") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>family_restroom</i>Admisi??n y Cambios
              </InertiaLink>
            </li>
          }

          {/* SISTEMA */}
          <li><a className="subheader division-menu">SISTEMA</a></li>

          {/* BITACORA */}
          {auth && auth.roles && auth.roles.length > 0 &&
            (auth.roles['0'].name == "Administrador" || auth.roles['0'].name == "Secretario General") &&
            <li>
              <InertiaLink href={route('logs.index')} className={isUrl("log") ? "icono-menu current-menu-text" : "icono-menu"}>
                <i className={isUrl("bitacora") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>history</i>Bit??cora
              </InertiaLink>
            </li>
          }

          {/* CONFIGURACION */}
          <li>
            <InertiaLink href={route('perfil.edit')} className="icono-menu" className={isUrl("perfil") ? "icono-menu current-menu-text" : "icono-menu"}>
              <i className={isUrl("configuracion") ? "material-icons icono-menu current-menu" : "material-icons icono-menu"}>settings</i>Configuraci??n
            </InertiaLink>
          </li>

          {/* CERRAR SESION */}
          <li>
            <button className="icono-menu logout-grande modal-trigger" data-target="modalCerrarSesion" type="button"><i className="material-icons icono-menu">logout</i>Cerrar sesi??n</button>
          </li>
          <div className="center-align" style={{ marginTop: '25px' }}>
            <a onClick={closeNav} className="btn-floating btn-large waves-effect waves-light sidenav-close" style={{ backgroundColor: '#108058' }}><i className="material-icons">arrow_back</i></a>
          </div>
          <div className="row" style={{ marginTop: '50px' }}>
            <div className="col s5 center-align">
              <img src="/img/imagenes/LogoNacional2.png" alt="logo" />
            </div>
            <div className="col s7 valign-wrapper" style={{ height: '64px', fontSize: '12px' }}>
              Sistema Gestor de Datos
            </div>
          </div>
        </ul>
      </div>

      {/* menu lateral comprimido */}
      <div className="menu-compacto center-align">
        <div className="col s12">
          <img src="/img/imagenes/LogoNacional2.png" alt="logo" className="imagen-menu-compacto tooltipped" data-position="right" data-tooltip="Escuela Sindical" />
        </div>
        {/* INICIO */}
        <div className="col s12">
          <InertiaLink href={'/'} className="icono-menu">
            <i className={isUrl("inicio") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Inicio">home</i>
          </InertiaLink>
        </div>

        {/* COMIT?? */}
        {/* {auth && auth.roles && auth.roles.length > 0 && auth.roles[0].name == "Administrador" && */}
        <div className="col s12">
          <InertiaLink href={route('users.index')} className="icono-menu">
            <i className={isUrl("comite") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Comit??">people</i>
          </InertiaLink>
        </div>
        {/* } */}

        {/* EMPLEADOS */}
        {/* {auth && auth.roles && auth.roles.length > 0 && auth.roles[0].name == "Administrador" && */}
        <div className="col s12">
          <InertiaLink href={route('employees.index')} className="icono-menu">
            <i className={isUrl("empleados") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Empleados">badge</i>
          </InertiaLink>
        </div>
        {/* } */}

        {/* OFICINAS */}
        {/* HONOR Y JUSTICIA */}
        {auth && auth.roles && auth.roles.length > 0 &&
          (auth.roles['0'].name == "Administrador" || auth.roles['0'].name == "Secretario General" || auth.roles['0'].name == "Responsable de Oficina de Honor y Justicia" || auth.roles['0'].name == "Asistente de Oficina de Honor y Justicia") &&
          <div className="col s12">
            <InertiaLink href={route('honor')} className="icono-menu">
              <i className={isUrl("honor-y-justicia") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Honor y Justicia">military_tech</i>
            </InertiaLink>
          </div>
        }
        {/* CONFLICTOS */}
        {auth && auth.roles && auth.roles.length > 0 &&
          (auth.roles['0'].name == "Administrador" || auth.roles['0'].name == "Secretario General" || auth.roles['0'].name == "Responsable de Oficina de Conflictos " || auth.roles['0'].name == "Asistente de Oficina de Conflictos") &&
          <div className="col s12">
            <InertiaLink href={route('conflicts')} className="icono-menu">
              <i className={isUrl("conflictos") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Conflictos">sports_kabaddi</i>
            </InertiaLink>
          </div>
        }
        {/* SECRETARIA DEL INTERIOR */}
        {auth && auth.roles && auth.roles.length > 0 &&
          (auth.roles['0'].name == "Administrador" || auth.roles['0'].name == "Secretario General" || auth.roles['0'].name == "Responsable de Oficina de Secretar??a del Interior" || auth.roles['0'].name == "Asistente de Oficina de Secretar??a del Interior") &&
          <div className="col s12">
            <InertiaLink href={route('secretariaInterior')} className="icono-menu">
              <i className={isUrl("secretaria-del-interior") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Secretar??a del Interior">light</i>
            </InertiaLink>
          </div>
        }
        {/* SECRETARIA DEL TRABAJO */}
        {auth && auth.roles && auth.roles.length > 0 &&
          (auth.roles['0'].name == "Administrador" || auth.roles['0'].name == "Secretario General" || auth.roles['0'].name == "Responsable de Oficina de Secretar??a del Trabajo" || auth.roles['0'].name == "Asistente de Oficina de Secretar??a del Trabajo") &&
          <div className="col s12">
            <InertiaLink href={route('secretariaTrabajo')} className="icono-menu">
              <i className={isUrl("secretaria-del-trabajo") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Secretar??a del Trabajo">work</i>
            </InertiaLink>
          </div>
        }
        {/* ACCION FEMENIL */}
        {auth && auth.roles && auth.roles.length > 0 &&
          (auth.roles['0'].name == "Administrador" || auth.roles['0'].name == "Secretario General" || auth.roles['0'].name == "Responsable de Oficina Acci??n Femenil" || auth.roles['0'].name == "Asistente de Oficina Acci??n Femenil") &&
          <div className="col s12">
            <InertiaLink href={route('accionFemenil')} className="icono-menu">
              <i className={isUrl("accion-femenil") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Acci??n Femenil">woman</i>
            </InertiaLink>
          </div>
        }
        {/* ADMISION Y CAMBIOS */}
        {auth && auth.roles && auth.roles.length > 0 &&
          (auth.roles['0'].name == "Administrador" || auth.roles['0'].name == "Secretario General" || auth.roles['0'].name == "Responsable de Oficina de Admisi??n y Cambios" || auth.roles['0'].name == "Asistente de Oficina de Admisi??n y Cambios") &&
          <div className="col s12">
            <InertiaLink href={route('admisionCambios')} className="icono-menu">
              <i className={isUrl("admision-y-cambios") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Admisi??n y Cambios">family_restroom</i>
            </InertiaLink>
          </div>
        }
        {/* BITACORA */}
        {auth && auth.roles && auth.roles.length > 0 &&
          (auth.roles['0'].name == "Administrador" || auth.roles['0'].name == "Secretario General") &&
          <div className="col s12">
            <InertiaLink href={route('logs.index')} className="icono-menu">
              <i className={isUrl("bitacora") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Bit??cora">history</i>
            </InertiaLink>
          </div>
        }

        {/* CONFIGURACION */}
        <div className="col s12">
          <InertiaLink href={route('perfil.edit')} className="icono-menu">
            <i className={isUrl("configuracion") ? "material-icons tooltipped icono-menu-compacto current-menu" : "material-icons tooltipped icono-menu-compacto"} data-position="right" data-tooltip="Configuraci??n">settings</i>
          </InertiaLink>
        </div>

        {/* CERRAR SESION */}
        <div className="col s12">
          <button data-target="modalCerrarSesion" className="icono-menu logout-chico modal-trigger" >
            <i className="material-icons tooltipped icono-menu-compacto icono-menu" data-position="right" data-tooltip="Cerrar sesi??n">logout</i>
          </button>
        </div>

        {/* BOTON PARA EXPANDIR EL MENU */}
        <div className="col s12 center-align" style={{ marginTop: '10px' }}>
          <a onClick={openNav} data-target="slide-out" className="btn-floating btn-medium waves-effect waves-light sidenav-trigger tooltipped" style={{ backgroundColor: '#108058' }} data-position="right" data-tooltip="Abrir men??"><i className="material-icons">arrow_forward</i></a>
        </div>
      </div>
      <ModalLogout></ModalLogout>
    </div>
  );
}
