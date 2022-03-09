<div class="modal fade" id="generateInvoiceModal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog  modal-xl" role="document">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenterTitle">Generate Invoice</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form action="{{route('admin.invoice.store')}}" id="generateInvoiceForm">
          <div class="hiddenField">
            {{-- hidden input field append here --}}
          </div>

          <table class="table table-bordered text-center">
            <thead>
              <tr>
                <th scope="col">SL</th>
                <th scope="col">Item No.</th>
                <th scope="col" class="text-left">Product</th>
                <th scope="col">Status</th>
                <th scope="col">Weight</th>
                <th scope="col">Due</th>
              </tr>
            </thead>
            <tbody id="invoiceItem"></tbody>
            <tfoot id="invoiceFooter">
              <tr>
                <td colspan="4" class="text-right">Total</td>
                <td class="text-right"><span class="total_weight">0.000</span></td>
                <td class="text-right"><span class="total_due">0.00</span></td>
              </tr>
              <tr>
                <td colspan="4" class="align-middle text-right">
                  <div class="row">
                    <div class="col">
                      @php
                      $payment_method = [
                      '' => '- Payment Method -',
                      'Cash' => 'Cash',
                      'Bkash' => 'Bkash',
                      'Cash on Delivery' => 'Cash on Delivery',
                      'Bank' => 'Bank',
                      'sslcommerz' => 'SSLcommerz',
                      'Nagod' => 'Nagod',
                      'Rocket' => 'Rocket',
                      'others' => 'Others',
                      ];
                      @endphp
                      {{html()->select('payment_method', $payment_method)->class('form-control')}}
                    </div>
                    <div class="col">
                      @php
                      $delivery_method = [
                      '' => '- Delivery Method -',
                      'office_delivery' => 'Office Delivery',
                      'sundarban' => 'Sundarban',
                      'sa_poribohon' => 'SA Poribohon',
                      'papperfly' => 'Papperfly',
                      'pathao' => 'Pathao',
                      'tiger' => 'Tiger',
                      'others' => 'Others',
                      ];
                      @endphp
                      {{html()->select('delivery_method', $delivery_method)->class('form-control')}}
                    </div>
                    <div class="col">
                      <p class="courier_bill_text m-0" style="display: none">
                        Courier Bill <a href="#" class="ml-3 removeCourierBtn text-danger">Remove</a>
                      </p>
                      <div class="input-group courierSubmitForm">
                        <input type="text" name="courier_bill" class="form-control" placeholder="Courier Bill">
                        <div class="input-group-append applyCourierBtn" style="cursor: pointer">
                          <span class="input-group-text" id="Courier-addon2">Apply</span>
                        </div>
                      </div>
                    </div>
                  </div> <!-- row -->
                </td>
                <td class="text-center">-</td>
                <td class="text-right"><span class="courier_bill">0.00</span></td>
              </tr>
              <tr>
                <td colspan="4" class="text-right">Total Payable</td>
                <td class="text-center">-</td>
                <td class="text-right"><span class="total_payable">0.00</span></td>
              </tr>
              <tr>
                <td colspan="6" class="p-0">
                  <table id="additionalTable" class="m-0 table table-borderless table-sm">
                    <tbody>
                      {{-- additional field will be append here --}}
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr id="totalRowWithCharges">
                <td colspan="5" class="text-right">
                  Total Payable After Charges
                </td>
                <td class="text-right">
                  <span class="TotalWithCharges">0.00</span>
                </td>
              </tr>

              <tr>
                <td colspan="5"></td>
                <td class="text-center">
                  <button type="button" class="btn btn-danger btn-block btnAddAdditional">
                    Additional
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>

          <div class="form-group form-check">
            <input type="checkbox" name="notify" value="1" class="form-check-input" id="notifyUser" checked="true">
            <label class="form-check-label" for="notifyUser">Notify User</label>
          </div>
      </div>
      <div class="modal-footer justify-content-start">
        <button type="submit" class="btn btn-success">Generate </button>
        <button type="button" data-dismiss="modal" class="btn btn-primary">Cancel</button>
      </div>
      </form>

    </div>
  </div>
</div> <!-- changeStatusButton -->