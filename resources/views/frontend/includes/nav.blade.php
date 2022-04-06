@if(get_setting('top_notice_text_active'))
<div class="toHeaderNotice" style=" background: #fcf8ff">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-12">
        <div class="marquerNotice py-1 position-relative overflow-hidden">
          <div data-speed="50" data-gap="40" data-direction="left" data-duplicated="true" class='marquee'>
            <p class="m-0" style="color: #1f1f1f; font-weight: 400; font-size: 16px;">
              {{get_setting('top_notice_text')}}
            </p>
          </div>
        </div> <!-- col-md-12 -->
      </div>
    </div>
  </div> <!-- container -->
</div> <!-- toHeaderNotice -->
@endif

<header class="header_wrap">

  {{-- @include('frontend.includes.topHeader') --}}
  <div class="middle-header dark_skin">
    <div class="container">
      <div class="nav_block">
        <a class="navbar-brand" href="{{route('frontend.index')}}">
          <img class="logo_dark" src="{{asset(get_setting('frontend_logo_menu')) }}" alt="{{app_name()}}">
        </a>
        <div class="product_search_form radius_input search_form_btn">
          @include('frontend.includes.searchForm')
          <p class="m-0 searchSuggestText">Please press enter for data </p>
        </div> <!-- product_search_form -->

        <ul class="navbar-nav attr-nav align-items-center">
          <li>
            <a href="{{route('frontend.user.wishlist.index')}}" class="nav-link">
              <i class="icon-heart-empty"></i>
              <span class="wishlist_count wishlistCount">0</span>
            </a>
          </li>

          <li class="cart_trigger">
            <a href="{{route('frontend.shoppingCart')}}" class="nav-link">
              <i class="icon-shopping-bag"></i>
              <span class="cart_count">0</span>
            </a>
          </li>

          @guest
          <li class="d-none d-lg-inline">
            <a href="{{route('frontend.auth.login')}}" class="nav-link">
              <i class="icon-user-male"></i> <span>{{__('Login')}}</span>
            </a>
          </li>
          @else
          <li class="d-none d-lg-inline">
            @php
            $unreadNotice = $logged_in_user->unreadNotifications->count();
            @endphp
            <a class="dropdown-toggle nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true"
              aria-expanded="false">
              <i class=" icon-user-male"></i>
              <span class="ml-1 d-none d-md-inline">{{$logged_in_user->name}}</span>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              @can('view backend')
              <a href="{{route('admin.dashboard')}}" class="dropdown-item text-dark">{{__('Administration')}}</a>
              @endcan
              <a href="{{route('frontend.user.dashboard')}}" class="dropdown-item text-dark">{{__('Dashboard')}}</a>
              <a href="{{route('frontend.user.notification')}}" class="dropdown-item text-dark">
                <div class="clearfix">
                  <span class="float-left">{{__('Notification')}}</span>
                  <span class="badge badge-default float-right my-1">{{$unreadNotice ? $unreadNotice : 0}}</span>
                </div>
              </a>
              <a class="dropdown-item text-dark"
                href="{{route('frontend.user.dashboard', ['tab' => 'orders'])}}">{{__('My Orders')}}</a>
              <a href="{{route('frontend.user.account')}}" class="dropdown-item text-dark">{{__('My Account')}}</a>
              <a href="{{ route('frontend.auth.logout') }}"
                class="dropdown-item text-dark">@lang('navs.general.logout')</a>
            </div>
          </li>
          @endif
        </ul>
      </div>

      <div class="d-block d-lg-none">
        @include('frontend.includes.searchForm')
      </div> <!-- input-group -->


    </div>
  </div> <!-- bottom_header -->

  <div class="bottom_header dark_skin navbar_bottom">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-3 col-md-4 col-sm-6 col-3">
          <div class="categories_wrap">
            <button type="button" data-toggle="collapse" data-target="#navCatContent" aria-expanded="false"
              class="categories_btn  d-none d-md-inline categories_btn categories_menu collapsed">
              <i class="icon-menu"></i><span>All Categories </span>
            </button>
            @include('frontend.includes.navCatContent')
          </div>
        </div>
        <div class="col-lg-9 col-md-8 col-sm-6 col-9 d-none d-lg-block">
          <nav class="navbar navbar-expand-lg">
            <div class="collapse navbar-collapse mobile_side_menu" id="navbarSidetoggle">
              <ul class="navbar-nav ml-auto">
                <li>
                  <span class="nav-link"> BDT(৳)</span>
                </li>
                <li>
                  <span class="nav-link">|</span>
                </li>
              </ul>
            </div>
            <div class="contact_phone contact_support">
              <i class="icon-language"></i>
              <span>English</span>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>

  @auth
  <div class="middle-header dark_skin d-block d-md-none">
    <nav class="navbar">
      <div class="collapse navbar-collapse mobile_side_menu" id="navbarSidetoggle">
        <ul class="navbar-nav">
          <li class="dropdown">
            <a data-toggle="dropdown" class="nav-link dropdown-toggle active" href="#">Notification
              {{$unreadNotice}}</a>
            <div class="dropdown-menu">
              <ul>
                @forelse(auth()->user()->unreadNotifications as $notification)
                @if($notification->type == 'App\Notifications\OrderAuthInformation')
                @php
                $invoice_id = isset($notification->data['invoice_id']) ? $notification->data['invoice_id'] : null ;
                $notifyUrl = $invoice_id ? "admin/order/{$invoice_id}" : "admin/order";
                @endphp
                <li>
                  <a class="dropdown-item nav-link nav_item" href="{{url($notifyUrl)}}"
                    data-notice="{{$notification->id}}">Customer Placed a Order</a>
                </li>

                @elseif($notification->type == 'App\Notifications\OrderPending')
                <li>
                  <a class="dropdown-item nav-link nav_item" href="{{route('frontend.user.dashboard')}}#orders"
                    data-notice="{{$notification->id}}">
                    Your Order #{{$notification->data['invoice_id']}} Placed. Order total
                    {{currency_icon().' '.$notification->data['amount']}}
                  </a>
                </li>
                @endif
                @empty
                <li>
                  <a class="dropdown-item nav-link nav_item" href="#">You have no notification</a>
                </li>
                @endforelse
              </ul>
            </div>
          </li>

          @can('view backend')
          <li>
            <a class="nav-link nav_item" href="{{route('admin.dashboard')}}">
              {{__('Administration')}}
            </a>
          </li>
          @endcan
          <li>
            <a class="nav-link nav_item" href="{{route('frontend.user.dashboard')}}">
              {{__('Dashboard')}}
            </a>
          </li>
          <li>
            <a class="nav-link nav_item" href="{{route('frontend.user.dashboard', ['tab' => 'orders'])}}">
              {{__('My Orders')}}
            </a>
          </li>
          <li>
            <a class="nav-link nav_item" href="{{route('frontend.user.account')}}">
              {{__('My Account')}}
            </a>
          </li>
          <li>
            <a class="nav-link nav_item" href="{{ route('frontend.auth.logout') }}">
              @lang('navs.general.logout')
            </a>
          </li>
          <li>
            <a class="nav-link nav_item" href="{{route('frontend.contact')}}">Contact Us</a>
          </li>
        </ul>
      </div>
    </nav>
  </div> <!-- middle-header -->
  @endauth

</header>







@if (config('boilerplate.frontend_breadcrumbs'))
@include('frontend.includes.partials.breadcrumbs')
@endif