<?php

namespace App\Http\Traits;

use App\Models\Auth\User;
use App\Models\Content\Order;

/*
|--------------------------------------------------------------------------
| Api Responser Trait
|--------------------------------------------------------------------------
|
| This trait will be used for any response we sent to clients.
|
*/

trait ScheduleUpdated
{

  public function updateOrderMissingInformation()
  {
    $orders = Order::withTrashed()
      ->with('user')
      ->whereNull('name')
      ->orWhere('name', '')
      ->orWhereNull('email')
      ->orWhere('email', '')
      ->orWhereNull('phone')
      ->orWhere('phone', '')
      ->get();
    if (count($orders)) {
      foreach ($orders as $order) {
        $address = json_decode($order->address, true) ?? [];
        if (empty($address)) {
          $address = [
            'name' => $order->user->name,
            'phone_one' => $order->user->phone,
          ];
        }
        if (!empty($address)) {
          $user_email = $order->user->email ?? "";
          $order_name = trim($order->name);
          $order_phone = trim($order->phone);
          $order_email = trim($order->email);
          $addr_name = $address['name'];
          $addr_phone = $address['phone_one'];
          $data = [
            'name' => $order_name ? $order_name : $addr_name,
            'email' => $order_email ? $order_email : $user_email,
            'phone' => $order_phone ? $order_phone : $addr_phone,
          ];
          $order->update($data);
        }
      }
    }
    $totalOrders = count($orders);
    \Log::info("{$totalOrders} Orders missing missing updated successfully! ");
  }

  public function updateUserMissingInformation()
  {
    $users = User::with('address', 'orders')
      ->whereNull('name')
      ->orWhereNull('phone')
      ->get();

    if (count($users)) {
      foreach ($users as $user) {
        $address = $user->address->first();
        $order = $user->orders->first();
        $order_name = "";
        $order_phone = "";
        if ($order) {
          $order_name = $order->name;
          $order_phone = $order->phone;
        }
        if ($address) {
          $user_name = trim($user->name);
          $user_phone = trim($user->phone);
          $addr_name = $address->name ? $address->name : $order_name;
          $addr_phone = $address->phone_one ? $address->phone_one : $order_phone;
          $data = [
            'name' => $user_name ? $user_name : $addr_name,
            'phone' => $user_phone ? $user_phone : $addr_phone,
          ];
          $user->update($data);
        }
      }
    }
    $totalUsers = count($users);
    \Log::info("{$totalUsers} Users missing Information updated successfully! ");
  }
}
