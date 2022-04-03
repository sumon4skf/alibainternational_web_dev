<div class="login_wrap loginSubmitCard" style="margin-top:8px">
  <div class="padding_eight_all bg-white">
    <div class="text-center">
      <h2 class="font-weight-bold mb-3">
        {{$logged_in_user->name}}
      </h2>
    </div>

    <div class="row">
      <div class="col-md-6">
        <a href="{{route('frontend.user.dashboard')}}">
          <div class="card mb-3">
            <div class="card-body text-center">
              <h2><i class="icon-th-thumb-empty"></i></h2>
              <h4>Dashboard</h4>
            </div>
          </div>
        </a>
      </div> <!-- col-md-6 -->
      <div class="col-md-6">
        <a href="{{route('frontend.user.dashboard', ['tab' => 'orders'])}}">
          <div class="card mb-3">
            <div class="card-body text-center">
              <h2><i class="icon-cart"></i></h2>
              <h4>Orders</h4>
            </div>
          </div>
        </a>
      </div> <!-- col-md-6 -->
      <div class="col-md-6">
        <a href="{{route('frontend.user.dashboard', ['tab' => 'wishlist'])}}">
          <div class="card mb-3">
            <div class="card-body text-center">
              <h2><i class="icon-heart-1"></i></h2>
              <h4>Wishlist</h4>
            </div>
          </div>
        </a>
      </div> <!-- col-md-6 -->
      <div class="col-md-6">
        <a href="{{route('frontend.user.dashboard', ['tab' => 'invoice'])}}">
          <div class="card mb-3">
            <div class="card-body text-center">
              <h2><i class="icon-link-ext"></i></h2>
              <h4>Invoices</h4>
            </div>
          </div>
        </a>
      </div> <!-- col-md-6 -->
      <div class="col-md-6">
        <a href="{{route('frontend.user.dashboard', ['tab' => 'address'])}}">
          <div class="card mb-3">
            <div class="card-body text-center">
              <h2><i class=" icon-location"></i></h2>
              <h4>Address</h4>
            </div>
          </div>
        </a>
      </div> <!-- col-md-6 -->
      <div class="col-md-6">
        <a href="{{ route('frontend.auth.logout') }}">
          <div class="card mb-3">
            <div class="card-body text-center">
              <h2><i class="icon-right"></i></h2>
              <h4>Logout</h4>
            </div>
          </div>
        </a>
      </div> <!-- col-md-4 -->
    </div>

  </div>
</div>