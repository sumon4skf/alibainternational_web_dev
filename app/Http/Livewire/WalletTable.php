<?php

namespace App\Http\Livewire;

use App\Models\Content\OrderItem;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\TableComponent;
use Rappasoft\LaravelLivewireTables\Traits\HtmlComponents;
use Rappasoft\LaravelLivewireTables\Views\Column;

class WalletTable extends TableComponent
{
  use HtmlComponents;
  /**
   * @var string
   */
  public $sortField = 'id';
  public $sortDirection = 'desc';

  public $perPage = 100;
  public $perPageOptions = [];

  public $loadingIndicator = true;
  public $clearSearchButton = false;


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

  public $exportFileName = 'Customer-Wallet-table';
  public $exports = [];


  public $status;
  public $customer;

  public function mount($status, $customer)
  {
    $this->status = $status;
    $this->customer = $customer;
  }

  public function query(): Builder
  {
    $customer = $this->customer;
    $status = $this->status;
    $status = $status ? explode(',', $this->status) : [];
    $status = array_filter($status, function ($v) {
      return $v != 'null';
    });

    $orderItem = OrderItem::with(['user:id,name,phone', 'order', 'product']);
    $orderItem = !empty($status) ? $orderItem->whereIn('status', $status) : $orderItem;
    return $customer ? $orderItem->where('user_id', $customer) : $orderItem;
  }

  public function columns(): array
  {
    return [
      Column::make('<input type="checkbox" id="allSelectCheckbox">', 'checkbox')
        ->format(function (OrderItem $model) {
          $checkbox = '<span class="d-none productInfo" data-product-id="' . $model->product_id . '" data-product-name="' . $model->name . '"></span>';
          $checkbox .= '<input type="checkbox" class="checkboxItem " data-status="' . $model->status . '" data-user="' . $model->user_id . '"  name="wallet[]" value="' . $model->id . '">';
          return $this->html($checkbox);
        })->excludeFromExport(),
      Column::make('Date', 'created_at')
        ->searchable()
        ->format(function (OrderItem $model) {
          return date('d-M-Y', strtotime($model->created_at));
        }),
      Column::make('Customer', 'user.name')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $model->user->name  ?? 'N/A';
        }),
      Column::make('phone', 'user.phone')
        ->searchable()
        ->hide(),
      Column::make('TransactionNo.', 'order.transaction_id')
        ->searchable()
        ->hide(),
      Column::make('OrderID.', 'order.order_number')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $this->html('<span class="order_number">' . $model->order->order_number ?? 'N/A' . '</span>');
        }),
      Column::make('ItemNo.', 'order_item_number')
        ->searchable()
        ->format(function (OrderItem $model) {
          $htmlHref = '<a href="' . route('admin.order.wallet.details', $model->id) . '" class="btn btn-link" target="_blank"><span class="order_item_number">' . $model->order_item_number . '</span></a>';
          return $this->html($htmlHref);
        }),
      Column::make('TrackingNo.', 'tracking_number')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $this->html('<span class="tracking_number">' . $model->tracking_number . '</span>');
        }),
      Column::make('1688OrderNo.', 'order_number')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $this->html('<span class="1688_order_number">' . $model->order_number . '</span>');
        }),
      Column::make('ProductsTitle', 'name')
        ->searchable()
        ->hide(),
      Column::make('ShippedBy', 'shipped_by')
        ->format(function (OrderItem $model) {
          return $this->html('<span>' . $model->shipped_by . '</span> <br> <span class="text-danger">' . $model->shipping_rate . '</span>');
        }),
      Column::make('1688Link', '1688_link')
        ->format(function (OrderItem $model) {
          $url = isset($model->product) ? explode('-', $model->product->ItemId) : [];
          return $this->html($this->link("https://detail.1688.com/offer/" . end($url) . ".html", 'Click', ['target' => '_blank']));
        })
        ->excludeFromExport(),
      Column::make('Quantity', 'quantity')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="quantity">' . $model->quantity . '</span>');
        }),
      Column::make('ProductsValue', 'product_value')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="product_value">' . $model->product_value . '</span>');
        }),
      Column::make('LocalDelivery', 'chinaLocalDelivery'),
      Column::make('Coupon Value', 'coupon_contribution')
        ->format(function (OrderItem $model) {
          $coupon = $model->coupon_contribution ? $model->coupon_contribution : 0;
          return $this->html('<span class="coupon_contribution">' . $coupon . '</span>');
        }),
      Column::make('1stPayment', 'first_payment')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="first_payment">' . $model->first_payment . '</span>');
        }),
      Column::make('OutOfStock', 'out_of_stock')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="out_of_stock">' . $model->out_of_stock . '</span>');
        }),
      Column::make('Missing/Shortage', 'missing')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="missing">' . $model->missing . '</span>');
        }),
      Column::make('Refunded', 'refunded')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="refunded">' . $model->refunded . '</span>');
        }),
      Column::make('Adjustment', 'adjustment')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="adjustment">' . $model->adjustment . '</span>');
        }),
      Column::make('Weight', 'actual_weight')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="actual_weight">' . $model->actual_weight . '</span>');
        }),
      Column::make('WeightCharges', 'shipping_charge')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="shipping_charge">' . $model->shipping_charge . '</span>');
        }),
      Column::make('CourierBill', 'courier_bill')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="courier_bill">' . $model->courier_bill . '</span>');
        }),
      Column::make('LastPayment', 'last_payment')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="last_payment">' . $model->last_payment . '</span>');
        }),
      Column::make('Due', 'due_payment')
        ->format(function (OrderItem $model) {
          return $this->html('<span class="due_payment">' . calculateItemDue($model) . '</span>');
        }),
      Column::make('Ref.Invoice', 'invoice_no')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $this->html('<span class="invoice_no">' . $model->invoice_no . '</span>');
        }),
      Column::make('Status', 'status')
        ->searchable()
        ->format(function (OrderItem $model) {
          return $this->html('<span class="status">' . $model->status . '</span>');
        }),
      Column::make(__('Action'), 'action')
        ->format(function (OrderItem $model) {
          $htmlHref = '<a href="' . route('admin.order.wallet.details', $model->id) . '" class="btn btn-secondary btn-sm" target="_blank"><i class="fa fa-file-o"></i></a>';
          return $this->html($htmlHref);
        })
        ->excludeFromExport(),
    ];
  }


  public function setTableHeadAttributes($attribute): array
  {
    if ($attribute == 'action') {
      return ['style' => 'min-width:80px;'];
    } elseif ($attribute == 'name') {
      return ['style' => 'min-width:260px;'];
    } elseif ($attribute == 'order_item_number') {
      return ['style' => 'min-width: 100px'];
    } elseif ($attribute == 'transaction_id') {
      return ['style' => 'min-width: 130px'];
    } elseif ($attribute == 'order_number') {
      return ['style' => 'min-width: 150px'];
    } elseif ($attribute == 'checkbox') {
      return ['style' => 'min-width: 100px'];
    }
    return [
      'style' => 'min-width:120px'
    ];
  }

  public function setTableHeadClass($attribute): ?string
  {
    $array = ['id', 'order.order_number', 'image', 'order_item_number', 'shipped_by', 'chinaLocalDelivery', '1688_link', 'action', 'checkbox'];
    if (in_array($attribute, $array)) {
      $allSelect = $attribute == 'id' ? 'allSelectTitle' : '';
      return ' text-center ' . $allSelect;
    }

    return $attribute;
  }


  public function setTableDataClass($attribute, $value): ?string
  {
    $array = ['name'];
    if (in_array($attribute, $array)) {
      return 'align-middle';
    }
    return 'text-center align-middle';
  }

  public function setTableRowId($model): ?string
  {
    return $model->id;
  }
}
