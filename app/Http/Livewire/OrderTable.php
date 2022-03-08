<?php

namespace App\Http\Livewire;

use App\Models\Content\Order;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\TableComponent;
use Rappasoft\LaravelLivewireTables\Traits\HtmlComponents;
use Rappasoft\LaravelLivewireTables\Views\Column;

class OrderTable extends TableComponent
{
  use HtmlComponents;
  /**
   * @var string
   */
  public $sortField = 'id';
  public $sortDirection = 'desc';
  public $perPage = 30;
  public $perPageOptions = [];

  public $loadingIndicator = true;

  protected $options = [
    'bootstrap.classes.table' => 'table table-bordered table-hover',
    'bootstrap.classes.thead' => null,
    'bootstrap.classes.buttons.export' => 'btn btn-info',
    'bootstrap.container' => true,
    'bootstrap.responsive' => true,
  ];

  public $sortDefaultIcon = '<i class="text-muted fa fa-sort"></i>';
  public $ascSortIcon = '<i class="fa fa-sort-up"></i>';
  public $descSortIcon = '<i class="fa fa-sort-down"></i>';

  public $exportFileName = 'Order-table';
  public $exports = [];


  public $status  = null;

  public function mount($status)
  {
    $this->status = $status;
  }

  public function query(): Builder
  {
    $order =  Order::with(['user:id,name,phone', 'orderItems']);
    $status = $this->status;
    if ($status) {
      if ($status == 'trashed') {
        $order->onlyTrashed();
      } else {
        $order->where('status', $status);
      }
    }
    return $order;
  }

  public function columns(): array
  {
    return [
      Column::make('Date', 'created_at')
        ->searchable()
        ->format(function (Order $model) {
          return $model->created_at->diffForHumans();
        }),
      Column::make('OrderNumber', 'order_number')
        ->searchable()
        ->format(function (Order $model) {
          $href = '<a href="' . route('admin.order.show', $model) . '" target="_blank">' . $model->order_number . '</a>';
          return $this->html($href);
        }),
      Column::make('TransactionNo', 'transaction_id')
        ->searchable(),
      Column::make('Customer', 'user.name')
        ->searchable(),
      Column::make('CustomerPhone', 'user.phone')
        ->searchable(function ($builder, $term) {
          return $builder->where('phone', $term)
            ->orWhere('address', 'LIKE', '%' . $term . '%')
            ->orWhereHas('user', function ($query) use ($term) {
              return $query->where('phone', $term);
            });
        }),
      Column::make('Amount', 'amount')
        ->searchable()
        ->format(function (Order $model) {
          return floating($model->amount);
        }),
      Column::make('Coupon', 'coupon_victory')
        ->searchable()
        ->format(function (Order $model) {
          return floating($model->coupon_victory);
        }),
      Column::make('Paid', 'needToPay')
        ->searchable()
        ->format(function (Order $model) {
          return floating($model->needToPay);
        }),
      Column::make('Due', 'dueForProducts')
        ->searchable()
        ->format(function (Order $model) {
          return floating($model->dueForProducts);
        }),
      Column::make('PaymentMethod', 'pay_method')
        ->searchable(),
      Column::make('PurchaseBy', 'orderItems')
        ->format(function (Order $model) {
          return view('backend.content.order.includes.purchaseBy', ['orderItems' => $model->orderItems]);
        }),
      Column::make('Note', 'order_note')
        ->format(function (Order $model) {
          return view('backend.content.order.includes.purchaseNote', ['orderItems' => $model->orderItems]);
        }),
      Column::make('Status', 'status')
        ->searchable()
        ->format(function (Order $model) {
          $status = '<div>
                    <span class="order-status">' . $model->status . '</span>
                    <a href="' . route('admin.order.change.status', $model) . '" class="ml-2 btn-edit-status"><i class="fa fa-pencil"></i></a>
                  </div>';
          return $this->html($status);
        }),
      Column::make('Actions', 'action')
        ->format(function (Order $model) {
          $status = $this->status;
          if ($status == 'trashed') {
            return view('backend.content.order.includes.actions-trash', ['order' => $model]);
          }
          return view('backend.content.order.includes.actions', ['order' => $model, 'status' => $status]);
        })
    ];
  }

  public function setTableHeadClass($attribute): ?string
  {
    $array = ['order_number', 'order_note', 'orderItems', 'action', 'pay_method', 'status', 'dueForProducts', 'needToPay', 'amount', 'coupon_victory', 'transaction_id', 'created_at'];
    if (in_array($attribute, $array)) {
      return ' text-center';
    }
    return $attribute;
  }

  public function setTableDataClass($attribute, $value): ?string
  {
    $array = ['order_number', 'order_note', 'orderItems', 'action', 'pay_method', 'status', 'dueForProducts', 'needToPay', 'amount', 'coupon_victory', 'transaction_id', 'created_at'];
    if (in_array($attribute, $array)) {
      return 'text-center align-middle';
    }
    return 'align-middle';
  }
}
