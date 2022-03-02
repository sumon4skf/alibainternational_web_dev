<?php

use GuzzleHttp\Client;


if (!function_exists('load_otc_api')) {
  function load_otc_api()
  {
    $provider = get_setting('otc_api_provider');
    $base_url = '';
    if ($provider == 'otcommerce') {
      $base_url = get_setting('otcommerce_api_url');
    }
    if ($provider == 'avanteca') {
      $base_url = get_setting('avanteca_api_url');
    }
    return new Client([
      'base_uri' => $base_url,
      // 'timeout' => 8.0
    ]);
  }
}

if (!function_exists('setOtcParams')) {
  function setOtcParams()
  {
    $provider = get_setting('otc_api_provider');
    $api_token = '';
    if ($provider == 'otcommerce') {
      $api_token = get_setting('otcommerce_instance_key');
      return [
        'instanceKey' => $api_token,
        'language' => 'en',
      ];
    }
    if ($provider == 'avanteca') {
      $api_token = get_setting('avanteca_api_token');
      return [
        'api_token' => $api_token,
        'language' => 'en',
      ];
    }
    return [];
  }
}

if (!function_exists('getArrayKeyData')) {
  function getArrayKeyData($array, string $key, $default = null)
  {
    if (is_array($array)) {
      return array_key_exists($key, $array) ? $array[$key] : $default;
    }
    return $default;
  }
}


if (!function_exists('SearchItemsFrame')) {
  function SearchItemsFrame($search, $type, $offset = 1, $limit = 35)
  {

    if ($type == 'picture') {
      $xmlParameters = "<SearchItemsParameters>";
      $xmlParameters .= " <Provider>Alibaba1688</Provider>";
      $xmlParameters .= " <LanguageOfQuery>en</LanguageOfQuery>";
      $xmlParameters .= "<ImageUrl>{$search}</ImageUrl>";
      $xmlParameters .= "</SearchItemsParameters>";
    } else {
      $xmlParameters = "<SearchItemsParameters>";
      $xmlParameters .= "<LanguageOfQuery>en</LanguageOfQuery>";
      $xmlParameters .= "<ItemTitle>{$search}</ItemTitle>";
      $xmlParameters .= "</SearchItemsParameters>";
    }

    $query = setOtcParams();
    $query['xmlParameters'] = $xmlParameters;
    $query['framePosition'] = $offset;
    $query['frameSize'] = $limit;

    $response = load_otc_api()->request('GET', 'SearchItemsFrame', ['query' => $query]);
    $statusCode = $response->getStatusCode();
    if ($statusCode == 200) {
      $body = json_decode($response->getBody(), true);
      $Result = getArrayKeyData($body, 'Result', []);
      return getArrayKeyData($Result, 'Items', []);
      // return getArrayKeyData($Items, 'Content', []);
    }
    return [];
  }
}


if (!function_exists('GetItemFullInfo')) {
  function GetItemFullInfo($item_id)
  {
    $query = setOtcParams();
    $query['itemId'] = $item_id;
    $response = load_otc_api()->request('GET', 'GetItemFullInfo', ['query' => $query]);
    $body = json_decode($response->getBody(), true);
    if ($response->getStatusCode() == 200) {
      $body = json_decode($response->getBody(), true);
      return getArrayKeyData($body, 'OtapiItemFullInfo', []);
    }
    return [];
  }
}

if (!function_exists('GetItemDescription')) {
  function GetItemDescription($item_id)
  {
    $provider = get_setting('otc_api_provider');
    $query = setOtcParams();
    $query['itemId'] = $item_id;

    $response = load_otc_api()->request('GET', 'GetItemDescription', ['query' => $query]);

    if ($response->getStatusCode() == 200) {
      $content = json_decode($response->getBody(), true);
      if ($provider == 'otcommerce') {
        $OtapiItemDescription = getArrayKeyData($content, 'OtapiItemDescription', []);
        return getArrayKeyData($OtapiItemDescription, 'ItemDescription', []);
      } else {
        return getArrayKeyData($content, 'ItemDescription', []);
      }
    }
    return [];
  }
}

if (!function_exists('GetVendorInfo')) {
  function GetVendorInfo($vendorId)
  {
    $query = setOtcParams();
    $query['vendorId'] = $vendorId;
    $response = load_otc_api()->request('GET', 'GetVendorInfo', ['query' => $query]);
    if ($response->getStatusCode() == 200) {
      $content = json_decode($response->getBody(), true);
      return getArrayKeyData($content, 'VendorInfo', '');
    }
    return [];
  }
}
