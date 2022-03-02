@php
  $Attributes = isset($Attributes) ? collect($Attributes)->where('IsConfigurator', true)->filter(function ($colour){
                      return false !== stristr($colour['PropertyName'], 'color') || false !== stristr($colour['PropertyName'], 'colour') || array_key_exists('ImageUrl', $colour);
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

        <span class="@if($loop->first) active @endif" title="{{$PropertyValue}}"
              data-filter="{{$filterClass}}" data-color-name="{{$PropertyValue}}"
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

    {{--@if (count($colours))--}}
    {{--    <div class="pr_switch_wrap">--}}
    {{--        <p class="float-none mb-2 switch_lable text-capitalize">--}}
    {{--            Colour : <span class="ColorName"></span>--}}
    {{--        </p>--}}
    {{--        <p class="product_size_switch">--}}
    {{--            @foreach ($colours as $colour)--}}
    {{--                @php--}}
    {{--                    $PropertyName = $colour->PropertyName;--}}
    {{--                    $Value = $colour->Value;--}}
    {{--                     $filterClass = md5($PropertyName . $Value);--}}
    {{--                @endphp--}}
    {{--                <span class="@if($loop->first) active @endif" title="{{$Value}}"--}}
    {{--                      data-filter="{{$filterClass}}" data-color-name="{{$Value}}"--}}
    {{--                      data-fullimageurl="@isset($colour->ImageUrl) {{$colour->ImageUrl}} @endisset">--}}
    {{--      @if (isset($colour->MiniImageUrl))--}}
    {{--                        <img src="{{$colour->MiniImageUrl}}" style="height: 44px" alt="{{$Value}}">--}}
    {{--                    @elseif(isset($colour->ImageUrl))--}}
    {{--                        <img src="{{$colour->ImageUrl}}" style="height: 44px" alt="{{$Value}}">--}}
    {{--                    @else--}}
    {{--                        {{$colour->Value}}--}}
    {{--                    @endif--}}
    {{--    </span>--}}
    {{--            @endforeach--}}
    {{--        </p>--}}
    {{--    </div>--}}
    {{--@elseif (count($specification))--}}
    {{--    <div class="pr_switch_wrap">--}}
    {{--        <p class="float-none mb-2 switch_lable text-capitalize">--}}
    {{--            Specification : <span class="ColorName"></span>--}}
    {{--        </p>--}}
    {{--        <p class="product_size_switch">--}}
    {{--            @foreach ($specification as $specific)--}}
    {{--                @php--}}
    {{--                    $PropertyName = $specific->PropertyName;--}}
    {{--                    $Value = $specific->Value;--}}
    {{--                     $filterClass = md5($PropertyName . $Value);--}}
    {{--                @endphp--}}

    {{--                <span class="@if($loop->first) active @endif"--}}
    {{--                      title="{{$Value}}"--}}
    {{--                      data-filter="{{$filterClass}}"--}}
    {{--                      data-color-name="{{$Value}}"--}}
    {{--                      data-fullimageurl="@isset($specific->ImageUrl) {{$specific->ImageUrl}} @endisset">--}}

    {{--      @if (isset($specific->MiniImageUrl))--}}
    {{--                        <img src="{{$specific->MiniImageUrl}}" style="height: 44px;" alt="{{$Value}}">--}}
    {{--                    @elseif(isset($specific->ImageUrl))--}}
    {{--                        <img src="{{$specific->ImageUrl}}" style="height: 44px" alt="{{$Value}}">--}}
    {{--                    @else--}}
    {{--                        {{$specific->Value}}--}}
    {{--                    @endif--}}
    {{--    </span>--}}
    {{--            @endforeach--}}
    {{--        </p>--}}
    {{--    </div>--}}
    {{--@endif--}}
