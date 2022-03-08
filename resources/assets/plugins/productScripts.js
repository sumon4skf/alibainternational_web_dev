(function ($) {
  "use strict";

  var image = $("#product_img");
  //var zoomConfig = {};
  var zoomActive = false;
  if ($(window).width() > 768) {
    zoomActive = true;
  }
  // zoomActive = !zoomActive;
  if (zoomActive) {
    if ($(image).length > 0) {
      $(image).elevateZoom({
        cursor: "crosshair",
        easing: true,
        gallery: "pr_item_gallery",
        zoomType: "inner",
        // scrollZoom: true,
        galleryActiveClass: "active"
      });
    }
  } else {
    $.removeData(image, "elevateZoom"); //remove zoom instance from image
    $(".zoomContainer:last-child").remove(); // remove zoom container from DOM
  }

  $.magnificPopup.defaults.callbacks = {
    open: function () {
      $("body").addClass("zoom_image");
    },
    close: function () {
      // Wait until overflow:hidden has been removed from the html tag
      setTimeout(function () {
        $("body").removeClass("zoom_image");
        $("body").removeClass("zoom_gallery_image");
        //$('.zoomContainer:last-child').remove();// remove zoom container from DOM
        $(".zoomContainer")
          .slice(1)
          .remove();
      }, 100);
    }
  };

  // Set up gallery on click
  var galleryZoom = $("#pr_item_gallery");
  galleryZoom.magnificPopup({
    delegate: "a",
    type: "image",
    gallery: {
      enabled: true
    },
    callbacks: {
      elementParse: function (item) {
        item.src = item.el.attr("data-zoom-image");
      }
    }
  });

  // Zoom image when click on icon
  $(".product_img_zoom").on("click", function () {
    var actual = $("#pr_item_gallery a").attr("data-zoom-image");
    $("body").addClass("zoom_gallery_image");
    $("#pr_item_gallery .item").each(function () {
      if (
        actual ==
        $(this)
          .find(".product_gallery_item")
          .attr("data-zoom-image")
      ) {
        return galleryZoom.magnificPopup("open", $(this).index());
      }
    });
  });

  /*========= POPUP JS ==================*/
  $(".content-popup").magnificPopup({
    type: "inline",
    preloader: true,
    mainClass: "mfp-zoom-in"
  });

  $(".image_gallery").each(function () {
    // the containers for all your galleries
    $(this).magnificPopup({
      delegate: "a", // the selector for gallery item
      type: "image",
      gallery: {
        enabled: true
      }
    });
  });

  $(".popup-ajax").magnificPopup({
    type: "ajax",
    callbacks: {
      ajaxContentAdded: function () {
        carousel_slider();
        slick_slider();
      }
    }
  });

  $(".video_popup, .iframe_popup").magnificPopup({
    type: "iframe",
    removalDelay: 160,
    mainClass: "mfp-zoom-in",
    preloader: false,
    fixedContentPos: false
  });

  /*======== SLIDER JS slick_slider ==================*/

  function slick_slider() {
    $(".slick_slider").each(function () {
      var $slick_carousel = $(this);
      $slick_carousel.slick({
        arrows: $slick_carousel.data("arrows"),
        dots: $slick_carousel.data("dots"),
        infinite: $slick_carousel.data("infinite"),
        centerMode: $slick_carousel.data("center-mode"),
        vertical: $slick_carousel.data("vertical"),
        fade: $slick_carousel.data("fade"),
        cssEase: $slick_carousel.data("css-ease"),
        autoplay: $slick_carousel.data("autoplay"),
        verticalSwiping: $slick_carousel.data("vertical-swiping"),
        autoplaySpeed: $slick_carousel.data("autoplay-speed"),
        speed: $slick_carousel.data("speed"),
        pauseOnHover: $slick_carousel.data("pause-on-hover"),
        draggable: $slick_carousel.data("draggable"),
        slidesToShow: $slick_carousel.data("slides-to-show"),
        slidesToScroll: $slick_carousel.data("slides-to-scroll"),
        asNavFor: $slick_carousel.data("as-nav-for"),
        focusOnSelect: $slick_carousel.data("focus-on-select"),
        responsive: $slick_carousel.data("responsive")
      });
    });
  }

  $(document).on("ready", function () {
    slick_slider();
  });


  /*========= RATING STAR JS ============*/
  $(document).on("ready", function () {
    $(".star_rating span").on("click", function () {
      var onStar = parseFloat($(this).data("value"), 10); // The star currently selected
      var stars = $(this)
        .parent()
        .children(".star_rating span");
      for (var i = 0; i < stars.length; i++) {
        $(stars[i]).removeClass("selected");
      }
      for (i = 0; i < onStar; i++) {
        $(stars[i]).addClass("selected");
      }
    });
  });
})(jQuery);
