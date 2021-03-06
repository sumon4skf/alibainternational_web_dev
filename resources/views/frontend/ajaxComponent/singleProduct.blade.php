@php
$productLoader = get_setting('product_image_loader');
$currency = currency_icon();
@endphp

@forelse($items as $item)
@php
$Id = getArrayKeyData($item, 'Id', '#');
$Title = getArrayKeyData($item, 'Title');
$FeaturedValues = getArrayKeyData($item, 'FeaturedValues', []);
$Price = getArrayKeyData($item, 'Price', []);
$OriginalPrice = getArrayKeyData($Price, 'OriginalPrice', 0);
$Pictures = getArrayKeyData($item, 'Pictures', []);
$thumb = getArrayKeyData($item, 'MainPictureUrl', null);
if(!empty($Pictures)){
$Pictures = $Pictures[0] ?? [];
$Small = getArrayKeyData($Pictures, 'Medium', null);
$thumb = getArrayKeyData($Small, 'Url', $thumb);
}
@endphp

<div class="px-2 mb-2 item">
  <a href="{{route('frontend.product', $Id)}}">
    <div class="product">
      <div class="product_img text-center">
        <img class="b2bLoading product-thumbnail" data-src="{{asset($thumb)}}" src="{{asset($productLoader)}}">
      </div>
      <div class="product_info">
        @if($Title)
        <h5 class="product_title"> {!! strip_tags($Title) !!}</h5>
        @endif
        <div class="product_price">
          <span class="price">{{$currency}} {{convertedPrice($OriginalPrice)}}</span>
          <small class="float-right py-1 text-muted">SOLD: {{GetFeaturedValues($FeaturedValues, 'TotalSales',
            0)}}</small>
        </div>
      </div>
    </div>
  </a>
</div>

@empty

<div class="col-12">
  <div class="text-center">
    <a href="{{url()->current()}}"> Reload the Page</a>
    <a href="{{url('/')}}"> Go to Home Page</a>
  </div>
</div>

@endforelse