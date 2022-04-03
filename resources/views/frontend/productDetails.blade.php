@php
$productLoader = get_setting('product_image_loader');
$Title = $product->Title;
$MainPictureUrl = $product->MainPictureUrl;
@endphp

@extends('frontend.layouts.app')

@section('title', strip_tags($Title))

@section('meta_title', strip_tags($Title))
@section('meta_image', asset($MainPictureUrl))



@php
$item_id = $product->ItemId;
$VendorId = $product->VendorId;
@endphp


@section('content')

<div class="breadcrumb_section bg_gray page-title-mini py-3">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-6">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="{{route('frontend.index')}}">Home</a></li>
          <li class="breadcrumb-item active">Product</li>
        </ol>
      </div>
    </div>
  </div>
</div>


<div class="main_content" data-page="productDetails" data-cO7QTHpkoZrKge5aGkDc="{{route('frontend.ajax.getItemPrice')}}"
  data-rrkYPyDrsPBVqjadmXIy="{{route('frontend.ajax.getItemDescription')}}"
  data-js2vlTEbP355hrBUhDo5="{{route('frontend.ajax.getItemSellerInformation')}}">
  <div class="section pt-3" style=" background-color: #eee;">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="card productDetailsCard  bg-white">
            <div class="card-body">
              <h4 class="product_title mb-3" style="font-size: 20px; ">{!! strip_tags($Title) !!}
              </h4>

              <div class="row">
                <div class="col-md-6 mb-4 mb-md-0">
                  <div class="product-image">
                    @php
                    $first = true;
                    @endphp
                    @foreach($Pictures as $picture)
                    @php
                    $pictureUrl = $picture['Url'] ?? '';
                    $pictureLarge = $picture['Large']['Url'] ?? '';
                    $pictureSmall = $picture['Small']['Url'] ?? '';
                    @endphp

                    @if($first)
                    @if(url_exists($pictureUrl))
                    @php $first = false; @endphp
                    <div class="product_img_box">
                      <img id="product_img" src='{{$pictureUrl}}' data-zoom-image="{{$pictureUrl}}" />
                      <a href="#" class="product_img_zoom" title="Zoom">
                        <i class="icon-zoom-in"></i>
                      </a>
                    </div>
                    <div id="pr_item_gallery" class="product_gallery_item slick_slider" data-slides-to-show="5"
                      data-slides-to-scroll="1" data-infinite="false">
                      @endif
                      @endif

                      @if(url_exists($pictureUrl))
                      <div class="item">
                        <a href="#" class="product_gallery_item" data-image="{{$pictureLarge}}"
                          data-zoom-image="{{$pictureLarge}}">
                          <img src="{{$pictureSmall}}" alt="{{ strip_tags($Title)}}" />
                        </a>
                      </div>
                      @endif

                      @if($loop->last)
                    </div>
                    @endif

                    @endforeach

                  </div> <!-- product-image -->
                </div> <!-- col-lg-6 -->

                <div class=" col-md-6">
                  <div class="pr_detail" id="itemFullInfo" data-id="{{$item_id}}">
                    <div class="product_description">
                      <div class="card mb-3" style="background: #e63b2c;">
                        <div class="card-body py-3">
                          <div class="product_price mainPrice table-responsive">
                            {{-- product price will append here --}}
                          </div>
                        </div>
                      </div>
                      <div class="attributesLoader">
                        {{-- product attributes will append here --}}
                      </div> <!-- pr_switch_wrap -->

                      <div class="pr_desc table-responsive itemCalculationTable"
                        style="margin-bottom: 10px;max-height: 150px;background: #eee;border-radius: 4px;">
                        {{-- item calculation will load here --}}
                        <div class="spinner-border text-muted" style="width: 22px; height: 22px"></div>
                      </div> <!-- pr_desc -->

                      <hr>

                      <div class="pr_desc table-responsive">

                        <table class="table table-bordered text-center" id="fromChinatoBd" style="table-layout: fixed;">
                          <tbody>
                            <tr class="names" style="background-color: #ff4000;color:#fff;">
                              <td>Quantity</td>
                              <td>Total</td>
                              <td>Approx Weight</td>
                            </tr>
                            <tr class="pricing">
                              <td><span id="totalQuantity">0</span></td>
                              <td>
                                {{currency_icon()}} <span id="totalPrice">0.00</span>
                              </td>
                              <td>
                                <span id="approxWeight">0.00 KG</span>
                                <button type="button" class="btn m-0 p-0 info_text_color" data-trigger="hover"
                                  data-container="body" data-toggle="popover" data-placement="top"
                                  data-content="{{get_setting('approx_weight_message')}}">
                                  &nbsp; <i class="icon-info-circled"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <hr>

                        @php
                        $message = get_setting('china_local_delivery_message');
                        $deliveryCharge = currency_icon().' '.get_setting('china_local_delivery_charge_limit');
                        $message = str_replace('[china_delivery_charge]', $deliveryCharge, $message);
                        @endphp
                        <ul class="product-meta">
                          <li>
                            <div class="form-group">
                              <label for="shipping_rate" class="d-none"></label>
                              <select class="form-control" name="shippingMethod" id="shipping_rate">
                                <option value="ship_by_air" data-charge="sadf">Shipping Method: By Air (15-25)
                                  Days</label></option>
                                <option value="ship_by_sea" data-charge="200">Shipping Method: By Sea (45-90) Days
                                </option>
                              </select>
                            </div>
                          </li>
                          <li>
                            Shipping Charge: <a href="#">{{currency_icon()}}<span id="airShippingCharge">
                                {{maxAirShippingCharge()}}
                              </span> Per KG</a>
                          </li>
                          {{-- <li>Total Price: <a href="#">{{currency_icon()}} <span id="totalPrice">0.00</span></a>
                          </li> --}}
                          <li><span class="text-danger">{{get_setting('china_to_bd_bottom_message')}}</span></li>
                        </ul>
                      </div>
                    </div> <!-- product_description -->
                    <hr />
                    <div class="cart_extra">
                      <div class="cart_btn d-none d-md-inline-block">
                        <a class="add_wishlist d-none d-lg-inline-block btn @if($exit_wishList) disabled @endif"
                          href="{{route('frontend.user.wishlist.store')}}" data-auth="{{ auth()->check() }}"
                          data-id="{{$item_id}}">
                          <i class="icon-heart"></i> Save
                        </a>
                        <button class="btn btn-addToCart d-none d-md-inline-block" type="button">
                          <i class="icon-cart"></i> @lang('Add to cart')
                        </button>
                        <a class="btn btn-product btnBuyNow" href="{{route('frontend.shoppingCart')}}">
                          @lang('Buy Now')
                        </a>
                      </div>
                    </div>
                    <hr>
                    <ul class="product-meta">
                      <li>Product Code: {{$item_id}}</li>
                      <li>Total Sold: <span id="TotalSales"></span></li>
                      <li>Seller Score: <span id="VendorScore"></span></li>
                    </ul>
                    <hr />


                    <div class="cart_extra">
                      <div class="cart_btn">
                        <a class="btn btn-primary"
                          href="https://www.facebook.com/share.php?u={{url()->current()}}&title={{strip_tags($Title)}}"
                          target="blank" title="share on facebook">
                          <i class="icon-facebook"></i>
                        </a>
                        <a class="btn btn-primary" href="fb-messenger://share/?link={{url()->current()}}"
                          data-action="share/messenger/share" target="blank" title="share to messenger">
                          <i class="icon-comment"></i>
                        </a>
                        <a class="btn btn-success" href="whatsapp://send?text={{url()->current()}}"
                          data-action="share/whatsapp/share" target="blank" title="share to whatsapp">
                          <i class=" icon-whatsapp"></i>
                        </a>
                      </div>
                    </div>

                  </div>
                </div>
              </div> <!-- row -->
            </div>
          </div>
        </div> <!-- col-12 -->
      </div> <!-- row -->

      <div class="row">
        <div class="col-12">
          <div class="card bg-white mt-3">
            <div class="card-body">
              <div class="tab-style3">
                <ul class="nav nav-tabs" role="tablist">
                  <li class="nav-item">
                    <a class="nav-link active" id="Additional-info-tab" data-toggle="tab" href="#Additional-info"
                      role="tab" aria-controls="Additional-info" aria-selected="true">Additional info</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link " id="Description-tab" data-toggle="tab" href="#Description" role="tab"
                      aria-controls="Description" aria-selected="false">Description</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" id="Shipping-tab" data-toggle="tab" href="#Shipping" role="tab"
                      aria-controls="Shipping" aria-selected="false">Shipping & Delivery</a>
                  </li>
                </ul>
                <div class="tab-content shop_info_tab">
                  <div class="tab-pane fade show active" id="Additional-info" role="tabpanel"
                    aria-labelledby="Additional-info-tab">
                    {{-- additional information attributes data append here --}}
                  </div>
                  <div class="tab-pane fade" id="Description" role="tabpanel" aria-labelledby="Description-tab">
                    <p class="text-center">
                      <a href="#" class="btn btn-fill-out" id="loadDescription">Show Full Description</a>
                    </p>
                  </div>
                  <div class="tab-pane fade" id="Shipping" role="tabpanel" aria-labelledby="Shipping-tab">
                    {!! isset($page->post_content) ? $page->post_content : '' !!}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div> <!-- row -->

      <div class="row">
        <div class="col-12">
          <div class="card bg-white mt-3">
            <div class="card-body">
              <div class="border-bottom heading_s4 pb-2">
                <h2>Related Products</h2>
              </div>
              <div id="related_products" data-product-id="{{$product->ItemId}}"
                data-category-id="{{$product->CategoryId}}"
                class="product_slider carousel_slider dot_style1 nav_style5">
                {{-- section content append by ajax --}}
              </div>
            </div>
          </div> <!-- card -->
        </div> <!-- card-body -->
      </div> <!-- row -->



    </div>
  </div> <!-- END SECTION SHOP -->

</div> <!-- END MAIN CONTENT -->


<span id="productBox" class="d-none"></span>

@endsection


@push('middle-styles')
<link rel="stylesheet" href="{{ mix('css/product.css') }}">
@endpush

@push('midle-scripts')
<script src="{{mix('js/product.js')}}"></script>

@endpush