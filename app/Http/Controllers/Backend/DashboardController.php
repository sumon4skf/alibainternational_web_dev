<?php

namespace App\Http\Controllers\Backend;

use App\Exports\InvoicesExport;
use App\Exports\OrdersExport;
use App\Exports\WalletsExport;
use App\Http\Controllers\Controller;
use App\Http\Traits\ScheduleUpdated;
use App\Models\Auth\User;
use App\Models\Content\Order;
use App\Models\Content\OrderItem;
use App\Models\Content\OrderItemVariation;
use Illuminate\Support\Facades\Artisan;
use Maatwebsite\Excel\Facades\Excel;

/**
 * Class DashboardController.
 */
class DashboardController extends Controller
{
  use ScheduleUpdated;
  /**
   * @return \Illuminate\View\View
   */
  public function index()
  {
   // $this->updateUserMissingInformation();

    $orders = Order::latest()->get();

    if (request('attribute') == 'picture') {
      $this->attribute_picture();
    }

    if (request('coupon') == 'coupon') {
      $this->coupon_contribution();
    }

    if (request('first_payment') == 'first_payment') {
      $this->first_payment_updated();
    }

    return view('backend.dashboard', compact('orders'));
  }


  public function coupon_contribution()
  {
    //coupon_contribution
    $orderItems = OrderItem::with('order', 'user')->get();
    foreach ($orderItems as $orderItem) {
      $totalAmount = $orderItem->order->amount ?? 0; // sum of multiple product product value
      $itemCoupon = $orderItem->order->coupon_victory ?? 0;
      $itemTotal = $orderItem->product_value + $orderItem->chinaLocalDelivery; // individual product value

      if ($itemCoupon > 0) {
        $coupon_contribution = coupon_contribution($totalAmount, $itemTotal, $itemCoupon);
        // dump($orderItem->id . ' ' . $coupon_contribution);
        if ($coupon_contribution) {
          $orderItem->coupon_contribution = $coupon_contribution;
          $orderItem->save();
        }
      }
    }

    // dd($orderItem);
  }

  public function first_payment_updated()
  {
    $orderItems = OrderItem::get();
    foreach ($orderItems as $orderItem) {
      $product_value = (int)$orderItem->product_value;
      $chinaLocalDelivery = (int)$orderItem->chinaLocalDelivery;
      $coupon_contribution = (int)$orderItem->coupon_contribution;
      $first_payment = ($product_value + $chinaLocalDelivery - $coupon_contribution) * 0.50;

      $orderItem->first_payment = $first_payment;
      $orderItem->save();
    }
  }

  public function attribute_picture()
  {
    $Variation = OrderItemVariation::latest()->get();

    foreach ($Variation as $variation) {

      $attributes = json_decode($variation->attributes, true);
      if (is_array($attributes)) {
        foreach ($attributes as $attribute) {
          if (array_key_exists('ImageUrl', $attribute)) {
            $ImageUrl = $attribute['ImageUrl'];
            $variation->image = $ImageUrl;
            $variation->save();
            dump($ImageUrl);
          }
        }
      }
    }

    dd('done');
  }

  public function export($table)
  {
    $export = null;
    if ($table == 'orders') {
      return Excel::download(new OrdersExport(), 'cnb-order-table-' . date('Y-m-d-h-i-a') . '.xlsx');
    } elseif ($table == 'order_item') {
      return Excel::download(new WalletsExport(), 'cnb-wallet-table-' . date('Y-m-d-h-i-a') . '.xlsx');
    } elseif ($table == 'invoices') {
      return Excel::download(new InvoicesExport(), 'cnb-invoices-table-' . date('Y-m-d-h-i-a') . '.xlsx');
    }
    return redirect()->back()->withFlashDanger('File export fail');
  }
}
