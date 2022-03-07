@extends('frontend.layouts.app')

@section('title', 'Search')

@php
$productLoader = get_setting('product_image_loader');
@endphp

@section('content')
<div class="bg_gray breadcrumb_section page-title-mini py-3">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-12">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="{{route('frontend.index')}}">Home</a></li>
          <li class="breadcrumb-item active">Search</li>
          @if ($searchLog)
          @if ($searchLog->search_type == 'picture')
          <li class="breadcrumb-item active">
            <img src="{{asset($searchLog->query_data)}}" style="width:90px" alt="{{request('s')}}">
          </li>
          @endif
          @else
          <li class="breadcrumb-item active">{{request('s')}}</li>
          @endif
        </ol>
      </div>
    </div>

  </div>
</div>

<div class="main_content">
  <div class="section pt-4">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <div class="justify-content-center row row-cols-lg-5 row-cols-md-4 row-cols-sm-3 row-cols-2">
            @include('frontend.ajaxComponent.singleProduct', ['Product' => $items, 'productLoader' => $productLoader])

            {{ $items->links() }}

          </div> <!-- row -->
        </div>
      </div>

    </div>
  </div> <!-- END SECTION SHOP -->

</div> <!-- END MAIN CONTENT -->

<div id="reload_content" class="d-none">
  <div class="reload_div d-block my-4 text-center">
    <a href="{{url()->full()}}" class="btn btn-danger">Page not found! Reload</a>
  </div>
</div>

@endsection