<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Recuperar contraseña</title>
    <link rel="icon" href="{{ asset('img/imagenes/LogoNacionalCrop.png') }}">
    {{-- JQuery --}}
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <!-- Compiled and minified JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <link rel="stylesheet" href="{{ asset('css/login.css') }}">
    {{-- Iconos de google --}}
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    {{-- Fuentes de google - Montserrat --}}
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
</head>

<body>
    <div class="row">
        <div class="divright  hide-on-small-only col s12 m3 l4">
            <div class="row" style="width: 100%">
                <div class="col s12 m12 l12" style="display: block">

                </div>
            </div>
            <div class="col s12 head-login forgot left-align">
                <div class="left">
                    <div class="titulo1">Sistema Gestor de Datos</div>
                    <div class="titulo2">Sección XX Michoacán</div>
                </div>
                <div class="right">
                    <img src="{{ asset('img/imagenes/LogoSeccional.png') }}" alt="Sistema Gestor de Datos" width="80px">
                </div>
            </div>
            <div class="col s12">
                <img src="{{ asset('img/imagenes/forgot-password-cuate.svg') }}" alt="" srcset="">
            </div>
        </div>
        <div class="divleft col s12 m9 l8">
            <div class="col hide-on-med-and-up s12 head-login">
                <div class="left">
                    <div class="titulo1">Sistema Gestor de Datos</div>
                    <div class="titulo2">Sección XX Michoacán</div>
                </div>
                <div class="right">
                    <img src="{{ asset('img/imagenes/LogoSeccional.png') }}" alt="Sistema Gestor de Datos"
                        width="121px">
                </div>
            </div>
            <div class="col s12 hide-on-small-only head-login">
                <div class="left">
                    <div class="titulo2">RECUPERAR CONTRASEÑA</div>
                </div>
            </div>
            <div class="form-login form-reset col s12">
                <h1>RECUPERAR CONTRASEÑA</h1>
                <h2 style="font-size: 16px">Ingresa tu nueva contraseña</h2>
                <form class="col s12" method="POST" action="{{ route('password.update') }}">
                    @csrf
                    <input type="hidden" name="token" value="{{ $token }}">
                    <div class="row">
                        <div class="input-field col s12" style="margin-top: 6.5vh; padding:0">
                            <i class="material-icons prefix">face</i>
                            <input id="email" type="email" class="validate @error('email') invalid @enderror" id="email"
                                name="email" value="{{ $email ?? old('email') }}" required autocomplete="email">
                            <label for="email">Correo electrónico</label>
                            @error('email')
                            <span class="helper-text" data-error="{{$message}}">{{$message}}</span>
                            @enderror
                        </div>
                        <div class="input-field col s12" style="margin-top: 6.5vh;padding:0">
                            <i class="material-icons prefix">lock</i>
                            <input id="password" value="" type="password"
                                class="validate @error('password') invalid @enderror" name="password" required
                                autocomplete="new-password">
                            <label for="password">Contraseña</label>
                            @error('password')
                            <span class="helper-text" data-error="{{$message}}">{{$message}}</span>
                            @enderror
                        </div>
                        <div class="input-field col s12" style="margin-top: 6.5vh;padding:0">
                            <i class="material-icons prefix">lock</i>
                            <input id="password-confirm" type="password" class="validate" name="password_confirmation"
                                required autocomplete="new-password">
                            <label for="password-confirm">Confirmar Contraseña</label>
                        </div>
                    </div>
                    <a class="link-forget hide-on-med-and-up" href="{{ route('login') }}">Iniciar Sesión</a>
                    <div class="col s12 right-align">
                        <button class="btn waves-effect waves-teal btn-login" type="submit" name="action"
                            style="height: 54px">Cambiar contraseña
                            <i class="material-icons right">send</i>
                        </button>
                    </div>
                </form>
            </div>

            <div class="col s12 footer-login">
                © 2021 Sistema Gestor de Datos | &nbsp; <a href="https://dragonware.com.mx" target="_blank">
                    Desarrollado por
                    DragonWare
                    <img src="{{ asset('img/imagenes/dragonWare.png') }}" alt="DragonWare" width="22px"></a>
            </div>
        </div>
    </div>
</body>



</html>