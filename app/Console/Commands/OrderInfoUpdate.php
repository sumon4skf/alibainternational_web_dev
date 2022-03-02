<?php

namespace App\Console\Commands;

use App\Models\Content\Order;
use Illuminate\Console\Command;

class OrderInfoUpdate extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'order:updateInfo';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Order information like name, phone, email update';

  /**
   * Create a new command instance.
   *
   * @return void
   */
  public function __construct()
  {
    parent::__construct();
  }

  /**
   * Execute the console command.
   *
   * @return mixed
   */
  public function handle()
  {
    $orders = Order::whereHas('user')
      ->with('user')
      ->whereNotNull('address')
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
        if (!empty($address)) {
          $user_email = $order->user->email ?? "";
          $order_name = $order->name;
          $order_phone = $order->phone;
          $order_email = $order->email;
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
    \Log::info("Cron Order Info update cron successfully is working fine! {$totalOrders}");
  }
}
