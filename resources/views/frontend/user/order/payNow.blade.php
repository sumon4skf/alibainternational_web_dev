@extends('frontend.layouts.app')

@section('title', 'Pay Incomplete Order' )

@php
$currency = get_setting('currency_icon');
$productLoader = get_setting('product_image_loader');
@endphp
@section('content')

<div class="main_content">
  <div class="section pb-5">
    <div class="container">
      <div class="justify-content-around row">
        <div class="col-md-9">
          <div class="card">
            <div class="card-header">
              <h3>Orders Id #{{$order->order_number}} / <span class="text-danger">{{$order->status}}</span></h3>
            </div>
            <div class="card-body">
              <div class="table-responsive mt-3">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th class="text-center" style="min-width: 100px">#</th>
                      <th class="text-center" colspan="2">Details</th>
                      <th class="text-center" style="width:20%">Rate({{$currency}})</th>
                      <th class="text-center" style="width:20%">Quantity</th>
                      <th class="text-center" style="width:20%">Total({{$currency}})</th>
                    </tr>
                  </thead>
                  <tbody>
                    @php
                    $totalProductPrice = 0;
                    @endphp

                    @foreach ($order->orderItems as $item)
                    <tr>
                      <td class="text-left" colspan="9">
                        <span style="font-size: 16px;" class="text-danger">{{$item->order_item_number}}</span> /
                        <a href="{{url($item->link)}}">{{strip_tags($item->name)}}</a>
                      </td>
                    </tr>
                    @php
                    $itemTotalPrice = 0;
                    @endphp

                    @foreach($item->itemVariations as $variationKey => $variation )

                    @php
                    $attributes = json_decode($variation->attributes);
                    $attrLength = count($attributes);
                    $sinQuantity = $variation->quantity;
                    $subTotal = $variation->subTotal;
                    $itemTotalPrice += $subTotal;
                    @endphp
                    @forelse ($attributes as $attribute)
                    @php
                    $PropertyName = $attribute->PropertyName;
                    $Value = $attribute->Value;
                    @endphp
                    @if ($loop->first)
                    <tr>
                      <td class="align-middle text-center" rowspan="{{$attrLength}}">
                        <img src="{{asset($variation->image)}}" class="img-fluid">
                      </td>
                      <td class="text-capitalize align-middle text-center">{!! $PropertyName !!}</td>
                      <td class="align-middle text-center">{{$Value}}</td>
                      <td class="align-middle text-center" rowspan="{{$attrLength}}"> <span
                          class="unitPrice">{{floating($variation->price)}}</span></td>
                      <td class="align-middle text-center" rowspan="{{$attrLength}}">{{$sinQuantity}}</td>
                      <td class="align-middle text-right" rowspan="{{$attrLength}}">
                        <span class="SingleTotal">{{floating($subTotal)}}</span>
                      </td>
                      @if ($variationKey === 0)
                      @php
                      $LengthTotal = (count($item->itemVariations) * $attrLength) + 4;
                      @endphp
                      @endif
                    </tr>
                    @else
                    <tr>
                      <td class="text-capitalize  text-center">{!! $PropertyName !!}</td>
                      <td class=" text-center">{{$Value}}</td>
                    </tr>
                    @endif
                    @empty
                    <tr>
                      <td class="align-middle text-center">
                        <img src="{{asset($variation->image)}}" class="img-fluid">
                      </td>
                      <td colspan="2" class="align-middle text-center">No Attribites</td>
                      <td class="align-middle text-center"> <span
                          class="unitPrice">{{floating($variation->price)}}</span></td>
                      <td class="align-middle text-center">{{$sinQuantity}}</td>
                      <td class="align-middle text-right">
                        <span class="SingleTotal">{{floating($subTotal)}}</span>
                      </td>
                    </tr>
                    @endforelse

                    @if ($variationKey === 0)
                    @php
                    $LengthTotal = (count($item->itemVariations) * $attrLength) + 4;
                    @endphp
                    @endif

                    @endforeach
                    @php
                    $chinaLocalDelivery = $item->chinaLocalDelivery;
                    $product_value = $item->product_value;
                    $shippingCharge = 0;
                    @endphp
                    <tr>
                      <td class="text-right" colspan="4">China Local Delivery</td>
                      <td class="text-center">-</td>
                      <td class="text-right"><span>{{floating($chinaLocalDelivery)}}</span></td>
                    </tr>

                    @if($item->coupon_contribution)
                    <tr>
                      <td class="text-right" colspan="4">Coupon (-)</td>
                      <td></td>
                      <td class="text-right"> <span
                          class="totalItemPrice">{{floating($item->coupon_contribution)}}</span>
                      </td>
                    </tr>
                    @endif
                    <tr>
                      <td class="text-right" colspan="4">
                        Shipping Rate <span class="text-danger">({{$currency}})
                          {{floating($item->shipping_rate)}}</span>
                        Per KG
                      </td>
                      <td class="text-center align-middle">-</td>
                      <td class="text-right align-middle"><span>{{floating($shippingCharge)}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-right" colspan="4">
                        Product Value
                      </td>
                      <td class="text-center align-middle">-</td>
                      <td class="text-right align-middle"><span>{{floating($product_value)}}</span>
                      </td>
                    </tr>

                    @endforeach
                  </tbody>
                  <tfoot>

                    @php
                    $totalProductPrice = $order->orderItems->sum('product_value');
                    @endphp
                    <tr>
                      <td class="text-right" colspan="4">Total Products Price</td>
                      <td class="text-center">-</td>
                      <td class="text-right align-middle"><span>{{floating($totalProductPrice)}}</span>
                      </td>
                    </tr>
                    @php
                    $advanchedRate = get_setting('advanced_payment', 50);
                    $advanchedPay = $order->orderItems->sum('first_payment');
                    $due = $totalProductPrice - $advanchedPay;
                    @endphp
                    <tr>
                      <td class="text-right" colspan="4">1st Payment {{$advanchedRate}}%</td>
                      <td class="text-center">-</td>
                      <td class="text-right align-middle"> <span
                          id="needToaPayAmount">{{floating($advanchedPay)}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-right text-danger" colspan="4">Due + Fees</td>
                      <td class="text-center">-</td>
                      <td class="text-right align-middle">
                        <span>{{floating($due)}}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div> <!-- table-responsive -->

              <p class="text-center text-danger">{{get_setting('payment_summary_bottom_message')}}</p>

              <div class="text-center my-4">

                <div class="card" style=" border: 1px dashed #eee; background: #f7f7f7;">
                  <div class="card-body">
                    @if (get_setting('cash_payment'))
                    <div class="form-group">
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="payment_method" id="cash_payment"
                          value="cash_payment">
                        <label class="form-check-label ml-2" for="cash_payment">
                          <span class="mr-2"> Cash Payment</span>
                        </label>
                      </div>
                    </div> <!-- form-group -->
                    @endif

                    @if (get_setting('sslcommerz_active'))
                    <div class="form-group">
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="payment_method" id="ssl-commerz"
                          value="ssl-commerz">
                        <label class="form-check-label ml-2" for="ssl-commerz">
                          <span class="mr-2"> SSL Commerz</span>
                        </label>
                      </div>
                    </div> <!-- form-group -->
                    @endif

                  </div>
                </div>

                <div class="form-check text-center my-4">
                  <input class="form-check-input" name="terms-field" type="checkbox" value="1" id="termsField">
                  <label class="form-check-label text-justify" for="termsField">
                    <span>I have read and agree to the website <a class="btn-link"
                        href="{{url('terms-conditions')}}}}">Terms and Conditions</a>, <a class="btn-link"
                        href="{{url('prohibited-items')}}">Prohibited Items</a> and <a class="btn-link"
                        href="{{url('return-and-refund-policy')}}">Refund Policy</a></span>
                  </label>
                </div>

                <button class="w-100 btn btn-fill-out" id="incompletePayNowBtn"
                  data-order="{{$order->transaction_id}}">@lang('Pay
                  Now')</button>
              </div>


              <div class="form-check form-check-inline">
                <label class="form-check-label" for="smanager">
                  <img src="{{asset('images/frontend/ssl-commerz-pay-with-logo-payment.webp')}}" alt="pay-with-smanager"
                    class="img-fluid">
                </label>
              </div>

            </div> <!-- div -->
          </div>
        </div> <!-- .card -->
      </div> <!-- col-lg-9 -->
    </div> <!-- row-->
  </div>
</div>
</div> <!-- END MAIN CONTENT -->
@endsection