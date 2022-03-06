@php
$productLoader = get_setting('product_image_loader');
$currency = currency_icon();
@endphp
@foreach ($products as $Product)
<div class="item">
  <div class="product_wrap">
    <a href="{{url('product/'.$Product->ItemId)}}">
      <div class="product_img">
        @php
        $Pictures = isset($Product->Pictures) ? json_decode($Product->Pictures) : null;
        $Pictures = $Pictures ? collect($Pictures)->where('IsMain', true)->first() : null;
        $thumb = isset($Pictures->Medium) ? $Pictures->Medium->Url : $Product->MainPictureUrl;
        @endphp
        <img class="product-thumbnail" data-src="{{asset($thumb)}}"   data-src-retina="{{asset($thumb)}}" src="{{asset($productLoader)}}">
      </div>
    </a>
    <div class="product_info">
      <h6 class="product_title">
        <a href="{{url('product/'.$Product->ItemId)}}">
          {!! strip_tags($Product->Title) !!}
        </a>
      </h6>
      <div class="product_price">
        @php
        $price = json_decode($Product->Price, true);
        $price = getArrayKeyData($price, 'OriginalPrice');
        $price = $price ? $price : $Product->Price;
        @endphp
        <span class="price">{{ $currency.' '.convertedPrice($price)}}</span>
        <small class="float-right py-1 text-muted">SOLD: {{GetFeaturedValues($Product->FeaturedValues, 'TotalSales',
          0)}}</small>
      </div>
    </div>
  </div>
</div>
@endforeach