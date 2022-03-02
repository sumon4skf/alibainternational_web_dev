@extends('frontend.layouts.app')

@section('title', 'Confirm Your Payment')

@php
$order_id = uniqid('De-');
@endphp

@section('content')
<div class="breadcrumb_section bg_gray page-title-mini py-3">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-12">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="{{route('frontend.index')}}">Home</a></li>
          <li class="breadcrumb-item"><a href="{{route('frontend.shoppingCart')}}">Checkout</a></li>
          <li class="breadcrumb-item active">@lang('Payment')</li>
        </ol>
      </div>
    </div>
  </div> <!-- END CONTAINER-->
</div> <!-- BREADCRUMB -->

<div class="main_content">

  <div class="section pt-3" data-page="payment">
    <div class="container">
      <div class="row justify-content-center mb-5">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body py-5">

              <div class="table-responsive payment_cart_table">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th class="text-left" colspan="2">Product</th>
                      <th class="text-center" style="min-width: 130px">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- cart item append this block -->
                  </tbody>
                </table>
              </div> <!-- payment_cart_table -->

              <div class="card">
                <div class="card-body">
                  <div class="heading_s1 mb-3">
                    <h3>@lang('Payment Summary')</h3>
                  </div>
                  <div class="table-responsive">
                    <table class="table">
                      <tbody>
                        <tr>
                          <td class="cart_total_label">Products Price</td>
                          <td class="cart_total_amount text-right"><span id="productTotalPrice">0.00</span></td>
                        </tr>
                        <tr id="couponRow">
                          <td class="cart_total_label">Coupon</td>
                          <td class="cart_total_amount text-right" id="couponDiscount">0.00</td>
                        </tr>
                        <tr>
                          <td class="cart_total_label">Need to Pay {{get_setting('advanced_payment', 50)}}%</td>
                          <td class="cart_total_amount text-right"><span id="needToPay">0.00</span>
                          </td>
                        </tr>
                        <tr>
                          <td class="cart_total_label">Due (Only for products)</td>
                          <td class="cart_total_amount text-right"><strong id="dueForProducts">0.00</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

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
                  </div>
                  <p class="text-center">Your personal data will be used to process your order, support
                    your
                    experience throughout this website, and for other purposes described in our <a
                      href="{{url('privacy-policy')}}" class="btn-link" target="_blank">privacy
                      policy</a>.
                  </p>

                  <div class="form-check text-center mb-4">
                    <input class="form-check-input" name="terms-field" type="checkbox" value="1" id="termsField">
                    <label class="form-check-label text-justify" for="termsField">
                      <span>I have read and agree to the website <a class="btn-link"
                          href="{{url('terms-conditions')}}">Terms and Conditions</a>, <a class="btn-link"
                          href="{{url('prohibited-items')}}">Prohibited Items</a>, <a class="btn-link"
                          href="{{url('return-and-refund-policy')}}">Return & Refund Policy</a></span>
                    </label>
                  </div>
                  <button class="btn btn-block btn-default text-white" title="Pay now" id="payNowBtn"
                    data-order="{{$order_id}}">@lang('Pay Now')</button>

                </div> <!-- card-body -->
              </div>

              <div class="form-check form-check-inline">
                <label class="form-check-label" for="smanager">
                  <img src="{{asset('images/frontend/ssl-commerz-pay-with-logo-payment.webp')}}" alt="pay-with-smanager"
                    class="img-fluid">
                </label>
              </div>

            </div> <!-- card-body -->
          </div> <!-- card -->

        </div> <!-- col-md-8 -->
      </div> <!-- row -->
    </div>
  </div>

</div> <!-- END MAIN CONTENT -->

@endsection