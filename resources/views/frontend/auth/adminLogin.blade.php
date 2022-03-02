@extends('frontend.layouts.app')

@section('title', app_name() . ' | ' . __('labels.frontend.auth.login_box_title'))

@section('content')
<div class="main_content">
  <!-- START LOGIN SECTION -->
  <div class="login_register_wrap section" style="padding-bottom: 50px">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <div class="login_wrap loginSubmitCard shadow">
            <div class="padding_eight_all bg-white">
              <div class="heading_s1">
                <div class="text-center border-0">
                  <h2 class="font-weight-bold my-3">Login</h2>
                </div>
              </div>

              @include('frontend.auth.includes.socialite')

              <div class="different_login">
                <span> or</span>
              </div>


              <div class="loginWithEmail">
                {{ html()->form('POST', route('frontend.auth.login.post'))->open() }}
                <div class="form-group">
                  {{html()->label('Email Address')->for('email')}}
                  {{ html()->email('email')
                  ->class('form-control')
                  ->placeholder(__('validation.attributes.frontend.email'))
                  ->attributes(['maxlength'=> 191, 'autocomplete' => 'email'])
                  ->required() }}
                </div>
                <div class="form-group">
                  {{html()->label('Password')->for('password')}}
                  {{ html()->password('password')
                  ->class('form-control')
                  ->placeholder(__('validation.attributes.frontend.password'))
                  ->required() }}
                </div>

                {{html()->hidden('remember')->value(1)}}

                <div class="form-group">
                  <button type="submit" class="btn btn-default btn-block" name="login">
                    {{__('Login')}}
                  </button>
                </div>
                {{ html()->form()->close() }}
              </div>

              <div class="form-group text-center">
                <a href="{{ route('frontend.auth.password.reset') }}" class="btn p-0 text-primary">@lang('Forgot
                  password')</a>
              </div> <!-- form-group -->

              <div class="form-group text-center mb-4">
                <p class="login_info_msg">@lang('New to') {{app_name()}}?
                  <a href="{{route('frontend.auth.register')}}" class="btn p-0 text-danger">@lang('Create an
                    account')</a>
                </p>
              </div> <!-- form-group -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> <!-- END LOGIN SECTION -->



</div>
@endsection