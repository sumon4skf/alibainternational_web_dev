<?php

use App\Models\Content\Setting;
use App\Models\Content\Taxonomy;
use Intervention\Image\Facades\Image;

if (!function_exists('app_name')) {
  /**
   * Helper to grab the application name.
   *
   * @return mixed
   */
  function app_name()
  {
    return config('app.name');
  }
}



if (!function_exists('floating')) {
  function floating($price, $length = 2)
  {
    return round($price);
    return number_format($price, $length, '.', '');
  }
}

if (!function_exists('weight_floating')) {
  function weight_floating($price, $length = 2)
  {
    return number_format($price, $length, '.', '');
  }
}


if (!function_exists('get_top_taxonomies')) {
  /**
   * Helper to grab the application name.
   *
   * @return mixed
   */
  function get_top_taxonomies()
  {
    $taxonomies = Cache::get('top_taxonomies');
    if ($taxonomies) {
      return $taxonomies;
    }
    $taxonomies = Taxonomy::whereNotNull('active')->whereNull('ParentId')->withCount('children')->get()->toArray();
    Cache::put('top_taxonomies', $taxonomies, now()->addDays(90));
    return $taxonomies;
  }
}


if (!function_exists('get_all_taxonomies')) {
  /**
   * Helper to grab the application name.
   *
   * @return mixed
   */
  function get_all_taxonomies()
  {
    $taxonomies = Cache::get('taxonomies');
    if ($taxonomies) {
      return $taxonomies;
    }
    $taxonomies = Taxonomy::whereNotNull('active')->withCount('children')->get()->toArray();
    Cache::put('taxonomies', $taxonomies, now()->addDays(90));
    return $taxonomies;
  }
}

if (!function_exists('filter_taxonomies')) {
  function filter_taxonomies(array $taxonomies, $key, $value = null, $condition = 'equal')
  {
    return array_filter($taxonomies, function ($taxonomy) use ($key, $value, $condition) {
      if ($condition == 'equal') {
        return array_key_exists($key, $taxonomy) ? ($taxonomy[$key] == $value) : false;
      }
      return array_key_exists($key, $taxonomy) ? ($taxonomy[$key] != $value) : false;
    });
  }
}

if (!function_exists('general_settings')) {
  /**
   * Helper to grab the application name.
   *
   * @return mixed
   */
  function general_settings($json = false)
  {
    $settings = Cache::get('settings', null);
    if (!$settings) {
      $settings =  Setting::whereNotNull('active')->get();
      Cache::put('settings', $settings, now()->addDays(180));
    }

    if ($json && $settings) {
      return json_encode($settings->pluck('value', 'key')->toArray());
    }

    return $settings ? $settings : collect([]);
  }
}



if (!function_exists('get_setting')) {
  /**
   * Helper to grab the application name.
   *
   * @param $key
   * @param null $default
   * @return mixed
   */
  function get_setting($key, $default = null)
  {
    $setting = general_settings()->where('key', $key)->first();
    return $setting ? $setting->value : $default;
  }
}



if (!function_exists('currency_icon')) {
  /**
   * Helper to grab the application name.
   *
   * @return mixed
   */
  function currency_icon()
  {
    return get_setting('currency_icon');
  }
}


if (!function_exists('convertedPrice')) {
  /**
   * Helper to grab the application name.
   *
   * @param $original_price
   * @param $rate
   * @return mixed
   */
  function convertedPrice($original_price)
  {
    $rate = get_setting('increase_rate');
    return round($original_price * $rate);
    // return number_format($original_price * $rate, 2, '.', '');
  }
}




if (!function_exists('gravatar')) {
  /**
   * Access the gravatar helper.
   */
  function gravatar()
  {
    return app('gravatar');
  }
}

if (!function_exists('home_route')) {
  /**
   * @return string
   */
  function home_route()
  {
    if (auth()->check()) {
      if (auth()->user()->can('view backend')) {
        return 'admin.dashboard';
      }

      return 'frontend.user.dashboard';
    }

    return 'frontend.index';
  }
}


if (!function_exists('store_picture')) {
  /**
   * @param $file
   * @param string $dir_path
   * @param null $name
   * @param bool $thumb
   * @param bool $resize
   * @return string
   */
  function store_picture($file, $dir_path = '/', $name = null, $thumb = false, $resize = false)
  {
    $imageName = $name ? $name . '.' . $file->getClientOriginalExtension() : $file->getClientOriginalName();
    $dir_path = 'storage/' . $dir_path;
    $pathDir = create_public_directory($dir_path); // manage directory
    $img = Image::make($file);
    $fileSize = round($img->filesize() / 1024); // convert to kb

    if (!$resize) {
      $file->move($pathDir, $imageName); // save original photo
    } else {
      $img->resize(1080, null, function ($c) {
        $c->aspectRatio();
      })->save($pathDir . '/' . $imageName, 90); // save converted photo
    }

    if ($thumb) {
      $thumbPathDir = create_public_directory($dir_path . '/thumbs'); // manage thumbs directory
      if ($img->width() > 400 || $fileSize > 150) {
        $img->resize(400, null, function ($c) {
          $c->aspectRatio();
        })->save($thumbPathDir . '/' . $imageName, 90); // save thumbs photo
      } else {
        $img->save($thumbPathDir . '/' . $imageName, 90); // save thumbs photo
      }
    }

    return $dir_path . '/' . $imageName;
  }
}


if (!function_exists('store_search_picture')) {
  /**
   * @param $file
   * @param string $dir_path
   * @param string $prefix
   * @return string
   */
  function store_search_picture($file, $dir_path = '/', $prefix = '')
  {
    $imageName = $prefix . '.jpg';
    $dir_path = 'storage/' . $dir_path;
    $pathDir = create_public_directory($dir_path); // manage directory
    $img = Image::make($file);

    $img->resize(400, null, function ($c) {
      $c->aspectRatio();
    })->save($pathDir . '/' . $imageName, 90); // save converted photo

    return $dir_path . '/' . $imageName;
  }
}


if (!function_exists('create_public_directory')) {
  /**
   * @param $path
   * @return string
   */
  function create_public_directory($path)
  {
    File::isDirectory(public_path('storage')) ?: Artisan::call('storage:link');
    File::isDirectory(public_path($path)) ?: File::makeDirectory(public_path($path), 0777, true, true);
    return public_path($path);
  }
}


if (!function_exists('array_except')) {
  /**
   * @param array $array
   * @param array $keys
   * @return array
   */
  function array_except(array $array, array $keys)
  {
    foreach ($keys as $key) {
      unset($array[$key]);
    }
    return $array;
  }
}

if (!function_exists('clear_upload_location')) {
  /**
   * @param string $post_slug
   * @param int $limit
   * @return string
   */
  function clear_upload_location(string $post_slug, int $limit = 30)
  {
    return str_replace(".", "", Str::limit($post_slug, $limit));
  }
}


if (!function_exists('generate_order_number')) {
  /**
   * @param $id
   * @param int $length
   * @return string
   */
  function generate_order_number($id, $length = 8)
  {
    return str_pad($id, $length, "0", STR_PAD_LEFT);
  }
}


if (!function_exists('generate_browsing_key')) {
  /**
   * @param $key
   * @return string
   */
  function generate_browsing_key($key)
  {
    if ($key == 'fullInfo') {
      return date('Y-m-d-H') . '_' . $key . '_' . md5($key);
    } else {
      return date('Y-m-d') . '_' . $key;
    }
  }
}


if (!function_exists('get_browsing_data')) {
  /**
   * @param $key
   * @param bool $array
   * @param bool $fullPath
   * @return array|\Illuminate\Support\Collection|mixed
   * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
   */
  function get_browsing_data($key, $array = false, $fullPath = false)
  {
    $key = generate_browsing_key($key);
    $path = $fullPath ? $key : "browsing/{$key}.json";
    $existsFile = Storage::exists($path);
    if ($array) {
      if ($existsFile) {
        return json_decode(Storage::get($path), true) ?? [];
      }
      return [];
    }

    if ($existsFile) {
      return collect(json_decode(Storage::get($path), true));
    }

    return collect([]);
  }
}

if (!function_exists('store_browsing_data')) {
  /**
   * @param $key
   * @param $data
   */
  function store_browsing_data($key, $data)
  {
    $key = generate_browsing_key($key);
    $path = "browsing/{$key}.json";
    Storage::put($path, json_encode($data));
  }
}


if (!function_exists('coupon_contribution')) {
  /**
   * @param $totalAmount
   * @param $itemTotal
   * @param $itemCoupon
   * @return string|null
   */
  function coupon_contribution($totalAmount, $itemTotal, $itemCoupon)
  {
    if ($totalAmount > 0 & $itemTotal > 0 & $itemCoupon > 0) {
      $percent = ($itemTotal / $totalAmount * 100);
      $getting = ($itemCoupon * $percent / 100);
      return floating($getting);
    }
    return null;
  }
}


if (!function_exists('readable_status')) {
  /**
   * @param $status
   * @return string
   */
  function readable_status($status)
  {
    $status = str_replace('_', ' ', $status);
    $status = str_replace('-', ' ', $status);
    return ucfirst($status);
  }
}

if (!function_exists('GetFeaturedValues')) {
  /**
   * @param $status
   * @return string
   */
  function GetFeaturedValues($FeaturedValues, $key, $default = null)
  {

    $FeaturedValues = is_array($FeaturedValues) ? $FeaturedValues : json_decode($FeaturedValues, true);

    if (!empty($FeaturedValues) && is_array($FeaturedValues)) {
      $Name = collect($FeaturedValues)->where('Name', $key)->first();
      if ($Name) {
        return $Name->Value ?? $Name['Value'] ?? $default;
      }
    }
    return $default;
  }
}


if (!function_exists('maxAirShippingCharge')) {
  function maxAirShippingCharge($default = 660)
  {
    $airShippingCharges = get_setting('air_shipping_charges');
    $airShippingCharges = json_decode($airShippingCharges, true);

    if (is_array($airShippingCharges)) {
      $charge = collect($airShippingCharges)->sortByDesc('rate')->first();
      $default = $charge ? ($charge['rate'] ?? $default) : $default;
    }
    return $default;
  }
}



if (!function_exists('calculateItemDue')) {
  /**
   * @param $status
   * @return string
   */
  function calculateItemDue($orderItem)
  {
    $totalDue = ($orderItem->product_value + $orderItem->chinaLocalDelivery + $orderItem->shipping_charge +
      $orderItem->courier_bill - $orderItem->first_payment - $orderItem->coupon_contribution - $orderItem->out_of_stock -
      $orderItem->missing - $orderItem->refunded - $orderItem->last_payment);

    $adj = $orderItem->adjustment;
    if ($adj > 0) {
      $totalDue = $totalDue + $adj;
    } else if ($adj < 0) {
      $totalDue = $totalDue - abs($adj);
    }
    return round($totalDue);
  }
}

if (!function_exists('calculateOneItemCourierBill')) {
  /**
   * @param $status
   * @return string
   */
  function calculateOneItemCourierBill($courier_bill, $total_invoices)
  {
    $bill = 0;
    if ($courier_bill > 0 & $total_invoices > 0) {
      $bill = $courier_bill / $total_invoices;
    }
    return round($bill);
  }
}
