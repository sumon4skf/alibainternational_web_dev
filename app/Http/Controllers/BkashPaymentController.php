<?php

namespace App\Http\Controllers;

use App\Models\Auth\User;
use App\Models\Content\Invoice;
use App\Models\Content\Order;
use App\Models\Content\OrderItem;
use App\Notifications\InvoicePaymentInformation;
use App\Notifications\OrderAuthInformation;
use App\Notifications\OrderPending;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Notification;
use Shipu\Bkash\Enums\BkashSubDomainType;
use Shipu\Bkash\Managers\Checkout;

class BkashPaymentController extends Controller
{

  public function bkash_payment_process()
  {
    // $idtoken = bkash_Get_Token();
    // $refund = bkash_refund([]);
    // $refund_status = bkash_refund_status([]);
    // dump($idtoken);
    // dump($refund);
    // dd($refund_status);


    $user_id = auth()->id();
    $tran_id = Cookie::get('_tran');

    $order = Order::where('user_id', $user_id)->where('transaction_id', $tran_id)->first();
    $amount = $order ? $order->needToPay : 0;

    if (!$order) {
      $invoice = Invoice::where('user_id', $user_id)->where('invoice_no', $tran_id)->firstOrFail();
    }

    $amount = $amount ? $amount : $invoice->total_payable;
    // $amount = config('bkash.sandbox_mode') == 'sandbox' ? 5 : $amount;

    $data = [
      'ref_no' => $tran_id,
      'amount' => ceil($amount),
      'success_url' => '/bkash/success?',
      'failed_url' => '/bkash/failed?'
    ];
    return view('frontend.payment.bkash', compact('data'));
  }

  public function bkash_success()
  {
    $tran_id = request('tran_id');
    $paymentID = request('paymentID');
    $trxID = request('trxID');
    $n_type = request('n_type'); // success
    // $user_id = auth()->id();
    $order = Order::with('user')->where('transaction_id', $trxID)->first();

    // $query = bkash_query_payment($paymentID);
    // $search = bkash_search_tran($trxID);

    // dump($query);
    // dd($search);

    if ($order && $n_type == 'success') {
      if ($order->status == 'Waiting for Payment') {
        $order->update(['status' => 'Partial Paid', 'pay_method' => 'bkash']);
        OrderItem::where('order_id', $order->id)->update(['status' => 'Partial Paid']);
        $users = User::role('administrator')->get();
        Notification::send($users, new OrderAuthInformation($order));
        if (get_setting('active_partial_paid')) {
          if ($order->user) {
            $order->user->notify(new OrderPending($order));
          }
        }
        return redirect()->route('frontend.user.dashboard', ['payment' => 'successful', 'tab' => 'orders'])
          ->withFlashSuccess('Thanks for Order. Your Order is Processing');
      } else if ($order->status == 'Partial Paid' || $order->status == 'Complete') {
        return redirect()->route('frontend.user.dashboard', ['tab' => 'orders'])
          ->withFlashSuccess('Thanks for Order. Your Order is Processing');
      } else {
        return redirect()->route('frontend.user.dashboard', ['tab' => 'orders'])->withFlashDanger('Your Transaction is Invalid');
      }
    }

    $invoice = Invoice::with('user')->where('invoice_no', $trxID)->first();

    if ($invoice && $n_type == 'success') {
      if ($invoice->status == 'Pending') {
        $invoice->update(['status' => 'confirm_received', 'pay_method' => 'bkash']);
        $users = User::role('administrator')->get();

        Notification::send($users, new InvoicePaymentInformation($invoice));

        return redirect()->route('frontend.user.dashboard', ['payment' => 'successful', 'tab' => 'invoice'])
          ->withFlashSuccess('Thanks for Payment');
      } else {
        return redirect('payment')->withFlashDanger('Your Transaction is Invalid');
      }
      return redirect()->route('frontend.user.dashboard', ['tab' => 'invoice'])
        ->withFlashDanger('Your Payment Fail');
    }
    return redirect()->route('frontend.user.dashboard')->withFlashWarning('Your transaction is not completed. If your amount is lost contact the  01871-778844 or 01933-778855');
  }

  public function bkash_failed()
  {
    $tran_id = request('tran_id');
    $n_type = request('n_type'); // error
    $user_id = auth()->id();
    $order = Order::with('user')->where('user_id', $user_id)->where('transaction_id', $tran_id)->first();
    if ($order) {
      if ($order->status == 'Waiting for Payment') {
        return redirect()->route('frontend.user.failedOrderPayNow', $tran_id)->withFlashDanger('Transaction is Falied');
      } else if ($order->status == 'Partial Paid' || $order->status == 'Complete') {
        return redirect()->route('frontend.user.failedOrderPayNow', $tran_id)->withFlashSuccess('Transaction is already Successful');
      } else {
        return redirect()->route('frontend.user.failedOrderPayNow', $tran_id)->withFlashDanger('Transaction is Invalid');
      }
    }
    $invoice = Invoice::with('user')->where('invoice_no', $tran_id)->first();

    if ($invoice) {
      return redirect()->route('frontend.user.invoice.payNow', $tran_id)->withFlashDanger('Nagad transaction fail');
    }

    return redirect()->route('frontend.user.dashboard', ['tab' => 'orders'])->withFlashWarning('Your transaction is not completed. If your amount is lost contact the  01871-778844 or 01933-778855');
  }

  public function bkashToken()
  {
    $idtoken = bkash_Get_Token();
    return response($idtoken);
  }

  public function createPayment()
  {
    $amount = \request('amount');
    $invoice = \request('ref_no'); // must be unique
    $intent = \request('intent');

    $data = create_bkash_payment($amount, $invoice, $intent);
    return response($data);
  }

  public function executePayment()
  {
    $paymentID = request('paymentID');
    $execute = execute_bkash_payment($paymentID);
    return response($execute);
  }
}
