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
use NagadPayment;

class PaymentNagadController extends Controller
{
  public function payment_process()
  {
    $tran_id = \request('tran_id');
    $OrderId = str_replace('-', '', $tran_id);
    if (config('nagad.sandbox_mode') == 'sandbox') {
      $amount = 5;
    } else {
      $amount = ceil(\request('amount'));
    }
    $OrderId = $OrderId . 'N' . rand(1, 99);
    $MerchantID = config('nagad.merchant_id');
    $DateTime = Date('YmdHis');
    $random = generateRandomString();

    if(config('nagad.sandbox_mode') == 'sandbox'){
      $PostURL = "http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/initialize/" . $MerchantID . "/" . $OrderId;
    }else{
      $PostURL = "https://api.mynagad.com/api/dfs/check-out/initialize/" . $MerchantID . "/" . $OrderId;
    }

    $merchantCallbackURL = config('nagad.callback_url');
    $SensitiveData = array(
      'merchantId' => $MerchantID,
      'datetime' => $DateTime,
      'orderId' => $OrderId,
      'challenge' => $random
    );

//    dd(config('nagad.sandbox_mode'));

    $PostData = array(
      'accountNumber' => config('nagad.merchant_number'), //Replace with Merchant Number
      'dateTime' => $DateTime,
      'sensitiveData' => EncryptDataWithPublicKey(json_encode($SensitiveData)),
      'signature' => SignatureGenerate(json_encode($SensitiveData))
    );

    $Result_Data = HttpPostMethod($PostURL, $PostData);

//    dd($Result_Data);

    if (isset($Result_Data['sensitiveData']) && isset($Result_Data['signature'])) {
      if ($Result_Data['sensitiveData'] != "" && $Result_Data['signature'] != "") {

        $PlainResponse = json_decode(DecryptDataWithPrivateKey($Result_Data['sensitiveData']), true);

        if (isset($PlainResponse['paymentReferenceId']) && isset($PlainResponse['challenge'])) {

          $paymentReferenceId = $PlainResponse['paymentReferenceId'];
          $randomServer = $PlainResponse['challenge'];

          $SensitiveDataOrder = array(
            'merchantId' => $MerchantID,
            'orderId' => $OrderId,
            'currencyCode' => '050',
            'amount' => $amount,
            'challenge' => $randomServer
          );

          // print_r($SensitiveDataOrder);
          // exit;

          $merchantAdditionalInfo = '{"Service Name": "chinabazarb2b", "tran_id" : "'.$tran_id.'" }';

          $PostDataOrder = array(
            'sensitiveData' => EncryptDataWithPublicKey(json_encode($SensitiveDataOrder)),
            'signature' => SignatureGenerate(json_encode($SensitiveDataOrder)),
            'merchantCallbackURL' => $merchantCallbackURL,
            'additionalMerchantInfo' => json_decode($merchantAdditionalInfo)
          );

// print_r($SensitiveDataOrder);
// echo "<br>";
// print_r($PostDataOrder);
// echo "<br>";
// exit;
          if(config('nagad.sandbox_mode') == 'sandbox'){
            $OrderSubmitUrl = "http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/complete/" . $paymentReferenceId;
          }else{
            $OrderSubmitUrl = "https://api.mynagad.com/api/dfs/check-out/complete/" . $paymentReferenceId;
          }

          $Result_Data_Order = HttpPostMethod($OrderSubmitUrl, $PostDataOrder);
//dd($Result_Data_Order);
          // echo json_encode($Result_Data_Order);

          if ($Result_Data_Order['status'] == "Success") {
//            dd($Result_Data_Order['callBackUrl']);
            return response([
              'status' => true,
              'redirectUrl' => $Result_Data_Order['callBackUrl'],
            ]);
//            $url = json_encode($Result_Data_Order['callBackUrl']);
//            echo "<script>window.open($url, '_self')</script>";
          } else {
            echo json_encode($Result_Data_Order);
          }
        } else {
          echo json_encode($PlainResponse);
        }
      }
    }
    // dd($redirectUrl);
//    return response(['status' => $status, 'redirectUrl' => $redirectUrl]);
  }

  public function nagad_payment_varify()
  {
    $tran_id = Cookie::get('_tran');

    $Query_String = explode("&", explode("?", $_SERVER['REQUEST_URI'])[1]);
    $payment_ref_id = substr($Query_String[2], 15);
    if(config('nagad.sandbox_mode') == 'sandbox'){
      $url = "http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/verify/payment/" . $payment_ref_id;
    }else{
      $url = "https://api.mynagad.com/api/dfs/verify/payment/" . $payment_ref_id;
    }
    $json = HttpGet($url);
    $arr = json_decode($json, true);
$status = key_exists('status', $arr) ? $arr['status'] : '';
//   dd($arr);

    // dd($tran_id);
    $order = Order::with('user')->where('transaction_id', $tran_id)->first();
    $invoice = Invoice::with('user')->where('invoice_no', $tran_id)->first();
    if ($status == 'Success') {
      $nagadResponse = key_exists('additionalMerchantInfo', $arr) ? json_decode($arr['additionalMerchantInfo']) : [];
//      $tran_id = $nagadResponse->tnx_id;
      if ($order) {
        if ($order->status == 'Waiting for Payment') {
          $order->update(['status' => 'Partial Paid']);
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
          return redirect('frontend.user.dashboard', ['tab' => 'orders'])->withFlashDanger('Your Transaction is Invalid');
        }
      }

      if ($invoice) {
        if ($invoice->status == 'Pending') {
          $invoice->update(['status' => 'confirm_received']);
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
      return redirect('frontend.user.dashboard')->withFlashDanger('Your Transaction is Invalid');
    }

    if ($status === 'Aborted') {
      $tran_id = Cookie::get('_tran');
      if ($order) {
        return redirect()->route('frontend.user.failedOrderPayNow', $tran_id)->withFlashDanger('Nagad transaction fail');
      }
      if ($invoice) {
        return redirect()->route('frontend.user.invoice.payNow', $tran_id)->withFlashDanger('Nagad transaction fail');
      }
      return redirect()->route('frontend.user.dashboard', ['tab' => 'orders'])->withFlash('Nagad payment cancel');
    }
  }
}
