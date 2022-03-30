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
                <h2 class="font-weight-bold my-2 my-3">@lang('Reset Password')</h2>
              </div>


              {{ html()->form('POST', route('frontend.auth.password.reset'))->class('form-horizontal')->open() }}
              {{ html()->hidden('token', $token) }}

              <div class="form-group">
                {{ html()->label(__('validation.attributes.frontend.email'))->for('email') }}
                {{ html()->email('email')
                ->class('form-control')
                ->placeholder(__('validation.attributes.frontend.email'))
                ->attribute('maxlength', 191)
                ->required() }}
              </div>

              <div class="form-group">
                {{ html()->label(__('validation.attributes.frontend.password'))->for('password') }}
                {{ html()->password('password')
                ->class('form-control')
                ->placeholder(__('validation.attributes.frontend.password'))
                ->required() }}
              </div> <!-- form-group-->

              <div class="form-group">
                {{
                html()->label(__('validation.attributes.frontend.password_confirmation'))->for('password_confirmation')
                }}
                {{ html()->password('password_confirmation')
                ->class('form-control')
                ->placeholder(__('validation.attributes.frontend.password_confirmation'))
                ->required() }}
              </div> <!-- form-group-->

              <div class="form-group">
                {{ form_submit(__('labels.frontend.passwords.reset_password_button'),'btn btn-block btn-fill-out') }}
              </div>
              {{ html()->form()->close() }}
             
              <div class="form-note text-center"> 
                Have an Account? <a href="{{route('frontend.auth.login')}}">Sign In now</a>
              </div>
            </div>
          </div>
        </div>
      </div><!-- row -->
    </div><!-- container -->
  </div><!-- login_register_wrap -->
</div>
@endsection