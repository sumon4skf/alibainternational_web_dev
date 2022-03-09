<div class="fixed-bottom mobileNavFooter d-lg-none mobileCartButtons">
  <nav class="row m-0">
    <div class="col">
      <a class="add_wishlist btn-block btn  @if($exit_wishList) disabled @endif"
        href="{{route('frontend.user.wishlist.store')}}" data-status="{{ $exit_wishList }}"
        data-auth="{{ auth()->check() }}" data-id="{{$item['ItemId'] ?? $item['Id'] ?? ''}}">
        <i class="icon-heart-empty mr-2"></i> Save
      </a>
    </div>
    <div class="col">
      <button class="btn btn-block btn-addToCart" type="button">
        <i class="icon-cart"></i> @lang('Add to cart')
      </button>
    </div>
    <div class="col">
      <a class="btn btn-block btnBuyNow" href="{{route('frontend.shoppingCart')}}">
        <i class="icon-right"></i> @lang('Buy Now')
      </a>
    </div>
  </nav>
</div>