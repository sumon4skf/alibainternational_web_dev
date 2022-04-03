<div class="login_wrap loginSubmitCard" style="margin-top:8px">
  <div class="padding_eight_all bg-white">
    <div class="text-center">
      <h2 class="font-weight-bold mb-4">Login</h2>
    </div>

    <div class="loginWithOtp">
      {{ html()->form('POST', route('frontend.auth.login.post'))->open() }}
      <div class="form-group">
        {{ html()->email('email')
        ->class('form-control')
        ->placeholder(__('validation.attributes.frontend.email'))
        ->attributes(['maxlength'=> 191, 'autocomplete' => 'email'])
        ->required() }}
      </div>
      <div class="form-group">
        {{ html()->password('password')
        ->class('form-control')
        ->placeholder(__('validation.attributes.frontend.password'))
        ->required() }}
      </div>

      {{html()->hidden('remember')->value(1)}}

      <div class="form-group">
        <button type="submit" id="otpSubmitBtn" class="btn btn-default btn-block" name="login">LOGIN</button>
      </div>
      {{ html()->form()->close() }}
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