<?php

use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\AjaxController;
use App\Http\Controllers\Frontend\User\AccountController;
use App\Http\Controllers\Frontend\User\DashboardController;
use App\Http\Controllers\Frontend\User\ProfileController;
use App\Http\Controllers\SslCommerzPaymentController;

use App\Http\Controllers\Frontend\Content\AddressController;
use App\Http\Controllers\Frontend\Content\WishlistController;
use App\Http\Controllers\Frontend\Auth\OtpLoginController;

use App\Http\Controllers\PaymentNagadController;
use App\Http\Controllers\BkashPaymentController;
use App\Http\Controllers\Frontend\Content\HomeSectionController;
use App\Http\Controllers\SManagerPaymentController;
use Illuminate\Support\Facades\Route;

/*
 * Frontend Controllers
 * All route names are prefixed with 'frontend.'.
 */

Route::get('/', [HomeController::class, 'index'])->name('index');
Route::post('picture-search', [HomeController::class, 'pictureSearch'])->name('pictureSearch');
Route::get('search', [HomeController::class, 'search'])->name('search');

Route::get('contact-us', [ContactController::class, 'index'])->name('contact');
Route::post('contact/send', [ContactController::class, 'send'])->name('contact.send');

Route::get('about-us', [HomeController::class, 'aboutUs'])->name('aboutUs');
Route::get('faqs', [HomeController::class, 'faqs'])->name('faqs');

Route::get('shop-now', [HomeController::class, 'shopNow'])->name('shopNow');
// Route::get('compare', [HomeController::class, 'compare'])->name('compare');


Route::group(['middleware' => ['auth']], function () {
  Route::get('checkout', [HomeController::class, 'shoppingCart'])->name('shoppingCart');
  Route::get('payment', [HomeController::class, 'payment'])->name('payment');
});

Route::get('product/{item}', [HomeController::class, 'productDetails'])->name('product');


Route::group(['as' => 'ajax.', 'prefix' => 'ajax'], function () {
  Route::post('load-product-details', [AjaxController::class, 'getItemPrice'])->name('getItemPrice');
  Route::post('Qllmw4OadnItXxXdD3jXaYyANGXfARf6cPZ4Lboc', [AjaxController::class, 'getItemDescription'])->name('getItemDescription');
  Route::post('load-seller-info', [AjaxController::class, 'getItemSellerInformation'])->name('getItemSellerInformation');
  Route::post('update-customer-cart', [AjaxController::class, 'LoadCustomerCart']);

  Route::post('LZPhsFSUice8hB5rYzNHuLZmmG5pJYcdNeH', [AjaxController::class, 'subscribeEmail'])->name('subscribeEmail');
  Route::post('DK4iSC8EJDqU6xtKgZRvilrraTQjlxwS9sN', [AjaxController::class, 'noticeMarkUnread'])->name('noticeMarkUnread');
  Route::post('m8sBOYY33Vp9JTD8h2ksp58snyvRHHXPF0h', [AjaxController::class, 'couponCodeValidate']);

  Route::post('LHZLLfEpaQVdK0qCYDletmxqfKmklEXMr5m', [OtpLoginController::class, 'loginWithOtp']); // login with otp
  Route::post('IEMsZPlg72Adiuc1pSVrkI6iiUzKXWykNhd', [OtpLoginController::class, 'OtpCodeVerify']); // login with otp

  Route::post('m8sBOYY33Vp9JTD8h2ksp58snyvRHHXPF0h', [AjaxController::class, 'couponCodeValidate']);

  Route::group(['middleware' => 'auth', 'as' => 'customer.'], function () {
    // edit address
    Route::get('address/edit/{address}', [AddressController::class, 'edit'])->name('address.edit');
    Route::patch('address/update/{address}', [AddressController::class, 'update'])->name('address.update');

    Route::post('address-show', [AddressController::class, 'show'])->name('address.show');
    Route::post('address-store-default', [AddressController::class, 'storeDefault'])->name('address.store.default');
    Route::post('address', [AddressController::class, 'store'])->name('address.store');
    Route::post('delete', [AddressController::class, 'destroy'])->name('address.delete');

    Route::post('order-confirm', [AjaxController::class, 'orderConfirm'])->name('order.confirm');

    Route::post('s-manager-payment', [SManagerPaymentController::class, 'initial_payment'])->name('smanager.initial');
    Route::post('invoice-cash-payment', [AjaxController::class, 'invoiceCashPayment']);
  });

  // section data 
  Route::post('section/data', [HomeSectionController::class, 'sectionProductLoading']);
  Route::post('section/related', [HomeSectionController::class, 'relatedProductLoading']);
});


/*
 * These frontend controllers require the user to be logged in
 * All route names are prefixed with 'frontend.'
 * These routes can not be hit if the password is expired
 */
Route::group(['middleware' => ['auth']], function () {
  Route::group(['namespace' => 'User', 'as' => 'user.'], function () {
    // User Dashboard Specific
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('notification', [DashboardController::class, 'notification'])->name('notification');

    // manage order information
    Route::get('order-details/{tranId}', [DashboardController::class, 'orderDetails'])->name('order-details');
    Route::get('failed-order-pay-now/{tranId}', [DashboardController::class, 'failedOrderPayNow'])->name('failedOrderPayNow');

    // manage Invoice information
    Route::get('invoice-details/{invoice_id}', [DashboardController::class, 'invoiceDetails'])->name('invoice-details');
    Route::get('invoice-pay-now/{tranId}', [DashboardController::class, 'invoicePayNow'])->name('invoice.payNow');


    // User Account Specific
    Route::get('account', [AccountController::class, 'index'])->name('account');
    Route::get('update-information', [AccountController::class, 'updateInformation'])->name('update.information');
    Route::post('update-information', [AccountController::class, 'updateInformationStore'])->name('update.information.store');

    // User Profile Specific
    Route::patch('profile/update', [ProfileController::class, 'update'])->name('profile.update');

    // show user wishlist
    Route::get('wishlist', [WishlistController::class, 'index'])->name('wishlist.index');

    // user wishlist updated
    Route::post('wishlist/store', [WishlistController::class, 'store'])->name('wishlist.store');
    Route::post('wishlist/count-wishlist', [WishlistController::class, 'show'])->name('wishlist.show');
    Route::get('wishlist-remove/{wishlist}', [WishlistController::class, 'remove'])->name('wishlist.remove');
  });
});


// nagad payment process
Route::post('nagad-payment-process', [PaymentNagadController::class, 'payment_process']);
Route::get('nagad/callback', [PaymentNagadController::class, 'nagad_payment_varify']);


// bkash payment process
Route::get('bkash/payment', [BkashPaymentController::class, 'bkash_payment_process']);
Route::get('bkash/success', [BkashPaymentController::class, 'bkash_success']);
Route::get('bkash/failed', [BkashPaymentController::class, 'bkash_failed']);

Route::post('bkash/token', [BkashPaymentController::class, 'bkashToken']);
Route::get('bkash/checkout', [BkashPaymentController::class, 'createPayment']);
Route::get('bkash/execute', [BkashPaymentController::class, 'executePayment']);


// smanager payment gateway
Route::get('smanager/payment/success/{tran_id}', [SManagerPaymentController::class, 'success']);
Route::get('smanager/payment/fail/{tran_id}', [SManagerPaymentController::class, 'fail']);

// SSLCOMMERZ Start
Route::post('pay-invoice-due', [SslCommerzPaymentController::class, 'payInvoiceDue']);
Route::post('sslcommerz/payment', [SslCommerzPaymentController::class, 'index']);
Route::post('/pay-via-ajax', [SslCommerzPaymentController::class, 'payViaAjax']);
Route::post('/success', [SslCommerzPaymentController::class, 'success']);
Route::post('/fail', [SslCommerzPaymentController::class, 'fail']);
Route::post('/cancel', [SslCommerzPaymentController::class, 'cancel']);
Route::post('/ipn', [SslCommerzPaymentController::class, 'ipn']);
//SSLCOMMERZ END


// Route::get('get-support-id', function () {
//   $sid = NagadPayment::tnxID(1)
//     ->amount(100)
//     ->getSupportID();
//   return $sid;
// });
