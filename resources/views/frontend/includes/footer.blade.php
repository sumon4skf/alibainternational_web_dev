<!-- START FOOTER -->
<footer class="bg_footer border-top mt-4">
  <div class="footer_top small_pt pb_20">
    <div class="container">
      <div class="row">
        <div class="col-md-3 col-12">
          <div class="widget">
            <div class="footer_logo">
              <a href="{{route('frontend.index')}}">
                <img src="{{asset(get_setting('frontend_logo_footer'))}}" alt="{{app_name()}}">
              </a>
            </div>
            <ul class="contact_info">
              <li>
                <i class="ti-location-pin"></i>
                {!! get_setting('office_address') !!}
              </li>
              <li>
                <i class="ti-email"></i>
                <a href="mailto:{{get_setting('office_email')}}">{{get_setting('office_email')}}</a>
              </li>
              <li>
                <i class="ti-mobile"></i>
                <p>
                  <a href="tel:{{get_setting('office_phone')}}" style="color: inherit;font-size: 14px;">
                    {{get_setting('office_phone')}}
                  </a>
                </p>
              </li>
            </ul>
          </div>
          <div class="widget">
            <ul class="social_icons">
              @if (get_setting('facebook'))
              <li>
                <a href="{{get_setting('facebook')}}" class="sc_facebook" data-toggle="tooltip" title="Facebook"
                  target="_blank">
                  <i class="fab fa-facebook-f"></i>
                </a>
              </li>
              @endif
              @if (get_setting('instagram'))
              <li>
                <a href="{{get_setting('instagram')}}" class="sc_instagram" data-toggle="tooltip" title="Instagram">
                  <i class="fab fa-instagram"></i>
                </a>
              </li>
              @endif
              @if (get_setting('youtube'))
              <li>
                <a href="{{get_setting('youtube')}}" class="sc_youtube" data-toggle="tooltip" title="Youtube">
                  <i class="fab fa-youtube"></i>
                </a>
              </li>
              @endif
            </ul>
          </div>

        </div>
        <div class="col-md-3 col-12">
          <div class="widget">
            <h6 class="widget_title">Who we are</h6>
            <ul class="widget_links">
              <li><a href="{{route('frontend.aboutUs')}}">About Us</a></li>
              <li><a href="{{route('frontend.contact')}}">Contact Us</a></li>
              <li><a href="{{url('privacy-policy')}}">Privacy Policy</a></li>
              <li><a href="{{url('terms-conditions')}}">Terms & Conditions</a></li>
              <li><a href="{{url('return-and-refund-policy')}}">Return and Refund Policy</a></li>
              <li><a href="{{url('secured-payment')}}">Secured Payment</a></li>
              <li><a href="{{url('transparency')}}">Transparency</a></li>
            </ul>
          </div>
        </div>
        <div class="col-md-3 col-12">
          <div class="widget">
            <h6 class="widget_title">Customer Service</h6>
            <ul class="widget_links">
              <li><a href="{{url('how-to-buy')}}">How To Buy</a></li>
              <li><a href="{{url('shipping-and-delivery')}}">Shipping & Delivery</a></li>
              <li><a href="{{url('custom-and-shipping-charge')}}">Custom & Shipping Charge</a></li>
              <li><a href="{{url('delivery-charges')}}">Delivery Charges</a></li>
              <li><a href="{{url('minimum-order-quantity')}}">Minimum Order Quantity</a></li>
              <li><a href="{{url('prohibited-items')}}">Prohibited Items</a></li>
              <li><a href="{{url('fags')}}">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div class="col-md-3 col-12">
          <div class="widget">
            <h6 class="widget_title">My Account</h6>
            <ul class="widget_links">
              <li><a href="{{url('login')}}">Sign In</a></li>
              <li><a href="{{url('shopping-cart')}}">View Cart</a></li>
              <li><a href="{{url('wishlist')}}">My Wishlist</a></li>
              <li><a href="{{url('fags')}}">Help</a></li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </div>


  <div class="bottom_footer border-top-tran  py-3" style="border-color: #ddd;">
    <div class="container">
      <div class="row ">
        <div class="col-md-12 d-flex ">
          <div class="scmrz_dr" style="">
            <a href="#" target="_blank" title=""><img
                src="https://www.dearbd.com/storage/setting/logo/SSLCommerz-Pay-With-logo-All-Size-03-dearbd.png"
                style="width:100%"></a>
          </div>
        </div>
      </div> <!-- row -->
    </div>
  </div>

  <div class="bottom_footer border-top-tran  py-3" style="border-color: #ddd;">
    <div class="container">
      <div class="row ">
        <div class="col-md-12 d-flex justify-content-center ">
          <div class="Ot_dr" style="">
            <a href="https://otcommerce.com" target="_blank" title="Powered by OT Commerce"><img
                src="https://www.dearbd.com/storage/setting/logo/otcommerce-logo-dearbd.png" style="width:58px"></a>
          </div>
          <div class="footer-text-center align-items-center d-flex mb-md-0">
            {{get_setting('copyright_text')}}
          </div>
        </div>
        {{-- <div class="col-md-6 d-flex justify-content-center">
          <div class="footer-text-left align-items-center d-flex mb-md-0">
            {{get_setting('copyright_text')}}
          </div>
        </div> --}}
      </div> <!-- row -->
    </div>
  </div>
</footer> <!-- END FOOTER -->


{{-- <a href="#" class="scrollup" style="display: none;"><i class="ion-ios-arrow-up"></i></a> --}}

<!--
  Developed By Sumon Ahmed
  Email: sumon4skf@gmail.com
  Phone: 01734905649
  Company: http://avanteca.com.bd
-->