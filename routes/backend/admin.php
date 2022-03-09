<?php

use App\Http\Controllers\Backend\DashboardController;
use App\Http\Controllers\Backend\Content\InvoiceController;
use App\Http\Controllers\Backend\Content\SettingController;
use App\Http\Controllers\Backend\Content\OrderController;
use App\Http\Controllers\Backend\Content\TaxonomyController;

// All route names are prefixed with 'admin.'.
Route::redirect('/', '/admin/dashboard', 301);
Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::get('export/{table}', [DashboardController::class, 'export'])->name('export');

Route::namespace('Content')->group(function () {
  Route::get('product/trashed', 'ProductController@trashed')->name('product.trashed');
  Route::get('product/restore/{post}', 'ProductController@restore')->name('product.restore');
  Route::get('product/restore/{post}', 'ProductController@restore')->name('product.restore');
  Route::resource('product', 'ProductController')->except('create', 'show');

  Route::get('order/restore/{order}', [OrderController::class, 'restore'])->name('order.restore');
  Route::get('makeAsPayment/{order}', [OrderController::class, 'makeAsPayment'])->name('order.makeAsPayment');
  Route::get('order/wallet', [OrderController::class, 'walletOrders'])->name('order.wallet');
  Route::get('order/wallet/{id}', [OrderController::class, 'walletDetails'])->name('order.wallet.details');

  Route::get('order-item/edit/{id}', [OrderController::class, 'show_details'])->name('order.item.edit');
  Route::post('order/change/status/{id}', [OrderController::class, 'changeStatus'])->name('order.change.status');
  Route::post('order/coupon-update/{id}', [OrderController::class, 'updateCoupon'])->name('order.coupon.update');
  Route::post('order/deposit-update/{id}', [OrderController::class, 'depositCoupon'])->name('order.deposit.update');
  Route::resource('order', 'OrderController');

  Route::get('invoice/trashed', 'InvoiceController@trashed')->name('invoice.trashed');
  Route::get('invoice/restore/{invoice}', 'InvoiceController@restore')->name('invoice.restore');
  Route::get('invoice/confirm-received/{invoice}', [InvoiceController::class, 'confirm_received'])->name('invoice.confirm.received');
  Route::get('invoice/details/{invoice}', [InvoiceController::class, 'details'])->name('invoice.details');
  Route::post('invoice/generate/prepare', [InvoiceController::class, 'generatePrepare']); // ajax
  Route::resource('invoice', 'InvoiceController');

  Route::get('coupon/trashed', 'CouponController@trashed')->name('coupon.trashed');
  Route::get('coupon/restore/{customer}', 'CouponController@restore')->name('coupon.restore');
  Route::get('coupon/log', 'CouponController@couponLog')->name('coupon.log');
  Route::resource('coupon', 'CouponController');

  Route::get('customer/trashed', 'CustomerController@trashed')->name('customer.trashed');
  Route::get('customer/restore/{customer}', 'CustomerController@restore')->name('customer.restore');
  Route::resource('customer', 'CustomerController');

  Route::post('get-slug-from-title', 'PageController@get_slug_from_title');
  Route::get('page/trashed', 'PageController@trashed')->name('page.trashed');
  Route::get('page/restore/{page}', 'PageController@restore')->name('page.restore');
  Route::post('editor/image-upload', 'PageController@editor_image_upload');
  Route::resource('page', 'PageController');

  Route::get('/refresh/root/taxonomy', [TaxonomyController::class, 'refresh_root_taxonomy'])->name("refresh.root.taxonomy");



  Route::get('taxonomy/trashed', 'TaxonomyController@trashed')->name('taxonomy.trashed');
  Route::get('taxonomy/restore', 'TaxonomyController@restore')->name('taxonomy.restore');

  Route::post('taxonomy/make-top', [TaxonomyController::class, 'makeAsTop']);
  Route::post('taxonomy/make-active', [TaxonomyController::class, 'makeActive']);
  Route::post('taxonomy/make-delete', [TaxonomyController::class, 'makeDelete']);

  Route::resource('taxonomy', 'TaxonomyController');


  Route::resource('contact', 'ContactController')->except('create', 'store');


  Route::get('faq/trashed', 'FaqController@trashed')->name('faq.trashed');
  Route::get('faq/restore/{faq}', 'FaqController@restore')->name('faq.restore');
  Route::resource('faq', 'FaqController');

  Route::get('announcement/trashed', 'AnnouncementController@trashed')->name('announcement.trashed');
  Route::get('announcement/restore/{faq}', 'AnnouncementController@restore')->name('announcement.restore');
  Route::resource('announcement', 'AnnouncementController');

  Route::get('banner/trashed', 'BannerController@trashed')->name('banner.trashed');
  Route::get('banner/restore/{faq}', 'BannerController@restore')->name('banner.restore');
  Route::resource('banner', 'BannerController');


  Route::group(['prefix' => 'setting', 'as' => 'setting.'], function () {
    Route::get('price', [SettingController::class, 'price'])->name('price');
    Route::get('limit', [SettingController::class, 'limit'])->name('limit');
    Route::post('limitationStore', [SettingController::class, 'limitationStore'])->name('limitationStore');

    Route::get('message', [SettingController::class, 'message'])->name('message');
    Route::post('message-store', [SettingController::class, 'messageStore'])->name('message.store');

    Route::post('airShippingStore', [SettingController::class, 'airShippingStore'])->name('airShippingStore');
    Route::post('logo-store', [SettingController::class, 'logoStore'])->name('logoStore');
    Route::post('social-store', [SettingController::class, 'socialStore'])->name('socialStore');
    Route::get('general', [SettingController::class, 'general'])->name('general');

    Route::post('short-message', [SettingController::class, 'shortMessageStore'])->name('short.message.store');


    Route::get('cache-control', [SettingController::class, 'cacheControl'])->name('cache.control');
    Route::post('cache-control-store', [SettingController::class, 'cacheClear'])->name('cache.control.store');
  });

  Route::group(['prefix' => 'front-setting', 'as' => 'front-setting.'], function () {
    Route::get('top-notice', [SettingController::class, 'topNoticeCreate'])->name('topNotice.create');
    Route::post('top-notice', [SettingController::class, 'topNoticeStore'])->name('topNotice.store');

    Route::get('three-col-banner', [SettingController::class, 'threeColumnBanner'])->name('three.col.banner');
    Route::post('three-col-banner', [SettingController::class, 'bannerRightStore'])->name('three.col.banner.store');

    Route::get('image-loader', [SettingController::class, 'createImageLoader'])->name('image.loading.create');
    Route::post('image-loader', [SettingController::class, 'storeImageLoader'])->name('image.loading.store');
  });
});
