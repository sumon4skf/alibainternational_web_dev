@php
$catLoader = get_setting('category_image_loader');
$categories = get_all_taxonomies();
$categories = $categories->whereNull('ParentId')->whereNotNull('active')->sortBy('id');
$isHome = Route::is('frontend.index');
@endphp

@if ($isHome)
<style>
  .nav_cat.collapse:not(.show) {
    display: block;
  }
</style>
@endif

<div id="navCatContent" class="nav_cat navbar collapse">
  <ul>
    @forelse ($categories as $category)
    @if ($category->children_count)
    <li class="dropdown dropdown-mega-menu">
      <a class="dropdown-item nav-link dropdown-toggler parent_menu" href="{{url($category->slug)}}"
        data-toggle="dropdown">
        @if ($category->icon)
        <img src="{{asset($category->icon)}}" style="width:20px" class="mr-1">
        @else
        <i class="flaticon-tv"></i>
        @endif
        <span>{{$category->name}}</span></a>
      <div class="dropdown-menu">
        <ul class="mega-menu d-lg-flex">
          <li class="mega-menu-col col-md-12">
            <ul class="d-lg-flex">
              @foreach ($category->children as $childOne)
              <li class="mega-menu-col mb-3 col-md-4">
                <ul>
                  <li class="dropdown-header mt-2 mt-md-0">
                    <a href="{{url("{$category->slug}/{$childOne->slug}")}}">{{$childOne->name}}</a>
                  </li>
                  @foreach ($childOne->children as $childTwo)
                  <li><a class="dropdown-item nav-link nav_item" href="{{url("{$category->slug}/{$childOne->slug}/{$childTwo->slug}")}}">{{$childTwo->name}}</a></li>
                  @endforeach

                </ul>
              </li>
          </li>
          @endforeach

        </ul>
    </li>
  </ul>
</div>
</li>
@else
<li>
  <a class="dropdown-item nav-link nav_item" href="{{url($category->slug)}}">
    @if ($category->icon)
    <img src="{{asset($category->icon)}}" style="width:22px" class="mr-1">
    @else
    <i class="flaticon-tv"></i>
    @endif
    <span>{{$category->name}}</span>
  </a>
</li>
@endif
@empty
@endforelse

<li>
  <ul class="more_slide_open">
    <li><a class="dropdown-item nav-link nav_item" href="#!"><i class="flaticon-fax"></i> <span>No Category</span></a>
    </li>
  </ul>
</li>
</ul>
</div>