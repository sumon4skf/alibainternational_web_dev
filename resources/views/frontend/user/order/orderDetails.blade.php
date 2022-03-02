@extends('frontend.layouts.app')

@section('title', 'Order Item Details' )

@php
$currency = get_setting('currency_icon');
$productLoader = get_setting('product_image_loader');
@endphp
@section('content')

<div class="breadcrumb_section bg_gray page-title-mini py-3">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-12">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="{{route('frontend.index')}}">Home</a></li>
          <li class="breadcrumb-item"><a href="{{route('frontend.user.dashboard')}}">@lang('Dashboard')</a>
          </li>
          <li class="breadcrumb-item">
            <a href="{{route('frontend.user.dashboard',['tab'=>'orders'])}}">@lang('Orders')</a>
          </li>
          <li class="breadcrumb-item active">@lang('Details')</li>
        </ol>
      </div>
    </div>
  </div> <!-- END CONTAINER-->
</div> <!-- BREADCRUMB -->



<div class="main_content">
  <div class="section pb-5">
    <div class="container">
      <div class="justify-content-around row">
        <div class="col-md-9">
          <div class="card">
            <div class="card-body">

              <div class="row">
                <div class="col">
                  <div class="table-responsive">


                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th class="text-center" style="width: 120px;">#</th>
                          <th class="text-center">Details</th>
                          <th class="text-center">Status</th>
                          <th class="text-center" style="width:120px">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        @php
                        $itemTotalPrice = 0;
                        $invoiceTotal = 0;
                        $totalChinaShipping = 0;
                        $totalShippingCharge = 0;
                        @endphp
                        @foreach ($order->orderItems as $item)
                        <tr>
                          <td class="text-left" colspan="4">
                            <h6>
                              <a href="{{url($item->link)}}" target="_blank">{{strip_tags($item->name)}}</a>
                            </h6>
                            <span class="ml-3">#{{$item->order_item_number}}</span>
                          </td>
                        </tr>
                        @php
                        $itemTotalPrice = 0;
                        @endphp
                        @foreach($item->itemVariations as $variationKey => $variation )
                        @php
                        $attributes = json_decode($variation->attributes);
                        $sinQuantity = $variation->quantity;
                        $price = $variation->price;
                        $subTotal = $variation->subTotal;
                        $itemTotalPrice += $subTotal;
                        @endphp
                        <tr>
                          <td class="align-middle text-center p-1">
                            <img src="{{asset($variation->image)}}" class="img-fluid">
                          </td>
                          <td class="text-left align-middle">
                            @forelse ($attributes as $attribute)
                            @php
                            $PropertyName = $attribute->PropertyName;
                            $Value = $attribute->Value;
                            @endphp
                            @if ($loop->first)

                            <p class="m-0">{!! $PropertyName !!}: <span class="ml-2">{!!
                                $Value !!}</span></p>
                            <p class="m-0">
                              Unit Price:
                              <span class="ml-2">{{$price}}</span>
                            </p>
                            <p class="m-0">
                              Quantity: <span class="ml-2">{{$sinQuantity}}</span>
                            </p>

                            @else
                            <p class="m-0">{!! $PropertyName !!}: {!! $Value !!}</p>
                            @endif
                            @empty

                            <p class="m-0">No Attributes</p>
                            <p class="m-0">UnitPrice: {{$price}} </p>
                            <p class="m-0">Quantity: {{$sinQuantity}}</p>

                            @endforelse

                          </td>
                          <td class="text-center align-middle">waiting</td>
                          <td class="text-right align-middle">{{$subTotal}}</td>
                        </tr>
                        @endforeach
                        <tr>
                          @php
                          $chinaLocalDelivery = $item->chinaLocalDelivery;
                          @endphp
                          <td class="text-right align-middle" colspan="3">China local sipping
                            cost (+)</td>
                          <td class="text-right align-middle">
                            {{floating($chinaLocalDelivery)}}</td>
                        </tr>

                        <tr>
                          @php
                          $shippingCharge = $item->shipping_rate *
                          (is_numeric($item->actual_weight) ?
                          $item->actual_weight :
                          0);
                          @endphp
                          <td class="text-right align-middle" colspan="3">
                            <p class="m-0">China to BD sipping cost (+)</p>
                            <p class="m-0 text-danger">Shipping Method
                              {{$item->shipped_by .' - '.floating($item->shipping_rate)}}
                              Per KG</p>
                            <p class="m-0 text-danger">Approx weight -
                              {{$item->actual_weight ? $item->actual_weight : 0 }} KG</p>
                          </td>
                          <td class="text-right align-middle">{{floating($shippingCharge)}}
                          </td>
                        </tr>
                        <tr>
                            @php
                            $itemTotalPrice = $itemTotalPrice + $chinaLocalDelivery + $shippingCharge;
                            $invoiceTotal += $itemTotalPrice;
                            $totalChinaShipping += $chinaLocalDelivery;
                            $totalShippingCharge += $shippingCharge;
                            @endphp
                          <td class="text-right" colspan="3">Item Total</td>
                          <td class="text-right"><span class="totalItemPrice">{{floating($itemTotalPrice)}}</span>
                          </td>
                        </tr>

                        @endforeach
                      </tbody>
                    </table>

                    <table class="table table-bordered table-striped">
                      @php
                      $advanchedRate = (int) get_setting('advanced_payment');
                      @endphp
                      <tr>
                        <td class="text-right" colspan="5">Total Payable</td>
                        <td class="text-right"  style="width:120px">{{$currency.' '.floating($order->amount)}}</td>
                      </tr>
                      @if ($order->coupon_victory)
                      <tr>
                        <td class="text-right" colspan="5">Coupon</td>
                        <td class="text-right">{{$currency.'
                          '.floating($order->coupon_victory)}}</td>
                      </tr>
                      @endif

                      <tr>
                        <td class="text-right" colspan="5">Deposit {{$advanchedRate}}%</td>
                        <td class="text-right">{{$currency.' '.floating($order->needToPay)}}</td>
                      </tr>
                      <tr>
                        <td class="text-right text-danger" colspan="5">Due</td>
                        <td class="text-right text-danger">{{$currency.' '.floating($order->dueForProducts)}}</td>
                      </tr>

                    </table>


                  </div>
                </div> <!-- col-->
              </div> <!-- row-->

            </div> <!-- card-body-->
          </div> <!-- card-->
        </div> <!-- .card -->
      </div> <!-- col-lg-9 -->
    </div> <!-- row-->
  </div>
</div>
</div> <!-- END MAIN CONTENT -->
@endsection
