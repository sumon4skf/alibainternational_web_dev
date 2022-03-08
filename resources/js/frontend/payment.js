import _ from "lodash";
import {
  productCart,
  customer_address,
  validateCartProducts,
  checkedItemTotalSummary,
  formattingPrice,
  clearProductCart
} from "./cartHelpers";

function loadAttributes(attributes) {
  let attrData = "";
  attributes.map(attribute => {
    attrData += `<p class="m-0"><span class="font-weight-bold">${attribute.PropertyName} : </span><span>${attribute.Value}</span></p>`;
  });
  return attrData;
}

function loaded_payment_cart() {
  let product = productCart();
  let currency = b2b.currency_icon;
  let cartProducts = product.filter(filterCart => filterCart.isCart === true);
  if (cartProducts.length) {
    let htmlData = "";
    cartProducts.map(product => {
      let productId = product.Id;
      let Title = product.Title;
      let MainPictureUrl = product.MainPictureUrl;
      let ActualPrice = product.ActualPrice;
      let ActualWeight = product.ActualWeight;
      let itemData = product.itemData;
      let shipped_by = product.shipped_by;
      let localDelivery = Number(product.localDelivery);

      let checkItemSummary = checkedItemTotalSummary(itemData);
      let totalPrice = checkItemSummary.totalPrice;
      let totalQuantity = checkItemSummary.totalQuantity;

      itemData
        .filter(filter => filter.isChecked === true)
        .map((singleItem, key) => {
          let itemCode = singleItem.itemCode;
          let maxQuantity = singleItem.maxQuantity;
          let image = singleItem.image;
          let attributes = singleItem.attributes;
          htmlData += `<tr>`;
          htmlData += `<td class="text-right align-middle" style="width:15%">
              <img src="${image ||
            MainPictureUrl}" class="img-fluid" alt="${Title}">
              </td>`;
          htmlData += `<td class="text-left align-middle">
                       <p class="m-0"><a href="/product/${productId}">
                       ${Title}</a></p>
                        ${attributes.length > 0 &&
            loadAttributes(attributes)}                         
                            <p class="m-0">
                              <span class="font-weight-bold">Price:</span>
                              <span>
                              ${currency} ${formattingPrice(singleItem.price)}
                               </span> 
                             </p>                       
                             <p class="m-0">
                               <span class="font-weight-bold">Quantity:</span>
                               <span> ${singleItem.quantity}</span> 
                              </p>
                     </td>`;

          htmlData += `<td class="text-right align-middle">${currency} ${formattingPrice(
            singleItem.subTotal
          )}</td>`;
        });

      htmlData += `<tr>
                  <td class="text-right" colspan="2">Total</td>
                  <td class="text-right">${currency} <span class="totalItemPrice">${formattingPrice(
        totalPrice
      )}</span></td></tr>`;

      htmlData += `<tr>
              <td class="text-right" colspan="2">China Local Shipping</td>
              <td class="text-right">${currency} ${formattingPrice(
        localDelivery
      )}</td></tr>`;
    });

    $(document)
      .find(".payment_cart_table")
      .find("tbody")
      .html(htmlData);
  }
}

function nagad_payment_process(tran_id, amount) {
  $.ajax({
    url: "/nagad-payment-process",
    method: "POST",
    data: {
      tran_id: tran_id,
      amount: amount
    },
    dataType: "json",
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
    },
    success: function (res) {
      console.log(res);
      if (res.status) {
        window.open(res.redirectUrl, "_self");
        // window.location.replace(res.redirectUrl);
        // window.location.assign(res.redirectUrl);
      }
    },
    error: function (xhr) {
      console.log(xhr);
    },
    complete: function () {
      console.log("complete");
    }
  });
}

function sslCommerzPaymentProcess(tran_id) {
  let preloader = $(".preloader");
  preloader.show();
  axios
    .post("/sslcommerz/payment", { tran_id: tran_id })
    .then(response => {
      let resData = response.data;

      if (resData.status === "success") {
        window.location.assign(resData.data);
      } else {
        Swal.fire({
          icon: "warning",
          text: "Payment process error, try again"
        });
      }
    })
    .catch(error => {
      console.log(error);
    })
    .then(() => {
      preloader.hide();
    });
}

function load_the_incomplete_payment(pay_method) {
  let amount = $(document)
    .find("#needToaPayAmount")
    .text();
  let tran_id = $("#incompletePayNowBtn").attr("data-order");

  if (pay_method === "bkash") {
    window.location.replace("/bkash/payment");
  } else if (pay_method === "nagad") {
    nagad_payment_process(tran_id, amount);
  } else if (pay_method === "ssl-commerz") {
    sslCommerzPaymentProcess(tran_id);
  } else if (pay_method === "smanager") {
    s_manager_payment_process(tran_id);
  } else if (pay_method === "cash_payment") {
    cash_payment_process(tran_id);
  }
}

function cash_payment_process(transaction_id) {
  axios
    .post("/ajax/invoice-cash-payment", { tran_id: transaction_id })
    .then(response => {
      let resData = response.data;
      if (resData.status) {
        Swal.fire({
          icon: "success",
          text: resData.msg
        });
        window.location.assign(resData.redirect);
      } else {
        Swal.fire({
          icon: "warning",
          text: resData.msg,
          customClass: {
            icon: "my-2",
            actions: "shadow-none",
            confirmButton: "shadow-none",
            denyButton: "shadow-none",
            cancelButton: "shadow-none"
          }
        });
      }
    });
}

function s_manager_payment_process(transaction_id) {
  axios
    .post("/ajax/s-manager-payment", { tran_id: transaction_id })
    .then(response => {
      let resData = response.data;
      if (resData.status) {
        // window.location.replace(resData.redirect);
        window.location.assign(resData.redirect);
      } else {
        Swal.fire({
          icon: "warning",
          text: resData.message,
          customClass: {
            icon: "my-2",
            actions: "shadow-none",
            confirmButton: "shadow-none",
            denyButton: "shadow-none",
            cancelButton: "shadow-none"
          }
        });
      }
    });
}

function load_the_payment_confirm(pay_method) {
  let OrderItem = productCart().filter(filter => filter.isCart === true);
  OrderItem = OrderItem.filter(product => product?.itemData?.filter(filter => filter.isChecked === true));

  let address = customer_address();
  let summary = window.localStorage.getItem("summary");
  summary = JSON.parse(summary);
  let tran_id = $("#payNowBtn").attr("data-order");

  axios
    .post("/ajax/order-confirm", {
      order_id: tran_id,
      pay_method: pay_method,
      OrderItem: JSON.stringify(OrderItem),
      summary: JSON.stringify(summary),
      address: JSON.stringify(address)
    })
    .then(response => {
      let responseData = response.data;
      if (responseData.status) {
        // clearProductCart();
        if (pay_method === "bkash") {
          window.location.replace("/bkash/payment");
        } else if (pay_method === "nagad") {
          let summary = responseData.summary;
          let amount = summary.needToPay;
          nagad_payment_process(tran_id, amount);
        } else if (pay_method === "ssl-commerz") {
          sslCommerzPaymentProcess(responseData.tran_id);
        } else if (pay_method === "smanager") {
          s_manager_payment_process(responseData.tran_id);
        } else if (pay_method === "cash_payment") {
          window.location.assign("/dashboard?tab=orders");
        }
      }
    });
}

function payment_summary() {
  let currency_icon = b2b.currency_icon;
  let summary = window.localStorage.getItem("summary");
  summary = JSON.parse(summary);
  $(document)
    .find("#productTotalPrice")
    .text(`${currency_icon} ` + Math.round(summary.productTotal));
  $(document)
    .find("#couponDiscount")
    .text(`${currency_icon} ` + Math.round(summary.couponDiscount));
  $(document)
    .find("#needToPay")
    .text(`${currency_icon} ` + Math.round(summary.needToPay));
  $(document)
    .find("#dueForProducts")
    .text(`${currency_icon} ` + Math.round(summary.dueForProducts));

  let couponRow = $(document).find("#couponRow");
  if (summary.couponDiscount) {
    couponRow.show();
  } else {
    couponRow.hide();
  }
}

$(document).on("click", ".payment_label", function () {
  $(".payment_label").removeClass("active");
  $(this).addClass("active");
  let method = $(this).attr("for");
  $("#payment_method").val(method);
});

$(document).on("change", "#termsField", function () {
  let formCheck = $(this)
    .closest(".form-check")
    .find("p");
  if ($(this).is(":checked")) {
    formCheck.hide();
  } else {
    formCheck.show();
  }
});

$(document).on("click", "#payNowBtn", function () {
  let termsField = $("#termsField");
  let pay_method = $("input[name=payment_method]:checked").val();
  if (!pay_method) {
    Swal.fire({
      icon: "warning",
      text: "Select a payment method first"
    });
  } else {
    if (termsField.is(":checked")) {
      load_the_payment_confirm(pay_method);
    } else {
      Swal.fire({
        icon: "warning",
        text:
          "Please Check, Read and agree to the website Terms and Conditions and Refund Policy"
      });
    }
  }
});

$(document).on("click", "#incompletePayNowBtn", function () {
  let termsField = $(document).find("#termsField");
  let pay_method = $("input[name=payment_method]:checked").val();
  if (!pay_method) {
    Swal.fire({
      icon: "warning",
      text: "Select a payment method first"
    });
  } else {
    if (termsField.is(":checked")) {
      load_the_incomplete_payment(pay_method);
    } else {
      Swal.fire({
        icon: "warning",
        text:
          "Please Check, Read and agree to the website Terms and Conditions and Refund Policy"
      });
    }
  }
});

$(function () {
  let page = $(document)
    .find(".section")
    .attr("data-page");
  if (page === "payment") {
    let products = productCart();
    if (products.length === 0) {
      window.location.href = "/dashboard?tab=orders";
    }
    payment_summary();
    loaded_payment_cart();
    validateCartProducts();
  }
});
