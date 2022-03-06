import Axios from "axios";
import { loadingText, update_customer_address } from "./cartHelpers";

let modalAddressBody = $(document).find("#modalAddressBody");
let shippingAddressModal = $(document).find("#shippingAddressModal");

function add_edit_address_form(address = {}) {
    let existAddress = !!Object.keys(address).length;
    let address_id = existAddress ? address.id : "";
    let name = existAddress ? address.name : "";
    let phone_one = existAddress ? replace_phone_prefix(address.phone_one) : "";
    let phone_two = existAddress
        ? address.phone_two
            ? replace_phone_prefix(address.phone_two)
            : ""
        : "";
    let fulladdress = existAddress ? address.address : "";
    return `<form id="storeNewAddress">
${
    existAddress
        ? `<input type="hidden" name="address_id" value="${address_id}" >`
        : ""
}
<div class="form-group">
    <label for="name">Your Name</label>
    <input type="text" name="name" placeholder="Name" value="${name}" class="form-control" id="name"  autocomplete="name" required="">
    <small id="emailHelp" class="form-text text-muted">Type Your Full Name</small>
  </div>
  <div class="form-group">
    <label for="phone_one">Phone One</label>
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">+88</span>
      </div>
      <input type="text" name="phone_one"  id="phone_one" placeholder="Phone" value="${phone_one}" class="form-control" required="">
    </div>
    <small id="emailHelp" class="form-text text-muted">Example: 01855892035</small>
  </div>
  <div class="form-group">
    <label for="phone_two">Phone Two</label>
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">+88</span>
      </div>
      <input type="text" name="phone_two" id="phone_two" placeholder="Phone Alternative" value="${phone_two}" class="form-control" aria-describedby="phone_two">
    </div>
    <small id="emailHelp" class="form-text text-muted">Example: 01855892035</small>
  </div>
  <div class="form-group">
    <label for="address">Your Full Address</label>
    <textarea name="address" id="address"  class="form-control" placeholder="Your Full Address" rows="4" required="">${fulladdress}</textarea>
  </div>
  <button type="submit" class="btn btn-block btn-primary submitButton">${
      existAddress ? "Update" : "Save"
  }</button>
</form>`;
}

function replace_phone_prefix(phone) {
    let ItemOne = phone.replace(/^(?:\+?88|0088)/, "");
    return ItemOne.replace(/\s+/g, "");
}

$(document).on("keyup", "#phone_one, #phone_two", function() {
    let phone = $(this).val();
    phone = replace_phone_prefix(phone);
    $(this).val(phone);
    const method = "^(?:\\+?88|0088)?01[15-9]\\d{8}$";
    var regExpression = new RegExp(method);
    if (regExpression.test(phone)) {
        $(this)
            .removeClass("is-invalid")
            .addClass("is-valid");
        $(document)
            .find(".submitButton")
            .removeAttr("disabled");
    } else {
        $(this)
            .removeClass("is-valid")
            .addClass("is-invalid");
        $(document)
            .find(".submitButton")
            .attr("disabled", "true");
    }
});

$(document).on("submit", "#storeNewAddress", function(event) {
    event.preventDefault();
    let formData = $(this).serialize();
    let addressStore = modalAddressBody.attr("data-addressStore");
    if (addressStore) {
        $.ajax({
            url: addressStore,
            method: "POST",
            data: formData,
            dataType: "json",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            }
        })
            .done(function(store_response) {
                if (store_response.status) {
                    load_customer_address();
                } else {
                    alert("Something is went wrong!");
                }
            })
            .fail(function(response) {
                console.log(response);
            });
    }
});

$(document).on("click", ".deleteAddressButton", function() {
    let address_id = $(this).attr("data-id");
    let addressDelete = modalAddressBody.attr("data-addressDelete");
    if (addressDelete) {
        $.ajax({
            url: addressDelete,
            method: "POST",
            data: {
                address_id: address_id
            },
            dataType: "json",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            }
        })
            .done(function(store_response) {
                if (store_response.status) {
                    load_customer_address();
                } else {
                    alert("Something is went wrong!");
                }
            })
            .fail(function(response) {
                console.log(response);
            });
    }
});

$(document).on("click", "#addNewAddress", function() {
    $(this).hide();
    $(document)
        .find("#showAllAddress")
        .show();
    let newAddressForm = add_edit_address_form();
    modalAddressBody.html(newAddressForm);
});

$(document).on("click", ".editAddressButton", function() {
    $(document)
        .find("#addNewAddress")
        .hide();
    $(document)
        .find("#showAllAddress")
        .show();
    let address = $(this).attr("data-address");
    address = JSON.parse(decodeURIComponent(address));
    let newAddressForm = add_edit_address_form(address);
    modalAddressBody.html(newAddressForm);
});

function addressCard(item, defaultId, shipping_id) {
    return `<div class="card mb-3" ${
        defaultId ? `style="border: 1px solid #ff324d"` : ""
    }>
                  <div class="card-body p-3">
                      <p class="m-0"><b>Name: </b><span class="name">${
                          item.name
                      }</span></p>
                      <p class="m-0"><b>Phone: </b><span class="phone_one">${
                          item.phone_one
                      }<br></span></p>
                      ${
                          item.phone_two
                              ? `<p class="m-0"><b>Phone: </b><span class="phone_two">${item.phone_two}<br></span></p>`
                              : ""
                      }
                      <p class="m-0"><b>Address: </b><span class="address">${
                          item.address
                      }</span></p>
                      <div class="btn-group btn-group-sm position-absolute" role="group"
                           aria-label="Basic Options" style="right: 20px;top: 15px;">
                          <button type="button" data-address="${encodeURIComponent(
                              JSON.stringify(item)
                          )}" class="btn btn-light px-3 text-primary editAddressButton" title="Edit Address">
                              <i class="icon-pencil"></i>
                          </button>
                          <button type="button" data-id="${
                              item.id
                          }" class="btn btn-light px-3 text-danger deleteAddressButton" ${
        shipping_id === item.id ? `disabled="true"` : ""
    }>
                              <i class="icon-trash-empty"></i>
                          </button>
                      </div>
                      <div class="btn-group btn-group-sm position-absolute" role="group"
                           aria-label="Basic Options" style="right: 20px;bottom: 15px;">
                      ${
                          defaultId
                              ? `<button type="button"class="btn btn-success"> Selected</button>`
                              : `<button type="button " data-address="${encodeURIComponent(
                                    JSON.stringify(item)
                                )}" class="btn btn-dark defaultAddress"> Select</button>`
                      }
                      </div>
                  </div>
              </div>`;
}

function addAddressButton() {
    return `<div class="text-center my-3"><button type="button" class="btn btn-link p-0" data-toggle="modal" data-target="#shippingAddressModal">Add Shipping Address </button></div>`;
}

function append_address_index(response) {
    let appendAddress = "";
    let shipping_id = response?.shipping_id;
    let billing_id = response?.billing_id;
    let address = response?.address;
    let defaultShipping = null;
    if (!_.isEmpty(address) && _.isArray(address)) {
        address.map(item => {
            let defaultId = shipping_id == item.id ? true : false;
            if (defaultId) {
                defaultShipping = item;
                update_customer_address(defaultShipping);
            }
            appendAddress += addressCard(item, defaultId, shipping_id);
        });
    } else {
        appendAddress = ``;
    }
    if (defaultShipping) {
        append_address_default(defaultShipping);
    } else {
        let addButton = addAddressButton();
        $(".defaultAddressCardBody").html(addButton);
    }
    modalAddressBody.html(appendAddress);
}

function append_address_default(addressItem) {
    let address_default = "";
    if (Object.keys(addressItem).length) {
        address_default = `<p class="m-0"><b>Name: </b><span class="name">${
            addressItem.name
        }</span></p>
                                <p class="m-0"><b>Phone: </b><span class="phone_one">${
                                    addressItem.phone_one
                                }<br></span></p>
                                ${
                                    addressItem.phone_two
                                        ? `<p class="m-0"><b>Phone: </b><span class="phone_two">${addressItem.phone_two}<br></span></p>`
                                        : ""
                                }
                                <p class="m-0"><b>Address: </b><span class="address">${
                                    addressItem.address
                                }</span></p>`;
    } else {
        address_default = `<div class="text-center"><button type="button" class="bg-transparent border-0 btn btn-light text-primary" data-toggle="modal" data-target="#shippingAddressModal">Add Address</button></div>`;
    }

    $(document)
        .find(".defaultAddressCardBody")
        .html(address_default);
}

function load_customer_address() {
    let addressIndex = modalAddressBody.attr("data-addressIndex");
    const defaultBody = $(document).find(".defaultAddressCardBody");
    const addButton = addAddressButton();
    if (addressIndex) {
        let data = {
            customer: ""
        };
        defaultBody.html(loadingText);
        Axios.post(addressIndex, data)
            .then(response => {
                let resData = response.data;
                console.log("resData", resData);
                if (resData.status) {
                    append_address_index(resData);
                } else {
                    defaultBody.html(addButton);
                }
            })
            .catch(error => {
                console.log("error", error);
                defaultBody.html(addButton);
            })
            .then(() => {
                console.log("complete");
            });
    }
}

$(document).on("click", ".defaultAddress", function() {
    modalAddressBody.find(".card").css("border", "rgb(0 0 0 / 13%)");
    $(this)
        .closest(".card")
        .css("border", "1px solid #ff324d");
    let address = $(this).attr("data-address");
    address = JSON.parse(decodeURIComponent(address));
    let addressSetDefault = modalAddressBody.attr("data-addressSetDefault");
    if (addressSetDefault) {
        $.ajax({
            url: addressSetDefault,
            method: "POST",
            data: {
                shipping_id: address.id
            },
            dataType: "json",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            }
        })
            .done(function(response) {
                if (response.status) {
                    append_address_default(address);
                    shippingAddressModal.modal("hide");
                }
            })
            .fail(function(response) {
                window.location.href = "/login";
            });
    }
});

$(document).on("click", "#showAllAddress", function() {
    $(this).hide();
    $(document)
        .find("#addNewAddress")
        .show();
    load_customer_address();
});

$(function() {
    let defaultAddressCardBody = $(".defaultAddressCardBody ");
    if (defaultAddressCardBody.length) {
        load_customer_address();
    }
    shippingAddressModal.on("hidden.bs.modal", function(e) {
        load_customer_address();
    });
});

// ==== dashboard address customization ====
(function($) {
    $(document).on("click", ".btn-edit-address", function(event) {
        event.preventDefault();
        let href = $(this).attr("href");
        let editModal = $("#editAddressModal");
        Axios.get(href)
            .then(response => {
                let resData = response.data;
                editModal.find(".modal-body").html(resData.form);
            })
            .catch(error => {
                console.log("error", error);
            })
            .then(() => {
                editModal.modal("show");
            });
    });
})(jQuery);
