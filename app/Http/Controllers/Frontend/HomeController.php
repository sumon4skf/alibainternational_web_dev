<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Content\Frontend\CustomerCart;
use App\Models\Content\Frontend\Wishlist;
use App\Models\Content\OrderItem;
use App\Models\Content\Post;
use App\Models\Content\Product;
use App\Models\Content\SearchLog;
use App\Models\Content\Taxonomy;
use Auth;
use Illuminate\Http\File;
use Illuminate\Support\Facades\Crypt;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;

/**
 * Class HomeController.
 */
class HomeController extends Controller
{
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
    // $this->apiTestingDeveloping();
    $all_taxonomies = get_all_taxonomies();
    $top_cats = $all_taxonomies->whereNotNull('is_top')
      ->whereNotNull('active')
      ->sortBy('id');
    $banners = Post::where('post_type', 'banner')->where('post_status', 'publish')->limit(5)->latest()->get();
    $recentProducts = Product::latest()->paginate(30);
    $recentOrders = OrderItem::with('product')->select('product_id')->groupBy('product_id')->latest()->paginate(30);
    $wishlistProducts = Wishlist::withTrashed()->with('product')->select('ItemId')->groupBy('ItemId')->latest()->paginate(30);
    $someoneBuying = CustomerCart::withTrashed()->with('product')->select('ItemId')->groupBy('ItemId')->latest()->paginate(30);

    return view('frontend.index', compact('announcement', 'top_cats', 'banners', 'recentProducts', 'recentOrders', 'wishlistProducts', 'someoneBuying'));
  }

  public function category($slug)
  {
    $page = Post::where('post_type', 'page')
      ->where('post_slug', trim($slug))
      ->where('post_status', 'publish')->first();

    if ($page) {
      return view('frontend.pages.page', compact('page'));
    }
    $taxonomies = get_all_taxonomies();
    $category = $taxonomies->where('slug', trim($slug))->first();

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
    $taxonomies = get_all_taxonomies();
    $category = $taxonomies->where('slug', $cat_slug)->first();
    $subcategory = $taxonomies->where('slug', $subcat_slug)->first();

    if (!$category && !$subcategory) {
      abort(404);
    }

    $search = $subcategory->keyword ? $subcategory->keyword : $subcategory->name;
    $items = $this->getBulkProductItems($search, 'text');

    return view('frontend.categoryProductList', compact('category', 'subcategory', 'items'));
  }


  public function subSubCategoryProductList($cat_slug, $subcat_slug, $subSubcat_slug)
  {
    $taxonomies = get_all_taxonomies();

    $category = $taxonomies->where('slug', $cat_slug)->first();
    if (!$category) {
      abort(404);
    }
    $subcategory = $taxonomies->where('ParentId', $category->otc_id)->where('slug', $subcat_slug)->first();
    $subSubcategory = $taxonomies->where('slug', $subSubcat_slug)->first();

    if (!$subcategory && !$subSubcategory) {
      abort(404);
    }

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
    $item = Product::where('ItemId', $item_id)->first();
    $Pictures = [];
    $error = false;
    if (is_null($item)) {
      $item = GetItemFullInfo($item_id);
      if (empty($item)) {
        $error = true;
        abort(404);
      } else {
        $Pictures = getArrayKeyData($item, 'Pictures', null);
      }
    } else {
      $item = $item->toArray();
      if (!array_key_exists('ItemId', $item)) {
        $error = true;
      }
      $Pictures = json_decode($item['Pictures'], true);
    }

    $wishList = auth()->user()->wishlist ?? collect([]);
    $item_id = getArrayKeyData($item, 'Id', null);
    $item_id = $item_id ? $item_id : getArrayKeyData($item, 'ItemId', null);
    $CategoryId =  getArrayKeyData($item, 'CategoryId', '');

    $exit_wishList = $wishList->contains('ItemId', $item_id);

    $page = Post::where('post_slug', 'shipping-and-delivery')
      ->where('post_status', 'publish')
      ->where('post_type', 'page')
      ->first();
    $relatedProducts = Product::where('CategoryId', $CategoryId)
      ->whereNotIn('ItemId', [$item_id])
      ->latest()->offset(0)->limit(15)->get();

    if (!count($relatedProducts)) {
      $relatedProducts = Product::whereNotIn('ItemId', [$item_id])
        ->latest()->offset(0)->limit(15)->get();
    }


    return view('frontend.productDetails', compact('item', 'exit_wishList', 'relatedProducts', 'page', 'Pictures'));
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
    $resData = SearchItemsFrame($search, $type, $offset, $limit);

    $TotalCount = getArrayKeyData($resData, 'TotalCount', 0);
    $Contents = getArrayKeyData($resData, 'Content', []);
    return new Paginator($Contents, $TotalCount, $limit, $page, [
      'path'  => request()->url(),
      'query' => request()->query(),
    ]);
  }
}
