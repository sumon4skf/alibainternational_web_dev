<div class="fixed-bottom mobileNavFooter d-lg-none">
  <nav class="row m-0">
    <div class="col">
      <a class="add_wishlist btn-block btn  @if($exit_wishList) disabled @endif" href="{{route('frontend.user.wishlist.store')}}"      
        data-status="{{ $exit_wishList }}" data-auth="{{ auth()->check() }}" 
        style="border-top-right-radius: 0; border-bottom-right-radius: 0;" 
        data-id="{{$item['ItemId'] ?? $item['Id'] ?? ''}}">
        <i class="far fa-heart"></i> Save
      </a>
    </div>
    <div class="col">
      <button class="btn btn-block btn-addToCart"
      style="border-radius: 0"
        type="button">
        <i class="icon-basket-loaded"></i> @lang('Add to cart')
      </button>
    </div>
    <div class="col">
      <a class="btn btn-block btnBuyNow"
      style="border-top-left-radius: 0; border-bottom-left-radius: 0;" 
        href="{{route('frontend.shoppingCart')}}">
        @lang('Buy Now')
      </a>
    </div>
  </nav>
</div>