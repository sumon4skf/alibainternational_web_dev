@extends('backend.layouts.app')

@section('title', app_name() . ' | ' . __('strings.backend.dashboard.title'))

@section('content')

@php
$allOrdersCount = $orders->count();
$partialCount = $orders->where('status', 'Partial Paid')->count();
$processingCount = $orders->where('status', 'processing')->count();
$purchasedCount = $orders->where('status', 'purchased')->count();
$deliveredCount = $orders->where('status', 'delivered')->count();
@endphp

<div class="container-fluid">

  <div class="row">
    <div class="col-lg-3 col-6">
      <!-- small box -->
      <div class="small-box bg-info">
        <div class="inner">
          <h3>{{$partialCount}}</h3>
          <p>Partial Orders</p>
        </div>
        <div class="icon">
          <i class="ion ion-bag"></i>
        </div>
        <a href="{{ route('admin.order.index', ['status' => 'Partial Paid']) }}" class="small-box-footer">More info <i
            class="fa fa-arrow-circle-right"></i></a>
      </div>
    </div>
    <!-- ./col -->
    <div class="col-lg-3 col-6">
      <!-- small box -->
      <div class="small-box bg-success">
        <div class="inner">
          <h3>{{$processingCount}}</h3>
          <p>Order Processing</p>
        </div>
        <div class="icon">
          <i class="ion ion-stats-bars"></i>
        </div>
        <a href="{{ route('admin.order.index', ['status' => 'processing']) }}" class="small-box-footer">More info <i
            class="fa fa-arrow-circle-right"></i></a>
      </div>
    </div>
    <!-- ./col -->
    <div class="col-lg-3 col-6">
      <!-- small box -->
      <div class="small-box bg-warning">
        <div class="inner">
          <h3>{{$purchasedCount}}</h3>
          <p>Total Purchased</p>
        </div>
        <div class="icon">
          <i class="ion ion-person-add"></i>
        </div>
        <a href="{{ route('admin.order.index', ['status' => 'purchased']) }}" class="small-box-footer">More info <i
            class="fa fa-arrow-circle-right"></i></a>
      </div>
    </div>
    <!-- ./col -->
    <div class="col-lg-3 col-6">
      <!-- small box -->
      <div class="small-box bg-danger">
        <div class="inner">
          <h3>{{$deliveredCount}}</h3>
          <p>Total Delivered</p>
        </div>
        <div class="icon">
          <i class="ion ion-pie-graph"></i>
        </div>
        <a href="{{ route('admin.order.index', ['status' => 'delivered']) }}" class="small-box-footer">More info
          <i class="fa fa-arrow-circle-right"></i></a>
      </div>
    </div>
    <!-- ./col -->
  </div>
  <!-- /.row -->


  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-header">
          <strong>@lang('strings.backend.dashboard.welcome') {{ $logged_in_user->name }}!</strong>
        </div> <!-- card-header-->
        <div class="card-body">
          {!! __('strings.backend.welcome') !!}
        </div> <!-- card-body-->
      </div> <!-- card-->
    </div> <!-- col-->
  </div> <!-- row-->
</div> <!-- container-->
@endsection