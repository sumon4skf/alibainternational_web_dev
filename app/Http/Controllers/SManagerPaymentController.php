<?php

namespace App\Http\Controllers;

use App\Models\Auth\User;
use App\Models\Content\Invoice;
use App\Models\Content\Order;
use App\Models\Content\OrderItem;
use App\Notifications\OrderAuthInformation;
use App\Notifications\OrderPending;
use Illuminate\Http\Request;
use Notification;

class SManagerPaymentController extends Controller
{


  public function initial_payment()
  {
    $tran_id = \request('tran_id');
    $user = auth()->user();
    $order = Order::withCount('orderItems')->where('transaction_id', $tran_id)->where('user_id', $user->id)->first();
    $invoice = Invoice::withCount('invoiceItems')->where('invoice_no', $tran_id)->where('user_id', $user->id)->first();
    $link = null;
    $message = 'Order not found';
    $status = false;

    if ($order || $invoice) {
      $customer_name = $order ? $order->name : $invoice->customer_name;
      $total_items = $order ? $order->order_items_count :  $invoice->invoice_items_count;
      $amount = $order ?  $order->needToPay :  $invoice->total_payable;

      $info = [
        'amount'          => $amount,
        'transaction_id'  => $tran_id,
        'success_url'     => url("smanager/payment/success/{$tran_id}"),
        'fail_url'        => url("smanager/payment/fail/{$tran_id}"),
        'customer_name'   => $customer_name,
        // 'customer_mobile' => '01743456472',
        'purpose'         => 'Online Payment',
        'payment_details' => 'Payment for buying ' . $total_items ?? 0 . ' items'
      ];
      // dd($info);
      $response = sManagerInitiatePayment($info);
      if (is_array($response)) {
        $code = array_key_exists('code', $response) ? $response['code'] : [];
        $message = array_key_exists('message', $response) ? $response['message'] : [];
        $data = array_key_exists('data', $response) ? $response['data'] : [];

        if ($code == 200) {
          $status = true;
          $link = array_key_exists('link', $data) ? $data['link'] : null;
        }
      }
    }

    return response([
      'status' => $status,
      'message' => $message,
      'redirect' => $link
    ]);
  }


  public function success($tran_id)
  {
    $user_id = auth()->id();
    $is_admin = auth()->user()->hasRole('administrator');
    $order = Order::with('user')->where('transaction_id', $tran_id);
    $order = $is_admin ? $order->first() : $order->where('user_id', $user_id)->first();

    if ($order) {
      if ($order->status == 'Waiting for Payment') {
        $order->update(['status' => 'Partial Paid']);
        OrderItem::where('order_id', $order->id)->update(['status' => 'Partial Paid']);
        $users = User::role('administrator')->get();
        Notification::send($users, new OrderAuthInformation($order));
        if (get_setting('active_partial_paid')) {
          $order->user->notify(new OrderPending($order));
        }
        return redirect()->route('frontend.user.dashboard', ['payment' => 'successful', 'tab' => 'orders'])
          ->withFlashSuccess('Thanks for Order. Your Order is Processing');
      } else if ($order->status == 'Partial Paid' || $order->status == 'Complete') {
        return redirect()->route('frontend.user.dashboard')
          ->withFlashSuccess('Thanks for Order. Your Order is Processing');
      } else {
        return redirect('payment')->withFlashDanger('Your Transaction is Invalid');
      }
    }

    $invoice = Invoice::with('user')->where('invoice_no', $tran_id);
    $invoice = $is_admin ? $invoice->first() : $invoice->where('user_id', $user_id)->first();

    if ($invoice) {
      if ($invoice->status == 'Pending') {
        $invoice->update(['status' => 'confirm_received']);
        $users = User::role('administrator')->get();
        // Notification::send($users, new InvoicePaymentInformation($invoice));
        return redirect()->route('frontend.user.dashboard', ['tab' => 'invoice'])
          ->withFlashSuccess('Thanks for Payment');
      } else {
        return redirect('payment')->withFlashDanger('Your Transaction is Invalid');
      }

      return redirect()->route('frontend.user.dashboard', ['tab' => 'invoice'])
        ->withFlashDanger('Your Payment Fail');
    }
  }

  public function fail($tran_id)
  {
    $order = Order::where('transaction_id', $tran_id)
      ->select('transaction_id', 'status', 'currency', 'amount')->first();

    if ($order->status == 'Waiting for Payment') {
      $order->update(['status' => 'Waiting for Payment']);
      // echo "Transaction is Falied";
      return redirect('payment')->withFlashDanger('Transaction is Falied');
    } else if ($order->status == 'Partial Paid' || $order->status == 'Complete') {
      // echo "Transaction is already Successful";
      return redirect('payment')->withFlashSuccess('Transaction is already Successful');
    } else {
      // echo "Transaction is Invalid";
      return redirect('payment')->withFlashDanger('Transaction is Invalid');
    }
  }
}
