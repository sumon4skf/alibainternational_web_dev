<?php

namespace App\Http\Livewire;

use App\Models\Content\OrderItem;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\TableComponent;
use Rappasoft\LaravelLivewireTables\Traits\HtmlComponents;
use Rappasoft\LaravelLivewireTables\Views\Column;

class CustomerOrderItemsTable extends TableComponent
{
  use HtmlComponents;
  /**
   * @var string
   */
  public $sortField = 'created_at';
  public $sortDirection = 'desc';

  public $perPage = 15;
  public $perPageOptions = [];

  public $loadingIndicator = true;

  public $searchEnabled = true;

  public $tableClass = 'table table-bordered table-striped';

  public $sortDefaultIcon = '<i class="text-muted fa fa-sort"></i>';
  public $ascSortIcon = '<i class="fa fa-sort-up"></i>';
  public $descSortIcon = '<i class="fa fa-sort-down"></i>';

  public function query(): Builder
  {
    $user_id = auth()->id();
    return OrderItem::with('user', 'order', 'product')->where('user_id', $user_id);
  }

  public function columns(): array
  {
    return [
      Column::make('Date', 'created_at')
        ->searchable()
        ->sortable()
        ->format(function (OrderItem $model) {
          return date('d-M-Y', strtotime($model->created_at));
        }),
      Column::make('TransactionID', 'order.transaction_id')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $model->order->transaction_id ?? '';
        }),
      Column::make('ItemID', 'order_item_number')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $model->order_item_number;
        }),
      Column::make('ProductValue', 'product_value'),
      Column::make('LocalDelivery', 'chinaLocalDelivery'),
      Column::make('1stPayment', 'first_payment')
        ->format(function (OrderItem $model) {
          return $model->first_payment + ($model->chinaLocalDelivery / 2);
        }),
      Column::make('Due', 'due_payment')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="due_payment">' . $model->due_payment . '</span>');
        }),
      Column::make('Status', 'status')
        ->searchable()
        ->format(function (OrderItem $model) {
          $status =  str_replace('-', ' ', $model->status);
          return ucwords($status);
        }),
      Column::make(__('Action'), 'action')
        ->format(function (OrderItem $model) {
          $tan_id = $model->order->transaction_id ?? '';
          $details = '<a href="' . route('frontend.user.order-details', $model) . '" class="btn btn-sm btn-success">Details</a>';
          $payNow = '<a href="' . route('frontend.user.failedOrderPayNow', $tan_id) . '" class="btn btn-fill-out btn-sm">Pay Now</a>';
          $button = $model->status == 'Waiting for Payment' ? $payNow : $details;
          return $this->html($button);
        }),
    ];
  }



  public function setTableHeadClass($attribute): ?string
  {
    $array = ['order.transaction_id', 'order_item_number', 'created_at', 'product_value', 'chinaLocalDelivery', 'first_payment', 'due_payment', 'action'];
    if (in_array($attribute, $array)) {
      return $attribute . ' text-center';
    }
    return $attribute;
  }


  public function setTableDataClass($attribute, $value): ?string
  {
    // $array = ['name'];
    // if (in_array($attribute, $array)) {
    //   return 'align-middle';
    // }
    return 'text-center align-middle';
  }

  public function setTableRowId($model): ?string
  {
    return $model->id;
  }
}
