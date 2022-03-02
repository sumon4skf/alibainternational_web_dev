(function($) {
    $(document)
        .on("click", ".noticeButton", function() {
            var notice = $(this).attr("data-notice");
            $.ajax({
                url: "/ajax/DK4iSC8EJDqU6xtKgZRvilrraTQjlxwS9sN",
                method: "POST",
                data: {
                    notice: notice
                },
                dataType: "json",
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
                }
            })
                .done(function(store_response) {
                    console.log(store_response);
                })
                .fail(function(response) {
                    console.log(response);
                });
        })
        .on("click", ".toggle_make_top", function(event) {
            event.preventDefault();
            let href = $(this).attr("href");
            Swal.fire({
                icon: "warning",
                text: "Are you sure to do this?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: `Proceed`
            }).then(result => {
                if (result.value) {
                    window.location.assign(href);
                }
            });
        });
})(jQuery);
