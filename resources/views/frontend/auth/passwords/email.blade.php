@extends('frontend.layouts.app')

@section('title', app_name() . ' | ' . __('labels.frontend.passwords.reset_password_box_title'))

@section('content')
<div class="main_content">
  <div class="login_register_wrap section">
    <div class="container">
      <div class="row justify-content-center align-items-center">

        <div class="col-lg-4 col-md-6 col-sm-12">
          <div class="login_wrap">
            <div class="padding_eight_all bg-white">

              <div class="text-center">
                <img src="{{asset(get_setting('frontend_logo_menu'))}}" style="height: 80px " alt="chinaonline">
                <h2 class="font-weight-bold my-2 my-3">Reset Password</h2>
              </div>

              {{ html()->form('POST', route('frontend.auth.password.email.post'))->open() }}

              <div class="form-group">
                {{ html()->label(__('validation.attributes.frontend.email'))->for('email') }}
                {{ html()->email('email')
                ->class('form-control')
                ->placeholder(__('validation.attributes.frontend.email'))
                ->attribute('maxlength', 191)
                ->required()
                ->autofocus() }}
              </div>

              @if(session('status'))
              <div class="alert alert-success">
                {{ session('status') }}
              </div>
              @endif

              <div class="form-group">
                {{ form_submit(__('labels.frontend.passwords.send_password_reset_link_button'),'btn btn-block
                btn-fill-out') }}
              </div>
              {{ html()->form()->close() }}
              <div class="different_login">
                <span> or</span>
              </div>
              <div class="form-note text-center"> 
                Have an Account? <a href="{{route('frontend.auth.login')}}">Sign In now</a>
              </div>
            </div>
          </div>
        </div>


      </div><!-- row -->
    </div>
  </div>
</div>
@endsection