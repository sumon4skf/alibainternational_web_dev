<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiCallLog;
use Illuminate\Http\Request;

class ApiController extends Controller
{

  public function user()
  {
    $user = \request()->user();
    return response()->json($user);
  }


  public function categories()
  {
    $user = \request()->user();
    $categories = otc_category_list();
    if ($categories) {
      ApiCallLog::create([
        'user_id' => $user->id,
        'type' => 'category',
        'function_name' => 'categories',
      ]);
    }
    return response()->json($categories);
  }

  public function subcategories()
  {
    $user = \request()->user();
    $cat_id = \request('cat_id');
    if ($cat_id) {
      $subcategories = otc_sub_category_list($cat_id);
      if ($subcategories) {
        ApiCallLog::create([
          'user_id' => $user->id,
          'type' => 'subcategories',
          'function_name' => 'subcategories',
        ]);
      }
    } else {
      $subcategories = [];
    }
    return response()->json($subcategories);
  }

  public function search_items()
  {
    $user = \request()->user();
    $search = \request('search');
    $type = \request('type');
    $offset = \request('offset', 1);
    $limit = \request('limit', 25);
    if ($search) {
      $items = otc_search_items($search, $type, $offset, $limit);
      if (count($items)) {
        ApiCallLog::create([
          'user_id' => $user->id,
          'type' => $type ? $type : 'plain',
          'function_name' => 'search_items',
        ]);
      }
    } else {
      $items = [];
    }

    return response()->json($items);
  }

  public function GetItemFullInfo()
  {
    $user = \request()->user();
    $item_id = \request('item_id');
    if ($item_id) {
      $item = otc_items_full_info($item_id);
      if (count($item)) {
        ApiCallLog::create([
          'user_id' => $user->id,
          'type' => 'fullInfo',
          'function_name' => 'GetItemFullInfo',
        ]);
      }
    } else {
      $item = [];
    }

    return response()->json($item);
  }

  public function GetItemDescription()
  {
    $user = \request()->user();
    $item_id = \request('item_id');
    if ($item_id) {
      $item = getDescription($item_id);
      if ($item) {
        ApiCallLog::create([
          'user_id' => $user->id,
          'type' => 'description',
          'function_name' => 'GetItemDescription',
        ]);
      }
    } else {
      $item = [];
    }
    return response()->json($item);
  }

  public function getSellerInformation()
  {
    $user = \request()->user();
    $vendorId = \request('vendorId');
    if ($vendorId) {
      $item = getSellerInformation($vendorId);
      if ($item) {
        ApiCallLog::create([
          'user_id' => $user->id,
          'type' => 'seller info',
          'function_name' => 'getSellerInformation',
        ]);
      }
    } else {
      $item = [];
    }
    return response()->json($item);
  }


}
