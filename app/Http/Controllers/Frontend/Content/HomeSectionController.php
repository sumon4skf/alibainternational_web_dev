<?php

namespace App\Http\Controllers\Frontend\Content;

use App\Http\Controllers\Controller;
use App\Models\Content\OrderItem;
use App\Models\Content\Product;
use App\Models\Content\RecentProducts;
use Illuminate\Http\Request;

class HomeSectionController extends Controller
{

  public function recent_view_section()
  {
    $products = RecentProducts::latest()->limit(15)->get();
    return view('frontend.ajaxComponent.homeSection', compact('products'))->render();
  }

  public function new_arrived_section()
  {
    $products = RecentProducts::latest()->limit(15)->get();
    return view('frontend.ajaxComponent.homeSection', compact('products'))->render();
  }

  public function just_ordered()
  {
    $orderItem = OrderItem::select('product_id')->groupBy('product_id')->pluck('product_id')->toArray();
    $products = Product::whereIn('id', $orderItem)->latest()->limit(15)->get();
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
    }

    return response(['html' => $data]);
  }
}
