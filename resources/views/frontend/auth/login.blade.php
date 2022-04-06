@extends('frontend.layouts.app')

@section('title', app_name() . ' | ' . __('labels.frontend.auth.login_box_title'))

@section('content')
<div class="main_content">
  <!-- START LOGIN SECTION -->
  <div class="login_register_wrap section" style="padding-bottom: 50px">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-4 col-md-6 col-sm-12">
          <div class="login_wrap loginSubmitCard shadow">
            <div class="padding_eight_all bg-white">
              <div class="text-center">
                <img src="{{asset(get_setting('frontend_logo_menu'))}}" style="height: 80px " alt="chinaonline">
              </div>

              @include('frontend.includes.loginCompolents.loginForm')

            </div>
          </div>

        </div>
      </div>
    </div>
  </div> <!-- END LOGIN SECTION -->

</div>
@endsection

@push('middle-styles')
<link rel="stylesheet" href="{{ asset('assets/plugins/intl-tel-input/css/intlTelInput.css') }}">
@endpush

@push('after-scripts')
<script src="{{asset('assets/plugins/intl-tel-input/js/intlTelInput.js')}}"></script>
<script src="{{asset('assets/plugins/scripts.js')}}"></script>
@endpush