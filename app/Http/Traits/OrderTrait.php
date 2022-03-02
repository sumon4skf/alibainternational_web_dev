<?php

namespace App\Http\Traits;

use App\Models\Content\Order;
use App\Models\Content\OrderItem;
use App\Models\Grocery\Cart;
use Carbon\Carbon;

/*
|--------------------------------------------------------------------------
| Api Responser Trait
|--------------------------------------------------------------------------
|
| This trait will be used for any response we sent to clients.
|
*/

trait OrderTrait
{

  public function recalculateOrderValue($order_id)
  {
    $order = Order::with('orderItems')->find($order_id);
    if ($order) {
      $needToPay = $order->orderItems->sum('first_payment') ?? null;
      $due_payment = $order->orderItems->sum('due_payment') ?? null;

      $order->update([
        'amount' => ($needToPay + $due_payment),
        'needToPay' => $needToPay,
        'dueForProducts' => $due_payment
      ]);
    }
    return $order;
  }

  public function recalculateOrderItemsDue($order_id)
  {
    $reCalculateOrderItems = OrderItem::where('order_id', $order_id)->get();
    if (count($reCalculateOrderItems)) {
      foreach ($reCalculateOrderItems as $reItems) {
        $due_payment = calculateItemDue($reItems);
        $reItems->update(['due_payment' => $due_payment]);
      }
      $this->recalculateOrderValue($order_id);
    }
    return $reCalculateOrderItems;
  }
}
