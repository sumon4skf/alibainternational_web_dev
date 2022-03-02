@extends('backend.layouts.app')

@section('title', 'Recent Orders')

@section('content')
@php
$status = request('status');
$allOrdersCount = $orders->count();
$partialCount = $orders->where('status', 'Partial Paid')->count();
$onHold = $orders->where('status', 'on-hold')->count();
$icompleteCount = $orders->where('status', 'Waiting for Payment')->count();
$refundedCount = $orders->where('status', 'refunded')->count();
$processingCount = $orders->where('status', 'processing')->count();
$purchasedCount = $orders->where('status', 'purchased')->count();
@endphp
<div class="card">
  <div class="card-header">
    <h5 class="d-inline-block mr-2">@lang('Recent Orders')</h5>
    <div class="status-control">
      <a href="{{ route('admin.order.index') }}" class="@if(!$status) active @endif">
        @lang('All Orders') ({{$allOrdersCount}})
      </a>
      <a href="{{ route('admin.order.index', ['status' => 'Partial Paid']) }}"
        class="@if($status == 'Partial Paid') active @endif">
        @lang('Partial Paid') ({{$partialCount}})
      </a>
      <a href="{{ route('admin.order.index', ['status' => 'on-hold']) }}"
        class="@if($status == 'on-hold') active @endif">
        @lang('On Hold') ({{$onHold}})
      </a>
      <a href="{{ route('admin.order.index', ['status' => 'Waiting for Payment']) }}"
        class="@if($status == 'Waiting for Payment') active @endif">
        @lang('Incomplete') ({{$icompleteCount}})
      </a>
      <a href="{{ route('admin.order.index', ['status' => 'refunded']) }}"
        class="@if($status == 'refunded') active @endif">
        @lang('Refunded') ({{$refundedCount}})
      </a>
      <a href="{{ route('admin.order.index', ['status' => 'processing']) }}"
        class="@if($status == 'processing') active @endif">
        @lang('Processing') ({{$processingCount}})
      </a>
      <a href="{{ route('admin.order.index', ['status' => 'purchased']) }}"
        class="@if($status == 'purchased') active @endif">
        @lang('Purchased') ({{$purchasedCount}})
      </a>
      @hasrole('administrator')
      <a href="{{ route('admin.order.index', ['status' => 'trashed']) }}"
        class="@if($status == 'trashed') active @endif">
        @lang('Trashed Orders') ({{$trashedOrders->count()}})
      </a>
      @endhasrole
      <a href="{{ route('admin.export', 'orders') }}">
        @lang('Export order Table')
      </a>
    </div>
  </div>
  <div class="card-body">
    @livewire('order-table', ['status' => $status])
  </div> <!-- card-body-->
</div> <!-- card-->


<!-- Modal -->
@include('backend.content.order.includes.status-modal')



@endsection


@push('after-styles')

@livewireStyles

@endpush

@push('after-scripts')
@livewireScripts
@endpush