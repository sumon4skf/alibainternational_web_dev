(function ($) {

  function makeNewAdditionalRow($id) {
    return `<tr>
    <td style="width: 80px">
      <button type="button" class="btn btn-block btn-danger btnFieldRemove">Remove</button>
    </td>
    <td>
      <input type="text" name="additional[${$id}][name]" class="form-control text-right" placeholder="Charge Name">
    </td>
    <td style="width: 115px">
      <input type="text" name="additional[${$id}][amount]" class="form-control text-center chargeField" placeholder="Amount">
    </td>
  </tr>`;
  }

  $(document).on('click', '.btnAddAdditional', function () {
    let additionalTable = $("#additionalTable");
    let totalRow = additionalTable.find('tr').length;
    let row = makeNewAdditionalRow(totalRow + 1);
    additionalTable.removeClass('d-none').append(row);

    reCalculating();
  });

  function reCalculating() {
    let invoiceTotal = $('.total_payable').text();
    invoiceTotal = parseInt(invoiceTotal);
    $(".chargeField").each(function () {
      invoiceTotal += parseInt($(this).val());
    });
    if (invoiceTotal) {
      $(".TotalWithCharges").text(Number(invoiceTotal).toFixed(2));
    }
  }

  $(document).on('keyup change', '.chargeField', function () {
    reCalculating();
  });

  $(document).on('click', '.btnFieldRemove', function () {
    reCalculating();
    $(this).closest('tr').remove();
  });


})(jQuery);