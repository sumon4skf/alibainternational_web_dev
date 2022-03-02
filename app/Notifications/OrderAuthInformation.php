<?php

namespace App\Notifications;

use App\Models\Auth\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\NexmoMessage;
use Illuminate\Notifications\Notification;

class OrderAuthInformation extends Notification
{
  use Queueable;

  public $data;

  /**
   * Create a new notification instance.
   *
   * @return void
   */
  public function __construct($data)
  {
    $this->data = $data;
  }


  /**
   * Get the notification's delivery channels.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function via($notifiable)
  {
    return ['mail', 'database'];
  }

  /**
   * Get the mail representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return MailMessage
   */
  public function toMail($notifiable)
  {
    $order = $this->data;
    $transaction_id = $order->transaction_id ?? null;
    $order_id = $order->id ?? null;
    $amount = $order->amount ?? null;
    $needToPay = $order->needToPay ?? null;
    $pay_method = $order->pay_method ?? null;
    $dueForProducts = $order->dueForProducts ?? null;
    $userName = User::find($order->user_id);
    return (new MailMessage)->markdown('notification/OrderAuthInfo', [
      'full_name' => $userName->full_name,
      'transaction_id' => $transaction_id,
      'amount' => $amount,
      'needToPay' => $needToPay,
      'dueForProducts' => $dueForProducts,
      'pay_method' => $pay_method,
      'order_id' => $order_id
    ]);
  }

  /**
   * Get the array representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function toArray($notifiable)
  {
    $transaction_id = $this->data->transaction_id ?? null;
    $order_id = $this->data->id ?? null;
    $amount = $this->data->amount ?? null;
    return [
      'invoice_id' => $order_id,
      'transaction_id' => $transaction_id,
      'amount' => $amount,
    ];
  }


  /**
   * Get the Nexmo / SMS representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return NexmoMessage
   */
  public function toNexmo($notifiable)
  {
    return (new NexmoMessage())
      ->content('Customer Placed a Order. That\'s are Pending now. Order amount tk.' . $this->data->subs_total);
  }
}
