@extends('frontend.layouts.app')

@section('title', $subcategory ? $subcategory->name : $category->name)

@php
$productLoader = get_setting('product_image_loader');
@endphp

@section('content')
<div class="breadcrumb_section bg_gray page-title-mini py-3">
  <div class="container">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="{{route('frontend.index')}}">Home</a></li>
      <li class="breadcrumb-item"><a href="{{url($category->slug)}}">{{$category->name}}</a></li>
      @isset($subSubcategory)
      <li class="breadcrumb-item"><a href="{{url($category->slug.'/'.$subcategory->slug)}}">{{$subcategory->name}}</a>
      </li>
      <li class="breadcrumb-item active">{{$subSubcategory->name}}</li>
      @else
      @if($subcategory)
      <li class="breadcrumb-item active">{{$subcategory->name}}</li>
      @endif
      @endisset
    </ol>
  </div> <!-- END CONTAINER-->
</div> <!-- END SECTION BREADCRUMB -->


<div class="section pt-4">
  <div class="container">
    <div class="card">
      <div class="card-body">

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
    </div> <!-- card-body -->

  </div>
</div> <!-- END SECTION SHOP -->



@endsection