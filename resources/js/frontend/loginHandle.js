import Axios from "axios";
import { productCart, loadingWebsite, loadingOutWebsite } from "./cartHelpers";

$(function () {
  $("body")
    .on("click", ".loginOptionBtn", function () {
      var method = $(this).attr('data-method');
      $(this).closest('.loginOption')
        .find('.loginOptionBtn')
        .addClass('btn-outline-danger')
        .removeClass("btn-default");
      $(this).addClass("btn-default");
      $('.loginForm').addClass('d-none');
      if (method == 'otp') {
        $(".loginWithOtp").removeClass('d-none');
      } else if (method == 'email') {
        $(".withEmailLogin").removeClass('d-none');
      }
    });

  function replace_phone_prefix(phone) {
    let ItemOne = phone.replace(/^(?:\+?88|0088)/, "");
    return ItemOne.replace(/\s+/g, "");
  }

  function checkValidPhone(inputPhone = null) {
    const phoneSelect = $('input[name="phone"]');
    const phone = inputPhone ? inputPhone : phoneSelect.val();
    const generatePhone = replace_phone_prefix(phone);
    const method = "^(?:\\+?88|0088)?01[15-9]\\d{8}$";
    const regExpression = new RegExp(method);
    if (regExpression.test(generatePhone)) {
      phoneSelect.removeClass("is-invalid").addClass("is-valid");
      return true;
    } else {
      phoneSelect.removeClass("is-valid").addClass("is-invalid");
    }
    return false;
  }

  $(document).on("keyup", 'input[name="phone"]', function () {
    let phone = $(this).val();
    checkValidPhone(phone);
  });

  function loginLoading(loading = true) {
    if (loading === true) {
      $('.loginForm').addClass('d-none');
      $('.loginLoading').removeClass('d-none');
    } else {
      $('.loginLoading').addClass('d-none');
    }
  }

  function countDownResendOtp() {
    var timeLeft = 30;
    var elem = $("#otpCodeSubmitBtn");
    elem.attr("disabled", "disabled");
    var timerId = setInterval(countdown, 1000);

    function countdown() {
      if (timeLeft == -1) {
        clearTimeout(timerId);
        doSomething();
      } else {
        elem.text("Resend Code " + timeLeft);
        timeLeft--;
      }
    }

    function doSomething() {
      elem.removeAttr("disabled");
      elem.text("Resend Code");
    }
  }

  function ajaxSendOtpForVerification(phoneNumber) {
    loginLoading();
    Axios.post('/ajax/LHZLLfEpaQVdK0qCYDletmxqfKmklEXMr5m', { phone: phoneNumber, remember: 1 })
      .then(response => {
        let resData = response.data;
        if (resData.status) {
          loginLoading(false);
          $(".loginForm").addClass("d-none");
          $(".otpSubmitForm").removeClass("d-none");
          let otpSubmitForm = $(".otpSubmitForm");
          otpSubmitForm.find(".userPhone").val(resData.phone);
          otpSubmitForm.find(".userId").val(resData.user_id);
          otpSubmitForm
            .find(".otp_code")
            .val("")
            .trigger("focus");
          countDownResendOtp();
        } else {
          Swal.fire({
            text: "OTP Sending Fail. Please try again."
          });
        }
      })
      .catch(error => {
        console.log('error', error);
      })
      .then(() => {
        loginLoading(false);
      })
  }


  $(document).on("click", "#otpSubmitBtn", function () {
    let phoneNumber = $('input[name="phone"]').val();
    let checkPhone = checkValidPhone(phoneNumber);
    if (checkPhone) {
      ajaxSendOtpForVerification(phoneNumber);
    } else {
      Swal.fire({
        text: "Phone Number is Not Valid!",
        icon: 'warning'
      });
    }
  });

  function ajaxCheckingValidEmailAddress(email) {
    loginLoading();
    Axios.post('/ajax/check-customer-email', { email })
      .then(response => {
        let resData = response.data;
        if (resData.status === true) {
          loginLoading(false);
          $(".loginForm").addClass("d-none");
          $(".passwordSubmitForm").removeClass("d-none");
          let passwordSubmitForm = $(".password_submit_form");
          passwordSubmitForm.find(".userEmail").val(resData.email);
          passwordSubmitForm
            .find("#password")
            .val("")
            .trigger("focus");
        } else {
          Swal.fire({
            text: "This email is not registered. Please register first",
            icon: 'info'
          });
        }
      })
      .catch(error => {
        console.log('error', error);
      })
      .then(() => {
        loginLoading(false);
      })
  }

  function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true)
    }
    return (false)
  }

  $(document).on("click", "#emailSubmitBtn", function () {
    let email = $('input[name="email"]').val();
    let checkEmail = ValidateEmail(email);
    if (checkEmail) {
      ajaxCheckingValidEmailAddress(email);
    } else {
      Swal.fire({
        text: "Type your valid email",
        icon: 'warning'
      });
    }
  });

  $(document).on("click", "#backToLoginCard", function () {
    $(".loginForm").addClass("d-none");
    $(".loginWithOtp").removeClass("d-none");
  });

  $(document).on("click", "#otpCodeSubmitBtn", function () {
    let phoneNumber = $(document)
      .find(".userPhone")
      .val();
    let checkPhone = checkValidPhone(phoneNumber);
    if (checkPhone) {
      ajaxSendOtpForVerification(phoneNumber);
    } else {
      Swal.fire({
        text: "Phone Number is Not Valid!",
        icon: 'info',
      });
    }
  });

  $(document).on("keyup", 'input[name="otp_code"]', function () {
    const product_cart = productCart();
    let otp_code = $(this).val();
    let userId = $(this)
      .closest(".form-group")
      .find(".userId")
      .val();
    let userPhone = $(this)
      .closest(".form-group")
      .find(".userPhone")
      .val();
    if (otp_code.length === 4) {
      loginLoading();
      Axios.post('/ajax/IEMsZPlg72Adiuc1pSVrkI6iiUzKXWykNhd', {
        otp_code: otp_code,
        userPhone: userPhone,
        userId: userId
      })
        .then(response => {
          let resData = response.data;
          if (resData.status) {
            if (product_cart.length > 0) {
              window.location.href = "/checkout";
            } else {
              window.location.href = "/dashboard";
            }
          } else {
            Swal.fire({
              text: "Phone Number Verification Fail!"
            });
          }
        })
        .catch(error => {
          console.log('error', error);
        })
        .then(() => {
          loginLoading(false);
        });
    }
  });

  $(document).on("click", '#passwordSubmitBtn', function () {
    const product_cart = productCart();
    const emailSubmitForm = $(".password_submit_form");
    let email = emailSubmitForm.find(".userEmail").val();
    let password = emailSubmitForm.find("#password").val();
    if (email && password) {
      loginLoading();
      Axios.post('/ajax/check-password', { email, password })
        .then(response => {
          $(".passwordSubmitForm").removeClass('d-none');
          let resData = response.data;
          if (resData.status == true) {
            if (product_cart.length > 0) {
              window.location.href = "/checkout";
            } else {
              window.location.href = "/dashboard";
            }
          } else {
            Swal.fire({
              text: resData.msg,
              icon: "warning"
            });
          }
        })
        .catch(error => {
          console.log('error', error);
        })
        .then(() => {
          $(".passwordSubmitForm").removeClass('d-none');
          loginLoading(false);
        });
    } else {
      Swal.fire({
        text: "Type your password",
        icon: 'info',
      });
    }
  });
});
