@extends('frontend.layouts.app')

@section('title', $subcategory ? $subcategory->name : $category->name)

@php
$productLoader = get_setting('product_image_loader');
@endphp

@section('content')
<div class="breadcrumb_section bg_gray page-title-mini py-3">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-12">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="{{route('frontend.index')}}">Home</a></li>
          <li class="breadcrumb-item"><a href="{{url($category->slug)}}">{{$category->name}}</a></li>
          @isset($subSubcategory)
          <li class="breadcrumb-item"><a
              href="{{url($category->slug.'/'.$subcategory->slug)}}">{{$subcategory->name}}</a></li>
          <li class="breadcrumb-item active">{{$subSubcategory->name}}</li>
          @else
          @if($subcategory)
          <li class="breadcrumb-item active">{{$subcategory->name}}</li>
          @endif
          @endisset
        </ol>
      </div>
    </div>
  </div> <!-- END CONTAINER-->
</div> <!-- END SECTION BREADCRUMB -->

<!-- START MAIN CONTENT -->
<div class="main_content">
  <div class="section">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="justify-content-center row row-cols-lg-5 row-cols-md-4 row-cols-sm-3 row-cols-2"
            id="productContainer" style="min-height: 360px;">
            @include('frontend.ajaxComponent.singleProduct', ['Product' => $items, 'productLoader' => $productLoader])
          </div>
        </div>
        <div class="col-12">
          {{ $items->links() }}
        </div>
      </div>
    </div>
  </div> <!-- END SECTION SHOP -->

</div> <!-- END MAIN CONTENT -->


@endsection