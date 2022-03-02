(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/product"],{

/***/ "./resources/assets/plugins/elevatezoom/js/jquery.elevatezoom.js":
/*!***********************************************************************!*\
  !*** ./resources/assets/plugins/elevatezoom/js/jquery.elevatezoom.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
 *	jQuery elevateZoom 3.0.8
 *	Demo's and documentation:
 *	www.elevateweb.co.uk/image-zoom
 *
 *	Copyright (c) 2012 Andrew Eades
 *	www.elevateweb.co.uk
 *
 *	Dual licensed under the GPL and MIT licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 *

/*
 *	jQuery elevateZoom 3.0.3
 *	Demo's and documentation:
 *	www.elevateweb.co.uk/image-zoom
 *
 *	Copyright (c) 2012 Andrew Eades
 *	www.elevateweb.co.uk
 *
 *	Dual licensed under the GPL and MIT licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 */
if (typeof Object.create !== 'function') {
  Object.create = function (obj) {
    function F() {}

    ;
    F.prototype = obj;
    return new F();
  };
}

(function ($, window, document, undefined) {
  var ElevateZoom = {
    init: function init(options, elem) {
      var self = this;
      self.elem = elem;
      self.$elem = $(elem);
      self.imageSrc = self.$elem.data("zoom-image") ? self.$elem.data("zoom-image") : self.$elem.attr("src");
      self.options = $.extend({}, $.fn.elevateZoom.options, options); //TINT OVERRIDE SETTINGS

      if (self.options.tint) {
        self.options.lensColour = "none", //colour of the lens background
        self.options.lensOpacity = "1"; //opacity of the lens
      } //INNER OVERRIDE SETTINGS


      if (self.options.zoomType == "inner") {
        self.options.showLens = false;
      } //Remove alt on hover


      self.$elem.parent().removeAttr('title').removeAttr('alt');
      self.zoomImage = self.imageSrc;
      self.refresh(1); //Create the image swap from the gallery

      $('#' + self.options.gallery + ' a').click(function (e) {
        //Set a class on the currently active gallery image
        if (self.options.galleryActiveClass) {
          $('#' + self.options.gallery + ' a').removeClass(self.options.galleryActiveClass);
          $(this).addClass(self.options.galleryActiveClass);
        } //stop any link on the a tag from working


        e.preventDefault(); //call the swap image function

        if ($(this).data("zoom-image")) {
          self.zoomImagePre = $(this).data("zoom-image");
        } else {
          self.zoomImagePre = $(this).data("image");
        }

        self.swaptheimage($(this).data("image"), self.zoomImagePre);
        return false;
      });
    },
    refresh: function refresh(length) {
      var self = this;
      setTimeout(function () {
        self.fetch(self.imageSrc);
      }, length || self.options.refresh);
    },
    fetch: function fetch(imgsrc) {
      //get the image
      var self = this;
      var newImg = new Image();

      newImg.onload = function () {
        //set the large image dimensions - used to calculte ratio's
        self.largeWidth = newImg.width;
        self.largeHeight = newImg.height; //once image is loaded start the calls

        self.startZoom();
        self.currentImage = self.imageSrc; //let caller know image has been loaded

        self.options.onZoomedImageLoaded(self.$elem);
      };

      newImg.src = imgsrc; // this must be done AFTER setting onload

      return;
    },
    startZoom: function startZoom() {
      var self = this; //get dimensions of the non zoomed image

      self.nzWidth = self.$elem.width();
      self.nzHeight = self.$elem.height(); //activated elements

      self.isWindowActive = false;
      self.isLensActive = false;
      self.isTintActive = false;
      self.overWindow = false; //CrossFade Wrappe

      if (self.options.imageCrossfade) {
        self.zoomWrap = self.$elem.wrap('<div style="height:' + self.nzHeight + 'px;width:' + self.nzWidth + 'px;" class="zoomWrapper" />');
        self.$elem.css('position', 'absolute');
      }

      self.zoomLock = 1;
      self.scrollingLock = false;
      self.changeBgSize = false;
      self.currentZoomLevel = self.options.zoomLevel; //get offset of the non zoomed image

      self.nzOffset = self.$elem.offset(); //calculate the width ratio of the large/small image

      self.widthRatio = self.largeWidth / self.currentZoomLevel / self.nzWidth;
      self.heightRatio = self.largeHeight / self.currentZoomLevel / self.nzHeight; //if window zoom

      if (self.options.zoomType == "window") {
        self.zoomWindowStyle = "overflow: hidden;" + "background-position: 0px 0px;text-align:center;" + "background-color: " + String(self.options.zoomWindowBgColour) + ";width: " + String(self.options.zoomWindowWidth) + "px;" + "height: " + String(self.options.zoomWindowHeight) + "px;float: left;" + "background-size: " + self.largeWidth / self.currentZoomLevel + "px " + self.largeHeight / self.currentZoomLevel + "px;" + "display: none;z-index:100;" + "border: " + String(self.options.borderSize) + "px solid " + self.options.borderColour + ";background-repeat: no-repeat;" + "position: absolute;";
      } //if inner  zoom


      if (self.options.zoomType == "inner") {
        //has a border been put on the image? Lets cater for this
        var borderWidth = self.$elem.css("border-left-width");
        self.zoomWindowStyle = "overflow: hidden;" + "margin-left: " + String(borderWidth) + ";" + "margin-top: " + String(borderWidth) + ";" + "background-position: 0px 0px;" + "width: " + String(self.nzWidth) + "px;" + "height: " + String(self.nzHeight) + "px;" + "px;float: left;" + "display: none;" + "cursor:" + self.options.cursor + ";" + "px solid " + self.options.borderColour + ";background-repeat: no-repeat;" + "position: absolute;";
      } //lens style for window zoom


      if (self.options.zoomType == "window") {
        // adjust images less than the window height
        if (self.nzHeight < self.options.zoomWindowWidth / self.widthRatio) {
          lensHeight = self.nzHeight;
        } else {
          lensHeight = String(self.options.zoomWindowHeight / self.heightRatio);
        }

        if (self.largeWidth < self.options.zoomWindowWidth) {
          lensWidth = self.nzWidth;
        } else {
          lensWidth = self.options.zoomWindowWidth / self.widthRatio;
        }

        self.lensStyle = "background-position: 0px 0px;width: " + String(self.options.zoomWindowWidth / self.widthRatio) + "px;height: " + String(self.options.zoomWindowHeight / self.heightRatio) + "px;float: right;display: none;" + "overflow: hidden;" + "z-index: 999;" + "-webkit-transform: translateZ(0);" + "opacity:" + self.options.lensOpacity + ";filter: alpha(opacity = " + self.options.lensOpacity * 100 + "); zoom:1;" + "width:" + lensWidth + "px;" + "height:" + lensHeight + "px;" + "background-color:" + self.options.lensColour + ";" + "cursor:" + self.options.cursor + ";" + "border: " + self.options.lensBorderSize + "px" + " solid " + self.options.lensBorderColour + ";background-repeat: no-repeat;position: absolute;";
      } //tint style


      self.tintStyle = "display: block;" + "position: absolute;" + "background-color: " + self.options.tintColour + ";" + "filter:alpha(opacity=0);" + "opacity: 0;" + "width: " + self.nzWidth + "px;" + "height: " + self.nzHeight + "px;"; //lens style for lens zoom with optional round for modern browsers

      self.lensRound = '';

      if (self.options.zoomType == "lens") {
        self.lensStyle = "background-position: 0px 0px;" + "float: left;display: none;" + "border: " + String(self.options.borderSize) + "px solid " + self.options.borderColour + ";" + "width:" + String(self.options.lensSize) + "px;" + "height:" + String(self.options.lensSize) + "px;" + "background-repeat: no-repeat;position: absolute;";
      } //does not round in all browsers


      if (self.options.lensShape == "round") {
        self.lensRound = "border-top-left-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;" + "border-top-right-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;" + "border-bottom-left-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;" + "border-bottom-right-radius: " + String(self.options.lensSize / 2 + self.options.borderSize) + "px;";
      } //create the div's                                                + ""
      //self.zoomContainer = $('<div/>').addClass('zoomContainer').css({"position":"relative", "height":self.nzHeight, "width":self.nzWidth});


      self.zoomContainer = $('<div class="zoomContainer" style="-webkit-transform: translateZ(0);position:absolute;left:' + self.nzOffset.left + 'px;top:' + self.nzOffset.top + 'px;height:' + self.nzHeight + 'px;width:' + self.nzWidth + 'px;"></div>');
      $('body').append(self.zoomContainer); //this will add overflow hidden and contrain the lens on lens mode

      if (self.options.containLensZoom && self.options.zoomType == "lens") {
        self.zoomContainer.css("overflow", "hidden");
      }

      if (self.options.zoomType != "inner") {
        self.zoomLens = $("<div class='zoomLens' style='" + self.lensStyle + self.lensRound + "'>&nbsp;</div>").appendTo(self.zoomContainer).click(function () {
          self.$elem.trigger('click');
        });

        if (self.options.tint) {
          self.tintContainer = $('<div/>').addClass('tintContainer');
          self.zoomTint = $("<div class='zoomTint' style='" + self.tintStyle + "'></div>");
          self.zoomLens.wrap(self.tintContainer);
          self.zoomTintcss = self.zoomLens.after(self.zoomTint); //if tint enabled - set an image to show over the tint

          self.zoomTintImage = $('<img style="position: absolute; left: 0px; top: 0px; max-width: none; width: ' + self.nzWidth + 'px; height: ' + self.nzHeight + 'px;" src="' + self.imageSrc + '">').appendTo(self.zoomLens).click(function () {
            self.$elem.trigger('click');
          });
        }
      } //create zoom window


      if (isNaN(self.options.zoomWindowPosition)) {
        self.zoomWindow = $("<div style='z-index:999;left:" + self.windowOffsetLeft + "px;top:" + self.windowOffsetTop + "px;" + self.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>").appendTo('body').click(function () {
          self.$elem.trigger('click');
        });
      } else {
        self.zoomWindow = $("<div style='z-index:999;left:" + self.windowOffsetLeft + "px;top:" + self.windowOffsetTop + "px;" + self.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>").appendTo(self.zoomContainer).click(function () {
          self.$elem.trigger('click');
        });
      }

      self.zoomWindowContainer = $('<div/>').addClass('zoomWindowContainer').css("width", self.options.zoomWindowWidth);
      self.zoomWindow.wrap(self.zoomWindowContainer); //  self.captionStyle = "text-align: left;background-color: black;color: white;font-weight: bold;padding: 10px;font-family: sans-serif;font-size: 11px";
      // self.zoomCaption = $('<div class="elevatezoom-caption" style="'+self.captionStyle+'display: block; width: 280px;">INSERT ALT TAG</div>').appendTo(self.zoomWindow.parent());

      if (self.options.zoomType == "lens") {
        self.zoomLens.css({
          backgroundImage: "url('" + self.imageSrc + "')"
        });
      }

      if (self.options.zoomType == "window") {
        self.zoomWindow.css({
          backgroundImage: "url('" + self.imageSrc + "')"
        });
      }

      if (self.options.zoomType == "inner") {
        self.zoomWindow.css({
          backgroundImage: "url('" + self.imageSrc + "')"
        });
      }
      /*-------------------END THE ZOOM WINDOW AND LENS----------------------------------*/
      //touch events


      self.$elem.bind('touchmove', function (e) {
        e.preventDefault();
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        self.setPosition(touch);
      });
      self.zoomContainer.bind('touchmove', function (e) {
        if (self.options.zoomType == "inner") {
          self.showHideWindow("show");
        }

        e.preventDefault();
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        self.setPosition(touch);
      });
      self.zoomContainer.bind('touchend', function (e) {
        self.showHideWindow("hide");

        if (self.options.showLens) {
          self.showHideLens("hide");
        }

        if (self.options.tint && self.options.zoomType != "inner") {
          self.showHideTint("hide");
        }
      });
      self.$elem.bind('touchend', function (e) {
        self.showHideWindow("hide");

        if (self.options.showLens) {
          self.showHideLens("hide");
        }

        if (self.options.tint && self.options.zoomType != "inner") {
          self.showHideTint("hide");
        }
      });

      if (self.options.showLens) {
        self.zoomLens.bind('touchmove', function (e) {
          e.preventDefault();
          var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
          self.setPosition(touch);
        });
        self.zoomLens.bind('touchend', function (e) {
          self.showHideWindow("hide");

          if (self.options.showLens) {
            self.showHideLens("hide");
          }

          if (self.options.tint && self.options.zoomType != "inner") {
            self.showHideTint("hide");
          }
        });
      } //Needed to work in IE


      self.$elem.bind('mousemove', function (e) {
        if (self.overWindow == false) {
          self.setElements("show");
        } //make sure on orientation change the setposition is not fired


        if (self.lastX !== e.clientX || self.lastY !== e.clientY) {
          self.setPosition(e);
          self.currentLoc = e;
        }

        self.lastX = e.clientX;
        self.lastY = e.clientY;
      });
      self.zoomContainer.bind('mousemove', function (e) {
        if (self.overWindow == false) {
          self.setElements("show");
        } //make sure on orientation change the setposition is not fired


        if (self.lastX !== e.clientX || self.lastY !== e.clientY) {
          self.setPosition(e);
          self.currentLoc = e;
        }

        self.lastX = e.clientX;
        self.lastY = e.clientY;
      });

      if (self.options.zoomType != "inner") {
        self.zoomLens.bind('mousemove', function (e) {
          //make sure on orientation change the setposition is not fired
          if (self.lastX !== e.clientX || self.lastY !== e.clientY) {
            self.setPosition(e);
            self.currentLoc = e;
          }

          self.lastX = e.clientX;
          self.lastY = e.clientY;
        });
      }

      if (self.options.tint && self.options.zoomType != "inner") {
        self.zoomTint.bind('mousemove', function (e) {
          //make sure on orientation change the setposition is not fired
          if (self.lastX !== e.clientX || self.lastY !== e.clientY) {
            self.setPosition(e);
            self.currentLoc = e;
          }

          self.lastX = e.clientX;
          self.lastY = e.clientY;
        });
      }

      if (self.options.zoomType == "inner") {
        self.zoomWindow.bind('mousemove', function (e) {
          //self.overWindow = true;
          //make sure on orientation change the setposition is not fired
          if (self.lastX !== e.clientX || self.lastY !== e.clientY) {
            self.setPosition(e);
            self.currentLoc = e;
          }

          self.lastX = e.clientX;
          self.lastY = e.clientY;
        });
      } //  lensFadeOut: 500,  zoomTintFadeIn


      self.zoomContainer.add(self.$elem).mouseenter(function () {
        if (self.overWindow == false) {
          self.setElements("show");
        }
      }).mouseleave(function () {
        if (!self.scrollLock) {
          self.setElements("hide");
          self.options.onDestroy(self.$elem);
        }
      }); //end ove image

      if (self.options.zoomType != "inner") {
        self.zoomWindow.mouseenter(function () {
          self.overWindow = true;
          self.setElements("hide");
        }).mouseleave(function () {
          self.overWindow = false;
        });
      } //end ove image
      //				var delta = parseInt(e.originalEvent.wheelDelta || -e.originalEvent.detail);
      //      $(this).empty();
      //    return false;
      //fix for initial zoom setting


      if (self.options.zoomLevel != 1) {//	self.changeZoomLevel(self.currentZoomLevel);
      } //set the min zoomlevel


      if (self.options.minZoomLevel) {
        self.minZoomLevel = self.options.minZoomLevel;
      } else {
        self.minZoomLevel = self.options.scrollZoomIncrement * 2;
      }

      if (self.options.scrollZoom) {
        self.zoomContainer.add(self.$elem).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function (e) {
          //						in IE there is issue with firing of mouseleave - So check whether still scrolling
          //						and on mouseleave check if scrolllock
          self.scrollLock = true;
          clearTimeout($.data(this, 'timer'));
          $.data(this, 'timer', setTimeout(function () {
            self.scrollLock = false; //do something
          }, 250));
          var theEvent = e.originalEvent.wheelDelta || e.originalEvent.detail * -1; //this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
          //   e.preventDefault();

          e.stopImmediatePropagation();
          e.stopPropagation();
          e.preventDefault();

          if (theEvent / 120 > 0) {
            //scrolling up
            if (self.currentZoomLevel >= self.minZoomLevel) {
              self.changeZoomLevel(self.currentZoomLevel - self.options.scrollZoomIncrement);
            }
          } else {
            //scrolling down
            if (self.options.maxZoomLevel) {
              if (self.currentZoomLevel <= self.options.maxZoomLevel) {
                self.changeZoomLevel(parseFloat(self.currentZoomLevel) + self.options.scrollZoomIncrement);
              }
            } else {
              //andy
              self.changeZoomLevel(parseFloat(self.currentZoomLevel) + self.options.scrollZoomIncrement);
            }
          }

          return false;
        });
      }
    },
    setElements: function setElements(type) {
      var self = this;

      if (!self.options.zoomEnabled) {
        return false;
      }

      if (type == "show") {
        if (self.isWindowSet) {
          if (self.options.zoomType == "inner") {
            self.showHideWindow("show");
          }

          if (self.options.zoomType == "window") {
            self.showHideWindow("show");
          }

          if (self.options.showLens) {
            self.showHideLens("show");
          }

          if (self.options.tint && self.options.zoomType != "inner") {
            self.showHideTint("show");
          }
        }
      }

      if (type == "hide") {
        if (self.options.zoomType == "window") {
          self.showHideWindow("hide");
        }

        if (!self.options.tint) {
          self.showHideWindow("hide");
        }

        if (self.options.showLens) {
          self.showHideLens("hide");
        }

        if (self.options.tint) {
          self.showHideTint("hide");
        }
      }
    },
    setPosition: function setPosition(e) {
      var self = this;

      if (!self.options.zoomEnabled) {
        return false;
      } //recaclc offset each time in case the image moves
      //this can be caused by other on page elements


      self.nzHeight = self.$elem.height();
      self.nzWidth = self.$elem.width();
      self.nzOffset = self.$elem.offset();

      if (self.options.tint && self.options.zoomType != "inner") {
        self.zoomTint.css({
          top: 0
        });
        self.zoomTint.css({
          left: 0
        });
      } //set responsive
      //will checking if the image needs changing before running this code work faster?


      if (self.options.responsive && !self.options.scrollZoom) {
        if (self.options.showLens) {
          if (self.nzHeight < self.options.zoomWindowWidth / self.widthRatio) {
            lensHeight = self.nzHeight;
          } else {
            lensHeight = String(self.options.zoomWindowHeight / self.heightRatio);
          }

          if (self.largeWidth < self.options.zoomWindowWidth) {
            lensWidth = self.nzWidth;
          } else {
            lensWidth = self.options.zoomWindowWidth / self.widthRatio;
          }

          self.widthRatio = self.largeWidth / self.nzWidth;
          self.heightRatio = self.largeHeight / self.nzHeight;

          if (self.options.zoomType != "lens") {
            //possibly dont need to keep recalcalculating
            //if the lens is heigher than the image, then set lens size to image size
            if (self.nzHeight < self.options.zoomWindowWidth / self.widthRatio) {
              lensHeight = self.nzHeight;
            } else {
              lensHeight = String(self.options.zoomWindowHeight / self.heightRatio);
            }

            if (self.nzWidth < self.options.zoomWindowHeight / self.heightRatio) {
              lensWidth = self.nzWidth;
            } else {
              lensWidth = String(self.options.zoomWindowWidth / self.widthRatio);
            }

            self.zoomLens.css('width', lensWidth);
            self.zoomLens.css('height', lensHeight);

            if (self.options.tint) {
              self.zoomTintImage.css('width', self.nzWidth);
              self.zoomTintImage.css('height', self.nzHeight);
            }
          }

          if (self.options.zoomType == "lens") {
            self.zoomLens.css({
              width: String(self.options.lensSize) + 'px',
              height: String(self.options.lensSize) + 'px'
            });
          } //end responsive image change

        }
      } //container fix


      self.zoomContainer.css({
        top: self.nzOffset.top
      });
      self.zoomContainer.css({
        left: self.nzOffset.left
      });
      self.mouseLeft = parseInt(e.pageX - self.nzOffset.left);
      self.mouseTop = parseInt(e.pageY - self.nzOffset.top); //calculate the Location of the Lens
      //calculate the bound regions - but only if zoom window

      if (self.options.zoomType == "window") {
        self.Etoppos = self.mouseTop < self.zoomLens.height() / 2;
        self.Eboppos = self.mouseTop > self.nzHeight - self.zoomLens.height() / 2 - self.options.lensBorderSize * 2;
        self.Eloppos = self.mouseLeft < 0 + self.zoomLens.width() / 2;
        self.Eroppos = self.mouseLeft > self.nzWidth - self.zoomLens.width() / 2 - self.options.lensBorderSize * 2;
      } //calculate the bound regions - but only for inner zoom


      if (self.options.zoomType == "inner") {
        self.Etoppos = self.mouseTop < self.nzHeight / 2 / self.heightRatio;
        self.Eboppos = self.mouseTop > self.nzHeight - self.nzHeight / 2 / self.heightRatio;
        self.Eloppos = self.mouseLeft < 0 + self.nzWidth / 2 / self.widthRatio;
        self.Eroppos = self.mouseLeft > self.nzWidth - self.nzWidth / 2 / self.widthRatio - self.options.lensBorderSize * 2;
      } // if the mouse position of the slider is one of the outerbounds, then hide  window and lens


      if (self.mouseLeft < 0 || self.mouseTop < 0 || self.mouseLeft > self.nzWidth || self.mouseTop > self.nzHeight) {
        self.setElements("hide");
        return;
      } //else continue with operations
      else {
        //lens options
        if (self.options.showLens) {
          //		self.showHideLens("show");
          //set background position of lens
          self.lensLeftPos = String(Math.floor(self.mouseLeft - self.zoomLens.width() / 2));
          self.lensTopPos = String(Math.floor(self.mouseTop - self.zoomLens.height() / 2));
        } //adjust the background position if the mouse is in one of the outer regions
        //Top region


        if (self.Etoppos) {
          self.lensTopPos = 0;
        } //Left Region


        if (self.Eloppos) {
          self.windowLeftPos = 0;
          self.lensLeftPos = 0;
          self.tintpos = 0;
        } //Set bottom and right region for window mode


        if (self.options.zoomType == "window") {
          if (self.Eboppos) {
            self.lensTopPos = Math.max(self.nzHeight - self.zoomLens.height() - self.options.lensBorderSize * 2, 0);
          }

          if (self.Eroppos) {
            self.lensLeftPos = self.nzWidth - self.zoomLens.width() - self.options.lensBorderSize * 2;
          }
        } //Set bottom and right region for inner mode


        if (self.options.zoomType == "inner") {
          if (self.Eboppos) {
            self.lensTopPos = Math.max(self.nzHeight - self.options.lensBorderSize * 2, 0);
          }

          if (self.Eroppos) {
            self.lensLeftPos = self.nzWidth - self.nzWidth - self.options.lensBorderSize * 2;
          }
        } //if lens zoom


        if (self.options.zoomType == "lens") {
          self.windowLeftPos = String(((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomLens.width() / 2) * -1);
          self.windowTopPos = String(((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomLens.height() / 2) * -1);
          self.zoomLens.css({
            backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px'
          });

          if (self.changeBgSize) {
            if (self.nzHeight > self.nzWidth) {
              if (self.options.zoomType == "lens") {
                self.zoomLens.css({
                  "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px'
                });
              }

              self.zoomWindow.css({
                "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px'
              });
            } else {
              if (self.options.zoomType == "lens") {
                self.zoomLens.css({
                  "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvaluewidth + 'px'
                });
              }

              self.zoomWindow.css({
                "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvaluewidth + 'px'
              });
            }

            self.changeBgSize = false;
          }

          self.setWindowPostition(e);
        } //if tint zoom


        if (self.options.tint && self.options.zoomType != "inner") {
          self.setTintPosition(e);
        } //set the css background position


        if (self.options.zoomType == "window") {
          self.setWindowPostition(e);
        }

        if (self.options.zoomType == "inner") {
          self.setWindowPostition(e);
        }

        if (self.options.showLens) {
          if (self.fullwidth && self.options.zoomType != "lens") {
            self.lensLeftPos = 0;
          }

          self.zoomLens.css({
            left: self.lensLeftPos + 'px',
            top: self.lensTopPos + 'px'
          });
        }
      } //end else

    },
    showHideWindow: function showHideWindow(change) {
      var self = this;

      if (change == "show") {
        if (!self.isWindowActive) {
          if (self.options.zoomWindowFadeIn) {
            self.zoomWindow.stop(true, true, false).fadeIn(self.options.zoomWindowFadeIn);
          } else {
            self.zoomWindow.show();
          }

          self.isWindowActive = true;
        }
      }

      if (change == "hide") {
        if (self.isWindowActive) {
          if (self.options.zoomWindowFadeOut) {
            self.zoomWindow.stop(true, true).fadeOut(self.options.zoomWindowFadeOut, function () {
              if (self.loop) {
                //stop moving the zoom window when zoom window is faded out
                clearInterval(self.loop);
                self.loop = false;
              }
            });
          } else {
            self.zoomWindow.hide();
          }

          self.isWindowActive = false;
        }
      }
    },
    showHideLens: function showHideLens(change) {
      var self = this;

      if (change == "show") {
        if (!self.isLensActive) {
          if (self.options.lensFadeIn) {
            self.zoomLens.stop(true, true, false).fadeIn(self.options.lensFadeIn);
          } else {
            self.zoomLens.show();
          }

          self.isLensActive = true;
        }
      }

      if (change == "hide") {
        if (self.isLensActive) {
          if (self.options.lensFadeOut) {
            self.zoomLens.stop(true, true).fadeOut(self.options.lensFadeOut);
          } else {
            self.zoomLens.hide();
          }

          self.isLensActive = false;
        }
      }
    },
    showHideTint: function showHideTint(change) {
      var self = this;

      if (change == "show") {
        if (!self.isTintActive) {
          if (self.options.zoomTintFadeIn) {
            self.zoomTint.css({
              opacity: self.options.tintOpacity
            }).animate().stop(true, true).fadeIn("slow");
          } else {
            self.zoomTint.css({
              opacity: self.options.tintOpacity
            }).animate();
            self.zoomTint.show();
          }

          self.isTintActive = true;
        }
      }

      if (change == "hide") {
        if (self.isTintActive) {
          if (self.options.zoomTintFadeOut) {
            self.zoomTint.stop(true, true).fadeOut(self.options.zoomTintFadeOut);
          } else {
            self.zoomTint.hide();
          }

          self.isTintActive = false;
        }
      }
    },
    setLensPostition: function setLensPostition(e) {},
    setWindowPostition: function setWindowPostition(e) {
      //return obj.slice( 0, count );
      var self = this;

      if (!isNaN(self.options.zoomWindowPosition)) {
        switch (self.options.zoomWindowPosition) {
          case 1:
            //done
            self.windowOffsetTop = self.options.zoomWindowOffety; //DONE - 1

            self.windowOffsetLeft = +self.nzWidth; //DONE 1, 2, 3, 4, 16

            break;

          case 2:
            if (self.options.zoomWindowHeight > self.nzHeight) {
              //positive margin
              self.windowOffsetTop = (self.options.zoomWindowHeight / 2 - self.nzHeight / 2) * -1;
              self.windowOffsetLeft = self.nzWidth; //DONE 1, 2, 3, 4, 16
            } else {//negative margin
            }

            break;

          case 3:
            //done
            self.windowOffsetTop = self.nzHeight - self.zoomWindow.height() - self.options.borderSize * 2; //DONE 3,9

            self.windowOffsetLeft = self.nzWidth; //DONE 1, 2, 3, 4, 16

            break;

          case 4:
            //done
            self.windowOffsetTop = self.nzHeight; //DONE - 4,5,6,7,8

            self.windowOffsetLeft = self.nzWidth; //DONE 1, 2, 3, 4, 16

            break;

          case 5:
            //done
            self.windowOffsetTop = self.nzHeight; //DONE - 4,5,6,7,8

            self.windowOffsetLeft = self.nzWidth - self.zoomWindow.width() - self.options.borderSize * 2; //DONE - 5,15

            break;

          case 6:
            if (self.options.zoomWindowHeight > self.nzHeight) {
              //positive margin
              self.windowOffsetTop = self.nzHeight; //DONE - 4,5,6,7,8

              self.windowOffsetLeft = (self.options.zoomWindowWidth / 2 - self.nzWidth / 2 + self.options.borderSize * 2) * -1;
            } else {//negative margin
            }

            break;

          case 7:
            //done
            self.windowOffsetTop = self.nzHeight; //DONE - 4,5,6,7,8

            self.windowOffsetLeft = 0; //DONE 7, 13

            break;

          case 8:
            //done
            self.windowOffsetTop = self.nzHeight; //DONE - 4,5,6,7,8

            self.windowOffsetLeft = (self.zoomWindow.width() + self.options.borderSize * 2) * -1; //DONE 8,9,10,11,12

            break;

          case 9:
            //done
            self.windowOffsetTop = self.nzHeight - self.zoomWindow.height() - self.options.borderSize * 2; //DONE 3,9

            self.windowOffsetLeft = (self.zoomWindow.width() + self.options.borderSize * 2) * -1; //DONE 8,9,10,11,12

            break;

          case 10:
            if (self.options.zoomWindowHeight > self.nzHeight) {
              //positive margin
              self.windowOffsetTop = (self.options.zoomWindowHeight / 2 - self.nzHeight / 2) * -1;
              self.windowOffsetLeft = (self.zoomWindow.width() + self.options.borderSize * 2) * -1; //DONE 8,9,10,11,12
            } else {//negative margin
            }

            break;

          case 11:
            self.windowOffsetTop = self.options.zoomWindowOffety;
            self.windowOffsetLeft = (self.zoomWindow.width() + self.options.borderSize * 2) * -1; //DONE 8,9,10,11,12

            break;

          case 12:
            //done
            self.windowOffsetTop = (self.zoomWindow.height() + self.options.borderSize * 2) * -1; //DONE 12,13,14,15,16

            self.windowOffsetLeft = (self.zoomWindow.width() + self.options.borderSize * 2) * -1; //DONE 8,9,10,11,12

            break;

          case 13:
            //done
            self.windowOffsetTop = (self.zoomWindow.height() + self.options.borderSize * 2) * -1; //DONE 12,13,14,15,16

            self.windowOffsetLeft = 0; //DONE 7, 13

            break;

          case 14:
            if (self.options.zoomWindowHeight > self.nzHeight) {
              //positive margin
              self.windowOffsetTop = (self.zoomWindow.height() + self.options.borderSize * 2) * -1; //DONE 12,13,14,15,16

              self.windowOffsetLeft = (self.options.zoomWindowWidth / 2 - self.nzWidth / 2 + self.options.borderSize * 2) * -1;
            } else {//negative margin
            }

            break;

          case 15:
            //done
            self.windowOffsetTop = (self.zoomWindow.height() + self.options.borderSize * 2) * -1; //DONE 12,13,14,15,16

            self.windowOffsetLeft = self.nzWidth - self.zoomWindow.width() - self.options.borderSize * 2; //DONE - 5,15

            break;

          case 16:
            //done
            self.windowOffsetTop = (self.zoomWindow.height() + self.options.borderSize * 2) * -1; //DONE 12,13,14,15,16

            self.windowOffsetLeft = self.nzWidth; //DONE 1, 2, 3, 4, 16

            break;

          default:
            //done
            self.windowOffsetTop = self.options.zoomWindowOffety; //DONE - 1

            self.windowOffsetLeft = self.nzWidth;
          //DONE 1, 2, 3, 4, 16
        }
      } //end isNAN
      else {
        //WE CAN POSITION IN A CLASS - ASSUME THAT ANY STRING PASSED IS
        self.externalContainer = $('#' + self.options.zoomWindowPosition);
        self.externalContainerWidth = self.externalContainer.width();
        self.externalContainerHeight = self.externalContainer.height();
        self.externalContainerOffset = self.externalContainer.offset();
        self.windowOffsetTop = self.externalContainerOffset.top; //DONE - 1

        self.windowOffsetLeft = self.externalContainerOffset.left; //DONE 1, 2, 3, 4, 16
      }

      self.isWindowSet = true;
      self.windowOffsetTop = self.windowOffsetTop + self.options.zoomWindowOffety;
      self.windowOffsetLeft = self.windowOffsetLeft + self.options.zoomWindowOffetx;
      self.zoomWindow.css({
        top: self.windowOffsetTop
      });
      self.zoomWindow.css({
        left: self.windowOffsetLeft
      });

      if (self.options.zoomType == "inner") {
        self.zoomWindow.css({
          top: 0
        });
        self.zoomWindow.css({
          left: 0
        });
      }

      self.windowLeftPos = String(((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomWindow.width() / 2) * -1);
      self.windowTopPos = String(((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomWindow.height() / 2) * -1);

      if (self.Etoppos) {
        self.windowTopPos = 0;
      }

      if (self.Eloppos) {
        self.windowLeftPos = 0;
      }

      if (self.Eboppos) {
        self.windowTopPos = (self.largeHeight / self.currentZoomLevel - self.zoomWindow.height()) * -1;
      }

      if (self.Eroppos) {
        self.windowLeftPos = (self.largeWidth / self.currentZoomLevel - self.zoomWindow.width()) * -1;
      } //stops micro movements


      if (self.fullheight) {
        self.windowTopPos = 0;
      }

      if (self.fullwidth) {
        self.windowLeftPos = 0;
      } //set the css background position


      if (self.options.zoomType == "window" || self.options.zoomType == "inner") {
        if (self.zoomLock == 1) {
          //overrides for images not zoomable
          if (self.widthRatio <= 1) {
            self.windowLeftPos = 0;
          }

          if (self.heightRatio <= 1) {
            self.windowTopPos = 0;
          }
        } // adjust images less than the window height


        if (self.options.zoomType == "window") {
          if (self.largeHeight < self.options.zoomWindowHeight) {
            self.windowTopPos = 0;
          }

          if (self.largeWidth < self.options.zoomWindowWidth) {
            self.windowLeftPos = 0;
          }
        } //set the zoomwindow background position


        if (self.options.easing) {
          //     if(self.changeZoom){
          //           clearInterval(self.loop);
          //           self.changeZoom = false;
          //           self.loop = false;
          //            }
          //set the pos to 0 if not set
          if (!self.xp) {
            self.xp = 0;
          }

          if (!self.yp) {
            self.yp = 0;
          } //if loop not already started, then run it


          if (!self.loop) {
            self.loop = setInterval(function () {
              //using zeno's paradox
              self.xp += (self.windowLeftPos - self.xp) / self.options.easingAmount;
              self.yp += (self.windowTopPos - self.yp) / self.options.easingAmount;

              if (self.scrollingLock) {
                clearInterval(self.loop);
                self.xp = self.windowLeftPos;
                self.yp = self.windowTopPos;
                self.xp = ((e.pageX - self.nzOffset.left) * self.widthRatio - self.zoomWindow.width() / 2) * -1;
                self.yp = ((e.pageY - self.nzOffset.top) * self.heightRatio - self.zoomWindow.height() / 2) * -1;

                if (self.changeBgSize) {
                  if (self.nzHeight > self.nzWidth) {
                    if (self.options.zoomType == "lens") {
                      self.zoomLens.css({
                        "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px'
                      });
                    }

                    self.zoomWindow.css({
                      "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px'
                    });
                  } else {
                    if (self.options.zoomType == "lens") {
                      self.zoomLens.css({
                        "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvalueheight + 'px'
                      });
                    }

                    self.zoomWindow.css({
                      "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvaluewidth + 'px'
                    });
                  }
                  /*
                     if(!self.bgxp){self.bgxp = self.largeWidth/self.newvalue;}
                  if(!self.bgyp){self.bgyp = self.largeHeight/self.newvalue ;}
                         if (!self.bgloop){
                         	self.bgloop = setInterval(function(){
                          self.bgxp += (self.largeWidth/self.newvalue  - self.bgxp) / self.options.easingAmount;
                  self.bgyp += (self.largeHeight/self.newvalue  - self.bgyp) / self.options.easingAmount;
                    self.zoomWindow.css({ "background-size": self.bgxp + 'px ' + self.bgyp + 'px' });
                            }, 16);
                          }
                   */


                  self.changeBgSize = false;
                }

                self.zoomWindow.css({
                  backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px'
                });
                self.scrollingLock = false;
                self.loop = false;
              } else if (Math.round(Math.abs(self.xp - self.windowLeftPos) + Math.abs(self.yp - self.windowTopPos)) < 1) {
                //stops micro movements
                clearInterval(self.loop);
                self.zoomWindow.css({
                  backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px'
                });
                self.loop = false;
              } else {
                if (self.changeBgSize) {
                  if (self.nzHeight > self.nzWidth) {
                    if (self.options.zoomType == "lens") {
                      self.zoomLens.css({
                        "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px'
                      });
                    }

                    self.zoomWindow.css({
                      "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px'
                    });
                  } else {
                    if (self.options.zoomType != "lens") {
                      self.zoomLens.css({
                        "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvaluewidth + 'px'
                      });
                    }

                    self.zoomWindow.css({
                      "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvaluewidth + 'px'
                    });
                  }

                  self.changeBgSize = false;
                }

                self.zoomWindow.css({
                  backgroundPosition: self.xp + 'px ' + self.yp + 'px'
                });
              }
            }, 16);
          }
        } else {
          if (self.changeBgSize) {
            if (self.nzHeight > self.nzWidth) {
              if (self.options.zoomType == "lens") {
                self.zoomLens.css({
                  "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px'
                });
              }

              self.zoomWindow.css({
                "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px'
              });
            } else {
              if (self.options.zoomType == "lens") {
                self.zoomLens.css({
                  "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvaluewidth + 'px'
                });
              }

              if (self.largeHeight / self.newvaluewidth < self.options.zoomWindowHeight) {
                self.zoomWindow.css({
                  "background-size": self.largeWidth / self.newvaluewidth + 'px ' + self.largeHeight / self.newvaluewidth + 'px'
                });
              } else {
                self.zoomWindow.css({
                  "background-size": self.largeWidth / self.newvalueheight + 'px ' + self.largeHeight / self.newvalueheight + 'px'
                });
              }
            }

            self.changeBgSize = false;
          }

          self.zoomWindow.css({
            backgroundPosition: self.windowLeftPos + 'px ' + self.windowTopPos + 'px'
          });
        }
      }
    },
    setTintPosition: function setTintPosition(e) {
      var self = this;
      self.nzOffset = self.$elem.offset();
      self.tintpos = String((e.pageX - self.nzOffset.left - self.zoomLens.width() / 2) * -1);
      self.tintposy = String((e.pageY - self.nzOffset.top - self.zoomLens.height() / 2) * -1);

      if (self.Etoppos) {
        self.tintposy = 0;
      }

      if (self.Eloppos) {
        self.tintpos = 0;
      }

      if (self.Eboppos) {
        self.tintposy = (self.nzHeight - self.zoomLens.height() - self.options.lensBorderSize * 2) * -1;
      }

      if (self.Eroppos) {
        self.tintpos = (self.nzWidth - self.zoomLens.width() - self.options.lensBorderSize * 2) * -1;
      }

      if (self.options.tint) {
        //stops micro movements
        if (self.fullheight) {
          self.tintposy = 0;
        }

        if (self.fullwidth) {
          self.tintpos = 0;
        }

        self.zoomTintImage.css({
          'left': self.tintpos + 'px'
        });
        self.zoomTintImage.css({
          'top': self.tintposy + 'px'
        });
      }
    },
    swaptheimage: function swaptheimage(smallimage, largeimage) {
      var self = this;
      var newImg = new Image();

      if (self.options.loadingIcon) {
        self.spinner = $('<div style="background: url(\'' + self.options.loadingIcon + '\') no-repeat center;height:' + self.nzHeight + 'px;width:' + self.nzWidth + 'px;z-index: 2000;position: absolute; background-position: center center;"></div>');
        self.$elem.after(self.spinner);
      }

      self.options.onImageSwap(self.$elem);

      newImg.onload = function () {
        self.largeWidth = newImg.width;
        self.largeHeight = newImg.height;
        self.zoomImage = largeimage;
        self.zoomWindow.css({
          "background-size": self.largeWidth + 'px ' + self.largeHeight + 'px'
        });
        self.swapAction(smallimage, largeimage);
        return;
      };

      newImg.src = largeimage; // this must be done AFTER setting onload
    },
    swapAction: function swapAction(smallimage, largeimage) {
      var self = this;
      var newImg2 = new Image();

      newImg2.onload = function () {
        //re-calculate values
        self.nzHeight = newImg2.height;
        self.nzWidth = newImg2.width;
        self.options.onImageSwapComplete(self.$elem);
        self.doneCallback();
        return;
      };

      newImg2.src = smallimage; //reset the zoomlevel to that initially set in options

      self.currentZoomLevel = self.options.zoomLevel;
      self.options.maxZoomLevel = false; //swaps the main image
      //self.$elem.attr("src",smallimage);
      //swaps the zoom image

      if (self.options.zoomType == "lens") {
        self.zoomLens.css({
          backgroundImage: "url('" + largeimage + "')"
        });
      }

      if (self.options.zoomType == "window") {
        self.zoomWindow.css({
          backgroundImage: "url('" + largeimage + "')"
        });
      }

      if (self.options.zoomType == "inner") {
        self.zoomWindow.css({
          backgroundImage: "url('" + largeimage + "')"
        });
      }

      self.currentImage = largeimage;

      if (self.options.imageCrossfade) {
        var oldImg = self.$elem;
        var newImg = oldImg.clone();
        self.$elem.attr("src", smallimage);
        self.$elem.after(newImg);
        newImg.stop(true).fadeOut(self.options.imageCrossfade, function () {
          $(this).remove();
        }); //       				if(self.options.zoomType == "inner"){
        //remove any attributes on the cloned image so we can resize later

        self.$elem.width("auto").removeAttr("width");
        self.$elem.height("auto").removeAttr("height"); //   }

        oldImg.fadeIn(self.options.imageCrossfade);

        if (self.options.tint && self.options.zoomType != "inner") {
          var oldImgTint = self.zoomTintImage;
          var newImgTint = oldImgTint.clone();
          self.zoomTintImage.attr("src", largeimage);
          self.zoomTintImage.after(newImgTint);
          newImgTint.stop(true).fadeOut(self.options.imageCrossfade, function () {
            $(this).remove();
          });
          oldImgTint.fadeIn(self.options.imageCrossfade); //self.zoomTintImage.attr("width",elem.data("image"));
          //resize the tint window

          self.zoomTint.css({
            height: self.$elem.height()
          });
          self.zoomTint.css({
            width: self.$elem.width()
          });
        }

        self.zoomContainer.css("height", self.$elem.height());
        self.zoomContainer.css("width", self.$elem.width());

        if (self.options.zoomType == "inner") {
          if (!self.options.constrainType) {
            self.zoomWrap.parent().css("height", self.$elem.height());
            self.zoomWrap.parent().css("width", self.$elem.width());
            self.zoomWindow.css("height", self.$elem.height());
            self.zoomWindow.css("width", self.$elem.width());
          }
        }

        if (self.options.imageCrossfade) {
          self.zoomWrap.css("height", self.$elem.height());
          self.zoomWrap.css("width", self.$elem.width());
        }
      } else {
        self.$elem.attr("src", smallimage);

        if (self.options.tint) {
          self.zoomTintImage.attr("src", largeimage); //self.zoomTintImage.attr("width",elem.data("image"));

          self.zoomTintImage.attr("height", self.$elem.height()); //self.zoomTintImage.attr('src') = elem.data("image");

          self.zoomTintImage.css({
            height: self.$elem.height()
          });
          self.zoomTint.css({
            height: self.$elem.height()
          });
        }

        self.zoomContainer.css("height", self.$elem.height());
        self.zoomContainer.css("width", self.$elem.width());

        if (self.options.imageCrossfade) {
          self.zoomWrap.css("height", self.$elem.height());
          self.zoomWrap.css("width", self.$elem.width());
        }
      }

      if (self.options.constrainType) {
        //This will contrain the image proportions
        if (self.options.constrainType == "height") {
          self.zoomContainer.css("height", self.options.constrainSize);
          self.zoomContainer.css("width", "auto");

          if (self.options.imageCrossfade) {
            self.zoomWrap.css("height", self.options.constrainSize);
            self.zoomWrap.css("width", "auto");
            self.constwidth = self.zoomWrap.width();
          } else {
            self.$elem.css("height", self.options.constrainSize);
            self.$elem.css("width", "auto");
            self.constwidth = self.$elem.width();
          }

          if (self.options.zoomType == "inner") {
            self.zoomWrap.parent().css("height", self.options.constrainSize);
            self.zoomWrap.parent().css("width", self.constwidth);
            self.zoomWindow.css("height", self.options.constrainSize);
            self.zoomWindow.css("width", self.constwidth);
          }

          if (self.options.tint) {
            self.tintContainer.css("height", self.options.constrainSize);
            self.tintContainer.css("width", self.constwidth);
            self.zoomTint.css("height", self.options.constrainSize);
            self.zoomTint.css("width", self.constwidth);
            self.zoomTintImage.css("height", self.options.constrainSize);
            self.zoomTintImage.css("width", self.constwidth);
          }
        }

        if (self.options.constrainType == "width") {
          self.zoomContainer.css("height", "auto");
          self.zoomContainer.css("width", self.options.constrainSize);

          if (self.options.imageCrossfade) {
            self.zoomWrap.css("height", "auto");
            self.zoomWrap.css("width", self.options.constrainSize);
            self.constheight = self.zoomWrap.height();
          } else {
            self.$elem.css("height", "auto");
            self.$elem.css("width", self.options.constrainSize);
            self.constheight = self.$elem.height();
          }

          if (self.options.zoomType == "inner") {
            self.zoomWrap.parent().css("height", self.constheight);
            self.zoomWrap.parent().css("width", self.options.constrainSize);
            self.zoomWindow.css("height", self.constheight);
            self.zoomWindow.css("width", self.options.constrainSize);
          }

          if (self.options.tint) {
            self.tintContainer.css("height", self.constheight);
            self.tintContainer.css("width", self.options.constrainSize);
            self.zoomTint.css("height", self.constheight);
            self.zoomTint.css("width", self.options.constrainSize);
            self.zoomTintImage.css("height", self.constheight);
            self.zoomTintImage.css("width", self.options.constrainSize);
          }
        }
      }
    },
    doneCallback: function doneCallback() {
      var self = this;

      if (self.options.loadingIcon) {
        self.spinner.hide();
      }

      self.nzOffset = self.$elem.offset();
      self.nzWidth = self.$elem.width();
      self.nzHeight = self.$elem.height(); // reset the zoomlevel back to default

      self.currentZoomLevel = self.options.zoomLevel; //ratio of the large to small image

      self.widthRatio = self.largeWidth / self.nzWidth;
      self.heightRatio = self.largeHeight / self.nzHeight; //NEED TO ADD THE LENS SIZE FOR ROUND
      // adjust images less than the window height

      if (self.options.zoomType == "window") {
        if (self.nzHeight < self.options.zoomWindowWidth / self.widthRatio) {
          lensHeight = self.nzHeight;
        } else {
          lensHeight = String(self.options.zoomWindowHeight / self.heightRatio);
        }

        if (self.options.zoomWindowWidth < self.options.zoomWindowWidth) {
          lensWidth = self.nzWidth;
        } else {
          lensWidth = self.options.zoomWindowWidth / self.widthRatio;
        }

        if (self.zoomLens) {
          self.zoomLens.css('width', lensWidth);
          self.zoomLens.css('height', lensHeight);
        }
      }
    },
    getCurrentImage: function getCurrentImage() {
      var self = this;
      return self.zoomImage;
    },
    getGalleryList: function getGalleryList() {
      var self = this; //loop through the gallery options and set them in list for fancybox

      self.gallerylist = [];

      if (self.options.gallery) {
        $('#' + self.options.gallery + ' a').each(function () {
          var img_src = '';

          if ($(this).data("zoom-image")) {
            img_src = $(this).data("zoom-image");
          } else if ($(this).data("image")) {
            img_src = $(this).data("image");
          } //put the current image at the start


          if (img_src == self.zoomImage) {
            self.gallerylist.unshift({
              href: '' + img_src + '',
              title: $(this).find('img').attr("title")
            });
          } else {
            self.gallerylist.push({
              href: '' + img_src + '',
              title: $(this).find('img').attr("title")
            });
          }
        });
      } //if no gallery - return current image
      else {
        self.gallerylist.push({
          href: '' + self.zoomImage + '',
          title: $(this).find('img').attr("title")
        });
      }

      return self.gallerylist;
    },
    changeZoomLevel: function changeZoomLevel(value) {
      var self = this; //flag a zoom, so can adjust the easing during setPosition

      self.scrollingLock = true; //round to two decimal places

      self.newvalue = parseFloat(value).toFixed(2);
      newvalue = parseFloat(value).toFixed(2); //maxwidth & Maxheight of the image

      maxheightnewvalue = self.largeHeight / (self.options.zoomWindowHeight / self.nzHeight * self.nzHeight);
      maxwidthtnewvalue = self.largeWidth / (self.options.zoomWindowWidth / self.nzWidth * self.nzWidth); //calculate new heightratio

      if (self.options.zoomType != "inner") {
        if (maxheightnewvalue <= newvalue) {
          self.heightRatio = self.largeHeight / maxheightnewvalue / self.nzHeight;
          self.newvalueheight = maxheightnewvalue;
          self.fullheight = true;
        } else {
          self.heightRatio = self.largeHeight / newvalue / self.nzHeight;
          self.newvalueheight = newvalue;
          self.fullheight = false;
        } //					calculate new width ratio


        if (maxwidthtnewvalue <= newvalue) {
          self.widthRatio = self.largeWidth / maxwidthtnewvalue / self.nzWidth;
          self.newvaluewidth = maxwidthtnewvalue;
          self.fullwidth = true;
        } else {
          self.widthRatio = self.largeWidth / newvalue / self.nzWidth;
          self.newvaluewidth = newvalue;
          self.fullwidth = false;
        }

        if (self.options.zoomType == "lens") {
          if (maxheightnewvalue <= newvalue) {
            self.fullwidth = true;
            self.newvaluewidth = maxheightnewvalue;
          } else {
            self.widthRatio = self.largeWidth / newvalue / self.nzWidth;
            self.newvaluewidth = newvalue;
            self.fullwidth = false;
          }
        }
      }

      if (self.options.zoomType == "inner") {
        maxheightnewvalue = parseFloat(self.largeHeight / self.nzHeight).toFixed(2);
        maxwidthtnewvalue = parseFloat(self.largeWidth / self.nzWidth).toFixed(2);

        if (newvalue > maxheightnewvalue) {
          newvalue = maxheightnewvalue;
        }

        if (newvalue > maxwidthtnewvalue) {
          newvalue = maxwidthtnewvalue;
        }

        if (maxheightnewvalue <= newvalue) {
          self.heightRatio = self.largeHeight / newvalue / self.nzHeight;

          if (newvalue > maxheightnewvalue) {
            self.newvalueheight = maxheightnewvalue;
          } else {
            self.newvalueheight = newvalue;
          }

          self.fullheight = true;
        } else {
          self.heightRatio = self.largeHeight / newvalue / self.nzHeight;

          if (newvalue > maxheightnewvalue) {
            self.newvalueheight = maxheightnewvalue;
          } else {
            self.newvalueheight = newvalue;
          }

          self.fullheight = false;
        }

        if (maxwidthtnewvalue <= newvalue) {
          self.widthRatio = self.largeWidth / newvalue / self.nzWidth;

          if (newvalue > maxwidthtnewvalue) {
            self.newvaluewidth = maxwidthtnewvalue;
          } else {
            self.newvaluewidth = newvalue;
          }

          self.fullwidth = true;
        } else {
          self.widthRatio = self.largeWidth / newvalue / self.nzWidth;
          self.newvaluewidth = newvalue;
          self.fullwidth = false;
        }
      } //end inner


      scrcontinue = false;

      if (self.options.zoomType == "inner") {
        if (self.nzWidth >= self.nzHeight) {
          if (self.newvaluewidth <= maxwidthtnewvalue) {
            scrcontinue = true;
          } else {
            scrcontinue = false;
            self.fullheight = true;
            self.fullwidth = true;
          }
        }

        if (self.nzHeight > self.nzWidth) {
          if (self.newvaluewidth <= maxwidthtnewvalue) {
            scrcontinue = true;
          } else {
            scrcontinue = false;
            self.fullheight = true;
            self.fullwidth = true;
          }
        }
      }

      if (self.options.zoomType != "inner") {
        scrcontinue = true;
      }

      if (scrcontinue) {
        self.zoomLock = 0;
        self.changeZoom = true; //if lens height is less than image height

        if (self.options.zoomWindowHeight / self.heightRatio <= self.nzHeight) {
          self.currentZoomLevel = self.newvalueheight;

          if (self.options.zoomType != "lens" && self.options.zoomType != "inner") {
            self.changeBgSize = true;
            self.zoomLens.css({
              height: String(self.options.zoomWindowHeight / self.heightRatio) + 'px'
            });
          }

          if (self.options.zoomType == "lens" || self.options.zoomType == "inner") {
            self.changeBgSize = true;
          }
        }

        if (self.options.zoomWindowWidth / self.widthRatio <= self.nzWidth) {
          if (self.options.zoomType != "inner") {
            if (self.newvaluewidth > self.newvalueheight) {
              self.currentZoomLevel = self.newvaluewidth;
            }
          }

          if (self.options.zoomType != "lens" && self.options.zoomType != "inner") {
            self.changeBgSize = true;
            self.zoomLens.css({
              width: String(self.options.zoomWindowWidth / self.widthRatio) + 'px'
            });
          }

          if (self.options.zoomType == "lens" || self.options.zoomType == "inner") {
            self.changeBgSize = true;
          }
        }

        if (self.options.zoomType == "inner") {
          self.changeBgSize = true;

          if (self.nzWidth > self.nzHeight) {
            self.currentZoomLevel = self.newvaluewidth;
          }

          if (self.nzHeight > self.nzWidth) {
            self.currentZoomLevel = self.newvaluewidth;
          }
        }
      } //under
      //sets the boundry change, called in setWindowPos


      self.setPosition(self.currentLoc); //
    },
    closeAll: function closeAll() {
      if (self.zoomWindow) {
        self.zoomWindow.hide();
      }

      if (self.zoomLens) {
        self.zoomLens.hide();
      }

      if (self.zoomTint) {
        self.zoomTint.hide();
      }
    },
    changeState: function changeState(value) {
      var self = this;

      if (value == 'enable') {
        self.options.zoomEnabled = true;
      }

      if (value == 'disable') {
        self.options.zoomEnabled = false;
      }
    }
  };

  $.fn.elevateZoom = function (options) {
    return this.each(function () {
      var elevate = Object.create(ElevateZoom);
      elevate.init(options, this);
      $.data(this, 'elevateZoom', elevate);
    });
  };

  $.fn.elevateZoom.options = {
    zoomActivation: "hover",
    // Can also be click (PLACEHOLDER FOR NEXT VERSION)
    zoomEnabled: true,
    //false disables zoomwindow from showing
    preloading: 1,
    //by default, load all the images, if 0, then only load images after activated (PLACEHOLDER FOR NEXT VERSION)
    zoomLevel: 1,
    //default zoom level of image
    scrollZoom: false,
    //allow zoom on mousewheel, true to activate
    scrollZoomIncrement: 0.1,
    //steps of the scrollzoom
    minZoomLevel: false,
    maxZoomLevel: false,
    easing: false,
    easingAmount: 12,
    lensSize: 200,
    zoomWindowWidth: 400,
    zoomWindowHeight: 400,
    zoomWindowOffetx: 0,
    zoomWindowOffety: 0,
    zoomWindowPosition: 1,
    zoomWindowBgColour: "#fff",
    lensFadeIn: false,
    lensFadeOut: false,
    debug: false,
    zoomWindowFadeIn: false,
    zoomWindowFadeOut: false,
    zoomWindowAlwaysShow: false,
    zoomTintFadeIn: false,
    zoomTintFadeOut: false,
    borderSize: 4,
    showLens: true,
    borderColour: "#888",
    lensBorderSize: 1,
    lensBorderColour: "#000",
    lensShape: "square",
    //can be "round"
    zoomType: "window",
    //window is default,  also "lens" available -
    containLensZoom: false,
    lensColour: "white",
    //colour of the lens background
    lensOpacity: 0.4,
    //opacity of the lens
    lenszoom: false,
    tint: false,
    //enable the tinting
    tintColour: "#333",
    //default tint color, can be anything, red, #ccc, rgb(0,0,0)
    tintOpacity: 0.4,
    //opacity of the tint
    gallery: false,
    galleryActiveClass: "zoomGalleryActive",
    imageCrossfade: false,
    constrainType: false,
    //width or height
    constrainSize: false,
    //in pixels the dimensions you want to constrain on
    loadingIcon: false,
    //http://www.example.com/spinner.gif
    cursor: "default",
    // user should set to what they want the cursor as, if they have set a click function
    responsive: true,
    onComplete: $.noop,
    onDestroy: function onDestroy() {},
    onZoomedImageLoaded: function onZoomedImageLoaded() {},
    onImageSwap: $.noop,
    onImageSwapComplete: $.noop
  };
})(jQuery, window, document);

/***/ }),

/***/ "./resources/assets/plugins/productScripts.js":
/*!****************************************************!*\
  !*** ./resources/assets/plugins/productScripts.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function ($) {
  "use strict";

  var image = $("#product_img"); //var zoomConfig = {};

  var zoomActive = false;

  if ($(window).width() > 768) {
    zoomActive = true;
  } // zoomActive = !zoomActive;


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
    open: function open() {
      $("body").addClass("zoom_image");
    },
    close: function close() {
      // Wait until overflow:hidden has been removed from the html tag
      setTimeout(function () {
        $("body").removeClass("zoom_image");
        $("body").removeClass("zoom_gallery_image"); //$('.zoomContainer:last-child').remove();// remove zoom container from DOM

        $(".zoomContainer").slice(1).remove();
      }, 100);
    }
  }; // Set up gallery on click

  var galleryZoom = $("#pr_item_gallery");
  galleryZoom.magnificPopup({
    delegate: "a",
    type: "image",
    gallery: {
      enabled: true
    },
    callbacks: {
      elementParse: function elementParse(item) {
        item.src = item.el.attr("data-zoom-image");
      }
    }
  }); // Zoom image when click on icon

  $(".product_img_zoom").on("click", function () {
    var actual = $("#pr_item_gallery a").attr("data-zoom-image");
    $("body").addClass("zoom_gallery_image");
    $("#pr_item_gallery .item").each(function () {
      if (actual == $(this).find(".product_gallery_item").attr("data-zoom-image")) {
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
      delegate: "a",
      // the selector for gallery item
      type: "image",
      gallery: {
        enabled: true
      }
    });
  });
  $(".popup-ajax").magnificPopup({
    type: "ajax",
    callbacks: {
      ajaxContentAdded: function ajaxContentAdded() {
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
  /*======= PRODUCT COLOR JS ===============*/

  $(".product_color_switch span").each(function () {
    var get_color = $(this).attr("data-color");
    $(this).css("background-color", get_color);
  });
  $(document).on("click", ".product_color_switch span,.product_size_switch span", function () {
    $(this).siblings(this).removeClass("active").end().addClass("active");
  });
  /*======== PRICE FILTER JS ==============*/

  $("#price_filter").each(function () {
    var $filter_selector = $(this);
    var a = $filter_selector.data("min-value");
    var b = $filter_selector.data("max-value");
    var c = $filter_selector.data("price-sign");
    $filter_selector.slider({
      range: true,
      min: $filter_selector.data("min"),
      max: $filter_selector.data("max"),
      values: [a, b],
      slide: function slide(event, ui) {
        $("#flt_price").html(c + ui.values[0] + " - " + c + ui.values[1]);
        $("#price_first").val(ui.values[0]);
        $("#price_second").val(ui.values[1]);
      }
    });
    $("#flt_price").html(c + $filter_selector.slider("values", 0) + " - " + c + $filter_selector.slider("values", 1));
  });
  /*========= RATING STAR JS ============*/

  $(document).on("ready", function () {
    $(".star_rating span").on("click", function () {
      var onStar = parseFloat($(this).data("value"), 10); // The star currently selected

      var stars = $(this).parent().children(".star_rating span");

      for (var i = 0; i < stars.length; i++) {
        $(stars[i]).removeClass("selected");
      }

      for (i = 0; i < onStar; i++) {
        $(stars[i]).addClass("selected");
      }
    });
  });
})(jQuery);

/***/ }),

/***/ "./resources/assets/plugins/slick/js/slick.min.js":
/*!********************************************************!*\
  !*** ./resources/assets/plugins/slick/js/slick.min.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

Version: 1.5.9
Author: Ken Wheeler
Website: http://kenwheeler.github.io
Docs: http://kenwheeler.github.io/slick
Repo: http://github.com/kenwheeler/slick
Issues: http://github.com/kenwheeler/slick/issues

 */
!function (a) {
  "use strict";

   true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : undefined;
}(function (a) {
  "use strict";

  var b = window.Slick || {};
  b = function () {
    function c(c, d) {
      var f,
          e = this;
      e.defaults = {
        accessibility: !0,
        adaptiveHeight: !1,
        appendArrows: a(c),
        appendDots: a(c),
        arrows: !0,
        asNavFor: null,
        prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
        nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
        autoplay: !1,
        autoplaySpeed: 3e3,
        centerMode: !1,
        centerPadding: "50px",
        cssEase: "ease",
        customPaging: function customPaging(a, b) {
          return '<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">' + (b + 1) + "</button>";
        },
        dots: !1,
        dotsClass: "slick-dots",
        draggable: !0,
        easing: "linear",
        edgeFriction: .35,
        fade: !1,
        focusOnSelect: !1,
        infinite: !0,
        initialSlide: 0,
        lazyLoad: "ondemand",
        mobileFirst: !1,
        pauseOnHover: !0,
        pauseOnDotsHover: !1,
        respondTo: "window",
        responsive: null,
        rows: 1,
        rtl: !1,
        slide: "",
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: !0,
        swipeToSlide: !1,
        touchMove: !0,
        touchThreshold: 5,
        useCSS: !0,
        useTransform: !1,
        variableWidth: !1,
        vertical: !1,
        verticalSwiping: !1,
        waitForAnimate: !0,
        zIndex: 1e3
      }, e.initials = {
        animating: !1,
        dragging: !1,
        autoPlayTimer: null,
        currentDirection: 0,
        currentLeft: null,
        currentSlide: 0,
        direction: 1,
        $dots: null,
        listWidth: null,
        listHeight: null,
        loadIndex: 0,
        $nextArrow: null,
        $prevArrow: null,
        slideCount: null,
        slideWidth: null,
        $slideTrack: null,
        $slides: null,
        sliding: !1,
        slideOffset: 0,
        swipeLeft: null,
        $list: null,
        touchObject: {},
        transformsEnabled: !1,
        unslicked: !1
      }, a.extend(e, e.initials), e.activeBreakpoint = null, e.animType = null, e.animProp = null, e.breakpoints = [], e.breakpointSettings = [], e.cssTransitions = !1, e.hidden = "hidden", e.paused = !1, e.positionProp = null, e.respondTo = null, e.rowCount = 1, e.shouldClick = !0, e.$slider = a(c), e.$slidesCache = null, e.transformType = null, e.transitionType = null, e.visibilityChange = "visibilitychange", e.windowWidth = 0, e.windowTimer = null, f = a(c).data("slick") || {}, e.options = a.extend({}, e.defaults, f, d), e.currentSlide = e.options.initialSlide, e.originalSettings = e.options, "undefined" != typeof document.mozHidden ? (e.hidden = "mozHidden", e.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.webkitHidden && (e.hidden = "webkitHidden", e.visibilityChange = "webkitvisibilitychange"), e.autoPlay = a.proxy(e.autoPlay, e), e.autoPlayClear = a.proxy(e.autoPlayClear, e), e.changeSlide = a.proxy(e.changeSlide, e), e.clickHandler = a.proxy(e.clickHandler, e), e.selectHandler = a.proxy(e.selectHandler, e), e.setPosition = a.proxy(e.setPosition, e), e.swipeHandler = a.proxy(e.swipeHandler, e), e.dragHandler = a.proxy(e.dragHandler, e), e.keyHandler = a.proxy(e.keyHandler, e), e.autoPlayIterator = a.proxy(e.autoPlayIterator, e), e.instanceUid = b++, e.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, e.registerBreakpoints(), e.init(!0), e.checkResponsive(!0);
    }

    var b = 0;
    return c;
  }(), b.prototype.addSlide = b.prototype.slickAdd = function (b, c, d) {
    var e = this;
    if ("boolean" == typeof c) d = c, c = null;else if (0 > c || c >= e.slideCount) return !1;
    e.unload(), "number" == typeof c ? 0 === c && 0 === e.$slides.length ? a(b).appendTo(e.$slideTrack) : d ? a(b).insertBefore(e.$slides.eq(c)) : a(b).insertAfter(e.$slides.eq(c)) : d === !0 ? a(b).prependTo(e.$slideTrack) : a(b).appendTo(e.$slideTrack), e.$slides = e.$slideTrack.children(this.options.slide), e.$slideTrack.children(this.options.slide).detach(), e.$slideTrack.append(e.$slides), e.$slides.each(function (b, c) {
      a(c).attr("data-slick-index", b);
    }), e.$slidesCache = e.$slides, e.reinit();
  }, b.prototype.animateHeight = function () {
    var a = this;

    if (1 === a.options.slidesToShow && a.options.adaptiveHeight === !0 && a.options.vertical === !1) {
      var b = a.$slides.eq(a.currentSlide).outerHeight(!0);
      a.$list.animate({
        height: b
      }, a.options.speed);
    }
  }, b.prototype.animateSlide = function (b, c) {
    var d = {},
        e = this;
    e.animateHeight(), e.options.rtl === !0 && e.options.vertical === !1 && (b = -b), e.transformsEnabled === !1 ? e.options.vertical === !1 ? e.$slideTrack.animate({
      left: b
    }, e.options.speed, e.options.easing, c) : e.$slideTrack.animate({
      top: b
    }, e.options.speed, e.options.easing, c) : e.cssTransitions === !1 ? (e.options.rtl === !0 && (e.currentLeft = -e.currentLeft), a({
      animStart: e.currentLeft
    }).animate({
      animStart: b
    }, {
      duration: e.options.speed,
      easing: e.options.easing,
      step: function step(a) {
        a = Math.ceil(a), e.options.vertical === !1 ? (d[e.animType] = "translate(" + a + "px, 0px)", e.$slideTrack.css(d)) : (d[e.animType] = "translate(0px," + a + "px)", e.$slideTrack.css(d));
      },
      complete: function complete() {
        c && c.call();
      }
    })) : (e.applyTransition(), b = Math.ceil(b), e.options.vertical === !1 ? d[e.animType] = "translate3d(" + b + "px, 0px, 0px)" : d[e.animType] = "translate3d(0px," + b + "px, 0px)", e.$slideTrack.css(d), c && setTimeout(function () {
      e.disableTransition(), c.call();
    }, e.options.speed));
  }, b.prototype.asNavFor = function (b) {
    var c = this,
        d = c.options.asNavFor;
    d && null !== d && (d = a(d).not(c.$slider)), null !== d && "object" == _typeof(d) && d.each(function () {
      var c = a(this).slick("getSlick");
      c.unslicked || c.slideHandler(b, !0);
    });
  }, b.prototype.applyTransition = function (a) {
    var b = this,
        c = {};
    b.options.fade === !1 ? c[b.transitionType] = b.transformType + " " + b.options.speed + "ms " + b.options.cssEase : c[b.transitionType] = "opacity " + b.options.speed + "ms " + b.options.cssEase, b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c);
  }, b.prototype.autoPlay = function () {
    var a = this;
    a.autoPlayTimer && clearInterval(a.autoPlayTimer), a.slideCount > a.options.slidesToShow && a.paused !== !0 && (a.autoPlayTimer = setInterval(a.autoPlayIterator, a.options.autoplaySpeed));
  }, b.prototype.autoPlayClear = function () {
    var a = this;
    a.autoPlayTimer && clearInterval(a.autoPlayTimer);
  }, b.prototype.autoPlayIterator = function () {
    var a = this;
    a.options.infinite === !1 ? 1 === a.direction ? (a.currentSlide + 1 === a.slideCount - 1 && (a.direction = 0), a.slideHandler(a.currentSlide + a.options.slidesToScroll)) : (a.currentSlide - 1 === 0 && (a.direction = 1), a.slideHandler(a.currentSlide - a.options.slidesToScroll)) : a.slideHandler(a.currentSlide + a.options.slidesToScroll);
  }, b.prototype.buildArrows = function () {
    var b = this;
    b.options.arrows === !0 && (b.$prevArrow = a(b.options.prevArrow).addClass("slick-arrow"), b.$nextArrow = a(b.options.nextArrow).addClass("slick-arrow"), b.slideCount > b.options.slidesToShow ? (b.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), b.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.prependTo(b.options.appendArrows), b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.appendTo(b.options.appendArrows), b.options.infinite !== !0 && b.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : b.$prevArrow.add(b.$nextArrow).addClass("slick-hidden").attr({
      "aria-disabled": "true",
      tabindex: "-1"
    }));
  }, b.prototype.buildDots = function () {
    var c,
        d,
        b = this;

    if (b.options.dots === !0 && b.slideCount > b.options.slidesToShow) {
      for (d = '<ul class="' + b.options.dotsClass + '">', c = 0; c <= b.getDotCount(); c += 1) {
        d += "<li>" + b.options.customPaging.call(this, b, c) + "</li>";
      }

      d += "</ul>", b.$dots = a(d).appendTo(b.options.appendDots), b.$dots.find("li").first().addClass("slick-active").attr("aria-hidden", "false");
    }
  }, b.prototype.buildOut = function () {
    var b = this;
    b.$slides = b.$slider.children(b.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), b.slideCount = b.$slides.length, b.$slides.each(function (b, c) {
      a(c).attr("data-slick-index", b).data("originalStyling", a(c).attr("style") || "");
    }), b.$slider.addClass("slick-slider"), b.$slideTrack = 0 === b.slideCount ? a('<div class="slick-track"/>').appendTo(b.$slider) : b.$slides.wrapAll('<div class="slick-track"/>').parent(), b.$list = b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(), b.$slideTrack.css("opacity", 0), (b.options.centerMode === !0 || b.options.swipeToSlide === !0) && (b.options.slidesToScroll = 1), a("img[data-lazy]", b.$slider).not("[src]").addClass("slick-loading"), b.setupInfinite(), b.buildArrows(), b.buildDots(), b.updateDots(), b.setSlideClasses("number" == typeof b.currentSlide ? b.currentSlide : 0), b.options.draggable === !0 && b.$list.addClass("draggable");
  }, b.prototype.buildRows = function () {
    var b,
        c,
        d,
        e,
        f,
        g,
        h,
        a = this;

    if (e = document.createDocumentFragment(), g = a.$slider.children(), a.options.rows > 1) {
      for (h = a.options.slidesPerRow * a.options.rows, f = Math.ceil(g.length / h), b = 0; f > b; b++) {
        var i = document.createElement("div");

        for (c = 0; c < a.options.rows; c++) {
          var j = document.createElement("div");

          for (d = 0; d < a.options.slidesPerRow; d++) {
            var k = b * h + (c * a.options.slidesPerRow + d);
            g.get(k) && j.appendChild(g.get(k));
          }

          i.appendChild(j);
        }

        e.appendChild(i);
      }

      a.$slider.html(e), a.$slider.children().children().children().css({
        width: 100 / a.options.slidesPerRow + "%",
        display: "inline-block"
      });
    }
  }, b.prototype.checkResponsive = function (b, c) {
    var e,
        f,
        g,
        d = this,
        h = !1,
        i = d.$slider.width(),
        j = window.innerWidth || a(window).width();

    if ("window" === d.respondTo ? g = j : "slider" === d.respondTo ? g = i : "min" === d.respondTo && (g = Math.min(j, i)), d.options.responsive && d.options.responsive.length && null !== d.options.responsive) {
      f = null;

      for (e in d.breakpoints) {
        d.breakpoints.hasOwnProperty(e) && (d.originalSettings.mobileFirst === !1 ? g < d.breakpoints[e] && (f = d.breakpoints[e]) : g > d.breakpoints[e] && (f = d.breakpoints[e]));
      }

      null !== f ? null !== d.activeBreakpoint ? (f !== d.activeBreakpoint || c) && (d.activeBreakpoint = f, "unslick" === d.breakpointSettings[f] ? d.unslick(f) : (d.options = a.extend({}, d.originalSettings, d.breakpointSettings[f]), b === !0 && (d.currentSlide = d.options.initialSlide), d.refresh(b)), h = f) : (d.activeBreakpoint = f, "unslick" === d.breakpointSettings[f] ? d.unslick(f) : (d.options = a.extend({}, d.originalSettings, d.breakpointSettings[f]), b === !0 && (d.currentSlide = d.options.initialSlide), d.refresh(b)), h = f) : null !== d.activeBreakpoint && (d.activeBreakpoint = null, d.options = d.originalSettings, b === !0 && (d.currentSlide = d.options.initialSlide), d.refresh(b), h = f), b || h === !1 || d.$slider.trigger("breakpoint", [d, h]);
    }
  }, b.prototype.changeSlide = function (b, c) {
    var f,
        g,
        h,
        d = this,
        e = a(b.target);

    switch (e.is("a") && b.preventDefault(), e.is("li") || (e = e.closest("li")), h = d.slideCount % d.options.slidesToScroll !== 0, f = h ? 0 : (d.slideCount - d.currentSlide) % d.options.slidesToScroll, b.data.message) {
      case "previous":
        g = 0 === f ? d.options.slidesToScroll : d.options.slidesToShow - f, d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide - g, !1, c);
        break;

      case "next":
        g = 0 === f ? d.options.slidesToScroll : f, d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide + g, !1, c);
        break;

      case "index":
        var i = 0 === b.data.index ? 0 : b.data.index || e.index() * d.options.slidesToScroll;
        d.slideHandler(d.checkNavigable(i), !1, c), e.children().trigger("focus");
        break;

      default:
        return;
    }
  }, b.prototype.checkNavigable = function (a) {
    var c,
        d,
        b = this;
    if (c = b.getNavigableIndexes(), d = 0, a > c[c.length - 1]) a = c[c.length - 1];else for (var e in c) {
      if (a < c[e]) {
        a = d;
        break;
      }

      d = c[e];
    }
    return a;
  }, b.prototype.cleanUpEvents = function () {
    var b = this;
    b.options.dots && null !== b.$dots && (a("li", b.$dots).off("click.slick", b.changeSlide), b.options.pauseOnDotsHover === !0 && b.options.autoplay === !0 && a("li", b.$dots).off("mouseenter.slick", a.proxy(b.setPaused, b, !0)).off("mouseleave.slick", a.proxy(b.setPaused, b, !1))), b.options.arrows === !0 && b.slideCount > b.options.slidesToShow && (b.$prevArrow && b.$prevArrow.off("click.slick", b.changeSlide), b.$nextArrow && b.$nextArrow.off("click.slick", b.changeSlide)), b.$list.off("touchstart.slick mousedown.slick", b.swipeHandler), b.$list.off("touchmove.slick mousemove.slick", b.swipeHandler), b.$list.off("touchend.slick mouseup.slick", b.swipeHandler), b.$list.off("touchcancel.slick mouseleave.slick", b.swipeHandler), b.$list.off("click.slick", b.clickHandler), a(document).off(b.visibilityChange, b.visibility), b.$list.off("mouseenter.slick", a.proxy(b.setPaused, b, !0)), b.$list.off("mouseleave.slick", a.proxy(b.setPaused, b, !1)), b.options.accessibility === !0 && b.$list.off("keydown.slick", b.keyHandler), b.options.focusOnSelect === !0 && a(b.$slideTrack).children().off("click.slick", b.selectHandler), a(window).off("orientationchange.slick.slick-" + b.instanceUid, b.orientationChange), a(window).off("resize.slick.slick-" + b.instanceUid, b.resize), a("[draggable!=true]", b.$slideTrack).off("dragstart", b.preventDefault), a(window).off("load.slick.slick-" + b.instanceUid, b.setPosition), a(document).off("ready.slick.slick-" + b.instanceUid, b.setPosition);
  }, b.prototype.cleanUpRows = function () {
    var b,
        a = this;
    a.options.rows > 1 && (b = a.$slides.children().children(), b.removeAttr("style"), a.$slider.html(b));
  }, b.prototype.clickHandler = function (a) {
    var b = this;
    b.shouldClick === !1 && (a.stopImmediatePropagation(), a.stopPropagation(), a.preventDefault());
  }, b.prototype.destroy = function (b) {
    var c = this;
    c.autoPlayClear(), c.touchObject = {}, c.cleanUpEvents(), a(".slick-cloned", c.$slider).detach(), c.$dots && c.$dots.remove(), c.$prevArrow && c.$prevArrow.length && (c.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), c.htmlExpr.test(c.options.prevArrow) && c.$prevArrow.remove()), c.$nextArrow && c.$nextArrow.length && (c.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), c.htmlExpr.test(c.options.nextArrow) && c.$nextArrow.remove()), c.$slides && (c.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function () {
      a(this).attr("style", a(this).data("originalStyling"));
    }), c.$slideTrack.children(this.options.slide).detach(), c.$slideTrack.detach(), c.$list.detach(), c.$slider.append(c.$slides)), c.cleanUpRows(), c.$slider.removeClass("slick-slider"), c.$slider.removeClass("slick-initialized"), c.unslicked = !0, b || c.$slider.trigger("destroy", [c]);
  }, b.prototype.disableTransition = function (a) {
    var b = this,
        c = {};
    c[b.transitionType] = "", b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c);
  }, b.prototype.fadeSlide = function (a, b) {
    var c = this;
    c.cssTransitions === !1 ? (c.$slides.eq(a).css({
      zIndex: c.options.zIndex
    }), c.$slides.eq(a).animate({
      opacity: 1
    }, c.options.speed, c.options.easing, b)) : (c.applyTransition(a), c.$slides.eq(a).css({
      opacity: 1,
      zIndex: c.options.zIndex
    }), b && setTimeout(function () {
      c.disableTransition(a), b.call();
    }, c.options.speed));
  }, b.prototype.fadeSlideOut = function (a) {
    var b = this;
    b.cssTransitions === !1 ? b.$slides.eq(a).animate({
      opacity: 0,
      zIndex: b.options.zIndex - 2
    }, b.options.speed, b.options.easing) : (b.applyTransition(a), b.$slides.eq(a).css({
      opacity: 0,
      zIndex: b.options.zIndex - 2
    }));
  }, b.prototype.filterSlides = b.prototype.slickFilter = function (a) {
    var b = this;
    null !== a && (b.$slidesCache = b.$slides, b.unload(), b.$slideTrack.children(this.options.slide).detach(), b.$slidesCache.filter(a).appendTo(b.$slideTrack), b.reinit());
  }, b.prototype.getCurrent = b.prototype.slickCurrentSlide = function () {
    var a = this;
    return a.currentSlide;
  }, b.prototype.getDotCount = function () {
    var a = this,
        b = 0,
        c = 0,
        d = 0;
    if (a.options.infinite === !0) for (; b < a.slideCount;) {
      ++d, b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
    } else if (a.options.centerMode === !0) d = a.slideCount;else for (; b < a.slideCount;) {
      ++d, b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
    }
    return d - 1;
  }, b.prototype.getLeft = function (a) {
    var c,
        d,
        f,
        b = this,
        e = 0;
    return b.slideOffset = 0, d = b.$slides.first().outerHeight(!0), b.options.infinite === !0 ? (b.slideCount > b.options.slidesToShow && (b.slideOffset = b.slideWidth * b.options.slidesToShow * -1, e = d * b.options.slidesToShow * -1), b.slideCount % b.options.slidesToScroll !== 0 && a + b.options.slidesToScroll > b.slideCount && b.slideCount > b.options.slidesToShow && (a > b.slideCount ? (b.slideOffset = (b.options.slidesToShow - (a - b.slideCount)) * b.slideWidth * -1, e = (b.options.slidesToShow - (a - b.slideCount)) * d * -1) : (b.slideOffset = b.slideCount % b.options.slidesToScroll * b.slideWidth * -1, e = b.slideCount % b.options.slidesToScroll * d * -1))) : a + b.options.slidesToShow > b.slideCount && (b.slideOffset = (a + b.options.slidesToShow - b.slideCount) * b.slideWidth, e = (a + b.options.slidesToShow - b.slideCount) * d), b.slideCount <= b.options.slidesToShow && (b.slideOffset = 0, e = 0), b.options.centerMode === !0 && b.options.infinite === !0 ? b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2) - b.slideWidth : b.options.centerMode === !0 && (b.slideOffset = 0, b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2)), c = b.options.vertical === !1 ? a * b.slideWidth * -1 + b.slideOffset : a * d * -1 + e, b.options.variableWidth === !0 && (f = b.slideCount <= b.options.slidesToShow || b.options.infinite === !1 ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow), c = b.options.rtl === !0 ? f[0] ? -1 * (b.$slideTrack.width() - f[0].offsetLeft - f.width()) : 0 : f[0] ? -1 * f[0].offsetLeft : 0, b.options.centerMode === !0 && (f = b.slideCount <= b.options.slidesToShow || b.options.infinite === !1 ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow + 1), c = b.options.rtl === !0 ? f[0] ? -1 * (b.$slideTrack.width() - f[0].offsetLeft - f.width()) : 0 : f[0] ? -1 * f[0].offsetLeft : 0, c += (b.$list.width() - f.outerWidth()) / 2)), c;
  }, b.prototype.getOption = b.prototype.slickGetOption = function (a) {
    var b = this;
    return b.options[a];
  }, b.prototype.getNavigableIndexes = function () {
    var e,
        a = this,
        b = 0,
        c = 0,
        d = [];

    for (a.options.infinite === !1 ? e = a.slideCount : (b = -1 * a.options.slidesToScroll, c = -1 * a.options.slidesToScroll, e = 2 * a.slideCount); e > b;) {
      d.push(b), b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
    }

    return d;
  }, b.prototype.getSlick = function () {
    return this;
  }, b.prototype.getSlideCount = function () {
    var c,
        d,
        e,
        b = this;
    return e = b.options.centerMode === !0 ? b.slideWidth * Math.floor(b.options.slidesToShow / 2) : 0, b.options.swipeToSlide === !0 ? (b.$slideTrack.find(".slick-slide").each(function (c, f) {
      return f.offsetLeft - e + a(f).outerWidth() / 2 > -1 * b.swipeLeft ? (d = f, !1) : void 0;
    }), c = Math.abs(a(d).attr("data-slick-index") - b.currentSlide) || 1) : b.options.slidesToScroll;
  }, b.prototype.goTo = b.prototype.slickGoTo = function (a, b) {
    var c = this;
    c.changeSlide({
      data: {
        message: "index",
        index: parseInt(a)
      }
    }, b);
  }, b.prototype.init = function (b) {
    var c = this;
    a(c.$slider).hasClass("slick-initialized") || (a(c.$slider).addClass("slick-initialized"), c.buildRows(), c.buildOut(), c.setProps(), c.startLoad(), c.loadSlider(), c.initializeEvents(), c.updateArrows(), c.updateDots()), b && c.$slider.trigger("init", [c]), c.options.accessibility === !0 && c.initADA();
  }, b.prototype.initArrowEvents = function () {
    var a = this;
    a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.on("click.slick", {
      message: "previous"
    }, a.changeSlide), a.$nextArrow.on("click.slick", {
      message: "next"
    }, a.changeSlide));
  }, b.prototype.initDotEvents = function () {
    var b = this;
    b.options.dots === !0 && b.slideCount > b.options.slidesToShow && a("li", b.$dots).on("click.slick", {
      message: "index"
    }, b.changeSlide), b.options.dots === !0 && b.options.pauseOnDotsHover === !0 && b.options.autoplay === !0 && a("li", b.$dots).on("mouseenter.slick", a.proxy(b.setPaused, b, !0)).on("mouseleave.slick", a.proxy(b.setPaused, b, !1));
  }, b.prototype.initializeEvents = function () {
    var b = this;
    b.initArrowEvents(), b.initDotEvents(), b.$list.on("touchstart.slick mousedown.slick", {
      action: "start"
    }, b.swipeHandler), b.$list.on("touchmove.slick mousemove.slick", {
      action: "move"
    }, b.swipeHandler), b.$list.on("touchend.slick mouseup.slick", {
      action: "end"
    }, b.swipeHandler), b.$list.on("touchcancel.slick mouseleave.slick", {
      action: "end"
    }, b.swipeHandler), b.$list.on("click.slick", b.clickHandler), a(document).on(b.visibilityChange, a.proxy(b.visibility, b)), b.$list.on("mouseenter.slick", a.proxy(b.setPaused, b, !0)), b.$list.on("mouseleave.slick", a.proxy(b.setPaused, b, !1)), b.options.accessibility === !0 && b.$list.on("keydown.slick", b.keyHandler), b.options.focusOnSelect === !0 && a(b.$slideTrack).children().on("click.slick", b.selectHandler), a(window).on("orientationchange.slick.slick-" + b.instanceUid, a.proxy(b.orientationChange, b)), a(window).on("resize.slick.slick-" + b.instanceUid, a.proxy(b.resize, b)), a("[draggable!=true]", b.$slideTrack).on("dragstart", b.preventDefault), a(window).on("load.slick.slick-" + b.instanceUid, b.setPosition), a(document).on("ready.slick.slick-" + b.instanceUid, b.setPosition);
  }, b.prototype.initUI = function () {
    var a = this;
    a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.show(), a.$nextArrow.show()), a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.show(), a.options.autoplay === !0 && a.autoPlay();
  }, b.prototype.keyHandler = function (a) {
    var b = this;
    a.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === a.keyCode && b.options.accessibility === !0 ? b.changeSlide({
      data: {
        message: "previous"
      }
    }) : 39 === a.keyCode && b.options.accessibility === !0 && b.changeSlide({
      data: {
        message: "next"
      }
    }));
  }, b.prototype.lazyLoad = function () {
    function g(b) {
      a("img[data-lazy]", b).each(function () {
        var b = a(this),
            c = a(this).attr("data-lazy"),
            d = document.createElement("img");
        d.onload = function () {
          b.animate({
            opacity: 0
          }, 100, function () {
            b.attr("src", c).animate({
              opacity: 1
            }, 200, function () {
              b.removeAttr("data-lazy").removeClass("slick-loading");
            });
          });
        }, d.src = c;
      });
    }

    var c,
        d,
        e,
        f,
        b = this;
    b.options.centerMode === !0 ? b.options.infinite === !0 ? (e = b.currentSlide + (b.options.slidesToShow / 2 + 1), f = e + b.options.slidesToShow + 2) : (e = Math.max(0, b.currentSlide - (b.options.slidesToShow / 2 + 1)), f = 2 + (b.options.slidesToShow / 2 + 1) + b.currentSlide) : (e = b.options.infinite ? b.options.slidesToShow + b.currentSlide : b.currentSlide, f = e + b.options.slidesToShow, b.options.fade === !0 && (e > 0 && e--, f <= b.slideCount && f++)), c = b.$slider.find(".slick-slide").slice(e, f), g(c), b.slideCount <= b.options.slidesToShow ? (d = b.$slider.find(".slick-slide"), g(d)) : b.currentSlide >= b.slideCount - b.options.slidesToShow ? (d = b.$slider.find(".slick-cloned").slice(0, b.options.slidesToShow), g(d)) : 0 === b.currentSlide && (d = b.$slider.find(".slick-cloned").slice(-1 * b.options.slidesToShow), g(d));
  }, b.prototype.loadSlider = function () {
    var a = this;
    a.setPosition(), a.$slideTrack.css({
      opacity: 1
    }), a.$slider.removeClass("slick-loading"), a.initUI(), "progressive" === a.options.lazyLoad && a.progressiveLazyLoad();
  }, b.prototype.next = b.prototype.slickNext = function () {
    var a = this;
    a.changeSlide({
      data: {
        message: "next"
      }
    });
  }, b.prototype.orientationChange = function () {
    var a = this;
    a.checkResponsive(), a.setPosition();
  }, b.prototype.pause = b.prototype.slickPause = function () {
    var a = this;
    a.autoPlayClear(), a.paused = !0;
  }, b.prototype.play = b.prototype.slickPlay = function () {
    var a = this;
    a.paused = !1, a.autoPlay();
  }, b.prototype.postSlide = function (a) {
    var b = this;
    b.$slider.trigger("afterChange", [b, a]), b.animating = !1, b.setPosition(), b.swipeLeft = null, b.options.autoplay === !0 && b.paused === !1 && b.autoPlay(), b.options.accessibility === !0 && b.initADA();
  }, b.prototype.prev = b.prototype.slickPrev = function () {
    var a = this;
    a.changeSlide({
      data: {
        message: "previous"
      }
    });
  }, b.prototype.preventDefault = function (a) {
    a.preventDefault();
  }, b.prototype.progressiveLazyLoad = function () {
    var c,
        d,
        b = this;
    c = a("img[data-lazy]", b.$slider).length, c > 0 && (d = a("img[data-lazy]", b.$slider).first(), d.attr("src", null), d.attr("src", d.attr("data-lazy")).removeClass("slick-loading").load(function () {
      d.removeAttr("data-lazy"), b.progressiveLazyLoad(), b.options.adaptiveHeight === !0 && b.setPosition();
    }).error(function () {
      d.removeAttr("data-lazy"), b.progressiveLazyLoad();
    }));
  }, b.prototype.refresh = function (b) {
    var d,
        e,
        c = this;
    e = c.slideCount - c.options.slidesToShow, c.options.infinite || (c.slideCount <= c.options.slidesToShow ? c.currentSlide = 0 : c.currentSlide > e && (c.currentSlide = e)), d = c.currentSlide, c.destroy(!0), a.extend(c, c.initials, {
      currentSlide: d
    }), c.init(), b || c.changeSlide({
      data: {
        message: "index",
        index: d
      }
    }, !1);
  }, b.prototype.registerBreakpoints = function () {
    var c,
        d,
        e,
        b = this,
        f = b.options.responsive || null;

    if ("array" === a.type(f) && f.length) {
      b.respondTo = b.options.respondTo || "window";

      for (c in f) {
        if (e = b.breakpoints.length - 1, d = f[c].breakpoint, f.hasOwnProperty(c)) {
          for (; e >= 0;) {
            b.breakpoints[e] && b.breakpoints[e] === d && b.breakpoints.splice(e, 1), e--;
          }

          b.breakpoints.push(d), b.breakpointSettings[d] = f[c].settings;
        }
      }

      b.breakpoints.sort(function (a, c) {
        return b.options.mobileFirst ? a - c : c - a;
      });
    }
  }, b.prototype.reinit = function () {
    var b = this;
    b.$slides = b.$slideTrack.children(b.options.slide).addClass("slick-slide"), b.slideCount = b.$slides.length, b.currentSlide >= b.slideCount && 0 !== b.currentSlide && (b.currentSlide = b.currentSlide - b.options.slidesToScroll), b.slideCount <= b.options.slidesToShow && (b.currentSlide = 0), b.registerBreakpoints(), b.setProps(), b.setupInfinite(), b.buildArrows(), b.updateArrows(), b.initArrowEvents(), b.buildDots(), b.updateDots(), b.initDotEvents(), b.checkResponsive(!1, !0), b.options.focusOnSelect === !0 && a(b.$slideTrack).children().on("click.slick", b.selectHandler), b.setSlideClasses(0), b.setPosition(), b.$slider.trigger("reInit", [b]), b.options.autoplay === !0 && b.focusHandler();
  }, b.prototype.resize = function () {
    var b = this;
    a(window).width() !== b.windowWidth && (clearTimeout(b.windowDelay), b.windowDelay = window.setTimeout(function () {
      b.windowWidth = a(window).width(), b.checkResponsive(), b.unslicked || b.setPosition();
    }, 50));
  }, b.prototype.removeSlide = b.prototype.slickRemove = function (a, b, c) {
    var d = this;
    return "boolean" == typeof a ? (b = a, a = b === !0 ? 0 : d.slideCount - 1) : a = b === !0 ? --a : a, d.slideCount < 1 || 0 > a || a > d.slideCount - 1 ? !1 : (d.unload(), c === !0 ? d.$slideTrack.children().remove() : d.$slideTrack.children(this.options.slide).eq(a).remove(), d.$slides = d.$slideTrack.children(this.options.slide), d.$slideTrack.children(this.options.slide).detach(), d.$slideTrack.append(d.$slides), d.$slidesCache = d.$slides, void d.reinit());
  }, b.prototype.setCSS = function (a) {
    var d,
        e,
        b = this,
        c = {};
    b.options.rtl === !0 && (a = -a), d = "left" == b.positionProp ? Math.ceil(a) + "px" : "0px", e = "top" == b.positionProp ? Math.ceil(a) + "px" : "0px", c[b.positionProp] = a, b.transformsEnabled === !1 ? b.$slideTrack.css(c) : (c = {}, b.cssTransitions === !1 ? (c[b.animType] = "translate(" + d + ", " + e + ")", b.$slideTrack.css(c)) : (c[b.animType] = "translate3d(" + d + ", " + e + ", 0px)", b.$slideTrack.css(c)));
  }, b.prototype.setDimensions = function () {
    var a = this;
    a.options.vertical === !1 ? a.options.centerMode === !0 && a.$list.css({
      padding: "0px " + a.options.centerPadding
    }) : (a.$list.height(a.$slides.first().outerHeight(!0) * a.options.slidesToShow), a.options.centerMode === !0 && a.$list.css({
      padding: a.options.centerPadding + " 0px"
    })), a.listWidth = a.$list.width(), a.listHeight = a.$list.height(), a.options.vertical === !1 && a.options.variableWidth === !1 ? (a.slideWidth = Math.ceil(a.listWidth / a.options.slidesToShow), a.$slideTrack.width(Math.ceil(a.slideWidth * a.$slideTrack.children(".slick-slide").length))) : a.options.variableWidth === !0 ? a.$slideTrack.width(5e3 * a.slideCount) : (a.slideWidth = Math.ceil(a.listWidth), a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0) * a.$slideTrack.children(".slick-slide").length)));
    var b = a.$slides.first().outerWidth(!0) - a.$slides.first().width();
    a.options.variableWidth === !1 && a.$slideTrack.children(".slick-slide").width(a.slideWidth - b);
  }, b.prototype.setFade = function () {
    var c,
        b = this;
    b.$slides.each(function (d, e) {
      c = b.slideWidth * d * -1, b.options.rtl === !0 ? a(e).css({
        position: "relative",
        right: c,
        top: 0,
        zIndex: b.options.zIndex - 2,
        opacity: 0
      }) : a(e).css({
        position: "relative",
        left: c,
        top: 0,
        zIndex: b.options.zIndex - 2,
        opacity: 0
      });
    }), b.$slides.eq(b.currentSlide).css({
      zIndex: b.options.zIndex - 1,
      opacity: 1
    });
  }, b.prototype.setHeight = function () {
    var a = this;

    if (1 === a.options.slidesToShow && a.options.adaptiveHeight === !0 && a.options.vertical === !1) {
      var b = a.$slides.eq(a.currentSlide).outerHeight(!0);
      a.$list.css("height", b);
    }
  }, b.prototype.setOption = b.prototype.slickSetOption = function (b, c, d) {
    var f,
        g,
        e = this;
    if ("responsive" === b && "array" === a.type(c)) for (g in c) {
      if ("array" !== a.type(e.options.responsive)) e.options.responsive = [c[g]];else {
        for (f = e.options.responsive.length - 1; f >= 0;) {
          e.options.responsive[f].breakpoint === c[g].breakpoint && e.options.responsive.splice(f, 1), f--;
        }

        e.options.responsive.push(c[g]);
      }
    } else e.options[b] = c;
    d === !0 && (e.unload(), e.reinit());
  }, b.prototype.setPosition = function () {
    var a = this;
    a.setDimensions(), a.setHeight(), a.options.fade === !1 ? a.setCSS(a.getLeft(a.currentSlide)) : a.setFade(), a.$slider.trigger("setPosition", [a]);
  }, b.prototype.setProps = function () {
    var a = this,
        b = document.body.style;
    a.positionProp = a.options.vertical === !0 ? "top" : "left", "top" === a.positionProp ? a.$slider.addClass("slick-vertical") : a.$slider.removeClass("slick-vertical"), (void 0 !== b.WebkitTransition || void 0 !== b.MozTransition || void 0 !== b.msTransition) && a.options.useCSS === !0 && (a.cssTransitions = !0), a.options.fade && ("number" == typeof a.options.zIndex ? a.options.zIndex < 3 && (a.options.zIndex = 3) : a.options.zIndex = a.defaults.zIndex), void 0 !== b.OTransform && (a.animType = "OTransform", a.transformType = "-o-transform", a.transitionType = "OTransition", void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)), void 0 !== b.MozTransform && (a.animType = "MozTransform", a.transformType = "-moz-transform", a.transitionType = "MozTransition", void 0 === b.perspectiveProperty && void 0 === b.MozPerspective && (a.animType = !1)), void 0 !== b.webkitTransform && (a.animType = "webkitTransform", a.transformType = "-webkit-transform", a.transitionType = "webkitTransition", void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)), void 0 !== b.msTransform && (a.animType = "msTransform", a.transformType = "-ms-transform", a.transitionType = "msTransition", void 0 === b.msTransform && (a.animType = !1)), void 0 !== b.transform && a.animType !== !1 && (a.animType = "transform", a.transformType = "transform", a.transitionType = "transition"), a.transformsEnabled = a.options.useTransform && null !== a.animType && a.animType !== !1;
  }, b.prototype.setSlideClasses = function (a) {
    var c,
        d,
        e,
        f,
        b = this;
    d = b.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), b.$slides.eq(a).addClass("slick-current"), b.options.centerMode === !0 ? (c = Math.floor(b.options.slidesToShow / 2), b.options.infinite === !0 && (a >= c && a <= b.slideCount - 1 - c ? b.$slides.slice(a - c, a + c + 1).addClass("slick-active").attr("aria-hidden", "false") : (e = b.options.slidesToShow + a, d.slice(e - c + 1, e + c + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === a ? d.eq(d.length - 1 - b.options.slidesToShow).addClass("slick-center") : a === b.slideCount - 1 && d.eq(b.options.slidesToShow).addClass("slick-center")), b.$slides.eq(a).addClass("slick-center")) : a >= 0 && a <= b.slideCount - b.options.slidesToShow ? b.$slides.slice(a, a + b.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : d.length <= b.options.slidesToShow ? d.addClass("slick-active").attr("aria-hidden", "false") : (f = b.slideCount % b.options.slidesToShow, e = b.options.infinite === !0 ? b.options.slidesToShow + a : a, b.options.slidesToShow == b.options.slidesToScroll && b.slideCount - a < b.options.slidesToShow ? d.slice(e - (b.options.slidesToShow - f), e + f).addClass("slick-active").attr("aria-hidden", "false") : d.slice(e, e + b.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false")), "ondemand" === b.options.lazyLoad && b.lazyLoad();
  }, b.prototype.setupInfinite = function () {
    var c,
        d,
        e,
        b = this;

    if (b.options.fade === !0 && (b.options.centerMode = !1), b.options.infinite === !0 && b.options.fade === !1 && (d = null, b.slideCount > b.options.slidesToShow)) {
      for (e = b.options.centerMode === !0 ? b.options.slidesToShow + 1 : b.options.slidesToShow, c = b.slideCount; c > b.slideCount - e; c -= 1) {
        d = c - 1, a(b.$slides[d]).clone(!0).attr("id", "").attr("data-slick-index", d - b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");
      }

      for (c = 0; e > c; c += 1) {
        d = c, a(b.$slides[d]).clone(!0).attr("id", "").attr("data-slick-index", d + b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");
      }

      b.$slideTrack.find(".slick-cloned").find("[id]").each(function () {
        a(this).attr("id", "");
      });
    }
  }, b.prototype.setPaused = function (a) {
    var b = this;
    b.options.autoplay === !0 && b.options.pauseOnHover === !0 && (b.paused = a, a ? b.autoPlayClear() : b.autoPlay());
  }, b.prototype.selectHandler = function (b) {
    var c = this,
        d = a(b.target).is(".slick-slide") ? a(b.target) : a(b.target).parents(".slick-slide"),
        e = parseInt(d.attr("data-slick-index"));
    return e || (e = 0), c.slideCount <= c.options.slidesToShow ? (c.setSlideClasses(e), void c.asNavFor(e)) : void c.slideHandler(e);
  }, b.prototype.slideHandler = function (a, b, c) {
    var d,
        e,
        f,
        g,
        h = null,
        i = this;
    return b = b || !1, i.animating === !0 && i.options.waitForAnimate === !0 || i.options.fade === !0 && i.currentSlide === a || i.slideCount <= i.options.slidesToShow ? void 0 : (b === !1 && i.asNavFor(a), d = a, h = i.getLeft(d), g = i.getLeft(i.currentSlide), i.currentLeft = null === i.swipeLeft ? g : i.swipeLeft, i.options.infinite === !1 && i.options.centerMode === !1 && (0 > a || a > i.getDotCount() * i.options.slidesToScroll) ? void (i.options.fade === !1 && (d = i.currentSlide, c !== !0 ? i.animateSlide(g, function () {
      i.postSlide(d);
    }) : i.postSlide(d))) : i.options.infinite === !1 && i.options.centerMode === !0 && (0 > a || a > i.slideCount - i.options.slidesToScroll) ? void (i.options.fade === !1 && (d = i.currentSlide, c !== !0 ? i.animateSlide(g, function () {
      i.postSlide(d);
    }) : i.postSlide(d))) : (i.options.autoplay === !0 && clearInterval(i.autoPlayTimer), e = 0 > d ? i.slideCount % i.options.slidesToScroll !== 0 ? i.slideCount - i.slideCount % i.options.slidesToScroll : i.slideCount + d : d >= i.slideCount ? i.slideCount % i.options.slidesToScroll !== 0 ? 0 : d - i.slideCount : d, i.animating = !0, i.$slider.trigger("beforeChange", [i, i.currentSlide, e]), f = i.currentSlide, i.currentSlide = e, i.setSlideClasses(i.currentSlide), i.updateDots(), i.updateArrows(), i.options.fade === !0 ? (c !== !0 ? (i.fadeSlideOut(f), i.fadeSlide(e, function () {
      i.postSlide(e);
    })) : i.postSlide(e), void i.animateHeight()) : void (c !== !0 ? i.animateSlide(h, function () {
      i.postSlide(e);
    }) : i.postSlide(e))));
  }, b.prototype.startLoad = function () {
    var a = this;
    a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.hide(), a.$nextArrow.hide()), a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.hide(), a.$slider.addClass("slick-loading");
  }, b.prototype.swipeDirection = function () {
    var a,
        b,
        c,
        d,
        e = this;
    return a = e.touchObject.startX - e.touchObject.curX, b = e.touchObject.startY - e.touchObject.curY, c = Math.atan2(b, a), d = Math.round(180 * c / Math.PI), 0 > d && (d = 360 - Math.abs(d)), 45 >= d && d >= 0 ? e.options.rtl === !1 ? "left" : "right" : 360 >= d && d >= 315 ? e.options.rtl === !1 ? "left" : "right" : d >= 135 && 225 >= d ? e.options.rtl === !1 ? "right" : "left" : e.options.verticalSwiping === !0 ? d >= 35 && 135 >= d ? "left" : "right" : "vertical";
  }, b.prototype.swipeEnd = function (a) {
    var c,
        b = this;
    if (b.dragging = !1, b.shouldClick = b.touchObject.swipeLength > 10 ? !1 : !0, void 0 === b.touchObject.curX) return !1;
    if (b.touchObject.edgeHit === !0 && b.$slider.trigger("edge", [b, b.swipeDirection()]), b.touchObject.swipeLength >= b.touchObject.minSwipe) switch (b.swipeDirection()) {
      case "left":
        c = b.options.swipeToSlide ? b.checkNavigable(b.currentSlide + b.getSlideCount()) : b.currentSlide + b.getSlideCount(), b.slideHandler(c), b.currentDirection = 0, b.touchObject = {}, b.$slider.trigger("swipe", [b, "left"]);
        break;

      case "right":
        c = b.options.swipeToSlide ? b.checkNavigable(b.currentSlide - b.getSlideCount()) : b.currentSlide - b.getSlideCount(), b.slideHandler(c), b.currentDirection = 1, b.touchObject = {}, b.$slider.trigger("swipe", [b, "right"]);
    } else b.touchObject.startX !== b.touchObject.curX && (b.slideHandler(b.currentSlide), b.touchObject = {});
  }, b.prototype.swipeHandler = function (a) {
    var b = this;
    if (!(b.options.swipe === !1 || "ontouchend" in document && b.options.swipe === !1 || b.options.draggable === !1 && -1 !== a.type.indexOf("mouse"))) switch (b.touchObject.fingerCount = a.originalEvent && void 0 !== a.originalEvent.touches ? a.originalEvent.touches.length : 1, b.touchObject.minSwipe = b.listWidth / b.options.touchThreshold, b.options.verticalSwiping === !0 && (b.touchObject.minSwipe = b.listHeight / b.options.touchThreshold), a.data.action) {
      case "start":
        b.swipeStart(a);
        break;

      case "move":
        b.swipeMove(a);
        break;

      case "end":
        b.swipeEnd(a);
    }
  }, b.prototype.swipeMove = function (a) {
    var d,
        e,
        f,
        g,
        h,
        b = this;
    return h = void 0 !== a.originalEvent ? a.originalEvent.touches : null, !b.dragging || h && 1 !== h.length ? !1 : (d = b.getLeft(b.currentSlide), b.touchObject.curX = void 0 !== h ? h[0].pageX : a.clientX, b.touchObject.curY = void 0 !== h ? h[0].pageY : a.clientY, b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curX - b.touchObject.startX, 2))), b.options.verticalSwiping === !0 && (b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curY - b.touchObject.startY, 2)))), e = b.swipeDirection(), "vertical" !== e ? (void 0 !== a.originalEvent && b.touchObject.swipeLength > 4 && a.preventDefault(), g = (b.options.rtl === !1 ? 1 : -1) * (b.touchObject.curX > b.touchObject.startX ? 1 : -1), b.options.verticalSwiping === !0 && (g = b.touchObject.curY > b.touchObject.startY ? 1 : -1), f = b.touchObject.swipeLength, b.touchObject.edgeHit = !1, b.options.infinite === !1 && (0 === b.currentSlide && "right" === e || b.currentSlide >= b.getDotCount() && "left" === e) && (f = b.touchObject.swipeLength * b.options.edgeFriction, b.touchObject.edgeHit = !0), b.options.vertical === !1 ? b.swipeLeft = d + f * g : b.swipeLeft = d + f * (b.$list.height() / b.listWidth) * g, b.options.verticalSwiping === !0 && (b.swipeLeft = d + f * g), b.options.fade === !0 || b.options.touchMove === !1 ? !1 : b.animating === !0 ? (b.swipeLeft = null, !1) : void b.setCSS(b.swipeLeft)) : void 0);
  }, b.prototype.swipeStart = function (a) {
    var c,
        b = this;
    return 1 !== b.touchObject.fingerCount || b.slideCount <= b.options.slidesToShow ? (b.touchObject = {}, !1) : (void 0 !== a.originalEvent && void 0 !== a.originalEvent.touches && (c = a.originalEvent.touches[0]), b.touchObject.startX = b.touchObject.curX = void 0 !== c ? c.pageX : a.clientX, b.touchObject.startY = b.touchObject.curY = void 0 !== c ? c.pageY : a.clientY, void (b.dragging = !0));
  }, b.prototype.unfilterSlides = b.prototype.slickUnfilter = function () {
    var a = this;
    null !== a.$slidesCache && (a.unload(), a.$slideTrack.children(this.options.slide).detach(), a.$slidesCache.appendTo(a.$slideTrack), a.reinit());
  }, b.prototype.unload = function () {
    var b = this;
    a(".slick-cloned", b.$slider).remove(), b.$dots && b.$dots.remove(), b.$prevArrow && b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.remove(), b.$nextArrow && b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.remove(), b.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "");
  }, b.prototype.unslick = function (a) {
    var b = this;
    b.$slider.trigger("unslick", [b, a]), b.destroy();
  }, b.prototype.updateArrows = function () {
    var b,
        a = this;
    b = Math.floor(a.options.slidesToShow / 2), a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && !a.options.infinite && (a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === a.currentSlide ? (a.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : a.currentSlide >= a.slideCount - a.options.slidesToShow && a.options.centerMode === !1 ? (a.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : a.currentSlide >= a.slideCount - 1 && a.options.centerMode === !0 && (a.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")));
  }, b.prototype.updateDots = function () {
    var a = this;
    null !== a.$dots && (a.$dots.find("li").removeClass("slick-active").attr("aria-hidden", "true"), a.$dots.find("li").eq(Math.floor(a.currentSlide / a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden", "false"));
  }, b.prototype.visibility = function () {
    var a = this;
    document[a.hidden] ? (a.paused = !0, a.autoPlayClear()) : a.options.autoplay === !0 && (a.paused = !1, a.autoPlay());
  }, b.prototype.initADA = function () {
    var b = this;
    b.$slides.add(b.$slideTrack.find(".slick-cloned")).attr({
      "aria-hidden": "true",
      tabindex: "-1"
    }).find("a, input, button, select").attr({
      tabindex: "-1"
    }), b.$slideTrack.attr("role", "listbox"), b.$slides.not(b.$slideTrack.find(".slick-cloned")).each(function (c) {
      a(this).attr({
        role: "option",
        "aria-describedby": "slick-slide" + b.instanceUid + c
      });
    }), null !== b.$dots && b.$dots.attr("role", "tablist").find("li").each(function (c) {
      a(this).attr({
        role: "presentation",
        "aria-selected": "false",
        "aria-controls": "navigation" + b.instanceUid + c,
        id: "slick-slide" + b.instanceUid + c
      });
    }).first().attr("aria-selected", "true").end().find("button").attr("role", "button").end().closest("div").attr("role", "toolbar"), b.activateADA();
  }, b.prototype.activateADA = function () {
    var a = this;
    a.$slideTrack.find(".slick-active").attr({
      "aria-hidden": "false"
    }).find("a, input, button, select").attr({
      tabindex: "0"
    });
  }, b.prototype.focusHandler = function () {
    var b = this;
    b.$slider.on("focus.slick blur.slick", "*", function (c) {
      c.stopImmediatePropagation();
      var d = a(this);
      setTimeout(function () {
        b.isPlay && (d.is(":focus") ? (b.autoPlayClear(), b.paused = !0) : (b.paused = !1, b.autoPlay()));
      }, 0);
    });
  }, a.fn.slick = function () {
    var f,
        g,
        a = this,
        c = arguments[0],
        d = Array.prototype.slice.call(arguments, 1),
        e = a.length;

    for (f = 0; e > f; f++) {
      if ("object" == _typeof(c) || "undefined" == typeof c ? a[f].slick = new b(a[f], c) : g = a[f].slick[c].apply(a[f].slick, d), "undefined" != typeof g) return g;
    }

    return a;
  };
});

/***/ }),

/***/ 4:
/*!***************************************************************************************************************************************************************************!*\
  !*** multi ./resources/assets/plugins/slick/js/slick.min.js ./resources/assets/plugins/elevatezoom/js/jquery.elevatezoom.js ./resources/assets/plugins/productScripts.js ***!
  \***************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! D:\www\laravel\OTCommerce\1688\chinaonlinebd_web\resources\assets\plugins\slick\js\slick.min.js */"./resources/assets/plugins/slick/js/slick.min.js");
__webpack_require__(/*! D:\www\laravel\OTCommerce\1688\chinaonlinebd_web\resources\assets\plugins\elevatezoom\js\jquery.elevatezoom.js */"./resources/assets/plugins/elevatezoom/js/jquery.elevatezoom.js");
module.exports = __webpack_require__(/*! D:\www\laravel\OTCommerce\1688\chinaonlinebd_web\resources\assets\plugins\productScripts.js */"./resources/assets/plugins/productScripts.js");


/***/ })

},[[4,"/js/manifest","/js/vendor"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvYXNzZXRzL3BsdWdpbnMvZWxldmF0ZXpvb20vanMvanF1ZXJ5LmVsZXZhdGV6b29tLmpzIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9hc3NldHMvcGx1Z2lucy9wcm9kdWN0U2NyaXB0cy5qcyIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvYXNzZXRzL3BsdWdpbnMvc2xpY2svanMvc2xpY2subWluLmpzIl0sIm5hbWVzIjpbIk9iamVjdCIsImNyZWF0ZSIsIm9iaiIsIkYiLCJwcm90b3R5cGUiLCIkIiwid2luZG93IiwiZG9jdW1lbnQiLCJ1bmRlZmluZWQiLCJFbGV2YXRlWm9vbSIsImluaXQiLCJvcHRpb25zIiwiZWxlbSIsInNlbGYiLCIkZWxlbSIsImltYWdlU3JjIiwiZGF0YSIsImF0dHIiLCJleHRlbmQiLCJmbiIsImVsZXZhdGVab29tIiwidGludCIsImxlbnNDb2xvdXIiLCJsZW5zT3BhY2l0eSIsInpvb21UeXBlIiwic2hvd0xlbnMiLCJwYXJlbnQiLCJyZW1vdmVBdHRyIiwiem9vbUltYWdlIiwicmVmcmVzaCIsImdhbGxlcnkiLCJjbGljayIsImUiLCJnYWxsZXJ5QWN0aXZlQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwicHJldmVudERlZmF1bHQiLCJ6b29tSW1hZ2VQcmUiLCJzd2FwdGhlaW1hZ2UiLCJsZW5ndGgiLCJzZXRUaW1lb3V0IiwiZmV0Y2giLCJpbWdzcmMiLCJuZXdJbWciLCJJbWFnZSIsIm9ubG9hZCIsImxhcmdlV2lkdGgiLCJ3aWR0aCIsImxhcmdlSGVpZ2h0IiwiaGVpZ2h0Iiwic3RhcnRab29tIiwiY3VycmVudEltYWdlIiwib25ab29tZWRJbWFnZUxvYWRlZCIsInNyYyIsIm56V2lkdGgiLCJuekhlaWdodCIsImlzV2luZG93QWN0aXZlIiwiaXNMZW5zQWN0aXZlIiwiaXNUaW50QWN0aXZlIiwib3ZlcldpbmRvdyIsImltYWdlQ3Jvc3NmYWRlIiwiem9vbVdyYXAiLCJ3cmFwIiwiY3NzIiwiem9vbUxvY2siLCJzY3JvbGxpbmdMb2NrIiwiY2hhbmdlQmdTaXplIiwiY3VycmVudFpvb21MZXZlbCIsInpvb21MZXZlbCIsIm56T2Zmc2V0Iiwib2Zmc2V0Iiwid2lkdGhSYXRpbyIsImhlaWdodFJhdGlvIiwiem9vbVdpbmRvd1N0eWxlIiwiU3RyaW5nIiwiem9vbVdpbmRvd0JnQ29sb3VyIiwiem9vbVdpbmRvd1dpZHRoIiwiem9vbVdpbmRvd0hlaWdodCIsImJvcmRlclNpemUiLCJib3JkZXJDb2xvdXIiLCJib3JkZXJXaWR0aCIsImN1cnNvciIsImxlbnNIZWlnaHQiLCJsZW5zV2lkdGgiLCJsZW5zU3R5bGUiLCJsZW5zQm9yZGVyU2l6ZSIsImxlbnNCb3JkZXJDb2xvdXIiLCJ0aW50U3R5bGUiLCJ0aW50Q29sb3VyIiwibGVuc1JvdW5kIiwibGVuc1NpemUiLCJsZW5zU2hhcGUiLCJ6b29tQ29udGFpbmVyIiwibGVmdCIsInRvcCIsImFwcGVuZCIsImNvbnRhaW5MZW5zWm9vbSIsInpvb21MZW5zIiwiYXBwZW5kVG8iLCJ0cmlnZ2VyIiwidGludENvbnRhaW5lciIsInpvb21UaW50Iiwiem9vbVRpbnRjc3MiLCJhZnRlciIsInpvb21UaW50SW1hZ2UiLCJpc05hTiIsInpvb21XaW5kb3dQb3NpdGlvbiIsInpvb21XaW5kb3ciLCJ3aW5kb3dPZmZzZXRMZWZ0Iiwid2luZG93T2Zmc2V0VG9wIiwiem9vbVdpbmRvd0NvbnRhaW5lciIsImJhY2tncm91bmRJbWFnZSIsImJpbmQiLCJ0b3VjaCIsIm9yaWdpbmFsRXZlbnQiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJzZXRQb3NpdGlvbiIsInNob3dIaWRlV2luZG93Iiwic2hvd0hpZGVMZW5zIiwic2hvd0hpZGVUaW50Iiwic2V0RWxlbWVudHMiLCJsYXN0WCIsImNsaWVudFgiLCJsYXN0WSIsImNsaWVudFkiLCJjdXJyZW50TG9jIiwiYWRkIiwibW91c2VlbnRlciIsIm1vdXNlbGVhdmUiLCJzY3JvbGxMb2NrIiwib25EZXN0cm95IiwibWluWm9vbUxldmVsIiwic2Nyb2xsWm9vbUluY3JlbWVudCIsInNjcm9sbFpvb20iLCJjbGVhclRpbWVvdXQiLCJ0aGVFdmVudCIsIndoZWVsRGVsdGEiLCJkZXRhaWwiLCJzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24iLCJzdG9wUHJvcGFnYXRpb24iLCJjaGFuZ2Vab29tTGV2ZWwiLCJtYXhab29tTGV2ZWwiLCJwYXJzZUZsb2F0IiwidHlwZSIsInpvb21FbmFibGVkIiwiaXNXaW5kb3dTZXQiLCJyZXNwb25zaXZlIiwibW91c2VMZWZ0IiwicGFyc2VJbnQiLCJwYWdlWCIsIm1vdXNlVG9wIiwicGFnZVkiLCJFdG9wcG9zIiwiRWJvcHBvcyIsIkVsb3Bwb3MiLCJFcm9wcG9zIiwibGVuc0xlZnRQb3MiLCJNYXRoIiwiZmxvb3IiLCJsZW5zVG9wUG9zIiwid2luZG93TGVmdFBvcyIsInRpbnRwb3MiLCJtYXgiLCJ3aW5kb3dUb3BQb3MiLCJiYWNrZ3JvdW5kUG9zaXRpb24iLCJuZXd2YWx1ZWhlaWdodCIsIm5ld3ZhbHVld2lkdGgiLCJzZXRXaW5kb3dQb3N0aXRpb24iLCJzZXRUaW50UG9zaXRpb24iLCJmdWxsd2lkdGgiLCJjaGFuZ2UiLCJ6b29tV2luZG93RmFkZUluIiwic3RvcCIsImZhZGVJbiIsInNob3ciLCJ6b29tV2luZG93RmFkZU91dCIsImZhZGVPdXQiLCJsb29wIiwiY2xlYXJJbnRlcnZhbCIsImhpZGUiLCJsZW5zRmFkZUluIiwibGVuc0ZhZGVPdXQiLCJ6b29tVGludEZhZGVJbiIsIm9wYWNpdHkiLCJ0aW50T3BhY2l0eSIsImFuaW1hdGUiLCJ6b29tVGludEZhZGVPdXQiLCJzZXRMZW5zUG9zdGl0aW9uIiwiem9vbVdpbmRvd09mZmV0eSIsImV4dGVybmFsQ29udGFpbmVyIiwiZXh0ZXJuYWxDb250YWluZXJXaWR0aCIsImV4dGVybmFsQ29udGFpbmVySGVpZ2h0IiwiZXh0ZXJuYWxDb250YWluZXJPZmZzZXQiLCJ6b29tV2luZG93T2ZmZXR4IiwiZnVsbGhlaWdodCIsImVhc2luZyIsInhwIiwieXAiLCJzZXRJbnRlcnZhbCIsImVhc2luZ0Ftb3VudCIsInJvdW5kIiwiYWJzIiwidGludHBvc3kiLCJzbWFsbGltYWdlIiwibGFyZ2VpbWFnZSIsImxvYWRpbmdJY29uIiwic3Bpbm5lciIsIm9uSW1hZ2VTd2FwIiwic3dhcEFjdGlvbiIsIm5ld0ltZzIiLCJvbkltYWdlU3dhcENvbXBsZXRlIiwiZG9uZUNhbGxiYWNrIiwib2xkSW1nIiwiY2xvbmUiLCJyZW1vdmUiLCJvbGRJbWdUaW50IiwibmV3SW1nVGludCIsImNvbnN0cmFpblR5cGUiLCJjb25zdHJhaW5TaXplIiwiY29uc3R3aWR0aCIsImNvbnN0aGVpZ2h0IiwiZ2V0Q3VycmVudEltYWdlIiwiZ2V0R2FsbGVyeUxpc3QiLCJnYWxsZXJ5bGlzdCIsImVhY2giLCJpbWdfc3JjIiwidW5zaGlmdCIsImhyZWYiLCJ0aXRsZSIsImZpbmQiLCJwdXNoIiwidmFsdWUiLCJuZXd2YWx1ZSIsInRvRml4ZWQiLCJtYXhoZWlnaHRuZXd2YWx1ZSIsIm1heHdpZHRodG5ld3ZhbHVlIiwic2NyY29udGludWUiLCJjaGFuZ2Vab29tIiwiY2xvc2VBbGwiLCJjaGFuZ2VTdGF0ZSIsImVsZXZhdGUiLCJ6b29tQWN0aXZhdGlvbiIsInByZWxvYWRpbmciLCJkZWJ1ZyIsInpvb21XaW5kb3dBbHdheXNTaG93IiwibGVuc3pvb20iLCJvbkNvbXBsZXRlIiwibm9vcCIsImpRdWVyeSIsImltYWdlIiwiem9vbUFjdGl2ZSIsInJlbW92ZURhdGEiLCJtYWduaWZpY1BvcHVwIiwiZGVmYXVsdHMiLCJjYWxsYmFja3MiLCJvcGVuIiwiY2xvc2UiLCJzbGljZSIsImdhbGxlcnlab29tIiwiZGVsZWdhdGUiLCJlbmFibGVkIiwiZWxlbWVudFBhcnNlIiwiaXRlbSIsImVsIiwib24iLCJhY3R1YWwiLCJpbmRleCIsInByZWxvYWRlciIsIm1haW5DbGFzcyIsImFqYXhDb250ZW50QWRkZWQiLCJjYXJvdXNlbF9zbGlkZXIiLCJzbGlja19zbGlkZXIiLCJyZW1vdmFsRGVsYXkiLCJmaXhlZENvbnRlbnRQb3MiLCIkc2xpY2tfY2Fyb3VzZWwiLCJzbGljayIsImFycm93cyIsImRvdHMiLCJpbmZpbml0ZSIsImNlbnRlck1vZGUiLCJ2ZXJ0aWNhbCIsImZhZGUiLCJjc3NFYXNlIiwiYXV0b3BsYXkiLCJ2ZXJ0aWNhbFN3aXBpbmciLCJhdXRvcGxheVNwZWVkIiwic3BlZWQiLCJwYXVzZU9uSG92ZXIiLCJkcmFnZ2FibGUiLCJzbGlkZXNUb1Nob3ciLCJzbGlkZXNUb1Njcm9sbCIsImFzTmF2Rm9yIiwiZm9jdXNPblNlbGVjdCIsImdldF9jb2xvciIsInNpYmxpbmdzIiwiZW5kIiwiJGZpbHRlcl9zZWxlY3RvciIsImEiLCJiIiwiYyIsInNsaWRlciIsInJhbmdlIiwibWluIiwidmFsdWVzIiwic2xpZGUiLCJldmVudCIsInVpIiwiaHRtbCIsInZhbCIsIm9uU3RhciIsInN0YXJzIiwiY2hpbGRyZW4iLCJpIiwiZGVmaW5lIiwiU2xpY2siLCJkIiwiZiIsImFjY2Vzc2liaWxpdHkiLCJhZGFwdGl2ZUhlaWdodCIsImFwcGVuZEFycm93cyIsImFwcGVuZERvdHMiLCJwcmV2QXJyb3ciLCJuZXh0QXJyb3ciLCJjZW50ZXJQYWRkaW5nIiwiY3VzdG9tUGFnaW5nIiwiZG90c0NsYXNzIiwiZWRnZUZyaWN0aW9uIiwiaW5pdGlhbFNsaWRlIiwibGF6eUxvYWQiLCJtb2JpbGVGaXJzdCIsInBhdXNlT25Eb3RzSG92ZXIiLCJyZXNwb25kVG8iLCJyb3dzIiwicnRsIiwic2xpZGVzUGVyUm93Iiwic3dpcGUiLCJzd2lwZVRvU2xpZGUiLCJ0b3VjaE1vdmUiLCJ0b3VjaFRocmVzaG9sZCIsInVzZUNTUyIsInVzZVRyYW5zZm9ybSIsInZhcmlhYmxlV2lkdGgiLCJ3YWl0Rm9yQW5pbWF0ZSIsInpJbmRleCIsImluaXRpYWxzIiwiYW5pbWF0aW5nIiwiZHJhZ2dpbmciLCJhdXRvUGxheVRpbWVyIiwiY3VycmVudERpcmVjdGlvbiIsImN1cnJlbnRMZWZ0IiwiY3VycmVudFNsaWRlIiwiZGlyZWN0aW9uIiwiJGRvdHMiLCJsaXN0V2lkdGgiLCJsaXN0SGVpZ2h0IiwibG9hZEluZGV4IiwiJG5leHRBcnJvdyIsIiRwcmV2QXJyb3ciLCJzbGlkZUNvdW50Iiwic2xpZGVXaWR0aCIsIiRzbGlkZVRyYWNrIiwiJHNsaWRlcyIsInNsaWRpbmciLCJzbGlkZU9mZnNldCIsInN3aXBlTGVmdCIsIiRsaXN0IiwidG91Y2hPYmplY3QiLCJ0cmFuc2Zvcm1zRW5hYmxlZCIsInVuc2xpY2tlZCIsImFjdGl2ZUJyZWFrcG9pbnQiLCJhbmltVHlwZSIsImFuaW1Qcm9wIiwiYnJlYWtwb2ludHMiLCJicmVha3BvaW50U2V0dGluZ3MiLCJjc3NUcmFuc2l0aW9ucyIsImhpZGRlbiIsInBhdXNlZCIsInBvc2l0aW9uUHJvcCIsInJvd0NvdW50Iiwic2hvdWxkQ2xpY2siLCIkc2xpZGVyIiwiJHNsaWRlc0NhY2hlIiwidHJhbnNmb3JtVHlwZSIsInRyYW5zaXRpb25UeXBlIiwidmlzaWJpbGl0eUNoYW5nZSIsIndpbmRvd1dpZHRoIiwid2luZG93VGltZXIiLCJvcmlnaW5hbFNldHRpbmdzIiwibW96SGlkZGVuIiwid2Via2l0SGlkZGVuIiwiYXV0b1BsYXkiLCJwcm94eSIsImF1dG9QbGF5Q2xlYXIiLCJjaGFuZ2VTbGlkZSIsImNsaWNrSGFuZGxlciIsInNlbGVjdEhhbmRsZXIiLCJzd2lwZUhhbmRsZXIiLCJkcmFnSGFuZGxlciIsImtleUhhbmRsZXIiLCJhdXRvUGxheUl0ZXJhdG9yIiwiaW5zdGFuY2VVaWQiLCJodG1sRXhwciIsInJlZ2lzdGVyQnJlYWtwb2ludHMiLCJjaGVja1Jlc3BvbnNpdmUiLCJhZGRTbGlkZSIsInNsaWNrQWRkIiwidW5sb2FkIiwiaW5zZXJ0QmVmb3JlIiwiZXEiLCJpbnNlcnRBZnRlciIsInByZXBlbmRUbyIsImRldGFjaCIsInJlaW5pdCIsImFuaW1hdGVIZWlnaHQiLCJvdXRlckhlaWdodCIsImFuaW1hdGVTbGlkZSIsImFuaW1TdGFydCIsImR1cmF0aW9uIiwic3RlcCIsImNlaWwiLCJjb21wbGV0ZSIsImNhbGwiLCJhcHBseVRyYW5zaXRpb24iLCJkaXNhYmxlVHJhbnNpdGlvbiIsIm5vdCIsInNsaWRlSGFuZGxlciIsImJ1aWxkQXJyb3dzIiwidGVzdCIsInRhYmluZGV4IiwiYnVpbGREb3RzIiwiZ2V0RG90Q291bnQiLCJmaXJzdCIsImJ1aWxkT3V0Iiwid3JhcEFsbCIsInNldHVwSW5maW5pdGUiLCJ1cGRhdGVEb3RzIiwic2V0U2xpZGVDbGFzc2VzIiwiYnVpbGRSb3dzIiwiZyIsImgiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwiY3JlYXRlRWxlbWVudCIsImoiLCJrIiwiZ2V0IiwiYXBwZW5kQ2hpbGQiLCJkaXNwbGF5IiwiaW5uZXJXaWR0aCIsImhhc093blByb3BlcnR5IiwidW5zbGljayIsInRhcmdldCIsImlzIiwiY2xvc2VzdCIsIm1lc3NhZ2UiLCJjaGVja05hdmlnYWJsZSIsImdldE5hdmlnYWJsZUluZGV4ZXMiLCJjbGVhblVwRXZlbnRzIiwib2ZmIiwic2V0UGF1c2VkIiwidmlzaWJpbGl0eSIsIm9yaWVudGF0aW9uQ2hhbmdlIiwicmVzaXplIiwiY2xlYW5VcFJvd3MiLCJkZXN0cm95IiwiZmFkZVNsaWRlIiwiZmFkZVNsaWRlT3V0IiwiZmlsdGVyU2xpZGVzIiwic2xpY2tGaWx0ZXIiLCJmaWx0ZXIiLCJnZXRDdXJyZW50Iiwic2xpY2tDdXJyZW50U2xpZGUiLCJnZXRMZWZ0Iiwib2Zmc2V0TGVmdCIsIm91dGVyV2lkdGgiLCJnZXRPcHRpb24iLCJzbGlja0dldE9wdGlvbiIsImdldFNsaWNrIiwiZ2V0U2xpZGVDb3VudCIsImdvVG8iLCJzbGlja0dvVG8iLCJoYXNDbGFzcyIsInNldFByb3BzIiwic3RhcnRMb2FkIiwibG9hZFNsaWRlciIsImluaXRpYWxpemVFdmVudHMiLCJ1cGRhdGVBcnJvd3MiLCJpbml0QURBIiwiaW5pdEFycm93RXZlbnRzIiwiaW5pdERvdEV2ZW50cyIsImFjdGlvbiIsImluaXRVSSIsInRhZ05hbWUiLCJtYXRjaCIsImtleUNvZGUiLCJwcm9ncmVzc2l2ZUxhenlMb2FkIiwibmV4dCIsInNsaWNrTmV4dCIsInBhdXNlIiwic2xpY2tQYXVzZSIsInBsYXkiLCJzbGlja1BsYXkiLCJwb3N0U2xpZGUiLCJwcmV2Iiwic2xpY2tQcmV2IiwibG9hZCIsImVycm9yIiwiYnJlYWtwb2ludCIsInNwbGljZSIsInNldHRpbmdzIiwic29ydCIsImZvY3VzSGFuZGxlciIsIndpbmRvd0RlbGF5IiwicmVtb3ZlU2xpZGUiLCJzbGlja1JlbW92ZSIsInNldENTUyIsInNldERpbWVuc2lvbnMiLCJwYWRkaW5nIiwic2V0RmFkZSIsInBvc2l0aW9uIiwicmlnaHQiLCJzZXRIZWlnaHQiLCJzZXRPcHRpb24iLCJzbGlja1NldE9wdGlvbiIsImJvZHkiLCJzdHlsZSIsIldlYmtpdFRyYW5zaXRpb24iLCJNb3pUcmFuc2l0aW9uIiwibXNUcmFuc2l0aW9uIiwiT1RyYW5zZm9ybSIsInBlcnNwZWN0aXZlUHJvcGVydHkiLCJ3ZWJraXRQZXJzcGVjdGl2ZSIsIk1velRyYW5zZm9ybSIsIk1velBlcnNwZWN0aXZlIiwid2Via2l0VHJhbnNmb3JtIiwibXNUcmFuc2Zvcm0iLCJ0cmFuc2Zvcm0iLCJwYXJlbnRzIiwic3dpcGVEaXJlY3Rpb24iLCJzdGFydFgiLCJjdXJYIiwic3RhcnRZIiwiY3VyWSIsImF0YW4yIiwiUEkiLCJzd2lwZUVuZCIsInN3aXBlTGVuZ3RoIiwiZWRnZUhpdCIsIm1pblN3aXBlIiwiaW5kZXhPZiIsImZpbmdlckNvdW50Iiwic3dpcGVTdGFydCIsInN3aXBlTW92ZSIsInNxcnQiLCJwb3ciLCJ1bmZpbHRlclNsaWRlcyIsInNsaWNrVW5maWx0ZXIiLCJyb2xlIiwiaWQiLCJhY3RpdmF0ZUFEQSIsImlzUGxheSIsImFyZ3VtZW50cyIsIkFycmF5IiwiYXBwbHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0FBWDtBQUFzRixPQUFsRyxFQUFtRyxDQUFuRyxDQUFWO0FBQWdILEtBQWpOO0FBQW1OLEdBRDU1TyxFQUM2NU83RixDQUFDLENBQUN2UixFQUFGLENBQUtpUSxLQUFMLEdBQVcsWUFBVTtBQUFDLFFBQUl5QyxDQUFKO0FBQUEsUUFBTTBILENBQU47QUFBQSxRQUFRN0ksQ0FBQyxHQUFDLElBQVY7QUFBQSxRQUFlRSxDQUFDLEdBQUNxUSxTQUFTLENBQUMsQ0FBRCxDQUExQjtBQUFBLFFBQThCclAsQ0FBQyxHQUFDc1AsS0FBSyxDQUFDOWlCLFNBQU4sQ0FBZ0I4UCxLQUFoQixDQUFzQm9LLElBQXRCLENBQTJCMkksU0FBM0IsRUFBcUMsQ0FBckMsQ0FBaEM7QUFBQSxRQUF3RWpoQixDQUFDLEdBQUMwUSxDQUFDLENBQUNuUSxNQUE1RTs7QUFBbUYsU0FBSXNSLENBQUMsR0FBQyxDQUFOLEVBQVE3UixDQUFDLEdBQUM2UixDQUFWLEVBQVlBLENBQUMsRUFBYjtBQUFnQixVQUFHLG9CQUFpQmpCLENBQWpCLEtBQW9CLGVBQWEsT0FBT0EsQ0FBeEMsR0FBMENGLENBQUMsQ0FBQ21CLENBQUQsQ0FBRCxDQUFLekMsS0FBTCxHQUFXLElBQUl1QixDQUFKLENBQU1ELENBQUMsQ0FBQ21CLENBQUQsQ0FBUCxFQUFXakIsQ0FBWCxDQUFyRCxHQUFtRTJJLENBQUMsR0FBQzdJLENBQUMsQ0FBQ21CLENBQUQsQ0FBRCxDQUFLekMsS0FBTCxDQUFXd0IsQ0FBWCxFQUFjdVEsS0FBZCxDQUFvQnpRLENBQUMsQ0FBQ21CLENBQUQsQ0FBRCxDQUFLekMsS0FBekIsRUFBK0J3QyxDQUEvQixDQUFyRSxFQUF1RyxlQUFhLE9BQU8ySCxDQUE5SCxFQUFnSSxPQUFPQSxDQUFQO0FBQWhKOztBQUF5SixXQUFPN0ksQ0FBUDtBQUFTLEdBRHhxUDtBQUN5cVAsQ0FEeDNQLENBQUQsQyIsImZpbGUiOiIvanMvcHJvZHVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKlx0alF1ZXJ5IGVsZXZhdGVab29tIDMuMC44XG4gKlx0RGVtbydzIGFuZCBkb2N1bWVudGF0aW9uOlxuICpcdHd3dy5lbGV2YXRld2ViLmNvLnVrL2ltYWdlLXpvb21cbiAqXG4gKlx0Q29weXJpZ2h0IChjKSAyMDEyIEFuZHJldyBFYWRlc1xuICpcdHd3dy5lbGV2YXRld2ViLmNvLnVrXG4gKlxuICpcdER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIEdQTCBhbmQgTUlUIGxpY2Vuc2VzLlxuICpcdGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTUlUX0xpY2Vuc2VcbiAqXHRodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0dOVV9HZW5lcmFsX1B1YmxpY19MaWNlbnNlXG4gKlxuXG4vKlxuICpcdGpRdWVyeSBlbGV2YXRlWm9vbSAzLjAuM1xuICpcdERlbW8ncyBhbmQgZG9jdW1lbnRhdGlvbjpcbiAqXHR3d3cuZWxldmF0ZXdlYi5jby51ay9pbWFnZS16b29tXG4gKlxuICpcdENvcHlyaWdodCAoYykgMjAxMiBBbmRyZXcgRWFkZXNcbiAqXHR3d3cuZWxldmF0ZXdlYi5jby51a1xuICpcbiAqXHREdWFsIGxpY2Vuc2VkIHVuZGVyIHRoZSBHUEwgYW5kIE1JVCBsaWNlbnNlcy5cbiAqXHRodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01JVF9MaWNlbnNlXG4gKlx0aHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9HTlVfR2VuZXJhbF9QdWJsaWNfTGljZW5zZVxuICovXG5cblxuaWYgKCB0eXBlb2YgT2JqZWN0LmNyZWF0ZSAhPT0gJ2Z1bmN0aW9uJyApIHtcblx0T2JqZWN0LmNyZWF0ZSA9IGZ1bmN0aW9uKCBvYmogKSB7XG5cdFx0ZnVuY3Rpb24gRigpIHt9O1xuXHRcdEYucHJvdG90eXBlID0gb2JqO1xuXHRcdHJldHVybiBuZXcgRigpO1xuXHR9O1xufVxuXG4oZnVuY3Rpb24oICQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCApIHtcblx0dmFyIEVsZXZhdGVab29tID0ge1xuXHRcdFx0aW5pdDogZnVuY3Rpb24oIG9wdGlvbnMsIGVsZW0gKSB7XG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdFx0XHRzZWxmLmVsZW0gPSBlbGVtO1xuXHRcdFx0XHRzZWxmLiRlbGVtID0gJCggZWxlbSApO1xuXG5cdFx0XHRcdHNlbGYuaW1hZ2VTcmMgPSBzZWxmLiRlbGVtLmRhdGEoXCJ6b29tLWltYWdlXCIpID8gc2VsZi4kZWxlbS5kYXRhKFwiem9vbS1pbWFnZVwiKSA6IHNlbGYuJGVsZW0uYXR0cihcInNyY1wiKTtcblxuXHRcdFx0XHRzZWxmLm9wdGlvbnMgPSAkLmV4dGVuZCgge30sICQuZm4uZWxldmF0ZVpvb20ub3B0aW9ucywgb3B0aW9ucyApO1xuXG5cdFx0XHRcdC8vVElOVCBPVkVSUklERSBTRVRUSU5HU1xuXHRcdFx0XHRpZihzZWxmLm9wdGlvbnMudGludCkge1xuXHRcdFx0XHRcdHNlbGYub3B0aW9ucy5sZW5zQ29sb3VyID0gXCJub25lXCIsIC8vY29sb3VyIG9mIHRoZSBsZW5zIGJhY2tncm91bmRcblx0XHRcdFx0XHRzZWxmLm9wdGlvbnMubGVuc09wYWNpdHkgPSAgXCIxXCIgLy9vcGFjaXR5IG9mIHRoZSBsZW5zXG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9JTk5FUiBPVkVSUklERSBTRVRUSU5HU1xuXHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJpbm5lclwiKSB7c2VsZi5vcHRpb25zLnNob3dMZW5zID0gZmFsc2U7fVxuXG5cblx0XHRcdFx0Ly9SZW1vdmUgYWx0IG9uIGhvdmVyXG5cblx0XHRcdFx0c2VsZi4kZWxlbS5wYXJlbnQoKS5yZW1vdmVBdHRyKCd0aXRsZScpLnJlbW92ZUF0dHIoJ2FsdCcpO1xuXG5cdFx0XHRcdHNlbGYuem9vbUltYWdlID0gc2VsZi5pbWFnZVNyYztcblxuXHRcdFx0XHRzZWxmLnJlZnJlc2goIDEgKTtcblxuXG5cblx0XHRcdFx0Ly9DcmVhdGUgdGhlIGltYWdlIHN3YXAgZnJvbSB0aGUgZ2FsbGVyeVxuXHRcdFx0XHQkKCcjJytzZWxmLm9wdGlvbnMuZ2FsbGVyeSArICcgYScpLmNsaWNrKCBmdW5jdGlvbihlKSB7XG5cblx0XHRcdFx0XHQvL1NldCBhIGNsYXNzIG9uIHRoZSBjdXJyZW50bHkgYWN0aXZlIGdhbGxlcnkgaW1hZ2Vcblx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuZ2FsbGVyeUFjdGl2ZUNsYXNzKXtcblx0XHRcdFx0XHRcdCQoJyMnK3NlbGYub3B0aW9ucy5nYWxsZXJ5ICsgJyBhJykucmVtb3ZlQ2xhc3Moc2VsZi5vcHRpb25zLmdhbGxlcnlBY3RpdmVDbGFzcyk7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKHNlbGYub3B0aW9ucy5nYWxsZXJ5QWN0aXZlQ2xhc3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL3N0b3AgYW55IGxpbmsgb24gdGhlIGEgdGFnIGZyb20gd29ya2luZ1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdC8vY2FsbCB0aGUgc3dhcCBpbWFnZSBmdW5jdGlvblxuXHRcdFx0XHRcdGlmKCQodGhpcykuZGF0YShcInpvb20taW1hZ2VcIikpe3NlbGYuem9vbUltYWdlUHJlID0gJCh0aGlzKS5kYXRhKFwiem9vbS1pbWFnZVwiKX1cblx0XHRcdFx0XHRlbHNle3NlbGYuem9vbUltYWdlUHJlID0gJCh0aGlzKS5kYXRhKFwiaW1hZ2VcIik7fVxuXHRcdFx0XHRcdHNlbGYuc3dhcHRoZWltYWdlKCQodGhpcykuZGF0YShcImltYWdlXCIpLCBzZWxmLnpvb21JbWFnZVByZSk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSxcblxuXHRcdFx0cmVmcmVzaDogZnVuY3Rpb24oIGxlbmd0aCApIHtcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0c2VsZi5mZXRjaChzZWxmLmltYWdlU3JjKTtcblxuXHRcdFx0XHR9LCBsZW5ndGggfHwgc2VsZi5vcHRpb25zLnJlZnJlc2ggKTtcblx0XHRcdH0sXG5cblx0XHRcdGZldGNoOiBmdW5jdGlvbihpbWdzcmMpIHtcblx0XHRcdFx0Ly9nZXQgdGhlIGltYWdlXG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFx0dmFyIG5ld0ltZyA9IG5ldyBJbWFnZSgpO1xuXHRcdFx0XHRuZXdJbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Ly9zZXQgdGhlIGxhcmdlIGltYWdlIGRpbWVuc2lvbnMgLSB1c2VkIHRvIGNhbGN1bHRlIHJhdGlvJ3Ncblx0XHRcdFx0XHRzZWxmLmxhcmdlV2lkdGggPSBuZXdJbWcud2lkdGg7XG5cdFx0XHRcdFx0c2VsZi5sYXJnZUhlaWdodCA9IG5ld0ltZy5oZWlnaHQ7XG5cdFx0XHRcdFx0Ly9vbmNlIGltYWdlIGlzIGxvYWRlZCBzdGFydCB0aGUgY2FsbHNcblx0XHRcdFx0XHRzZWxmLnN0YXJ0Wm9vbSgpO1xuXHRcdFx0XHRcdHNlbGYuY3VycmVudEltYWdlID0gc2VsZi5pbWFnZVNyYztcblx0XHRcdFx0XHQvL2xldCBjYWxsZXIga25vdyBpbWFnZSBoYXMgYmVlbiBsb2FkZWRcblx0XHRcdFx0XHRzZWxmLm9wdGlvbnMub25ab29tZWRJbWFnZUxvYWRlZChzZWxmLiRlbGVtKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXdJbWcuc3JjID0gaW1nc3JjOyAvLyB0aGlzIG11c3QgYmUgZG9uZSBBRlRFUiBzZXR0aW5nIG9ubG9hZFxuXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0fSxcblxuXHRcdFx0c3RhcnRab29tOiBmdW5jdGlvbiggKSB7XG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFx0Ly9nZXQgZGltZW5zaW9ucyBvZiB0aGUgbm9uIHpvb21lZCBpbWFnZVxuXHRcdFx0XHRzZWxmLm56V2lkdGggPSBzZWxmLiRlbGVtLndpZHRoKCk7XG5cdFx0XHRcdHNlbGYubnpIZWlnaHQgPSBzZWxmLiRlbGVtLmhlaWdodCgpO1xuXG5cdFx0XHRcdC8vYWN0aXZhdGVkIGVsZW1lbnRzXG5cdFx0XHRcdHNlbGYuaXNXaW5kb3dBY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0c2VsZi5pc0xlbnNBY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0c2VsZi5pc1RpbnRBY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0c2VsZi5vdmVyV2luZG93ID0gZmFsc2U7XG5cblx0XHRcdFx0Ly9Dcm9zc0ZhZGUgV3JhcHBlXG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy5pbWFnZUNyb3NzZmFkZSl7XG5cdFx0XHRcdFx0c2VsZi56b29tV3JhcCA9IHNlbGYuJGVsZW0ud3JhcCgnPGRpdiBzdHlsZT1cImhlaWdodDonK3NlbGYubnpIZWlnaHQrJ3B4O3dpZHRoOicrc2VsZi5ueldpZHRoKydweDtcIiBjbGFzcz1cInpvb21XcmFwcGVyXCIgLz4nKTtcblx0XHRcdFx0XHRzZWxmLiRlbGVtLmNzcygncG9zaXRpb24nLCAnYWJzb2x1dGUnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNlbGYuem9vbUxvY2sgPSAxO1xuXHRcdFx0XHRzZWxmLnNjcm9sbGluZ0xvY2sgPSBmYWxzZTtcblx0XHRcdFx0c2VsZi5jaGFuZ2VCZ1NpemUgPSBmYWxzZTtcblx0XHRcdFx0c2VsZi5jdXJyZW50Wm9vbUxldmVsID0gc2VsZi5vcHRpb25zLnpvb21MZXZlbDtcblxuXG5cdFx0XHRcdC8vZ2V0IG9mZnNldCBvZiB0aGUgbm9uIHpvb21lZCBpbWFnZVxuXHRcdFx0XHRzZWxmLm56T2Zmc2V0ID0gc2VsZi4kZWxlbS5vZmZzZXQoKTtcblx0XHRcdFx0Ly9jYWxjdWxhdGUgdGhlIHdpZHRoIHJhdGlvIG9mIHRoZSBsYXJnZS9zbWFsbCBpbWFnZVxuXHRcdFx0XHRzZWxmLndpZHRoUmF0aW8gPSAoc2VsZi5sYXJnZVdpZHRoL3NlbGYuY3VycmVudFpvb21MZXZlbCkgLyBzZWxmLm56V2lkdGg7XG5cdFx0XHRcdHNlbGYuaGVpZ2h0UmF0aW8gPSAoc2VsZi5sYXJnZUhlaWdodC9zZWxmLmN1cnJlbnRab29tTGV2ZWwpIC8gc2VsZi5uekhlaWdodDtcblxuXG5cdFx0XHRcdC8vaWYgd2luZG93IHpvb21cblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlID09IFwid2luZG93XCIpIHtcblx0XHRcdFx0XHRzZWxmLnpvb21XaW5kb3dTdHlsZSA9IFwib3ZlcmZsb3c6IGhpZGRlbjtcIlxuXHRcdFx0XHRcdFx0KyBcImJhY2tncm91bmQtcG9zaXRpb246IDBweCAwcHg7dGV4dC1hbGlnbjpjZW50ZXI7XCJcblx0XHRcdFx0XHRcdCsgXCJiYWNrZ3JvdW5kLWNvbG9yOiBcIiArIFN0cmluZyhzZWxmLm9wdGlvbnMuem9vbVdpbmRvd0JnQ29sb3VyKVxuXHRcdFx0XHRcdFx0KyBcIjt3aWR0aDogXCIgKyBTdHJpbmcoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dXaWR0aCkgKyBcInB4O1wiXG5cdFx0XHRcdFx0XHQrIFwiaGVpZ2h0OiBcIiArIFN0cmluZyhzZWxmLm9wdGlvbnMuem9vbVdpbmRvd0hlaWdodClcblx0XHRcdFx0XHRcdCsgXCJweDtmbG9hdDogbGVmdDtcIlxuXHRcdFx0XHRcdFx0KyBcImJhY2tncm91bmQtc2l6ZTogXCIrIHNlbGYubGFyZ2VXaWR0aC9zZWxmLmN1cnJlbnRab29tTGV2ZWwrIFwicHggXCIgK3NlbGYubGFyZ2VIZWlnaHQvc2VsZi5jdXJyZW50Wm9vbUxldmVsICsgXCJweDtcIlxuXHRcdFx0XHRcdFx0KyBcImRpc3BsYXk6IG5vbmU7ei1pbmRleDoxMDA7XCJcblx0XHRcdFx0XHRcdCsgXCJib3JkZXI6IFwiICsgU3RyaW5nKHNlbGYub3B0aW9ucy5ib3JkZXJTaXplKVxuXHRcdFx0XHRcdFx0KyBcInB4IHNvbGlkIFwiICsgc2VsZi5vcHRpb25zLmJvcmRlckNvbG91clxuXHRcdFx0XHRcdFx0KyBcIjtiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1wiXG5cdFx0XHRcdFx0XHQrIFwicG9zaXRpb246IGFic29sdXRlO1wiO1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHQvL2lmIGlubmVyICB6b29tXG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImlubmVyXCIpIHtcblx0XHRcdFx0XHQvL2hhcyBhIGJvcmRlciBiZWVuIHB1dCBvbiB0aGUgaW1hZ2U/IExldHMgY2F0ZXIgZm9yIHRoaXNcblxuXHRcdFx0XHRcdHZhciBib3JkZXJXaWR0aCA9IHNlbGYuJGVsZW0uY3NzKFwiYm9yZGVyLWxlZnQtd2lkdGhcIik7XG5cblx0XHRcdFx0XHRzZWxmLnpvb21XaW5kb3dTdHlsZSA9IFwib3ZlcmZsb3c6IGhpZGRlbjtcIlxuXHRcdFx0XHRcdFx0KyBcIm1hcmdpbi1sZWZ0OiBcIiArIFN0cmluZyhib3JkZXJXaWR0aCkgKyBcIjtcIlxuXHRcdFx0XHRcdFx0KyBcIm1hcmdpbi10b3A6IFwiICsgU3RyaW5nKGJvcmRlcldpZHRoKSArIFwiO1wiXG5cdFx0XHRcdFx0XHQrIFwiYmFja2dyb3VuZC1wb3NpdGlvbjogMHB4IDBweDtcIlxuXHRcdFx0XHRcdFx0KyBcIndpZHRoOiBcIiArIFN0cmluZyhzZWxmLm56V2lkdGgpICsgXCJweDtcIlxuXHRcdFx0XHRcdFx0KyBcImhlaWdodDogXCIgKyBTdHJpbmcoc2VsZi5uekhlaWdodCkgKyBcInB4O1wiXG5cdFx0XHRcdFx0XHQrIFwicHg7ZmxvYXQ6IGxlZnQ7XCJcblx0XHRcdFx0XHRcdCsgXCJkaXNwbGF5OiBub25lO1wiXG5cdFx0XHRcdFx0XHQrIFwiY3Vyc29yOlwiKyhzZWxmLm9wdGlvbnMuY3Vyc29yKStcIjtcIlxuXHRcdFx0XHRcdFx0KyBcInB4IHNvbGlkIFwiICsgc2VsZi5vcHRpb25zLmJvcmRlckNvbG91clxuXHRcdFx0XHRcdFx0KyBcIjtiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1wiXG5cdFx0XHRcdFx0XHQrIFwicG9zaXRpb246IGFic29sdXRlO1wiO1xuXHRcdFx0XHR9XG5cblxuXG5cdFx0XHRcdC8vbGVucyBzdHlsZSBmb3Igd2luZG93IHpvb21cblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlID09IFwid2luZG93XCIpIHtcblxuXG5cdFx0XHRcdFx0Ly8gYWRqdXN0IGltYWdlcyBsZXNzIHRoYW4gdGhlIHdpbmRvdyBoZWlnaHRcblxuXHRcdFx0XHRcdGlmKHNlbGYubnpIZWlnaHQgPCBzZWxmLm9wdGlvbnMuem9vbVdpbmRvd1dpZHRoL3NlbGYud2lkdGhSYXRpbyl7XG5cdFx0XHRcdFx0XHRsZW5zSGVpZ2h0ID0gc2VsZi5uekhlaWdodDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdGxlbnNIZWlnaHQgPSBTdHJpbmcoKHNlbGYub3B0aW9ucy56b29tV2luZG93SGVpZ2h0L3NlbGYuaGVpZ2h0UmF0aW8pKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihzZWxmLmxhcmdlV2lkdGggPCBzZWxmLm9wdGlvbnMuem9vbVdpbmRvd1dpZHRoKXtcblx0XHRcdFx0XHRcdGxlbnNXaWR0aCA9IHNlbGYubnpXaWR0aDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdGxlbnNXaWR0aCA9ICAoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dXaWR0aC9zZWxmLndpZHRoUmF0aW8pO1xuXHRcdFx0XHRcdH1cblxuXG5cdFx0XHRcdFx0c2VsZi5sZW5zU3R5bGUgPSBcImJhY2tncm91bmQtcG9zaXRpb246IDBweCAwcHg7d2lkdGg6IFwiICsgU3RyaW5nKChzZWxmLm9wdGlvbnMuem9vbVdpbmRvd1dpZHRoKS9zZWxmLndpZHRoUmF0aW8pICsgXCJweDtoZWlnaHQ6IFwiICsgU3RyaW5nKChzZWxmLm9wdGlvbnMuem9vbVdpbmRvd0hlaWdodCkvc2VsZi5oZWlnaHRSYXRpbylcblx0XHRcdFx0XHQrIFwicHg7ZmxvYXQ6IHJpZ2h0O2Rpc3BsYXk6IG5vbmU7XCJcblx0XHRcdFx0XHQrIFwib3ZlcmZsb3c6IGhpZGRlbjtcIlxuXHRcdFx0XHRcdCsgXCJ6LWluZGV4OiA5OTk7XCJcblx0XHRcdFx0XHQrIFwiLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVooMCk7XCJcblx0XHRcdFx0XHQrIFwib3BhY2l0eTpcIisoc2VsZi5vcHRpb25zLmxlbnNPcGFjaXR5KStcIjtmaWx0ZXI6IGFscGhhKG9wYWNpdHkgPSBcIisoc2VsZi5vcHRpb25zLmxlbnNPcGFjaXR5KjEwMCkrXCIpOyB6b29tOjE7XCJcblx0XHRcdFx0XHQrIFwid2lkdGg6XCIrbGVuc1dpZHRoK1wicHg7XCJcblx0XHRcdFx0XHQrIFwiaGVpZ2h0OlwiK2xlbnNIZWlnaHQrXCJweDtcIlxuXHRcdFx0XHRcdCsgXCJiYWNrZ3JvdW5kLWNvbG9yOlwiKyhzZWxmLm9wdGlvbnMubGVuc0NvbG91cikrXCI7XCJcblx0XHRcdFx0XHQrIFwiY3Vyc29yOlwiKyhzZWxmLm9wdGlvbnMuY3Vyc29yKStcIjtcIlxuXHRcdFx0XHRcdCsgXCJib3JkZXI6IFwiKyhzZWxmLm9wdGlvbnMubGVuc0JvcmRlclNpemUpK1wicHhcIiArXG5cdFx0XHRcdFx0XCIgc29saWQgXCIrKHNlbGYub3B0aW9ucy5sZW5zQm9yZGVyQ29sb3VyKStcIjtiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O3Bvc2l0aW9uOiBhYnNvbHV0ZTtcIjtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0Ly90aW50IHN0eWxlXG5cdFx0XHRcdHNlbGYudGludFN0eWxlID0gXCJkaXNwbGF5OiBibG9jaztcIlxuXHRcdFx0XHRcdCsgXCJwb3NpdGlvbjogYWJzb2x1dGU7XCJcblx0XHRcdFx0XHQrIFwiYmFja2dyb3VuZC1jb2xvcjogXCIrc2VsZi5vcHRpb25zLnRpbnRDb2xvdXIrXCI7XCJcblx0XHRcdFx0XHQrIFwiZmlsdGVyOmFscGhhKG9wYWNpdHk9MCk7XCJcblx0XHRcdFx0XHQrIFwib3BhY2l0eTogMDtcIlxuXHRcdFx0XHRcdCsgXCJ3aWR0aDogXCIgKyBzZWxmLm56V2lkdGggKyBcInB4O1wiXG5cdFx0XHRcdFx0KyBcImhlaWdodDogXCIgKyBzZWxmLm56SGVpZ2h0ICsgXCJweDtcIlxuXG5cdFx0XHRcdFx0O1xuXG5cdFx0XHRcdC8vbGVucyBzdHlsZSBmb3IgbGVucyB6b29tIHdpdGggb3B0aW9uYWwgcm91bmQgZm9yIG1vZGVybiBicm93c2Vyc1xuXHRcdFx0XHRzZWxmLmxlbnNSb3VuZCA9ICcnO1xuXG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImxlbnNcIikge1xuXG5cdFx0XHRcdFx0c2VsZi5sZW5zU3R5bGUgPSBcImJhY2tncm91bmQtcG9zaXRpb246IDBweCAwcHg7XCJcblx0XHRcdFx0XHRcdCsgXCJmbG9hdDogbGVmdDtkaXNwbGF5OiBub25lO1wiXG5cdFx0XHRcdFx0XHQrIFwiYm9yZGVyOiBcIiArIFN0cmluZyhzZWxmLm9wdGlvbnMuYm9yZGVyU2l6ZSkgKyBcInB4IHNvbGlkIFwiICsgc2VsZi5vcHRpb25zLmJvcmRlckNvbG91citcIjtcIlxuXHRcdFx0XHRcdFx0KyBcIndpZHRoOlwiKyBTdHJpbmcoc2VsZi5vcHRpb25zLmxlbnNTaXplKSArXCJweDtcIlxuXHRcdFx0XHRcdFx0KyBcImhlaWdodDpcIisgU3RyaW5nKHNlbGYub3B0aW9ucy5sZW5zU2l6ZSkrXCJweDtcIlxuXHRcdFx0XHRcdFx0KyBcImJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7cG9zaXRpb246IGFic29sdXRlO1wiO1xuXG5cblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0Ly9kb2VzIG5vdCByb3VuZCBpbiBhbGwgYnJvd3NlcnNcblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLmxlbnNTaGFwZSA9PSBcInJvdW5kXCIpIHtcblx0XHRcdFx0XHRzZWxmLmxlbnNSb3VuZCA9IFwiYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogXCIgKyBTdHJpbmcoc2VsZi5vcHRpb25zLmxlbnNTaXplIC8gMiArIHNlbGYub3B0aW9ucy5ib3JkZXJTaXplKSArIFwicHg7XCJcblx0XHRcdFx0XHQrIFwiYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IFwiICsgU3RyaW5nKHNlbGYub3B0aW9ucy5sZW5zU2l6ZSAvIDIgKyBzZWxmLm9wdGlvbnMuYm9yZGVyU2l6ZSkgKyBcInB4O1wiXG5cdFx0XHRcdFx0KyBcImJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IFwiICsgU3RyaW5nKHNlbGYub3B0aW9ucy5sZW5zU2l6ZSAvIDIgKyBzZWxmLm9wdGlvbnMuYm9yZGVyU2l6ZSkgKyBcInB4O1wiXG5cdFx0XHRcdFx0KyBcImJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiBcIiArIFN0cmluZyhzZWxmLm9wdGlvbnMubGVuc1NpemUgLyAyICsgc2VsZi5vcHRpb25zLmJvcmRlclNpemUpICsgXCJweDtcIjtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9jcmVhdGUgdGhlIGRpdidzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcIlwiXG5cdFx0XHRcdC8vc2VsZi56b29tQ29udGFpbmVyID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ3pvb21Db250YWluZXInKS5jc3Moe1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCIsIFwiaGVpZ2h0XCI6c2VsZi5uekhlaWdodCwgXCJ3aWR0aFwiOnNlbGYubnpXaWR0aH0pO1xuXG5cdFx0XHRcdHNlbGYuem9vbUNvbnRhaW5lciA9ICQoJzxkaXYgY2xhc3M9XCJ6b29tQ29udGFpbmVyXCIgc3R5bGU9XCItd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWigwKTtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0Oicrc2VsZi5uek9mZnNldC5sZWZ0KydweDt0b3A6JytzZWxmLm56T2Zmc2V0LnRvcCsncHg7aGVpZ2h0Oicrc2VsZi5uekhlaWdodCsncHg7d2lkdGg6JytzZWxmLm56V2lkdGgrJ3B4O1wiPjwvZGl2PicpO1xuXHRcdFx0XHQkKCdib2R5JykuYXBwZW5kKHNlbGYuem9vbUNvbnRhaW5lcik7XG5cblxuXHRcdFx0XHQvL3RoaXMgd2lsbCBhZGQgb3ZlcmZsb3cgaGlkZGVuIGFuZCBjb250cmFpbiB0aGUgbGVucyBvbiBsZW5zIG1vZGVcblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLmNvbnRhaW5MZW5zWm9vbSAmJiBzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJsZW5zXCIpe1xuXHRcdFx0XHRcdHNlbGYuem9vbUNvbnRhaW5lci5jc3MoXCJvdmVyZmxvd1wiLCBcImhpZGRlblwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgIT0gXCJpbm5lclwiKSB7XG5cdFx0XHRcdFx0c2VsZi56b29tTGVucyA9ICQoXCI8ZGl2IGNsYXNzPSd6b29tTGVucycgc3R5bGU9J1wiICsgc2VsZi5sZW5zU3R5bGUgKyBzZWxmLmxlbnNSb3VuZCArXCInPiZuYnNwOzwvZGl2PlwiKVxuXHRcdFx0XHRcdC5hcHBlbmRUbyhzZWxmLnpvb21Db250YWluZXIpXG5cdFx0XHRcdFx0LmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHNlbGYuJGVsZW0udHJpZ2dlcignY2xpY2snKTtcblx0XHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnRpbnQpIHtcblx0XHRcdFx0XHRcdHNlbGYudGludENvbnRhaW5lciA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCd0aW50Q29udGFpbmVyJyk7XG5cdFx0XHRcdFx0XHRzZWxmLnpvb21UaW50ID0gJChcIjxkaXYgY2xhc3M9J3pvb21UaW50JyBzdHlsZT0nXCIrc2VsZi50aW50U3R5bGUrXCInPjwvZGl2PlwiKTtcblxuXG5cdFx0XHRcdFx0XHRzZWxmLnpvb21MZW5zLndyYXAoc2VsZi50aW50Q29udGFpbmVyKTtcblxuXG5cdFx0XHRcdFx0XHRzZWxmLnpvb21UaW50Y3NzID0gc2VsZi56b29tTGVucy5hZnRlcihzZWxmLnpvb21UaW50KTtcblxuXHRcdFx0XHRcdFx0Ly9pZiB0aW50IGVuYWJsZWQgLSBzZXQgYW4gaW1hZ2UgdG8gc2hvdyBvdmVyIHRoZSB0aW50XG5cblx0XHRcdFx0XHRcdHNlbGYuem9vbVRpbnRJbWFnZSA9ICQoJzxpbWcgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDBweDsgdG9wOiAwcHg7IG1heC13aWR0aDogbm9uZTsgd2lkdGg6ICcrc2VsZi5ueldpZHRoKydweDsgaGVpZ2h0OiAnK3NlbGYubnpIZWlnaHQrJ3B4O1wiIHNyYz1cIicrc2VsZi5pbWFnZVNyYysnXCI+Jylcblx0XHRcdFx0XHRcdC5hcHBlbmRUbyhzZWxmLnpvb21MZW5zKVxuXHRcdFx0XHRcdFx0LmNsaWNrKGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdFx0XHRzZWxmLiRlbGVtLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblxuXG5cblxuXG5cblx0XHRcdFx0Ly9jcmVhdGUgem9vbSB3aW5kb3dcblx0XHRcdFx0aWYoaXNOYU4oc2VsZi5vcHRpb25zLnpvb21XaW5kb3dQb3NpdGlvbikpe1xuXHRcdFx0XHRcdHNlbGYuem9vbVdpbmRvdyA9ICQoXCI8ZGl2IHN0eWxlPSd6LWluZGV4Ojk5OTtsZWZ0OlwiKyhzZWxmLndpbmRvd09mZnNldExlZnQpK1wicHg7dG9wOlwiKyhzZWxmLndpbmRvd09mZnNldFRvcCkrXCJweDtcIiArIHNlbGYuem9vbVdpbmRvd1N0eWxlICsgXCInIGNsYXNzPSd6b29tV2luZG93Jz4mbmJzcDs8L2Rpdj5cIilcblx0XHRcdFx0XHQuYXBwZW5kVG8oJ2JvZHknKVxuXHRcdFx0XHRcdC5jbGljayhmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRzZWxmLiRlbGVtLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHNlbGYuem9vbVdpbmRvdyA9ICQoXCI8ZGl2IHN0eWxlPSd6LWluZGV4Ojk5OTtsZWZ0OlwiKyhzZWxmLndpbmRvd09mZnNldExlZnQpK1wicHg7dG9wOlwiKyhzZWxmLndpbmRvd09mZnNldFRvcCkrXCJweDtcIiArIHNlbGYuem9vbVdpbmRvd1N0eWxlICsgXCInIGNsYXNzPSd6b29tV2luZG93Jz4mbmJzcDs8L2Rpdj5cIilcblx0XHRcdFx0XHQuYXBwZW5kVG8oc2VsZi56b29tQ29udGFpbmVyKVxuXHRcdFx0XHRcdC5jbGljayhmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRzZWxmLiRlbGVtLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2VsZi56b29tV2luZG93Q29udGFpbmVyID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ3pvb21XaW5kb3dDb250YWluZXInKS5jc3MoXCJ3aWR0aFwiLHNlbGYub3B0aW9ucy56b29tV2luZG93V2lkdGgpO1xuXHRcdFx0XHRzZWxmLnpvb21XaW5kb3cud3JhcChzZWxmLnpvb21XaW5kb3dDb250YWluZXIpO1xuXG5cblx0XHRcdFx0Ly8gIHNlbGYuY2FwdGlvblN0eWxlID0gXCJ0ZXh0LWFsaWduOiBsZWZ0O2JhY2tncm91bmQtY29sb3I6IGJsYWNrO2NvbG9yOiB3aGl0ZTtmb250LXdlaWdodDogYm9sZDtwYWRkaW5nOiAxMHB4O2ZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO2ZvbnQtc2l6ZTogMTFweFwiO1xuXHRcdFx0XHQvLyBzZWxmLnpvb21DYXB0aW9uID0gJCgnPGRpdiBjbGFzcz1cImVsZXZhdGV6b29tLWNhcHRpb25cIiBzdHlsZT1cIicrc2VsZi5jYXB0aW9uU3R5bGUrJ2Rpc3BsYXk6IGJsb2NrOyB3aWR0aDogMjgwcHg7XCI+SU5TRVJUIEFMVCBUQUc8L2Rpdj4nKS5hcHBlbmRUbyhzZWxmLnpvb21XaW5kb3cucGFyZW50KCkpO1xuXG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImxlbnNcIikge1xuXHRcdFx0XHRcdHNlbGYuem9vbUxlbnMuY3NzKHsgYmFja2dyb3VuZEltYWdlOiBcInVybCgnXCIgKyBzZWxmLmltYWdlU3JjICsgXCInKVwiIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcIndpbmRvd1wiKSB7XG5cdFx0XHRcdFx0c2VsZi56b29tV2luZG93LmNzcyh7IGJhY2tncm91bmRJbWFnZTogXCJ1cmwoJ1wiICsgc2VsZi5pbWFnZVNyYyArIFwiJylcIiB9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJpbm5lclwiKSB7XG5cdFx0XHRcdFx0c2VsZi56b29tV2luZG93LmNzcyh7IGJhY2tncm91bmRJbWFnZTogXCJ1cmwoJ1wiICsgc2VsZi5pbWFnZVNyYyArIFwiJylcIiB9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvKi0tLS0tLS0tLS0tLS0tLS0tLS1FTkQgVEhFIFpPT00gV0lORE9XIEFORCBMRU5TLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cdFx0XHRcdC8vdG91Y2ggZXZlbnRzXG5cdFx0XHRcdHNlbGYuJGVsZW0uYmluZCgndG91Y2htb3ZlJywgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHZhciB0b3VjaCA9IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdIHx8IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXTtcblx0XHRcdFx0XHRzZWxmLnNldFBvc2l0aW9uKHRvdWNoKTtcblxuXHRcdFx0XHR9KTtcblx0XHRcdFx0c2VsZi56b29tQ29udGFpbmVyLmJpbmQoJ3RvdWNobW92ZScsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImlubmVyXCIpIHtcblx0XHRcdFx0XHRcdHNlbGYuc2hvd0hpZGVXaW5kb3coXCJzaG93XCIpO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR2YXIgdG91Y2ggPSBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXSB8fCBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG5cdFx0XHRcdFx0c2VsZi5zZXRQb3NpdGlvbih0b3VjaCk7XG5cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHNlbGYuem9vbUNvbnRhaW5lci5iaW5kKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdHNlbGYuc2hvd0hpZGVXaW5kb3coXCJoaWRlXCIpO1xuXHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy5zaG93TGVucykge3NlbGYuc2hvd0hpZGVMZW5zKFwiaGlkZVwiKTt9XG5cdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnRpbnQgJiYgc2VsZi5vcHRpb25zLnpvb21UeXBlICE9IFwiaW5uZXJcIikge3NlbGYuc2hvd0hpZGVUaW50KFwiaGlkZVwiKTt9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHNlbGYuJGVsZW0uYmluZCgndG91Y2hlbmQnLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRzZWxmLnNob3dIaWRlV2luZG93KFwiaGlkZVwiKTtcblx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuc2hvd0xlbnMpIHtzZWxmLnNob3dIaWRlTGVucyhcImhpZGVcIik7fVxuXHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy50aW50ICYmIHNlbGYub3B0aW9ucy56b29tVHlwZSAhPSBcImlubmVyXCIpIHtzZWxmLnNob3dIaWRlVGludChcImhpZGVcIik7fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnNob3dMZW5zKSB7XG5cdFx0XHRcdFx0c2VsZi56b29tTGVucy5iaW5kKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihlKXtcblxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0dmFyIHRvdWNoID0gZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0gfHwgZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXHRcdFx0XHRcdFx0c2VsZi5zZXRQb3NpdGlvbih0b3VjaCk7XG5cdFx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHRcdHNlbGYuem9vbUxlbnMuYmluZCgndG91Y2hlbmQnLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRcdHNlbGYuc2hvd0hpZGVXaW5kb3coXCJoaWRlXCIpO1xuXHRcdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnNob3dMZW5zKSB7c2VsZi5zaG93SGlkZUxlbnMoXCJoaWRlXCIpO31cblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy50aW50ICYmIHNlbGYub3B0aW9ucy56b29tVHlwZSAhPSBcImlubmVyXCIpIHtzZWxmLnNob3dIaWRlVGludChcImhpZGVcIik7fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vTmVlZGVkIHRvIHdvcmsgaW4gSUVcblx0XHRcdFx0c2VsZi4kZWxlbS5iaW5kKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRpZihzZWxmLm92ZXJXaW5kb3cgPT0gZmFsc2Upe3NlbGYuc2V0RWxlbWVudHMoXCJzaG93XCIpO31cblx0XHRcdFx0XHQvL21ha2Ugc3VyZSBvbiBvcmllbnRhdGlvbiBjaGFuZ2UgdGhlIHNldHBvc2l0aW9uIGlzIG5vdCBmaXJlZFxuXHRcdFx0XHRcdGlmKHNlbGYubGFzdFggIT09IGUuY2xpZW50WCB8fCBzZWxmLmxhc3RZICE9PSBlLmNsaWVudFkpe1xuXHRcdFx0XHRcdFx0c2VsZi5zZXRQb3NpdGlvbihlKTtcblx0XHRcdFx0XHRcdHNlbGYuY3VycmVudExvYyA9IGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNlbGYubGFzdFggPSBlLmNsaWVudFg7XG5cdFx0XHRcdFx0c2VsZi5sYXN0WSA9IGUuY2xpZW50WTtcblxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRzZWxmLnpvb21Db250YWluZXIuYmluZCgnbW91c2Vtb3ZlJywgZnVuY3Rpb24oZSl7XG5cblx0XHRcdFx0XHRpZihzZWxmLm92ZXJXaW5kb3cgPT0gZmFsc2Upe3NlbGYuc2V0RWxlbWVudHMoXCJzaG93XCIpO31cblxuXHRcdFx0XHRcdC8vbWFrZSBzdXJlIG9uIG9yaWVudGF0aW9uIGNoYW5nZSB0aGUgc2V0cG9zaXRpb24gaXMgbm90IGZpcmVkXG5cdFx0XHRcdFx0aWYoc2VsZi5sYXN0WCAhPT0gZS5jbGllbnRYIHx8IHNlbGYubGFzdFkgIT09IGUuY2xpZW50WSl7XG5cdFx0XHRcdFx0XHRzZWxmLnNldFBvc2l0aW9uKGUpO1xuXHRcdFx0XHRcdFx0c2VsZi5jdXJyZW50TG9jID0gZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c2VsZi5sYXN0WCA9IGUuY2xpZW50WDtcblx0XHRcdFx0XHRzZWxmLmxhc3RZID0gZS5jbGllbnRZO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlICE9IFwiaW5uZXJcIikge1xuXHRcdFx0XHRcdHNlbGYuem9vbUxlbnMuYmluZCgnbW91c2Vtb3ZlJywgZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0XHQvL21ha2Ugc3VyZSBvbiBvcmllbnRhdGlvbiBjaGFuZ2UgdGhlIHNldHBvc2l0aW9uIGlzIG5vdCBmaXJlZFxuXHRcdFx0XHRcdFx0aWYoc2VsZi5sYXN0WCAhPT0gZS5jbGllbnRYIHx8IHNlbGYubGFzdFkgIT09IGUuY2xpZW50WSl7XG5cdFx0XHRcdFx0XHRcdHNlbGYuc2V0UG9zaXRpb24oZSk7XG5cdFx0XHRcdFx0XHRcdHNlbGYuY3VycmVudExvYyA9IGU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzZWxmLmxhc3RYID0gZS5jbGllbnRYO1xuXHRcdFx0XHRcdFx0c2VsZi5sYXN0WSA9IGUuY2xpZW50WTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihzZWxmLm9wdGlvbnMudGludCAmJiBzZWxmLm9wdGlvbnMuem9vbVR5cGUgIT0gXCJpbm5lclwiKSB7XG5cdFx0XHRcdFx0c2VsZi56b29tVGludC5iaW5kKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRcdC8vbWFrZSBzdXJlIG9uIG9yaWVudGF0aW9uIGNoYW5nZSB0aGUgc2V0cG9zaXRpb24gaXMgbm90IGZpcmVkXG5cdFx0XHRcdFx0XHRpZihzZWxmLmxhc3RYICE9PSBlLmNsaWVudFggfHwgc2VsZi5sYXN0WSAhPT0gZS5jbGllbnRZKXtcblx0XHRcdFx0XHRcdFx0c2VsZi5zZXRQb3NpdGlvbihlKTtcblx0XHRcdFx0XHRcdFx0c2VsZi5jdXJyZW50TG9jID0gZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHNlbGYubGFzdFggPSBlLmNsaWVudFg7XG5cdFx0XHRcdFx0XHRzZWxmLmxhc3RZID0gZS5jbGllbnRZO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlID09IFwiaW5uZXJcIikge1xuXHRcdFx0XHRcdHNlbGYuem9vbVdpbmRvdy5iaW5kKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0XHQvL3NlbGYub3ZlcldpbmRvdyA9IHRydWU7XG5cdFx0XHRcdFx0XHQvL21ha2Ugc3VyZSBvbiBvcmllbnRhdGlvbiBjaGFuZ2UgdGhlIHNldHBvc2l0aW9uIGlzIG5vdCBmaXJlZFxuXHRcdFx0XHRcdFx0aWYoc2VsZi5sYXN0WCAhPT0gZS5jbGllbnRYIHx8IHNlbGYubGFzdFkgIT09IGUuY2xpZW50WSl7XG5cdFx0XHRcdFx0XHRcdHNlbGYuc2V0UG9zaXRpb24oZSk7XG5cdFx0XHRcdFx0XHRcdHNlbGYuY3VycmVudExvYyA9IGU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzZWxmLmxhc3RYID0gZS5jbGllbnRYO1xuXHRcdFx0XHRcdFx0c2VsZi5sYXN0WSA9IGUuY2xpZW50WTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHQvLyAgbGVuc0ZhZGVPdXQ6IDUwMCwgIHpvb21UaW50RmFkZUluXG5cdFx0XHRcdHNlbGYuem9vbUNvbnRhaW5lci5hZGQoc2VsZi4kZWxlbSkubW91c2VlbnRlcihmdW5jdGlvbigpe1xuXG5cdFx0XHRcdFx0aWYoc2VsZi5vdmVyV2luZG93ID09IGZhbHNlKXtzZWxmLnNldEVsZW1lbnRzKFwic2hvd1wiKTt9XG5cblxuXHRcdFx0XHR9KS5tb3VzZWxlYXZlKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0aWYoIXNlbGYuc2Nyb2xsTG9jayl7XG5cdFx0XHRcdFx0XHRzZWxmLnNldEVsZW1lbnRzKFwiaGlkZVwiKTtcbiAgICAgICAgICAgIHNlbGYub3B0aW9ucy5vbkRlc3Ryb3koc2VsZi4kZWxlbSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Ly9lbmQgb3ZlIGltYWdlXG5cblxuXG5cblxuXHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgIT0gXCJpbm5lclwiKSB7XG5cdFx0XHRcdFx0c2VsZi56b29tV2luZG93Lm1vdXNlZW50ZXIoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHNlbGYub3ZlcldpbmRvdyA9IHRydWU7XG5cdFx0XHRcdFx0XHRzZWxmLnNldEVsZW1lbnRzKFwiaGlkZVwiKTtcblx0XHRcdFx0XHR9KS5tb3VzZWxlYXZlKGZ1bmN0aW9uKCl7XG5cblx0XHRcdFx0XHRcdHNlbGYub3ZlcldpbmRvdyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vZW5kIG92ZSBpbWFnZVxuXG5cblxuLy9cdFx0XHRcdHZhciBkZWx0YSA9IHBhcnNlSW50KGUub3JpZ2luYWxFdmVudC53aGVlbERlbHRhIHx8IC1lLm9yaWdpbmFsRXZlbnQuZGV0YWlsKTtcblxuXHRcdFx0XHQvLyAgICAgICQodGhpcykuZW1wdHkoKTtcblx0XHRcdFx0Ly8gICAgcmV0dXJuIGZhbHNlO1xuXG5cdFx0XHRcdC8vZml4IGZvciBpbml0aWFsIHpvb20gc2V0dGluZ1xuXHRcdFx0XHRpZiAoc2VsZi5vcHRpb25zLnpvb21MZXZlbCAhPSAxKXtcblx0XHRcdFx0XHQvL1x0c2VsZi5jaGFuZ2Vab29tTGV2ZWwoc2VsZi5jdXJyZW50Wm9vbUxldmVsKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL3NldCB0aGUgbWluIHpvb21sZXZlbFxuXHRcdFx0XHRpZihzZWxmLm9wdGlvbnMubWluWm9vbUxldmVsKXtcblx0XHRcdFx0XHRzZWxmLm1pblpvb21MZXZlbCA9IHNlbGYub3B0aW9ucy5taW5ab29tTGV2ZWw7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRzZWxmLm1pblpvb21MZXZlbCA9IHNlbGYub3B0aW9ucy5zY3JvbGxab29tSW5jcmVtZW50ICogMjtcblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnNjcm9sbFpvb20pe1xuXG5cblx0XHRcdFx0XHRzZWxmLnpvb21Db250YWluZXIuYWRkKHNlbGYuJGVsZW0pLmJpbmQoJ21vdXNld2hlZWwgRE9NTW91c2VTY3JvbGwgTW96TW91c2VQaXhlbFNjcm9sbCcsIGZ1bmN0aW9uKGUpe1xuXG5cbi8vXHRcdFx0XHRcdFx0aW4gSUUgdGhlcmUgaXMgaXNzdWUgd2l0aCBmaXJpbmcgb2YgbW91c2VsZWF2ZSAtIFNvIGNoZWNrIHdoZXRoZXIgc3RpbGwgc2Nyb2xsaW5nXG4vL1x0XHRcdFx0XHRcdGFuZCBvbiBtb3VzZWxlYXZlIGNoZWNrIGlmIHNjcm9sbGxvY2tcblx0XHRcdFx0XHRcdHNlbGYuc2Nyb2xsTG9jayA9IHRydWU7XG5cdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQoJC5kYXRhKHRoaXMsICd0aW1lcicpKTtcblx0XHRcdFx0XHRcdCQuZGF0YSh0aGlzLCAndGltZXInLCBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRzZWxmLnNjcm9sbExvY2sgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0Ly9kbyBzb21ldGhpbmdcblx0XHRcdFx0XHRcdH0sIDI1MCkpO1xuXG5cdFx0XHRcdFx0XHR2YXIgdGhlRXZlbnQgPSBlLm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YSB8fCBlLm9yaWdpbmFsRXZlbnQuZGV0YWlsKi0xXG5cblxuXHRcdFx0XHRcdFx0Ly90aGlzLnNjcm9sbFRvcCArPSAoIGRlbHRhIDwgMCA/IDEgOiAtMSApICogMzA7XG5cdFx0XHRcdFx0XHQvLyAgIGUucHJldmVudERlZmF1bHQoKTtcblxuXG5cdFx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXG5cdFx0XHRcdFx0XHRpZih0aGVFdmVudCAvMTIwID4gMCkge1xuXHRcdFx0XHRcdFx0XHQvL3Njcm9sbGluZyB1cFxuXHRcdFx0XHRcdFx0XHRpZihzZWxmLmN1cnJlbnRab29tTGV2ZWwgPj0gc2VsZi5taW5ab29tTGV2ZWwpe1xuXHRcdFx0XHRcdFx0XHRcdHNlbGYuY2hhbmdlWm9vbUxldmVsKHNlbGYuY3VycmVudFpvb21MZXZlbC1zZWxmLm9wdGlvbnMuc2Nyb2xsWm9vbUluY3JlbWVudCk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0Ly9zY3JvbGxpbmcgZG93blxuXG5cblx0XHRcdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLm1heFpvb21MZXZlbCl7XG5cdFx0XHRcdFx0XHRcdFx0aWYoc2VsZi5jdXJyZW50Wm9vbUxldmVsIDw9IHNlbGYub3B0aW9ucy5tYXhab29tTGV2ZWwpe1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5jaGFuZ2Vab29tTGV2ZWwocGFyc2VGbG9hdChzZWxmLmN1cnJlbnRab29tTGV2ZWwpK3NlbGYub3B0aW9ucy5zY3JvbGxab29tSW5jcmVtZW50KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHQvL2FuZHlcblxuXHRcdFx0XHRcdFx0XHRcdHNlbGYuY2hhbmdlWm9vbUxldmVsKHBhcnNlRmxvYXQoc2VsZi5jdXJyZW50Wm9vbUxldmVsKStzZWxmLm9wdGlvbnMuc2Nyb2xsWm9vbUluY3JlbWVudCk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblxuXHRcdFx0fSxcblx0XHRcdHNldEVsZW1lbnRzOiBmdW5jdGlvbih0eXBlKSB7XG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYoIXNlbGYub3B0aW9ucy56b29tRW5hYmxlZCl7cmV0dXJuIGZhbHNlO31cblx0XHRcdFx0aWYodHlwZT09XCJzaG93XCIpe1xuXHRcdFx0XHRcdGlmKHNlbGYuaXNXaW5kb3dTZXQpe1xuXHRcdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlID09IFwiaW5uZXJcIikge3NlbGYuc2hvd0hpZGVXaW5kb3coXCJzaG93XCIpO31cblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcIndpbmRvd1wiKSB7c2VsZi5zaG93SGlkZVdpbmRvdyhcInNob3dcIik7fVxuXHRcdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnNob3dMZW5zKSB7c2VsZi5zaG93SGlkZUxlbnMoXCJzaG93XCIpO31cblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy50aW50ICYmIHNlbGYub3B0aW9ucy56b29tVHlwZSAhPSBcImlubmVyXCIpIHtzZWxmLnNob3dIaWRlVGludChcInNob3dcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYodHlwZT09XCJoaWRlXCIpe1xuXHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcIndpbmRvd1wiKSB7c2VsZi5zaG93SGlkZVdpbmRvdyhcImhpZGVcIik7fVxuXHRcdFx0XHRcdGlmKCFzZWxmLm9wdGlvbnMudGludCkge3NlbGYuc2hvd0hpZGVXaW5kb3coXCJoaWRlXCIpO31cblx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuc2hvd0xlbnMpIHtzZWxmLnNob3dIaWRlTGVucyhcImhpZGVcIik7fVxuXHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy50aW50KSB7XHRzZWxmLnNob3dIaWRlVGludChcImhpZGVcIik7fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0c2V0UG9zaXRpb246IGZ1bmN0aW9uKGUpIHtcblxuXHRcdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYoIXNlbGYub3B0aW9ucy56b29tRW5hYmxlZCl7cmV0dXJuIGZhbHNlO31cblxuXHRcdFx0XHQvL3JlY2FjbGMgb2Zmc2V0IGVhY2ggdGltZSBpbiBjYXNlIHRoZSBpbWFnZSBtb3Zlc1xuXHRcdFx0XHQvL3RoaXMgY2FuIGJlIGNhdXNlZCBieSBvdGhlciBvbiBwYWdlIGVsZW1lbnRzXG5cdFx0XHRcdHNlbGYubnpIZWlnaHQgPSBzZWxmLiRlbGVtLmhlaWdodCgpO1xuXHRcdFx0XHRzZWxmLm56V2lkdGggPSBzZWxmLiRlbGVtLndpZHRoKCk7XG5cdFx0XHRcdHNlbGYubnpPZmZzZXQgPSBzZWxmLiRlbGVtLm9mZnNldCgpO1xuXG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy50aW50ICYmIHNlbGYub3B0aW9ucy56b29tVHlwZSAhPSBcImlubmVyXCIpIHtcblx0XHRcdFx0XHRzZWxmLnpvb21UaW50LmNzcyh7IHRvcDogMH0pO1xuXHRcdFx0XHRcdHNlbGYuem9vbVRpbnQuY3NzKHsgbGVmdDogMH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vc2V0IHJlc3BvbnNpdmVcblx0XHRcdFx0Ly93aWxsIGNoZWNraW5nIGlmIHRoZSBpbWFnZSBuZWVkcyBjaGFuZ2luZyBiZWZvcmUgcnVubmluZyB0aGlzIGNvZGUgd29yayBmYXN0ZXI/XG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy5yZXNwb25zaXZlICYmICFzZWxmLm9wdGlvbnMuc2Nyb2xsWm9vbSl7XG5cdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnNob3dMZW5zKXtcblx0XHRcdFx0XHRcdGlmKHNlbGYubnpIZWlnaHQgPCBzZWxmLm9wdGlvbnMuem9vbVdpbmRvd1dpZHRoL3NlbGYud2lkdGhSYXRpbyl7XG5cdFx0XHRcdFx0XHRcdGxlbnNIZWlnaHQgPSBzZWxmLm56SGVpZ2h0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0bGVuc0hlaWdodCA9IFN0cmluZygoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dIZWlnaHQvc2VsZi5oZWlnaHRSYXRpbykpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZihzZWxmLmxhcmdlV2lkdGggPCBzZWxmLm9wdGlvbnMuem9vbVdpbmRvd1dpZHRoKXtcblx0XHRcdFx0XHRcdFx0bGVuc1dpZHRoID0gc2VsZi5ueldpZHRoO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0bGVuc1dpZHRoID0gIChzZWxmLm9wdGlvbnMuem9vbVdpbmRvd1dpZHRoL3NlbGYud2lkdGhSYXRpbyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzZWxmLndpZHRoUmF0aW8gPSBzZWxmLmxhcmdlV2lkdGggLyBzZWxmLm56V2lkdGg7XG5cdFx0XHRcdFx0XHRzZWxmLmhlaWdodFJhdGlvID0gc2VsZi5sYXJnZUhlaWdodCAvIHNlbGYubnpIZWlnaHQ7XG5cdFx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgIT0gXCJsZW5zXCIpIHtcblxuXG5cdFx0XHRcdFx0XHRcdC8vcG9zc2libHkgZG9udCBuZWVkIHRvIGtlZXAgcmVjYWxjYWxjdWxhdGluZ1xuXHRcdFx0XHRcdFx0XHQvL2lmIHRoZSBsZW5zIGlzIGhlaWdoZXIgdGhhbiB0aGUgaW1hZ2UsIHRoZW4gc2V0IGxlbnMgc2l6ZSB0byBpbWFnZSBzaXplXG5cdFx0XHRcdFx0XHRcdGlmKHNlbGYubnpIZWlnaHQgPCBzZWxmLm9wdGlvbnMuem9vbVdpbmRvd1dpZHRoL3NlbGYud2lkdGhSYXRpbyl7XG5cdFx0XHRcdFx0XHRcdFx0bGVuc0hlaWdodCA9IHNlbGYubnpIZWlnaHQ7XG5cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdGxlbnNIZWlnaHQgPSBTdHJpbmcoKHNlbGYub3B0aW9ucy56b29tV2luZG93SGVpZ2h0L3NlbGYuaGVpZ2h0UmF0aW8pKVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYoc2VsZi5ueldpZHRoIDwgc2VsZi5vcHRpb25zLnpvb21XaW5kb3dIZWlnaHQvc2VsZi5oZWlnaHRSYXRpbyl7XG5cdFx0XHRcdFx0XHRcdFx0bGVuc1dpZHRoID0gc2VsZi5ueldpZHRoO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0bGVuc1dpZHRoID0gIFN0cmluZygoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dXaWR0aC9zZWxmLndpZHRoUmF0aW8pKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbUxlbnMuY3NzKCd3aWR0aCcsIGxlbnNXaWR0aCk7XG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbUxlbnMuY3NzKCdoZWlnaHQnLCBsZW5zSGVpZ2h0KTtcblxuXHRcdFx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMudGludCl7XG5cdFx0XHRcdFx0XHRcdFx0c2VsZi56b29tVGludEltYWdlLmNzcygnd2lkdGgnLCBzZWxmLm56V2lkdGgpO1xuXHRcdFx0XHRcdFx0XHRcdHNlbGYuem9vbVRpbnRJbWFnZS5jc3MoJ2hlaWdodCcsIHNlbGYubnpIZWlnaHQpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImxlbnNcIikge1xuXG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbUxlbnMuY3NzKHsgd2lkdGg6IFN0cmluZyhzZWxmLm9wdGlvbnMubGVuc1NpemUpICsgJ3B4JywgaGVpZ2h0OiBTdHJpbmcoc2VsZi5vcHRpb25zLmxlbnNTaXplKSArICdweCcgfSlcblxuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvL2VuZCByZXNwb25zaXZlIGltYWdlIGNoYW5nZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vY29udGFpbmVyIGZpeFxuXHRcdFx0XHRzZWxmLnpvb21Db250YWluZXIuY3NzKHsgdG9wOiBzZWxmLm56T2Zmc2V0LnRvcH0pO1xuXHRcdFx0XHRzZWxmLnpvb21Db250YWluZXIuY3NzKHsgbGVmdDogc2VsZi5uek9mZnNldC5sZWZ0fSk7XG5cdFx0XHRcdHNlbGYubW91c2VMZWZ0ID0gcGFyc2VJbnQoZS5wYWdlWCAtIHNlbGYubnpPZmZzZXQubGVmdCk7XG5cdFx0XHRcdHNlbGYubW91c2VUb3AgPSBwYXJzZUludChlLnBhZ2VZIC0gc2VsZi5uek9mZnNldC50b3ApO1xuXHRcdFx0XHQvL2NhbGN1bGF0ZSB0aGUgTG9jYXRpb24gb2YgdGhlIExlbnNcblxuXHRcdFx0XHQvL2NhbGN1bGF0ZSB0aGUgYm91bmQgcmVnaW9ucyAtIGJ1dCBvbmx5IGlmIHpvb20gd2luZG93XG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcIndpbmRvd1wiKSB7XG5cdFx0XHRcdFx0c2VsZi5FdG9wcG9zID0gKHNlbGYubW91c2VUb3AgPCAoc2VsZi56b29tTGVucy5oZWlnaHQoKS8yKSk7XG5cdFx0XHRcdFx0c2VsZi5FYm9wcG9zID0gKHNlbGYubW91c2VUb3AgPiBzZWxmLm56SGVpZ2h0IC0gKHNlbGYuem9vbUxlbnMuaGVpZ2h0KCkvMiktKHNlbGYub3B0aW9ucy5sZW5zQm9yZGVyU2l6ZSoyKSk7XG5cdFx0XHRcdFx0c2VsZi5FbG9wcG9zID0gKHNlbGYubW91c2VMZWZ0IDwgMCsoKHNlbGYuem9vbUxlbnMud2lkdGgoKS8yKSkpO1xuXHRcdFx0XHRcdHNlbGYuRXJvcHBvcyA9IChzZWxmLm1vdXNlTGVmdCA+IChzZWxmLm56V2lkdGggLSAoc2VsZi56b29tTGVucy53aWR0aCgpLzIpLShzZWxmLm9wdGlvbnMubGVuc0JvcmRlclNpemUqMikpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL2NhbGN1bGF0ZSB0aGUgYm91bmQgcmVnaW9ucyAtIGJ1dCBvbmx5IGZvciBpbm5lciB6b29tXG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImlubmVyXCIpe1xuXHRcdFx0XHRcdHNlbGYuRXRvcHBvcyA9IChzZWxmLm1vdXNlVG9wIDwgKChzZWxmLm56SGVpZ2h0LzIpL3NlbGYuaGVpZ2h0UmF0aW8pICk7XG5cdFx0XHRcdFx0c2VsZi5FYm9wcG9zID0gKHNlbGYubW91c2VUb3AgPiAoc2VsZi5uekhlaWdodCAtICgoc2VsZi5uekhlaWdodC8yKS9zZWxmLmhlaWdodFJhdGlvKSkpO1xuXHRcdFx0XHRcdHNlbGYuRWxvcHBvcyA9IChzZWxmLm1vdXNlTGVmdCA8IDArKCgoc2VsZi5ueldpZHRoLzIpL3NlbGYud2lkdGhSYXRpbykpKTtcblx0XHRcdFx0XHRzZWxmLkVyb3Bwb3MgPSAoc2VsZi5tb3VzZUxlZnQgPiAoc2VsZi5ueldpZHRoIC0gKHNlbGYubnpXaWR0aC8yKS9zZWxmLndpZHRoUmF0aW8tKHNlbGYub3B0aW9ucy5sZW5zQm9yZGVyU2l6ZSoyKSkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gaWYgdGhlIG1vdXNlIHBvc2l0aW9uIG9mIHRoZSBzbGlkZXIgaXMgb25lIG9mIHRoZSBvdXRlcmJvdW5kcywgdGhlbiBoaWRlICB3aW5kb3cgYW5kIGxlbnNcblx0XHRcdFx0aWYgKHNlbGYubW91c2VMZWZ0IDwgMCB8fCBzZWxmLm1vdXNlVG9wIDwgMCB8fCBzZWxmLm1vdXNlTGVmdCA+IHNlbGYubnpXaWR0aCB8fCBzZWxmLm1vdXNlVG9wID4gc2VsZi5uekhlaWdodCApIHtcblx0XHRcdFx0XHRzZWxmLnNldEVsZW1lbnRzKFwiaGlkZVwiKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9lbHNlIGNvbnRpbnVlIHdpdGggb3BlcmF0aW9uc1xuXHRcdFx0XHRlbHNlIHtcblxuXG5cdFx0XHRcdFx0Ly9sZW5zIG9wdGlvbnNcblx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuc2hvd0xlbnMpIHtcblx0XHRcdFx0XHRcdC8vXHRcdHNlbGYuc2hvd0hpZGVMZW5zKFwic2hvd1wiKTtcblx0XHRcdFx0XHRcdC8vc2V0IGJhY2tncm91bmQgcG9zaXRpb24gb2YgbGVuc1xuXHRcdFx0XHRcdFx0c2VsZi5sZW5zTGVmdFBvcyA9IFN0cmluZyhNYXRoLmZsb29yKHNlbGYubW91c2VMZWZ0IC0gc2VsZi56b29tTGVucy53aWR0aCgpIC8gMikpO1xuXHRcdFx0XHRcdFx0c2VsZi5sZW5zVG9wUG9zID0gU3RyaW5nKE1hdGguZmxvb3Ioc2VsZi5tb3VzZVRvcCAtIHNlbGYuem9vbUxlbnMuaGVpZ2h0KCkgLyAyKSk7XG5cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL2FkanVzdCB0aGUgYmFja2dyb3VuZCBwb3NpdGlvbiBpZiB0aGUgbW91c2UgaXMgaW4gb25lIG9mIHRoZSBvdXRlciByZWdpb25zXG5cblx0XHRcdFx0XHQvL1RvcCByZWdpb25cblx0XHRcdFx0XHRpZihzZWxmLkV0b3Bwb3Mpe1xuXHRcdFx0XHRcdFx0c2VsZi5sZW5zVG9wUG9zID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9MZWZ0IFJlZ2lvblxuXHRcdFx0XHRcdGlmKHNlbGYuRWxvcHBvcyl7XG5cdFx0XHRcdFx0XHRzZWxmLndpbmRvd0xlZnRQb3MgPSAwO1xuXHRcdFx0XHRcdFx0c2VsZi5sZW5zTGVmdFBvcyA9IDA7XG5cdFx0XHRcdFx0XHRzZWxmLnRpbnRwb3M9MDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9TZXQgYm90dG9tIGFuZCByaWdodCByZWdpb24gZm9yIHdpbmRvdyBtb2RlXG5cdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlID09IFwid2luZG93XCIpIHtcblx0XHRcdFx0XHRcdGlmKHNlbGYuRWJvcHBvcyl7XG5cdFx0XHRcdFx0XHRcdHNlbGYubGVuc1RvcFBvcyA9IE1hdGgubWF4KCAoc2VsZi5uekhlaWdodCktc2VsZi56b29tTGVucy5oZWlnaHQoKS0oc2VsZi5vcHRpb25zLmxlbnNCb3JkZXJTaXplKjIpLCAwICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZihzZWxmLkVyb3Bwb3Mpe1xuXHRcdFx0XHRcdFx0XHRzZWxmLmxlbnNMZWZ0UG9zID0gKHNlbGYubnpXaWR0aC0oc2VsZi56b29tTGVucy53aWR0aCgpKS0oc2VsZi5vcHRpb25zLmxlbnNCb3JkZXJTaXplKjIpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9TZXQgYm90dG9tIGFuZCByaWdodCByZWdpb24gZm9yIGlubmVyIG1vZGVcblx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJpbm5lclwiKSB7XG5cdFx0XHRcdFx0XHRpZihzZWxmLkVib3Bwb3Mpe1xuXHRcdFx0XHRcdFx0XHRzZWxmLmxlbnNUb3BQb3MgPSBNYXRoLm1heCggKChzZWxmLm56SGVpZ2h0KS0oc2VsZi5vcHRpb25zLmxlbnNCb3JkZXJTaXplKjIpKSwgMCApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYoc2VsZi5Fcm9wcG9zKXtcblx0XHRcdFx0XHRcdFx0c2VsZi5sZW5zTGVmdFBvcyA9IChzZWxmLm56V2lkdGgtKHNlbGYubnpXaWR0aCktKHNlbGYub3B0aW9ucy5sZW5zQm9yZGVyU2l6ZSoyKSk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9pZiBsZW5zIHpvb21cblx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJsZW5zXCIpIHtcblx0XHRcdFx0XHRcdHNlbGYud2luZG93TGVmdFBvcyA9IFN0cmluZygoKGUucGFnZVggLSBzZWxmLm56T2Zmc2V0LmxlZnQpICogc2VsZi53aWR0aFJhdGlvIC0gc2VsZi56b29tTGVucy53aWR0aCgpIC8gMikgKiAoLTEpKTtcblx0XHRcdFx0XHRcdHNlbGYud2luZG93VG9wUG9zID0gU3RyaW5nKCgoZS5wYWdlWSAtIHNlbGYubnpPZmZzZXQudG9wKSAqIHNlbGYuaGVpZ2h0UmF0aW8gLSBzZWxmLnpvb21MZW5zLmhlaWdodCgpIC8gMikgKiAoLTEpKTtcblxuXHRcdFx0XHRcdFx0c2VsZi56b29tTGVucy5jc3MoeyBiYWNrZ3JvdW5kUG9zaXRpb246IHNlbGYud2luZG93TGVmdFBvcyArICdweCAnICsgc2VsZi53aW5kb3dUb3BQb3MgKyAncHgnIH0pO1xuXG5cdFx0XHRcdFx0XHRpZihzZWxmLmNoYW5nZUJnU2l6ZSl7XG5cblx0XHRcdFx0XHRcdFx0aWYoc2VsZi5uekhlaWdodD5zZWxmLm56V2lkdGgpe1xuXHRcdFx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImxlbnNcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnpvb21MZW5zLmNzcyh7IFwiYmFja2dyb3VuZC1zaXplXCI6IHNlbGYubGFyZ2VXaWR0aC9zZWxmLm5ld3ZhbHVlaGVpZ2h0ICsgJ3B4ICcgKyBzZWxmLmxhcmdlSGVpZ2h0L3NlbGYubmV3dmFsdWVoZWlnaHQgKyAncHgnIH0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdHNlbGYuem9vbVdpbmRvdy5jc3MoeyBcImJhY2tncm91bmQtc2l6ZVwiOiBzZWxmLmxhcmdlV2lkdGgvc2VsZi5uZXd2YWx1ZWhlaWdodCArICdweCAnICsgc2VsZi5sYXJnZUhlaWdodC9zZWxmLm5ld3ZhbHVlaGVpZ2h0ICsgJ3B4JyB9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImxlbnNcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnpvb21MZW5zLmNzcyh7IFwiYmFja2dyb3VuZC1zaXplXCI6IHNlbGYubGFyZ2VXaWR0aC9zZWxmLm5ld3ZhbHVld2lkdGggKyAncHggJyArIHNlbGYubGFyZ2VIZWlnaHQvc2VsZi5uZXd2YWx1ZXdpZHRoICsgJ3B4JyB9KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0c2VsZi56b29tV2luZG93LmNzcyh7IFwiYmFja2dyb3VuZC1zaXplXCI6IHNlbGYubGFyZ2VXaWR0aC9zZWxmLm5ld3ZhbHVld2lkdGggKyAncHggJyArIHNlbGYubGFyZ2VIZWlnaHQvc2VsZi5uZXd2YWx1ZXdpZHRoICsgJ3B4JyB9KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRzZWxmLmNoYW5nZUJnU2l6ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRzZWxmLnNldFdpbmRvd1Bvc3RpdGlvbihlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9pZiB0aW50IHpvb21cblx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMudGludCAmJiBzZWxmLm9wdGlvbnMuem9vbVR5cGUgIT0gXCJpbm5lclwiKSB7XG5cdFx0XHRcdFx0XHRzZWxmLnNldFRpbnRQb3NpdGlvbihlKTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL3NldCB0aGUgY3NzIGJhY2tncm91bmQgcG9zaXRpb25cblx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJ3aW5kb3dcIikge1xuXHRcdFx0XHRcdFx0c2VsZi5zZXRXaW5kb3dQb3N0aXRpb24oZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImlubmVyXCIpIHtcblx0XHRcdFx0XHRcdHNlbGYuc2V0V2luZG93UG9zdGl0aW9uKGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuc2hvd0xlbnMpIHtcblxuXHRcdFx0XHRcdFx0aWYoc2VsZi5mdWxsd2lkdGggJiYgc2VsZi5vcHRpb25zLnpvb21UeXBlICE9IFwibGVuc1wiKXtcblx0XHRcdFx0XHRcdFx0c2VsZi5sZW5zTGVmdFBvcyA9IDA7XG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHNlbGYuem9vbUxlbnMuY3NzKHsgbGVmdDogc2VsZi5sZW5zTGVmdFBvcyArICdweCcsIHRvcDogc2VsZi5sZW5zVG9wUG9zICsgJ3B4JyB9KVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IC8vZW5kIGVsc2VcblxuXG5cblx0XHRcdH0sXG5cdFx0XHRzaG93SGlkZVdpbmRvdzogZnVuY3Rpb24oY2hhbmdlKSB7XG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFx0aWYoY2hhbmdlID09IFwic2hvd1wiKXtcblx0XHRcdFx0XHRpZighc2VsZi5pc1dpbmRvd0FjdGl2ZSl7XG5cdFx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVdpbmRvd0ZhZGVJbil7XG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbVdpbmRvdy5zdG9wKHRydWUsIHRydWUsIGZhbHNlKS5mYWRlSW4oc2VsZi5vcHRpb25zLnpvb21XaW5kb3dGYWRlSW4pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtzZWxmLnpvb21XaW5kb3cuc2hvdygpO31cblx0XHRcdFx0XHRcdHNlbGYuaXNXaW5kb3dBY3RpdmUgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZihjaGFuZ2UgPT0gXCJoaWRlXCIpe1xuXHRcdFx0XHRcdGlmKHNlbGYuaXNXaW5kb3dBY3RpdmUpe1xuXHRcdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dGYWRlT3V0KXtcblx0XHRcdFx0XHRcdFx0c2VsZi56b29tV2luZG93LnN0b3AodHJ1ZSwgdHJ1ZSkuZmFkZU91dChzZWxmLm9wdGlvbnMuem9vbVdpbmRvd0ZhZGVPdXQsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2VsZi5sb29wKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQvL3N0b3AgbW92aW5nIHRoZSB6b29tIHdpbmRvdyB3aGVuIHpvb20gd2luZG93IGlzIGZhZGVkIG91dFxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbChzZWxmLmxvb3ApO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5sb29wID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7c2VsZi56b29tV2luZG93LmhpZGUoKTt9XG5cdFx0XHRcdFx0XHRzZWxmLmlzV2luZG93QWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0c2hvd0hpZGVMZW5zOiBmdW5jdGlvbihjaGFuZ2UpIHtcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XHRpZihjaGFuZ2UgPT0gXCJzaG93XCIpe1xuXHRcdFx0XHRcdGlmKCFzZWxmLmlzTGVuc0FjdGl2ZSl7XG5cdFx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMubGVuc0ZhZGVJbil7XG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbUxlbnMuc3RvcCh0cnVlLCB0cnVlLCBmYWxzZSkuZmFkZUluKHNlbGYub3B0aW9ucy5sZW5zRmFkZUluKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7c2VsZi56b29tTGVucy5zaG93KCk7fVxuXHRcdFx0XHRcdFx0c2VsZi5pc0xlbnNBY3RpdmUgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZihjaGFuZ2UgPT0gXCJoaWRlXCIpe1xuXHRcdFx0XHRcdGlmKHNlbGYuaXNMZW5zQWN0aXZlKXtcblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy5sZW5zRmFkZU91dCl7XG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbUxlbnMuc3RvcCh0cnVlLCB0cnVlKS5mYWRlT3V0KHNlbGYub3B0aW9ucy5sZW5zRmFkZU91dCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle3NlbGYuem9vbUxlbnMuaGlkZSgpO31cblx0XHRcdFx0XHRcdHNlbGYuaXNMZW5zQWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0c2hvd0hpZGVUaW50OiBmdW5jdGlvbihjaGFuZ2UpIHtcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XHRpZihjaGFuZ2UgPT0gXCJzaG93XCIpe1xuXHRcdFx0XHRcdGlmKCFzZWxmLmlzVGludEFjdGl2ZSl7XG5cblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVGludEZhZGVJbil7XG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbVRpbnQuY3NzKHtvcGFjaXR5OnNlbGYub3B0aW9ucy50aW50T3BhY2l0eX0pLmFuaW1hdGUoKS5zdG9wKHRydWUsIHRydWUpLmZhZGVJbihcInNsb3dcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRzZWxmLnpvb21UaW50LmNzcyh7b3BhY2l0eTpzZWxmLm9wdGlvbnMudGludE9wYWNpdHl9KS5hbmltYXRlKCk7XG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbVRpbnQuc2hvdygpO1xuXG5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHNlbGYuaXNUaW50QWN0aXZlID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoY2hhbmdlID09IFwiaGlkZVwiKXtcblx0XHRcdFx0XHRpZihzZWxmLmlzVGludEFjdGl2ZSl7XG5cblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVGludEZhZGVPdXQpe1xuXHRcdFx0XHRcdFx0XHRzZWxmLnpvb21UaW50LnN0b3AodHJ1ZSwgdHJ1ZSkuZmFkZU91dChzZWxmLm9wdGlvbnMuem9vbVRpbnRGYWRlT3V0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7c2VsZi56b29tVGludC5oaWRlKCk7fVxuXHRcdFx0XHRcdFx0c2VsZi5pc1RpbnRBY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzZXRMZW5zUG9zdGl0aW9uOiBmdW5jdGlvbiggZSApIHtcblxuXG5cdFx0XHR9LFxuXHRcdFx0c2V0V2luZG93UG9zdGl0aW9uOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Ly9yZXR1cm4gb2JqLnNsaWNlKCAwLCBjb3VudCApO1xuXHRcdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRcdFx0aWYoIWlzTmFOKHNlbGYub3B0aW9ucy56b29tV2luZG93UG9zaXRpb24pKXtcblxuXHRcdFx0XHRcdHN3aXRjaCAoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dQb3NpdGlvbikge1xuXHRcdFx0XHRcdGNhc2UgMTogLy9kb25lXG5cdFx0XHRcdFx0XHRzZWxmLndpbmRvd09mZnNldFRvcCA9IChzZWxmLm9wdGlvbnMuem9vbVdpbmRvd09mZmV0eSk7Ly9ET05FIC0gMVxuXHRcdFx0XHRcdFx0c2VsZi53aW5kb3dPZmZzZXRMZWZ0ID0oK3NlbGYubnpXaWR0aCk7IC8vRE9ORSAxLCAyLCAzLCA0LCAxNlxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dIZWlnaHQgPiBzZWxmLm56SGVpZ2h0KXsgLy9wb3NpdGl2ZSBtYXJnaW5cblxuXHRcdFx0XHRcdFx0XHRzZWxmLndpbmRvd09mZnNldFRvcCA9ICgoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dIZWlnaHQvMiktKHNlbGYubnpIZWlnaHQvMikpKigtMSk7XG5cdFx0XHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0TGVmdCA9KHNlbGYubnpXaWR0aCk7IC8vRE9ORSAxLCAyLCAzLCA0LCAxNlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXsgLy9uZWdhdGl2ZSBtYXJnaW5cblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAzOiAvL2RvbmVcblx0XHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0VG9wID0gKHNlbGYubnpIZWlnaHQgLSBzZWxmLnpvb21XaW5kb3cuaGVpZ2h0KCkgLSAoc2VsZi5vcHRpb25zLmJvcmRlclNpemUqMikpOyAvL0RPTkUgMyw5XG5cdFx0XHRcdFx0XHRzZWxmLndpbmRvd09mZnNldExlZnQgPShzZWxmLm56V2lkdGgpOyAvL0RPTkUgMSwgMiwgMywgNCwgMTZcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNDogLy9kb25lXG5cdFx0XHRcdFx0XHRzZWxmLndpbmRvd09mZnNldFRvcCA9IChzZWxmLm56SGVpZ2h0KTsgLy9ET05FIC0gNCw1LDYsNyw4XG5cdFx0XHRcdFx0XHRzZWxmLndpbmRvd09mZnNldExlZnQgPShzZWxmLm56V2lkdGgpOyAvL0RPTkUgMSwgMiwgMywgNCwgMTZcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNTogLy9kb25lXG5cdFx0XHRcdFx0XHRzZWxmLndpbmRvd09mZnNldFRvcCA9IChzZWxmLm56SGVpZ2h0KTsgLy9ET05FIC0gNCw1LDYsNyw4XG5cdFx0XHRcdFx0XHRzZWxmLndpbmRvd09mZnNldExlZnQgPShzZWxmLm56V2lkdGgtc2VsZi56b29tV2luZG93LndpZHRoKCktKHNlbGYub3B0aW9ucy5ib3JkZXJTaXplKjIpKTsgLy9ET05FIC0gNSwxNVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA2OlxuXHRcdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dIZWlnaHQgPiBzZWxmLm56SGVpZ2h0KXsgLy9wb3NpdGl2ZSBtYXJnaW5cblx0XHRcdFx0XHRcdFx0c2VsZi53aW5kb3dPZmZzZXRUb3AgPSAoc2VsZi5uekhlaWdodCk7ICAvL0RPTkUgLSA0LDUsNiw3LDhcblxuXHRcdFx0XHRcdFx0XHRzZWxmLndpbmRvd09mZnNldExlZnQgPSgoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dXaWR0aC8yKS0oc2VsZi5ueldpZHRoLzIpKyhzZWxmLm9wdGlvbnMuYm9yZGVyU2l6ZSoyKSkqKC0xKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7IC8vbmVnYXRpdmUgbWFyZ2luXG5cblx0XHRcdFx0XHRcdH1cblxuXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDc6IC8vZG9uZVxuXHRcdFx0XHRcdFx0c2VsZi53aW5kb3dPZmZzZXRUb3AgPSAoc2VsZi5uekhlaWdodCk7ICAvL0RPTkUgLSA0LDUsNiw3LDhcblx0XHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0TGVmdCA9IDA7IC8vRE9ORSA3LCAxM1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA4OiAvL2RvbmVcblx0XHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0VG9wID0gKHNlbGYubnpIZWlnaHQpOyAvL0RPTkUgLSA0LDUsNiw3LDhcblx0XHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0TGVmdCA9KHNlbGYuem9vbVdpbmRvdy53aWR0aCgpKyhzZWxmLm9wdGlvbnMuYm9yZGVyU2l6ZSoyKSApKiAoLTEpOyAgLy9ET05FIDgsOSwxMCwxMSwxMlxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA5OiAgLy9kb25lXG5cdFx0XHRcdFx0XHRzZWxmLndpbmRvd09mZnNldFRvcCA9IChzZWxmLm56SGVpZ2h0IC0gc2VsZi56b29tV2luZG93LmhlaWdodCgpIC0gKHNlbGYub3B0aW9ucy5ib3JkZXJTaXplKjIpKTsgLy9ET05FIDMsOVxuXHRcdFx0XHRcdFx0c2VsZi53aW5kb3dPZmZzZXRMZWZ0ID0oc2VsZi56b29tV2luZG93LndpZHRoKCkrKHNlbGYub3B0aW9ucy5ib3JkZXJTaXplKjIpICkqICgtMSk7ICAvL0RPTkUgOCw5LDEwLDExLDEyXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDEwOlxuXHRcdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dIZWlnaHQgPiBzZWxmLm56SGVpZ2h0KXsgLy9wb3NpdGl2ZSBtYXJnaW5cblxuXHRcdFx0XHRcdFx0XHRzZWxmLndpbmRvd09mZnNldFRvcCA9ICgoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dIZWlnaHQvMiktKHNlbGYubnpIZWlnaHQvMikpKigtMSk7XG5cdFx0XHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0TGVmdCA9KHNlbGYuem9vbVdpbmRvdy53aWR0aCgpKyhzZWxmLm9wdGlvbnMuYm9yZGVyU2l6ZSoyKSApKiAoLTEpOyAgLy9ET05FIDgsOSwxMCwxMSwxMlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXsgLy9uZWdhdGl2ZSBtYXJnaW5cblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxMTpcblx0XHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0VG9wID0gKHNlbGYub3B0aW9ucy56b29tV2luZG93T2ZmZXR5KTtcblx0XHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0TGVmdCA9KHNlbGYuem9vbVdpbmRvdy53aWR0aCgpKyhzZWxmLm9wdGlvbnMuYm9yZGVyU2l6ZSoyKSApKiAoLTEpOyAgLy9ET05FIDgsOSwxMCwxMSwxMlxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxMjogLy9kb25lXG5cdFx0XHRcdFx0XHRzZWxmLndpbmRvd09mZnNldFRvcCA9IChzZWxmLnpvb21XaW5kb3cuaGVpZ2h0KCkrKHNlbGYub3B0aW9ucy5ib3JkZXJTaXplKjIpKSooLTEpOyAvL0RPTkUgMTIsMTMsMTQsMTUsMTZcblx0XHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0TGVmdCA9KHNlbGYuem9vbVdpbmRvdy53aWR0aCgpKyhzZWxmLm9wdGlvbnMuYm9yZGVyU2l6ZSoyKSApKiAoLTEpOyAgLy9ET05FIDgsOSwxMCwxMSwxMlxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxMzogLy9kb25lXG5cdFx0XHRcdFx0XHRzZWxmLndpbmRvd09mZnNldFRvcCA9IChzZWxmLnpvb21XaW5kb3cuaGVpZ2h0KCkrKHNlbGYub3B0aW9ucy5ib3JkZXJTaXplKjIpKSooLTEpOyAvL0RPTkUgMTIsMTMsMTQsMTUsMTZcblx0XHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0TGVmdCA9KDApOyAvL0RPTkUgNywgMTNcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTQ6XG5cdFx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVdpbmRvd0hlaWdodCA+IHNlbGYubnpIZWlnaHQpeyAvL3Bvc2l0aXZlIG1hcmdpblxuXHRcdFx0XHRcdFx0XHRzZWxmLndpbmRvd09mZnNldFRvcCA9IChzZWxmLnpvb21XaW5kb3cuaGVpZ2h0KCkrKHNlbGYub3B0aW9ucy5ib3JkZXJTaXplKjIpKSooLTEpOyAvL0RPTkUgMTIsMTMsMTQsMTUsMTZcblxuXHRcdFx0XHRcdFx0XHRzZWxmLndpbmRvd09mZnNldExlZnQgPSgoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dXaWR0aC8yKS0oc2VsZi5ueldpZHRoLzIpKyhzZWxmLm9wdGlvbnMuYm9yZGVyU2l6ZSoyKSkqKC0xKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7IC8vbmVnYXRpdmUgbWFyZ2luXG5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxNTovL2RvbmVcblx0XHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0VG9wID0gKHNlbGYuem9vbVdpbmRvdy5oZWlnaHQoKSsoc2VsZi5vcHRpb25zLmJvcmRlclNpemUqMikpKigtMSk7IC8vRE9ORSAxMiwxMywxNCwxNSwxNlxuXHRcdFx0XHRcdFx0c2VsZi53aW5kb3dPZmZzZXRMZWZ0ID0oc2VsZi5ueldpZHRoLXNlbGYuem9vbVdpbmRvdy53aWR0aCgpLShzZWxmLm9wdGlvbnMuYm9yZGVyU2l6ZSoyKSk7IC8vRE9ORSAtIDUsMTVcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTY6ICAvL2RvbmVcblx0XHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0VG9wID0gKHNlbGYuem9vbVdpbmRvdy5oZWlnaHQoKSsoc2VsZi5vcHRpb25zLmJvcmRlclNpemUqMikpKigtMSk7IC8vRE9ORSAxMiwxMywxNCwxNSwxNlxuXHRcdFx0XHRcdFx0c2VsZi53aW5kb3dPZmZzZXRMZWZ0ID0oc2VsZi5ueldpZHRoKTsgLy9ET05FIDEsIDIsIDMsIDQsIDE2XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OiAvL2RvbmVcblx0XHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0VG9wID0gKHNlbGYub3B0aW9ucy56b29tV2luZG93T2ZmZXR5KTsvL0RPTkUgLSAxXG5cdFx0XHRcdFx0c2VsZi53aW5kb3dPZmZzZXRMZWZ0ID0oc2VsZi5ueldpZHRoKTsgLy9ET05FIDEsIDIsIDMsIDQsIDE2XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IC8vZW5kIGlzTkFOXG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0Ly9XRSBDQU4gUE9TSVRJT04gSU4gQSBDTEFTUyAtIEFTU1VNRSBUSEFUIEFOWSBTVFJJTkcgUEFTU0VEIElTXG5cdFx0XHRcdFx0c2VsZi5leHRlcm5hbENvbnRhaW5lciA9ICQoJyMnK3NlbGYub3B0aW9ucy56b29tV2luZG93UG9zaXRpb24pO1xuXHRcdFx0XHRcdHNlbGYuZXh0ZXJuYWxDb250YWluZXJXaWR0aCA9IHNlbGYuZXh0ZXJuYWxDb250YWluZXIud2lkdGgoKTtcblx0XHRcdFx0XHRzZWxmLmV4dGVybmFsQ29udGFpbmVySGVpZ2h0ID0gc2VsZi5leHRlcm5hbENvbnRhaW5lci5oZWlnaHQoKTtcblx0XHRcdFx0XHRzZWxmLmV4dGVybmFsQ29udGFpbmVyT2Zmc2V0ID0gc2VsZi5leHRlcm5hbENvbnRhaW5lci5vZmZzZXQoKTtcblxuXHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0VG9wID0gc2VsZi5leHRlcm5hbENvbnRhaW5lck9mZnNldC50b3A7Ly9ET05FIC0gMVxuXHRcdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0TGVmdCA9c2VsZi5leHRlcm5hbENvbnRhaW5lck9mZnNldC5sZWZ0OyAvL0RPTkUgMSwgMiwgMywgNCwgMTZcblxuXHRcdFx0XHR9XG5cdFx0XHRcdHNlbGYuaXNXaW5kb3dTZXQgPSB0cnVlO1xuXHRcdFx0XHRzZWxmLndpbmRvd09mZnNldFRvcCA9IHNlbGYud2luZG93T2Zmc2V0VG9wICsgc2VsZi5vcHRpb25zLnpvb21XaW5kb3dPZmZldHk7XG5cdFx0XHRcdHNlbGYud2luZG93T2Zmc2V0TGVmdCA9IHNlbGYud2luZG93T2Zmc2V0TGVmdCArIHNlbGYub3B0aW9ucy56b29tV2luZG93T2ZmZXR4O1xuXG5cdFx0XHRcdHNlbGYuem9vbVdpbmRvdy5jc3MoeyB0b3A6IHNlbGYud2luZG93T2Zmc2V0VG9wfSk7XG5cdFx0XHRcdHNlbGYuem9vbVdpbmRvdy5jc3MoeyBsZWZ0OiBzZWxmLndpbmRvd09mZnNldExlZnR9KTtcblxuXHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJpbm5lclwiKSB7XG5cdFx0XHRcdFx0c2VsZi56b29tV2luZG93LmNzcyh7IHRvcDogMH0pO1xuXHRcdFx0XHRcdHNlbGYuem9vbVdpbmRvdy5jc3MoeyBsZWZ0OiAwfSk7XG5cblx0XHRcdFx0fVxuXG5cblx0XHRcdFx0c2VsZi53aW5kb3dMZWZ0UG9zID0gU3RyaW5nKCgoZS5wYWdlWCAtIHNlbGYubnpPZmZzZXQubGVmdCkgKiBzZWxmLndpZHRoUmF0aW8gLSBzZWxmLnpvb21XaW5kb3cud2lkdGgoKSAvIDIpICogKC0xKSk7XG5cdFx0XHRcdHNlbGYud2luZG93VG9wUG9zID0gU3RyaW5nKCgoZS5wYWdlWSAtIHNlbGYubnpPZmZzZXQudG9wKSAqIHNlbGYuaGVpZ2h0UmF0aW8gLSBzZWxmLnpvb21XaW5kb3cuaGVpZ2h0KCkgLyAyKSAqICgtMSkpO1xuXHRcdFx0XHRpZihzZWxmLkV0b3Bwb3Mpe3NlbGYud2luZG93VG9wUG9zID0gMDt9XG5cdFx0XHRcdGlmKHNlbGYuRWxvcHBvcyl7c2VsZi53aW5kb3dMZWZ0UG9zID0gMDt9XG5cdFx0XHRcdGlmKHNlbGYuRWJvcHBvcyl7c2VsZi53aW5kb3dUb3BQb3MgPSAoc2VsZi5sYXJnZUhlaWdodC9zZWxmLmN1cnJlbnRab29tTGV2ZWwtc2VsZi56b29tV2luZG93LmhlaWdodCgpKSooLTEpOyAgfVxuXHRcdFx0XHRpZihzZWxmLkVyb3Bwb3Mpe3NlbGYud2luZG93TGVmdFBvcyA9ICgoc2VsZi5sYXJnZVdpZHRoL3NlbGYuY3VycmVudFpvb21MZXZlbC1zZWxmLnpvb21XaW5kb3cud2lkdGgoKSkqKC0xKSk7fVxuXG5cdFx0XHRcdC8vc3RvcHMgbWljcm8gbW92ZW1lbnRzXG5cdFx0XHRcdGlmKHNlbGYuZnVsbGhlaWdodCl7XG5cdFx0XHRcdFx0c2VsZi53aW5kb3dUb3BQb3MgPSAwO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoc2VsZi5mdWxsd2lkdGgpe1xuXHRcdFx0XHRcdHNlbGYud2luZG93TGVmdFBvcyA9IDA7XG5cblx0XHRcdFx0fVxuXHRcdFx0XHQvL3NldCB0aGUgY3NzIGJhY2tncm91bmQgcG9zaXRpb25cblxuXG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcIndpbmRvd1wiIHx8IHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImlubmVyXCIpIHtcblxuXHRcdFx0XHRcdGlmKHNlbGYuem9vbUxvY2sgPT0gMSl7XG5cdFx0XHRcdFx0XHQvL292ZXJyaWRlcyBmb3IgaW1hZ2VzIG5vdCB6b29tYWJsZVxuXHRcdFx0XHRcdFx0aWYoc2VsZi53aWR0aFJhdGlvIDw9IDEpe1xuXG5cdFx0XHRcdFx0XHRcdHNlbGYud2luZG93TGVmdFBvcyA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZihzZWxmLmhlaWdodFJhdGlvIDw9IDEpe1xuXHRcdFx0XHRcdFx0XHRzZWxmLndpbmRvd1RvcFBvcyA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIGFkanVzdCBpbWFnZXMgbGVzcyB0aGFuIHRoZSB3aW5kb3cgaGVpZ2h0XG5cblx0XHRcdFx0XHRpZiAoc2VsZi5vcHRpb25zLnpvb21UeXBlID09IFwid2luZG93XCIpIHtcblx0XHRcdFx0XHRcdGlmIChzZWxmLmxhcmdlSGVpZ2h0IDwgc2VsZi5vcHRpb25zLnpvb21XaW5kb3dIZWlnaHQpIHtcblxuXHRcdFx0XHRcdFx0XHRzZWxmLndpbmRvd1RvcFBvcyA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoc2VsZi5sYXJnZVdpZHRoIDwgc2VsZi5vcHRpb25zLnpvb21XaW5kb3dXaWR0aCkge1xuXHRcdFx0XHRcdFx0XHRzZWxmLndpbmRvd0xlZnRQb3MgPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vc2V0IHRoZSB6b29td2luZG93IGJhY2tncm91bmQgcG9zaXRpb25cblx0XHRcdFx0XHRpZiAoc2VsZi5vcHRpb25zLmVhc2luZyl7XG5cblx0XHRcdFx0XHRcdC8vICAgICBpZihzZWxmLmNoYW5nZVpvb20pe1xuXHRcdFx0XHRcdFx0Ly8gICAgICAgICAgIGNsZWFySW50ZXJ2YWwoc2VsZi5sb29wKTtcblx0XHRcdFx0XHRcdC8vICAgICAgICAgICBzZWxmLmNoYW5nZVpvb20gPSBmYWxzZTtcblx0XHRcdFx0XHRcdC8vICAgICAgICAgICBzZWxmLmxvb3AgPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0Ly8gICAgICAgICAgICB9XG5cdFx0XHRcdFx0XHQvL3NldCB0aGUgcG9zIHRvIDAgaWYgbm90IHNldFxuXHRcdFx0XHRcdFx0aWYoIXNlbGYueHApe3NlbGYueHAgPSAwO31cblx0XHRcdFx0XHRcdGlmKCFzZWxmLnlwKXtzZWxmLnlwID0gMDt9XG5cdFx0XHRcdFx0XHQvL2lmIGxvb3Agbm90IGFscmVhZHkgc3RhcnRlZCwgdGhlbiBydW4gaXRcblx0XHRcdFx0XHRcdGlmICghc2VsZi5sb29wKXtcblx0XHRcdFx0XHRcdFx0c2VsZi5sb29wID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0XHQvL3VzaW5nIHplbm8ncyBwYXJhZG94XG5cblx0XHRcdFx0XHRcdFx0XHRzZWxmLnhwICs9IChzZWxmLndpbmRvd0xlZnRQb3MgIC0gc2VsZi54cCkgLyBzZWxmLm9wdGlvbnMuZWFzaW5nQW1vdW50O1xuXHRcdFx0XHRcdFx0XHRcdHNlbGYueXAgKz0gKHNlbGYud2luZG93VG9wUG9zICAtIHNlbGYueXApIC8gc2VsZi5vcHRpb25zLmVhc2luZ0Ftb3VudDtcblx0XHRcdFx0XHRcdFx0XHRpZihzZWxmLnNjcm9sbGluZ0xvY2spe1xuXG5cblx0XHRcdFx0XHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwoc2VsZi5sb29wKTtcblx0XHRcdFx0XHRcdFx0XHRcdHNlbGYueHAgPSBzZWxmLndpbmRvd0xlZnRQb3M7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnlwID0gc2VsZi53aW5kb3dUb3BQb3NcblxuXHRcdFx0XHRcdFx0XHRcdFx0c2VsZi54cCA9ICgoZS5wYWdlWCAtIHNlbGYubnpPZmZzZXQubGVmdCkgKiBzZWxmLndpZHRoUmF0aW8gLSBzZWxmLnpvb21XaW5kb3cud2lkdGgoKSAvIDIpICogKC0xKTtcblx0XHRcdFx0XHRcdFx0XHRcdHNlbGYueXAgPSAoKChlLnBhZ2VZIC0gc2VsZi5uek9mZnNldC50b3ApICogc2VsZi5oZWlnaHRSYXRpbyAtIHNlbGYuem9vbVdpbmRvdy5oZWlnaHQoKSAvIDIpICogKC0xKSk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmKHNlbGYuY2hhbmdlQmdTaXplKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoc2VsZi5uekhlaWdodD5zZWxmLm56V2lkdGgpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImxlbnNcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnpvb21MZW5zLmNzcyh7IFwiYmFja2dyb3VuZC1zaXplXCI6IHNlbGYubGFyZ2VXaWR0aC9zZWxmLm5ld3ZhbHVlaGVpZ2h0ICsgJ3B4ICcgKyBzZWxmLmxhcmdlSGVpZ2h0L3NlbGYubmV3dmFsdWVoZWlnaHQgKyAncHgnIH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnpvb21XaW5kb3cuY3NzKHsgXCJiYWNrZ3JvdW5kLXNpemVcIjogc2VsZi5sYXJnZVdpZHRoL3NlbGYubmV3dmFsdWVoZWlnaHQgKyAncHggJyArIHNlbGYubGFyZ2VIZWlnaHQvc2VsZi5uZXd2YWx1ZWhlaWdodCArICdweCcgfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJsZW5zXCIpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi56b29tTGVucy5jc3MoeyBcImJhY2tncm91bmQtc2l6ZVwiOiBzZWxmLmxhcmdlV2lkdGgvc2VsZi5uZXd2YWx1ZXdpZHRoICsgJ3B4ICcgKyBzZWxmLmxhcmdlSGVpZ2h0L3NlbGYubmV3dmFsdWVoZWlnaHQgKyAncHgnIH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnpvb21XaW5kb3cuY3NzKHsgXCJiYWNrZ3JvdW5kLXNpemVcIjogc2VsZi5sYXJnZVdpZHRoL3NlbGYubmV3dmFsdWV3aWR0aCArICdweCAnICsgc2VsZi5sYXJnZUhlaWdodC9zZWxmLm5ld3ZhbHVld2lkdGggKyAncHgnIH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvKlxuICAgICAgICAgICAgIGlmKCFzZWxmLmJneHApe3NlbGYuYmd4cCA9IHNlbGYubGFyZ2VXaWR0aC9zZWxmLm5ld3ZhbHVlO31cblx0XHRcdFx0XHRcdGlmKCFzZWxmLmJneXApe3NlbGYuYmd5cCA9IHNlbGYubGFyZ2VIZWlnaHQvc2VsZi5uZXd2YWx1ZSA7fVxuICAgICAgICAgICAgICAgICBpZiAoIXNlbGYuYmdsb29wKXtcbiAgICAgICAgICAgICAgICAgXHRzZWxmLmJnbG9vcCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAgc2VsZi5iZ3hwICs9IChzZWxmLmxhcmdlV2lkdGgvc2VsZi5uZXd2YWx1ZSAgLSBzZWxmLmJneHApIC8gc2VsZi5vcHRpb25zLmVhc2luZ0Ftb3VudDtcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmJneXAgKz0gKHNlbGYubGFyZ2VIZWlnaHQvc2VsZi5uZXd2YWx1ZSAgLSBzZWxmLmJneXApIC8gc2VsZi5vcHRpb25zLmVhc2luZ0Ftb3VudDtcblxuICAgICAgICAgICBzZWxmLnpvb21XaW5kb3cuY3NzKHsgXCJiYWNrZ3JvdW5kLXNpemVcIjogc2VsZi5iZ3hwICsgJ3B4ICcgKyBzZWxmLmJneXAgKyAncHgnIH0pO1xuXG5cbiAgICAgICAgICAgICAgICAgIH0sIDE2KTtcblxuICAgICAgICAgICAgICAgICB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLmNoYW5nZUJnU2l6ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnpvb21XaW5kb3cuY3NzKHsgYmFja2dyb3VuZFBvc2l0aW9uOiBzZWxmLndpbmRvd0xlZnRQb3MgKyAncHggJyArIHNlbGYud2luZG93VG9wUG9zICsgJ3B4JyB9KTtcblx0XHRcdFx0XHRcdFx0XHRcdHNlbGYuc2Nyb2xsaW5nTG9jayA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5sb29wID0gZmFsc2U7XG5cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAoTWF0aC5yb3VuZChNYXRoLmFicyhzZWxmLnhwIC0gc2VsZi53aW5kb3dMZWZ0UG9zKSArIE1hdGguYWJzKHNlbGYueXAgLSBzZWxmLndpbmRvd1RvcFBvcykpIDwgMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly9zdG9wcyBtaWNybyBtb3ZlbWVudHNcblx0XHRcdFx0XHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwoc2VsZi5sb29wKTtcblx0XHRcdFx0XHRcdFx0XHRcdHNlbGYuem9vbVdpbmRvdy5jc3MoeyBiYWNrZ3JvdW5kUG9zaXRpb246IHNlbGYud2luZG93TGVmdFBvcyArICdweCAnICsgc2VsZi53aW5kb3dUb3BQb3MgKyAncHgnIH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5sb29wID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihzZWxmLmNoYW5nZUJnU2l6ZSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHNlbGYubnpIZWlnaHQ+c2VsZi5ueldpZHRoKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJsZW5zXCIpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi56b29tTGVucy5jc3MoeyBcImJhY2tncm91bmQtc2l6ZVwiOiBzZWxmLmxhcmdlV2lkdGgvc2VsZi5uZXd2YWx1ZWhlaWdodCArICdweCAnICsgc2VsZi5sYXJnZUhlaWdodC9zZWxmLm5ld3ZhbHVlaGVpZ2h0ICsgJ3B4JyB9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi56b29tV2luZG93LmNzcyh7IFwiYmFja2dyb3VuZC1zaXplXCI6IHNlbGYubGFyZ2VXaWR0aC9zZWxmLm5ld3ZhbHVlaGVpZ2h0ICsgJ3B4ICcgKyBzZWxmLmxhcmdlSGVpZ2h0L3NlbGYubmV3dmFsdWVoZWlnaHQgKyAncHgnIH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlICE9IFwibGVuc1wiKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNlbGYuem9vbUxlbnMuY3NzKHsgXCJiYWNrZ3JvdW5kLXNpemVcIjogc2VsZi5sYXJnZVdpZHRoL3NlbGYubmV3dmFsdWV3aWR0aCArICdweCAnICsgc2VsZi5sYXJnZUhlaWdodC9zZWxmLm5ld3ZhbHVld2lkdGggKyAncHgnIH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnpvb21XaW5kb3cuY3NzKHsgXCJiYWNrZ3JvdW5kLXNpemVcIjogc2VsZi5sYXJnZVdpZHRoL3NlbGYubmV3dmFsdWV3aWR0aCArICdweCAnICsgc2VsZi5sYXJnZUhlaWdodC9zZWxmLm5ld3ZhbHVld2lkdGggKyAncHgnIH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNlbGYuY2hhbmdlQmdTaXplID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdHNlbGYuem9vbVdpbmRvdy5jc3MoeyBiYWNrZ3JvdW5kUG9zaXRpb246IHNlbGYueHAgKyAncHggJyArIHNlbGYueXAgKyAncHgnIH0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSwgMTYpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0aWYoc2VsZi5jaGFuZ2VCZ1NpemUpe1xuXHRcdFx0XHRcdFx0XHRpZihzZWxmLm56SGVpZ2h0PnNlbGYubnpXaWR0aCl7XG5cdFx0XHRcdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlID09IFwibGVuc1wiKXtcblx0XHRcdFx0XHRcdFx0XHRcdHNlbGYuem9vbUxlbnMuY3NzKHsgXCJiYWNrZ3JvdW5kLXNpemVcIjogc2VsZi5sYXJnZVdpZHRoL3NlbGYubmV3dmFsdWVoZWlnaHQgKyAncHggJyArIHNlbGYubGFyZ2VIZWlnaHQvc2VsZi5uZXd2YWx1ZWhlaWdodCArICdweCcgfSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0c2VsZi56b29tV2luZG93LmNzcyh7IFwiYmFja2dyb3VuZC1zaXplXCI6IHNlbGYubGFyZ2VXaWR0aC9zZWxmLm5ld3ZhbHVlaGVpZ2h0ICsgJ3B4ICcgKyBzZWxmLmxhcmdlSGVpZ2h0L3NlbGYubmV3dmFsdWVoZWlnaHQgKyAncHgnIH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlID09IFwibGVuc1wiKXtcblx0XHRcdFx0XHRcdFx0XHRcdHNlbGYuem9vbUxlbnMuY3NzKHsgXCJiYWNrZ3JvdW5kLXNpemVcIjogc2VsZi5sYXJnZVdpZHRoL3NlbGYubmV3dmFsdWV3aWR0aCArICdweCAnICsgc2VsZi5sYXJnZUhlaWdodC9zZWxmLm5ld3ZhbHVld2lkdGggKyAncHgnIH0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZigoc2VsZi5sYXJnZUhlaWdodC9zZWxmLm5ld3ZhbHVld2lkdGgpIDwgc2VsZi5vcHRpb25zLnpvb21XaW5kb3dIZWlnaHQpe1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnpvb21XaW5kb3cuY3NzKHsgXCJiYWNrZ3JvdW5kLXNpemVcIjogc2VsZi5sYXJnZVdpZHRoL3NlbGYubmV3dmFsdWV3aWR0aCArICdweCAnICsgc2VsZi5sYXJnZUhlaWdodC9zZWxmLm5ld3ZhbHVld2lkdGggKyAncHgnIH0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRlbHNle1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnpvb21XaW5kb3cuY3NzKHsgXCJiYWNrZ3JvdW5kLXNpemVcIjogc2VsZi5sYXJnZVdpZHRoL3NlbGYubmV3dmFsdWVoZWlnaHQgKyAncHggJyArIHNlbGYubGFyZ2VIZWlnaHQvc2VsZi5uZXd2YWx1ZWhlaWdodCArICdweCcgfSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0c2VsZi5jaGFuZ2VCZ1NpemUgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0c2VsZi56b29tV2luZG93LmNzcyh7IGJhY2tncm91bmRQb3NpdGlvbjogc2VsZi53aW5kb3dMZWZ0UG9zICsgJ3B4ICcgKyBzZWxmLndpbmRvd1RvcFBvcyArICdweCcgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0c2V0VGludFBvc2l0aW9uOiBmdW5jdGlvbihlKXtcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XHRzZWxmLm56T2Zmc2V0ID0gc2VsZi4kZWxlbS5vZmZzZXQoKTtcblx0XHRcdFx0c2VsZi50aW50cG9zID0gU3RyaW5nKCgoZS5wYWdlWCAtIHNlbGYubnpPZmZzZXQubGVmdCktKHNlbGYuem9vbUxlbnMud2lkdGgoKSAvIDIpKSAqICgtMSkpO1xuXHRcdFx0XHRzZWxmLnRpbnRwb3N5ID0gU3RyaW5nKCgoZS5wYWdlWSAtIHNlbGYubnpPZmZzZXQudG9wKSAtIHNlbGYuem9vbUxlbnMuaGVpZ2h0KCkgLyAyKSAqICgtMSkpO1xuXHRcdFx0XHRpZihzZWxmLkV0b3Bwb3Mpe1xuXHRcdFx0XHRcdHNlbGYudGludHBvc3kgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHNlbGYuRWxvcHBvcyl7XG5cdFx0XHRcdFx0c2VsZi50aW50cG9zPTA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoc2VsZi5FYm9wcG9zKXtcblx0XHRcdFx0XHRzZWxmLnRpbnRwb3N5ID0gKHNlbGYubnpIZWlnaHQtc2VsZi56b29tTGVucy5oZWlnaHQoKS0oc2VsZi5vcHRpb25zLmxlbnNCb3JkZXJTaXplKjIpKSooLTEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHNlbGYuRXJvcHBvcyl7XG5cdFx0XHRcdFx0c2VsZi50aW50cG9zID0gKChzZWxmLm56V2lkdGgtc2VsZi56b29tTGVucy53aWR0aCgpLShzZWxmLm9wdGlvbnMubGVuc0JvcmRlclNpemUqMikpKigtMSkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy50aW50KSB7XG5cdFx0XHRcdFx0Ly9zdG9wcyBtaWNybyBtb3ZlbWVudHNcblx0XHRcdFx0XHRpZihzZWxmLmZ1bGxoZWlnaHQpe1xuXHRcdFx0XHRcdFx0c2VsZi50aW50cG9zeSA9IDA7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoc2VsZi5mdWxsd2lkdGgpe1xuXHRcdFx0XHRcdFx0c2VsZi50aW50cG9zID0gMDtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzZWxmLnpvb21UaW50SW1hZ2UuY3NzKHsnbGVmdCc6IHNlbGYudGludHBvcysncHgnfSk7XG5cdFx0XHRcdFx0c2VsZi56b29tVGludEltYWdlLmNzcyh7J3RvcCc6IHNlbGYudGludHBvc3krJ3B4J30pO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRzd2FwdGhlaW1hZ2U6IGZ1bmN0aW9uKHNtYWxsaW1hZ2UsIGxhcmdlaW1hZ2Upe1xuXHRcdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRcdHZhciBuZXdJbWcgPSBuZXcgSW1hZ2UoKTtcblxuXHRcdFx0XHRpZihzZWxmLm9wdGlvbnMubG9hZGluZ0ljb24pe1xuXHRcdFx0XHRcdHNlbGYuc3Bpbm5lciA9ICQoJzxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kOiB1cmwoXFwnJytzZWxmLm9wdGlvbnMubG9hZGluZ0ljb24rJ1xcJykgbm8tcmVwZWF0IGNlbnRlcjtoZWlnaHQ6JytzZWxmLm56SGVpZ2h0KydweDt3aWR0aDonK3NlbGYubnpXaWR0aCsncHg7ei1pbmRleDogMjAwMDtwb3NpdGlvbjogYWJzb2x1dGU7IGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XCI+PC9kaXY+Jyk7XG5cdFx0XHRcdFx0c2VsZi4kZWxlbS5hZnRlcihzZWxmLnNwaW5uZXIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2VsZi5vcHRpb25zLm9uSW1hZ2VTd2FwKHNlbGYuJGVsZW0pO1xuXG5cdFx0XHRcdG5ld0ltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRzZWxmLmxhcmdlV2lkdGggPSBuZXdJbWcud2lkdGg7XG5cdFx0XHRcdFx0c2VsZi5sYXJnZUhlaWdodCA9IG5ld0ltZy5oZWlnaHQ7XG5cdFx0XHRcdFx0c2VsZi56b29tSW1hZ2UgPSBsYXJnZWltYWdlO1xuXHRcdFx0XHRcdHNlbGYuem9vbVdpbmRvdy5jc3MoeyBcImJhY2tncm91bmQtc2l6ZVwiOiBzZWxmLmxhcmdlV2lkdGggKyAncHggJyArIHNlbGYubGFyZ2VIZWlnaHQgKyAncHgnIH0pO1xuXHRcdFx0XHRcdHNlbGYuc3dhcEFjdGlvbihzbWFsbGltYWdlLCBsYXJnZWltYWdlKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0bmV3SW1nLnNyYyA9IGxhcmdlaW1hZ2U7IC8vIHRoaXMgbXVzdCBiZSBkb25lIEFGVEVSIHNldHRpbmcgb25sb2FkXG5cblx0XHRcdH0sXG5cdFx0XHRzd2FwQWN0aW9uOiBmdW5jdGlvbihzbWFsbGltYWdlLCBsYXJnZWltYWdlKXtcblxuXG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdFx0XHR2YXIgbmV3SW1nMiA9IG5ldyBJbWFnZSgpO1xuXHRcdFx0XHRuZXdJbWcyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdC8vcmUtY2FsY3VsYXRlIHZhbHVlc1xuXHRcdFx0XHRcdHNlbGYubnpIZWlnaHQgPSBuZXdJbWcyLmhlaWdodDtcblx0XHRcdFx0XHRzZWxmLm56V2lkdGggPSBuZXdJbWcyLndpZHRoO1xuXHRcdFx0XHRcdHNlbGYub3B0aW9ucy5vbkltYWdlU3dhcENvbXBsZXRlKHNlbGYuJGVsZW0pO1xuXG5cdFx0XHRcdFx0c2VsZi5kb25lQ2FsbGJhY2soKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0bmV3SW1nMi5zcmMgPSBzbWFsbGltYWdlO1xuXG5cdFx0XHRcdC8vcmVzZXQgdGhlIHpvb21sZXZlbCB0byB0aGF0IGluaXRpYWxseSBzZXQgaW4gb3B0aW9uc1xuXHRcdFx0XHRzZWxmLmN1cnJlbnRab29tTGV2ZWwgPSBzZWxmLm9wdGlvbnMuem9vbUxldmVsO1xuXHRcdFx0XHRzZWxmLm9wdGlvbnMubWF4Wm9vbUxldmVsID0gZmFsc2U7XG5cblx0XHRcdFx0Ly9zd2FwcyB0aGUgbWFpbiBpbWFnZVxuXHRcdFx0XHQvL3NlbGYuJGVsZW0uYXR0cihcInNyY1wiLHNtYWxsaW1hZ2UpO1xuXHRcdFx0XHQvL3N3YXBzIHRoZSB6b29tIGltYWdlXG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImxlbnNcIikge1xuXHRcdFx0XHRcdHNlbGYuem9vbUxlbnMuY3NzKHsgYmFja2dyb3VuZEltYWdlOiBcInVybCgnXCIgKyBsYXJnZWltYWdlICsgXCInKVwiIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcIndpbmRvd1wiKSB7XG5cdFx0XHRcdFx0c2VsZi56b29tV2luZG93LmNzcyh7IGJhY2tncm91bmRJbWFnZTogXCJ1cmwoJ1wiICsgbGFyZ2VpbWFnZSArIFwiJylcIiB9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJpbm5lclwiKSB7XG5cdFx0XHRcdFx0c2VsZi56b29tV2luZG93LmNzcyh7IGJhY2tncm91bmRJbWFnZTogXCJ1cmwoJ1wiICsgbGFyZ2VpbWFnZSArIFwiJylcIiB9KTtcblx0XHRcdFx0fVxuXG5cblxuXHRcdFx0XHRzZWxmLmN1cnJlbnRJbWFnZSA9IGxhcmdlaW1hZ2U7XG5cblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLmltYWdlQ3Jvc3NmYWRlKXtcblx0XHRcdFx0XHR2YXIgb2xkSW1nID0gc2VsZi4kZWxlbTtcblx0XHRcdFx0XHR2YXIgbmV3SW1nID0gb2xkSW1nLmNsb25lKCk7XG5cdFx0XHRcdFx0c2VsZi4kZWxlbS5hdHRyKFwic3JjXCIsc21hbGxpbWFnZSlcblx0XHRcdFx0XHRzZWxmLiRlbGVtLmFmdGVyKG5ld0ltZyk7XG5cdFx0XHRcdFx0bmV3SW1nLnN0b3AodHJ1ZSkuZmFkZU91dChzZWxmLm9wdGlvbnMuaW1hZ2VDcm9zc2ZhZGUsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmUoKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdC8vICAgICAgIFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlID09IFwiaW5uZXJcIil7XG5cdFx0XHRcdFx0Ly9yZW1vdmUgYW55IGF0dHJpYnV0ZXMgb24gdGhlIGNsb25lZCBpbWFnZSBzbyB3ZSBjYW4gcmVzaXplIGxhdGVyXG5cdFx0XHRcdFx0c2VsZi4kZWxlbS53aWR0aChcImF1dG9cIikucmVtb3ZlQXR0cihcIndpZHRoXCIpO1xuXHRcdFx0XHRcdHNlbGYuJGVsZW0uaGVpZ2h0KFwiYXV0b1wiKS5yZW1vdmVBdHRyKFwiaGVpZ2h0XCIpO1xuXHRcdFx0XHRcdC8vICAgfVxuXG5cdFx0XHRcdFx0b2xkSW1nLmZhZGVJbihzZWxmLm9wdGlvbnMuaW1hZ2VDcm9zc2ZhZGUpO1xuXG5cdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnRpbnQgJiYgc2VsZi5vcHRpb25zLnpvb21UeXBlICE9IFwiaW5uZXJcIikge1xuXG5cdFx0XHRcdFx0XHR2YXIgb2xkSW1nVGludCA9IHNlbGYuem9vbVRpbnRJbWFnZTtcblx0XHRcdFx0XHRcdHZhciBuZXdJbWdUaW50ID0gb2xkSW1nVGludC5jbG9uZSgpO1xuXHRcdFx0XHRcdFx0c2VsZi56b29tVGludEltYWdlLmF0dHIoXCJzcmNcIixsYXJnZWltYWdlKVxuXHRcdFx0XHRcdFx0c2VsZi56b29tVGludEltYWdlLmFmdGVyKG5ld0ltZ1RpbnQpO1xuXHRcdFx0XHRcdFx0bmV3SW1nVGludC5zdG9wKHRydWUpLmZhZGVPdXQoc2VsZi5vcHRpb25zLmltYWdlQ3Jvc3NmYWRlLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cblxuXHRcdFx0XHRcdFx0b2xkSW1nVGludC5mYWRlSW4oc2VsZi5vcHRpb25zLmltYWdlQ3Jvc3NmYWRlKTtcblxuXG5cdFx0XHRcdFx0XHQvL3NlbGYuem9vbVRpbnRJbWFnZS5hdHRyKFwid2lkdGhcIixlbGVtLmRhdGEoXCJpbWFnZVwiKSk7XG5cblx0XHRcdFx0XHRcdC8vcmVzaXplIHRoZSB0aW50IHdpbmRvd1xuXHRcdFx0XHRcdFx0c2VsZi56b29tVGludC5jc3MoeyBoZWlnaHQ6IHNlbGYuJGVsZW0uaGVpZ2h0KCl9KTtcblx0XHRcdFx0XHRcdHNlbGYuem9vbVRpbnQuY3NzKHsgd2lkdGg6IHNlbGYuJGVsZW0ud2lkdGgoKX0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHNlbGYuem9vbUNvbnRhaW5lci5jc3MoXCJoZWlnaHRcIiwgc2VsZi4kZWxlbS5oZWlnaHQoKSk7XG5cdFx0XHRcdFx0c2VsZi56b29tQ29udGFpbmVyLmNzcyhcIndpZHRoXCIsIHNlbGYuJGVsZW0ud2lkdGgoKSk7XG5cblx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJpbm5lclwiKXtcblx0XHRcdFx0XHRcdGlmKCFzZWxmLm9wdGlvbnMuY29uc3RyYWluVHlwZSl7XG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbVdyYXAucGFyZW50KCkuY3NzKFwiaGVpZ2h0XCIsIHNlbGYuJGVsZW0uaGVpZ2h0KCkpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLnpvb21XcmFwLnBhcmVudCgpLmNzcyhcIndpZHRoXCIsIHNlbGYuJGVsZW0ud2lkdGgoKSk7XG5cblx0XHRcdFx0XHRcdFx0c2VsZi56b29tV2luZG93LmNzcyhcImhlaWdodFwiLCBzZWxmLiRlbGVtLmhlaWdodCgpKTtcblx0XHRcdFx0XHRcdFx0c2VsZi56b29tV2luZG93LmNzcyhcIndpZHRoXCIsIHNlbGYuJGVsZW0ud2lkdGgoKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLmltYWdlQ3Jvc3NmYWRlKXtcblx0XHRcdFx0XHRcdHNlbGYuem9vbVdyYXAuY3NzKFwiaGVpZ2h0XCIsIHNlbGYuJGVsZW0uaGVpZ2h0KCkpO1xuXHRcdFx0XHRcdFx0c2VsZi56b29tV3JhcC5jc3MoXCJ3aWR0aFwiLCBzZWxmLiRlbGVtLndpZHRoKCkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdHNlbGYuJGVsZW0uYXR0cihcInNyY1wiLHNtYWxsaW1hZ2UpO1xuXHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy50aW50KSB7XG5cdFx0XHRcdFx0XHRzZWxmLnpvb21UaW50SW1hZ2UuYXR0cihcInNyY1wiLGxhcmdlaW1hZ2UpO1xuXHRcdFx0XHRcdFx0Ly9zZWxmLnpvb21UaW50SW1hZ2UuYXR0cihcIndpZHRoXCIsZWxlbS5kYXRhKFwiaW1hZ2VcIikpO1xuXHRcdFx0XHRcdFx0c2VsZi56b29tVGludEltYWdlLmF0dHIoXCJoZWlnaHRcIixzZWxmLiRlbGVtLmhlaWdodCgpKTtcblx0XHRcdFx0XHRcdC8vc2VsZi56b29tVGludEltYWdlLmF0dHIoJ3NyYycpID0gZWxlbS5kYXRhKFwiaW1hZ2VcIik7XG5cdFx0XHRcdFx0XHRzZWxmLnpvb21UaW50SW1hZ2UuY3NzKHsgaGVpZ2h0OiBzZWxmLiRlbGVtLmhlaWdodCgpfSk7XG5cdFx0XHRcdFx0XHRzZWxmLnpvb21UaW50LmNzcyh7IGhlaWdodDogc2VsZi4kZWxlbS5oZWlnaHQoKX0pO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNlbGYuem9vbUNvbnRhaW5lci5jc3MoXCJoZWlnaHRcIiwgc2VsZi4kZWxlbS5oZWlnaHQoKSk7XG5cdFx0XHRcdFx0c2VsZi56b29tQ29udGFpbmVyLmNzcyhcIndpZHRoXCIsIHNlbGYuJGVsZW0ud2lkdGgoKSk7XG5cblx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuaW1hZ2VDcm9zc2ZhZGUpe1xuXHRcdFx0XHRcdFx0c2VsZi56b29tV3JhcC5jc3MoXCJoZWlnaHRcIiwgc2VsZi4kZWxlbS5oZWlnaHQoKSk7XG5cdFx0XHRcdFx0XHRzZWxmLnpvb21XcmFwLmNzcyhcIndpZHRoXCIsIHNlbGYuJGVsZW0ud2lkdGgoKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy5jb25zdHJhaW5UeXBlKXtcblxuXHRcdFx0XHRcdC8vVGhpcyB3aWxsIGNvbnRyYWluIHRoZSBpbWFnZSBwcm9wb3J0aW9uc1xuXHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy5jb25zdHJhaW5UeXBlID09IFwiaGVpZ2h0XCIpe1xuXG5cdFx0XHRcdFx0XHRzZWxmLnpvb21Db250YWluZXIuY3NzKFwiaGVpZ2h0XCIsIHNlbGYub3B0aW9ucy5jb25zdHJhaW5TaXplKTtcblx0XHRcdFx0XHRcdHNlbGYuem9vbUNvbnRhaW5lci5jc3MoXCJ3aWR0aFwiLCBcImF1dG9cIik7XG5cblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy5pbWFnZUNyb3NzZmFkZSl7XG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbVdyYXAuY3NzKFwiaGVpZ2h0XCIsIHNlbGYub3B0aW9ucy5jb25zdHJhaW5TaXplKTtcblx0XHRcdFx0XHRcdFx0c2VsZi56b29tV3JhcC5jc3MoXCJ3aWR0aFwiLCBcImF1dG9cIik7XG5cdFx0XHRcdFx0XHRcdHNlbGYuY29uc3R3aWR0aCA9IHNlbGYuem9vbVdyYXAud2lkdGgoKTtcblxuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHRzZWxmLiRlbGVtLmNzcyhcImhlaWdodFwiLCBzZWxmLm9wdGlvbnMuY29uc3RyYWluU2l6ZSk7XG5cdFx0XHRcdFx0XHRcdHNlbGYuJGVsZW0uY3NzKFwid2lkdGhcIiwgXCJhdXRvXCIpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLmNvbnN0d2lkdGggPSBzZWxmLiRlbGVtLndpZHRoKCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImlubmVyXCIpe1xuXG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbVdyYXAucGFyZW50KCkuY3NzKFwiaGVpZ2h0XCIsIHNlbGYub3B0aW9ucy5jb25zdHJhaW5TaXplKTtcblx0XHRcdFx0XHRcdFx0c2VsZi56b29tV3JhcC5wYXJlbnQoKS5jc3MoXCJ3aWR0aFwiLCBzZWxmLmNvbnN0d2lkdGgpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLnpvb21XaW5kb3cuY3NzKFwiaGVpZ2h0XCIsIHNlbGYub3B0aW9ucy5jb25zdHJhaW5TaXplKTtcblx0XHRcdFx0XHRcdFx0c2VsZi56b29tV2luZG93LmNzcyhcIndpZHRoXCIsIHNlbGYuY29uc3R3aWR0aCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMudGludCl7XG5cdFx0XHRcdFx0XHRcdHNlbGYudGludENvbnRhaW5lci5jc3MoXCJoZWlnaHRcIiwgc2VsZi5vcHRpb25zLmNvbnN0cmFpblNpemUpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLnRpbnRDb250YWluZXIuY3NzKFwid2lkdGhcIiwgc2VsZi5jb25zdHdpZHRoKTtcblx0XHRcdFx0XHRcdFx0c2VsZi56b29tVGludC5jc3MoXCJoZWlnaHRcIiwgc2VsZi5vcHRpb25zLmNvbnN0cmFpblNpemUpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLnpvb21UaW50LmNzcyhcIndpZHRoXCIsIHNlbGYuY29uc3R3aWR0aCk7XG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbVRpbnRJbWFnZS5jc3MoXCJoZWlnaHRcIiwgc2VsZi5vcHRpb25zLmNvbnN0cmFpblNpemUpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLnpvb21UaW50SW1hZ2UuY3NzKFwid2lkdGhcIiwgc2VsZi5jb25zdHdpZHRoKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuY29uc3RyYWluVHlwZSA9PSBcIndpZHRoXCIpe1xuXHRcdFx0XHRcdFx0c2VsZi56b29tQ29udGFpbmVyLmNzcyhcImhlaWdodFwiLCBcImF1dG9cIik7XG5cdFx0XHRcdFx0XHRzZWxmLnpvb21Db250YWluZXIuY3NzKFwid2lkdGhcIiwgc2VsZi5vcHRpb25zLmNvbnN0cmFpblNpemUpO1xuXG5cdFx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuaW1hZ2VDcm9zc2ZhZGUpe1xuXHRcdFx0XHRcdFx0XHRzZWxmLnpvb21XcmFwLmNzcyhcImhlaWdodFwiLCBcImF1dG9cIik7XG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbVdyYXAuY3NzKFwid2lkdGhcIiwgc2VsZi5vcHRpb25zLmNvbnN0cmFpblNpemUpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLmNvbnN0aGVpZ2h0ID0gc2VsZi56b29tV3JhcC5oZWlnaHQoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHNlbGYuJGVsZW0uY3NzKFwiaGVpZ2h0XCIsIFwiYXV0b1wiKTtcblx0XHRcdFx0XHRcdFx0c2VsZi4kZWxlbS5jc3MoXCJ3aWR0aFwiLCBzZWxmLm9wdGlvbnMuY29uc3RyYWluU2l6ZSk7XG5cdFx0XHRcdFx0XHRcdHNlbGYuY29uc3RoZWlnaHQgPSBzZWxmLiRlbGVtLmhlaWdodCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlID09IFwiaW5uZXJcIil7XG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbVdyYXAucGFyZW50KCkuY3NzKFwiaGVpZ2h0XCIsIHNlbGYuY29uc3RoZWlnaHQpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLnpvb21XcmFwLnBhcmVudCgpLmNzcyhcIndpZHRoXCIsIHNlbGYub3B0aW9ucy5jb25zdHJhaW5TaXplKTtcblx0XHRcdFx0XHRcdFx0c2VsZi56b29tV2luZG93LmNzcyhcImhlaWdodFwiLCBzZWxmLmNvbnN0aGVpZ2h0KTtcblx0XHRcdFx0XHRcdFx0c2VsZi56b29tV2luZG93LmNzcyhcIndpZHRoXCIsIHNlbGYub3B0aW9ucy5jb25zdHJhaW5TaXplKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy50aW50KXtcblx0XHRcdFx0XHRcdFx0c2VsZi50aW50Q29udGFpbmVyLmNzcyhcImhlaWdodFwiLCBzZWxmLmNvbnN0aGVpZ2h0KTtcblx0XHRcdFx0XHRcdFx0c2VsZi50aW50Q29udGFpbmVyLmNzcyhcIndpZHRoXCIsIHNlbGYub3B0aW9ucy5jb25zdHJhaW5TaXplKTtcblx0XHRcdFx0XHRcdFx0c2VsZi56b29tVGludC5jc3MoXCJoZWlnaHRcIiwgc2VsZi5jb25zdGhlaWdodCk7XG5cdFx0XHRcdFx0XHRcdHNlbGYuem9vbVRpbnQuY3NzKFwid2lkdGhcIiwgc2VsZi5vcHRpb25zLmNvbnN0cmFpblNpemUpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLnpvb21UaW50SW1hZ2UuY3NzKFwiaGVpZ2h0XCIsIHNlbGYuY29uc3RoZWlnaHQpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLnpvb21UaW50SW1hZ2UuY3NzKFwid2lkdGhcIiwgc2VsZi5vcHRpb25zLmNvbnN0cmFpblNpemUpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9LFxuXHRcdFx0ZG9uZUNhbGxiYWNrOiBmdW5jdGlvbigpe1xuXG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLmxvYWRpbmdJY29uKXtcblx0XHRcdFx0XHRzZWxmLnNwaW5uZXIuaGlkZSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2VsZi5uek9mZnNldCA9IHNlbGYuJGVsZW0ub2Zmc2V0KCk7XG5cdFx0XHRcdHNlbGYubnpXaWR0aCA9IHNlbGYuJGVsZW0ud2lkdGgoKTtcblx0XHRcdFx0c2VsZi5uekhlaWdodCA9IHNlbGYuJGVsZW0uaGVpZ2h0KCk7XG5cblx0XHRcdFx0Ly8gcmVzZXQgdGhlIHpvb21sZXZlbCBiYWNrIHRvIGRlZmF1bHRcblx0XHRcdFx0c2VsZi5jdXJyZW50Wm9vbUxldmVsID0gc2VsZi5vcHRpb25zLnpvb21MZXZlbDtcblxuXHRcdFx0XHQvL3JhdGlvIG9mIHRoZSBsYXJnZSB0byBzbWFsbCBpbWFnZVxuXHRcdFx0XHRzZWxmLndpZHRoUmF0aW8gPSBzZWxmLmxhcmdlV2lkdGggLyBzZWxmLm56V2lkdGg7XG5cdFx0XHRcdHNlbGYuaGVpZ2h0UmF0aW8gPSBzZWxmLmxhcmdlSGVpZ2h0IC8gc2VsZi5uekhlaWdodDtcblxuXHRcdFx0XHQvL05FRUQgVE8gQUREIFRIRSBMRU5TIFNJWkUgRk9SIFJPVU5EXG5cdFx0XHRcdC8vIGFkanVzdCBpbWFnZXMgbGVzcyB0aGFuIHRoZSB3aW5kb3cgaGVpZ2h0XG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcIndpbmRvd1wiKSB7XG5cblx0XHRcdFx0XHRpZihzZWxmLm56SGVpZ2h0IDwgc2VsZi5vcHRpb25zLnpvb21XaW5kb3dXaWR0aC9zZWxmLndpZHRoUmF0aW8pe1xuXHRcdFx0XHRcdFx0bGVuc0hlaWdodCA9IHNlbGYubnpIZWlnaHQ7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdGxlbnNIZWlnaHQgPSBTdHJpbmcoKHNlbGYub3B0aW9ucy56b29tV2luZG93SGVpZ2h0L3NlbGYuaGVpZ2h0UmF0aW8pKVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tV2luZG93V2lkdGggPCBzZWxmLm9wdGlvbnMuem9vbVdpbmRvd1dpZHRoKXtcblx0XHRcdFx0XHRcdGxlbnNXaWR0aCA9IHNlbGYubnpXaWR0aDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdGxlbnNXaWR0aCA9ICAoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dXaWR0aC9zZWxmLndpZHRoUmF0aW8pO1xuXHRcdFx0XHRcdH1cblxuXG5cdFx0XHRcdFx0aWYoc2VsZi56b29tTGVucyl7XG5cblx0XHRcdFx0XHRcdHNlbGYuem9vbUxlbnMuY3NzKCd3aWR0aCcsIGxlbnNXaWR0aCk7XG5cdFx0XHRcdFx0XHRzZWxmLnpvb21MZW5zLmNzcygnaGVpZ2h0JywgbGVuc0hlaWdodCk7XG5cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGdldEN1cnJlbnRJbWFnZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0XHRyZXR1cm4gc2VsZi56b29tSW1hZ2U7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0R2FsbGVyeUxpc3Q6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFx0Ly9sb29wIHRocm91Z2ggdGhlIGdhbGxlcnkgb3B0aW9ucyBhbmQgc2V0IHRoZW0gaW4gbGlzdCBmb3IgZmFuY3lib3hcblx0XHRcdFx0c2VsZi5nYWxsZXJ5bGlzdCA9IFtdO1xuXHRcdFx0XHRpZiAoc2VsZi5vcHRpb25zLmdhbGxlcnkpe1xuXG5cblx0XHRcdFx0XHQkKCcjJytzZWxmLm9wdGlvbnMuZ2FsbGVyeSArICcgYScpLmVhY2goZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0XHRcdHZhciBpbWdfc3JjID0gJyc7XG5cdFx0XHRcdFx0XHRpZigkKHRoaXMpLmRhdGEoXCJ6b29tLWltYWdlXCIpKXtcblx0XHRcdFx0XHRcdFx0aW1nX3NyYyA9ICQodGhpcykuZGF0YShcInpvb20taW1hZ2VcIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmKCQodGhpcykuZGF0YShcImltYWdlXCIpKXtcblx0XHRcdFx0XHRcdFx0aW1nX3NyYyA9ICQodGhpcykuZGF0YShcImltYWdlXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly9wdXQgdGhlIGN1cnJlbnQgaW1hZ2UgYXQgdGhlIHN0YXJ0XG5cdFx0XHRcdFx0XHRpZihpbWdfc3JjID09IHNlbGYuem9vbUltYWdlKXtcblx0XHRcdFx0XHRcdFx0c2VsZi5nYWxsZXJ5bGlzdC51bnNoaWZ0KHtcblx0XHRcdFx0XHRcdFx0XHRocmVmOiAnJytpbWdfc3JjKycnLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiAkKHRoaXMpLmZpbmQoJ2ltZycpLmF0dHIoXCJ0aXRsZVwiKVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdHNlbGYuZ2FsbGVyeWxpc3QucHVzaCh7XG5cdFx0XHRcdFx0XHRcdFx0aHJlZjogJycraW1nX3NyYysnJyxcblx0XHRcdFx0XHRcdFx0XHR0aXRsZTogJCh0aGlzKS5maW5kKCdpbWcnKS5hdHRyKFwidGl0bGVcIilcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cblxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vaWYgbm8gZ2FsbGVyeSAtIHJldHVybiBjdXJyZW50IGltYWdlXG5cdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0c2VsZi5nYWxsZXJ5bGlzdC5wdXNoKHtcblx0XHRcdFx0XHRcdGhyZWY6ICcnK3NlbGYuem9vbUltYWdlKycnLFxuXHRcdFx0XHRcdFx0dGl0bGU6ICQodGhpcykuZmluZCgnaW1nJykuYXR0cihcInRpdGxlXCIpXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHNlbGYuZ2FsbGVyeWxpc3Q7XG5cblx0XHRcdH0sXG5cdFx0XHRjaGFuZ2Vab29tTGV2ZWw6IGZ1bmN0aW9uKHZhbHVlKXtcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0XHRcdC8vZmxhZyBhIHpvb20sIHNvIGNhbiBhZGp1c3QgdGhlIGVhc2luZyBkdXJpbmcgc2V0UG9zaXRpb25cblx0XHRcdFx0c2VsZi5zY3JvbGxpbmdMb2NrID0gdHJ1ZTtcblxuXHRcdFx0XHQvL3JvdW5kIHRvIHR3byBkZWNpbWFsIHBsYWNlc1xuXHRcdFx0XHRzZWxmLm5ld3ZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSkudG9GaXhlZCgyKTtcblx0XHRcdFx0bmV3dmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKS50b0ZpeGVkKDIpO1xuXG5cblxuXG5cdFx0XHRcdC8vbWF4d2lkdGggJiBNYXhoZWlnaHQgb2YgdGhlIGltYWdlXG5cdFx0XHRcdG1heGhlaWdodG5ld3ZhbHVlID0gc2VsZi5sYXJnZUhlaWdodC8oKHNlbGYub3B0aW9ucy56b29tV2luZG93SGVpZ2h0IC8gc2VsZi5uekhlaWdodCkgKiBzZWxmLm56SGVpZ2h0KTtcblx0XHRcdFx0bWF4d2lkdGh0bmV3dmFsdWUgPSBzZWxmLmxhcmdlV2lkdGgvKChzZWxmLm9wdGlvbnMuem9vbVdpbmRvd1dpZHRoIC8gc2VsZi5ueldpZHRoKSAqIHNlbGYubnpXaWR0aCk7XG5cblxuXG5cblx0XHRcdFx0Ly9jYWxjdWxhdGUgbmV3IGhlaWdodHJhdGlvXG5cdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSAhPSBcImlubmVyXCIpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZihtYXhoZWlnaHRuZXd2YWx1ZSA8PSBuZXd2YWx1ZSl7XG5cdFx0XHRcdFx0XHRzZWxmLmhlaWdodFJhdGlvID0gKHNlbGYubGFyZ2VIZWlnaHQvbWF4aGVpZ2h0bmV3dmFsdWUpIC8gc2VsZi5uekhlaWdodDtcblx0XHRcdFx0XHRcdHNlbGYubmV3dmFsdWVoZWlnaHQgPSBtYXhoZWlnaHRuZXd2YWx1ZTtcblx0XHRcdFx0XHRcdHNlbGYuZnVsbGhlaWdodCA9IHRydWU7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdHNlbGYuaGVpZ2h0UmF0aW8gPSAoc2VsZi5sYXJnZUhlaWdodC9uZXd2YWx1ZSkgLyBzZWxmLm56SGVpZ2h0O1xuXHRcdFx0XHRcdFx0c2VsZi5uZXd2YWx1ZWhlaWdodCA9IG5ld3ZhbHVlO1xuXHRcdFx0XHRcdFx0c2VsZi5mdWxsaGVpZ2h0ID0gZmFsc2U7XG5cblx0XHRcdFx0XHR9XG5cblxuLy9cdFx0XHRcdFx0Y2FsY3VsYXRlIG5ldyB3aWR0aCByYXRpb1xuXG5cdFx0XHRcdFx0aWYobWF4d2lkdGh0bmV3dmFsdWUgPD0gbmV3dmFsdWUpe1xuXHRcdFx0XHRcdFx0c2VsZi53aWR0aFJhdGlvID0gKHNlbGYubGFyZ2VXaWR0aC9tYXh3aWR0aHRuZXd2YWx1ZSkgLyBzZWxmLm56V2lkdGg7XG5cdFx0XHRcdFx0XHRzZWxmLm5ld3ZhbHVld2lkdGggPSBtYXh3aWR0aHRuZXd2YWx1ZTtcblx0XHRcdFx0XHRcdHNlbGYuZnVsbHdpZHRoID0gdHJ1ZTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0c2VsZi53aWR0aFJhdGlvID0gKHNlbGYubGFyZ2VXaWR0aC9uZXd2YWx1ZSkgLyBzZWxmLm56V2lkdGg7XG5cdFx0XHRcdFx0XHRzZWxmLm5ld3ZhbHVld2lkdGggPSBuZXd2YWx1ZTtcblx0XHRcdFx0XHRcdHNlbGYuZnVsbHdpZHRoID0gZmFsc2U7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlID09IFwibGVuc1wiKXtcblx0XHRcdFx0XHRcdGlmKG1heGhlaWdodG5ld3ZhbHVlIDw9IG5ld3ZhbHVlKXtcblx0XHRcdFx0XHRcdFx0c2VsZi5mdWxsd2lkdGggPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRzZWxmLm5ld3ZhbHVld2lkdGggPSBtYXhoZWlnaHRuZXd2YWx1ZTtcblxuXHRcdFx0XHRcdFx0fSBlbHNle1xuXHRcdFx0XHRcdFx0XHRzZWxmLndpZHRoUmF0aW8gPSAoc2VsZi5sYXJnZVdpZHRoL25ld3ZhbHVlKSAvIHNlbGYubnpXaWR0aDtcblx0XHRcdFx0XHRcdFx0c2VsZi5uZXd2YWx1ZXdpZHRoID0gbmV3dmFsdWU7XG5cblx0XHRcdFx0XHRcdFx0c2VsZi5mdWxsd2lkdGggPSBmYWxzZTtcblx0XHRcdFx0XHRcdH19XG5cdFx0XHRcdH1cblxuXG5cblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlID09IFwiaW5uZXJcIilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1heGhlaWdodG5ld3ZhbHVlID0gcGFyc2VGbG9hdChzZWxmLmxhcmdlSGVpZ2h0L3NlbGYubnpIZWlnaHQpLnRvRml4ZWQoMik7XG5cdFx0XHRcdFx0bWF4d2lkdGh0bmV3dmFsdWUgPSBwYXJzZUZsb2F0KHNlbGYubGFyZ2VXaWR0aC9zZWxmLm56V2lkdGgpLnRvRml4ZWQoMik7XG5cdFx0XHRcdFx0aWYobmV3dmFsdWUgPiBtYXhoZWlnaHRuZXd2YWx1ZSl7XG5cdFx0XHRcdFx0XHRuZXd2YWx1ZSA9IG1heGhlaWdodG5ld3ZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihuZXd2YWx1ZSA+IG1heHdpZHRodG5ld3ZhbHVlKXtcblx0XHRcdFx0XHRcdG5ld3ZhbHVlID0gbWF4d2lkdGh0bmV3dmFsdWU7XG5cdFx0XHRcdFx0fVxuXG5cblx0XHRcdFx0XHRpZihtYXhoZWlnaHRuZXd2YWx1ZSA8PSBuZXd2YWx1ZSl7XG5cblxuXHRcdFx0XHRcdFx0c2VsZi5oZWlnaHRSYXRpbyA9IChzZWxmLmxhcmdlSGVpZ2h0L25ld3ZhbHVlKSAvIHNlbGYubnpIZWlnaHQ7XG5cdFx0XHRcdFx0XHRpZihuZXd2YWx1ZSA+IG1heGhlaWdodG5ld3ZhbHVlKXtcblx0XHRcdFx0XHRcdFx0c2VsZi5uZXd2YWx1ZWhlaWdodCA9IG1heGhlaWdodG5ld3ZhbHVlO1xuXHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdHNlbGYubmV3dmFsdWVoZWlnaHQgPSBuZXd2YWx1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHNlbGYuZnVsbGhlaWdodCA9IHRydWU7XG5cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXG5cblxuXHRcdFx0XHRcdFx0c2VsZi5oZWlnaHRSYXRpbyA9IChzZWxmLmxhcmdlSGVpZ2h0L25ld3ZhbHVlKSAvIHNlbGYubnpIZWlnaHQ7XG5cblx0XHRcdFx0XHRcdGlmKG5ld3ZhbHVlID4gbWF4aGVpZ2h0bmV3dmFsdWUpe1xuXG5cdFx0XHRcdFx0XHRcdHNlbGYubmV3dmFsdWVoZWlnaHQgPSBtYXhoZWlnaHRuZXd2YWx1ZTtcblx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRzZWxmLm5ld3ZhbHVlaGVpZ2h0ID0gbmV3dmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzZWxmLmZ1bGxoZWlnaHQgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cblxuXG5cblx0XHRcdFx0XHRpZihtYXh3aWR0aHRuZXd2YWx1ZSA8PSBuZXd2YWx1ZSl7XG5cblx0XHRcdFx0XHRcdHNlbGYud2lkdGhSYXRpbyA9IChzZWxmLmxhcmdlV2lkdGgvbmV3dmFsdWUpIC8gc2VsZi5ueldpZHRoO1xuXHRcdFx0XHRcdFx0aWYobmV3dmFsdWUgPiBtYXh3aWR0aHRuZXd2YWx1ZSl7XG5cblx0XHRcdFx0XHRcdFx0c2VsZi5uZXd2YWx1ZXdpZHRoID0gbWF4d2lkdGh0bmV3dmFsdWU7XG5cdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0c2VsZi5uZXd2YWx1ZXdpZHRoID0gbmV3dmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHNlbGYuZnVsbHdpZHRoID0gdHJ1ZTtcblxuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cblx0XHRcdFx0XHRcdHNlbGYud2lkdGhSYXRpbyA9IChzZWxmLmxhcmdlV2lkdGgvbmV3dmFsdWUpIC8gc2VsZi5ueldpZHRoO1xuXHRcdFx0XHRcdFx0c2VsZi5uZXd2YWx1ZXdpZHRoID0gbmV3dmFsdWU7XG5cdFx0XHRcdFx0XHRzZWxmLmZ1bGx3aWR0aCA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblxuXG5cdFx0XHRcdH0gLy9lbmQgaW5uZXJcblx0XHRcdFx0c2NyY29udGludWUgPSBmYWxzZTtcblxuXHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJpbm5lclwiKXtcblxuXHRcdFx0XHRcdGlmKHNlbGYubnpXaWR0aCA+PSBzZWxmLm56SGVpZ2h0KXtcblx0XHRcdFx0XHRcdGlmKCBzZWxmLm5ld3ZhbHVld2lkdGggPD0gbWF4d2lkdGh0bmV3dmFsdWUpe1xuXHRcdFx0XHRcdFx0XHRzY3Jjb250aW51ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXG5cdFx0XHRcdFx0XHRcdHNjcmNvbnRpbnVlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdHNlbGYuZnVsbGhlaWdodCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdHNlbGYuZnVsbHdpZHRoID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoc2VsZi5uekhlaWdodCA+IHNlbGYubnpXaWR0aCl7XG5cdFx0XHRcdFx0XHRpZiggc2VsZi5uZXd2YWx1ZXdpZHRoIDw9IG1heHdpZHRodG5ld3ZhbHVlKXtcblx0XHRcdFx0XHRcdFx0c2NyY29udGludWUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0c2NyY29udGludWUgPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0XHRzZWxmLmZ1bGxoZWlnaHQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRzZWxmLmZ1bGx3aWR0aCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlICE9IFwiaW5uZXJcIil7XG5cdFx0XHRcdFx0c2NyY29udGludWUgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYoc2NyY29udGludWUpe1xuXG5cblxuXHRcdFx0XHRcdHNlbGYuem9vbUxvY2sgPSAwO1xuXHRcdFx0XHRcdHNlbGYuY2hhbmdlWm9vbSA9IHRydWU7XG5cblx0XHRcdFx0XHQvL2lmIGxlbnMgaGVpZ2h0IGlzIGxlc3MgdGhhbiBpbWFnZSBoZWlnaHRcblxuXG5cdFx0XHRcdFx0aWYoKChzZWxmLm9wdGlvbnMuem9vbVdpbmRvd0hlaWdodCkvc2VsZi5oZWlnaHRSYXRpbykgPD0gc2VsZi5uekhlaWdodCl7XG5cblxuXHRcdFx0XHRcdFx0c2VsZi5jdXJyZW50Wm9vbUxldmVsID0gc2VsZi5uZXd2YWx1ZWhlaWdodDtcblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSAhPSBcImxlbnNcIiAmJiBzZWxmLm9wdGlvbnMuem9vbVR5cGUgIT0gXCJpbm5lclwiKSB7XG5cdFx0XHRcdFx0XHRcdHNlbGYuY2hhbmdlQmdTaXplID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0XHRzZWxmLnpvb21MZW5zLmNzcyh7aGVpZ2h0OiBTdHJpbmcoKHNlbGYub3B0aW9ucy56b29tV2luZG93SGVpZ2h0KS9zZWxmLmhlaWdodFJhdGlvKSArICdweCcgfSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImxlbnNcIiB8fCBzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJpbm5lclwiKSB7XG5cdFx0XHRcdFx0XHRcdHNlbGYuY2hhbmdlQmdTaXplID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblxuXG5cdFx0XHRcdFx0fVxuXG5cblxuXG5cdFx0XHRcdFx0aWYoKHNlbGYub3B0aW9ucy56b29tV2luZG93V2lkdGgvc2VsZi53aWR0aFJhdGlvKSA8PSBzZWxmLm56V2lkdGgpe1xuXG5cblxuXHRcdFx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLnpvb21UeXBlICE9IFwiaW5uZXJcIil7XG5cdFx0XHRcdFx0XHRcdGlmKHNlbGYubmV3dmFsdWV3aWR0aCA+IHNlbGYubmV3dmFsdWVoZWlnaHQpICAge1xuXHRcdFx0XHRcdFx0XHRcdHNlbGYuY3VycmVudFpvb21MZXZlbCA9IHNlbGYubmV3dmFsdWV3aWR0aDtcblxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSAhPSBcImxlbnNcIiAmJiBzZWxmLm9wdGlvbnMuem9vbVR5cGUgIT0gXCJpbm5lclwiKSB7XG5cdFx0XHRcdFx0XHRcdHNlbGYuY2hhbmdlQmdTaXplID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0XHRzZWxmLnpvb21MZW5zLmNzcyh7d2lkdGg6IFN0cmluZygoc2VsZi5vcHRpb25zLnpvb21XaW5kb3dXaWR0aCkvc2VsZi53aWR0aFJhdGlvKSArICdweCcgfSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHNlbGYub3B0aW9ucy56b29tVHlwZSA9PSBcImxlbnNcIiB8fCBzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJpbm5lclwiKSB7XG5cdFx0XHRcdFx0XHRcdHNlbGYuY2hhbmdlQmdTaXplID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuem9vbVR5cGUgPT0gXCJpbm5lclwiKXtcblx0XHRcdFx0XHRcdHNlbGYuY2hhbmdlQmdTaXplID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0aWYoc2VsZi5ueldpZHRoID4gc2VsZi5uekhlaWdodCl7XG5cdFx0XHRcdFx0XHRcdHNlbGYuY3VycmVudFpvb21MZXZlbCA9IHNlbGYubmV3dmFsdWV3aWR0aDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKHNlbGYubnpIZWlnaHQgPiBzZWxmLm56V2lkdGgpe1xuXHRcdFx0XHRcdFx0XHRzZWxmLmN1cnJlbnRab29tTGV2ZWwgPSBzZWxmLm5ld3ZhbHVld2lkdGg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gICAgICAvL3VuZGVyXG5cblx0XHRcdFx0Ly9zZXRzIHRoZSBib3VuZHJ5IGNoYW5nZSwgY2FsbGVkIGluIHNldFdpbmRvd1Bvc1xuXHRcdFx0XHRzZWxmLnNldFBvc2l0aW9uKHNlbGYuY3VycmVudExvYyk7XG5cdFx0XHRcdC8vXG5cdFx0XHR9LFxuXHRcdFx0Y2xvc2VBbGw6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKHNlbGYuem9vbVdpbmRvdyl7c2VsZi56b29tV2luZG93LmhpZGUoKTt9XG5cdFx0XHRcdGlmKHNlbGYuem9vbUxlbnMpe3NlbGYuem9vbUxlbnMuaGlkZSgpO31cblx0XHRcdFx0aWYoc2VsZi56b29tVGludCl7c2VsZi56b29tVGludC5oaWRlKCk7fVxuXHRcdFx0fSxcblx0XHRcdGNoYW5nZVN0YXRlOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICBcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdFx0aWYodmFsdWUgPT0gJ2VuYWJsZScpe3NlbGYub3B0aW9ucy56b29tRW5hYmxlZCA9IHRydWU7fVxuXHRcdFx0XHRpZih2YWx1ZSA9PSAnZGlzYWJsZScpe3NlbGYub3B0aW9ucy56b29tRW5hYmxlZCA9IGZhbHNlO31cblxuXHRcdFx0fVxuXG5cdH07XG5cblxuXG5cblx0JC5mbi5lbGV2YXRlWm9vbSA9IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZWxldmF0ZSA9IE9iamVjdC5jcmVhdGUoIEVsZXZhdGVab29tICk7XG5cblx0XHRcdGVsZXZhdGUuaW5pdCggb3B0aW9ucywgdGhpcyApO1xuXG5cdFx0XHQkLmRhdGEoIHRoaXMsICdlbGV2YXRlWm9vbScsIGVsZXZhdGUgKTtcblxuXHRcdH0pO1xuXHR9O1xuXG5cdCQuZm4uZWxldmF0ZVpvb20ub3B0aW9ucyA9IHtcblx0XHRcdHpvb21BY3RpdmF0aW9uOiBcImhvdmVyXCIsIC8vIENhbiBhbHNvIGJlIGNsaWNrIChQTEFDRUhPTERFUiBGT1IgTkVYVCBWRVJTSU9OKVxuICAgICAgem9vbUVuYWJsZWQ6IHRydWUsIC8vZmFsc2UgZGlzYWJsZXMgem9vbXdpbmRvdyBmcm9tIHNob3dpbmdcblx0XHRcdHByZWxvYWRpbmc6IDEsIC8vYnkgZGVmYXVsdCwgbG9hZCBhbGwgdGhlIGltYWdlcywgaWYgMCwgdGhlbiBvbmx5IGxvYWQgaW1hZ2VzIGFmdGVyIGFjdGl2YXRlZCAoUExBQ0VIT0xERVIgRk9SIE5FWFQgVkVSU0lPTilcblx0XHRcdHpvb21MZXZlbDogMSwgLy9kZWZhdWx0IHpvb20gbGV2ZWwgb2YgaW1hZ2Vcblx0XHRcdHNjcm9sbFpvb206IGZhbHNlLCAvL2FsbG93IHpvb20gb24gbW91c2V3aGVlbCwgdHJ1ZSB0byBhY3RpdmF0ZVxuXHRcdFx0c2Nyb2xsWm9vbUluY3JlbWVudDogMC4xLCAgLy9zdGVwcyBvZiB0aGUgc2Nyb2xsem9vbVxuXHRcdFx0bWluWm9vbUxldmVsOiBmYWxzZSxcblx0XHRcdG1heFpvb21MZXZlbDogZmFsc2UsXG5cdFx0XHRlYXNpbmc6IGZhbHNlLFxuXHRcdFx0ZWFzaW5nQW1vdW50OiAxMixcblx0XHRcdGxlbnNTaXplOiAyMDAsXG5cdFx0XHR6b29tV2luZG93V2lkdGg6IDQwMCxcblx0XHRcdHpvb21XaW5kb3dIZWlnaHQ6IDQwMCxcblx0XHRcdHpvb21XaW5kb3dPZmZldHg6IDAsXG5cdFx0XHR6b29tV2luZG93T2ZmZXR5OiAwLFxuXHRcdFx0em9vbVdpbmRvd1Bvc2l0aW9uOiAxLFxuXHRcdFx0em9vbVdpbmRvd0JnQ29sb3VyOiBcIiNmZmZcIixcblx0XHRcdGxlbnNGYWRlSW46IGZhbHNlLFxuXHRcdFx0bGVuc0ZhZGVPdXQ6IGZhbHNlLFxuXHRcdFx0ZGVidWc6IGZhbHNlLFxuXHRcdFx0em9vbVdpbmRvd0ZhZGVJbjogZmFsc2UsXG5cdFx0XHR6b29tV2luZG93RmFkZU91dDogZmFsc2UsXG5cdFx0XHR6b29tV2luZG93QWx3YXlzU2hvdzogZmFsc2UsXG5cdFx0XHR6b29tVGludEZhZGVJbjogZmFsc2UsXG5cdFx0XHR6b29tVGludEZhZGVPdXQ6IGZhbHNlLFxuXHRcdFx0Ym9yZGVyU2l6ZTogNCxcblx0XHRcdHNob3dMZW5zOiB0cnVlLFxuXHRcdFx0Ym9yZGVyQ29sb3VyOiBcIiM4ODhcIixcblx0XHRcdGxlbnNCb3JkZXJTaXplOiAxLFxuXHRcdFx0bGVuc0JvcmRlckNvbG91cjogXCIjMDAwXCIsXG5cdFx0XHRsZW5zU2hhcGU6IFwic3F1YXJlXCIsIC8vY2FuIGJlIFwicm91bmRcIlxuXHRcdFx0em9vbVR5cGU6IFwid2luZG93XCIsIC8vd2luZG93IGlzIGRlZmF1bHQsICBhbHNvIFwibGVuc1wiIGF2YWlsYWJsZSAtXG5cdFx0XHRjb250YWluTGVuc1pvb206IGZhbHNlLFxuXHRcdFx0bGVuc0NvbG91cjogXCJ3aGl0ZVwiLCAvL2NvbG91ciBvZiB0aGUgbGVucyBiYWNrZ3JvdW5kXG5cdFx0XHRsZW5zT3BhY2l0eTogMC40LCAvL29wYWNpdHkgb2YgdGhlIGxlbnNcblx0XHRcdGxlbnN6b29tOiBmYWxzZSxcblx0XHRcdHRpbnQ6IGZhbHNlLCAvL2VuYWJsZSB0aGUgdGludGluZ1xuXHRcdFx0dGludENvbG91cjogXCIjMzMzXCIsIC8vZGVmYXVsdCB0aW50IGNvbG9yLCBjYW4gYmUgYW55dGhpbmcsIHJlZCwgI2NjYywgcmdiKDAsMCwwKVxuXHRcdFx0dGludE9wYWNpdHk6IDAuNCwgLy9vcGFjaXR5IG9mIHRoZSB0aW50XG5cdFx0XHRnYWxsZXJ5OiBmYWxzZSxcblx0XHRcdGdhbGxlcnlBY3RpdmVDbGFzczogXCJ6b29tR2FsbGVyeUFjdGl2ZVwiLFxuXHRcdFx0aW1hZ2VDcm9zc2ZhZGU6IGZhbHNlLFxuXHRcdFx0Y29uc3RyYWluVHlwZTogZmFsc2UsICAvL3dpZHRoIG9yIGhlaWdodFxuXHRcdFx0Y29uc3RyYWluU2l6ZTogZmFsc2UsICAvL2luIHBpeGVscyB0aGUgZGltZW5zaW9ucyB5b3Ugd2FudCB0byBjb25zdHJhaW4gb25cblx0XHRcdGxvYWRpbmdJY29uOiBmYWxzZSwgLy9odHRwOi8vd3d3LmV4YW1wbGUuY29tL3NwaW5uZXIuZ2lmXG5cdFx0XHRjdXJzb3I6XCJkZWZhdWx0XCIsIC8vIHVzZXIgc2hvdWxkIHNldCB0byB3aGF0IHRoZXkgd2FudCB0aGUgY3Vyc29yIGFzLCBpZiB0aGV5IGhhdmUgc2V0IGEgY2xpY2sgZnVuY3Rpb25cblx0XHRcdHJlc3BvbnNpdmU6dHJ1ZSxcblx0XHRcdG9uQ29tcGxldGU6ICQubm9vcCxcbiAgICAgIG9uRGVzdHJveTogZnVuY3Rpb24oKSB7fSxcblx0XHRcdG9uWm9vbWVkSW1hZ2VMb2FkZWQ6IGZ1bmN0aW9uKCkge30sXG5cdFx0XHRvbkltYWdlU3dhcDogJC5ub29wLFxuXHRcdFx0b25JbWFnZVN3YXBDb21wbGV0ZTogJC5ub29wXG5cdH07XG5cbn0pKCBqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQgKTtcbiIsIihmdW5jdGlvbigkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgaW1hZ2UgPSAkKFwiI3Byb2R1Y3RfaW1nXCIpO1xuICAgIC8vdmFyIHpvb21Db25maWcgPSB7fTtcbiAgICB2YXIgem9vbUFjdGl2ZSA9IGZhbHNlO1xuICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xuICAgICAgICB6b29tQWN0aXZlID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8gem9vbUFjdGl2ZSA9ICF6b29tQWN0aXZlO1xuICAgIGlmICh6b29tQWN0aXZlKSB7XG4gICAgICAgIGlmICgkKGltYWdlKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkKGltYWdlKS5lbGV2YXRlWm9vbSh7XG4gICAgICAgICAgICAgICAgY3Vyc29yOiBcImNyb3NzaGFpclwiLFxuICAgICAgICAgICAgICAgIGVhc2luZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBnYWxsZXJ5OiBcInByX2l0ZW1fZ2FsbGVyeVwiLFxuICAgICAgICAgICAgICAgIHpvb21UeXBlOiBcImlubmVyXCIsXG4gICAgICAgICAgICAgICAgLy8gc2Nyb2xsWm9vbTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBnYWxsZXJ5QWN0aXZlQ2xhc3M6IFwiYWN0aXZlXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJC5yZW1vdmVEYXRhKGltYWdlLCBcImVsZXZhdGVab29tXCIpOyAvL3JlbW92ZSB6b29tIGluc3RhbmNlIGZyb20gaW1hZ2VcbiAgICAgICAgJChcIi56b29tQ29udGFpbmVyOmxhc3QtY2hpbGRcIikucmVtb3ZlKCk7IC8vIHJlbW92ZSB6b29tIGNvbnRhaW5lciBmcm9tIERPTVxuICAgIH1cblxuICAgICQubWFnbmlmaWNQb3B1cC5kZWZhdWx0cy5jYWxsYmFja3MgPSB7XG4gICAgICAgIG9wZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tX2ltYWdlXCIpO1xuICAgICAgICB9LFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBXYWl0IHVudGlsIG92ZXJmbG93OmhpZGRlbiBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIGh0bWwgdGFnXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiem9vbV9pbWFnZVwiKTtcbiAgICAgICAgICAgICAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInpvb21fZ2FsbGVyeV9pbWFnZVwiKTtcbiAgICAgICAgICAgICAgICAvLyQoJy56b29tQ29udGFpbmVyOmxhc3QtY2hpbGQnKS5yZW1vdmUoKTsvLyByZW1vdmUgem9vbSBjb250YWluZXIgZnJvbSBET01cbiAgICAgICAgICAgICAgICAkKFwiLnpvb21Db250YWluZXJcIilcbiAgICAgICAgICAgICAgICAgICAgLnNsaWNlKDEpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gU2V0IHVwIGdhbGxlcnkgb24gY2xpY2tcbiAgICB2YXIgZ2FsbGVyeVpvb20gPSAkKFwiI3ByX2l0ZW1fZ2FsbGVyeVwiKTtcbiAgICBnYWxsZXJ5Wm9vbS5tYWduaWZpY1BvcHVwKHtcbiAgICAgICAgZGVsZWdhdGU6IFwiYVwiLFxuICAgICAgICB0eXBlOiBcImltYWdlXCIsXG4gICAgICAgIGdhbGxlcnk6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgY2FsbGJhY2tzOiB7XG4gICAgICAgICAgICBlbGVtZW50UGFyc2U6IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpdGVtLnNyYyA9IGl0ZW0uZWwuYXR0cihcImRhdGEtem9vbS1pbWFnZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gWm9vbSBpbWFnZSB3aGVuIGNsaWNrIG9uIGljb25cbiAgICAkKFwiLnByb2R1Y3RfaW1nX3pvb21cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFjdHVhbCA9ICQoXCIjcHJfaXRlbV9nYWxsZXJ5IGFcIikuYXR0cihcImRhdGEtem9vbS1pbWFnZVwiKTtcbiAgICAgICAgJChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tX2dhbGxlcnlfaW1hZ2VcIik7XG4gICAgICAgICQoXCIjcHJfaXRlbV9nYWxsZXJ5IC5pdGVtXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgYWN0dWFsID09XG4gICAgICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAuZmluZChcIi5wcm9kdWN0X2dhbGxlcnlfaXRlbVwiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImRhdGEtem9vbS1pbWFnZVwiKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdhbGxlcnlab29tLm1hZ25pZmljUG9wdXAoXCJvcGVuXCIsICQodGhpcykuaW5kZXgoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLyo9PT09PT09PT0gUE9QVVAgSlMgPT09PT09PT09PT09PT09PT09Ki9cbiAgICAkKFwiLmNvbnRlbnQtcG9wdXBcIikubWFnbmlmaWNQb3B1cCh7XG4gICAgICAgIHR5cGU6IFwiaW5saW5lXCIsXG4gICAgICAgIHByZWxvYWRlcjogdHJ1ZSxcbiAgICAgICAgbWFpbkNsYXNzOiBcIm1mcC16b29tLWluXCJcbiAgICB9KTtcblxuICAgICQoXCIuaW1hZ2VfZ2FsbGVyeVwiKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyB0aGUgY29udGFpbmVycyBmb3IgYWxsIHlvdXIgZ2FsbGVyaWVzXG4gICAgICAgICQodGhpcykubWFnbmlmaWNQb3B1cCh7XG4gICAgICAgICAgICBkZWxlZ2F0ZTogXCJhXCIsIC8vIHRoZSBzZWxlY3RvciBmb3IgZ2FsbGVyeSBpdGVtXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlXCIsXG4gICAgICAgICAgICBnYWxsZXJ5OiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICQoXCIucG9wdXAtYWpheFwiKS5tYWduaWZpY1BvcHVwKHtcbiAgICAgICAgdHlwZTogXCJhamF4XCIsXG4gICAgICAgIGNhbGxiYWNrczoge1xuICAgICAgICAgICAgYWpheENvbnRlbnRBZGRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2Fyb3VzZWxfc2xpZGVyKCk7XG4gICAgICAgICAgICAgICAgc2xpY2tfc2xpZGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCIudmlkZW9fcG9wdXAsIC5pZnJhbWVfcG9wdXBcIikubWFnbmlmaWNQb3B1cCh7XG4gICAgICAgIHR5cGU6IFwiaWZyYW1lXCIsXG4gICAgICAgIHJlbW92YWxEZWxheTogMTYwLFxuICAgICAgICBtYWluQ2xhc3M6IFwibWZwLXpvb20taW5cIixcbiAgICAgICAgcHJlbG9hZGVyOiBmYWxzZSxcbiAgICAgICAgZml4ZWRDb250ZW50UG9zOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgLyo9PT09PT09PSBTTElERVIgSlMgc2xpY2tfc2xpZGVyID09PT09PT09PT09PT09PT09PSovXG5cbiAgICBmdW5jdGlvbiBzbGlja19zbGlkZXIoKSB7XG4gICAgICAgICQoXCIuc2xpY2tfc2xpZGVyXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJHNsaWNrX2Nhcm91c2VsID0gJCh0aGlzKTtcbiAgICAgICAgICAgICRzbGlja19jYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICAgICAgYXJyb3dzOiAkc2xpY2tfY2Fyb3VzZWwuZGF0YShcImFycm93c1wiKSxcbiAgICAgICAgICAgICAgICBkb3RzOiAkc2xpY2tfY2Fyb3VzZWwuZGF0YShcImRvdHNcIiksXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6ICRzbGlja19jYXJvdXNlbC5kYXRhKFwiaW5maW5pdGVcIiksXG4gICAgICAgICAgICAgICAgY2VudGVyTW9kZTogJHNsaWNrX2Nhcm91c2VsLmRhdGEoXCJjZW50ZXItbW9kZVwiKSxcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbDogJHNsaWNrX2Nhcm91c2VsLmRhdGEoXCJ2ZXJ0aWNhbFwiKSxcbiAgICAgICAgICAgICAgICBmYWRlOiAkc2xpY2tfY2Fyb3VzZWwuZGF0YShcImZhZGVcIiksXG4gICAgICAgICAgICAgICAgY3NzRWFzZTogJHNsaWNrX2Nhcm91c2VsLmRhdGEoXCJjc3MtZWFzZVwiKSxcbiAgICAgICAgICAgICAgICBhdXRvcGxheTogJHNsaWNrX2Nhcm91c2VsLmRhdGEoXCJhdXRvcGxheVwiKSxcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN3aXBpbmc6ICRzbGlja19jYXJvdXNlbC5kYXRhKFwidmVydGljYWwtc3dpcGluZ1wiKSxcbiAgICAgICAgICAgICAgICBhdXRvcGxheVNwZWVkOiAkc2xpY2tfY2Fyb3VzZWwuZGF0YShcImF1dG9wbGF5LXNwZWVkXCIpLFxuICAgICAgICAgICAgICAgIHNwZWVkOiAkc2xpY2tfY2Fyb3VzZWwuZGF0YShcInNwZWVkXCIpLFxuICAgICAgICAgICAgICAgIHBhdXNlT25Ib3ZlcjogJHNsaWNrX2Nhcm91c2VsLmRhdGEoXCJwYXVzZS1vbi1ob3ZlclwiKSxcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6ICRzbGlja19jYXJvdXNlbC5kYXRhKFwiZHJhZ2dhYmxlXCIpLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogJHNsaWNrX2Nhcm91c2VsLmRhdGEoXCJzbGlkZXMtdG8tc2hvd1wiKSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogJHNsaWNrX2Nhcm91c2VsLmRhdGEoXCJzbGlkZXMtdG8tc2Nyb2xsXCIpLFxuICAgICAgICAgICAgICAgIGFzTmF2Rm9yOiAkc2xpY2tfY2Fyb3VzZWwuZGF0YShcImFzLW5hdi1mb3JcIiksXG4gICAgICAgICAgICAgICAgZm9jdXNPblNlbGVjdDogJHNsaWNrX2Nhcm91c2VsLmRhdGEoXCJmb2N1cy1vbi1zZWxlY3RcIiksXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogJHNsaWNrX2Nhcm91c2VsLmRhdGEoXCJyZXNwb25zaXZlXCIpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkub24oXCJyZWFkeVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc2xpY2tfc2xpZGVyKCk7XG4gICAgfSk7XG5cbiAgICAvKj09PT09PT0gUFJPRFVDVCBDT0xPUiBKUyA9PT09PT09PT09PT09PT0qL1xuICAgICQoXCIucHJvZHVjdF9jb2xvcl9zd2l0Y2ggc3BhblwiKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZ2V0X2NvbG9yID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1jb2xvclwiKTtcbiAgICAgICAgJCh0aGlzKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGdldF9jb2xvcik7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbihcbiAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICBcIi5wcm9kdWN0X2NvbG9yX3N3aXRjaCBzcGFuLC5wcm9kdWN0X3NpemVfc3dpdGNoIHNwYW5cIixcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLnNpYmxpbmdzKHRoaXMpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpXG4gICAgICAgICAgICAgICAgLmVuZCgpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIC8qPT09PT09PT0gUFJJQ0UgRklMVEVSIEpTID09PT09PT09PT09PT09Ki9cbiAgICAkKFwiI3ByaWNlX2ZpbHRlclwiKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJGZpbHRlcl9zZWxlY3RvciA9ICQodGhpcyk7XG4gICAgICAgIHZhciBhID0gJGZpbHRlcl9zZWxlY3Rvci5kYXRhKFwibWluLXZhbHVlXCIpO1xuICAgICAgICB2YXIgYiA9ICRmaWx0ZXJfc2VsZWN0b3IuZGF0YShcIm1heC12YWx1ZVwiKTtcbiAgICAgICAgdmFyIGMgPSAkZmlsdGVyX3NlbGVjdG9yLmRhdGEoXCJwcmljZS1zaWduXCIpO1xuICAgICAgICAkZmlsdGVyX3NlbGVjdG9yLnNsaWRlcih7XG4gICAgICAgICAgICByYW5nZTogdHJ1ZSxcbiAgICAgICAgICAgIG1pbjogJGZpbHRlcl9zZWxlY3Rvci5kYXRhKFwibWluXCIpLFxuICAgICAgICAgICAgbWF4OiAkZmlsdGVyX3NlbGVjdG9yLmRhdGEoXCJtYXhcIiksXG4gICAgICAgICAgICB2YWx1ZXM6IFthLCBiXSxcbiAgICAgICAgICAgIHNsaWRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICAkKFwiI2ZsdF9wcmljZVwiKS5odG1sKFxuICAgICAgICAgICAgICAgICAgICBjICsgdWkudmFsdWVzWzBdICsgXCIgLSBcIiArIGMgKyB1aS52YWx1ZXNbMV1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICQoXCIjcHJpY2VfZmlyc3RcIikudmFsKHVpLnZhbHVlc1swXSk7XG4gICAgICAgICAgICAgICAgJChcIiNwcmljZV9zZWNvbmRcIikudmFsKHVpLnZhbHVlc1sxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAkKFwiI2ZsdF9wcmljZVwiKS5odG1sKFxuICAgICAgICAgICAgYyArXG4gICAgICAgICAgICAgICAgJGZpbHRlcl9zZWxlY3Rvci5zbGlkZXIoXCJ2YWx1ZXNcIiwgMCkgK1xuICAgICAgICAgICAgICAgIFwiIC0gXCIgK1xuICAgICAgICAgICAgICAgIGMgK1xuICAgICAgICAgICAgICAgICRmaWx0ZXJfc2VsZWN0b3Iuc2xpZGVyKFwidmFsdWVzXCIsIDEpXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICAvKj09PT09PT09PSBSQVRJTkcgU1RBUiBKUyA9PT09PT09PT09PT0qL1xuICAgICQoZG9jdW1lbnQpLm9uKFwicmVhZHlcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICQoXCIuc3Rhcl9yYXRpbmcgc3BhblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG9uU3RhciA9IHBhcnNlRmxvYXQoJCh0aGlzKS5kYXRhKFwidmFsdWVcIiksIDEwKTsgLy8gVGhlIHN0YXIgY3VycmVudGx5IHNlbGVjdGVkXG4gICAgICAgICAgICB2YXIgc3RhcnMgPSAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKFwiLnN0YXJfcmF0aW5nIHNwYW5cIik7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgJChzdGFyc1tpXSkucmVtb3ZlQ2xhc3MoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvblN0YXI7IGkrKykge1xuICAgICAgICAgICAgICAgICQoc3RhcnNbaV0pLmFkZENsYXNzKFwic2VsZWN0ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSkoalF1ZXJ5KTtcbiIsIi8qXG4gICAgIF8gXyAgICAgIF8gICAgICAgX1xuIF9fX3wgKF8pIF9fX3wgfCBfXyAgKF8pX19fXG4vIF9ffCB8IHwvIF9ffCB8LyAvICB8IC8gX198XG5cXF9fIFxcIHwgfCAoX198ICAgPCBfIHwgXFxfXyBcXFxufF9fXy9ffF98XFxfX198X3xcXF8oXykvIHxfX18vXG4gICAgICAgICAgICAgICAgICAgfF9fL1xuXG5WZXJzaW9uOiAxLjUuOVxuQXV0aG9yOiBLZW4gV2hlZWxlclxuV2Vic2l0ZTogaHR0cDovL2tlbndoZWVsZXIuZ2l0aHViLmlvXG5Eb2NzOiBodHRwOi8va2Vud2hlZWxlci5naXRodWIuaW8vc2xpY2tcblJlcG86IGh0dHA6Ly9naXRodWIuY29tL2tlbndoZWVsZXIvc2xpY2tcbklzc3VlczogaHR0cDovL2dpdGh1Yi5jb20va2Vud2hlZWxlci9zbGljay9pc3N1ZXNcblxuICovXG4hZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJqcXVlcnlcIl0sYSk6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9YShyZXF1aXJlKFwianF1ZXJ5XCIpKTphKGpRdWVyeSl9KGZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO3ZhciBiPXdpbmRvdy5TbGlja3x8e307Yj1mdW5jdGlvbigpe2Z1bmN0aW9uIGMoYyxkKXt2YXIgZixlPXRoaXM7ZS5kZWZhdWx0cz17YWNjZXNzaWJpbGl0eTohMCxhZGFwdGl2ZUhlaWdodDohMSxhcHBlbmRBcnJvd3M6YShjKSxhcHBlbmREb3RzOmEoYyksYXJyb3dzOiEwLGFzTmF2Rm9yOm51bGwscHJldkFycm93Oic8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXJvbGU9XCJub25lXCIgY2xhc3M9XCJzbGljay1wcmV2XCIgYXJpYS1sYWJlbD1cIlByZXZpb3VzXCIgdGFiaW5kZXg9XCIwXCIgcm9sZT1cImJ1dHRvblwiPlByZXZpb3VzPC9idXR0b24+JyxuZXh0QXJyb3c6JzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtcm9sZT1cIm5vbmVcIiBjbGFzcz1cInNsaWNrLW5leHRcIiBhcmlhLWxhYmVsPVwiTmV4dFwiIHRhYmluZGV4PVwiMFwiIHJvbGU9XCJidXR0b25cIj5OZXh0PC9idXR0b24+JyxhdXRvcGxheTohMSxhdXRvcGxheVNwZWVkOjNlMyxjZW50ZXJNb2RlOiExLGNlbnRlclBhZGRpbmc6XCI1MHB4XCIsY3NzRWFzZTpcImVhc2VcIixjdXN0b21QYWdpbmc6ZnVuY3Rpb24oYSxiKXtyZXR1cm4nPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1yb2xlPVwibm9uZVwiIHJvbGU9XCJidXR0b25cIiBhcmlhLXJlcXVpcmVkPVwiZmFsc2VcIiB0YWJpbmRleD1cIjBcIj4nKyhiKzEpK1wiPC9idXR0b24+XCJ9LGRvdHM6ITEsZG90c0NsYXNzOlwic2xpY2stZG90c1wiLGRyYWdnYWJsZTohMCxlYXNpbmc6XCJsaW5lYXJcIixlZGdlRnJpY3Rpb246LjM1LGZhZGU6ITEsZm9jdXNPblNlbGVjdDohMSxpbmZpbml0ZTohMCxpbml0aWFsU2xpZGU6MCxsYXp5TG9hZDpcIm9uZGVtYW5kXCIsbW9iaWxlRmlyc3Q6ITEscGF1c2VPbkhvdmVyOiEwLHBhdXNlT25Eb3RzSG92ZXI6ITEscmVzcG9uZFRvOlwid2luZG93XCIscmVzcG9uc2l2ZTpudWxsLHJvd3M6MSxydGw6ITEsc2xpZGU6XCJcIixzbGlkZXNQZXJSb3c6MSxzbGlkZXNUb1Nob3c6MSxzbGlkZXNUb1Njcm9sbDoxLHNwZWVkOjUwMCxzd2lwZTohMCxzd2lwZVRvU2xpZGU6ITEsdG91Y2hNb3ZlOiEwLHRvdWNoVGhyZXNob2xkOjUsdXNlQ1NTOiEwLHVzZVRyYW5zZm9ybTohMSx2YXJpYWJsZVdpZHRoOiExLHZlcnRpY2FsOiExLHZlcnRpY2FsU3dpcGluZzohMSx3YWl0Rm9yQW5pbWF0ZTohMCx6SW5kZXg6MWUzfSxlLmluaXRpYWxzPXthbmltYXRpbmc6ITEsZHJhZ2dpbmc6ITEsYXV0b1BsYXlUaW1lcjpudWxsLGN1cnJlbnREaXJlY3Rpb246MCxjdXJyZW50TGVmdDpudWxsLGN1cnJlbnRTbGlkZTowLGRpcmVjdGlvbjoxLCRkb3RzOm51bGwsbGlzdFdpZHRoOm51bGwsbGlzdEhlaWdodDpudWxsLGxvYWRJbmRleDowLCRuZXh0QXJyb3c6bnVsbCwkcHJldkFycm93Om51bGwsc2xpZGVDb3VudDpudWxsLHNsaWRlV2lkdGg6bnVsbCwkc2xpZGVUcmFjazpudWxsLCRzbGlkZXM6bnVsbCxzbGlkaW5nOiExLHNsaWRlT2Zmc2V0OjAsc3dpcGVMZWZ0Om51bGwsJGxpc3Q6bnVsbCx0b3VjaE9iamVjdDp7fSx0cmFuc2Zvcm1zRW5hYmxlZDohMSx1bnNsaWNrZWQ6ITF9LGEuZXh0ZW5kKGUsZS5pbml0aWFscyksZS5hY3RpdmVCcmVha3BvaW50PW51bGwsZS5hbmltVHlwZT1udWxsLGUuYW5pbVByb3A9bnVsbCxlLmJyZWFrcG9pbnRzPVtdLGUuYnJlYWtwb2ludFNldHRpbmdzPVtdLGUuY3NzVHJhbnNpdGlvbnM9ITEsZS5oaWRkZW49XCJoaWRkZW5cIixlLnBhdXNlZD0hMSxlLnBvc2l0aW9uUHJvcD1udWxsLGUucmVzcG9uZFRvPW51bGwsZS5yb3dDb3VudD0xLGUuc2hvdWxkQ2xpY2s9ITAsZS4kc2xpZGVyPWEoYyksZS4kc2xpZGVzQ2FjaGU9bnVsbCxlLnRyYW5zZm9ybVR5cGU9bnVsbCxlLnRyYW5zaXRpb25UeXBlPW51bGwsZS52aXNpYmlsaXR5Q2hhbmdlPVwidmlzaWJpbGl0eWNoYW5nZVwiLGUud2luZG93V2lkdGg9MCxlLndpbmRvd1RpbWVyPW51bGwsZj1hKGMpLmRhdGEoXCJzbGlja1wiKXx8e30sZS5vcHRpb25zPWEuZXh0ZW5kKHt9LGUuZGVmYXVsdHMsZixkKSxlLmN1cnJlbnRTbGlkZT1lLm9wdGlvbnMuaW5pdGlhbFNsaWRlLGUub3JpZ2luYWxTZXR0aW5ncz1lLm9wdGlvbnMsXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGRvY3VtZW50Lm1vekhpZGRlbj8oZS5oaWRkZW49XCJtb3pIaWRkZW5cIixlLnZpc2liaWxpdHlDaGFuZ2U9XCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCIpOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4mJihlLmhpZGRlbj1cIndlYmtpdEhpZGRlblwiLGUudmlzaWJpbGl0eUNoYW5nZT1cIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIiksZS5hdXRvUGxheT1hLnByb3h5KGUuYXV0b1BsYXksZSksZS5hdXRvUGxheUNsZWFyPWEucHJveHkoZS5hdXRvUGxheUNsZWFyLGUpLGUuY2hhbmdlU2xpZGU9YS5wcm94eShlLmNoYW5nZVNsaWRlLGUpLGUuY2xpY2tIYW5kbGVyPWEucHJveHkoZS5jbGlja0hhbmRsZXIsZSksZS5zZWxlY3RIYW5kbGVyPWEucHJveHkoZS5zZWxlY3RIYW5kbGVyLGUpLGUuc2V0UG9zaXRpb249YS5wcm94eShlLnNldFBvc2l0aW9uLGUpLGUuc3dpcGVIYW5kbGVyPWEucHJveHkoZS5zd2lwZUhhbmRsZXIsZSksZS5kcmFnSGFuZGxlcj1hLnByb3h5KGUuZHJhZ0hhbmRsZXIsZSksZS5rZXlIYW5kbGVyPWEucHJveHkoZS5rZXlIYW5kbGVyLGUpLGUuYXV0b1BsYXlJdGVyYXRvcj1hLnByb3h5KGUuYXV0b1BsYXlJdGVyYXRvcixlKSxlLmluc3RhbmNlVWlkPWIrKyxlLmh0bWxFeHByPS9eKD86XFxzKig8W1xcd1xcV10rPilbXj5dKikkLyxlLnJlZ2lzdGVyQnJlYWtwb2ludHMoKSxlLmluaXQoITApLGUuY2hlY2tSZXNwb25zaXZlKCEwKX12YXIgYj0wO3JldHVybiBjfSgpLGIucHJvdG90eXBlLmFkZFNsaWRlPWIucHJvdG90eXBlLnNsaWNrQWRkPWZ1bmN0aW9uKGIsYyxkKXt2YXIgZT10aGlzO2lmKFwiYm9vbGVhblwiPT10eXBlb2YgYylkPWMsYz1udWxsO2Vsc2UgaWYoMD5jfHxjPj1lLnNsaWRlQ291bnQpcmV0dXJuITE7ZS51bmxvYWQoKSxcIm51bWJlclwiPT10eXBlb2YgYz8wPT09YyYmMD09PWUuJHNsaWRlcy5sZW5ndGg/YShiKS5hcHBlbmRUbyhlLiRzbGlkZVRyYWNrKTpkP2EoYikuaW5zZXJ0QmVmb3JlKGUuJHNsaWRlcy5lcShjKSk6YShiKS5pbnNlcnRBZnRlcihlLiRzbGlkZXMuZXEoYykpOmQ9PT0hMD9hKGIpLnByZXBlbmRUbyhlLiRzbGlkZVRyYWNrKTphKGIpLmFwcGVuZFRvKGUuJHNsaWRlVHJhY2spLGUuJHNsaWRlcz1lLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSksZS4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpLGUuJHNsaWRlVHJhY2suYXBwZW5kKGUuJHNsaWRlcyksZS4kc2xpZGVzLmVhY2goZnVuY3Rpb24oYixjKXthKGMpLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIsYil9KSxlLiRzbGlkZXNDYWNoZT1lLiRzbGlkZXMsZS5yZWluaXQoKX0sYi5wcm90b3R5cGUuYW5pbWF0ZUhlaWdodD1mdW5jdGlvbigpe3ZhciBhPXRoaXM7aWYoMT09PWEub3B0aW9ucy5zbGlkZXNUb1Nob3cmJmEub3B0aW9ucy5hZGFwdGl2ZUhlaWdodD09PSEwJiZhLm9wdGlvbnMudmVydGljYWw9PT0hMSl7dmFyIGI9YS4kc2xpZGVzLmVxKGEuY3VycmVudFNsaWRlKS5vdXRlckhlaWdodCghMCk7YS4kbGlzdC5hbmltYXRlKHtoZWlnaHQ6Yn0sYS5vcHRpb25zLnNwZWVkKX19LGIucHJvdG90eXBlLmFuaW1hdGVTbGlkZT1mdW5jdGlvbihiLGMpe3ZhciBkPXt9LGU9dGhpcztlLmFuaW1hdGVIZWlnaHQoKSxlLm9wdGlvbnMucnRsPT09ITAmJmUub3B0aW9ucy52ZXJ0aWNhbD09PSExJiYoYj0tYiksZS50cmFuc2Zvcm1zRW5hYmxlZD09PSExP2Uub3B0aW9ucy52ZXJ0aWNhbD09PSExP2UuJHNsaWRlVHJhY2suYW5pbWF0ZSh7bGVmdDpifSxlLm9wdGlvbnMuc3BlZWQsZS5vcHRpb25zLmVhc2luZyxjKTplLiRzbGlkZVRyYWNrLmFuaW1hdGUoe3RvcDpifSxlLm9wdGlvbnMuc3BlZWQsZS5vcHRpb25zLmVhc2luZyxjKTplLmNzc1RyYW5zaXRpb25zPT09ITE/KGUub3B0aW9ucy5ydGw9PT0hMCYmKGUuY3VycmVudExlZnQ9LWUuY3VycmVudExlZnQpLGEoe2FuaW1TdGFydDplLmN1cnJlbnRMZWZ0fSkuYW5pbWF0ZSh7YW5pbVN0YXJ0OmJ9LHtkdXJhdGlvbjplLm9wdGlvbnMuc3BlZWQsZWFzaW5nOmUub3B0aW9ucy5lYXNpbmcsc3RlcDpmdW5jdGlvbihhKXthPU1hdGguY2VpbChhKSxlLm9wdGlvbnMudmVydGljYWw9PT0hMT8oZFtlLmFuaW1UeXBlXT1cInRyYW5zbGF0ZShcIithK1wicHgsIDBweClcIixlLiRzbGlkZVRyYWNrLmNzcyhkKSk6KGRbZS5hbmltVHlwZV09XCJ0cmFuc2xhdGUoMHB4LFwiK2ErXCJweClcIixlLiRzbGlkZVRyYWNrLmNzcyhkKSl9LGNvbXBsZXRlOmZ1bmN0aW9uKCl7YyYmYy5jYWxsKCl9fSkpOihlLmFwcGx5VHJhbnNpdGlvbigpLGI9TWF0aC5jZWlsKGIpLGUub3B0aW9ucy52ZXJ0aWNhbD09PSExP2RbZS5hbmltVHlwZV09XCJ0cmFuc2xhdGUzZChcIitiK1wicHgsIDBweCwgMHB4KVwiOmRbZS5hbmltVHlwZV09XCJ0cmFuc2xhdGUzZCgwcHgsXCIrYitcInB4LCAwcHgpXCIsZS4kc2xpZGVUcmFjay5jc3MoZCksYyYmc2V0VGltZW91dChmdW5jdGlvbigpe2UuZGlzYWJsZVRyYW5zaXRpb24oKSxjLmNhbGwoKX0sZS5vcHRpb25zLnNwZWVkKSl9LGIucHJvdG90eXBlLmFzTmF2Rm9yPWZ1bmN0aW9uKGIpe3ZhciBjPXRoaXMsZD1jLm9wdGlvbnMuYXNOYXZGb3I7ZCYmbnVsbCE9PWQmJihkPWEoZCkubm90KGMuJHNsaWRlcikpLG51bGwhPT1kJiZcIm9iamVjdFwiPT10eXBlb2YgZCYmZC5lYWNoKGZ1bmN0aW9uKCl7dmFyIGM9YSh0aGlzKS5zbGljayhcImdldFNsaWNrXCIpO2MudW5zbGlja2VkfHxjLnNsaWRlSGFuZGxlcihiLCEwKX0pfSxiLnByb3RvdHlwZS5hcHBseVRyYW5zaXRpb249ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcyxjPXt9O2Iub3B0aW9ucy5mYWRlPT09ITE/Y1tiLnRyYW5zaXRpb25UeXBlXT1iLnRyYW5zZm9ybVR5cGUrXCIgXCIrYi5vcHRpb25zLnNwZWVkK1wibXMgXCIrYi5vcHRpb25zLmNzc0Vhc2U6Y1tiLnRyYW5zaXRpb25UeXBlXT1cIm9wYWNpdHkgXCIrYi5vcHRpb25zLnNwZWVkK1wibXMgXCIrYi5vcHRpb25zLmNzc0Vhc2UsYi5vcHRpb25zLmZhZGU9PT0hMT9iLiRzbGlkZVRyYWNrLmNzcyhjKTpiLiRzbGlkZXMuZXEoYSkuY3NzKGMpfSxiLnByb3RvdHlwZS5hdXRvUGxheT1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS5hdXRvUGxheVRpbWVyJiZjbGVhckludGVydmFsKGEuYXV0b1BsYXlUaW1lciksYS5zbGlkZUNvdW50PmEub3B0aW9ucy5zbGlkZXNUb1Nob3cmJmEucGF1c2VkIT09ITAmJihhLmF1dG9QbGF5VGltZXI9c2V0SW50ZXJ2YWwoYS5hdXRvUGxheUl0ZXJhdG9yLGEub3B0aW9ucy5hdXRvcGxheVNwZWVkKSl9LGIucHJvdG90eXBlLmF1dG9QbGF5Q2xlYXI9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2EuYXV0b1BsYXlUaW1lciYmY2xlYXJJbnRlcnZhbChhLmF1dG9QbGF5VGltZXIpfSxiLnByb3RvdHlwZS5hdXRvUGxheUl0ZXJhdG9yPWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLm9wdGlvbnMuaW5maW5pdGU9PT0hMT8xPT09YS5kaXJlY3Rpb24/KGEuY3VycmVudFNsaWRlKzE9PT1hLnNsaWRlQ291bnQtMSYmKGEuZGlyZWN0aW9uPTApLGEuc2xpZGVIYW5kbGVyKGEuY3VycmVudFNsaWRlK2Eub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpOihhLmN1cnJlbnRTbGlkZS0xPT09MCYmKGEuZGlyZWN0aW9uPTEpLGEuc2xpZGVIYW5kbGVyKGEuY3VycmVudFNsaWRlLWEub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpOmEuc2xpZGVIYW5kbGVyKGEuY3VycmVudFNsaWRlK2Eub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCl9LGIucHJvdG90eXBlLmJ1aWxkQXJyb3dzPWZ1bmN0aW9uKCl7dmFyIGI9dGhpcztiLm9wdGlvbnMuYXJyb3dzPT09ITAmJihiLiRwcmV2QXJyb3c9YShiLm9wdGlvbnMucHJldkFycm93KS5hZGRDbGFzcyhcInNsaWNrLWFycm93XCIpLGIuJG5leHRBcnJvdz1hKGIub3B0aW9ucy5uZXh0QXJyb3cpLmFkZENsYXNzKFwic2xpY2stYXJyb3dcIiksYi5zbGlkZUNvdW50PmIub3B0aW9ucy5zbGlkZXNUb1Nob3c/KGIuJHByZXZBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWhpZGRlblwiKS5yZW1vdmVBdHRyKFwiYXJpYS1oaWRkZW4gdGFiaW5kZXhcIiksYi4kbmV4dEFycm93LnJlbW92ZUNsYXNzKFwic2xpY2staGlkZGVuXCIpLnJlbW92ZUF0dHIoXCJhcmlhLWhpZGRlbiB0YWJpbmRleFwiKSxiLmh0bWxFeHByLnRlc3QoYi5vcHRpb25zLnByZXZBcnJvdykmJmIuJHByZXZBcnJvdy5wcmVwZW5kVG8oYi5vcHRpb25zLmFwcGVuZEFycm93cyksYi5odG1sRXhwci50ZXN0KGIub3B0aW9ucy5uZXh0QXJyb3cpJiZiLiRuZXh0QXJyb3cuYXBwZW5kVG8oYi5vcHRpb25zLmFwcGVuZEFycm93cyksYi5vcHRpb25zLmluZmluaXRlIT09ITAmJmIuJHByZXZBcnJvdy5hZGRDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJ0cnVlXCIpKTpiLiRwcmV2QXJyb3cuYWRkKGIuJG5leHRBcnJvdykuYWRkQ2xhc3MoXCJzbGljay1oaWRkZW5cIikuYXR0cih7XCJhcmlhLWRpc2FibGVkXCI6XCJ0cnVlXCIsdGFiaW5kZXg6XCItMVwifSkpfSxiLnByb3RvdHlwZS5idWlsZERvdHM9ZnVuY3Rpb24oKXt2YXIgYyxkLGI9dGhpcztpZihiLm9wdGlvbnMuZG90cz09PSEwJiZiLnNsaWRlQ291bnQ+Yi5vcHRpb25zLnNsaWRlc1RvU2hvdyl7Zm9yKGQ9Jzx1bCBjbGFzcz1cIicrYi5vcHRpb25zLmRvdHNDbGFzcysnXCI+JyxjPTA7Yzw9Yi5nZXREb3RDb3VudCgpO2MrPTEpZCs9XCI8bGk+XCIrYi5vcHRpb25zLmN1c3RvbVBhZ2luZy5jYWxsKHRoaXMsYixjKStcIjwvbGk+XCI7ZCs9XCI8L3VsPlwiLGIuJGRvdHM9YShkKS5hcHBlbmRUbyhiLm9wdGlvbnMuYXBwZW5kRG90cyksYi4kZG90cy5maW5kKFwibGlcIikuZmlyc3QoKS5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpfX0sYi5wcm90b3R5cGUuYnVpbGRPdXQ9ZnVuY3Rpb24oKXt2YXIgYj10aGlzO2IuJHNsaWRlcz1iLiRzbGlkZXIuY2hpbGRyZW4oYi5vcHRpb25zLnNsaWRlK1wiOm5vdCguc2xpY2stY2xvbmVkKVwiKS5hZGRDbGFzcyhcInNsaWNrLXNsaWRlXCIpLGIuc2xpZGVDb3VudD1iLiRzbGlkZXMubGVuZ3RoLGIuJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKGIsYyl7YShjKS5hdHRyKFwiZGF0YS1zbGljay1pbmRleFwiLGIpLmRhdGEoXCJvcmlnaW5hbFN0eWxpbmdcIixhKGMpLmF0dHIoXCJzdHlsZVwiKXx8XCJcIil9KSxiLiRzbGlkZXIuYWRkQ2xhc3MoXCJzbGljay1zbGlkZXJcIiksYi4kc2xpZGVUcmFjaz0wPT09Yi5zbGlkZUNvdW50P2EoJzxkaXYgY2xhc3M9XCJzbGljay10cmFja1wiLz4nKS5hcHBlbmRUbyhiLiRzbGlkZXIpOmIuJHNsaWRlcy53cmFwQWxsKCc8ZGl2IGNsYXNzPVwic2xpY2stdHJhY2tcIi8+JykucGFyZW50KCksYi4kbGlzdD1iLiRzbGlkZVRyYWNrLndyYXAoJzxkaXYgYXJpYS1saXZlPVwicG9saXRlXCIgY2xhc3M9XCJzbGljay1saXN0XCIvPicpLnBhcmVudCgpLGIuJHNsaWRlVHJhY2suY3NzKFwib3BhY2l0eVwiLDApLChiLm9wdGlvbnMuY2VudGVyTW9kZT09PSEwfHxiLm9wdGlvbnMuc3dpcGVUb1NsaWRlPT09ITApJiYoYi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsPTEpLGEoXCJpbWdbZGF0YS1sYXp5XVwiLGIuJHNsaWRlcikubm90KFwiW3NyY11cIikuYWRkQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpLGIuc2V0dXBJbmZpbml0ZSgpLGIuYnVpbGRBcnJvd3MoKSxiLmJ1aWxkRG90cygpLGIudXBkYXRlRG90cygpLGIuc2V0U2xpZGVDbGFzc2VzKFwibnVtYmVyXCI9PXR5cGVvZiBiLmN1cnJlbnRTbGlkZT9iLmN1cnJlbnRTbGlkZTowKSxiLm9wdGlvbnMuZHJhZ2dhYmxlPT09ITAmJmIuJGxpc3QuYWRkQ2xhc3MoXCJkcmFnZ2FibGVcIil9LGIucHJvdG90eXBlLmJ1aWxkUm93cz1mdW5jdGlvbigpe3ZhciBiLGMsZCxlLGYsZyxoLGE9dGhpcztpZihlPWRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxnPWEuJHNsaWRlci5jaGlsZHJlbigpLGEub3B0aW9ucy5yb3dzPjEpe2ZvcihoPWEub3B0aW9ucy5zbGlkZXNQZXJSb3cqYS5vcHRpb25zLnJvd3MsZj1NYXRoLmNlaWwoZy5sZW5ndGgvaCksYj0wO2Y+YjtiKyspe3ZhciBpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Zm9yKGM9MDtjPGEub3B0aW9ucy5yb3dzO2MrKyl7dmFyIGo9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtmb3IoZD0wO2Q8YS5vcHRpb25zLnNsaWRlc1BlclJvdztkKyspe3ZhciBrPWIqaCsoYyphLm9wdGlvbnMuc2xpZGVzUGVyUm93K2QpO2cuZ2V0KGspJiZqLmFwcGVuZENoaWxkKGcuZ2V0KGspKX1pLmFwcGVuZENoaWxkKGopfWUuYXBwZW5kQ2hpbGQoaSl9YS4kc2xpZGVyLmh0bWwoZSksYS4kc2xpZGVyLmNoaWxkcmVuKCkuY2hpbGRyZW4oKS5jaGlsZHJlbigpLmNzcyh7d2lkdGg6MTAwL2Eub3B0aW9ucy5zbGlkZXNQZXJSb3crXCIlXCIsZGlzcGxheTpcImlubGluZS1ibG9ja1wifSl9fSxiLnByb3RvdHlwZS5jaGVja1Jlc3BvbnNpdmU9ZnVuY3Rpb24oYixjKXt2YXIgZSxmLGcsZD10aGlzLGg9ITEsaT1kLiRzbGlkZXIud2lkdGgoKSxqPXdpbmRvdy5pbm5lcldpZHRofHxhKHdpbmRvdykud2lkdGgoKTtpZihcIndpbmRvd1wiPT09ZC5yZXNwb25kVG8/Zz1qOlwic2xpZGVyXCI9PT1kLnJlc3BvbmRUbz9nPWk6XCJtaW5cIj09PWQucmVzcG9uZFRvJiYoZz1NYXRoLm1pbihqLGkpKSxkLm9wdGlvbnMucmVzcG9uc2l2ZSYmZC5vcHRpb25zLnJlc3BvbnNpdmUubGVuZ3RoJiZudWxsIT09ZC5vcHRpb25zLnJlc3BvbnNpdmUpe2Y9bnVsbDtmb3IoZSBpbiBkLmJyZWFrcG9pbnRzKWQuYnJlYWtwb2ludHMuaGFzT3duUHJvcGVydHkoZSkmJihkLm9yaWdpbmFsU2V0dGluZ3MubW9iaWxlRmlyc3Q9PT0hMT9nPGQuYnJlYWtwb2ludHNbZV0mJihmPWQuYnJlYWtwb2ludHNbZV0pOmc+ZC5icmVha3BvaW50c1tlXSYmKGY9ZC5icmVha3BvaW50c1tlXSkpO251bGwhPT1mP251bGwhPT1kLmFjdGl2ZUJyZWFrcG9pbnQ/KGYhPT1kLmFjdGl2ZUJyZWFrcG9pbnR8fGMpJiYoZC5hY3RpdmVCcmVha3BvaW50PWYsXCJ1bnNsaWNrXCI9PT1kLmJyZWFrcG9pbnRTZXR0aW5nc1tmXT9kLnVuc2xpY2soZik6KGQub3B0aW9ucz1hLmV4dGVuZCh7fSxkLm9yaWdpbmFsU2V0dGluZ3MsZC5icmVha3BvaW50U2V0dGluZ3NbZl0pLGI9PT0hMCYmKGQuY3VycmVudFNsaWRlPWQub3B0aW9ucy5pbml0aWFsU2xpZGUpLGQucmVmcmVzaChiKSksaD1mKTooZC5hY3RpdmVCcmVha3BvaW50PWYsXCJ1bnNsaWNrXCI9PT1kLmJyZWFrcG9pbnRTZXR0aW5nc1tmXT9kLnVuc2xpY2soZik6KGQub3B0aW9ucz1hLmV4dGVuZCh7fSxkLm9yaWdpbmFsU2V0dGluZ3MsZC5icmVha3BvaW50U2V0dGluZ3NbZl0pLGI9PT0hMCYmKGQuY3VycmVudFNsaWRlPWQub3B0aW9ucy5pbml0aWFsU2xpZGUpLGQucmVmcmVzaChiKSksaD1mKTpudWxsIT09ZC5hY3RpdmVCcmVha3BvaW50JiYoZC5hY3RpdmVCcmVha3BvaW50PW51bGwsZC5vcHRpb25zPWQub3JpZ2luYWxTZXR0aW5ncyxiPT09ITAmJihkLmN1cnJlbnRTbGlkZT1kLm9wdGlvbnMuaW5pdGlhbFNsaWRlKSxkLnJlZnJlc2goYiksaD1mKSxifHxoPT09ITF8fGQuJHNsaWRlci50cmlnZ2VyKFwiYnJlYWtwb2ludFwiLFtkLGhdKX19LGIucHJvdG90eXBlLmNoYW5nZVNsaWRlPWZ1bmN0aW9uKGIsYyl7dmFyIGYsZyxoLGQ9dGhpcyxlPWEoYi50YXJnZXQpO3N3aXRjaChlLmlzKFwiYVwiKSYmYi5wcmV2ZW50RGVmYXVsdCgpLGUuaXMoXCJsaVwiKXx8KGU9ZS5jbG9zZXN0KFwibGlcIikpLGg9ZC5zbGlkZUNvdW50JWQub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCE9PTAsZj1oPzA6KGQuc2xpZGVDb3VudC1kLmN1cnJlbnRTbGlkZSklZC5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLGIuZGF0YS5tZXNzYWdlKXtjYXNlXCJwcmV2aW91c1wiOmc9MD09PWY/ZC5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOmQub3B0aW9ucy5zbGlkZXNUb1Nob3ctZixkLnNsaWRlQ291bnQ+ZC5vcHRpb25zLnNsaWRlc1RvU2hvdyYmZC5zbGlkZUhhbmRsZXIoZC5jdXJyZW50U2xpZGUtZywhMSxjKTticmVhaztjYXNlXCJuZXh0XCI6Zz0wPT09Zj9kLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw6ZixkLnNsaWRlQ291bnQ+ZC5vcHRpb25zLnNsaWRlc1RvU2hvdyYmZC5zbGlkZUhhbmRsZXIoZC5jdXJyZW50U2xpZGUrZywhMSxjKTticmVhaztjYXNlXCJpbmRleFwiOnZhciBpPTA9PT1iLmRhdGEuaW5kZXg/MDpiLmRhdGEuaW5kZXh8fGUuaW5kZXgoKSpkLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7ZC5zbGlkZUhhbmRsZXIoZC5jaGVja05hdmlnYWJsZShpKSwhMSxjKSxlLmNoaWxkcmVuKCkudHJpZ2dlcihcImZvY3VzXCIpO2JyZWFrO2RlZmF1bHQ6cmV0dXJufX0sYi5wcm90b3R5cGUuY2hlY2tOYXZpZ2FibGU9ZnVuY3Rpb24oYSl7dmFyIGMsZCxiPXRoaXM7aWYoYz1iLmdldE5hdmlnYWJsZUluZGV4ZXMoKSxkPTAsYT5jW2MubGVuZ3RoLTFdKWE9Y1tjLmxlbmd0aC0xXTtlbHNlIGZvcih2YXIgZSBpbiBjKXtpZihhPGNbZV0pe2E9ZDticmVha31kPWNbZV19cmV0dXJuIGF9LGIucHJvdG90eXBlLmNsZWFuVXBFdmVudHM9ZnVuY3Rpb24oKXt2YXIgYj10aGlzO2Iub3B0aW9ucy5kb3RzJiZudWxsIT09Yi4kZG90cyYmKGEoXCJsaVwiLGIuJGRvdHMpLm9mZihcImNsaWNrLnNsaWNrXCIsYi5jaGFuZ2VTbGlkZSksYi5vcHRpb25zLnBhdXNlT25Eb3RzSG92ZXI9PT0hMCYmYi5vcHRpb25zLmF1dG9wbGF5PT09ITAmJmEoXCJsaVwiLGIuJGRvdHMpLm9mZihcIm1vdXNlZW50ZXIuc2xpY2tcIixhLnByb3h5KGIuc2V0UGF1c2VkLGIsITApKS5vZmYoXCJtb3VzZWxlYXZlLnNsaWNrXCIsYS5wcm94eShiLnNldFBhdXNlZCxiLCExKSkpLGIub3B0aW9ucy5hcnJvd3M9PT0hMCYmYi5zbGlkZUNvdW50PmIub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihiLiRwcmV2QXJyb3cmJmIuJHByZXZBcnJvdy5vZmYoXCJjbGljay5zbGlja1wiLGIuY2hhbmdlU2xpZGUpLGIuJG5leHRBcnJvdyYmYi4kbmV4dEFycm93Lm9mZihcImNsaWNrLnNsaWNrXCIsYi5jaGFuZ2VTbGlkZSkpLGIuJGxpc3Qub2ZmKFwidG91Y2hzdGFydC5zbGljayBtb3VzZWRvd24uc2xpY2tcIixiLnN3aXBlSGFuZGxlciksYi4kbGlzdC5vZmYoXCJ0b3VjaG1vdmUuc2xpY2sgbW91c2Vtb3ZlLnNsaWNrXCIsYi5zd2lwZUhhbmRsZXIpLGIuJGxpc3Qub2ZmKFwidG91Y2hlbmQuc2xpY2sgbW91c2V1cC5zbGlja1wiLGIuc3dpcGVIYW5kbGVyKSxiLiRsaXN0Lm9mZihcInRvdWNoY2FuY2VsLnNsaWNrIG1vdXNlbGVhdmUuc2xpY2tcIixiLnN3aXBlSGFuZGxlciksYi4kbGlzdC5vZmYoXCJjbGljay5zbGlja1wiLGIuY2xpY2tIYW5kbGVyKSxhKGRvY3VtZW50KS5vZmYoYi52aXNpYmlsaXR5Q2hhbmdlLGIudmlzaWJpbGl0eSksYi4kbGlzdC5vZmYoXCJtb3VzZWVudGVyLnNsaWNrXCIsYS5wcm94eShiLnNldFBhdXNlZCxiLCEwKSksYi4kbGlzdC5vZmYoXCJtb3VzZWxlYXZlLnNsaWNrXCIsYS5wcm94eShiLnNldFBhdXNlZCxiLCExKSksYi5vcHRpb25zLmFjY2Vzc2liaWxpdHk9PT0hMCYmYi4kbGlzdC5vZmYoXCJrZXlkb3duLnNsaWNrXCIsYi5rZXlIYW5kbGVyKSxiLm9wdGlvbnMuZm9jdXNPblNlbGVjdD09PSEwJiZhKGIuJHNsaWRlVHJhY2spLmNoaWxkcmVuKCkub2ZmKFwiY2xpY2suc2xpY2tcIixiLnNlbGVjdEhhbmRsZXIpLGEod2luZG93KS5vZmYoXCJvcmllbnRhdGlvbmNoYW5nZS5zbGljay5zbGljay1cIitiLmluc3RhbmNlVWlkLGIub3JpZW50YXRpb25DaGFuZ2UpLGEod2luZG93KS5vZmYoXCJyZXNpemUuc2xpY2suc2xpY2stXCIrYi5pbnN0YW5jZVVpZCxiLnJlc2l6ZSksYShcIltkcmFnZ2FibGUhPXRydWVdXCIsYi4kc2xpZGVUcmFjaykub2ZmKFwiZHJhZ3N0YXJ0XCIsYi5wcmV2ZW50RGVmYXVsdCksYSh3aW5kb3cpLm9mZihcImxvYWQuc2xpY2suc2xpY2stXCIrYi5pbnN0YW5jZVVpZCxiLnNldFBvc2l0aW9uKSxhKGRvY3VtZW50KS5vZmYoXCJyZWFkeS5zbGljay5zbGljay1cIitiLmluc3RhbmNlVWlkLGIuc2V0UG9zaXRpb24pfSxiLnByb3RvdHlwZS5jbGVhblVwUm93cz1mdW5jdGlvbigpe3ZhciBiLGE9dGhpczthLm9wdGlvbnMucm93cz4xJiYoYj1hLiRzbGlkZXMuY2hpbGRyZW4oKS5jaGlsZHJlbigpLGIucmVtb3ZlQXR0cihcInN0eWxlXCIpLGEuJHNsaWRlci5odG1sKGIpKX0sYi5wcm90b3R5cGUuY2xpY2tIYW5kbGVyPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7Yi5zaG91bGRDbGljaz09PSExJiYoYS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSxhLnN0b3BQcm9wYWdhdGlvbigpLGEucHJldmVudERlZmF1bHQoKSl9LGIucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oYil7dmFyIGM9dGhpcztjLmF1dG9QbGF5Q2xlYXIoKSxjLnRvdWNoT2JqZWN0PXt9LGMuY2xlYW5VcEV2ZW50cygpLGEoXCIuc2xpY2stY2xvbmVkXCIsYy4kc2xpZGVyKS5kZXRhY2goKSxjLiRkb3RzJiZjLiRkb3RzLnJlbW92ZSgpLGMuJHByZXZBcnJvdyYmYy4kcHJldkFycm93Lmxlbmd0aCYmKGMuJHByZXZBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkIHNsaWNrLWFycm93IHNsaWNrLWhpZGRlblwiKS5yZW1vdmVBdHRyKFwiYXJpYS1oaWRkZW4gYXJpYS1kaXNhYmxlZCB0YWJpbmRleFwiKS5jc3MoXCJkaXNwbGF5XCIsXCJcIiksYy5odG1sRXhwci50ZXN0KGMub3B0aW9ucy5wcmV2QXJyb3cpJiZjLiRwcmV2QXJyb3cucmVtb3ZlKCkpLGMuJG5leHRBcnJvdyYmYy4kbmV4dEFycm93Lmxlbmd0aCYmKGMuJG5leHRBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkIHNsaWNrLWFycm93IHNsaWNrLWhpZGRlblwiKS5yZW1vdmVBdHRyKFwiYXJpYS1oaWRkZW4gYXJpYS1kaXNhYmxlZCB0YWJpbmRleFwiKS5jc3MoXCJkaXNwbGF5XCIsXCJcIiksYy5odG1sRXhwci50ZXN0KGMub3B0aW9ucy5uZXh0QXJyb3cpJiZjLiRuZXh0QXJyb3cucmVtb3ZlKCkpLGMuJHNsaWRlcyYmKGMuJHNsaWRlcy5yZW1vdmVDbGFzcyhcInNsaWNrLXNsaWRlIHNsaWNrLWFjdGl2ZSBzbGljay1jZW50ZXIgc2xpY2stdmlzaWJsZSBzbGljay1jdXJyZW50XCIpLnJlbW92ZUF0dHIoXCJhcmlhLWhpZGRlblwiKS5yZW1vdmVBdHRyKFwiZGF0YS1zbGljay1pbmRleFwiKS5lYWNoKGZ1bmN0aW9uKCl7YSh0aGlzKS5hdHRyKFwic3R5bGVcIixhKHRoaXMpLmRhdGEoXCJvcmlnaW5hbFN0eWxpbmdcIikpfSksYy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpLGMuJHNsaWRlVHJhY2suZGV0YWNoKCksYy4kbGlzdC5kZXRhY2goKSxjLiRzbGlkZXIuYXBwZW5kKGMuJHNsaWRlcykpLGMuY2xlYW5VcFJvd3MoKSxjLiRzbGlkZXIucmVtb3ZlQ2xhc3MoXCJzbGljay1zbGlkZXJcIiksYy4kc2xpZGVyLnJlbW92ZUNsYXNzKFwic2xpY2staW5pdGlhbGl6ZWRcIiksYy51bnNsaWNrZWQ9ITAsYnx8Yy4kc2xpZGVyLnRyaWdnZXIoXCJkZXN0cm95XCIsW2NdKX0sYi5wcm90b3R5cGUuZGlzYWJsZVRyYW5zaXRpb249ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcyxjPXt9O2NbYi50cmFuc2l0aW9uVHlwZV09XCJcIixiLm9wdGlvbnMuZmFkZT09PSExP2IuJHNsaWRlVHJhY2suY3NzKGMpOmIuJHNsaWRlcy5lcShhKS5jc3MoYyl9LGIucHJvdG90eXBlLmZhZGVTbGlkZT1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXM7Yy5jc3NUcmFuc2l0aW9ucz09PSExPyhjLiRzbGlkZXMuZXEoYSkuY3NzKHt6SW5kZXg6Yy5vcHRpb25zLnpJbmRleH0pLGMuJHNsaWRlcy5lcShhKS5hbmltYXRlKHtvcGFjaXR5OjF9LGMub3B0aW9ucy5zcGVlZCxjLm9wdGlvbnMuZWFzaW5nLGIpKTooYy5hcHBseVRyYW5zaXRpb24oYSksYy4kc2xpZGVzLmVxKGEpLmNzcyh7b3BhY2l0eToxLHpJbmRleDpjLm9wdGlvbnMuekluZGV4fSksYiYmc2V0VGltZW91dChmdW5jdGlvbigpe2MuZGlzYWJsZVRyYW5zaXRpb24oYSksYi5jYWxsKCl9LGMub3B0aW9ucy5zcGVlZCkpfSxiLnByb3RvdHlwZS5mYWRlU2xpZGVPdXQ9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztiLmNzc1RyYW5zaXRpb25zPT09ITE/Yi4kc2xpZGVzLmVxKGEpLmFuaW1hdGUoe29wYWNpdHk6MCx6SW5kZXg6Yi5vcHRpb25zLnpJbmRleC0yfSxiLm9wdGlvbnMuc3BlZWQsYi5vcHRpb25zLmVhc2luZyk6KGIuYXBwbHlUcmFuc2l0aW9uKGEpLGIuJHNsaWRlcy5lcShhKS5jc3Moe29wYWNpdHk6MCx6SW5kZXg6Yi5vcHRpb25zLnpJbmRleC0yfSkpfSxiLnByb3RvdHlwZS5maWx0ZXJTbGlkZXM9Yi5wcm90b3R5cGUuc2xpY2tGaWx0ZXI9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztudWxsIT09YSYmKGIuJHNsaWRlc0NhY2hlPWIuJHNsaWRlcyxiLnVubG9hZCgpLGIuJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKSxiLiRzbGlkZXNDYWNoZS5maWx0ZXIoYSkuYXBwZW5kVG8oYi4kc2xpZGVUcmFjayksYi5yZWluaXQoKSl9LGIucHJvdG90eXBlLmdldEN1cnJlbnQ9Yi5wcm90b3R5cGUuc2xpY2tDdXJyZW50U2xpZGU9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO3JldHVybiBhLmN1cnJlbnRTbGlkZX0sYi5wcm90b3R5cGUuZ2V0RG90Q291bnQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLGI9MCxjPTAsZD0wO2lmKGEub3B0aW9ucy5pbmZpbml0ZT09PSEwKWZvcig7YjxhLnNsaWRlQ291bnQ7KSsrZCxiPWMrYS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsLGMrPWEub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDw9YS5vcHRpb25zLnNsaWRlc1RvU2hvdz9hLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw6YS5vcHRpb25zLnNsaWRlc1RvU2hvdztlbHNlIGlmKGEub3B0aW9ucy5jZW50ZXJNb2RlPT09ITApZD1hLnNsaWRlQ291bnQ7ZWxzZSBmb3IoO2I8YS5zbGlkZUNvdW50OykrK2QsYj1jK2Eub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCxjKz1hLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw8PWEub3B0aW9ucy5zbGlkZXNUb1Nob3c/YS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOmEub3B0aW9ucy5zbGlkZXNUb1Nob3c7cmV0dXJuIGQtMX0sYi5wcm90b3R5cGUuZ2V0TGVmdD1mdW5jdGlvbihhKXt2YXIgYyxkLGYsYj10aGlzLGU9MDtyZXR1cm4gYi5zbGlkZU9mZnNldD0wLGQ9Yi4kc2xpZGVzLmZpcnN0KCkub3V0ZXJIZWlnaHQoITApLGIub3B0aW9ucy5pbmZpbml0ZT09PSEwPyhiLnNsaWRlQ291bnQ+Yi5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGIuc2xpZGVPZmZzZXQ9Yi5zbGlkZVdpZHRoKmIub3B0aW9ucy5zbGlkZXNUb1Nob3cqLTEsZT1kKmIub3B0aW9ucy5zbGlkZXNUb1Nob3cqLTEpLGIuc2xpZGVDb3VudCViLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwhPT0wJiZhK2Iub3B0aW9ucy5zbGlkZXNUb1Njcm9sbD5iLnNsaWRlQ291bnQmJmIuc2xpZGVDb3VudD5iLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYoYT5iLnNsaWRlQ291bnQ/KGIuc2xpZGVPZmZzZXQ9KGIub3B0aW9ucy5zbGlkZXNUb1Nob3ctKGEtYi5zbGlkZUNvdW50KSkqYi5zbGlkZVdpZHRoKi0xLGU9KGIub3B0aW9ucy5zbGlkZXNUb1Nob3ctKGEtYi5zbGlkZUNvdW50KSkqZCotMSk6KGIuc2xpZGVPZmZzZXQ9Yi5zbGlkZUNvdW50JWIub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCpiLnNsaWRlV2lkdGgqLTEsZT1iLnNsaWRlQ291bnQlYi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKmQqLTEpKSk6YStiLm9wdGlvbnMuc2xpZGVzVG9TaG93PmIuc2xpZGVDb3VudCYmKGIuc2xpZGVPZmZzZXQ9KGErYi5vcHRpb25zLnNsaWRlc1RvU2hvdy1iLnNsaWRlQ291bnQpKmIuc2xpZGVXaWR0aCxlPShhK2Iub3B0aW9ucy5zbGlkZXNUb1Nob3ctYi5zbGlkZUNvdW50KSpkKSxiLnNsaWRlQ291bnQ8PWIub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihiLnNsaWRlT2Zmc2V0PTAsZT0wKSxiLm9wdGlvbnMuY2VudGVyTW9kZT09PSEwJiZiLm9wdGlvbnMuaW5maW5pdGU9PT0hMD9iLnNsaWRlT2Zmc2V0Kz1iLnNsaWRlV2lkdGgqTWF0aC5mbG9vcihiLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIpLWIuc2xpZGVXaWR0aDpiLm9wdGlvbnMuY2VudGVyTW9kZT09PSEwJiYoYi5zbGlkZU9mZnNldD0wLGIuc2xpZGVPZmZzZXQrPWIuc2xpZGVXaWR0aCpNYXRoLmZsb29yKGIub3B0aW9ucy5zbGlkZXNUb1Nob3cvMikpLGM9Yi5vcHRpb25zLnZlcnRpY2FsPT09ITE/YSpiLnNsaWRlV2lkdGgqLTErYi5zbGlkZU9mZnNldDphKmQqLTErZSxiLm9wdGlvbnMudmFyaWFibGVXaWR0aD09PSEwJiYoZj1iLnNsaWRlQ291bnQ8PWIub3B0aW9ucy5zbGlkZXNUb1Nob3d8fGIub3B0aW9ucy5pbmZpbml0ZT09PSExP2IuJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikuZXEoYSk6Yi4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS5lcShhK2Iub3B0aW9ucy5zbGlkZXNUb1Nob3cpLGM9Yi5vcHRpb25zLnJ0bD09PSEwP2ZbMF0/LTEqKGIuJHNsaWRlVHJhY2sud2lkdGgoKS1mWzBdLm9mZnNldExlZnQtZi53aWR0aCgpKTowOmZbMF0/LTEqZlswXS5vZmZzZXRMZWZ0OjAsYi5vcHRpb25zLmNlbnRlck1vZGU9PT0hMCYmKGY9Yi5zbGlkZUNvdW50PD1iLm9wdGlvbnMuc2xpZGVzVG9TaG93fHxiLm9wdGlvbnMuaW5maW5pdGU9PT0hMT9iLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLmVxKGEpOmIuJHNsaWRlVHJhY2suY2hpbGRyZW4oXCIuc2xpY2stc2xpZGVcIikuZXEoYStiLm9wdGlvbnMuc2xpZGVzVG9TaG93KzEpLGM9Yi5vcHRpb25zLnJ0bD09PSEwP2ZbMF0/LTEqKGIuJHNsaWRlVHJhY2sud2lkdGgoKS1mWzBdLm9mZnNldExlZnQtZi53aWR0aCgpKTowOmZbMF0/LTEqZlswXS5vZmZzZXRMZWZ0OjAsYys9KGIuJGxpc3Qud2lkdGgoKS1mLm91dGVyV2lkdGgoKSkvMikpLGN9LGIucHJvdG90eXBlLmdldE9wdGlvbj1iLnByb3RvdHlwZS5zbGlja0dldE9wdGlvbj1mdW5jdGlvbihhKXt2YXIgYj10aGlzO3JldHVybiBiLm9wdGlvbnNbYV19LGIucHJvdG90eXBlLmdldE5hdmlnYWJsZUluZGV4ZXM9ZnVuY3Rpb24oKXt2YXIgZSxhPXRoaXMsYj0wLGM9MCxkPVtdO2ZvcihhLm9wdGlvbnMuaW5maW5pdGU9PT0hMT9lPWEuc2xpZGVDb3VudDooYj0tMSphLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwsYz0tMSphLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwsZT0yKmEuc2xpZGVDb3VudCk7ZT5iOylkLnB1c2goYiksYj1jK2Eub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCxjKz1hLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw8PWEub3B0aW9ucy5zbGlkZXNUb1Nob3c/YS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOmEub3B0aW9ucy5zbGlkZXNUb1Nob3c7cmV0dXJuIGR9LGIucHJvdG90eXBlLmdldFNsaWNrPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9LGIucHJvdG90eXBlLmdldFNsaWRlQ291bnQ9ZnVuY3Rpb24oKXt2YXIgYyxkLGUsYj10aGlzO3JldHVybiBlPWIub3B0aW9ucy5jZW50ZXJNb2RlPT09ITA/Yi5zbGlkZVdpZHRoKk1hdGguZmxvb3IoYi5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKTowLGIub3B0aW9ucy5zd2lwZVRvU2xpZGU9PT0hMD8oYi4kc2xpZGVUcmFjay5maW5kKFwiLnNsaWNrLXNsaWRlXCIpLmVhY2goZnVuY3Rpb24oYyxmKXtyZXR1cm4gZi5vZmZzZXRMZWZ0LWUrYShmKS5vdXRlcldpZHRoKCkvMj4tMSpiLnN3aXBlTGVmdD8oZD1mLCExKTp2b2lkIDB9KSxjPU1hdGguYWJzKGEoZCkuYXR0cihcImRhdGEtc2xpY2staW5kZXhcIiktYi5jdXJyZW50U2xpZGUpfHwxKTpiLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGx9LGIucHJvdG90eXBlLmdvVG89Yi5wcm90b3R5cGUuc2xpY2tHb1RvPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcztjLmNoYW5nZVNsaWRlKHtkYXRhOnttZXNzYWdlOlwiaW5kZXhcIixpbmRleDpwYXJzZUludChhKX19LGIpfSxiLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKGIpe3ZhciBjPXRoaXM7YShjLiRzbGlkZXIpLmhhc0NsYXNzKFwic2xpY2staW5pdGlhbGl6ZWRcIil8fChhKGMuJHNsaWRlcikuYWRkQ2xhc3MoXCJzbGljay1pbml0aWFsaXplZFwiKSxjLmJ1aWxkUm93cygpLGMuYnVpbGRPdXQoKSxjLnNldFByb3BzKCksYy5zdGFydExvYWQoKSxjLmxvYWRTbGlkZXIoKSxjLmluaXRpYWxpemVFdmVudHMoKSxjLnVwZGF0ZUFycm93cygpLGMudXBkYXRlRG90cygpKSxiJiZjLiRzbGlkZXIudHJpZ2dlcihcImluaXRcIixbY10pLGMub3B0aW9ucy5hY2Nlc3NpYmlsaXR5PT09ITAmJmMuaW5pdEFEQSgpfSxiLnByb3RvdHlwZS5pbml0QXJyb3dFdmVudHM9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2Eub3B0aW9ucy5hcnJvd3M9PT0hMCYmYS5zbGlkZUNvdW50PmEub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihhLiRwcmV2QXJyb3cub24oXCJjbGljay5zbGlja1wiLHttZXNzYWdlOlwicHJldmlvdXNcIn0sYS5jaGFuZ2VTbGlkZSksYS4kbmV4dEFycm93Lm9uKFwiY2xpY2suc2xpY2tcIix7bWVzc2FnZTpcIm5leHRcIn0sYS5jaGFuZ2VTbGlkZSkpfSxiLnByb3RvdHlwZS5pbml0RG90RXZlbnRzPWZ1bmN0aW9uKCl7dmFyIGI9dGhpcztiLm9wdGlvbnMuZG90cz09PSEwJiZiLnNsaWRlQ291bnQ+Yi5vcHRpb25zLnNsaWRlc1RvU2hvdyYmYShcImxpXCIsYi4kZG90cykub24oXCJjbGljay5zbGlja1wiLHttZXNzYWdlOlwiaW5kZXhcIn0sYi5jaGFuZ2VTbGlkZSksYi5vcHRpb25zLmRvdHM9PT0hMCYmYi5vcHRpb25zLnBhdXNlT25Eb3RzSG92ZXI9PT0hMCYmYi5vcHRpb25zLmF1dG9wbGF5PT09ITAmJmEoXCJsaVwiLGIuJGRvdHMpLm9uKFwibW91c2VlbnRlci5zbGlja1wiLGEucHJveHkoYi5zZXRQYXVzZWQsYiwhMCkpLm9uKFwibW91c2VsZWF2ZS5zbGlja1wiLGEucHJveHkoYi5zZXRQYXVzZWQsYiwhMSkpfSxiLnByb3RvdHlwZS5pbml0aWFsaXplRXZlbnRzPWZ1bmN0aW9uKCl7dmFyIGI9dGhpcztiLmluaXRBcnJvd0V2ZW50cygpLGIuaW5pdERvdEV2ZW50cygpLGIuJGxpc3Qub24oXCJ0b3VjaHN0YXJ0LnNsaWNrIG1vdXNlZG93bi5zbGlja1wiLHthY3Rpb246XCJzdGFydFwifSxiLnN3aXBlSGFuZGxlciksYi4kbGlzdC5vbihcInRvdWNobW92ZS5zbGljayBtb3VzZW1vdmUuc2xpY2tcIix7YWN0aW9uOlwibW92ZVwifSxiLnN3aXBlSGFuZGxlciksYi4kbGlzdC5vbihcInRvdWNoZW5kLnNsaWNrIG1vdXNldXAuc2xpY2tcIix7YWN0aW9uOlwiZW5kXCJ9LGIuc3dpcGVIYW5kbGVyKSxiLiRsaXN0Lm9uKFwidG91Y2hjYW5jZWwuc2xpY2sgbW91c2VsZWF2ZS5zbGlja1wiLHthY3Rpb246XCJlbmRcIn0sYi5zd2lwZUhhbmRsZXIpLGIuJGxpc3Qub24oXCJjbGljay5zbGlja1wiLGIuY2xpY2tIYW5kbGVyKSxhKGRvY3VtZW50KS5vbihiLnZpc2liaWxpdHlDaGFuZ2UsYS5wcm94eShiLnZpc2liaWxpdHksYikpLGIuJGxpc3Qub24oXCJtb3VzZWVudGVyLnNsaWNrXCIsYS5wcm94eShiLnNldFBhdXNlZCxiLCEwKSksYi4kbGlzdC5vbihcIm1vdXNlbGVhdmUuc2xpY2tcIixhLnByb3h5KGIuc2V0UGF1c2VkLGIsITEpKSxiLm9wdGlvbnMuYWNjZXNzaWJpbGl0eT09PSEwJiZiLiRsaXN0Lm9uKFwia2V5ZG93bi5zbGlja1wiLGIua2V5SGFuZGxlciksYi5vcHRpb25zLmZvY3VzT25TZWxlY3Q9PT0hMCYmYShiLiRzbGlkZVRyYWNrKS5jaGlsZHJlbigpLm9uKFwiY2xpY2suc2xpY2tcIixiLnNlbGVjdEhhbmRsZXIpLGEod2luZG93KS5vbihcIm9yaWVudGF0aW9uY2hhbmdlLnNsaWNrLnNsaWNrLVwiK2IuaW5zdGFuY2VVaWQsYS5wcm94eShiLm9yaWVudGF0aW9uQ2hhbmdlLGIpKSxhKHdpbmRvdykub24oXCJyZXNpemUuc2xpY2suc2xpY2stXCIrYi5pbnN0YW5jZVVpZCxhLnByb3h5KGIucmVzaXplLGIpKSxhKFwiW2RyYWdnYWJsZSE9dHJ1ZV1cIixiLiRzbGlkZVRyYWNrKS5vbihcImRyYWdzdGFydFwiLGIucHJldmVudERlZmF1bHQpLGEod2luZG93KS5vbihcImxvYWQuc2xpY2suc2xpY2stXCIrYi5pbnN0YW5jZVVpZCxiLnNldFBvc2l0aW9uKSxhKGRvY3VtZW50KS5vbihcInJlYWR5LnNsaWNrLnNsaWNrLVwiK2IuaW5zdGFuY2VVaWQsYi5zZXRQb3NpdGlvbil9LGIucHJvdG90eXBlLmluaXRVST1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS5vcHRpb25zLmFycm93cz09PSEwJiZhLnNsaWRlQ291bnQ+YS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGEuJHByZXZBcnJvdy5zaG93KCksYS4kbmV4dEFycm93LnNob3coKSksYS5vcHRpb25zLmRvdHM9PT0hMCYmYS5zbGlkZUNvdW50PmEub3B0aW9ucy5zbGlkZXNUb1Nob3cmJmEuJGRvdHMuc2hvdygpLGEub3B0aW9ucy5hdXRvcGxheT09PSEwJiZhLmF1dG9QbGF5KCl9LGIucHJvdG90eXBlLmtleUhhbmRsZXI9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpczthLnRhcmdldC50YWdOYW1lLm1hdGNoKFwiVEVYVEFSRUF8SU5QVVR8U0VMRUNUXCIpfHwoMzc9PT1hLmtleUNvZGUmJmIub3B0aW9ucy5hY2Nlc3NpYmlsaXR5PT09ITA/Yi5jaGFuZ2VTbGlkZSh7ZGF0YTp7bWVzc2FnZTpcInByZXZpb3VzXCJ9fSk6Mzk9PT1hLmtleUNvZGUmJmIub3B0aW9ucy5hY2Nlc3NpYmlsaXR5PT09ITAmJmIuY2hhbmdlU2xpZGUoe2RhdGE6e21lc3NhZ2U6XCJuZXh0XCJ9fSkpfSxiLnByb3RvdHlwZS5sYXp5TG9hZD1mdW5jdGlvbigpe2Z1bmN0aW9uIGcoYil7YShcImltZ1tkYXRhLWxhenldXCIsYikuZWFjaChmdW5jdGlvbigpe3ZhciBiPWEodGhpcyksYz1hKHRoaXMpLmF0dHIoXCJkYXRhLWxhenlcIiksZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO2Qub25sb2FkPWZ1bmN0aW9uKCl7Yi5hbmltYXRlKHtvcGFjaXR5OjB9LDEwMCxmdW5jdGlvbigpe2IuYXR0cihcInNyY1wiLGMpLmFuaW1hdGUoe29wYWNpdHk6MX0sMjAwLGZ1bmN0aW9uKCl7Yi5yZW1vdmVBdHRyKFwiZGF0YS1sYXp5XCIpLnJlbW92ZUNsYXNzKFwic2xpY2stbG9hZGluZ1wiKX0pfSl9LGQuc3JjPWN9KX12YXIgYyxkLGUsZixiPXRoaXM7Yi5vcHRpb25zLmNlbnRlck1vZGU9PT0hMD9iLm9wdGlvbnMuaW5maW5pdGU9PT0hMD8oZT1iLmN1cnJlbnRTbGlkZSsoYi5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKzEpLGY9ZStiLm9wdGlvbnMuc2xpZGVzVG9TaG93KzIpOihlPU1hdGgubWF4KDAsYi5jdXJyZW50U2xpZGUtKGIub3B0aW9ucy5zbGlkZXNUb1Nob3cvMisxKSksZj0yKyhiLm9wdGlvbnMuc2xpZGVzVG9TaG93LzIrMSkrYi5jdXJyZW50U2xpZGUpOihlPWIub3B0aW9ucy5pbmZpbml0ZT9iLm9wdGlvbnMuc2xpZGVzVG9TaG93K2IuY3VycmVudFNsaWRlOmIuY3VycmVudFNsaWRlLGY9ZStiLm9wdGlvbnMuc2xpZGVzVG9TaG93LGIub3B0aW9ucy5mYWRlPT09ITAmJihlPjAmJmUtLSxmPD1iLnNsaWRlQ291bnQmJmYrKykpLGM9Yi4kc2xpZGVyLmZpbmQoXCIuc2xpY2stc2xpZGVcIikuc2xpY2UoZSxmKSxnKGMpLGIuc2xpZGVDb3VudDw9Yi5vcHRpb25zLnNsaWRlc1RvU2hvdz8oZD1iLiRzbGlkZXIuZmluZChcIi5zbGljay1zbGlkZVwiKSxnKGQpKTpiLmN1cnJlbnRTbGlkZT49Yi5zbGlkZUNvdW50LWIub3B0aW9ucy5zbGlkZXNUb1Nob3c/KGQ9Yi4kc2xpZGVyLmZpbmQoXCIuc2xpY2stY2xvbmVkXCIpLnNsaWNlKDAsYi5vcHRpb25zLnNsaWRlc1RvU2hvdyksZyhkKSk6MD09PWIuY3VycmVudFNsaWRlJiYoZD1iLiRzbGlkZXIuZmluZChcIi5zbGljay1jbG9uZWRcIikuc2xpY2UoLTEqYi5vcHRpb25zLnNsaWRlc1RvU2hvdyksZyhkKSl9LGIucHJvdG90eXBlLmxvYWRTbGlkZXI9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2Euc2V0UG9zaXRpb24oKSxhLiRzbGlkZVRyYWNrLmNzcyh7b3BhY2l0eToxfSksYS4kc2xpZGVyLnJlbW92ZUNsYXNzKFwic2xpY2stbG9hZGluZ1wiKSxhLmluaXRVSSgpLFwicHJvZ3Jlc3NpdmVcIj09PWEub3B0aW9ucy5sYXp5TG9hZCYmYS5wcm9ncmVzc2l2ZUxhenlMb2FkKCl9LGIucHJvdG90eXBlLm5leHQ9Yi5wcm90b3R5cGUuc2xpY2tOZXh0PWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLmNoYW5nZVNsaWRlKHtkYXRhOnttZXNzYWdlOlwibmV4dFwifX0pfSxiLnByb3RvdHlwZS5vcmllbnRhdGlvbkNoYW5nZT1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS5jaGVja1Jlc3BvbnNpdmUoKSxhLnNldFBvc2l0aW9uKCl9LGIucHJvdG90eXBlLnBhdXNlPWIucHJvdG90eXBlLnNsaWNrUGF1c2U9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2EuYXV0b1BsYXlDbGVhcigpLGEucGF1c2VkPSEwfSxiLnByb3RvdHlwZS5wbGF5PWIucHJvdG90eXBlLnNsaWNrUGxheT1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS5wYXVzZWQ9ITEsYS5hdXRvUGxheSgpfSxiLnByb3RvdHlwZS5wb3N0U2xpZGU9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztiLiRzbGlkZXIudHJpZ2dlcihcImFmdGVyQ2hhbmdlXCIsW2IsYV0pLGIuYW5pbWF0aW5nPSExLGIuc2V0UG9zaXRpb24oKSxiLnN3aXBlTGVmdD1udWxsLGIub3B0aW9ucy5hdXRvcGxheT09PSEwJiZiLnBhdXNlZD09PSExJiZiLmF1dG9QbGF5KCksYi5vcHRpb25zLmFjY2Vzc2liaWxpdHk9PT0hMCYmYi5pbml0QURBKCl9LGIucHJvdG90eXBlLnByZXY9Yi5wcm90b3R5cGUuc2xpY2tQcmV2PWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLmNoYW5nZVNsaWRlKHtkYXRhOnttZXNzYWdlOlwicHJldmlvdXNcIn19KX0sYi5wcm90b3R5cGUucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oYSl7YS5wcmV2ZW50RGVmYXVsdCgpfSxiLnByb3RvdHlwZS5wcm9ncmVzc2l2ZUxhenlMb2FkPWZ1bmN0aW9uKCl7dmFyIGMsZCxiPXRoaXM7Yz1hKFwiaW1nW2RhdGEtbGF6eV1cIixiLiRzbGlkZXIpLmxlbmd0aCxjPjAmJihkPWEoXCJpbWdbZGF0YS1sYXp5XVwiLGIuJHNsaWRlcikuZmlyc3QoKSxkLmF0dHIoXCJzcmNcIixudWxsKSxkLmF0dHIoXCJzcmNcIixkLmF0dHIoXCJkYXRhLWxhenlcIikpLnJlbW92ZUNsYXNzKFwic2xpY2stbG9hZGluZ1wiKS5sb2FkKGZ1bmN0aW9uKCl7ZC5yZW1vdmVBdHRyKFwiZGF0YS1sYXp5XCIpLGIucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpLGIub3B0aW9ucy5hZGFwdGl2ZUhlaWdodD09PSEwJiZiLnNldFBvc2l0aW9uKCl9KS5lcnJvcihmdW5jdGlvbigpe2QucmVtb3ZlQXR0cihcImRhdGEtbGF6eVwiKSxiLnByb2dyZXNzaXZlTGF6eUxvYWQoKX0pKX0sYi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbihiKXt2YXIgZCxlLGM9dGhpcztlPWMuc2xpZGVDb3VudC1jLm9wdGlvbnMuc2xpZGVzVG9TaG93LGMub3B0aW9ucy5pbmZpbml0ZXx8KGMuc2xpZGVDb3VudDw9Yy5vcHRpb25zLnNsaWRlc1RvU2hvdz9jLmN1cnJlbnRTbGlkZT0wOmMuY3VycmVudFNsaWRlPmUmJihjLmN1cnJlbnRTbGlkZT1lKSksZD1jLmN1cnJlbnRTbGlkZSxjLmRlc3Ryb3koITApLGEuZXh0ZW5kKGMsYy5pbml0aWFscyx7Y3VycmVudFNsaWRlOmR9KSxjLmluaXQoKSxifHxjLmNoYW5nZVNsaWRlKHtkYXRhOnttZXNzYWdlOlwiaW5kZXhcIixpbmRleDpkfX0sITEpfSxiLnByb3RvdHlwZS5yZWdpc3RlckJyZWFrcG9pbnRzPWZ1bmN0aW9uKCl7dmFyIGMsZCxlLGI9dGhpcyxmPWIub3B0aW9ucy5yZXNwb25zaXZlfHxudWxsO2lmKFwiYXJyYXlcIj09PWEudHlwZShmKSYmZi5sZW5ndGgpe2IucmVzcG9uZFRvPWIub3B0aW9ucy5yZXNwb25kVG98fFwid2luZG93XCI7Zm9yKGMgaW4gZilpZihlPWIuYnJlYWtwb2ludHMubGVuZ3RoLTEsZD1mW2NdLmJyZWFrcG9pbnQsZi5oYXNPd25Qcm9wZXJ0eShjKSl7Zm9yKDtlPj0wOyliLmJyZWFrcG9pbnRzW2VdJiZiLmJyZWFrcG9pbnRzW2VdPT09ZCYmYi5icmVha3BvaW50cy5zcGxpY2UoZSwxKSxlLS07Yi5icmVha3BvaW50cy5wdXNoKGQpLGIuYnJlYWtwb2ludFNldHRpbmdzW2RdPWZbY10uc2V0dGluZ3N9Yi5icmVha3BvaW50cy5zb3J0KGZ1bmN0aW9uKGEsYyl7cmV0dXJuIGIub3B0aW9ucy5tb2JpbGVGaXJzdD9hLWM6Yy1hfSl9fSxiLnByb3RvdHlwZS5yZWluaXQ9ZnVuY3Rpb24oKXt2YXIgYj10aGlzO2IuJHNsaWRlcz1iLiRzbGlkZVRyYWNrLmNoaWxkcmVuKGIub3B0aW9ucy5zbGlkZSkuYWRkQ2xhc3MoXCJzbGljay1zbGlkZVwiKSxiLnNsaWRlQ291bnQ9Yi4kc2xpZGVzLmxlbmd0aCxiLmN1cnJlbnRTbGlkZT49Yi5zbGlkZUNvdW50JiYwIT09Yi5jdXJyZW50U2xpZGUmJihiLmN1cnJlbnRTbGlkZT1iLmN1cnJlbnRTbGlkZS1iLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpLGIuc2xpZGVDb3VudDw9Yi5vcHRpb25zLnNsaWRlc1RvU2hvdyYmKGIuY3VycmVudFNsaWRlPTApLGIucmVnaXN0ZXJCcmVha3BvaW50cygpLGIuc2V0UHJvcHMoKSxiLnNldHVwSW5maW5pdGUoKSxiLmJ1aWxkQXJyb3dzKCksYi51cGRhdGVBcnJvd3MoKSxiLmluaXRBcnJvd0V2ZW50cygpLGIuYnVpbGREb3RzKCksYi51cGRhdGVEb3RzKCksYi5pbml0RG90RXZlbnRzKCksYi5jaGVja1Jlc3BvbnNpdmUoITEsITApLGIub3B0aW9ucy5mb2N1c09uU2VsZWN0PT09ITAmJmEoYi4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vbihcImNsaWNrLnNsaWNrXCIsYi5zZWxlY3RIYW5kbGVyKSxiLnNldFNsaWRlQ2xhc3NlcygwKSxiLnNldFBvc2l0aW9uKCksYi4kc2xpZGVyLnRyaWdnZXIoXCJyZUluaXRcIixbYl0pLGIub3B0aW9ucy5hdXRvcGxheT09PSEwJiZiLmZvY3VzSGFuZGxlcigpfSxiLnByb3RvdHlwZS5yZXNpemU9ZnVuY3Rpb24oKXt2YXIgYj10aGlzO2Eod2luZG93KS53aWR0aCgpIT09Yi53aW5kb3dXaWR0aCYmKGNsZWFyVGltZW91dChiLndpbmRvd0RlbGF5KSxiLndpbmRvd0RlbGF5PXdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yi53aW5kb3dXaWR0aD1hKHdpbmRvdykud2lkdGgoKSxiLmNoZWNrUmVzcG9uc2l2ZSgpLGIudW5zbGlja2VkfHxiLnNldFBvc2l0aW9uKCl9LDUwKSl9LGIucHJvdG90eXBlLnJlbW92ZVNsaWRlPWIucHJvdG90eXBlLnNsaWNrUmVtb3ZlPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD10aGlzO3JldHVyblwiYm9vbGVhblwiPT10eXBlb2YgYT8oYj1hLGE9Yj09PSEwPzA6ZC5zbGlkZUNvdW50LTEpOmE9Yj09PSEwPy0tYTphLGQuc2xpZGVDb3VudDwxfHwwPmF8fGE+ZC5zbGlkZUNvdW50LTE/ITE6KGQudW5sb2FkKCksYz09PSEwP2QuJHNsaWRlVHJhY2suY2hpbGRyZW4oKS5yZW1vdmUoKTpkLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZXEoYSkucmVtb3ZlKCksZC4kc2xpZGVzPWQuJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKSxkLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCksZC4kc2xpZGVUcmFjay5hcHBlbmQoZC4kc2xpZGVzKSxkLiRzbGlkZXNDYWNoZT1kLiRzbGlkZXMsdm9pZCBkLnJlaW5pdCgpKX0sYi5wcm90b3R5cGUuc2V0Q1NTPWZ1bmN0aW9uKGEpe3ZhciBkLGUsYj10aGlzLGM9e307Yi5vcHRpb25zLnJ0bD09PSEwJiYoYT0tYSksZD1cImxlZnRcIj09Yi5wb3NpdGlvblByb3A/TWF0aC5jZWlsKGEpK1wicHhcIjpcIjBweFwiLGU9XCJ0b3BcIj09Yi5wb3NpdGlvblByb3A/TWF0aC5jZWlsKGEpK1wicHhcIjpcIjBweFwiLGNbYi5wb3NpdGlvblByb3BdPWEsYi50cmFuc2Zvcm1zRW5hYmxlZD09PSExP2IuJHNsaWRlVHJhY2suY3NzKGMpOihjPXt9LGIuY3NzVHJhbnNpdGlvbnM9PT0hMT8oY1tiLmFuaW1UeXBlXT1cInRyYW5zbGF0ZShcIitkK1wiLCBcIitlK1wiKVwiLGIuJHNsaWRlVHJhY2suY3NzKGMpKTooY1tiLmFuaW1UeXBlXT1cInRyYW5zbGF0ZTNkKFwiK2QrXCIsIFwiK2UrXCIsIDBweClcIixiLiRzbGlkZVRyYWNrLmNzcyhjKSkpfSxiLnByb3RvdHlwZS5zZXREaW1lbnNpb25zPWZ1bmN0aW9uKCl7dmFyIGE9dGhpczthLm9wdGlvbnMudmVydGljYWw9PT0hMT9hLm9wdGlvbnMuY2VudGVyTW9kZT09PSEwJiZhLiRsaXN0LmNzcyh7cGFkZGluZzpcIjBweCBcIithLm9wdGlvbnMuY2VudGVyUGFkZGluZ30pOihhLiRsaXN0LmhlaWdodChhLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCghMCkqYS5vcHRpb25zLnNsaWRlc1RvU2hvdyksYS5vcHRpb25zLmNlbnRlck1vZGU9PT0hMCYmYS4kbGlzdC5jc3Moe3BhZGRpbmc6YS5vcHRpb25zLmNlbnRlclBhZGRpbmcrXCIgMHB4XCJ9KSksYS5saXN0V2lkdGg9YS4kbGlzdC53aWR0aCgpLGEubGlzdEhlaWdodD1hLiRsaXN0LmhlaWdodCgpLGEub3B0aW9ucy52ZXJ0aWNhbD09PSExJiZhLm9wdGlvbnMudmFyaWFibGVXaWR0aD09PSExPyhhLnNsaWRlV2lkdGg9TWF0aC5jZWlsKGEubGlzdFdpZHRoL2Eub3B0aW9ucy5zbGlkZXNUb1Nob3cpLGEuJHNsaWRlVHJhY2sud2lkdGgoTWF0aC5jZWlsKGEuc2xpZGVXaWR0aCphLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLmxlbmd0aCkpKTphLm9wdGlvbnMudmFyaWFibGVXaWR0aD09PSEwP2EuJHNsaWRlVHJhY2sud2lkdGgoNWUzKmEuc2xpZGVDb3VudCk6KGEuc2xpZGVXaWR0aD1NYXRoLmNlaWwoYS5saXN0V2lkdGgpLGEuJHNsaWRlVHJhY2suaGVpZ2h0KE1hdGguY2VpbChhLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCghMCkqYS4kc2xpZGVUcmFjay5jaGlsZHJlbihcIi5zbGljay1zbGlkZVwiKS5sZW5ndGgpKSk7dmFyIGI9YS4kc2xpZGVzLmZpcnN0KCkub3V0ZXJXaWR0aCghMCktYS4kc2xpZGVzLmZpcnN0KCkud2lkdGgoKTthLm9wdGlvbnMudmFyaWFibGVXaWR0aD09PSExJiZhLiRzbGlkZVRyYWNrLmNoaWxkcmVuKFwiLnNsaWNrLXNsaWRlXCIpLndpZHRoKGEuc2xpZGVXaWR0aC1iKX0sYi5wcm90b3R5cGUuc2V0RmFkZT1mdW5jdGlvbigpe3ZhciBjLGI9dGhpcztiLiRzbGlkZXMuZWFjaChmdW5jdGlvbihkLGUpe2M9Yi5zbGlkZVdpZHRoKmQqLTEsYi5vcHRpb25zLnJ0bD09PSEwP2EoZSkuY3NzKHtwb3NpdGlvbjpcInJlbGF0aXZlXCIscmlnaHQ6Yyx0b3A6MCx6SW5kZXg6Yi5vcHRpb25zLnpJbmRleC0yLG9wYWNpdHk6MH0pOmEoZSkuY3NzKHtwb3NpdGlvbjpcInJlbGF0aXZlXCIsbGVmdDpjLHRvcDowLHpJbmRleDpiLm9wdGlvbnMuekluZGV4LTIsb3BhY2l0eTowfSl9KSxiLiRzbGlkZXMuZXEoYi5jdXJyZW50U2xpZGUpLmNzcyh7ekluZGV4OmIub3B0aW9ucy56SW5kZXgtMSxvcGFjaXR5OjF9KX0sYi5wcm90b3R5cGUuc2V0SGVpZ2h0PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcztpZigxPT09YS5vcHRpb25zLnNsaWRlc1RvU2hvdyYmYS5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0PT09ITAmJmEub3B0aW9ucy52ZXJ0aWNhbD09PSExKXt2YXIgYj1hLiRzbGlkZXMuZXEoYS5jdXJyZW50U2xpZGUpLm91dGVySGVpZ2h0KCEwKTthLiRsaXN0LmNzcyhcImhlaWdodFwiLGIpfX0sYi5wcm90b3R5cGUuc2V0T3B0aW9uPWIucHJvdG90eXBlLnNsaWNrU2V0T3B0aW9uPWZ1bmN0aW9uKGIsYyxkKXt2YXIgZixnLGU9dGhpcztpZihcInJlc3BvbnNpdmVcIj09PWImJlwiYXJyYXlcIj09PWEudHlwZShjKSlmb3IoZyBpbiBjKWlmKFwiYXJyYXlcIiE9PWEudHlwZShlLm9wdGlvbnMucmVzcG9uc2l2ZSkpZS5vcHRpb25zLnJlc3BvbnNpdmU9W2NbZ11dO2Vsc2V7Zm9yKGY9ZS5vcHRpb25zLnJlc3BvbnNpdmUubGVuZ3RoLTE7Zj49MDspZS5vcHRpb25zLnJlc3BvbnNpdmVbZl0uYnJlYWtwb2ludD09PWNbZ10uYnJlYWtwb2ludCYmZS5vcHRpb25zLnJlc3BvbnNpdmUuc3BsaWNlKGYsMSksZi0tO2Uub3B0aW9ucy5yZXNwb25zaXZlLnB1c2goY1tnXSl9ZWxzZSBlLm9wdGlvbnNbYl09YztkPT09ITAmJihlLnVubG9hZCgpLGUucmVpbml0KCkpfSxiLnByb3RvdHlwZS5zZXRQb3NpdGlvbj1mdW5jdGlvbigpe3ZhciBhPXRoaXM7YS5zZXREaW1lbnNpb25zKCksYS5zZXRIZWlnaHQoKSxhLm9wdGlvbnMuZmFkZT09PSExP2Euc2V0Q1NTKGEuZ2V0TGVmdChhLmN1cnJlbnRTbGlkZSkpOmEuc2V0RmFkZSgpLGEuJHNsaWRlci50cmlnZ2VyKFwic2V0UG9zaXRpb25cIixbYV0pfSxiLnByb3RvdHlwZS5zZXRQcm9wcz1mdW5jdGlvbigpe3ZhciBhPXRoaXMsYj1kb2N1bWVudC5ib2R5LnN0eWxlO2EucG9zaXRpb25Qcm9wPWEub3B0aW9ucy52ZXJ0aWNhbD09PSEwP1widG9wXCI6XCJsZWZ0XCIsXCJ0b3BcIj09PWEucG9zaXRpb25Qcm9wP2EuJHNsaWRlci5hZGRDbGFzcyhcInNsaWNrLXZlcnRpY2FsXCIpOmEuJHNsaWRlci5yZW1vdmVDbGFzcyhcInNsaWNrLXZlcnRpY2FsXCIpLCh2b2lkIDAhPT1iLldlYmtpdFRyYW5zaXRpb258fHZvaWQgMCE9PWIuTW96VHJhbnNpdGlvbnx8dm9pZCAwIT09Yi5tc1RyYW5zaXRpb24pJiZhLm9wdGlvbnMudXNlQ1NTPT09ITAmJihhLmNzc1RyYW5zaXRpb25zPSEwKSxhLm9wdGlvbnMuZmFkZSYmKFwibnVtYmVyXCI9PXR5cGVvZiBhLm9wdGlvbnMuekluZGV4P2Eub3B0aW9ucy56SW5kZXg8MyYmKGEub3B0aW9ucy56SW5kZXg9Myk6YS5vcHRpb25zLnpJbmRleD1hLmRlZmF1bHRzLnpJbmRleCksdm9pZCAwIT09Yi5PVHJhbnNmb3JtJiYoYS5hbmltVHlwZT1cIk9UcmFuc2Zvcm1cIixhLnRyYW5zZm9ybVR5cGU9XCItby10cmFuc2Zvcm1cIixhLnRyYW5zaXRpb25UeXBlPVwiT1RyYW5zaXRpb25cIix2b2lkIDA9PT1iLnBlcnNwZWN0aXZlUHJvcGVydHkmJnZvaWQgMD09PWIud2Via2l0UGVyc3BlY3RpdmUmJihhLmFuaW1UeXBlPSExKSksdm9pZCAwIT09Yi5Nb3pUcmFuc2Zvcm0mJihhLmFuaW1UeXBlPVwiTW96VHJhbnNmb3JtXCIsYS50cmFuc2Zvcm1UeXBlPVwiLW1vei10cmFuc2Zvcm1cIixhLnRyYW5zaXRpb25UeXBlPVwiTW96VHJhbnNpdGlvblwiLHZvaWQgMD09PWIucGVyc3BlY3RpdmVQcm9wZXJ0eSYmdm9pZCAwPT09Yi5Nb3pQZXJzcGVjdGl2ZSYmKGEuYW5pbVR5cGU9ITEpKSx2b2lkIDAhPT1iLndlYmtpdFRyYW5zZm9ybSYmKGEuYW5pbVR5cGU9XCJ3ZWJraXRUcmFuc2Zvcm1cIixhLnRyYW5zZm9ybVR5cGU9XCItd2Via2l0LXRyYW5zZm9ybVwiLGEudHJhbnNpdGlvblR5cGU9XCJ3ZWJraXRUcmFuc2l0aW9uXCIsdm9pZCAwPT09Yi5wZXJzcGVjdGl2ZVByb3BlcnR5JiZ2b2lkIDA9PT1iLndlYmtpdFBlcnNwZWN0aXZlJiYoYS5hbmltVHlwZT0hMSkpLHZvaWQgMCE9PWIubXNUcmFuc2Zvcm0mJihhLmFuaW1UeXBlPVwibXNUcmFuc2Zvcm1cIixhLnRyYW5zZm9ybVR5cGU9XCItbXMtdHJhbnNmb3JtXCIsYS50cmFuc2l0aW9uVHlwZT1cIm1zVHJhbnNpdGlvblwiLHZvaWQgMD09PWIubXNUcmFuc2Zvcm0mJihhLmFuaW1UeXBlPSExKSksdm9pZCAwIT09Yi50cmFuc2Zvcm0mJmEuYW5pbVR5cGUhPT0hMSYmKGEuYW5pbVR5cGU9XCJ0cmFuc2Zvcm1cIixhLnRyYW5zZm9ybVR5cGU9XCJ0cmFuc2Zvcm1cIixhLnRyYW5zaXRpb25UeXBlPVwidHJhbnNpdGlvblwiKSxhLnRyYW5zZm9ybXNFbmFibGVkPWEub3B0aW9ucy51c2VUcmFuc2Zvcm0mJm51bGwhPT1hLmFuaW1UeXBlJiZhLmFuaW1UeXBlIT09ITF9LGIucHJvdG90eXBlLnNldFNsaWRlQ2xhc3Nlcz1mdW5jdGlvbihhKXt2YXIgYyxkLGUsZixiPXRoaXM7ZD1iLiRzbGlkZXIuZmluZChcIi5zbGljay1zbGlkZVwiKS5yZW1vdmVDbGFzcyhcInNsaWNrLWFjdGl2ZSBzbGljay1jZW50ZXIgc2xpY2stY3VycmVudFwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIiksYi4kc2xpZGVzLmVxKGEpLmFkZENsYXNzKFwic2xpY2stY3VycmVudFwiKSxiLm9wdGlvbnMuY2VudGVyTW9kZT09PSEwPyhjPU1hdGguZmxvb3IoYi5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKSxiLm9wdGlvbnMuaW5maW5pdGU9PT0hMCYmKGE+PWMmJmE8PWIuc2xpZGVDb3VudC0xLWM/Yi4kc2xpZGVzLnNsaWNlKGEtYyxhK2MrMSkuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKTooZT1iLm9wdGlvbnMuc2xpZGVzVG9TaG93K2EsZC5zbGljZShlLWMrMSxlK2MrMikuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKSksMD09PWE/ZC5lcShkLmxlbmd0aC0xLWIub3B0aW9ucy5zbGlkZXNUb1Nob3cpLmFkZENsYXNzKFwic2xpY2stY2VudGVyXCIpOmE9PT1iLnNsaWRlQ291bnQtMSYmZC5lcShiLm9wdGlvbnMuc2xpZGVzVG9TaG93KS5hZGRDbGFzcyhcInNsaWNrLWNlbnRlclwiKSksYi4kc2xpZGVzLmVxKGEpLmFkZENsYXNzKFwic2xpY2stY2VudGVyXCIpKTphPj0wJiZhPD1iLnNsaWRlQ291bnQtYi5vcHRpb25zLnNsaWRlc1RvU2hvdz9iLiRzbGlkZXMuc2xpY2UoYSxhK2Iub3B0aW9ucy5zbGlkZXNUb1Nob3cpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIik6ZC5sZW5ndGg8PWIub3B0aW9ucy5zbGlkZXNUb1Nob3c/ZC5hZGRDbGFzcyhcInNsaWNrLWFjdGl2ZVwiKS5hdHRyKFwiYXJpYS1oaWRkZW5cIixcImZhbHNlXCIpOihmPWIuc2xpZGVDb3VudCViLm9wdGlvbnMuc2xpZGVzVG9TaG93LGU9Yi5vcHRpb25zLmluZmluaXRlPT09ITA/Yi5vcHRpb25zLnNsaWRlc1RvU2hvdythOmEsYi5vcHRpb25zLnNsaWRlc1RvU2hvdz09Yi5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsJiZiLnNsaWRlQ291bnQtYTxiLm9wdGlvbnMuc2xpZGVzVG9TaG93P2Quc2xpY2UoZS0oYi5vcHRpb25zLnNsaWRlc1RvU2hvdy1mKSxlK2YpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIik6ZC5zbGljZShlLGUrYi5vcHRpb25zLnNsaWRlc1RvU2hvdykuYWRkQ2xhc3MoXCJzbGljay1hY3RpdmVcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJmYWxzZVwiKSksXCJvbmRlbWFuZFwiPT09Yi5vcHRpb25zLmxhenlMb2FkJiZiLmxhenlMb2FkKCl9LGIucHJvdG90eXBlLnNldHVwSW5maW5pdGU9ZnVuY3Rpb24oKXt2YXIgYyxkLGUsYj10aGlzO2lmKGIub3B0aW9ucy5mYWRlPT09ITAmJihiLm9wdGlvbnMuY2VudGVyTW9kZT0hMSksYi5vcHRpb25zLmluZmluaXRlPT09ITAmJmIub3B0aW9ucy5mYWRlPT09ITEmJihkPW51bGwsYi5zbGlkZUNvdW50PmIub3B0aW9ucy5zbGlkZXNUb1Nob3cpKXtmb3IoZT1iLm9wdGlvbnMuY2VudGVyTW9kZT09PSEwP2Iub3B0aW9ucy5zbGlkZXNUb1Nob3crMTpiLm9wdGlvbnMuc2xpZGVzVG9TaG93LGM9Yi5zbGlkZUNvdW50O2M+Yi5zbGlkZUNvdW50LWU7Yy09MSlkPWMtMSxhKGIuJHNsaWRlc1tkXSkuY2xvbmUoITApLmF0dHIoXCJpZFwiLFwiXCIpLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIsZC1iLnNsaWRlQ291bnQpLnByZXBlbmRUbyhiLiRzbGlkZVRyYWNrKS5hZGRDbGFzcyhcInNsaWNrLWNsb25lZFwiKTtmb3IoYz0wO2U+YztjKz0xKWQ9YyxhKGIuJHNsaWRlc1tkXSkuY2xvbmUoITApLmF0dHIoXCJpZFwiLFwiXCIpLmF0dHIoXCJkYXRhLXNsaWNrLWluZGV4XCIsZCtiLnNsaWRlQ291bnQpLmFwcGVuZFRvKGIuJHNsaWRlVHJhY2spLmFkZENsYXNzKFwic2xpY2stY2xvbmVkXCIpO2IuJHNsaWRlVHJhY2suZmluZChcIi5zbGljay1jbG9uZWRcIikuZmluZChcIltpZF1cIikuZWFjaChmdW5jdGlvbigpe2EodGhpcykuYXR0cihcImlkXCIsXCJcIil9KX19LGIucHJvdG90eXBlLnNldFBhdXNlZD1mdW5jdGlvbihhKXt2YXIgYj10aGlzO2Iub3B0aW9ucy5hdXRvcGxheT09PSEwJiZiLm9wdGlvbnMucGF1c2VPbkhvdmVyPT09ITAmJihiLnBhdXNlZD1hLGE/Yi5hdXRvUGxheUNsZWFyKCk6Yi5hdXRvUGxheSgpKX0sYi5wcm90b3R5cGUuc2VsZWN0SGFuZGxlcj1mdW5jdGlvbihiKXt2YXIgYz10aGlzLGQ9YShiLnRhcmdldCkuaXMoXCIuc2xpY2stc2xpZGVcIik/YShiLnRhcmdldCk6YShiLnRhcmdldCkucGFyZW50cyhcIi5zbGljay1zbGlkZVwiKSxlPXBhcnNlSW50KGQuYXR0cihcImRhdGEtc2xpY2staW5kZXhcIikpO3JldHVybiBlfHwoZT0wKSxjLnNsaWRlQ291bnQ8PWMub3B0aW9ucy5zbGlkZXNUb1Nob3c/KGMuc2V0U2xpZGVDbGFzc2VzKGUpLHZvaWQgYy5hc05hdkZvcihlKSk6dm9pZCBjLnNsaWRlSGFuZGxlcihlKX0sYi5wcm90b3R5cGUuc2xpZGVIYW5kbGVyPWZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlLGYsZyxoPW51bGwsaT10aGlzO3JldHVybiBiPWJ8fCExLGkuYW5pbWF0aW5nPT09ITAmJmkub3B0aW9ucy53YWl0Rm9yQW5pbWF0ZT09PSEwfHxpLm9wdGlvbnMuZmFkZT09PSEwJiZpLmN1cnJlbnRTbGlkZT09PWF8fGkuc2xpZGVDb3VudDw9aS5vcHRpb25zLnNsaWRlc1RvU2hvdz92b2lkIDA6KGI9PT0hMSYmaS5hc05hdkZvcihhKSxkPWEsaD1pLmdldExlZnQoZCksZz1pLmdldExlZnQoaS5jdXJyZW50U2xpZGUpLGkuY3VycmVudExlZnQ9bnVsbD09PWkuc3dpcGVMZWZ0P2c6aS5zd2lwZUxlZnQsaS5vcHRpb25zLmluZmluaXRlPT09ITEmJmkub3B0aW9ucy5jZW50ZXJNb2RlPT09ITEmJigwPmF8fGE+aS5nZXREb3RDb3VudCgpKmkub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCk/dm9pZChpLm9wdGlvbnMuZmFkZT09PSExJiYoZD1pLmN1cnJlbnRTbGlkZSxjIT09ITA/aS5hbmltYXRlU2xpZGUoZyxmdW5jdGlvbigpe2kucG9zdFNsaWRlKGQpO1xufSk6aS5wb3N0U2xpZGUoZCkpKTppLm9wdGlvbnMuaW5maW5pdGU9PT0hMSYmaS5vcHRpb25zLmNlbnRlck1vZGU9PT0hMCYmKDA+YXx8YT5pLnNsaWRlQ291bnQtaS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKT92b2lkKGkub3B0aW9ucy5mYWRlPT09ITEmJihkPWkuY3VycmVudFNsaWRlLGMhPT0hMD9pLmFuaW1hdGVTbGlkZShnLGZ1bmN0aW9uKCl7aS5wb3N0U2xpZGUoZCl9KTppLnBvc3RTbGlkZShkKSkpOihpLm9wdGlvbnMuYXV0b3BsYXk9PT0hMCYmY2xlYXJJbnRlcnZhbChpLmF1dG9QbGF5VGltZXIpLGU9MD5kP2kuc2xpZGVDb3VudCVpLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwhPT0wP2kuc2xpZGVDb3VudC1pLnNsaWRlQ291bnQlaS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsOmkuc2xpZGVDb3VudCtkOmQ+PWkuc2xpZGVDb3VudD9pLnNsaWRlQ291bnQlaS5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIT09MD8wOmQtaS5zbGlkZUNvdW50OmQsaS5hbmltYXRpbmc9ITAsaS4kc2xpZGVyLnRyaWdnZXIoXCJiZWZvcmVDaGFuZ2VcIixbaSxpLmN1cnJlbnRTbGlkZSxlXSksZj1pLmN1cnJlbnRTbGlkZSxpLmN1cnJlbnRTbGlkZT1lLGkuc2V0U2xpZGVDbGFzc2VzKGkuY3VycmVudFNsaWRlKSxpLnVwZGF0ZURvdHMoKSxpLnVwZGF0ZUFycm93cygpLGkub3B0aW9ucy5mYWRlPT09ITA/KGMhPT0hMD8oaS5mYWRlU2xpZGVPdXQoZiksaS5mYWRlU2xpZGUoZSxmdW5jdGlvbigpe2kucG9zdFNsaWRlKGUpfSkpOmkucG9zdFNsaWRlKGUpLHZvaWQgaS5hbmltYXRlSGVpZ2h0KCkpOnZvaWQoYyE9PSEwP2kuYW5pbWF0ZVNsaWRlKGgsZnVuY3Rpb24oKXtpLnBvc3RTbGlkZShlKX0pOmkucG9zdFNsaWRlKGUpKSkpfSxiLnByb3RvdHlwZS5zdGFydExvYWQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2Eub3B0aW9ucy5hcnJvd3M9PT0hMCYmYS5zbGlkZUNvdW50PmEub3B0aW9ucy5zbGlkZXNUb1Nob3cmJihhLiRwcmV2QXJyb3cuaGlkZSgpLGEuJG5leHRBcnJvdy5oaWRlKCkpLGEub3B0aW9ucy5kb3RzPT09ITAmJmEuc2xpZGVDb3VudD5hLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZhLiRkb3RzLmhpZGUoKSxhLiRzbGlkZXIuYWRkQ2xhc3MoXCJzbGljay1sb2FkaW5nXCIpfSxiLnByb3RvdHlwZS5zd2lwZURpcmVjdGlvbj1mdW5jdGlvbigpe3ZhciBhLGIsYyxkLGU9dGhpcztyZXR1cm4gYT1lLnRvdWNoT2JqZWN0LnN0YXJ0WC1lLnRvdWNoT2JqZWN0LmN1clgsYj1lLnRvdWNoT2JqZWN0LnN0YXJ0WS1lLnRvdWNoT2JqZWN0LmN1clksYz1NYXRoLmF0YW4yKGIsYSksZD1NYXRoLnJvdW5kKDE4MCpjL01hdGguUEkpLDA+ZCYmKGQ9MzYwLU1hdGguYWJzKGQpKSw0NT49ZCYmZD49MD9lLm9wdGlvbnMucnRsPT09ITE/XCJsZWZ0XCI6XCJyaWdodFwiOjM2MD49ZCYmZD49MzE1P2Uub3B0aW9ucy5ydGw9PT0hMT9cImxlZnRcIjpcInJpZ2h0XCI6ZD49MTM1JiYyMjU+PWQ/ZS5vcHRpb25zLnJ0bD09PSExP1wicmlnaHRcIjpcImxlZnRcIjplLm9wdGlvbnMudmVydGljYWxTd2lwaW5nPT09ITA/ZD49MzUmJjEzNT49ZD9cImxlZnRcIjpcInJpZ2h0XCI6XCJ2ZXJ0aWNhbFwifSxiLnByb3RvdHlwZS5zd2lwZUVuZD1mdW5jdGlvbihhKXt2YXIgYyxiPXRoaXM7aWYoYi5kcmFnZ2luZz0hMSxiLnNob3VsZENsaWNrPWIudG91Y2hPYmplY3Quc3dpcGVMZW5ndGg+MTA/ITE6ITAsdm9pZCAwPT09Yi50b3VjaE9iamVjdC5jdXJYKXJldHVybiExO2lmKGIudG91Y2hPYmplY3QuZWRnZUhpdD09PSEwJiZiLiRzbGlkZXIudHJpZ2dlcihcImVkZ2VcIixbYixiLnN3aXBlRGlyZWN0aW9uKCldKSxiLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoPj1iLnRvdWNoT2JqZWN0Lm1pblN3aXBlKXN3aXRjaChiLnN3aXBlRGlyZWN0aW9uKCkpe2Nhc2VcImxlZnRcIjpjPWIub3B0aW9ucy5zd2lwZVRvU2xpZGU/Yi5jaGVja05hdmlnYWJsZShiLmN1cnJlbnRTbGlkZStiLmdldFNsaWRlQ291bnQoKSk6Yi5jdXJyZW50U2xpZGUrYi5nZXRTbGlkZUNvdW50KCksYi5zbGlkZUhhbmRsZXIoYyksYi5jdXJyZW50RGlyZWN0aW9uPTAsYi50b3VjaE9iamVjdD17fSxiLiRzbGlkZXIudHJpZ2dlcihcInN3aXBlXCIsW2IsXCJsZWZ0XCJdKTticmVhaztjYXNlXCJyaWdodFwiOmM9Yi5vcHRpb25zLnN3aXBlVG9TbGlkZT9iLmNoZWNrTmF2aWdhYmxlKGIuY3VycmVudFNsaWRlLWIuZ2V0U2xpZGVDb3VudCgpKTpiLmN1cnJlbnRTbGlkZS1iLmdldFNsaWRlQ291bnQoKSxiLnNsaWRlSGFuZGxlcihjKSxiLmN1cnJlbnREaXJlY3Rpb249MSxiLnRvdWNoT2JqZWN0PXt9LGIuJHNsaWRlci50cmlnZ2VyKFwic3dpcGVcIixbYixcInJpZ2h0XCJdKX1lbHNlIGIudG91Y2hPYmplY3Quc3RhcnRYIT09Yi50b3VjaE9iamVjdC5jdXJYJiYoYi5zbGlkZUhhbmRsZXIoYi5jdXJyZW50U2xpZGUpLGIudG91Y2hPYmplY3Q9e30pfSxiLnByb3RvdHlwZS5zd2lwZUhhbmRsZXI9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztpZighKGIub3B0aW9ucy5zd2lwZT09PSExfHxcIm9udG91Y2hlbmRcImluIGRvY3VtZW50JiZiLm9wdGlvbnMuc3dpcGU9PT0hMXx8Yi5vcHRpb25zLmRyYWdnYWJsZT09PSExJiYtMSE9PWEudHlwZS5pbmRleE9mKFwibW91c2VcIikpKXN3aXRjaChiLnRvdWNoT2JqZWN0LmZpbmdlckNvdW50PWEub3JpZ2luYWxFdmVudCYmdm9pZCAwIT09YS5vcmlnaW5hbEV2ZW50LnRvdWNoZXM/YS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMubGVuZ3RoOjEsYi50b3VjaE9iamVjdC5taW5Td2lwZT1iLmxpc3RXaWR0aC9iLm9wdGlvbnMudG91Y2hUaHJlc2hvbGQsYi5vcHRpb25zLnZlcnRpY2FsU3dpcGluZz09PSEwJiYoYi50b3VjaE9iamVjdC5taW5Td2lwZT1iLmxpc3RIZWlnaHQvYi5vcHRpb25zLnRvdWNoVGhyZXNob2xkKSxhLmRhdGEuYWN0aW9uKXtjYXNlXCJzdGFydFwiOmIuc3dpcGVTdGFydChhKTticmVhaztjYXNlXCJtb3ZlXCI6Yi5zd2lwZU1vdmUoYSk7YnJlYWs7Y2FzZVwiZW5kXCI6Yi5zd2lwZUVuZChhKX19LGIucHJvdG90eXBlLnN3aXBlTW92ZT1mdW5jdGlvbihhKXt2YXIgZCxlLGYsZyxoLGI9dGhpcztyZXR1cm4gaD12b2lkIDAhPT1hLm9yaWdpbmFsRXZlbnQ/YS5vcmlnaW5hbEV2ZW50LnRvdWNoZXM6bnVsbCwhYi5kcmFnZ2luZ3x8aCYmMSE9PWgubGVuZ3RoPyExOihkPWIuZ2V0TGVmdChiLmN1cnJlbnRTbGlkZSksYi50b3VjaE9iamVjdC5jdXJYPXZvaWQgMCE9PWg/aFswXS5wYWdlWDphLmNsaWVudFgsYi50b3VjaE9iamVjdC5jdXJZPXZvaWQgMCE9PWg/aFswXS5wYWdlWTphLmNsaWVudFksYi50b3VjaE9iamVjdC5zd2lwZUxlbmd0aD1NYXRoLnJvdW5kKE1hdGguc3FydChNYXRoLnBvdyhiLnRvdWNoT2JqZWN0LmN1clgtYi50b3VjaE9iamVjdC5zdGFydFgsMikpKSxiLm9wdGlvbnMudmVydGljYWxTd2lwaW5nPT09ITAmJihiLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoPU1hdGgucm91bmQoTWF0aC5zcXJ0KE1hdGgucG93KGIudG91Y2hPYmplY3QuY3VyWS1iLnRvdWNoT2JqZWN0LnN0YXJ0WSwyKSkpKSxlPWIuc3dpcGVEaXJlY3Rpb24oKSxcInZlcnRpY2FsXCIhPT1lPyh2b2lkIDAhPT1hLm9yaWdpbmFsRXZlbnQmJmIudG91Y2hPYmplY3Quc3dpcGVMZW5ndGg+NCYmYS5wcmV2ZW50RGVmYXVsdCgpLGc9KGIub3B0aW9ucy5ydGw9PT0hMT8xOi0xKSooYi50b3VjaE9iamVjdC5jdXJYPmIudG91Y2hPYmplY3Quc3RhcnRYPzE6LTEpLGIub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmc9PT0hMCYmKGc9Yi50b3VjaE9iamVjdC5jdXJZPmIudG91Y2hPYmplY3Quc3RhcnRZPzE6LTEpLGY9Yi50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCxiLnRvdWNoT2JqZWN0LmVkZ2VIaXQ9ITEsYi5vcHRpb25zLmluZmluaXRlPT09ITEmJigwPT09Yi5jdXJyZW50U2xpZGUmJlwicmlnaHRcIj09PWV8fGIuY3VycmVudFNsaWRlPj1iLmdldERvdENvdW50KCkmJlwibGVmdFwiPT09ZSkmJihmPWIudG91Y2hPYmplY3Quc3dpcGVMZW5ndGgqYi5vcHRpb25zLmVkZ2VGcmljdGlvbixiLnRvdWNoT2JqZWN0LmVkZ2VIaXQ9ITApLGIub3B0aW9ucy52ZXJ0aWNhbD09PSExP2Iuc3dpcGVMZWZ0PWQrZipnOmIuc3dpcGVMZWZ0PWQrZiooYi4kbGlzdC5oZWlnaHQoKS9iLmxpc3RXaWR0aCkqZyxiLm9wdGlvbnMudmVydGljYWxTd2lwaW5nPT09ITAmJihiLnN3aXBlTGVmdD1kK2YqZyksYi5vcHRpb25zLmZhZGU9PT0hMHx8Yi5vcHRpb25zLnRvdWNoTW92ZT09PSExPyExOmIuYW5pbWF0aW5nPT09ITA/KGIuc3dpcGVMZWZ0PW51bGwsITEpOnZvaWQgYi5zZXRDU1MoYi5zd2lwZUxlZnQpKTp2b2lkIDApfSxiLnByb3RvdHlwZS5zd2lwZVN0YXJ0PWZ1bmN0aW9uKGEpe3ZhciBjLGI9dGhpcztyZXR1cm4gMSE9PWIudG91Y2hPYmplY3QuZmluZ2VyQ291bnR8fGIuc2xpZGVDb3VudDw9Yi5vcHRpb25zLnNsaWRlc1RvU2hvdz8oYi50b3VjaE9iamVjdD17fSwhMSk6KHZvaWQgMCE9PWEub3JpZ2luYWxFdmVudCYmdm9pZCAwIT09YS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMmJihjPWEub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdKSxiLnRvdWNoT2JqZWN0LnN0YXJ0WD1iLnRvdWNoT2JqZWN0LmN1clg9dm9pZCAwIT09Yz9jLnBhZ2VYOmEuY2xpZW50WCxiLnRvdWNoT2JqZWN0LnN0YXJ0WT1iLnRvdWNoT2JqZWN0LmN1clk9dm9pZCAwIT09Yz9jLnBhZ2VZOmEuY2xpZW50WSx2b2lkKGIuZHJhZ2dpbmc9ITApKX0sYi5wcm90b3R5cGUudW5maWx0ZXJTbGlkZXM9Yi5wcm90b3R5cGUuc2xpY2tVbmZpbHRlcj1mdW5jdGlvbigpe3ZhciBhPXRoaXM7bnVsbCE9PWEuJHNsaWRlc0NhY2hlJiYoYS51bmxvYWQoKSxhLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCksYS4kc2xpZGVzQ2FjaGUuYXBwZW5kVG8oYS4kc2xpZGVUcmFjayksYS5yZWluaXQoKSl9LGIucHJvdG90eXBlLnVubG9hZD1mdW5jdGlvbigpe3ZhciBiPXRoaXM7YShcIi5zbGljay1jbG9uZWRcIixiLiRzbGlkZXIpLnJlbW92ZSgpLGIuJGRvdHMmJmIuJGRvdHMucmVtb3ZlKCksYi4kcHJldkFycm93JiZiLmh0bWxFeHByLnRlc3QoYi5vcHRpb25zLnByZXZBcnJvdykmJmIuJHByZXZBcnJvdy5yZW1vdmUoKSxiLiRuZXh0QXJyb3cmJmIuaHRtbEV4cHIudGVzdChiLm9wdGlvbnMubmV4dEFycm93KSYmYi4kbmV4dEFycm93LnJlbW92ZSgpLGIuJHNsaWRlcy5yZW1vdmVDbGFzcyhcInNsaWNrLXNsaWRlIHNsaWNrLWFjdGl2ZSBzbGljay12aXNpYmxlIHNsaWNrLWN1cnJlbnRcIikuYXR0cihcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpLmNzcyhcIndpZHRoXCIsXCJcIil9LGIucHJvdG90eXBlLnVuc2xpY2s9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztiLiRzbGlkZXIudHJpZ2dlcihcInVuc2xpY2tcIixbYixhXSksYi5kZXN0cm95KCl9LGIucHJvdG90eXBlLnVwZGF0ZUFycm93cz1mdW5jdGlvbigpe3ZhciBiLGE9dGhpcztiPU1hdGguZmxvb3IoYS5vcHRpb25zLnNsaWRlc1RvU2hvdy8yKSxhLm9wdGlvbnMuYXJyb3dzPT09ITAmJmEuc2xpZGVDb3VudD5hLm9wdGlvbnMuc2xpZGVzVG9TaG93JiYhYS5vcHRpb25zLmluZmluaXRlJiYoYS4kcHJldkFycm93LnJlbW92ZUNsYXNzKFwic2xpY2stZGlzYWJsZWRcIikuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcImZhbHNlXCIpLGEuJG5leHRBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKSwwPT09YS5jdXJyZW50U2xpZGU/KGEuJHByZXZBcnJvdy5hZGRDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJ0cnVlXCIpLGEuJG5leHRBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKSk6YS5jdXJyZW50U2xpZGU+PWEuc2xpZGVDb3VudC1hLm9wdGlvbnMuc2xpZGVzVG9TaG93JiZhLm9wdGlvbnMuY2VudGVyTW9kZT09PSExPyhhLiRuZXh0QXJyb3cuYWRkQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwidHJ1ZVwiKSxhLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoXCJzbGljay1kaXNhYmxlZFwiKS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwiZmFsc2VcIikpOmEuY3VycmVudFNsaWRlPj1hLnNsaWRlQ291bnQtMSYmYS5vcHRpb25zLmNlbnRlck1vZGU9PT0hMCYmKGEuJG5leHRBcnJvdy5hZGRDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJ0cnVlXCIpLGEuJHByZXZBcnJvdy5yZW1vdmVDbGFzcyhcInNsaWNrLWRpc2FibGVkXCIpLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKSkpfSxiLnByb3RvdHlwZS51cGRhdGVEb3RzPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcztudWxsIT09YS4kZG90cyYmKGEuJGRvdHMuZmluZChcImxpXCIpLnJlbW92ZUNsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKSxhLiRkb3RzLmZpbmQoXCJsaVwiKS5lcShNYXRoLmZsb29yKGEuY3VycmVudFNsaWRlL2Eub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpLmFkZENsYXNzKFwic2xpY2stYWN0aXZlXCIpLmF0dHIoXCJhcmlhLWhpZGRlblwiLFwiZmFsc2VcIikpfSxiLnByb3RvdHlwZS52aXNpYmlsaXR5PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcztkb2N1bWVudFthLmhpZGRlbl0/KGEucGF1c2VkPSEwLGEuYXV0b1BsYXlDbGVhcigpKTphLm9wdGlvbnMuYXV0b3BsYXk9PT0hMCYmKGEucGF1c2VkPSExLGEuYXV0b1BsYXkoKSl9LGIucHJvdG90eXBlLmluaXRBREE9ZnVuY3Rpb24oKXt2YXIgYj10aGlzO2IuJHNsaWRlcy5hZGQoYi4kc2xpZGVUcmFjay5maW5kKFwiLnNsaWNrLWNsb25lZFwiKSkuYXR0cih7XCJhcmlhLWhpZGRlblwiOlwidHJ1ZVwiLHRhYmluZGV4OlwiLTFcIn0pLmZpbmQoXCJhLCBpbnB1dCwgYnV0dG9uLCBzZWxlY3RcIikuYXR0cih7dGFiaW5kZXg6XCItMVwifSksYi4kc2xpZGVUcmFjay5hdHRyKFwicm9sZVwiLFwibGlzdGJveFwiKSxiLiRzbGlkZXMubm90KGIuJHNsaWRlVHJhY2suZmluZChcIi5zbGljay1jbG9uZWRcIikpLmVhY2goZnVuY3Rpb24oYyl7YSh0aGlzKS5hdHRyKHtyb2xlOlwib3B0aW9uXCIsXCJhcmlhLWRlc2NyaWJlZGJ5XCI6XCJzbGljay1zbGlkZVwiK2IuaW5zdGFuY2VVaWQrY30pfSksbnVsbCE9PWIuJGRvdHMmJmIuJGRvdHMuYXR0cihcInJvbGVcIixcInRhYmxpc3RcIikuZmluZChcImxpXCIpLmVhY2goZnVuY3Rpb24oYyl7YSh0aGlzKS5hdHRyKHtyb2xlOlwicHJlc2VudGF0aW9uXCIsXCJhcmlhLXNlbGVjdGVkXCI6XCJmYWxzZVwiLFwiYXJpYS1jb250cm9sc1wiOlwibmF2aWdhdGlvblwiK2IuaW5zdGFuY2VVaWQrYyxpZDpcInNsaWNrLXNsaWRlXCIrYi5pbnN0YW5jZVVpZCtjfSl9KS5maXJzdCgpLmF0dHIoXCJhcmlhLXNlbGVjdGVkXCIsXCJ0cnVlXCIpLmVuZCgpLmZpbmQoXCJidXR0b25cIikuYXR0cihcInJvbGVcIixcImJ1dHRvblwiKS5lbmQoKS5jbG9zZXN0KFwiZGl2XCIpLmF0dHIoXCJyb2xlXCIsXCJ0b29sYmFyXCIpLGIuYWN0aXZhdGVBREEoKX0sYi5wcm90b3R5cGUuYWN0aXZhdGVBREE9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO2EuJHNsaWRlVHJhY2suZmluZChcIi5zbGljay1hY3RpdmVcIikuYXR0cih7XCJhcmlhLWhpZGRlblwiOlwiZmFsc2VcIn0pLmZpbmQoXCJhLCBpbnB1dCwgYnV0dG9uLCBzZWxlY3RcIikuYXR0cih7dGFiaW5kZXg6XCIwXCJ9KX0sYi5wcm90b3R5cGUuZm9jdXNIYW5kbGVyPWZ1bmN0aW9uKCl7dmFyIGI9dGhpcztiLiRzbGlkZXIub24oXCJmb2N1cy5zbGljayBibHVyLnNsaWNrXCIsXCIqXCIsZnVuY3Rpb24oYyl7Yy5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTt2YXIgZD1hKHRoaXMpO3NldFRpbWVvdXQoZnVuY3Rpb24oKXtiLmlzUGxheSYmKGQuaXMoXCI6Zm9jdXNcIik/KGIuYXV0b1BsYXlDbGVhcigpLGIucGF1c2VkPSEwKTooYi5wYXVzZWQ9ITEsYi5hdXRvUGxheSgpKSl9LDApfSl9LGEuZm4uc2xpY2s9ZnVuY3Rpb24oKXt2YXIgZixnLGE9dGhpcyxjPWFyZ3VtZW50c1swXSxkPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKSxlPWEubGVuZ3RoO2ZvcihmPTA7ZT5mO2YrKylpZihcIm9iamVjdFwiPT10eXBlb2YgY3x8XCJ1bmRlZmluZWRcIj09dHlwZW9mIGM/YVtmXS5zbGljaz1uZXcgYihhW2ZdLGMpOmc9YVtmXS5zbGlja1tjXS5hcHBseShhW2ZdLnNsaWNrLGQpLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBnKXJldHVybiBnO3JldHVybiBhfX0pOyJdLCJzb3VyY2VSb290IjoiIn0=