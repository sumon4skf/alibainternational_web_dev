@php
$Attributes = isset($Attributes) ? collect($Attributes)->where('IsConfigurator', true)->filter(function ($colour){
return false !== stristr($colour['PropertyName'], 'color') || false !== stristr($colour['PropertyName'], 'colour') ||
array_key_exists('ImageUrl', $colour);
//return array_key_exists('ImageUrl', $colour);
}) : collect([]);

@endphp


@foreach($Attributes as $Attribute)
@php
$PropertyName = $Attribute['PropertyName'];
$PropertyValue = $Attribute['Value'];
$filterClass = md5($PropertyName.$PropertyValue);
@endphp

@if($loop->first)
@php
$newPropertyName = $PropertyName;
@endphp
<div class="pr_switch_wrap">
  <p class="float-none mb-2 switch_lable text-capitalize">
    {{$PropertyName}} : <span class="ColorName"></span>
  </p>
  <p class="product_size_switch">
    @endif

    @if($newPropertyName !== $PropertyName)
  </p>
</div>
<div class="pr_switch_wrap">
  <p class="float-none mb-2 switch_lable text-capitalize">
    {{$PropertyName}} : <span class="ColorName"></span>
  </p>
  <p class="product_size_switch">
    @endif

    <span class="@if($loop->first) active @endif" title="{{$PropertyValue}}" data-filter="{{$filterClass}}"
      data-color-name="{{$PropertyValue}}"
      data-fullimageurl="@isset($Attribute['ImageUrl']) {{$Attribute['ImageUrl']}} @endisset">
      @if (array_key_exists('MiniImageUrl', $Attribute))
      <img src="{{$Attribute['MiniImageUrl']}}" style="height: 44px" alt="{{$PropertyValue}}">
      @elseif(array_key_exists('ImageUrl',$Attribute))
      <img src="{{$Attribute['ImageUrl']}}" style="height: 44px" alt="{{$PropertyValue}}">
      @else
      {{$PropertyValue}}
      @endif
    </span>

    @php
    $newPropertyName = $PropertyName;
    @endphp
    @endforeach
</div>