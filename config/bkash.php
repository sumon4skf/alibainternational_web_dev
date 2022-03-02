<?php

return [
  'sandbox_mode' => env('BKASH_CHECKOUT_SANDBOX', 'sandbox'),
  'tokenInfo' => env('BKASH_SHOW_TOKEN_INFO', false),
  'app_key' => env('BKASH_CHECKOUT_APP_KEY', ''),
  'app_secret' => env('BKASH_CHECKOUT_APP_SECRET', ''),
  'username' => env('BKASH_CHECKOUT_USER_NAME', ''),
  'password' => env('BKASH_CHECKOUT_PASSWORD', ''),
  'proxy' => env('BKASH_PROXY', ''),

  'createURL' => env('BKASH_CREATE_URL', 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/create'),
  'executeURL' => env('BKASH_EXECUTE_URL', 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/execute/'),
  'queryURL' => env('BKASH_QUERY_URL', 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/query/'),
  'searchTranURL' => env('BKASH_SEARCH_TRAN_URL', 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/search/'),
  'tokenURL' => env('BKASH_TOKEN_URL', 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/token/grant'),
  'sandbox_script' => env('BKASH_CHECKOUT_SANDBOX_SCRIPT', 'https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js'),
  'live_script' => env('BKASH_CHECKOUT_LIVE_SCRIPT', 'https://scripts.pay.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout.js'),


];
