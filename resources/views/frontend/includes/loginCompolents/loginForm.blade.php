<div class="login_wrap" style="margin-top:8px">
  <div class="padding_eight_all bg-white">
    <div class="text-center">
      <h2 class="font-weight-bold mb-4">Login</h2>
    </div>

    <div class="loginOption mb-3">
      <div class="btn-group w-100" role="group" aria-label="btn-toolbox">
        <button type="button" class="loginOptionBtn btn btn-default" data-method="otp">With OTP</button>
        <button type="button" class="loginOptionBtn btn btn-outline-danger" data-method="email">With Email</button>
      </div>
    </div>

    <div class="loginLoading d-none">
      @include('frontend.includes.loginCompolents.includes.loginLoading')
    </div>

    <div class="loginForm loginWithOtp">
      @include('frontend.includes.loginCompolents.includes.otpLoginForm')
    </div>

    <div class="loginForm otpSubmitForm d-none">
      @include('frontend.includes.loginCompolents.includes.otpSubmitForm')
    </div>

    <div class="loginForm withEmailLogin d-none">
      @include('frontend.includes.loginCompolents.includes.emailLoginForm')
    </div>

    <div class="loginForm passwordSubmitForm d-none">
      @include('frontend.includes.loginCompolents.includes.passwordSubmitForm')
    </div>
    <div class="clearfix">
      <a href="{{ route('frontend.auth.register') }}" class="btn float-left p-0 text-primary">
        @lang('Register Now')
      </a>
      <a href="{{ route('frontend.auth.password.reset') }}" class="btn float-right p-0 text-primary">
        @lang('Forgot Password')
      </a>
    </div> <!-- form-group -->

    <div class="different_login">
      <span> or</span>
    </div>

    @include('frontend.auth.includes.socialite')

  </div>
</div>