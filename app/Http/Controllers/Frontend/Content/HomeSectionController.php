<?php

namespace App\Http\Controllers\Frontend\Content;

use App\Http\Controllers\Controller;
use App\Models\Content\Frontend\Wishlist;
use App\Models\Content\OrderItem;
use App\Models\Content\RecentProducts;
use Illuminate\Support\Facades\Cookie;

class HomeSectionController extends Controller
{
  public function recent_view_section()
  {
    $view_uid = Cookie::get('recent_view_uid');
    $products = RecentProducts::latest();
    $products = $view_uid ? $products->where('recent_view_uid', $view_uid) : $products;
    $products = $products->limit(15)->get();
    return view('frontend.ajaxComponent.homeSection', compact('products'))->render();
  }

  public function new_arrived_section()
  {
    $products = RecentProducts::orderByDesc('id')->limit(15)->get();
    return view('frontend.ajaxComponent.homeSection', compact('products'))->render();
  }

  public function just_ordered()
  {
    $items = OrderItem::whereHas('order', function ($order) {
      $order->whereNotIn('status', ['Waiting for Payment', 'canceled', 'refunded']);
    })
      ->select('product_id')
      ->latest()
      ->limit(100)
      ->groupBy('product_id')
      ->pluck('product_id')
      ->toArray();
    $products = RecentProducts::whereIn('id', $items)->latest()->limit(15)->get();
    return view('frontend.ajaxComponent.homeSection', compact('products'))->render();
  }

  public function someone_loved()
  {
    $items = Wishlist::select('ItemId')->latest()->limit(100)->groupBy('ItemId')->pluck('ItemId')->toArray();;
    $products = RecentProducts::whereIn('ItemId', $items)->latest()->limit(15)->get();
    return view('frontend.ajaxComponent.homeSection', compact('products'))->render();
  }

  public function someone_buying()
  {
    $items = OrderItem::select('product_id')
      ->latest()
      ->limit(100)
      ->groupBy('product_id')
      ->pluck('product_id')
      ->toArray();
    $products = RecentProducts::whereIn('id', $items)->latest()->limit(15)->get();
    return view('frontend.ajaxComponent.homeSection', compact('products'))->render();
  }


  public function sectionProductLoading()
  {
    $section = request('section');
    $data = '';
    if ($section == 'recent_view_section') {
      $data = $this->recent_view_section();
    } else if ($section == 'new_arrived_section') {
      $data = $this->new_arrived_section();
    } else if ($section == 'just_ordered') {
      $data = $this->just_ordered();
    } else if ($section == 'someone_loved') {
      $data = $this->someone_loved();
    } else if ($section == 'someone_buying') {
      $data = $this->someone_buying();
    }

    return response(['html' => $data]);
  }


  public function relatedProductLoading()
  {
    $ItemId = request('ItemId');
    $CategoryId = request('CategoryId');
    $products = RecentProducts::where('CategoryId', $CategoryId)
      ->whereNotIn('ItemId', [$ItemId])
      ->latest()->limit(15)->get();
    if (!count($products)) {
      $products = RecentProducts::whereNotIn('ItemId', [$ItemId])
        ->latest()->limit(15)->get();
    }
    $data = view('frontend.ajaxComponent.homeSection', compact('products'))->render();
    return response(['html' => $data]);
  }
}
