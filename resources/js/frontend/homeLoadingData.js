import { tns } from "tiny-slider";
(function ($) {


  function tnsCarousel($carousel) {
    tns({
      container: $carousel,
      items: 7,
      slideBy: 1,
      controls: true,
      autoplay: false,
      arrowKeys: false,
      nav: false,
      rewind: true,
      lazyload: true,
      lazyloadSelector: '.rounded',
      controlsText: ['<i class="icon-left-open"></i>', '<i class="icon-right-open"></i>'],
      responsive: {
        0: { items: 3 },
        380: { items: 4 },
        991: { items: 6 },
        1199: { items: 7 }
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
      items: 5,
      slideBy: 1,
      controls: true,
      autoplay: false,
      arrowKeys: false,
      nav: false,
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
      axios.post(`/ajax/section/data`, { section: $selector })
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




})(jQuery)