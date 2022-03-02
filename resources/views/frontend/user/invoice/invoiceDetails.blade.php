@extends('frontend.layouts.app')

@section('title', 'Order Item Details' )

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
              <h3>Invoice Id #{{$invoice->invoice_no}} | <span
                  class="text-success">{{readable_status($invoice->status)}}</span></h3>
            </div>
            <div class="card-body">
              <div class="table-responsive mt-3">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col" class="text-center">SL</th>
                      <th scope="col">OrderID.</th>
                      <th scope="col">ItemID.</th>
                      <th scope="col">Product</th>
                      <th scope="col">Quantity</th>
                      <th scope="col" class="text-center">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    @foreach($invoice->invoiceItems as $item)
                    <tr>
                      <td class=" align-middle">{{$loop->iteration}}</td>
                      <td class=" align-middle">{{$item->order->order_number ?? '00'}}</td>
                      <td class=" align-middle">{{$item->order_item->order_item_number ?? '00'}}</td>
                      <td class=" align-middle">{{$item->product_name}}</td>
                      <td class="text-center align-middle">{{$item->order_item->quantity ?? '0'}}</td>
                      <td class="text-right align-middle">{{round($item->items_total)}}</td>
                    </tr>
                    <tr>
                      <td class="text-right" colspan="5">Subtotal</td>
                      <td class="text-center">{{$item->items_total}}</td>
                    </tr>
                    <tr>
                      <td class="text-right" colspan="5">China Domestic Charge</td>
                      <td class="text-center">
                        {{round($item->china_shipping)}}
                      </td>
                    </tr>
                    <tr>
                      @php
                      $item_weight = $item->weight;
                      $weightCharge = $item->shipping_rate * $item_weight;
                      @endphp
                      <td class="text-right" colspan="5">Weight Charge ({{weight_floating($item_weight,3)}} KG)</td>
                      <td class="text-center">
                        {{round($weightCharge)}}
                      </td>
                    </tr>
                    @php
                    $courier_bill = $item->courier_bill;
                    @endphp
                    @if ($courier_bill)
                    <tr>
                      <td class="text-right" colspan="5">BD Courier Charge</td>
                      <td class="text-center">
                        {{round($courier_bill)}}
                      </td>
                    </tr>
                    @endif
                    <tr>
                      <td class="text-right" colspan="5">Subtotal</td>
                      <td class="text-center">{{round($item->items_payable)}}</td>
                    </tr>
                    <tr>
                      <td class="text-right" colspan="5">First Payment</td>
                      <td class="text-center">{{round($item->deposit)}}</td>
                    </tr>
                    <tr>
                      <td class="text-right" colspan="5">Due</td>
                      <td class="text-center">
                        @php
                        $due = abs($item->second_payment - $item->due_payment);
                        @endphp
                        {{round($due)}}
                      </td>
                    </tr>
                    @endforeach
                  </tbody>
                  <tfoot id="invoiceFooter">
                    <tr>
                      <td colspan="5" class="text-right">Total Payable</td>
                      <td class="text-right"><span class="total_payable"
                          data-user="{{$invoice->user_id}}">{{round($invoice->invoiceItems->sum('due_payment'))}}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div> <!-- table-responsive -->
            </div> <!-- card-body -->
          </div> <!-- .card -->
        </div> <!-- .card -->
      </div> <!-- col-lg-9 -->
    </div> <!-- row-->
  </div>
</div>
</div> <!-- END MAIN CONTENT -->
@endsection