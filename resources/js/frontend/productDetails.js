import _, { isEmpty, isArray, isObject } from "lodash";
import {
  productId,
  productCart,
  updateCart,
  check_cart,
  loadingIcon,
  calculateAirShippingCharge,
  loadingText,
  loadingFail,
  currentProductDetails,
  generateConfigCurrentPrice,
  calculateTotalQuantity,
  calculateUnitActualWeight,
  calculateProductItemTotal,
  formattingPrice
} from "./cartHelpers";

function loadPrices(reload = 0) {
  var priceUrl = $(document)
    .find(".main_content")
    .attr("data-cO7QTHpkoZrKge5aGkDc");
  var item_id = $(document)
    .find("#itemFullInfo")
    .attr("data-id");
  var productBox = $("#productBox");
  var priceBox = $(".mainPrice");
  var attributesBox = $(".attributesLoader");
  var itemCalculation = $(".itemCalculationTable");
  var additionalInformation = $("#Additional-info");

  priceBox.html(loadingText); // loading...
  attributesBox.html(loadingText); // loading...
  itemCalculation.html(loadingText); // loading...

  axios
    .post(priceUrl, { item_id: item_id })
    .then(response => {
      let responseData = response.data;
      let product = responseData.product;
      let priceData = responseData.price;
      let attributes = responseData.attributes;
      let config = responseData.config;
      let additionalInfo = responseData.additionalInfo;

      let additional = JSON.parse(responseData.additional);

      if (product) {
        productBox.html(product);
      }

      priceBox.html(priceData);
      attributesBox.html(attributes);

      if (config) {
        itemCalculation.html(config);
      }
      if (additionalInfo) {
        additionalInformation.html(additionalInfo);
      }

      if (_.isObject(additional)) {
        let VendorScore = additional.VendorScore;
        let TotalSales = 0;
        let FeaturedValues = additional.FeaturedValues;
        if (_.isArray(FeaturedValues)) {
          let sales = FeaturedValues.find(
            find => find.Name === "TotalSales"
          );
          TotalSales = _.isObject(sales) ? sales.Value : TotalSales;
        }
        $("#VendorScore").text(`${VendorScore}/20`);
        $("#TotalSales").text(TotalSales);
      }
    })
    .catch(error => {
      console.log("error", error);
    })
    .then(() => {
      filter_attribute();
      reload_quantity_from_Cart();

      setTimeout(function () {
        var divHeight = $(".productDetailsCard").height();
        $(".sidebar_related_product").css(
          "max-height",
          divHeight + "px"
        );
      }, 1000);
    });
}

function loadDescriptionAjax(reload = 0) {
  var descriptionUrl = $(document)
    .find(".main_content")
    .attr("data-rrkYPyDrsPBVqjadmXIy");
  var item_id = $(document)
    .find("#itemFullInfo")
    .attr("data-id");
  var Description = $("#Description");
  var data = {
    item_id: item_id
  };
  $.ajax({
    type: "POST",
    url: descriptionUrl,
    data: data,
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
    },
    dataType: "html",
    beforeSend: function () {
      Description.html(loadingText);
    },
    success: function (htmlData) {
      if (htmlData === "reload") {
        if (reload < 3) {
          loadDescriptionAjax(reload + 1);
        }
      } else {
        Description.html(htmlData);
      }
    },
    error: function (xhr) {
      if (reload < 3) {
        loadDescriptionAjax(reload + 1);
      } else {
        Description.html(loadingFail);
      }
    },
    complete: function () {
      Description.find("img").removeAttr("width");
      Description.find("img").removeAttr("height");
      Description.find("img").addClass("img-fluid");
    }
  });
}

$(document).on("click", "#loadDescription", function (event) {
  event.preventDefault();
  loadDescriptionAjax();
});

$(document).on("click", "#loadSellerInformation", function (event) {
  event.preventDefault();
  var sellerUrl = $(document)
    .find(".main_content")
    .attr("data-js2vlTEbP355hrBUhDo5");
  var vendor_id = $(document).attr("data-vendor");

  var Seller = $("#Seller");
  Seller.html(loadingText);
  axios
    .post(sellerUrl, { vendor_id: vendor_id })
    .then(response => {
      let resData = response.data;
      Seller.html(resData);
    })
    .catch(error => {
      Seller.html(loadingFail);
    });
});

function reload_quantity_from_Cart() {
  let item_id = productId();
  let productPage = productCart();
  let placeholder = $(document);
  if (productPage.length) {
    let product = productPage.find(item => item.Id === item_id);
    if (product) {
      product.itemData.map(itemData => {
        let code = itemData.itemCode;
        let qtyField = placeholder.find("#" + code);
        qtyField.val(itemData.quantity);
        qtyField
          .closest("tr")
          .find(".priceRate")
          .text(itemData.price);
      });
    }
  }
}

function filter_attribute(reload = 0) {
  let filter = $(document)
    .find(".product_size_switch")
    .find("span.active")
    .attr("data-filter");
  let colorName = $(document)
    .find(".product_size_switch")
    .find("span.active")
    .attr("data-color-name");
  if (filter) {
    let itemCalculationTable = $(document).find("#itemCalculationTable");
    let isHasFilter = itemCalculationTable.find("tbody tr." + filter)
      .length;
    if (isHasFilter) {
      itemCalculationTable.find("tbody tr").hide();
      itemCalculationTable.find("tbody tr." + filter).show();
    }
    if (colorName) {
      $(document)
        .find(".pr_switch_wrap")
        .find(".ColorName")
        .text(colorName);
    }
  } else {
    if (reload < 3) {
      filter_attribute(reload + 1);
    }
  }
}

$(document).on("click", ".product_size_switch span", function () {
  let fullImageUrl = $(this).attr("data-fullimageurl");
  if (fullImageUrl) {
    $(document)
      .find(".zoomWindow")
      .css("background-image", 'url("' + fullImageUrl + '")');
    $(document)
      .find("#product_img")
      .attr("src", fullImageUrl);
  }
  setTimeout(function () {
    filter_attribute();
  }, 200);
});

$(document).on("change", "#shipping_rate", function () {
  let item_id = productId();
  let method = $(this).val();
  let shipped_by = "";
  let rate = "";
  let body = $(document);
  if (method === "ship_by_air") {
    shipped_by = "by_air";
    rate = body.find("option[value=ship_by_air]").attr("data-charge");
  } else if (method === "ship_by_sea") {
    shipped_by = "by_sea";
    rate = body.find("option[value=ship_by_sea]").attr("data-charge");
  }

  let products = productCart();
  if (products.length) {
    let findProductItem = products.find(find => find.Id === item_id);
    if (findProductItem) {
      findProductItem.shipped_by = shipped_by;
      findProductItem.shippingRate = rate;
    }
  }
  updateCart(products);
});

function append_from_china_to_bd() {
  const item_id = productId();
  let cart = productCart();
  let placeholder = $(document);
  let currency = b2b.currency_icon;

  if (cart.length) {
    let product = cart.find(item => item.Id === item_id);
    if (!_.isEmpty(product)) {
      let totalQuantity = product.totalQuantity;
      let totalPrice = Math.round(product.totalPrice);
      let ActualWeight = Number(product.ActualWeight);

      placeholder.find("#totalQuantity").text(totalQuantity);
      placeholder.find("#productPrice").html(totalPrice);

      const local_delivery = Number(b2b.china_local_delivery_charge);
      const delivery_charge_limit = Number(
        b2b.china_local_delivery_charge_limit
      );
      // console.log('local_delivery', local_delivery);
      let chinaLocalDeliveryCharge =
        totalPrice > delivery_charge_limit ? 0 : local_delivery;

      // let total_price = totalPrice + chinaLocalDeliveryCharge; // add china local delivery cost;

      placeholder.find("#totalPrice").text(formattingPrice(totalPrice));

      let airShippingCharge = calculateAirShippingCharge(totalPrice);

      let approxWeight = ActualWeight
        ? totalQuantity * Number(ActualWeight)
        : 0;
      let ship_by_sea = $(document).find("option[value=ship_by_sea]");
      if (approxWeight >= 200) {
        ship_by_sea.show();
      } else {
        $("option[value=ship_by_air]").attr("selected", true);
        ship_by_sea.hide();
      }

      placeholder
        .find("#chinaLocalDelivery")
        .text(formattingPrice(chinaLocalDeliveryCharge));

      product.shippingRate =
        $("#shipping_rate").val() === "ship_by_air"
          ? airShippingCharge
          : 250;
      product.localDelivery = chinaLocalDeliveryCharge;

      placeholder
        .find("#approxWeight")
        .text(`${Number(approxWeight).toFixed(3)} KG`);
      let formateShipping = formattingPrice(airShippingCharge);
      placeholder.find("#airShippingCharge").text(formateShipping);
      placeholder
        .find("option[value=ship_by_air]")
        .attr("data-charge", formateShipping);
      placeholder
        .find("option[value=ship_by_sea]")
        .attr("data-charge", "200");
      placeholder.find("#seaShippingCharge").text(`200`);

      updateCart(cart);
    }
  }
}

function product_change_effect(
  proceed,
  ConfiguredItem,
  configAttributes,
  qty,
  image
) {
  let item_id = proceed.Id;
  let itemCode = ConfiguredItem?.Id;
  let maxQuantity = ConfiguredItem?.Quantity;
  let mainImage = image ? image : proceed.MainPictureUrl;
  let NextLotQuantity = proceed.NextLotQuantity;
  let QuantityRanges = proceed?.QuantityRanges;
  QuantityRanges = QuantityRanges ? QuantityRanges : [];
  let ActualWeight = proceed?.PhysicalParameters;
  ActualWeight = ActualWeight ? Number(ActualWeight).toFixed(3) : '0.000';
  let Price = proceed.Price;
  let totalQuantity = calculateTotalQuantity();
  let cart = productCart();
  const shipped_by = $("#shipping_rate").val();

  let newQty = Number(qty) * NextLotQuantity;
  let ActualPrice = generateConfigCurrentPrice(ConfiguredItem, Price, QuantityRanges);

  let newItemData = {
    itemCode: itemCode,
    maxQuantity: maxQuantity,
    quantity: newQty,
    price: ActualPrice,
    subTotal: newQty * ActualPrice,
    image: mainImage,
    attributes: configAttributes
  };

  let newItem = true;

  if (cart.length > 0) {
    cart = cart.map(cartItem => {
      if (cartItem.Id === item_id) {
        let itemData = cartItem.itemData;
        if (itemData?.length > 0) {
          itemData = itemData.map(findData => {
            findData.subTotal = Number(findData.quantity) * Number(findData.price);
            if (findData.itemCode === itemCode) {
              findData.price = ActualPrice;
              findData.image = mainImage;
              findData.quantity = newQty;
              findData.subTotal = Number(newQty) * Number(ActualPrice);
              // return findData;
            } else {
              if (!_.isEmpty(QuantityRanges)) {
                findData.price = ActualPrice;
                findData.subTotal = Number(findData.quantity) * Number(ActualPrice);
              }
            }
            return findData;
          });

          let findItem = itemData.find(
            findData => findData.itemCode === itemCode
          );

          if (_.isEmpty(findItem)) {
            itemData = [...itemData, newItemData];
          }

          if (Number(newQty) === 0) {
            itemData = itemData.filter(
              findData => findData.itemCode !== itemCode
            );
          }
        } else {
          itemData = [newItemData];
        }
        let calculateTotal = calculateProductItemTotal(itemData, false);
        cartItem.itemData = itemData;
        cartItem.totalQuantity = calculateTotal.totalQuantity;
        cartItem.totalPrice = calculateTotal.totalPrice;
        newItem = false;
        return cartItem;
      }
      return cartItem;
    });
  }

  if (newItem) {
    cart.push({
      Id: item_id,
      Title: proceed.Title,
      MainPictureUrl: proceed.MainPictureUrl,
      MasterQuantity: proceed.MasterQuantity,
      FirstLotQuantity: proceed.FirstLotQuantity,
      NextLotQuantity: proceed.NextLotQuantity,
      BatchLotQuantity: proceed.BatchLotQuantity,
      totalQuantity: totalQuantity,
      totalPrice: totalQuantity * ActualPrice,
      ActualPrice: ActualPrice,
      ActualWeight: ActualWeight,
      itemData: [newItemData],
      shipped_by: shipped_by,
      QuantityRanges: QuantityRanges,
      isCart: false
    });
  }
  updateCart(cart);
  append_from_china_to_bd();
}

function update_item_price(price) {
  if (Number(price)) {
    let item_id = productId();
    let products = productCart();
    let findItem = products.find(findItem => findItem.Id === item_id);
    if (findItem) {
      findItem.itemData.map(findData => {
        findData.price = price;
        findData.subTotal = Number(findData.quantity) * Number(price);
      });
      updateCart(products);
      append_from_china_to_bd();
    }
  }
}

function add_to_cart(item_id) {
  let products = productCart();
  if (products.length) {
    let productItem = products.find(
      existsItem => existsItem.Id === item_id
    );
    if (productItem) {
      productItem.isCart = true;
    }
    updateCart(products);
  } else {
    alert("Please select quantity of any variation");
  }
}

$(document).on("change paste keyup select", "input[name=quantity]", function () {
  let proceed = currentProductDetails();
  let Attributes = proceed.Attributes;
  let ConfiguredItems = proceed.ConfiguredItems;
  let QuantityRanges = proceed.QuantityRanges;
  let stepData = Number(proceed.BatchLotQuantity);
  let qty = Number($(this).val());
  let configureId = $(this).attr("id");
  let image = $(".product_size_switch")
    .find("span.active")
    .find("img")
    .attr("src");
  if (qty % stepData !== 0) {
    let stepQty = stepData > 0 ? Math.ceil(qty / stepData) : 1;
    qty = stepQty * stepData;
  }

  let ConfiguredItem = ConfiguredItems.find(find => find.Id === configureId);
  let configAttributes = [];
  if (ConfiguredItem) {
    let Configurators = ConfiguredItem?.Configurators;
    Configurators?.map(Configurator => {
      let findAttr = Attributes.find(find =>
        find.Pid === Configurator.Pid && find.Vid === Configurator.Vid
      );
      if (findAttr) {
        configAttributes.push(findAttr);
      }
    });
  }

  $(this).val(qty);

  product_change_effect(
    proceed,
    ConfiguredItem,
    configAttributes,
    qty,
    image
  );

  is_available_on_cart(); // check is available in cart
});

function is_available_on_cart() {
  let itemFull = currentProductDetails();
  const minQuantity = Number(itemFull.FirstLotQuantity);
  const totalQuantity = Number(
    $(document)
      .find("#totalQuantity")
      .text()
  );

  let isRemoveCart = false;

  let minQuantityOnSetting = Number(b2b.min_order_quantity);

  if (minQuantity || minQuantityOnSetting) {
    if (
      minQuantity > totalQuantity ||
      minQuantityOnSetting > totalQuantity
    ) {
      isRemoveCart = true;
    }
  }

  if (isRemoveCart === false) {
    let minAmount = Number(b2b.min_order_amount);
    let subTotal = Number(
      $(document)
        .find("#productPrice")
        .text()
    );
    if (subTotal < minAmount) {
      isRemoveCart = true;
    }
  }

  if (isRemoveCart) {
    const item_id = productId();
    const products = productCart();
    let product = products.find(
      filterProduct =>
        filterProduct.Id === item_id && filterProduct.isCart === true
    );
    if (product) {
      product.isCart = false;
      updateCart(products);
      check_cart(item_id);
    }
  }
}

$(document).on("change", "#shipping_rate", function (event) {
  event.preventDefault();
  let charge = $(this).attr("data-charge");
});

function validateToProcessCheckout() {
  const itemFull = currentProductDetails();
  const minQuantity = Number(itemFull.FirstLotQuantity);
  let totalQuantity = $(document)
    .find("#totalQuantity")
    .text();
  totalQuantity = Number(totalQuantity);
  let isAddToCart = true;

  let minQuantityOnSetting = Number(b2b.min_order_quantity);

  if (minQuantity || minQuantityOnSetting) {
    if (
      minQuantity > totalQuantity ||
      minQuantityOnSetting > totalQuantity
    ) {
      let takenQty =
        minQuantityOnSetting > minQuantity
          ? minQuantityOnSetting
          : minQuantity;
      Swal.fire({
        icon: "info",
        text: "Minimum Order Quantity " + takenQty
      });
      isAddToCart = false;
    }
  }

  if (isAddToCart) {
    let currency_icon = b2b.currency_icon;
    let minAmount = Number(b2b.min_order_amount);
    let subTotal = Number(
      $(document)
        .find("#totalPrice")
        .text()
    );
    if (subTotal < minAmount) {
      Swal.fire({
        icon: "info",
        text: `Minimum Order Value ${currency_icon} ${minAmount.toFixed(
          2
        )}`
      });
      isAddToCart = false;
    }
  }

  return isAddToCart;
}

$(document).on("click", ".btnBuyNow", function (event) {
  event.preventDefault();
  let isAddToCart = validateToProcessCheckout();
  if (isAddToCart) {
    const item_id = productId();
    let products = productCart();
    if (_.isArray(products)) {
      products = products.map(product => {
        product.isCart = false;
        if (product.Id === item_id) {
          product.isCart = true;
        }
        return product;
      });
      updateCart(products);
      window.location.href = $(this).attr("href");
    }
  }
});

$(document).on("click", ".btn-addToCart", function () {
  let isAddToCart = validateToProcessCheckout();

  if (isAddToCart) {
    const item_id = productId();
    add_to_cart(item_id);
    check_cart(item_id);
  }
});

$(function () {
  const dataPage = $(document)
    .find(".main_content")
    .attr("data-page");
  const item_id = productId();
  if (dataPage === "productDetails") {
    loadPrices();
    append_from_china_to_bd();
  }
  check_cart(item_id);
});

$(document).on("click", ".plus", function () {
  let input_field = $(this)
    .closest(".input-group")
    .find("input");
  let stepData = Number(input_field.attr("step"));
  let inputValue = Number(input_field.val());
  stepData = stepData > 1 ? stepData : 1;
  input_field.val(+inputValue + stepData).trigger("change");
});

$(document).on("click", ".minus", function () {
  let input_field = $(this)
    .closest(".input-group")
    .find("input");
  let stepData = Number(input_field.attr("step"));
  let inputValue = Number(input_field.val());
  stepData = stepData > 1 ? stepData : 1;
  if (input_field.val() >= 1) {
    if (input_field.val() >= 1)
      input_field.val(+inputValue - stepData).change();
  }
});

$(function () {
  let product_cart = productCart();
  let cartProducts = [];
  if (!_.isEmpty(product_cart) && _.isArray(product_cart)) {
    cartProducts = productCart().filter(
      findProduct => findProduct.isCart === true
    );
  }
  axios
    .post("/ajax/update-customer-cart", {
      cartProducts: JSON.stringify(cartProducts)
    })
    .then(response => {
      // console.log("response", response);
      // updateCart(response.cart);
    })
    .catch(error => {
      console.log("error", error.response);
    });
});
