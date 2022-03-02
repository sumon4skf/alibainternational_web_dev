<div class="top-header light_skin py-1 d-none d-md-block">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-6 col-md-6">
        <div class="header_topbar_info">
          <div class="border-0 header_offer">
            <ul class="contact_detail text-center text-lg-left">
              <li>
                A Digital Trusted Online Wholesale Marketplace
              </li>
            </ul>
          </div>
          {{-- <div class="download_wrap"> --}}
            {{-- <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, fuga?</span> --}}
            {{-- </div> --}}
        </div>
      </div> <!-- col-md-2 -->

      <div class="col-lg-6 col-md-6">
        <div class="text-center text-md-right">
          <ul class="header_list">
            @if (get_setting('facebook'))
            <li>
              <a href="{{get_setting('facebook')}}" title="Facebook" target="_blank">
                <i class="fab fa-facebook-square"></i>
              </a>
            </li>
            @endif
            @if (get_setting('instagram'))
            <li>
              <a href="{{get_setting('instagram')}}" title="Instagram" target="_blank">
                <i class="fab fa-instagram"></i>
              </a>
            </li>
            @endif
            @if (get_setting('youtube'))
            <li>
              <a href="{{get_setting('youtube')}}" title="Youtube" target="_blank">
                <i class="fab fa-youtube"></i>
              </a>
            </li>
            @endif

            {{-- @if(config('locale.status') && count(config('locale.languages')) > 1)
            <li class="dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true"
                aria-expanded="false">
                <span class="d-md-down-none">@lang('menus.language-picker.language')
                  ({{ strtoupper(app()->getLocale()) }})</span>
              </a>
              @include('includes.partials.lang')
            </li>
            @endif --}}

          </ul>
        </div>
      </div>
    </div>
  </div>
</div>