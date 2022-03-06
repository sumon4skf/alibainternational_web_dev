import _ from "lodash";
import Swal from "sweetalert2";
import {
  check_cart,
  productCart,
  QuantityRangesPrice,
  updateCart,
  slugify,
  validateCartProducts,
  calculateAirShippingCharge,
  calculateProductItemTotal,
  generateConfigCurrentPrice,
  calculateCheckoutTotalQuantity,
  formattingPrice,
  checkedItemTotalSummary
} from "./cartHelpers";

function loadProductWithAttributes(
  singleItem,
  attributes,
  proceed,
  product,
  BatchLotQuantity
) {
  let attrLength = attributes.length + 3;
  let htmlData = "";
  // console.log('singleItem', singleItem);
  attributes.map((attribute, key) => {
    let $PropertyName = attribute?.PropertyName;
    let PropertyValue = attribute?.Value;
    let Image = attribute?.MiniImageUrl ? attribute?.MiniImageUrl : attribute?.ImageUrl;
    let ItemImage = Image ? Image : singleItem?.image;

    let uniqueProperty = product.Id + $PropertyName + PropertyValue + key;
    uniqueProperty = slugify(uniqueProperty);
    let ranges = product?.QuantityRanges && encodeURIComponent(JSON.stringify(product.QuantityRanges));
    if (key === 0) {
      htmlData += `<tr data-quantity-ranges="${ranges}">
                            <td rowspan="${attrLength}" class="align-middle">
                                <a href="/product/${product.Id}"> <img src="${ItemImage}" style="width: 110px"></a>
                            </td>
                            <td class="text-capitalize text-left" style="min-width:100px">${$PropertyName}</td>
                            <td class="text-break text-right" style="min-width:140px">${PropertyValue}</td>
                            <td rowspan="${attrLength}" class="align-middle text-center quantityColumn">
                              <div class="input-group input-group-sm">
                                <div class="input-group-prepend">
                                  <button type="button" class="btn btn-quantity minus"><i class="fas fa-minus"></i></button>
                                </div>
                                <input type="text" name="inputQty" class="form-control text-center qty" min="0" id="${uniqueProperty}" step="${BatchLotQuantity}"  title="Qty"   data-proceed="${proceed}" value="${singleItem.quantity
        }" size="15">
                                <div class="input-group-append">
                                  <button type="button" class="btn btn-quantity plus"><i class="fas fa-plus"></i></button>
                                </div>
                              </div>
                            </td>
                            <td rowspan="${attrLength}" class="align-middle text-right">
                                <span class="SingleTotal">${b2b.currency_icon
        } ${Number(singleItem.subTotal).toFixed(
          2
        )}</span>
                            </td>
                            <td rowspan="${attrLength}" class="align-middle text-center"><a href="${product.Id
        }" data-code="${singleItem.itemCode
        }" class="removeCart"><i class="fas fa-times"></i></a></td>
                          </tr>`;
    } else {
      htmlData += `<tr><td class="text-capitalize align-middle text-left">${$PropertyName}</td><td class="align-middle text-right">${attribute.Value}</td></tr>`;
    }
  });

  let approxWeight = singleItem.quantity * product.ActualWeightInfo.Weight;

  return (
    htmlData +
    `<tr>
                            <td class="align-middle" style="min-width:135px">Shipping Method:</td>
                            <td class="text-danger text-right">${product.shipped_by
    } - ${b2b.currency_icon} ${product.shippingRate
    } Per KG</td>
                        </tr>
                        <tr>
                            <td class="align-middle" style="min-width:135px">Approx weight:</td>
                            <td class="text-right"><span class="approxWeight">${Number(
      approxWeight
    ).toFixed(2)}</span> KG</td>
                        </tr>
                        <tr>
                            <td class="align-middle" style="min-width:135px">Per unit Price</td>
                            <td class="text-right">${b2b.currency_icon
    } <span class="unitPrice">${singleItem.price
    }</span></td>
                        </tr>`
  );
}

function loadProductExceptAttributes(
  singleItem,
  proceed,
  product,
  BatchLotQuantity
) {
  let approxWeight = singleItem.quantity * product.ActualWeightInfo.Weight;
  let uniqueProperty = slugify(product.Id);
  return `<tr>
                <td rowspan="3" class="align-middle">
                <a href="/product/${product.Id}"> <img src="${product.item.MainPictureUrl
    }"  style="width: 110px"></a>
                </td>
                <td>Shipping Method:</td>
                <td>${product.shipped_by} BDT - ${product.shippingRate
    } Per KG</td>
                <td rowspan="3" class="align-middle">
                  <div class="input-group input-group-sm">
                    <div class="input-group-prepend">
                      <button type="button" class="btn btn-secondary minus"><i class="fas fa-minus"></i></button>
                    </div>
                      <input type="text" name="inputQty"  min="0" class="form-control text-center qty" id="${uniqueProperty}" step="${BatchLotQuantity}"  title="Qty"   data-proceed="${proceed}" value="${singleItem.quantity
    }" size="5">
                      <div class="input-group-append">
                      <button type="button" class="btn btn-secondary plus"><i class="fas fa-plus"></i></button>
                    </div>
                  </div>
                </td>
                <td rowspan="3" class="align-middle text-right">
                   <span class="SingleTotal">${b2b.currency_icon} ${Number(
      singleItem.subTotal
    ).toFixed(2)}</span>
                </td>
                <td rowspan="3" class="align-middle text-center">
                <a href="${product.Id}" data-code="${product.Id
    }" class="removeCart"><i class="fas fa-times"></i></a>
                </td>
            </tr>
            <tr>
                <td>Approx weight:</td>
                <td><span class="approxWeight">${Number(approxWeight).toFixed(
      2
    )}</span> KG</td>
            </tr>
            <tr>
                <td>Per unit Price</td>
                <td>${b2b.currency_icon} <span class="unitPrice">${singleItem.price
    }</span></td>
            </tr>`;
}

function loadAttributes(attributes) {
  let attrData = "";
  attributes.map(attribute => {
    attrData += `<p class="m-0"><span class="font-weight-bold">${attribute.PropertyName} : </span><span>${attribute.Value}</span></p>`;
  });
  return attrData;
}

function loaded_checkout_cart() {
  let product = productCart();
  let currency = b2b.currency_icon;
  let cartProducts = product.filter(filterCart => filterCart.isCart === true);

  if (cartProducts.length) {
    let htmlData = "";
    cartProducts.map(product => {
      let productId = product.Id;
      let Title = product.Title;
      let MainPictureUrl = product.MainPictureUrl;
      let MasterQuantity = product.MasterQuantity;
      let BatchLotQuantity = product.BatchLotQuantity;
      let ActualPrice = product.ActualPrice;
      let ActualWeight = product.ActualWeight;
      let itemData = product.itemData;
      let shipped_by = product.shipped_by;
      let QuantityRanges = product.QuantityRanges;
      let localDelivery = Number(product.localDelivery);

      let checkItemSummary = checkedItemTotalSummary(itemData);
      let totalPrice = checkItemSummary.totalPrice;
      let totalQuantity = checkItemSummary.totalQuantity;
      localDelivery = totalPrice ? localDelivery : 0;

      itemData.map((singleItem, key) => {
        let itemCode = singleItem.itemCode;
        let maxQuantity = singleItem.maxQuantity;
        let image = singleItem.image;
        let attributes = singleItem.attributes;
        htmlData += `<tr>`;
        htmlData += `<td class="text-center p-0 align-middle">
                      <div class="custome-checkbox">
                        <input class="form-check-input checkbox-item" ${singleItem.isChecked &&
          'checked="checked"'} type="checkbox" value="${productId}" id="${itemCode}" name="item[${productId}][${itemCode}]">
                        <label class="form-check-label" for="${itemCode}"></label>
                      </div>
                </td>`;
        htmlData += `<td class="text-right align-middle" style="width:15%">
                <img src="${image ||
          MainPictureUrl}" class="img-fluid" alt="${Title}">
                </td>`;
        htmlData += `<td class="text-left align-middle">
                         <p class="m-0"><a href="/product/${productId}">
                         ${Title}</a></p>
                          ${attributes.length > 0 && loadAttributes(attributes)}
                         <p class="m-0">
                           <span class="font-weight-bold">Price:</span>
                           <span>${currency} ${formattingPrice(
          singleItem.price
        )}</span> </p>
                         <div class="d-inline-block">
                           <div class="d-inline-block manage-quantity mr-3 my-2" style="max-width: 115px;">
                             <div class="input-group input-group input-group-sm">
                               <div class="input-group-prepend">
                                 <button type="button" class="btn btn-default minus">
                                   <i class="icon-minus"></i>
                                 </button>
                               </div>
                               <input type="text" name="inputQty" class="form-control p-2 text-center qty" min="0" max="${maxQuantity}" size="5" step="1"
                                 data-decimals="0" data-id="${productId}" data-code="${itemCode}" value="${singleItem.quantity
          }">
                               <div class="input-group-append">
                                 <button type="button" class="btn btn-default plus">
                                   <i class="icon-plus"></i>
                                 </button>
                               </div>
                             </div>
                           </div>
                           <small class="maxQuantityText d-inline-block">Max Quantity: ${maxQuantity}</small>
                         </div>
                       </td>`;

        htmlData += `<td class="text-right align-middle">${currency} ${formattingPrice(
          singleItem.subTotal
        )}</td>`;
      });

      // totalPrice = localDelivery + totalPrice;
      htmlData += `<tr>
                <td class="text-right" colspan="3">Total</td>
                <td class="text-right">${currency} <span class="totalItemPrice">${formattingPrice(
        totalPrice
      )}</span></td></tr>`;
      htmlData += `<tr><td class="text-right" colspan="3">China Local Shipping</td><td class="text-right">${currency + " " + formattingPrice(localDelivery)}</td></tr>`;
    });
    $(document)
      .find("#shoppingCartTable")
      .find("tbody")
      .html(htmlData);

    calculate_cart_summary();
  } else {
    Swal.fire({
      text:
        "Your Cart is Empty. Browse the Product and add to cart First",
      icon: "warning",
      showCancelButton: false,
      confirmButtonText: "Ok, Understood!"
    }).then(result => {
      //window.location.href = "/";
    });
  }
}

function calculate_cart_summary(coupon = 0, couponCode = null) {
  let productTotal = 0;
  let currency = b2b.currency_icon;
  let advanced = Number(b2b.advanced_payment);

  $(document)
    .find(".totalItemPrice")
    .each(function () {
      productTotal += Number($(this).text());
    });

  let couponMergeTotal = coupon ? productTotal - coupon : productTotal;

  let needToPay = (couponMergeTotal * advanced) / 100;
  let dueForProducts = couponMergeTotal - needToPay;
  productTotal = Math.round(productTotal);
  needToPay = Math.round(needToPay);
  dueForProducts = Math.round(dueForProducts);

  let couponRow = $(document).find("#couponRow");

  $(document)
    .find("#productTotalPrice")
    .text(`${currency} ${formattingPrice(productTotal)}`);
  $(document)
    .find("#needToPay")
    .text(`${currency} ${formattingPrice(needToPay)}`);
  $(document)
    .find("#dueForProducts")
    .text(`${currency} ${formattingPrice(dueForProducts)}`);

  let summary = {
    productTotal: productTotal,
    couponDiscount: null,
    couponCode: null,
    needToPay: needToPay,
    dueForProducts: dueForProducts
  };

  if (coupon) {
    summary.couponDiscount = coupon;
    summary.couponCode = couponCode;
    couponRow.show();
  } else {
    resetCoupon();
    couponRow.hide();
  }

  $(document)
    .find("#couponVictory")
    .text(`${currency} ` + Number(coupon).toFixed(2));

  let dataPage = $(document)
    .find(".main_content")
    .attr("data-page");
  if (dataPage === "shopCart") {
    window.localStorage.setItem("summary", JSON.stringify(summary));
  }
}

function item_single_data_recalculation(
  item_id,
  itemCode,
  qty,
  price,
  QuantityRanges
) {
  let products = productCart().filter(
    filterCart => filterCart.isCart === true
  );
  if (products.length) {
    let findItem = products.find(findItem => findItem.Id === item_id);
    if (Number(qty) === 0) {
      findItem.itemData = findItem.itemData.filter(
        single => single.itemCode !== itemCode
      );
      if (findItem.itemData.length === 0) {
        findItem.isCart = false;
      }
    } else {
      let findSingle = findItem.itemData.find(
        findSingle => findSingle.itemCode === itemCode
      );
      if (findSingle) {
        findSingle.quantity = Number(qty);
        if (price) {
          findSingle.price = Number(price);
        }
        findSingle.subTotal = Number(qty) * Number(findSingle.price);
      }
    }

    let subTotal = 0;
    let totalQty = 0;
    findItem.itemData.map(ItemCalculate => {
      subTotal += ItemCalculate.subTotal;
      totalQty += ItemCalculate.quantity;
    });

    const local_delivery = Number(b2b.china_local_delivery_charge);
    const delivery_charge_limit = Number(
      b2b.china_local_delivery_charge_limit
    );

    findItem.localDelivery =
      subTotal > delivery_charge_limit ? 0 : local_delivery;
    findItem.shippingRate = calculateAirShippingCharge(subTotal);

    updateCart(products);

    loaded_checkout_cart();
    update_customer_checkout();
  }
}

function remove_itemData_product(item_id, itemCode) {
  let products = productCart();
  if (products.length) {
    let filterProducts = products.find(
      filterProduct => filterProduct.Id === item_id
    );
    if (_.isObject(filterProducts)) {
      let itemData = filterProducts.itemData;
      if (_.isArray(itemData)) {
        if (itemData.length === 1) {
          let resetProducts = products.filter(
            resetFilter => resetFilter.Id !== item_id
          );
          updateCart(resetProducts);
        } else {
          itemData = itemData.filter(
            filterItem => filterItem.itemCode !== itemCode
          );

          let calculateTotal = calculateProductItemTotal(itemData);

          filterProducts.itemData = itemData;
          filterProducts.totalQuantity = calculateTotal.totalQuantity;
          filterProducts.totalPrice = calculateTotal.totalPrice;

          const local_delivery = Number(
            b2b.china_local_delivery_charge
          );
          const delivery_charge_limit = Number(
            b2b.china_local_delivery_charge_limit
          );
          filterProducts.localDelivery =
            calculateTotal.totalPrice > delivery_charge_limit
              ? 0
              : local_delivery;

          updateCart(products);
        }
      }
    }
  }
}

$(function () {
  let dataPage = $(document)
    .find(".main_content")
    .attr("data-page");
  if (dataPage === "shopCart") {
    loaded_checkout_cart(); // load the default checkout cart
  }
});

$(document).on("click", "#removeFromCart", function (e) {
  e.preventDefault();
  let checkbox = $("input.checkbox-item:checked");
  if (checkbox.length > 0) {
    Swal.fire({
      text: "Are you sure to remove",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove"
    }).then(result => {
      if (result.value) {
        checkbox.each(function (index) {
          let item_id = $(this).val();
          let item_code = $(this).attr("id");
          remove_itemData_product(item_id, item_code);
          // check_cart(item_id);
        });
        loaded_checkout_cart();
      }
    });
  } else {
    Swal.fire({
      icon: "warning",
      text: "Select the item first"
    });
    window.location.reload();
  }
});

$(document).on("change keyup", "input[name=inputQty]", function () {
  let inputQty = $(this);
  let productId = inputQty.attr("data-id");
  let itemCode = inputQty.attr("data-code");
  let quantity = $(this).val();

  let CartData = productCart();

  if (_.isArray(CartData)) {
    let product = CartData.find(find => find.Id === productId);
    if (_.isObject(product)) {
      let itemData = product.itemData;
      let stepData = Number(product.BatchLotQuantity);
      let NextLotQuantity = product.NextLotQuantity;
      let QuantityRanges = product.QuantityRanges;
      let Price = product.Price;

      if (quantity % stepData !== 0) {
        let stepQty = stepData > 0 ? Math.ceil(quantity / stepData) : 1;
        quantity = stepQty * stepData;
      }
      $(this).val(quantity);

      let currentTotalQty = calculateCheckoutTotalQuantity(productId);

      let newQty = Number(quantity) * NextLotQuantity;
      let ActualPrice = generateConfigCurrentPrice(
        {},
        Price,
        QuantityRanges,
        currentTotalQty
      );

      if (!_.isEmpty(itemData) && _.isArray(itemData)) {
        itemData = itemData.map(findData => {
          if ((findData.itemCode === itemCode) || (itemCode === undefined || itemCode === 'undefined')) {
            ActualPrice = ActualPrice
              ? ActualPrice
              : findData.price;
            findData.price = ActualPrice;
            findData.quantity = newQty;
            findData.subTotal =
              Number(newQty) * Number(ActualPrice);
            return findData;
          }
          return findData;
        });

        if (Number(newQty) === 0) {
          itemData = itemData.filter(
            findData => findData.itemCode !== itemCode
          );
        }

        let calculateTotal = calculateProductItemTotal(itemData);
        product.itemData = itemData;
        product.totalQuantity = calculateTotal.totalQuantity;
        product.totalPrice = calculateTotal.totalPrice;
      }

      updateCart(CartData);

      loaded_checkout_cart();
    }
  }
});

$(document).on("click", ".proceedButton", function (event) {
  event.preventDefault();
  let proceedLink = $(this).attr("href");
  validateCartProducts(proceedLink);
});

function reload_cart_summary(amount, couponCode) {
  var couponApplyForm = $(document).find("#couponApplyForm");
  couponApplyForm
    .find(".btn-fill-out")
    .addClass("removeCoupon")
    .text("Remove");
  calculate_cart_summary(amount, couponCode);
}

function resetCoupon() {
  var couponApplyForm = $(document).find("#couponApplyForm");
  couponApplyForm.find("#coupon_code").removeAttr("disabled");
  couponApplyForm.find(".btn-fill-out").removeClass("removeCoupon");
  couponApplyForm.find(".btn-fill-out").text("Apply");
  couponApplyForm.find(".btn-fill-out").removeAttr("disabled");
}

$(document).on("submit", "#couponApplyForm", function (event) {
  event.preventDefault();
  var checkBtn = $(this).find(".btn-fill-out");
  checkBtn.removeAttr("disabled");
  var coupon = $(this).find("#coupon_code");
  var coupon_code = coupon.val();
  var summary = window.localStorage.getItem("summary");
  if (coupon_code.length) {
    var data = {
      coupon_code: coupon_code,
      summary: summary
    };
    $.ajax({
      type: "POST",
      url: "/ajax/m8sBOYY33Vp9JTD8h2ksp58snyvRHHXPF0h",
      data: data,
      headers: {
        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
      },
      beforeSend: function () {
        // before loading...
      },
      success: function (htmlData) {
        if (htmlData.status) {
          coupon.attr("disabled", "disabled");
          reload_cart_summary(htmlData.amount, coupon_code);
        } else {
          Swal.fire({
            text: "Coupon is not valid"
          });
        }
      },
      error: function (xhr) {
        // if error occured
        // console.log('error', xhr);
      },
      complete: function () {
        // console.log('Coupon complete');
      }
    });
  } else {
    Swal.fire({
      text: "Code must not empty"
    });
  }
});

$(document).on("click", ".removeCoupon", function (e) {
  e.preventDefault();
  calculate_cart_summary();
});

function updateCheckedItem(productId, itemCode, checkedStatus) {
  let productCarts = productCart();
  if (_.isArray(productCarts)) {
    productCarts = productCarts.map(product => {
      if (product.Id === productId) {
        let itemData = product.itemData;
        if (_.isArray(itemData)) {
          itemData = itemData.map(item => {
            if ((itemCode === undefined) || (itemCode === 'undefined')) {
              item.isChecked = checkedStatus;
            } else if (item.itemCode === itemCode) {
              item.isChecked = checkedStatus;
            }
            return item;
          });
        }
        let checkedItem = itemData.filter(
          filter => filter.isChecked === checkedStatus
        );
        if (checkedItem.length === itemData.length) {
          product.isChecked = checkedStatus;
        }
        product.itemData = itemData;
      }
      return product;
    });
    updateCart(productCarts);
  }
}

$(document).on("change", "input[name=all-check]", function () {
  let checkedStatus = $(this).is(":checked");
  if (checkedStatus) {
    $("input.checkbox-item").prop("checked", true);
  } else {
    $("input.checkbox-item").prop("checked", false);
  }

  $("input.checkbox-item").each(function () {
    let productId = $(this).val();
    let itemCode = $(this).attr("id");
    updateCheckedItem(productId, itemCode, checkedStatus);
  });

  loaded_checkout_cart();
});

function check_all_is_checked() {
  let unchecked = $("input.checkbox-item").length;
  let checked = $("input.checkbox-item:checked").length;
  let allCheck = $("input[name=all-check]");
  if (unchecked === checked && checked > 0) {
    allCheck.prop("checked", true);
  } else {
    allCheck.prop("checked", false);
  }
}

setTimeout(() => {
  $("input[name=all-check]").prop("checked", true).trigger('change');
}, 1500);

$(document).on("change", "input.checkbox-item", function () {
  let productId = $(this).val();
  let itemCode = $(this).attr("id");
  let checkedStatus = $(this).is(":checked");
  updateCheckedItem(productId, itemCode, checkedStatus);

  loaded_checkout_cart();

  let unchecked = $("input.checkbox-item").length;
  let checked = $("input.checkbox-item:checked").length;
  let allCheck = $("input[name=all-check]");
  if (checkedStatus) {
    if (unchecked === checked) {
      allCheck.prop("checked", true);
    } else {
      allCheck.prop("checked", false);
    }
  } else {
    allCheck.prop("checked", false);
  }
});
