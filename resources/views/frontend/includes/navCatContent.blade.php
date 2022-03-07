@php
$catLoader = get_setting('category_image_loader');
$allCategories = get_all_taxonomies();
$categories = filter_taxonomies($allCategories, 'ParentId', null);
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
    @php
    $cat1_name = $category['name'] ?? '/';
    $cat1_url = $category['slug'] ?? '/';
    $otc_id = $category['otc_id'] ?? 0;
    $cat1_children = filter_taxonomies($allCategories, 'ParentId', $otc_id);
    $cat1_children_count = $category['children_count'] ?? 0;
    $cat1_icon = $category['icon'] ?? 0;
    @endphp

    @if ($cat1_children_count)
    <li class="dropdown dropdown-mega-menu">
      <a class="dropdown-item nav-link dropdown-toggler parent_menu" href="{{url($cat1_url)}}" data-toggle="dropdown">
        @if ($cat1_icon)
        <img src="{{asset($cat1_icon)}}" style="width:20px" class="mr-1">
        @else
        <i class="flaticon-tv"></i>
        @endif
        <span>{{$cat1_name}}</span></a>
      <div class="dropdown-menu">
        <ul class="mega-menu d-lg-flex">
          <li class="mega-menu-col col-md-12">
            <ul class="d-lg-flex">
              @foreach ($cat1_children as $childOne)
              @php
              $cat2_name = $childOne['name'] ?? '/';
              $cat2_url = $childOne['slug'] ?? '/';
              $cat2_otc_id = $childOne['otc_id'] ?? 0;
              $cat2_children = filter_taxonomies($allCategories, 'ParentId', $cat2_otc_id);
              @endphp
              <li class="mega-menu-col mb-3 col-md-4">
                <ul>
                  <li class="dropdown-header mt-2 mt-md-0">
                    <a href="{{url("{$cat1_url}/{$cat2_url}")}}">{{$cat2_name}}</a>
                  </li>
                  @foreach ($cat2_children as $childTwo)
                  @php
                  $cat3_name = $childTwo['name'] ?? 'n/a';
                  $cat3_url = $childTwo['slug'] ?? '/';
                  @endphp
                  <li><a class="dropdown-item nav-link nav_item" href="{{url("{$cat1_url}/{$cat2_url}/{$cat3_url}")}}">{{$cat3_name}}</a></li>
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
  <a class="dropdown-item nav-link nav_item" href="{{url($cat1_url)}}">
    @if ($cat1_icon)
    <img src="{{asset($cat1_icon)}}" style="width:22px" class="mr-1">
    @else
    <i class="flaticon-tv"></i>
    @endif
    <span>{{$cat1_name}}</span>
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