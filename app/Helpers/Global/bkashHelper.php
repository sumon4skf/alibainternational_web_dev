<?php


if (!function_exists('bkash_Get_Token')) {
  function bkash_Get_Token()
  {
    $post_token = array(
      'app_key' => config('bkash.app_key'),
      'app_secret' => config('bkash.app_secret'),
    );

    $url = curl_init(config('bkash.tokenURL'));
    $proxy = config('bkash.proxy');
    $posttoken = json_encode($post_token);
    $header = array(
      'Content-Type:application/json',
      'password:' . config('bkash.password'),
      'username:' . config('bkash.username')
    );

    curl_setopt($url, CURLOPT_HTTPHEADER, $header);
    curl_setopt($url, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($url, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($url, CURLOPT_POSTFIELDS, $posttoken);
    curl_setopt($url, CURLOPT_FOLLOWLOCATION, 1);
    //curl_setopt($url, CURLOPT_PROXY, $proxy);
    $resultdata = curl_exec($url);
    curl_close($url);
    $idtoken = json_decode($resultdata, true);
    // $idtoken = key_exists('id_token', $idtoken) ? $idtoken['id_token'] : null;
    if (key_exists('id_token', $idtoken)) {
      session(['bkash_token' => $idtoken['id_token']]);
    }
    return $idtoken;
  }
}


if (!function_exists('create_bkash_payment')) {
  function create_bkash_payment($amount, $invoice, $intent)
  {
    $proxy = config('bkash.proxy');
    $createpaybody = array('amount' => $amount, 'currency' => 'BDT', 'merchantInvoiceNumber' => $invoice, 'intent' => $intent);
    $url = curl_init(config('bkash.createURL'));

    $createpaybodyx = json_encode($createpaybody);

    $header = array(
      'Content-Type:application/json',
      'authorization:' . session('bkash_token'),
      'x-app-key:' . config('bkash.app_key')
    );

    curl_setopt($url, CURLOPT_HTTPHEADER, $header);
    curl_setopt($url, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($url, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($url, CURLOPT_POSTFIELDS, $createpaybodyx);
    curl_setopt($url, CURLOPT_FOLLOWLOCATION, 1);
    //curl_setopt($url, CURLOPT_PROXY, $proxy);

    $resultdata = curl_exec($url);
    curl_close($url);
    return $resultdata;
  }
}

if (!function_exists('execute_bkash_payment')) {

  function execute_bkash_payment($paymentID)
  {

    $executeURL = config('bkash.executeURL');
    $token = session('bkash_token');
    $app_key = config('bkash.app_key');

    $url = curl_init($executeURL . $paymentID);

    $header = array(
      'Content-Type:application/json',
      'authorization:' . $token,
      'x-app-key:' . $app_key
    );

    curl_setopt($url, CURLOPT_HTTPHEADER, $header);
    curl_setopt($url, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($url, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($url, CURLOPT_FOLLOWLOCATION, 1);
    //curl_setopt($url, CURLOPT_PROXY, $proxy);

    $resultdatax = curl_exec($url);
    curl_close($url);
    return $resultdatax;
  }
}




if (!function_exists('bkash_query_payment')) {
  function bkash_query_payment($paymentID)
  {

    $executeURL = 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/query/';
    $token = session('bkash_token');
    $app_key = config('bkash.app_key');

    $url = curl_init($executeURL . $paymentID);

    $header = array(
      'Content-Type:application/json',
      'authorization:' . $token,
      'x-app-key:' . $app_key
    );

    curl_setopt($url, CURLOPT_HTTPHEADER, $header);
    curl_setopt($url, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($url, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($url, CURLOPT_FOLLOWLOCATION, 1);
    //curl_setopt($url, CURLOPT_PROXY, $proxy);

    $resultdatax = curl_exec($url);
    curl_close($url);
    return $resultdatax;
  }
}

if (!function_exists('bkash_search_tran')) {
  function bkash_search_tran($trxID)
  {

    $executeURL = 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/search/';
    $token = session('bkash_token');
    $app_key = config('bkash.app_key');

    $url = curl_init($executeURL . $trxID);

    $header = array(
      'Content-Type:application/json',
      'authorization:' . $token,
      'x-app-key:' . $app_key
    );

    curl_setopt($url, CURLOPT_HTTPHEADER, $header);
    curl_setopt($url, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($url, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($url, CURLOPT_FOLLOWLOCATION, 1);
    //curl_setopt($url, CURLOPT_PROXY, $proxy);

    $resultdatax = curl_exec($url);
    curl_close($url);
    return $resultdatax;
  }
}



if (!function_exists('bkash_refund')) {
  function bkash_refund(array $data)
  {
    $data = [
      "paymentID" => "GYA3UX31626110347969",
      "amount" => "1415",
      "trxID" => "8GC504U7DL",
      "sku" => "CNB0273",
      "reason" => "Product Fault",
    ];

    if (empty($data)) {
      return [];
    }

    $executeURL = 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/refund';

    $url = curl_init($executeURL);
    $createpaybodyx = json_encode($data);
    $token = session('bkash_token');
    $app_key = config('bkash.app_key');
    $header = array(
      'Content-Type:application/json',
      'authorization:' . $token,
      'x-app-key:' . $app_key
    );

    curl_setopt($url, CURLOPT_HTTPHEADER, $header);
    curl_setopt($url, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($url, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($url, CURLOPT_POSTFIELDS, $createpaybodyx);
    curl_setopt($url, CURLOPT_FOLLOWLOCATION, 1);
    //curl_setopt($url, CURLOPT_PROXY, $proxy);
    $resultdata = curl_exec($url);

    return $resultdata;
  }
}

if (!function_exists('bkash_refund_status')) {
  function bkash_refund_status(array $data)
  {
    $data = [
      "paymentID" => "7QQA4RO1626112876239",
      "trxID" => "8GD604U7DW",
    ];

    if (empty($data)) {
      return [];
    }

    $executeURL = 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/refund';

    $url = curl_init($executeURL);
    $createpaybodyx = json_encode($data);
    $token = session('bkash_token');
    $app_key = config('bkash.app_key');
    $header = array(
      'Content-Type:application/json',
      'authorization:' . $token,
      'x-app-key:' . $app_key
    );

    curl_setopt($url, CURLOPT_HTTPHEADER, $header);
    curl_setopt($url, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($url, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($url, CURLOPT_POSTFIELDS, $createpaybodyx);
    curl_setopt($url, CURLOPT_FOLLOWLOCATION, 1);
    //curl_setopt($url, CURLOPT_PROXY, $proxy);
    $resultdata = curl_exec($url);

    return $resultdata;
  }
}











if (!function_exists('transaction_cookie_set')) {
  function transaction_cookie_set($transaction_id)
  {
    cookie()->queue('_tran', $transaction_id, 20); // for 20 minutes
  }
}
