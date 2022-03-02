import { productCart, loadingWebsite, loadingOutWebsite } from "./cartHelpers";

$(function() {
    $("body")
        .on("click", "#withOtpLogin", function() {
            $(this)
                .removeClass("btn-outline-dark")
                .addClass("btn-dark");
            $("#withEmailLogin")
                .removeClass("btn-dark")
                .addClass("btn-outline-dark");
            $(".loginWithOtp").removeClass("d-none");
            $(".loginWithEmail").addClass("d-none");
        })
        .on("click", "#withEmailLogin", function() {
            $(this)
                .removeClass("btn-outline-dark")
                .addClass("btn-dark");
            $("#withOtpLogin")
                .removeClass("btn-dark")
                .addClass("btn-outline-dark");

            $(".loginWithOtp").addClass("d-none");
            $(".loginWithEmail").removeClass("d-none");
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

    $(document).on("keyup", 'input[name="phone"]', function() {
        let phone = $(this).val();
        checkValidPhone(phone);
    });

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
        $.ajax({
            type: "POST",
            url: "/ajax/LHZLLfEpaQVdK0qCYDletmxqfKmklEXMr5m",
            data: {
                phone: phoneNumber,
                remember: 1
            },
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            },
            beforeSend: function() {
                loadingWebsite();
            },
            success: function(response) {
                if (response.status) {
                    $(".loginSubmitCard").addClass("d-none");
                    $(".otpSubmitCard").removeClass("d-none");
                    let otp_submit_form = $(".otp_submit_form");
                    otp_submit_form.find(".userPhone").val(response.phone);
                    otp_submit_form.find(".userId").val(response.user_id);
                    otp_submit_form
                        .find(".otp_code")
                        .val("")
                        .trigger("focus");
                    countDownResendOtp();
                } else {
                    Swal.fire({
                        text: "OTP Sending Fail. Please try again."
                    });
                }
            },
            error: function(xhr) {
                console.log("otp proceed", xhr);
            },
            complete: function() {
                loadingOutWebsite();
            }
        });
    }

    $(document).on("click", "#otpSubmitBtn", function() {
        let phoneNumber = $('input[name="phone"]').val();
        let checkPhone = checkValidPhone(phoneNumber);
        if (checkPhone) {
            ajaxSendOtpForVerification(phoneNumber);
        } else {
            Swal.fire({
                text: "Phone Number is Not Valid!"
            });
        }
    });

    $(document).on("click", "#backToLoginCard", function() {
        $(".loginSubmitCard").removeClass("d-none");
        $(".otpSubmitCard").addClass("d-none");
    });

    $(document).on("click", "#otpCodeSubmitBtn", function() {
        let phoneNumber = $(document)
            .find(".userPhone")
            .val();
        let checkPhone = checkValidPhone(phoneNumber);
        if (checkPhone) {
            ajaxSendOtpForVerification(phoneNumber);
        } else {
            Swal.fire({
                text: "Phone Number is Not Valid!"
            });
        }
    });

    $(document).on("keyup", 'input[name="otp_code"]', function() {
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
            $.ajax({
                type: "POST",
                url: "/ajax/IEMsZPlg72Adiuc1pSVrkI6iiUzKXWykNhd",
                data: {
                    otp_code: otp_code,
                    userPhone: userPhone,
                    userId: userId
                },
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
                },
                beforeSend: function() {
                    loadingWebsite();
                },
                success: function(response) {
                    if (response.status) {
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
                },
                error: function(xhr) {
                    console.log(xhr);
                },
                complete: function() {
                    loadingOutWebsite();
                }
            });
        }
    });
});
