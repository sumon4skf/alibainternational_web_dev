import { tns } from "tiny-slider";
(function ($) {


  function tnsCarousel($carousel) {
    tns({
      container: $carousel,
      slideBy: 1,
      controls: true,
      controlsPosition: "bottom",
      controlsText: ['<i class="icon-left-open"></i>', '<i class="icon-right-open"></i>'],
      nav: false,
      navPosition: "bottom",
      autoplay: true,
      autoplayButtonOutput: false,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      rewind: true,
      lazyload: true,
      lazyloadSelector: '.rounded',
      controlsText: ['<i class="icon-left-open"></i>', '<i class="icon-right-open"></i>'],
      responsive: {
        0: { items: 3 },
        380: { items: 3 },
        991: { items: 3 },
        1199: { items: 4 }
      }
    });
  }

  var ourPriorities = $('#ourPriorities');

  if (ourPriorities?.length > 0) {
    tnsCarousel('#ourPriorities');
  }



  function carousel_slider($carousel) {
    tns({
      container: $carousel,
      slideBy: 1,
      controls: true,
      controlsPosition: "bottom",
      controlsText: ['<i class="icon-left-open"></i>', '<i class="icon-right-open"></i>'],
      nav: true,
      navPosition: "bottom",
      autoplay: true,
      autoplayButtonOutput: false,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      rewind: true,
      lazyload: true,
      lazyloadSelector: '.product-thumbnail',
      responsive: {
        0: { items: 2 },
        481: { items: 2 },
        768: { items: 3 },
        991: { items: 5 }
      }
    });
  }


  function sectionAjaxLoading($selector) {

    let classFind = $(`.${$selector}`);
    let idFind = $(`#${$selector}`);
    let findSelector = classFind?.length > 0 ? classFind : idFind;
    let carouselSelector = classFind?.length > 0 ? `.${$selector}` : `#${$selector}`;
    if (findSelector?.length > 0) {
      axios.post(`/ajax/section/data`, { section: $selector }, { withCredentials: true })
        .then(response => {
          const htmlData = response.data.html;
          if (htmlData) {
            findSelector.html(htmlData);
            carousel_slider(carouselSelector);
          }
        });
    }
  }

  sectionAjaxLoading('just_ordered');
  sectionAjaxLoading('new_arrived_section');
  sectionAjaxLoading('recent_view_section');
  sectionAjaxLoading('someone_loved');
  sectionAjaxLoading('someone_buying');



  var relatedProducts = $("#related_products");
  if (relatedProducts?.length > 0) {
    let ItemId = relatedProducts.attr('data-product-id');
    let CategoryId = relatedProducts.attr('data-category-id');
    axios.post(`/ajax/section/related`, { ItemId: ItemId, CategoryId: CategoryId })
      .then(response => {
        const htmlData = response.data.html;
        if (htmlData) {
          relatedProducts.html(htmlData);
          carousel_slider("#related_products");
        }
      });
  }




})(jQuery)