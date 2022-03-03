@extends('frontend.layouts.app')

@section('title', app_name() . ' | About Us')

@section('content')

<!--  BREADCRUMB -->
<div class="breadcrumb_section bg_gray page-title-mini">
  <div class="container">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="{{route('frontend.index')}}">Home</a></li>
      <li class="breadcrumb-item active">{{$about->post_title}}</li>
    </ol>
  </div>
</div>
<!--  BREADCRUMB -->

<div class="section pt-4">
  <div class="container">
    <div class="card">
      <div class="card-body">
        <h2 class="mb-4">{{$about->post_title}}</h2>
        {!! $about->post_content !!}
      </div>
    </div>
  </div>
</div>


@endsection