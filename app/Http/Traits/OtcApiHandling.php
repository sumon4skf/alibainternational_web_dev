<?php

namespace App\Http\Traits;

use App\Models\Content\Order;
use App\Models\Content\RecentProducts;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Api Responser Trait
|--------------------------------------------------------------------------
|
| This trait will be used for any response we sent to clients.
|
*/

trait OtcApiHandling
{

  public function updateOrInsertRecentProducts($item)
  {
    $view_uid = Cookie::get('recent_view_uid');
    if (!$view_uid) {
      $view_uid = Str::random(60);
      Cookie::queue('recent_view_uid', $view_uid, 10);
    }

    $ItemId = getArrayKeyData($item, 'Id', null);
    if (!empty($item)) {
      $data1 = [
        'ItemId' => $ItemId,
        'CategoryId' => getArrayKeyData($item, 'CategoryId')
      ];
      $data2 =  [
        'Title' => getArrayKeyData($item, 'Title'),
        'ProviderType' => getArrayKeyData($item, 'ProviderType'),
        'VendorId' => getArrayKeyData($item, 'VendorId'),
        'VendorName' => getArrayKeyData($item, 'VendorName'),
        'VendorScore' => getArrayKeyData($item, 'VendorScore'),
        'BrandId' => getArrayKeyData($item, 'BrandId'),
        'BrandName' => getArrayKeyData($item, 'BrandName'),
        'TaobaoItemUrl' => getArrayKeyData($item, 'TaobaoItemUrl'),
        'MainPictureUrl' => getArrayKeyData($item, 'MainPictureUrl'),
        'MasterQuantity' => getArrayKeyData($item, 'MasterQuantity'),
        'FirstLotQuantity' => getArrayKeyData($item, 'FirstLotQuantity'),
        'NextLotQuantity' => getArrayKeyData($item, 'NextLotQuantity'),
        'recent_view_uid' => $view_uid,
        'user_id' => auth()->check() ? auth()->id() : null,
        'created_at' => now(),
        'updated_at' => now(),
      ];
      $data2['Pictures'] = $this->makeReadableItem($item, 'Pictures');
      $data2['FeaturedValues'] = $this->makeReadableItem($item, 'FeaturedValues');
      $data2['PhysicalParameters'] = $this->PhysicalParameters($item);
      $data2['Price'] = $this->makeReadablePrice($item);
      $data2['DeliveryCosts'] = $this->makeReadableDeliveryCosts($item);
      $data2['Attributes'] = $this->makeReadableAttributes($item);
      $data2['QuantityRanges'] = $this->makeReadableQuantityRanges($item);
      $data2['ConfiguredItems'] = $this->makeReadableConfiguredItems($item);

      RecentProducts::updateOrInsert($data1, $data2);
    }

    return RecentProducts::where('ItemId', $ItemId)->first();
  }

  public function makeReadableItem($item, $key = 'Pictures')
  {
    $items = getArrayKeyData($item, $key, []);
    return json_encode($items);
  }

  public function PhysicalParameters($item)
  {
    $items = getArrayKeyData($item, 'PhysicalParameters', []);
    return getArrayKeyData($items, 'Weight', null);
  }

  public function makeReadablePrice($item)
  {
    $Price = getArrayKeyData($item, 'Price', []);
    return getArrayKeyData($Price, 'OriginalPrice', 0);
  }

  public function makeReadableDeliveryCosts($item)
  {
    $DeliveryCosts = getArrayKeyData($item, 'DeliveryCosts', []);
    $Price = getArrayKeyData($DeliveryCosts, 'Price', []);
    return getArrayKeyData($Price, 'OriginalPrice', 0);
  }

  public function makeReadableAttributes($item)
  {
    $Attributes = getArrayKeyData($item, 'Attributes', []);
    $modifyAttributes = [];
    foreach ($Attributes as $Attribute) {
      $IsConfigurator = getArrayKeyData($Attribute, 'IsConfigurator', false);
      if ($IsConfigurator) {
        array_push($modifyAttributes, $Attribute);
      }
    }
    return json_encode($modifyAttributes);
  }

  public function makeReadableQuantityRanges($item, $json = true)
  {
    $QuantityRanges = getArrayKeyData($item, 'QuantityRanges', []);
    $modifyQuantityRanges = [];
    foreach ($QuantityRanges as $QuantityRange) {
      $Price = getArrayKeyData($QuantityRange, 'Price', []);
      $QuantityRange['Price'] = getArrayKeyData($Price, 'OriginalPrice', null);
      array_push($modifyQuantityRanges, $QuantityRange);
    }
    return $json ? json_encode($modifyQuantityRanges) : $modifyQuantityRanges;
  }

  public function makeReadableConfiguredItems($item)
  {
    $ConfiguredItems = getArrayKeyData($item, 'ConfiguredItems', []);
    $modifyConfiguredItems = [];
    foreach ($ConfiguredItems as $ConfiguredItem) {
      $Price = getArrayKeyData($ConfiguredItem, 'Price', []);
      $ConfiguredItem['Price'] = getArrayKeyData($Price, 'OriginalPrice', null);
      $ConfiguredItem['QuantityRanges'] = $this->makeReadableQuantityRanges($ConfiguredItem, false);
      array_push($modifyConfiguredItems, $ConfiguredItem);
    }
    return json_encode($modifyConfiguredItems);
  }
}
