@extends('frontend.layouts.app')

@section('title', $page->post_title)

@section('content')

<div class="breadcrumb_section bg_gray page-title-mini">
  <div class="container">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="{{route('frontend.index')}}">Home</a></li>
      <li class="breadcrumb-item active">{{$page->post_title}}</li>
    </ol>
  </div>
</div>


<div class="section pt-4">
  <div class="container">
    <div class="card">
      <div class="card-body">
        <h2 class="mb-4">{{$page->post_title}}</h2>     
        {!! $page->post_content !!}
      </div>
    </div>
  </div>
</div>
@endsection