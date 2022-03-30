@extends('frontend.layouts.app')

@section('title', app_name() . ' | ' . __('labels.frontend.auth.register_box_title'))

@section('content')

<div class="main_content">
  <div class="login_register_wrap section">
    <div class="container">
      <div class="row justify-content-center">
        
        <div class="col-lg-4 col-md-6 col-sm-12">
          <div class="login_wrap">

            <div class="padding_eight_all bg-white">
              
              <div class="text-center">
                <img src="{{asset(get_setting('frontend_logo_menu'))}}" style="height: 80px " alt="chinaonline">
                <h2 class="font-weight-bold my-2 my-3">@lang('Create an account')</h2>
              </div>

              @include('frontend.auth.includes.socialite')

              <div class="different_login">
                <span> or</span>
              </div>

              {{ html()->form('POST', route('frontend.auth.register.post'))->open() }}
              <div class="form-group">
                {{ html()->label(__('First Name'))->for('first_name') }}
                {{ html()->text('first_name')
                        ->class('form-control')
                        ->placeholder(__('First Name'))
                        ->attribute('maxlength', 191)
                        ->required()}}
              </div> <!-- form-group-->
              <div class="form-group">
                {{ html()->label(__('Last Name'))->for('last_name') }}
                {{ html()->text('last_name')
                        ->class('form-control')
                        ->placeholder(__('Last Name'))
                        ->attribute('maxlength', 191)
                        ->required()}}
              </div> <!-- form-group-->

              <div class="form-group">
                {{ html()->label(__('validation.attributes.frontend.email'))->for('email') }}
                {{ html()->email('email')
                            ->class('form-control')
                            ->placeholder(__('validation.attributes.frontend.email'))
                            ->attribute('maxlength', 191)
                            ->required() }}
              </div> <!-- form-group -->

              <div class="form-group">
                {{ html()->label(__('validation.attributes.frontend.password'))->for('password') }}
                {{ html()->password('password')
                          ->class('form-control')
                          ->placeholder(__('validation.attributes.frontend.password'))
                          ->attribute('autocomplete', 'new-password')
                          ->required() }}
              </div> <!-- form-group -->

              <div class="form-group">
                {{ html()->label(__('validation.attributes.frontend.password_confirmation'))->for('password_confirmation') }}
                {{ html()->password('password_confirmation')
                          ->class('form-control')
                          ->placeholder(__('validation.attributes.frontend.password_confirmation'))
                          ->attribute('autocomplete', 'new-password')
                          ->required() }}
              </div> <!-- form-group -->

              <div class="form-group">
                @if(config('access.captcha.registration'))
                  @captcha
                  {{ html()->hidden('captcha_status', 'true') }}
                @endif
              </div> <!-- form-group -->

              <div class="form-group">
                <button type="submit" class="btn btn-block btn-fill-out"> @lang('Register')</button>
              </div> <!-- form-group// -->
              {{ html()->form()->close() }}

              <div class="form-group text-center">
                <p class="login_info_msg">@lang('Have an Account?') <a href="{{route('frontend.auth.login')}}"
                                                                       class="btn p-0 text-primary">@lang('Login')</a>
                </p>
              </div> <!-- form-group -->

            </div>
          </div>
        </div> <!-- col -->


      </div> <!-- row -->
    </div> <!-- container -->
  </div> <!-- login_register_wrap -->
</div> <!-- login -->
@endsection

@push('after-styles')
<style>
  .login {
    background-image: url('{{asset('images/frontend/carousel/carousel-2.jpg')}}');
    background-position: center;
    background-size: cover;
    height: 100vh;
    padding: 50px 0;
  }

  .get-started {
    display: none;
  }
</style>
@endpush

{{-- @push('after-scripts')
@if(config('access.captcha.registration'))
@captchaScripts
@endif
@endpush --}}