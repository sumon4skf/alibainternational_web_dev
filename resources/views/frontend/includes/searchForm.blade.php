<form action="{{route('frontend.pictureSearch')}}" class="d-none" id="pictureSearchForm" method="POST"
  enctype="multipart/form-data">
  @csrf
  <input type="file" name="picture" id="pictureSearch" class="d-none" accept="image/*">
</form>

<form action="{{route('frontend.search')}}" class="w-100" method="GET">
  @php
  $name = request('s');
  @endphp
  <div class="input-group input-search-group">
    <input name="s" class="form-control nav_search_field" value="{{$name}}"
      placeholder="Search from 90 million products of China" type="text" autocomplete="off" required="required">
    <div class="input-group-append search_group_button">
      <button type="button" class="btn pictureSearchBtn" data-toggle="tooltip" title="@lang('Picture search')"
        style="border-right: 2px solid rgba(255, 255, 255, 0.72);">
        <i class="icon-camera-outline"></i>
      </button>
      <button type="submit" class="btn btn-default" data-toggle="tooltip" title="@lang('Plain text search')">
        <i class="icon-search"></i>
      </button>
    </div>
  </div> <!-- input-group -->
</form>