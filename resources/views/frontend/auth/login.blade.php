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
                <h2 class="font-weight-bold my-2 my-3">Login</h2>
              </div>

              @include('frontend.auth.includes.socialite')

              <div class="different_login">
                <span> or</span>
              </div>

              <div class="loginWithOtp">
                <div class="form-group mb-4">
                  <input type="text" id="phone_number" class="form-control" placeholder="{{ __('Your phone number') }}"
                    required="required" autocomplete="off" />
                  <input type="hidden" name="phone" id="phone" value="1" required="required">
                  <p class="text-danger d-none small phone_error_msg"></p>
                </div> <!-- form-group -->

                {{html()->hidden('remember')->value(1)}}

                <div class="form-group">
                  <button type="submit" id="otpSubmitBtn" class="btn btn-default btn-block" name="login">SIGN UP
                    / LOGIN</button>
                </div>
              </div>

              <div class="form-group text-center mb-5">
                <a href="{{ route('frontend.auth.register') }}" class="btn d-block h4 p-0 text-primary">
                  @lang('Register Now')
                </a>
                <a href="{{ route('frontend.auth.password.reset') }}" class="btn d-block h4 p-0 text-primary">
                  @lang('Forgot Password')
                </a>
              </div> <!-- form-group -->

            </div>
          </div>

          <div class="login_wrap otpSubmitCard shadow d-none">
            <div class="padding_eight_all bg-white">
              <div class="heading_s1">
                <h4>
                  <button type="button" id="backToLoginCard" class="btn mr-2 p-0 text-danger">
                    <i class="icon-arrow-left"></i> Back
                  </button>
                  Verify Your Phone Number
                </h4>
              </div>

              <div class="otp_submit_form">
                <h6 class="text-center"> We just sent you an SMS with an OTP code. </h6>
                <p class="text-center"> To complete your phone number login, please enter the 4-digit OTP code below.
                </p>
                <div class="form-group">
                  <input type="hidden" name="userId" class="userId">
                  <input type="hidden" name="userPhone" class="userPhone">
                  <input type="text" name="otp_code" class="form-control text-center otp_code" placeholder="----"
                    maxlength="4" required="true" autofocus="true" autocomplete="off">
                  <small id="phone" class="form-text text-muted text-center">e.g: 1234</small>
                </div> <!-- form-group -->
                <div class="form-group">
                  <button type="submit" id="otpCodeSubmitBtn" class="btn btn-default btn-block">Resend Code
                    30</button>
                </div>
              </div>

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