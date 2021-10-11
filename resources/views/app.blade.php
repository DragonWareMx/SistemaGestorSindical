<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <base href="/" />
        <script src="{{ mix('/js/app.js') }}" defer></script>

        <link rel="icon" href="{{asset('img/imagenes/LogoNacionalCrop.png')}}" />

        <!-- css del menu -->
        <link rel="stylesheet" href="{{ asset('/css/menuStyle.css') }}">

        <!-- Compiled and minified CSS -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
        <!-- Compiled and minified JavaScript -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        {{-- Iconos de google --}}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        {{-- Fuentes de google - Montserrat --}}
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet">

          @routes
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    </head>
      <body>
    @inertia
  </body>
</html>
