<div class="fixed-bottom mobileNavFooter d-lg-none">
  <nav class="row m-0 position-relative">
    <div class="col">
      <a class="nav-link" href="/category" data-toggle="collapse" data-target="#navCatContent">
        <i class="icon-menu"></i>
        <p>Category</p>
      </a>
    </div>
    <div class="col">
      <a class="nav-link" href="{{route('frontend.user.dashboard')}}">
        <i class="icon-user-male"></i>
        <p>Account</p>
      </a>
    </div>
    <div class="col">
      <a class="nav-link mobile_home_icon" href="{{route('frontend.index')}}">
        <i class="icon-home-1"></i>
      </a>
    </div>
    <div class="col">
      <a class="nav-link" href="tel:{{get_setting('office_phone')}}">
        <i class="icon-phone"></i>
        <p>Call</p>
      </a>
    </div>
    <div class="col">
      <a class="nav-link" href="https://m.me/23423" target="_blank">
        <i class="icon-chat-empty"></i>
        <p>Chat</p>
      </a>
    </div>
  </nav>
</div>