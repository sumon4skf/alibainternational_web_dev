(function ($) {
  const body = $("body");

  $(body)
    .on("click", ".edit-item", function (event) {
      event.preventDefault();
      let href = $(this).attr("href");
      let editItemForm = $("#editItemForm");
      axios
        .get(href)
        .then(response => {
          let resData = response.data;
          if (resData.status) {
            editItemForm.find(".modal-title").text(resData.title);
            editItemForm.find(".modal-body").html(resData.editForm);
            editItemForm.modal("show");
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    })
    .on("click", ".btn-edit-status", function (event) {
      event.preventDefault();
      let href = $(this).attr("href");
      let statusChangeFormModal = $("#statusChangeFormModal");
      let status = $(this)
        .closest("div")
        .find(".order-status")
        .text();
      $("#editOrderStatus").attr("action", href);

      const exceptStatus = ["Waiting for Payment", "Partial Paid"];
      if (!exceptStatus.includes(status)) {
        statusChangeFormModal
          .find(`option[value=${status}]`)
          .attr("selected", "selected");
      }

      statusChangeFormModal.modal("show");
    })
    .on(
      "change blur keyup paste",
      "#shipping_rate, #actual_weight",
      function () {
        const rate = $("#shipping_rate").val();
        const weight = $("#actual_weight").val();
        const total = Number(rate) * Number(weight);
        $("#shipping_charge").val(Math.round(total));
      }
    )
    .on("click", ".toggleForm", function (event) {
      event.preventDefault();
      $(this)
        .closest("td")
        .find(".editField")
        .toggle();
    });



  $('button[data-toggle=popover]').popover({
    html: true,
    placement: 'auto',
    trigger: 'hover',
    // trigger: 'click',
  });




})(jQuery);
