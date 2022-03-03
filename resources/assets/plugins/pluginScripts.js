


(function ($) {
  "use strict";

  /*======= LOADING JS =============*/
  $(".preloader").fadeOut(300).addClass("loaded");


  if ($("img.b2bLoading").length) {
    $("img.b2bLoading").Lazy();
  }
  if ($(".marquee").length) {
    $(".marquee").marquee();
  }


  /*======= BACKGROUND IMAGE JS ==========*/
  /*data image src*/
  $(".background_bg").each(function () {
    var attr = $(this).attr("data-img-src");
    if (typeof attr !== typeof undefined && attr !== false) {
      $(this).css("background-image", "url(" + attr + ")");
    }
  });


  //Show Hide dropdown-menu Main navigation
  $(document).on('ready', function () {
    $('.dropdown-menu a.dropdown-toggler').on('click', function () {
      //var $el = $( this );
      //var $parent = $( this ).offsetParent( ".dropdown-menu" );
      if (!$(this).next().hasClass('show')) {
        $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
      }
      var $subMenu = $(this).next(".dropdown-menu");
      $subMenu.toggleClass('show');

      $(this).parent("li").toggleClass('show');

      $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function () {
        $('.dropdown-menu .show').removeClass("show");
      });

      return false;
    });
  });


  /*======== ANIMATION JS ==================*/
  $(function () {
    function ckScrollInit(items, trigger) {
      items.each(function () {
        var ckElement = $(this),
          AnimationClass = ckElement.attr("data-animation"),
          AnimationDelay = ckElement.attr("data-animation-delay");

        ckElement.css({
          "-webkit-animation-delay": AnimationDelay,
          "-moz-animation-delay": AnimationDelay,
          "animation-delay": AnimationDelay,
          opacity: 0
        });

        var ckTrigger = trigger ? trigger : ckElement;

        ckTrigger.waypoint(
          function () {
            ckElement.addClass("animated").css("opacity", "1");
            ckElement.addClass("animated").addClass(AnimationClass);
          },
          {
            triggerOnce: true,
            offset: "90%"
          }
        );
      });
    }

    ckScrollInit($(".animation"));
    ckScrollInit($(".staggered-animation"), $(".staggered-animation-wrap"));
  });

  /*=============  MENU JS ========*/
  //Main navigation scroll spy for shadow
  $(window).on("scroll", function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 150) {
      $("header.fixed-top").addClass("nav-fixed");
    } else {
      $("header.fixed-top").removeClass("nav-fixed");
    }
  });

  //Show Hide dropdown-menu Main navigation
  $(document).on("ready", function () {
    $(".dropdown-menu a.dropdown-toggler").on("click", function () {
      //var $el = $( this );
      //var $parent = $( this ).offsetParent( ".dropdown-menu" );
      if (
        !$(this)
          .next()
          .hasClass("show")
      ) {
        $(this)
          .parents(".dropdown-menu")
          .first()
          .find(".show")
          .removeClass("show");
      }
      var $subMenu = $(this).next(".dropdown-menu");
      $subMenu.toggleClass("show");

      $(this)
        .parent("li")
        .toggleClass("show");

      $(this)
        .parents("li.nav-item.dropdown.show")
        .on("hidden.bs.dropdown", function () {
          $(".dropdown-menu .show").removeClass("show");
        });

      return false;
    });
  });

  //Hide Navbar Dropdown After Click On Links
  var navBar = $(".header_wrap");
  var navbarLinks = navBar.find(".navbar-collapse ul li a.page-scroll");

  $.each(navbarLinks, function () {
    var navbarLink = $(this);

    navbarLink.on("click", function () {
      navBar.find(".navbar-collapse").collapse("hide");
      $("header").removeClass("active");
    });
  });

  //Main navigation Active Class Add Remove
  $(".navbar-toggler").on("click", function () {
    $("header").toggleClass("active");
    if ($(".search-overlay").hasClass("open")) {
      $(".search-overlay").removeClass("open");
      $(".search_trigger").removeClass("open");
    }
  });

  $(document).on("ready", function () {
    if (
      $(".header_wrap").hasClass("fixed-top") &&
      !$(".header_wrap").hasClass("transparent_header") &&
      !$(".header_wrap").hasClass("no-sticky")
    ) {
      $(".header_wrap").before(
        '<div class="header_sticky_bar d-none"></div>'
      );
    }
  });

  $(window).on("scroll", function () {
    var scroll = $(window).scrollTop();
    if (scroll >= 150) {
      $(".header_sticky_bar").removeClass("d-none");
      $("header.no-sticky").removeClass("nav-fixed");
    } else {
      $(".header_sticky_bar").addClass("d-none");
    }
  });

  var setHeight = function () {
    var height_header = $(".header_wrap").height();
    $(".header_sticky_bar").css({ height: height_header });
  };

  $(window).on("load", function () {
    setHeight();
  });

  $(window).on("resize", function () {
    setHeight();
  });

  $(".sidetoggle").on("click", function () {
    $(this).addClass("open");
    $("body").addClass("sidetoggle_active");
    $(".sidebar_menu").addClass("active");
    $("body").append(
      '<div id="header-overlay" class="header-overlay"></div>'
    );
  });

  $(document).on("click", "#header-overlay, .sidemenu_close", function () {
    $(".sidetoggle").removeClass("open");
    $("body").removeClass("sidetoggle_active");
    $(".sidebar_menu").removeClass("active");
    $("#header-overlay").fadeOut("3000", function () {
      $("#header-overlay").remove();
    });
    return false;
  });

  $(".categories_btn").on("click", function () {
    $(".side_navbar_toggler").attr("aria-expanded", "false");
    $("#navbarSidetoggle").removeClass("show");
  });

  $(".side_navbar_toggler").on("click", function () {
    $(".categories_btn").attr("aria-expanded", "false");
    $("#navCatContent").removeClass("show");
  });

  $(".pr_search_trigger").on("click", function () {
    $(this).toggleClass("show");
    $(".product_search_form").toggleClass("show");
  });

  var rclass = true;

  $("html").on("click", function () {
    if (rclass) {
      $(".categories_btn").addClass("collapsed");
      $(".categories_btn,.side_navbar_toggler").attr(
        "aria-expanded",
        "false"
      );
      $("#navCatContent,#navbarSidetoggle").removeClass("show");
    }
    rclass = true;
  });

  $(
    ".categories_btn,#navCatContent,#navbarSidetoggle .navbar-nav,.side_navbar_toggler"
  ).on("click", function () {
    rclass = false;
  });

  /*======= SMOOTH SCROLLING JS ====================*/
  // Select all links with hashes

  var topheaderHeight = $(".top-header").innerHeight();
  var mainheaderHeight = $(".header_wrap").innerHeight();
  var headerHeight = mainheaderHeight - topheaderHeight - 20;
  $('a.page-scroll[href*="#"]:not([href="#"])').on("click", function () {
    $("a.page-scroll.active").removeClass("active");
    $(this)
      .closest(".page-scroll")
      .addClass("active");
    // On-page links
    if (
      location.pathname.replace(/^\//, "") ===
      this.pathname.replace(/^\//, "") &&
      location.hostname === this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash),
        speed = $(this).data("speed") || 800;
      target = target.length
        ? target
        : $("[name=" + this.hash.slice(1) + "]");

      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $("html, body").animate(
          {
            scrollTop: target.offset().top - headerHeight
          },
          speed
        );
      }
    }
  });
  $(window).on("scroll", function () {
    var lastId,
      // All list items
      menuItems = $(".header_wrap").find("a.page-scroll"),
      topMenuHeight = $(".header_wrap").innerHeight() + 20,
      // Anchors corresponding to menu items
      scrollItems = menuItems.map(function () {
        var items = $($(this).attr("href"));
        if (items.length) {
          return items;
        }
      });
    var fromTop = $(this).scrollTop() + topMenuHeight;

    // Get id of current scroll item
    var cur = scrollItems.map(function () {
      if ($(this).offset().top < fromTop) return this;
    });
    // Get the id of the current element
    cur = cur[cur.length - 1];
    var id = cur && cur.length ? cur[0].id : "";

    if (lastId !== id) {
      lastId = id;
      // Set/remove active class
      menuItems
        .closest(".page-scroll")
        .removeClass("active")
        .end()
        .filter("[href='#" + id + "']")
        .closest(".page-scroll")
        .addClass("active");
    }
  });

  $(".more_slide_open").slideUp();
  $(".more_categories").on("click", function () {
    $(this).toggleClass("show");
    $(".more_slide_open").slideToggle();
  });

  /*========== SEARCH JS ==============*/

  $(".close-search").on("click", function () {
    $(".search_wrap,.search_overlay").removeClass("open");
    $("body").removeClass("search_open");
  });

  var removeClass = true;
  $(".search_wrap").after('<div class="search_overlay"></div>');
  $(".search_trigger").on("click", function () {
    $(".search_wrap,.search_overlay").toggleClass("open");
    $("body").toggleClass("search_open");
    removeClass = false;
    if ($(".navbar-collapse").hasClass("show")) {
      $(".navbar-collapse").removeClass("show");
      $(".navbar-toggler").addClass("collapsed");
      $(".navbar-toggler").attr("aria-expanded", false);
    }
  });
  $(".search_wrap form").on("click", function () {
    removeClass = false;
  });
  $("html").on("click", function () {
    if (removeClass) {
      $("body").removeClass("open");
      $(".search_wrap,.search_overlay").removeClass("open");
      $("body").removeClass("search_open");
    }
    removeClass = true;
  });

  /*========== SCROLLUP JS  ============*/
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 150) {
      $(".scrollup").fadeIn();
    } else {
      $(".scrollup").fadeOut();
    }
  });

  $(".scrollup").on("click", function (e) {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: 0
      },
      600
    );
    return false;
  });

  /*============ PARALLAX JS ==================*/
  $(window).on("load", function () {
    $(".parallax_bg").parallaxBackground();
  });

  /*======  SLIDER JS ==========*/
  function carousel_slider() {
    $(".carousel_slider").each(function () {
      var $carousel = $(this);
      $carousel.owlCarousel({
        dots: $carousel.data("dots"),
        loop: $carousel.data("loop"),
        items: $carousel.data("items"),
        margin: $carousel.data("margin"),
        mouseDrag: $carousel.data("mouse-drag"),
        touchDrag: $carousel.data("touch-drag"),
        autoHeight: $carousel.data("autoheight"),
        center: $carousel.data("center"),
        nav: $carousel.data("nav"),
        rewind: $carousel.data("rewind"),
        navText: [
          '<i class="ion-ios-arrow-left"></i>',
          '<i class="ion-ios-arrow-right"></i>'
        ],
        autoplay: $carousel.data("autoplay"),
        animateIn: $carousel.data("animate-in"),
        animateOut: $carousel.data("animate-out"),
        autoplayTimeout: $carousel.data("autoplay-timeout"),
        smartSpeed: $carousel.data("smart-speed"),
        responsive: $carousel.data("responsive")
      });
    });
  }

  $(document).on("ready", function () {
    carousel_slider();
  });

  /*========== Select dropdowns ==================*/

  if ($("select").length) {
    // Traverse through all dropdowns
    $.each($("select"), function (i, val) {
      var $el = $(val);
      if ($el.val() === "") {
        $el.addClass("first_null");
      }

      if (!$el.val()) {
        $el.addClass("not_chosen");
      }

      $el.on("change", function () {
        if (!$el.val()) $el.addClass("not_chosen");
        else $el.removeClass("not_chosen");
      });
    });
  }

  /*============= DROPDOWN JS ===============*/
  if ($(".custome_select").length > 0) {
    $(document).on("ready", function () {
      $(".custome_select").msDropdown();
    });
  }

  /*========= TOOLTIP JS ==================*/
  $(function () {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: "hover"
    });
  });
  $(function () {
    $('[data-toggle="popover"]').popover();
  });

  /*======= QUICKVIEW POPUP + ZOOM IMAGE + PRODUCT SLIDER JS ==================*/
  var image = $("#product_img");

  $(".plus").on("click", function () {
    if (
      $(this)
        .prev()
        .val()
    ) {
      $(this)
        .prev()
        .val(
          +$(this)
            .prev()
            .val() + 1
        );
    }
  });
  $(".minus").on("click", function () {
    if (
      $(this)
        .next()
        .val() > 1
    ) {
      if (
        $(this)
          .next()
          .val() > 1
      )
        $(this)
          .next()
          .val(
            +$(this)
              .next()
              .val() - 1
          );
    }
  });

  /*=====  CHECKBOX CHECK THEN ADD CLASS JS =======================*/
  $(".create-account,.different_address").hide();
  $("#createaccount:checkbox").on("change", function () {
    if ($(this).is(":checked")) {
      $(".create-account").slideDown();
    } else {
      $(".create-account").slideUp();
    }
  });
  $("#differentaddress:checkbox").on("change", function () {
    if ($(this).is(":checked")) {
      $(".different_address").slideDown();
    } else {
      $(".different_address").slideUp();
    }
  });

  /*======= Cart Page Payment option ================*/

  $(document).on("ready", function () {
    $('[name="payment_option"]').on("change", function () {
      var $value = $(this).attr("value");
      $(".payment-text").slideUp();
      $('[data-method="' + $value + '"]').slideDown();
    });
  });
})(jQuery);
