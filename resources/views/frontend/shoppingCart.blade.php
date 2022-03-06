@extends('frontend.layouts.app')

@section('title', 'Your Shopping Cart')


@section('content')

<div class="breadcrumb_section bg_gray page-title-mini py-3">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-6">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="{{route('frontend.index')}}">Home</a></li>
          <li class="breadcrumb-item active">Checkout</li>
        </ol>
      </div>
    </div>
  </div>
</div>


<div class="main_content" data-page="shopCart">

  <!-- START SECTION SHOP -->
  <div class="section pt-3">
    <div class="container">
      <div class="row">
        <div class="col-sm-8">
          <div class="card">
            <div class="card-body py-4">
              <div class="table-responsive ">
                <table class="table table-bordered" id="shoppingCartTable">
                  <thead>
                    <tr>
                      <th class="text-center p-0" style="width: 10%;">
                        <div class="custome-checkbox">
                          <input class="form-check-input" type="checkbox" id="all-check" name="all-check">
                          <label class="form-check-label" for="all-check"></label>
                        </div>
                      </th>
                      <th class="text-left" colspan="2">
                        <a href="/remove-from-cart" id="removeFromCart" class="btn btn-link text-danger">Remove</a>
                        <span class="ml-2">Product</span>
                      </th>
                      <th class="text-center" style="width: 15%">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-center" colspan="3">Empty</td>
                    </tr>
                    <!-- cart item append this block -->
                  </tbody>
                </table>
              </div>
            </div> <!-- card-body -->
          </div> <!-- card -->
        </div> <!-- col-sm-8 -->
        <div class="col-sm-4">
          <div class="card">
            <div class="card-body py-4">
              <div class="d-flex heading_s1 justify-content-between mb-3">
                <h5>@lang('Shipping Address')</h5>
                <button type="button" class="btn btn-link p-0" data-toggle="modal"
                  data-target="#shippingAddressModal">Manage
                </button>
              </div>
              <div class="mb-4 shippingAddress">
                <div class="card" style="border: 1px solid #f1b815">
                  <div class="card-body defaultAddressCardBody p-1 px-3">
                    {{-- default address append here --}}
                  </div>
                </div>
              </div>

              <div class="heading_s1 mb-3">
                <h5>@lang('Apply Coupon')</h5>
              </div>
              <form id="couponApplyForm">
                <div class="form-group">
                  <div class="input-group">
                    <input type="text" class="form-control" id="coupon_code" placeholder="Coupon" autocomplete="off"
                      required="required">
                    <div class="input-group-append">
                      <button type="submit" class="btn btn-default" data-toggle="tooltip"
                        title="@lang('Apply your coupon')">@lang('Apply')</button>
                    </div>
                  </div>
                </div>
              </form>

              <div class="heading_s1 mb-3">
                <h5>@lang('Order Summary')</h5>
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
                      <td class="cart_total_amount text-right"><span id="couponVictory">0.00</span></td>
                    </tr>

                    <tr>
                      <td class="cart_total_label">Need to Pay {{get_setting('advanced_payment', 50)}}%</td>
                      <td class="cart_total_amount text-right"><span id="needToPay">0.00</span></td>
                    </tr>
                    <tr>
                      <td class="cart_total_label">Due (+ fees)</td>
                      <td class="cart_total_amount text-right"><strong id="dueForProducts">0.00</strong></td>
                    </tr>
                    <tr>
                      <td colspan="2" class="text-center text-danger">
                        {{get_setting('order_summary_bottom_message')}}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <a href="{{route('frontend.payment')}}"
                class="btn btn-block proceedButton btn-default d-none d-lg-block">Proceed</a>

            </div> <!-- card-body -->
          </div> <!-- card -->
        </div> <!-- col-sm-4 -->
      </div> <!-- row -->
    </div>
  </div>
  <!-- END SECTION SHOP -->


  <div class="modal fade" id="shippingAddressModal" data-backdrop="static" data-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable ">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">
            Shipping Address
            <button type="button" class="btn btn-link p-0 ml-3" id="addNewAddress">Add New</button>
            <button type="button" class="btn btn-link p-0 ml-3" id="showAllAddress" style="display: none">All
              Address
            </button>
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div> <!-- modal-header -->
        <div class="modal-body" id="modalAddressBody"
          data-addressIndex="{{route('frontend.ajax.customer.address.show')}}"
          data-addressStore="{{route('frontend.ajax.customer.address.store')}}"
          data-addressDelete="{{route('frontend.ajax.customer.address.delete')}}"
          data-addressSetDefault="{{route('frontend.ajax.customer.address.store.default')}}">

        </div> <!-- modal-body -->
        <div class="modal-footer justify-content-center">
          {{-- <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">Close</button>--}}
        </div>
      </div>
    </div>
  </div>


</div>
<!-- END MAIN CONTENT -->
@endsection