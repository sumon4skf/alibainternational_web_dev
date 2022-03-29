<?php

namespace App\Http\Controllers\Frontend;

use Carbon\Carbon;
use App\Models\Content\Order;
use App\Models\Content\Product;
use App\Models\Content\Taxonomy;
use App\Models\Content\OrderItem;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Traits\OrderTrait;
use App\Models\Auth\User;
use App\Models\Content\Coupon;
use App\Models\Content\CouponUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use App\Models\Content\OrderItemVariation;
use App\Models\Content\Frontend\CustomerCart;
use App\Models\Content\Frontend\EmailSubscriber;
use App\Models\Content\Invoice;
use App\Models\Content\RecentProducts;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Storage;
use Str;

/**
 * Class HomeController.
 */
class AjaxController extends Controller
{
  use OrderTrait;

  public function categoryProducts()
  {
    $cat_id = request('cat_id');
    $offset = request('offset');
    $limit = request('limit');

    $category = Taxonomy::where('id', $cat_id)->whereNotNull('active')->first();
    $items = [];
    if ($category) {
      // if ($category->otc_id && $category->ProviderType == 'Alibaba1688') {
      //   $items = otc_category_items($category->otc_id, $offset, $limit);
      // }
      $search = $category->keyword ? $category->keyword : $category->name;
      $items = SearchItemsFrame($search, 'text', $offset, $limit);
    }

    $renderData = view('frontend.ajaxComponent.singleProduct', compact('items'))->render();

    return response([
      'status' => true,
      'items' => $renderData
    ]);
  }


  public function browsing_cache($search, $type, $offset, $limit)
  {
    $key = Str::slug($search) . '_' . md5($search);
    try {
      $browsing = get_browsing_data($key, true);
    } catch (FileNotFoundException $e) {
    }
    $newLoad = false;
    $items = null;
    // dd($browsing);
    $countBrowsing = count($browsing);

    if ($countBrowsing) {
      if ($countBrowsing > $offset) {
        $items = array_slice($browsing, $offset, $limit);
        if (count($items)) {
          return $items;
        }
        $newLoad = true;
      } else {
        $newLoad = true;
      }
    } else {
      $newLoad = true;
    }

    if ($newLoad) {
      if ($type == 'category') {
        $items = SearchItemsFrame($search, 'text', $offset, $limit);
      } else {
        $items = SearchItemsFrame($search, 'picture', $offset, $limit);
      }

      if (is_array($items)) {
        $Content = $items['Items']['Content'] ?? [];
        $TotalCount = $items['Items']['TotalCount'] ?? 0;
        if (count($Content)) {
          if (count($browsing)) {
            $mergeItems = array_merge($browsing, $Content);
            store_browsing_data($key, $mergeItems);
            $items = array_slice($mergeItems, $offset, $limit);
          } else {
            store_browsing_data($key, $Content);
            $items = array_slice($Content, $offset, $limit);
          }
        }
      }
    }

    return $items;
  }

  public function getItemPrice()
  {
    $item_id = request('item_id');
    $product = RecentProducts::where('ItemId', $item_id)->first();

    $Attributes = json_decode($product->Attributes, true);
    $response['Id'] = $product->ItemId;
    $response['Title'] = $product->Title;
    $response['Attributes'] = $Attributes;
    $response['QuantityRanges'] = json_decode($product->QuantityRanges, true);
    $response['ConfiguredItems'] = json_decode($product->ConfiguredItems, true);
    $response['MainPictureUrl'] = $product->MainPictureUrl;
    $response['MasterQuantity'] = $product->MasterQuantity;
    $response['FirstLotQuantity'] = $product->FirstLotQuantity;
    $response['NextLotQuantity'] = $product->NextLotQuantity;
    $response['BatchLotQuantity'] = $product->BatchLotQuantity;
    $response['PhysicalParameters'] = $product->PhysicalParameters;
    $response['Price'] = $product->Price;

    $additional['VendorScore'] = $product->VendorScore;
    $additional['FeaturedValues'] = json_decode($product->FeaturedValues, true);

    $data = [
      'additional' => json_encode($additional),
      'product' => json_encode($response),
      'price' => view('frontend.ajaxComponent.priceRange', compact('product'))->render(),
      'attributes' => view('frontend.ajaxComponent.attributes', compact('Attributes'))->render(),
      'config' => view('frontend.ajaxComponent.configuredItems', compact('product'))->render(),
      'additionalInfo' => view('frontend.ajaxComponent.additionalInfo', compact('Attributes'))->render(),
    ];

    return response($data);
  }



  public function getItemDescription()
  {
    $item_id = request('item_id');
    $description = GetItemDescription($item_id);

    return view('frontend.ajaxComponent.ItemDescription', compact('description'));
  }

  public function getItemSellerInformation()
  {
    $vendorId = request('vendor_id');
    $sellerInformation = GetVendorInfo($vendorId);

    $html = view('frontend.ajaxComponent.sellerInformation', compact('sellerInformation'))->render();
    return response([
      'html' => $html,
      // 'info' => $sellerInformation,
    ]);
  }

  public function orderConfirm()
  {
    $transaction_id = trim(request('order_id'));
    $pay_method = trim(request('pay_method'));
    $products = json_decode(request('OrderItem'), true);
    $summary = collect(json_decode(request('summary'), true));
    $address = collect(json_decode(request('address'), true));

    DB::transaction(function () use ($transaction_id, $pay_method, $summary, $products, $address) {
      $orderStore = $this->orderStore($transaction_id, $pay_method, $summary, $address);

      $status = $pay_method == 'cash_payment' ? 'cash-payment' : 'Waiting for Payment';

      foreach ($products as $product) {
        $Id = getArrayKeyData($product, 'Id', null);
        $Title = getArrayKeyData($product, 'Title', '');
        $shipped_by = getArrayKeyData($product, 'shipped_by', 0);
        $shippingRate = getArrayKeyData($product, 'shippingRate', 0);
        $localDelivery = getArrayKeyData($product, 'localDelivery', 0);

        $itemData = getArrayKeyData($product, 'itemData', []);

        $OrderItemData = [
          'name' => $Title,
          'link' => "/product/{$Id}",
          'shipped_by' => $shipped_by,
          'shipping_rate' => $shippingRate,
          'chinaLocalDelivery' => $localDelivery,
          'status' => $status,
        ];
        $this->storeOrderItems($orderStore, $product, $itemData, $OrderItemData);
      }

      $this->recalculateOrderItemsDue($orderStore->id);
      $auth_id = auth()->id();
      CustomerCart::where('user_id', $auth_id)->whereNull('buy_status')->update([
        'buy_status' => now()
      ]);
    }, 2);

    transaction_cookie_set($transaction_id);

    return response(['status' => true,  'tran_id' => $transaction_id, 'summary' => $summary]);
  }

  public function orderStore($transaction_id, $pay_method, $summary, $address)
  {
    $status = $pay_method == 'cash_payment' ? 'cash-payment' : 'Waiting for Payment';

    //order_number
    $user = \Auth::user();
    $address = empty($address) ? $user->shipping : $address;
    $couponCode = $summary['couponCode'] ?? null;
    $couponDiscount = $summary['couponDiscount'] ?? null;
    $productTotal = $summary['productTotal'] ?? null;
    $needToPay = $summary['needToPay'] ?? null;
    $dueForProducts = $summary['dueForProducts'] ?? null;
    $data = [
      'name' => $user->name,
      'email' => $user->email,
      'phone' => $user->phone ?? '',
      'amount' => $productTotal,
      'coupon_code' => $couponCode,
      'coupon_victory' => $couponDiscount,
      'needToPay' => $needToPay,
      'dueForProducts' => $dueForProducts,
      'status' => $status,
      'address' => json_encode($address),
      'transaction_id' => $transaction_id,
      'pay_method' => $pay_method,
      'currency' => 'BDT',
      'user_id' => $user->id,
    ];

    $order = Order::create($data);
    $order_number = generate_order_number($order->id);
    $order->update(['order_number' => $order_number]);

    if ($couponCode) {
      $findCoupon = Coupon::where('coupon_code', $couponCode)->first();
      $couponData = [
        'coupon_id' => $findCoupon->id,
        'coupon_code' => $couponCode,
        'coupon_details' => '',
        'win_amount' => $couponDiscount,
        'order_id' => $order->id,
        'user_id' => $user->id,
      ];
      CouponUser::create($couponData);
    }

    return $order;
  }

  public function storeOrderItems($order, $product, $itemData, $OrderItemData)
  {
    $order_id = $order->id;
    $Id = getArrayKeyData($product, 'Id', null);
    $ActualWeight = getArrayKeyData($product, 'ActualWeight', 0);
    $findProduct = RecentProducts::where('ItemId', $Id)->first();

    $product_id = $findProduct ? $findProduct->id : '1234';
    $auth_id = auth()->id();
    $OrderItemData['order_id'] = $order_id;
    $OrderItemData['product_id'] = $product_id;
    $OrderItemData['user_id'] = $auth_id;

    $orderItem = OrderItem::create($OrderItemData);
    $order_item_id = $orderItem->id;
    $itemTotalQuantity = 0;
    $itemTotalPrice = 0;
    $itemImage = '';
    foreach ($itemData as $item) {
      $itemTotalQuantity += $item['quantity'];
      $itemTotalPrice += $item['subTotal'];
      $itemImage = $item['image'];
      $variations = [
        'itemCode' => getArrayKeyData($item, 'itemCode', null),
        'order_item_id' => $order_item_id,
        'product_id' => $product_id,
        'attributes' => json_encode($item['attributes'] ?? []),
        'image' => $itemImage,
        'price' => $item['price'],
        'quantity' => $item['quantity'],
        'subTotal' => $item['subTotal'],
        'user_id' => $auth_id,
      ];
      OrderItemVariation::create($variations);
    }
    $order_item_number = generate_order_number($order_item_id);
    $approxWeight = $itemTotalQuantity * $ActualWeight;
    // dd($approxWeight);

    $coupon_victory = $order->coupon_victory ? $order->coupon_victory : 0;
    $order_amount = $order->amount;
    $contribution = coupon_contribution($order_amount, $itemTotalPrice, $coupon_victory);

    $advanced_payment  = (int) get_setting('advanced_payment');
    // $totalContributor = (int) ($itemTotal - $contribution);
    $half_payment = ($itemTotalPrice * $advanced_payment) / 100;
    $due_payment = $itemTotalPrice - $half_payment;

    $orderItem->update([
      'order_item_number' => $order_item_number,
      'quantity' => $itemTotalQuantity,
      'product_value' => $itemTotalPrice,
      'first_payment' => $half_payment,
      'due_payment' => $due_payment,
      'approxWeight' => $approxWeight,
      'image' => $itemImage,
      'coupon_contribution' => $contribution,
    ]);
  }


  public function subscribeEmail()
  {
    $validate = request()->validate([
      'email' => 'string|email|max:155',
    ]);
    $email = request('email');

    $subscriber = EmailSubscriber::where('email', $email)->first();

    if (!$subscriber) {
      EmailSubscriber::create($validate);
    }

    return response()->json(['status' => true]);
  }


  public function LoadCustomerCart()
  {
    return response()->json(['status' => false, 'cart' => []]);
    $status = false;
    $newCart = [];
    if (auth()->check()) {
      $cartProducts = json_decode(request('cartProducts'), true);
      $user_id = auth()->id();
      if (!empty($cartProducts)) {
        $this->updateCustomerCart($cartProducts); // update current cart stop
      }

      $CustomerCart = CustomerCart::where('user_id', $user_id)->whereNull('buy_status')->whereNotNull('Item')->get();

      if (count($CustomerCart)) {
        foreach ($CustomerCart as $cuCart) {
          $arrData = [
            'ActualWeightInfo' => [],
            'Id' => $cuCart->ItemId,
            'QuantityRanges' => json_decode($cuCart->QuantityRanges),
            'isCart' => true,
            'item' => json_decode($cuCart->Item),
            'itemData' => json_decode($cuCart->ItemData),
            'localDelivery' => $cuCart->localDelivery,
            'shipped_by' => $cuCart->shipped_by,
            'shippingRate' => $cuCart->shippingRate,
          ];
          array_push($newCart, $arrData);
        }
      }

      if (!empty($newCart)) {
        $status = true;
      }
    }


    return response()->json(['status' => $status, 'cart' => $newCart]);
  }


  public function updateCustomerCart($cart, $remove = null)
  {
    $status = false;
    if (auth()->check()) {
      $user_id = \auth()->id();
      $notRemovable = [];
      if (!empty($cart)) {
        foreach ($cart as $checkout_cart) {
          $ItemId = $checkout_cart['Id'];
          array_push($notRemovable, $ItemId);
          $QuantityRanges = $checkout_cart['QuantityRanges'];
          $item = $checkout_cart['item'];
          $itemData = $checkout_cart['itemData'];
          $data = [
            'QuantityRanges' => json_encode($QuantityRanges),
            'Item' => json_encode($item),
            'ItemData' => json_encode($itemData),
            'minQuantity' => $item['FirstLotQuantity'] ?? 1,
            'localDelivery' => $checkout_cart['localDelivery'],
            'shipped_by' => $checkout_cart['shipped_by'],
            'shippingRate' => $checkout_cart['shippingRate'],
            'updated_at' => now()
          ];
          CustomerCart::updateOrInsert(
            ['ItemId' => $ItemId, 'user_id' => $user_id],
            $data
          );
        }
        $status = true;
      }
      if ($remove) {
        $CustomerCart = CustomerCart::where('user_id', $user_id)->whereNull('buy_status');
        //        dd($notRemovable);
        if (empty($notRemovable)) {
          $CustomerCart->update(['buy_status' => now()]);
        } else {
          $CustomerCart->whereNotIn('ItemId', $notRemovable)->update(['buy_status' => now()]);
        }
      }
    }
    return $status;
  }


  public function noticeMarkUnread()
  {
    $notice = request('notice');
    $notification = Auth::user()->notifications()->find($notice);

    if ($notification) {
      $notification->markAsRead();
    }

    return response()->json(['status' => true]);
  }


  public function couponCodeValidate()
  {
    $coupon_code = request('coupon_code');
    $summary = json_decode(request('summary'));
    $today = Carbon::now()->toDateTimeString();
    $coupon = Coupon::whereNotNull('active')
      ->where('coupon_code', $coupon_code)
      ->whereDate('expiry_date', '>=', $today)
      ->first();

    $return['status'] = false;
    $cartTotal = $summary->productTotal ?? 0;

    if ($coupon) {
      $minimum_spend = $coupon->minimum_spend;
      $maximum_spend = $coupon->maximum_spend;
      $amount = 0;
      if ($minimum_spend && $maximum_spend) {
        $amount = ($cartTotal >= $minimum_spend && $cartTotal <= $maximum_spend) ? $coupon->coupon_amount : 0;
      } else if ($minimum_spend) {
        $amount = $cartTotal >= $minimum_spend ? $coupon->coupon_amount : 0;
      } else if ($maximum_spend) {
        $amount = $cartTotal <= $maximum_spend ? $coupon->coupon_amount : 0;
      } else {
        $amount = $coupon->coupon_amount;
      }

      $isEnable = false;
      if ($amount) {
        $isEnable = true;
        $limit_per_coupon = $coupon->limit_per_coupon;
        $limit_per_user = $coupon->limit_per_user;
        if ($limit_per_coupon) {
          $countCoupon = CouponUser::where('coupon_id', $coupon->id)->count();
          $isEnable = $countCoupon <= $limit_per_coupon ? true : false;
        }
        if ($limit_per_user) {
          $user_id = auth()->id ?? 0;
          $countUser = CouponUser::where('coupon_id', $coupon->id)->where('user_id', $user_id)->count();
          $isEnable = $countUser <= $limit_per_user ? true : false;
        }
      }
      if ($coupon->coupon_type == 'flat_cart_discount' && $isEnable) {
        $return['status'] = true;
        $return['amount'] = $coupon->coupon_amount;
      } else if ($coupon->coupon_type == 'perchantage_discount' && $isEnable) {
        $return['status'] = true;
        $return['amount'] = ($cartTotal * $coupon->coupon_amount) / 100;
      } else if ($coupon->coupon_type == 'free_shipping' && $isEnable) {
        $return['status'] = true;
        $return['amount'] = 'free_shipping';
      }
    }

    return response()->json($return);
  }

  public function invoiceCashPayment()
  {
    $tran_id = \request('tran_id');
    $user = auth()->user();
    $invoice = Invoice::withCount('invoiceItems')->where('invoice_no', $tran_id)->where('user_id', $user->id)->first();
    if ($invoice) {
      if ($invoice->status == 'Pending') {
        $invoice->update(['status' => 'confirm_received']);
        return response([
          'status' => true,
          'msg' => 'Thanks for Payment',
          'redirect' => route('frontend.user.dashboard', ['tab' => 'invoice']),
        ]);
      } else {
        return response([
          'status' => false,
          'msg' => 'Your Transaction is Invalid',
          'redirect' => '/payment',
        ]);
      }
    }

    return response([
      'status' => false,
      'msg' => 'Your Payment Fail',
      'redirect' => route('frontend.user.dashboard', ['tab' => 'invoice']),
    ]);
  }
}
