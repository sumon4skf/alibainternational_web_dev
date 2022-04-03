@extends('frontend.layouts.app')

@section('title', __('navs.frontend.dashboard') )

@section('content')

<div class="breadcrumb_section bg_gray page-title-mini py-3">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-12">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="{{route('frontend.index')}}">Home</a></li>
          <li class="breadcrumb-item active">@lang('Dashboard')</li>
        </ol>
      </div>
    </div>
  </div> <!-- END CONTAINER-->
</div> <!-- BREADCRUMB -->

<div class="main_content">
  <div class="section pt-4">
    <div class="container">
      <div class="card">
        <div class="card-body">

          <div class="row">
            <div class="col-lg-2 col-md-3 col-sm-4">
              <a href="{{route('frontend.user.dashboard')}}">
                <div class="card mb-3">
                  <div class="card-body text-center">
                    <h2><i class="icon-th-thumb-empty"></i></h2>
                    <h4>Dashboard</h4>
                  </div>
                </div>
              </a>
            </div> <!-- col-md-6 -->
            <div class="col-lg-2 col-md-3 col-sm-4">
              <a href="{{route('frontend.user.dashboard', ['tab' => 'orders'])}}">
                <div class="card mb-3">
                  <div class="card-body text-center">
                    <h2><i class="icon-cart"></i></h2>
                    <h4>Orders</h4>
                  </div>
                </div>
              </a>
            </div> <!-- col-md-6 -->
            <div class="col-lg-2 col-md-3 col-sm-4">
              <a href="{{route('frontend.user.dashboard', ['tab' => 'wishlist'])}}">
                <div class="card mb-3">
                  <div class="card-body text-center">
                    <h2><i class="icon-heart-1"></i></h2>
                    <h4>Wishlist</h4>
                  </div>
                </div>
              </a>
            </div> <!-- col-md-6 -->
            <div class="col-lg-2 col-md-3 col-sm-4">
              <a href="{{route('frontend.user.dashboard', ['tab' => 'invoice'])}}">
                <div class="card mb-3">
                  <div class="card-body text-center">
                    <h2><i class="icon-link-ext"></i></h2>
                    <h4>Invoices</h4>
                  </div>
                </div>
              </a>
            </div> <!-- col-md-6 -->
            <div class="col-lg-2 col-md-3 col-sm-4">
              <a href="{{route('frontend.user.dashboard', ['tab' => 'address'])}}">
                <div class="card mb-3">
                  <div class="card-body text-center">
                    <h2><i class=" icon-location"></i></h2>
                    <h4>Address</h4>
                  </div>
                </div>
              </a>
            </div> <!-- col-md-6 -->
            <div class="col-lg-2 col-md-3 col-sm-4">
              <a href="{{route('frontend.user.dashboard', ['tab' => 'account'])}}">
                <div class="card mb-3">
                  <div class="card-body text-center">
                    <h2><i class="icon-user-male"></i></h2>
                    <h4>Account</h4>
                  </div>
                </div>
              </a>
            </div> <!-- col-md-6 -->
            <div class="col-lg-2 col-md-3 col-sm-4">
              <a href="{{ route('frontend.auth.logout') }}">
                <div class="card mb-3">
                  <div class="card-body text-center">
                    <h2><i class="icon-right"></i></h2>
                    <h4>Logout</h4>
                  </div>
                </div>
              </a>
            </div> <!-- col-md-4 -->
          </div>




          <hr>


          @php
          $tab = request('tab');
          @endphp

          <div class="row">
            <div class="col-lg-12 col-md-12">
              <div class="tab-content dashboard_content">
                <div class="tab-pane fade @if(!$tab || $tab == 'dashboard') active show @endif " id="dashboard"
                  role="tabpanel" aria-labelledby="dashboard-tab">
                  @include('frontend.user.includes.dashboard')
                </div>
                <div class="tab-pane fade @if($tab == 'orders') active show @endif" id="orders" role="tabpanel"
                  aria-labelledby="orders-tab">
                  @include('frontend.user.includes.orders')
                </div>
                <div class="tab-pane fade @if($tab == 'invoice') active show @endif" id="invoice" role="tabpanel"
                  aria-labelledby="orders-tab">
                  @include('frontend.user.includes.invoice')
                </div>
                <div class="tab-pane fade @if($tab == 'address') active show @endif" id="address" role="tabpanel"
                  aria-labelledby="address-tab">
                  @include('frontend.user.includes.address', ['addresses' => $addresses])
                </div>
                <div class="tab-pane fade  @if($tab == 'account') active show @endif" id="account" role="tabpanel"
                  aria-labelledby="account-tab">
                  @include('frontend.user.includes.account')
                </div>
              </div>
            </div>
          </div> <!-- row -->
        </div> <!-- card-body -->
      </div> <!-- card -->

    </div>
  </div>
</div> <!-- END MAIN CONTENT -->
@endsection


@push('after-styles')
@livewireStyles
@endpush

@push('after-scripts')

@livewireScripts

@if (request('payment') === 'successful')
<script>
  window.localStorage.removeItem('TB0pQDcfjymepm6vmhwp66LASgLgSHaoDU2');
  window.localStorage.removeItem('summary');


</script>
@endif


<script>
  $(function(){
  $(document).on('click', '.nav-tabs li a', function(event){
    event.preventDefault();
    var href = $(this).attr('href');
    href = href.replace("#", '');
    window.history.replaceState({}, "", 'dashboard?tab='+href);
})
})


</script>

@endpush