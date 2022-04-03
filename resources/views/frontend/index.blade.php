@extends('frontend.layouts.app')

@section('title', get_setting('meta_title'))
@section('meta_title', get_setting('meta_title'))
@section('meta_description', get_setting('meta_description'))
@section('meta_image', asset(get_setting('meta_image')))

@php
$recentOrder = isset($recentOrder) ? $recentOrder : null;
$wishlistProduct = isset($wishlistProduct) ? $wishlistProduct : null;
$recentProducts = isset($recentProducts) ? $recentProducts : null;
$someoneBuying = isset($someoneBuying) ? $someoneBuying : null;
$catLoader = get_setting('category_image_loader');
$productLoader = get_setting('product_image_loader');

// initialize the variable
$cusBuyingProduct= null;
$recent = null;
$top_cats = get_top_taxonomies();
@endphp

@section('content')

@isset($announcement)
@if($announcement)
<div class="modal fade subscribe_popup" id="onload-popup" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered" role="document" style="max-width: 605px;">
    <div class="modal-content">
      <div class="modal-body">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"><i class="fas fa-times"></i></span>
        </button>
        <div class="row no-gutters">
          <div class="col-sm-12">
            @if($announcement->thumb_status)
            <img class="img-fluid w-100" src="{{asset($announcement->post_thumb)}}">
            @else
            <div class="card ">
              <div class="card-body">
                {!! $announcement->post_content !!}
              </div> <!-- card-body -->
            </div> <!-- card -->
            @endif
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
@endif
@endisset



@include('frontend.includes.carousel', ['banners' => $banners])

<div class="main_content">
  
  <div class="section pt-3">
    <div class="container">
      <div class="card">
        <div class="card-body">

          <div class="row align-items-center">
            <div class="col-12">
              <div class="border-bottom heading_s4 pb-2">
                <h2>Trending Now</h2>
              </div>
            </div>
            <div class="col-12">
              <div class="category_items">
                <ul>
                  @forelse ($top_cats as $category)
                  @php
                  $cat_name = ($category['name'] ?? '/');
                  $full_url = url(($category['slug'] ?? '/'));
                  $cat_images = asset(($category['picture'] ?? 'images/frontend/ladies-bag.png'));
                  @endphp
                  <li>
                    <a class="" href="{{$full_url}}">
                      <span class="t-imgage">
                        <img width="129" height="129" src="{{$catLoader}}"
                          class="attachment-thumbnail size-thumbnail lazyloaded" alt="{{$cat_name}}"
                          sizes="(max-width: 129px) 100vw, 129px" srcset="{{$cat_images}}" data-ll-status="loaded">
                        <noscript>
                          <img width="129" height="129" src="{{$catLoader}}" class="attachment-thumbnail size-thumbnail"
                            alt="{{$cat_name}}" srcset="{{$cat_images}}" sizes="(max-width: 129px) 100vw, 129px" /></noscript></span>
                      <h2>{{$cat_name}}</h2>
                    </a>
                  </li>
                  @empty
                  @endforelse

                </ul>
              </div>
            </div>
          </div> <!-- row -->

        </div>
      </div>
    </div>
  </div><!--  section -->


  @php

  $rightBanner = json_decode(get_setting('three_column_banners'));
  @endphp

  @if($rightBanner)

  @php
  $left_banner_image = $rightBanner->left_banner_image ?? "";
  $left_banner_image_link = $rightBanner->left_banner_image_link ?? "";
  $middle_banner_image = $rightBanner->middle_banner_image ?? "";
  $middle_banner_image_link = $rightBanner->middle_banner_image_link ?? "";
  $right_banner_image = $rightBanner->right_banner_image ?? "";
  $right_banner_image_link = $rightBanner->right_banner_image_link ?? "";
  @endphp

  <div class="section pt-3">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <div class="row">
            @php
            $left_banner_image = $rightBanner->left_banner_image ?? "";
            $left_banner_image_link = $rightBanner->left_banner_image_link ?? "";
            @endphp
            <div class="col-md-4">
              <div class="banner banner-overlay mb-3">
                <a href="{{$left_banner_image_link}}">
                  <img src="{{asset($left_banner_image)}}" alt="Banner img desc">
                </a>
              </div><!-- End .banner -->
            </div><!-- End .col-md-4 -->
            @php
            $middle_banner_image = $rightBanner->middle_banner_image ?? "";
            $middle_banner_image_link = $rightBanner->middle_banner_image_link ?? "";
            @endphp
            <div class="col-md-4">
              <div class="banner banner-overlay mb-3">
                <a href="{{$middle_banner_image_link}}">
                  <img src="{{asset($middle_banner_image)}}" alt="Banner img desc">
                </a>
              </div><!-- End .banner banner-overlay -->
            </div><!-- End .col-md-4 -->
            @php
            $right_banner_image = $rightBanner->right_banner_image ?? "";
            $right_banner_image_link = $rightBanner->right_banner_image_link ?? "";
            @endphp
            <div class="col-md-4">
              <div class="banner banner-overlay mb-3">
                <a href="{{$right_banner_image_link}}">
                  <img src="{{asset($right_banner_image)}}" alt="Banner img desc">
                </a>
              </div><!-- End .banner -->
            </div><!-- End .col-md-4 -->

          </div> <!-- row -->

        </div>
      </div> <!-- card -->
    </div>
  </div><!--  section -->

  @endif


  <div class="section pt-3">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <div class="row justify-content-center">
            <div class="col-12">
              <div class="border-bottom heading_s4 pb-2">
                <h2>Recent Ordered</h2>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div id="just_ordered" class="product_slider carousel_slider dot_style1 nav_style5">
                {{-- section content append by ajax --}}
              </div>
            </div>
          </div> <!-- row -->
        </div>
      </div>
    </div>
  </div> <!-- Just ordered -->

  <div class="section pt-3">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <div class="row justify-content-center">
            <div class="col-12">
              <div class="border-bottom heading_s4 pb-2">
                <h2>Someone Favorite</h2>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div id="someone_loved" class="product_slider carousel_slider dot_style1 nav_style5">
                {{-- section content append by ajax --}}
              </div>
            </div>
          </div> <!-- row -->

        </div>
      </div>
    </div>
  </div> <!-- Someone loved it -->

  <div class="section pt-3">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <div class="row justify-content-center">
            <div class="col-12">
              <div class="border-bottom heading_s4 pb-2">
                <h2>Someone Buying</h2>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div id="someone_buying" class="product_slider carousel_slider dot_style1 nav_style5">
                {{-- section content append by ajax --}}
              </div>
            </div>
          </div> <!-- row -->
        </div>
      </div>
    </div>
  </div> <!-- Someone buying it -->


  <div class="section pt-3">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <div class="row justify-content-center">
            <div class="col-12">
              <div class="border-bottom heading_s4 pb-2">
                <h2>New arrive</h2>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div id="new_arrived_section" class="product_slider carousel_slider dot_style1 nav_style5">
                {{-- section content append by ajax --}}
              </div>
            </div>
          </div> <!-- row -->
        </div>
      </div>
    </div>
  </div> <!-- New arrive -->

  <div class="section pt-3">
    <div class="container">
      <div class="card">
        <div class="card-body">
          <div class="row justify-content-center">
            <div class="col-12">
              <div class="border-bottom heading_s4 pb-2">
                <h2>Your Recently Viewed Products</h2>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div id="recent_view_section" class="product_slider carousel_slider dot_style1 nav_style5">
                {{-- section content append by ajax --}}
              </div>
            </div>
          </div> <!-- row -->
        </div>
      </div>
    </div>
  </div> <!-- New arrive -->

</div> <!-- END MAIN CONTENT -->


@endsection


{{-- @push('middle-styles')
<link rel="stylesheet" href="{{ asset('assets/plugins/intl-tel-input/css/intlTelInput.css') }}">
@endpush

@push('after-scripts')
<script src="{{asset('assets/plugins/intl-tel-input/js/intlTelInput.js')}}"></script>
<script src="{{asset('assets/plugins/scripts.js')}}"></script>
@endpush --}}