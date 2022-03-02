<div class="banner_section slide_medium shop_banner_slider staggered-animation-wrap">
  <div class="container">
    <div class="row">
      <div class="col-lg-9 offset-lg-3 pl-md-0">

        <div id="carouselExampleControls" class="carousel slide carousel-fade light_arrow" data-ride="carousel">
          <div class="carousel-inner">

            @forelse ($banners as $banner)
            <div class="carousel-item @if($loop->first) active @endif background_bg"
              data-img-src="{{asset($banner->post_thumb)}}">
            </div>
            @empty
            <div class="carousel-item active background_bg" data-img-src="https://www.sumontech.com/assets/img/bg.jpg">
              <div class="banner_slide_content">
              </div>
            </div>
            @endforelse

          </div>
          <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev"><i
              class="ion-chevron-left"></i></a>
          <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next"><i
              class="ion-chevron-right"></i></a>
        </div> <!-- carouselExampleControls -->

      </div> <!--  col-lg-9 -->
    </div> <!--  row -->
  </div> <!--  container -->

</div>