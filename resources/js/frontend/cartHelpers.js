import { isEmpty, isArray, isObject } from "lodash";

export const currentProductDetails = () => {
  let product = $("#productBox").html();
  if (product) {
    return JSON.parse(product);
  } else {
    return {};
  }
};

export const productId = (returnDefault = null) => {
  let item_id = $("#itemFullInfo").attr("data-id");
  if (!isEmpty(item_id)) {
    return item_id;
  }
  return returnDefault;
};

export const productCart = () => {
  let product = window.localStorage.getItem("_cart");
  if (product) {
    return JSON.parse(product);
  } else {
    return [];
  }
};

export const updateCart = products => {
  window.localStorage.setItem("_cart", JSON.stringify(products));
};

export const clearProductCart = () => {
  window.localStorage.removeItem("_cart");
  window.localStorage.removeItem("summary");
};

export const customer_address = () => {
  let address = window.localStorage.getItem("_shipping_address");
  if (address && typeof address !== "undefined" && address !== "undefined") {
    return JSON.parse(address);
  } else {
    return {};
  }
};

export const update_customer_address = address => {
  window.localStorage.setItem("_shipping_address", JSON.stringify(address));
};

export const convertedPrice = price => {
  let rate = Number(b2b.increase_rate);
  return Math.round(price * rate);
};

export const formattingPrice = price => {
  return Math.round(price);
  return Number(price).toFixed(2);
};

function loadAttributes(attributes) {
  let attrData = "";
  attributes.map(attribute => {
    attrData += `<p class="m-0"><span class="font-weight-bold">${attribute.PropertyName} : </span><span>${attribute.Value}</span></p>`;
  });
  return attrData;
}

export const calculateAirShippingCharge = subTotal => {
  let charges = b2b.air_shipping_charges
    ? JSON.parse(b2b.air_shipping_charges)
    : {};
  let maxCharge = 0;
  let expectedCharge = 0;
  if (isArray(charges)) {
    let amountCollect = [];
    for (let i = 0; i < charges.length; i++) {
      let dCharge = charges[i];
      let maxRate = dCharge.rate;
      let maximum = dCharge.maximum;
      let minimum = dCharge.minimum;
      if (minimum <= subTotal && maximum >= subTotal) {
        expectedCharge = dCharge.rate;
      }
      amountCollect.push(maxRate);
    }
    maxCharge = Math.max(...amountCollect);
  }

  return expectedCharge ? expectedCharge : maxCharge;
};

export const remove_space = stringData => {
  return stringData
    .trim() // remove white spaces at the start and end of string
    .toLowerCase() // string will be lowercase
    .replace(/^-+/g, "") // remove one or more dash at the start of the string
    .replace(/[^\w-]+/g, "-") // convert any on-alphanumeric character to a dash
    .replace(/-+/g, "-") // convert consecutive dashes to singular one
    .replace(/-+$/g, "");
};

export const calculateTotalQuantity = () => {
  let itemCalculationTable = $("#itemCalculationTable").find(
    "input[name=quantity]"
  );
  let totalQty = 0;
  itemCalculationTable.each(function (index) {
    totalQty += Number($(this).val());
  });
  return totalQty;
};

export const calculateCheckoutTotalQuantity = productId => {
  let checkoutInput = $(`input[data-id=${productId}]`);
  let totalQty = 0;
  checkoutInput.each(function (index) {
    totalQty += Number($(this).val());
  });
  return totalQty;
};

export const calculateUnitActualWeight = ActualWeight => {
  if (!isEmpty(ActualWeight) && isObject(ActualWeight)) {
    return Number(ActualWeight.Weight).toFixed(3);
  }
  return "0.00";
};

export const calculateProductItemTotal = itemData => {
  let totalQuantity = 0;
  let totalPrice = 0;
  if (isArray(itemData)) {
    itemData.map(item => {
      totalQuantity += item.quantity;
      totalPrice += item.subTotal;
    });
  }
  return { totalQuantity: totalQuantity, totalPrice: totalPrice };
};

export const checkedItemTotalSummary = itemData => {
  let totalQuantity = 0;
  let totalPrice = 0;
  if (isArray(itemData)) {
    itemData
      .filter(filter => filter.isChecked === true)
      .map(item => {
        totalQuantity += item.quantity;
        totalPrice += item.subTotal;
      });
  }
  return { totalQuantity: totalQuantity, totalPrice: totalPrice };
};

export const QuantityRangesPrice = (ranges, currentTotalQty = 0) => {
  let quantity = currentTotalQty ? currentTotalQty : calculateTotalQuantity();
  let unitPrice = 0;
  quantity = Number(quantity);
  if (isArray(ranges)) {
    for (let i = 0; i < ranges.length; i++) {
      let QtyRange = ranges[i];
      let nextQtyRange = ranges[i + 1];
      let MinQuantity = QtyRange.MinQuantity;
      if (quantity < MinQuantity) {
        unitPrice = QtyRange.Price.OriginalPrice;
        break;
      } else {
        if (nextQtyRange) {
          nextQtyRange = nextQtyRange.MinQuantity;
          if (MinQuantity <= quantity && quantity < nextQtyRange) {
            unitPrice = QtyRange.Price.OriginalPrice;
            break;
          }
        } else {
          unitPrice = QtyRange.Price.OriginalPrice;
        }
      }
    }
  }

  unitPrice = convertedPrice(unitPrice);
  if (Number(unitPrice)) {
    $(document)
      .find("#itemCalculationTable")
      .find(".priceRate")
      .text(unitPrice);
  }
  return Number(unitPrice);
};

export const generateConfigCurrentPrice = (
  ConfiguredItem,
  ProductPrice,
  ProductQuantityRanges,
  currentTotalQty = 0
) => {
  if (!isEmpty(ProductQuantityRanges) && isObject(ProductQuantityRanges)) {
    let actualPrice = QuantityRangesPrice(
      ProductQuantityRanges,
      currentTotalQty
    );
    if (actualPrice) {
      return actualPrice;
    }
  }

  let ConfigPrice = isObject(ConfiguredItem) ? ConfiguredItem.Price : {};
  if (!isEmpty(ConfigPrice) && isObject(ConfigPrice)) {
    return convertedPrice(ConfigPrice.OriginalPrice);
  }

  if (!isEmpty(ProductPrice) && isObject(ProductPrice)) {
    return convertedPrice(ProductPrice.OriginalPrice);
  }

  return 0;
};

export const check_cart = item_id => {
  let product_cart = productCart();
  let dom = $(document);
  if (isArray(product_cart)) {
    product_cart = product_cart.filter(filter => filter.isCart === true);
    if (!isEmpty(product_cart)) {
      let cartItem = product_cart.find(find => find.Id === item_id);
      if (!isEmpty(cartItem)) {
        if (cartItem.isCart === true) {
          dom.find(".btnBuyNow")
            .addClass("active")
            .attr("data-active", "active");
          dom.find(".btn-addToCart")
            .addClass("disabled")
            .attr("data-active", "active");
        } else {
          dom.find(".btnBuyNow")
            .removeClass("active")
            .attr("data-active", "");
          dom.find(".btn-addToCart")
            .removeClass("disabled")
            .attr("data-active", "");
        }
      }
      let cartLength = product_cart.length;
      if (cartLength) {
        dom.find(".cart_trigger")
          .find(".cart_count")
          .text(cartLength);
      }
    }
    updateCart(product_cart);
  }
};

export const validateCartProducts = (proceedLink = null) => {
  let products = productCart().filter(
    filterCart => filterCart.isCart === true
  );
  if (products.length) {
    let minQtyOnSetting = Number(b2b.min_order_quantity);
    let minAmount = Number(b2b.min_order_amount);
    let currency_icon = b2b.currency_icon;

    let passItem = [];
    let proceed = true;
    for (let i = 0; products.length > i; i++) {
      let product = products[i];
      let minQuantity = product.FirstLotQuantity;
      let Title = product.Title;
      let itemQuantity = 0;
      let itemSubTotal = 0;

      let checkedItem = product.itemData.filter(
        filter => filter.isChecked === true
      );

      checkedItem.map(singleItemData => {
        itemQuantity += singleItemData.quantity;
        itemSubTotal += singleItemData.subTotal;
      });

      if (checkedItem.length) {
        let $table = `<table class="table table-bordered table-sm">
                              <tr>
                                <td class="align-middle">
                                  <img src="${product.MainPictureUrl}" style="width:150px">
                                </td>
                                <td class="align-middle">
                                  <span class="text-danger">${Title}</span>
                                </td>
                              </tr>
                            </table>`;

        if (
          minQuantity > itemQuantity ||
          minQtyOnSetting > itemQuantity
        ) {
          let takenQty =
            minQtyOnSetting > minQuantity
              ? minQtyOnSetting
              : minQuantity;
          Swal.fire({
            title:
              "You can't Down the Minimum Quantity of " +
              takenQty,
            html: $table
          });
          proceed = false;
          $(document)
            .find("#" + product.Id)
            .addClass("text-danger");
          break;
        }

        if (itemSubTotal < minAmount) {
          Swal.fire({
            title: `You can't down the minimum price of ${currency_icon} ${Math.round(
              minAmount
            )}`,
            html: $table
          });
          proceed = false;
          $(document)
            .find("#" + product.Id)
            .addClass("text-danger");
          break;
        }

        passItem.push(checkedItem);
      }
    }

    console.log("passItem", passItem);

    if (!passItem.length && proceed) {
      Swal.fire({
        icon: "warning",
        text: "Please checked your items "
      });
      proceed = false;
    }

    if (proceed && proceedLink) {
      window.location.href = proceedLink;
    }
    return proceed;
  }
};

export const loadingIcon = () => {
  return `<div class="text-center w-100"><div class="spinner-border text-muted" style="width: 22px; height: 22px"></div></div>`;
};

export const loadingText = () => {
  return `<div class="text-center w-100"><div class="spinner-border text-muted" style="width: 22px; height: 22px"></div><p style="margin:0;">Loading information, please wait...</p></div>`;
};

export const loadingFail = () => {
  return `<div class="text-center w-100 text-danger"><p style="margin:0;">Loading fail, please try again</p></div>`;
};

export const random = length => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  return result;
};

export const slugify = (text, separator = "-") => {
  return text
    .toString()
    .normalize("NFD") // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, separator);
};

export const loadingWebsite = () => {
  var loaded = $(document).find(".loaded");
  loaded.css("display", "");
  loaded.addClass("preloader");
  loaded.removeClass("loaded");
};

export const loadingOutWebsite = () => {
  $(document)
    .find(".preloader")
    .delay(300)
    .fadeOut(300)
    .addClass("loaded");
};
