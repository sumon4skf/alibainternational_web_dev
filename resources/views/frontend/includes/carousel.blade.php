<div class="container">
  <div class="row">
    <div class="col-lg-9 offset-lg-3">
      <div class="row">
        <div class="col-lg-8 p-md-0">
          <div class="banner_section slide_medium shop_banner_slider staggered-animation-wrap">
            <div id="carouselExampleControls" class="carousel slide carousel-fade light_arrow" data-ride="carousel">
              <div class="carousel-inner">

                @forelse ($banners as $banner)
                <div class="carousel-item @if($loop->first) active @endif background_bg"
                  data-img-src="{{asset($banner->post_thumb)}}">
                </div>
                @empty
                <div class="carousel-item active background_bg"
                  data-img-src="https://www.sumontech.com/assets/img/bg.jpg">
                  <div class="banner_slide_content">
                  </div>
                </div>
                @endforelse

              </div>
              <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev"><i
                  class="icon-left-open"></i></a>
              <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next"><i
                  class="icon-right-open"></i></a>
            </div> <!-- carouselExampleControls -->
          </div>
        </div> <!--  col-lg-8 -->
        <div class="col-lg-4">
          <div class="login_wrap loginSubmitCard" style="margin-top:8px">
            <div class="padding_eight_all bg-white">
              <div class="text-center">
                <h2 class="font-weight-bold my-2 my-3">Login</h2>
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

              <div class="form-group text-center">
                <a href="{{ route('frontend.auth.register') }}" class="btn d-block h5 p-0 text-primary">
                  @lang('Register Now')
                </a>
                <a href="{{ route('frontend.auth.password.reset') }}" class="btn d-block h5 p-0 text-primary">
                  @lang('Forgot Password')
                </a>
              </div> <!-- form-group -->

              <div class="different_login">
                <span> or</span>
              </div>
              
              @include('frontend.auth.includes.socialite')

            </div>
          </div>
        </div> <!--  col-lg-4 -->

      </div> <!--  row -->
    </div> <!--  col-md-9 -->

  </div>
</div> <!--  container -->