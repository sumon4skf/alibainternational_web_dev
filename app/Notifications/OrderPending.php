<?php

namespace App\Notifications;

use App\Models\Auth\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\NexmoMessage;
use Illuminate\Notifications\Notification;

class OrderPending extends Notification
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
   * @param mixed $notifiable
   * @return array
   */
  public function via($notifiable)
  {
    return ['mail', 'database'];
  }

  /**
   * Get the mail representation of the notification.
   *
   * @param mixed $notifiable
   * @return MailMessage
   */
  public function toMail($notifiable)
  {
    $order = $this->data;
    $transaction_id = $order->transaction_id ?? null;
    $txt = get_setting('partial_paid');
    $txt = str_replace('[transactionNumber]', $transaction_id, $txt);
    $subject = 'Partial Paid';
    $url = url('dashboard?tab=orders');

    return (new MailMessage)
      ->subject($subject)
      ->replyTo('info@dearbd.com')
      ->greeting('Hello, ' . $notifiable->name)
      ->line($txt)
      ->action('View Orders', $url)
      ->line('Thank you for using our application!');
  }

  /**
   * Get the array representation of the notification.
   *
   * @param mixed $notifiable
   * @return array
   */
  public function toArray($notifiable)
  {
    $order = $this->data;
    $transaction_id = $order->transaction_id ?? null;
    $txt = get_setting('partial_paid');
    $txt = str_replace('[transactionNumber]', $transaction_id, $txt);
    $amount = $this->data->amount ?? null;
    return [
      'invoice_id' => $order->id,
      'transaction_id' => $transaction_id,
      'text' => $txt,
      'amount' => $amount,
    ];
  }
}
