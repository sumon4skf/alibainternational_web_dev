@php
$currency = get_setting('currency_icon');

$price = getArrayKeyData($item, 'Price', []);
$QuantityRanges = getArrayKeyData($item, 'QuantityRanges', []);

$OriginalPrice = getArrayKeyData($price, 'OriginalPrice', 0);

@endphp


@if (!empty($QuantityRanges))
<table class="table table-bordered table-sm text-center">
  @php
  $heading = '';
  $body = '';
  $price = 0;
  $QuantityRanges = collect($QuantityRanges)->sortBy('MinQuantity');
  @endphp

  @foreach ($QuantityRanges as $range)
  @php
  $iteration = $loop->iteration;
  $price = convertedPrice($range['Price']['OriginalPrice']);
  $rangeQty = $range['MinQuantity'];
  $nextRange = collect($QuantityRanges)->skip($iteration)->take(1)->first();
  $minQuantity = $iteration == 1 ? 'minQuantity' : '';
  if($nextRange){
  $heading .= '<td><span class="price"> <span id="'.$minQuantity.'">'.$rangeQty.'</span> - '.($nextRange['MinQuantity']
      - 1).'</span></td>';
  }else{
  $heading .= '<td><span class="price">'.$rangeQty.' + </span></td>';
  }
  $body .= '<td><span class="price">'.$currency.' '.$price.'</span></td>';
  @endphp
  @endforeach
  <tbody>
    <tr>{!! $heading !!}</tr>
    <tr>{!! $body !!}</tr>
  </tbody>
</table>
@elseif($price)
<span class="price">{{$currency.' '.convertedPrice($OriginalPrice)}}</span>
@endif