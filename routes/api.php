<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\ApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/



Route::middleware('auth:api')->group(function () {

  Route::get('user', [ApiController::class, 'user'])->name('user');
  Route::get('categories', [ApiController::class, 'categories'])->name('categories');
  Route::get('subcategories', [ApiController::class, 'subcategories'])->name('subcategories');
  Route::get('search', [ApiController::class, 'search_items'])->name('search');
  Route::get('GetItemFullInfo', [ApiController::class, 'GetItemFullInfo'])->name('GetItemFullInfo');
  Route::get('GetItemDescription', [ApiController::class, 'GetItemDescription'])->name('GetItemDescription');
  Route::get('getSellerInformation', [ApiController::class, 'getSellerInformation'])->name('getSellerInformation');

});