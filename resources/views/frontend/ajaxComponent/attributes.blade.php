@php
$Attributes = isset($Attributes) ? collect($Attributes)->filter(function ($colour){
return false !== stristr($colour['PropertyName'], 'color') || false !== stristr($colour['PropertyName'], 'colour') ||
array_key_exists('ImageUrl', $colour);
//return array_key_exists('ImageUrl', $colour);
}) : collect([]);

@endphp


<div class="pr_switch_wrap">
  @foreach($Attributes as $key => $Attribute)
  @php
  $PropertyName = getArrayKeyData($Attribute, 'PropertyName');
  $PropertyValue = getArrayKeyData($Attribute, 'Value');
  $filterClass = md5($PropertyName.$PropertyValue);
  $MiniImageUrl = getArrayKeyData($Attribute, 'MiniImageUrl');
  $ImageUrl = getArrayKeyData($Attribute, 'ImageUrl');
  $image_path = $MiniImageUrl ? $MiniImageUrl : $ImageUrl;
  $hasImage = ($MiniImageUrl || $ImageUrl) ? 'hasImage' : '';
  @endphp

  @if($loop->first)
  <div class="float-none mb-2 switch_lable text-capitalize">
    {{$PropertyName}} : <span class="ColorName"></span>
  </div>
  <div class="product_size_switch">
    @endif

    <span class="@if($loop->first) active @endif {{$hasImage}}" title="{{$PropertyValue}}"
      data-filter="{{$filterClass}}" data-color-name="{{$PropertyValue}}" data-fullimageurl="{{$ImageUrl}}">
      @if ($hasImage)
      <img src="{{$image_path}}" style="height: 44px;width: 44px" alt="{{$PropertyValue}}">
      @else
      {{$PropertyValue}}
      @endif
    </span>

    @if($loop->last)
  </div>
  @endif

  @endforeach
</div>