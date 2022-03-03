<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @langrtl dir="rtl" @endlangrtl>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>@yield('title', app_name()) - {{app_name()}}</title>
  <meta name="description" content="@yield('meta_description', app_name())">
  <meta name="author" content="@yield('meta_author', 'Avanteca Web Apps Ltd.')">

  <meta property="fb:pages" content="103822615082014" />
  <meta property="fb:app_id" content="" />
  <meta property="og:local" content="{{ str_replace('_', '-', app()->getLocale()) }}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{{url()->full()}}">
  <meta property="og:title" content="@yield('meta_title')">
  <meta property="og:description" content="@yield('meta_description')">
  <meta property="og:image" content="@yield('meta_image')">

  <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('images/brand/apple-touch-icon.png')}}">
  <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/brand/favicon32.png')}}">
  <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('images/brand/favicon16.png')}}">
  <link rel="manifest" href="{{asset('images/brand/site.webmanifest')}}">


  @yield('meta')

  <link rel="stylesheet" href="{{asset('assets/plugins/fontello/css/fontello.css')}}">

  @stack('before-styles')

  <link rel="stylesheet" href="{{ mix('css/lib.css') }}">
  <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">

  @stack('middle-styles')
  <link rel="stylesheet" href="{{ mix('css/app.css') }}">
  @stack('after-styles')

  @include('includes.partials.ga')

  <script>
    window.b2b = JSON.parse(@JSON(general_settings(true)));
     window.lodingEllipsis = `<div class="lds-ellipsis lds-ellipsis-custom"><span></span><span></span><span></span></div>`;
     window.isAuth = '{{auth()->check()}}';
  </script>

</head>

<body>

  <div class="preloader loaded">
    <div class="spinner-container">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>


  @include('includes.partials.fb-chat')

  @include('includes.partials.read-only')
  @include('includes.partials.logged-in-as')

  @include('frontend.includes.nav')

  @include('includes.partials.messages')



  <main>
    @yield('content')
  </main>


  <div class="easy_connect d-none d-lg-block">
    <ul class="list-group">
      <li class="list-group-item">
        <a class="mobile" href="https://m.me/232" target="_blank">
          <span class="desktop_stick_nav_icon"><i class="icon-chat-empty"></i></span>
          <span class="desktop_stick_nav_text">Chat Us</span>
        </a>
      </li>
    </ul>
  </div>

  @include('frontend.includes.footer')

  @include('includes.partials.profile-update-alert')


  @if (Route::is('frontend.product*'))

  @include('frontend.includes.mobileProductFooter')


  @elseif(Route::is('frontend.shoppingCart'))

  @include('frontend.includes.checkoutStickyFooter')

  @else

  @include('frontend.includes.mobileNavFooter')

  @endif



  @stack('before-scripts')
  <script src="{{ mix('js/manifest.js') }}"></script>
  <script src="{{ mix('js/vendor.js') }}"></script>
  <script src="{{ mix('js/lib.js') }}"></script>
  <script src="{{ asset('assets/js/jquery.marquee.min.js') }}"></script>
  <script src="{{ mix('js/plugins.js') }}"></script>

  @stack('midle-scripts')

  <script src="{{ mix('js/app.js') }}"></script>

  @stack('after-scripts')

</body>

</html>