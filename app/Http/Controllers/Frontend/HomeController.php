<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Traits\OtcApiHandling;
use App\Models\Content\Post;
use App\Models\Content\Product;
use App\Models\Content\RecentProducts;
use App\Models\Content\SearchLog;
use App\Models\Content\Taxonomy;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Illuminate\Support\Str;

/**
 * Class HomeController.
 */
class HomeController extends Controller
{
  use OtcApiHandling;
  /**
   * @return \Illuminate\View\View
   */
  public function index()
  {
    $cookie_announced = Cookie::get('_announce');
    if (!$cookie_announced) {
      Cookie::queue('_announce', 'read_announce', 10);
      $announcement = Post::where('post_type', 'announcement')
        ->where('post_status', 'publish')
        ->latest()
        ->first();
    } else {
      $announcement = null;
    }

    $banners = Post::where('post_type', 'banner')->where('post_status', 'publish')->limit(5)->latest()->get();

    return view('frontend.index', compact('announcement',  'banners'));
  }

  public function category($slug)
  {
    $page = Post::where('post_type', 'page')
      ->where('post_slug', trim($slug))
      ->where('post_status', 'publish')->first();

    if ($page) {
      return view('frontend.pages.page', compact('page'));
    }
    $category = Taxonomy::where('slug', trim($slug))->withCount('children')->firstOrFail();
    if (!$category->children_count) {
      $subcategory = null;
      $search = $category->keyword ? $category->keyword : $category->name;
      $items = $this->getBulkProductItems($search, 'text');

      return view('frontend.categoryProductList', compact('category', 'subcategory', 'items'));
    }
    $children = $category->children ?? [];
    return view('frontend.categoryList', compact('category', 'children'));
  }


  public function categoryProductList($cat_slug, $subcat_slug)
  {
    $category = Taxonomy::where('slug', $cat_slug)->first();
    $subcategory = Taxonomy::where('slug', $subcat_slug)->first();

    if (!$category && !$subcategory) {
      abort(404);
    }

    $search = $subcategory->keyword ? $subcategory->keyword : $subcategory->name;
    $items = $this->getBulkProductItems($search, 'text');

    return view('frontend.categoryProductList', compact('category', 'subcategory', 'items'));
  }


  public function subSubCategoryProductList($cat_slug, $subcat_slug, $subSubcat_slug)
  {
    $category = Taxonomy::where('slug', $cat_slug)->firstOrFail();
    $subcategory = Taxonomy::where('ParentId', $category->otc_id)->where('slug', $subcat_slug)->firstOrFail();
    $subSubcategory = Taxonomy::where('slug', $subSubcat_slug)->firstOrFail();

    $search = $subSubcategory->keyword ? $subSubcategory->keyword : $subSubcategory->name;
    $items = $this->getBulkProductItems($search, 'text');

    return view('frontend.categoryProductList', compact('category', 'subcategory', 'subSubcategory', 'items'));
  }


  public function pictureSearch()
  {
    $resData['status'] = false;
    if (request()->ajax()) {
      if (request()->hasFile('picture')) {
        $picture = request()->file('picture');
        $saveDirectory = 'search/' . date('Y-m-d');
        $prefix = 'de-' . time();
        $search = store_search_picture($picture, $saveDirectory, $prefix);

        $searchId = uniqid();
        $log = SearchLog::create([
          'search_id' => $searchId,
          'search_type' => 'picture',
          'query_data' => $search,
          'user_id' => auth()->check() ? auth()->id() : null
        ]);
        if ($log) {
          $resData['status'] = true;
          $resData['href'] = url('/search?s=' . $searchId);
        }
      }
    }

    return response()->json($resData);
  }


  public function search()
  {
    $search = request('s');
    $searchLog = SearchLog::where('search_id', $search)->first();
    $type = 'text';
    if ($searchLog) {
      $type = $searchLog->search_type ?? '';
      if ($type == 'picture') {
        $search = asset($searchLog->query_data);
        // $search = 'https://www.dearbd.com/storage/search/2022-02-14/de-1644857113.jpg';
      }
    }

    $items = $this->getBulkProductItems($search, $type);

    return view('frontend.searchList', compact('items', 'searchLog'));
  }


  public function productDetails($item_id)
  {
    $product = RecentProducts::where('ItemId', $item_id)->first();
    if ($product) {
      $created = Carbon::parse($product->created_at)->addDays(5);
      $current = now();
      if ($current > $created) {
        $product = null;
      }
    }

    $view_uid = Cookie::get('recent_view_uid');
    if (!$view_uid) {
      $view_uid = Str::random(60);
      Cookie::queue('recent_view_uid', $view_uid, 43200);
    }

    if (!$product) {
      $item = GetItemFullInfo($item_id);
      $product = $this->updateOrInsertRecentProducts($item, $view_uid);
    } else {
      $product->update([
        'recent_view_uid' => $view_uid,
        'created_at' => now(),
      ]);
    }

    if (!$product) {
      abort(404);
    }

    $Pictures = json_decode($product->Pictures, true);

    $wishList = auth()->check() ? auth()->user()->wishlist : null;
    $exit_wishList = null;
    if ($wishList) {
      $exit_wishList = $wishList->contains('ItemId', $product->ItemId);
    }

    $page = Post::where('post_slug', 'shipping-and-delivery')
      ->where('post_status', 'publish')
      ->where('post_type', 'page')
      ->first();

    return view('frontend.productDetails', compact('product', 'exit_wishList', 'page', 'Pictures'));
  }

  public function shopNow()
  {
    $recentProducts = Product::latest()->paginate(32);
    // dd($recentProducts);
    return view('frontend.shopNow', compact('recentProducts'));
  }


  public function compare()
  {
    return view('frontend.compare');
  }

  public function shoppingCart()
  {
    return view('frontend.shoppingCart');
  }

  public function payment()
  {
    return view('frontend.payment');
  }


  public function faqs()
  {
    return view('frontend.pages.faqs', [
      'faqs' => Post::wherePostType('faq')->wherePostStatus('publish')->oldest()->get(),
    ]);
  }


  public function aboutUs()
  {
    return view('frontend.pages.about-us', [
      'about' => Post::wherePostType('page')->wherePostSlug('about-us')->firstOrFail(),
    ]);
  }



  public function getBulkProductItems($search, $type)
  {
    $page = request('page', 0);
    $offset = $page * 35;
    $limit = 35;
    $resData = AvanctecaSearchItemsFrame($search, $type, $offset, $limit);
    $TotalCount = getArrayKeyData($resData, 'TotalCount', 0);
    $Contents = getArrayKeyData($resData, 'Content', []);
    return new Paginator($Contents, $TotalCount, $limit, $page, [
      'path'  => request()->url(),
      'query' => request()->query(),
      'onEachSide' => 1,
    ]);
  }
}
