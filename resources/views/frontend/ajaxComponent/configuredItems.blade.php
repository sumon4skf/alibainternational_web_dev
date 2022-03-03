<?php
$currency = get_setting('currency_icon');
$item = isset($item) ? $item : [];

$ConfiguredItems = array_key_exists('ConfiguredItems', $item) ? collect($item['ConfiguredItems']) : [];
$Attributes = array_key_exists('Attributes', $item) ? collect($item['Attributes']) : [];
$QuantityRanges = array_key_exists('QuantityRanges', $item) ? collect($item['QuantityRanges']) : [];
$itemPrice = array_key_exists('Price', $item) ? collect($item['Price']) : [];
$ActualWeightInfo = array_key_exists('ActualWeightInfo', $item) ? collect($item['ActualWeightInfo']) : [];
$BatchLotQuantity = array_key_exists('BatchLotQuantity', $item) ? $item['BatchLotQuantity'] : 1;

$price = 0;

if (count($QuantityRanges)) {
    $calculate = collect($QuantityRanges)->sortBy('MinQuantity')->first();
    $price = $calculate['Price']['OriginalPrice'];
} else {
    $price = isset($itemPrice['OriginalPrice']) ? $itemPrice['OriginalPrice'] : 0;
}

$price = convertedPrice($price);
$itemBody = '';
$attributeHead = '';

if (count($ConfiguredItems)) {
    foreach ($ConfiguredItems as $parentIndex => $configItem) {
        $bodyTdItem = '';
        $filterClass = '';
        $itemAttributes = [];
        foreach ($configItem['Configurators'] as $index => $attrConfig) {
            $Pid = $attrConfig['Pid'];
            $Vid = $attrConfig['Vid'];
            $isAttribute = $Attributes->where('Pid', $Pid)->where('Vid', $Vid)->first();
            $isAttribute = is_null($isAttribute) ? $Attributes->where('Vid', $Vid)->first() : $isAttribute;
//            $isAttribute = $Attributes->filter(function ($attrItem) use ($attrConfig) {
//                return false !== stristr($attrItem->Vid ?? 'na', $attrConfig->Vid ?? 'nothing');
//            })->first();
            if ($isAttribute) {
                $PropertyName = $isAttribute['PropertyName'];
                $Value = $isAttribute['Value'];
                $IsConfigurator = $isAttribute['IsConfigurator'];
                $itemAttributes[] = $isAttribute;

                if ($IsConfigurator == false) {
                    if ($parentIndex === 0) {
                        $attributeHead .= '<th class="text-capitalize">' . $PropertyName . '</th>';
                    }
                    $ImageUrl = isset($isAttribute['ImageUrl']) ? $isAttribute['ImageUrl'] : '';
                    $MiniImageUrl = isset($isAttribute['MiniImageUrl']) ? $isAttribute['MiniImageUrl'] : '';
                    if ($ImageUrl && $MiniImageUrl) {
                        $bodyTdItem .= '<td class="align-middle" data-image="' . $ImageUrl . '"><img src="' . $MiniImageUrl . '" style="width:60px" alt="' . $Value . '"></td>';
                    } else {
                        $bodyTdItem .= '<td class="align-middle text-break" style="max-width:100px">' . $Value . '</td>';
                    }
                } else {
                    if (strtolower($PropertyName) !== 'colour' && strtolower($PropertyName) !== 'color') {
                        if (!array_key_exists('ImageUrl', $isAttribute)) {
                            if ($parentIndex === 0) {
                                $attributeHead = '<th class="text-capitalize">' . $PropertyName . '</th>';
                            }
                            $bodyTdItem = '<td class="align-middle text-break" style="max-width:100px">' . $Value . '</td>';
                        }
                        $filterClass .= ' ' . md5($PropertyName . $Value);

                    } elseif (strtolower($PropertyName) == 'color' || strtolower($PropertyName) == 'colour') {
                        $filterClass .= ' ' . md5($PropertyName . $Value);
                    }
                }
            }
        }


        $price = convertedPrice($configItem['Price']['OriginalPrice']);
        $configQtyRange = isset($configItem['QuantityRanges']) ? collect($configItem['QuantityRanges']) : collect([]);

        if (count($configQtyRange)) {
            $firstQty = $configQtyRange->sortBy('MinQuantity')->first();
            if ($firstQty) {
                $price = convertedPrice($firstQty['Price']['OriginalPrice']);
            }
        }

        $proceed = [
            'code' => $configItem['Id'],
            'price' => round($price),
            'QuantityRanges' => $QuantityRanges,
            'Attributes' => $itemAttributes,
        ];

        $disabledInput = '';
        $light = '';
        $configQuantity = $configItem['Quantity'];
        $Quantity = $configQuantity;
        if ($configQuantity) {
            $itemBody .= '<tr class="' . $filterClass . ' ' . $light . '" >';
            $itemBody .= $bodyTdItem;
            $itemBody .= '<td class="align-middle"><span class="priceRate">' . round($price) . '</span></td>';
            $itemBody .= '<td class="align-middle px-0 text-center">';

            $itemBody .= configure_qty_input($configQuantity, $BatchLotQuantity, $configItem['Id'], $proceed);


            $itemBody .= '</td>';
            $itemBody .= '</tr>';
        }
    }
} else {
    $proceed = [
        'code' => $item['Id'],
        'price' => round($price),
        'QuantityRanges' => $QuantityRanges,
        'Attributes' => [],
    ];
    $itemBody .= '<tr class="">';
    $itemBody .= '<td class="align-middle"><span class="priceRate">' . round($price) . '</span></td>';
    $itemBody .= '<td class="align-middle px-0">';   

    $itemBody .= configure_qty_input($item['MasterQuantity'], $BatchLotQuantity, $item['Id'], $proceed);

    $itemBody .= '</td>';
    $itemBody .= '</tr>';
}



function configure_qty_input($MasterQuantity, $BatchLotQuantity, $item_id, $proceed){
  $qty_box = '<div class="input-group input-group-sm">';
  $qty_box .= '<div class="input-group-prepend">';
  $qty_box .= '<button type="button" class="btn btn-quantity minus"><i class="fas icon-minus"></i></button>';
  $qty_box .= '</div>';
  $qty_box .= '<input type="text" name="quantity" class="qty form-control text-center" step="' . $BatchLotQuantity . '"  title="Qty" value="0" id="' . $item_id . '"  max="' . $MasterQuantity . '" size="15">';
  $qty_box .= '<div class="input-group-append">';
  $qty_box .= '<button type="button" class="btn btn-quantity plus"><i class="fas icon-plus"></i></button>';
  $qty_box .= '</div>';
  $qty_box .= '</div>';
  $qty_box .= '<small>' . $MasterQuantity . '</small><br>';

  return $qty_box;
}
    

?>




<table class="table table-bordered text-center" id="itemCalculationTable" style="table-layout: fixed;">
  <thead>
    <tr>
      {!! $attributeHead !!}
      <th>Price ({{$currency}})</th>
      <th>Quantity</th>
    </tr>
  </thead>
  <tbody>
    {!! $itemBody !!}
  </tbody>
</table>