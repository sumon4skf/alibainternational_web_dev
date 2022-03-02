import Swal from "sweetalert2";
import {
    loadingWebsite,
    loadingOutWebsite
} from "./cartHelpers";

$(function () {



    $('#pictureSearch').on('change', function (event) {
        $(this).closest('form').submit();
    });


    $('#pictureSearchForm').on('submit', function (event) {
        var pictureForm = $(this);

        $.ajax({
            url: pictureForm.attr("action"),
            type: pictureForm.attr("method"),
            dataType: "JSON",
            data: new FormData(pictureForm[0]),
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            beforeSend: function () {
                loadingWebsite();
            },
            success: function (resData) {
                if (resData.status) {
                    window.location.href = resData.href;
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: resData.message
                    });
                }
            },
            error: function (xhr) {
                console.log('error');
            },
            complete: function () {
                loadingOutWebsite()
            }
        });
        event.preventDefault();
    }); // pictureSearch event









});
