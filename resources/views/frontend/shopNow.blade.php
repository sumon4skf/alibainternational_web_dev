@extends('frontend.layouts.app')

@section('title', 'Show Your Products')
@php
$productLoader = get_setting('product_image_loader');
@endphp

@section('content')
<div class="breadcrumb_section bg_gray page-title-mini  py-3">
  <div class="container">
    <!-- STRART CONTAINER -->
    <div class="row align-items-center">
      <div class="col-md-6">
        <div class="page-title">
          <h1>Show Now</h1>
        </div>
      </div>
      <div class="col-md-6">
        <ol class="breadcrumb justify-content-md-end">
          <li class="breadcrumb-item"><a href="{{route('frontend.index')}}">Home</a></li>
          <li class="breadcrumb-item active">Compare</li>
        </ol>
      </div>
    </div>
  </div> <!-- END CONTAINER-->
</div>

<div class="main_content">
  <div class="section" style="padding-bottom: 50px">
    <div class="container">
      <div class="row">
        @php
        $currency = currency_icon();
        @endphp
        @forelse($recentProducts as $item)
        <div class="col-lg-3 col-md-4 col-6 item">
          @php
          $url = route('frontend.product',$item->ItemId);
          $price = json_decode($item->Price);
          $OriginalPrice = $price->OriginalPrice ?? 0;
          @endphp
          <a href="{{$url}}">
            <div class="product">
              <div class="product_img text-center">
                <img class="b2bLoading product-thumbnail" data-src="{{asset($item->MainPictureUrl)}}" src="{{asset($productLoader)}}"
                  style="max-height:255px">
              </div>
              <div class="product_info">
                <h5 class="product_title"> {!! strip_tags($item->Title) !!}</h5>
                <div class="product_price">
                  <span class="price">{{$currency}} </span> <span
                    class="price">{{convertedPrice($OriginalPrice)}}</span>
                </div>
              </div>
            </div>
          </a>
        </div>

        @empty

        <div class="col-lg-3 col-md-4 col-6 item">
          <a href="#">
            <div class="product">
              <div class="product_img text-center">
                <img src="{{asset('assets/images/product_img1.jpg')}}" style="max-height: 255px"
                  alt="Blue Dress For Woman">

              </div>
              <div class="product_info">
                <h5 class="product_title"> Product Not Found</h5>
                <div class="product_price">
                  <span class="price">{{$currency}} </span> <span class="price">0.00</span>
                </div>
              </div>
            </div>
          </a>
        </div>

        @endforelse

      </div> <!-- row -->

      <div class="row">
        <div class="col-12">
          {{$recentProducts->onEachSide(1)->render()}}
        </div>
    </div> <!-- row -->



    </div>
  </div>
  <!-- END SECTION SHOP -->

</div>
<!-- END MAIN CONTENT -->

@endsection