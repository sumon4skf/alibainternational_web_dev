const mix = require("laravel-mix");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.setPublicPath("public")
  .setResourceRoot("../") // Turns assets paths in css relative to css file
  .sass("resources/sass/frontend/library.scss", "css/lib.css")
  .sass("resources/sass/frontend/app.scss", "css/app.css")
  .combine(
    [
      "resources/assets/plugins/animate/animate.min.css",
      "resources/assets/plugins/magnific/css/magnific-popup.css",
      "resources/assets/plugins/owlCarousel/css/owl.carousel.min.css",
      "resources/assets/plugins/owlCarousel/css/owl.theme.default.min.css"
    ],
    "public/css/plugins.css"
  )
  .combine(
    [
      "resources/assets/plugins/slick/css/slick.min.css",
      "resources/assets/plugins/slick/css/slick-theme.css"
    ],
    "public/css/product.css"
  )
  .sass("resources/sass/backend/app.scss", "css/backend.css")
  .js("resources/js/frontend/library.js", "js/lib.js")
  .js("resources/js/frontend/app.js", "js/app.js")
  .js(
    [
      "resources/js/backend/before.js",
      "resources/js/backend/app.js",
      "resources/js/backend/after.js"
    ],
    "js/backend.js"
  )
  .js(
    [
      "resources/assets/plugins/lazyload/jquery.lazy.min.js",
      "resources/assets/plugins/waypoints/js/waypoints.min.js",
      "resources/assets/plugins/parallax/js/parallax.js",
      "resources/assets/plugins/jqueryDd/js/jquery.dd.min.js",
      "resources/assets/plugins/magnific/js/magnific-popup.min.js",
      "resources/assets/plugins/owlCarousel/js/owl.carousel.min.js",
      "resources/assets/plugins/pluginScripts.js"
    ],
    "public/js/plugins.js"
  )
  .js(
    [
      "resources/assets/plugins/slick/js/slick.min.js",
      "resources/assets/plugins/elevatezoom/js/jquery.elevatezoom.js",
      "resources/assets/plugins/productScripts.js"
    ],
    "public/js/product.js"
  )
  .extract([
    // Extract packages from node_modules to vendor.js
    "jquery",
    "popper.js",
    "bootstrap"
  ])
  .sourceMaps();

if (mix.inProduction()) {
  mix.setPublicPath("public")
    .setResourceRoot("../")
    .version();
} else {
  // Uses inline source-maps on development
  mix.webpackConfig({
    devtool: "inline-source-map"
  });
}
