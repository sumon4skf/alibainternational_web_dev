const { default: Axios } = require("axios");
const {
  default: Swal
} = require("sweetalert2");

$(document).on('click', '.add_wishlist', function (event) {
  event.preventDefault();
  var thisButton = $(this);
  var storeUrl = thisButton.attr('href');
  var item_id = thisButton.attr('data-id');

  var exists_wishlist = thisButton.attr('data-status');
  var isAuth = thisButton.attr('data-auth');
  var addWishList = true;

  if (!isAuth) {
    addWishList = false;
    Swal.fire({
      icon: 'info',
      text: 'Please Login First!'
    });
  }

  if (exists_wishlist) {
    addWishList = false;
    Swal.fire({
      icon: 'info',
      text: 'Already Added to Wishlist'
    });
  }

  if (addWishList) {
    Axios.post(storeUrl, { item_id })
      .then(res => {
        const resData = res.data;
        if (resData?.total_w_list) {
          check_wishlist(resData.total_w_list);
          thisButton.addClass('disabled');
          Swal.fire({
            icon: 'success',
            text: 'Product added to wishlist successfully'
          });
        }
      });
  }
});



function check_wishlist(resData = 0) {
  if (resData) {
    $(document).find('.wishlistCount').text(resData);
  } else {
    Axios.post('/wishlist/count-wishlist')
      .then(res => {
        const resData = res.data;
        if (resData.total_w_list) {
          $(document).find('.wishlistCount').text(resData.total_w_list);
        }
      });
  }
}




$(function () {
  if (isAuth) {
    check_wishlist();
  }
});
