<?php

namespace App\Http\Livewire;

use App\Models\Content\Invoice;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\TableComponent;
use Rappasoft\LaravelLivewireTables\Traits\HtmlComponents;
use Rappasoft\LaravelLivewireTables\Views\Column;

class InvoiceTable extends TableComponent
{
  use HtmlComponents;
  /**
   * @var string
   */
  public $sortField = 'id';
  public $sortDirection = 'desc';
  public $loadingIndicator = true;
  public $clearSearchButton = true;
  public $sortDefaultIcon = '<i class="text-muted fa fa-sort"></i>';
  public $ascSortIcon = '<i class="fa fa-sort-up"></i>';
  public $descSortIcon = '<i class="fa fa-sort-down"></i>';
  protected $options = [
    'bootstrap.classes.table' => 'table table-striped text-center table-bordered',
    'bootstrap.classes.buttons.export' => 'btn btn-info',
  ];

  public $exportFileName = 'Invoice-table';
  public $exports = [];
  public $perPage = 20;
  public $perPageOptions = [];



  public function query(): Builder
  {
    return Invoice::with('user', 'invoiceItems')->withCount('invoiceItems');
  }

  public function columns(): array
  {
    return [
      Column::make('Date', 'created_at')
        ->searchable()
        ->format(function (Invoice $model) {
          return date('d-M-Y', strtotime($model->created_at));
        }),
      Column::make('InvoiceNo', 'invoice_no')
        ->sortable()
        ->searchable()
        ->format(function (Invoice $model) {
          $href = '<a href="' . route('admin.invoice.details', $model) . '" class="show_details">' . $model->invoice_no . '</a>';
          return $this->html($href);
        }),
      Column::make('CustomerName', 'user.name')
        ->searchable(),
      Column::make('CustomerPhone', 'user.phone')
        ->searchable(),
      Column::make('CustomerPhone', 'customer_phone')
        ->searchable()
        ->hide(),
      Column::make('DeliveryMethod', 'delivery_method')
        ->searchable()
        ->format(function (Invoice $model) {
          return readable_status($model->delivery_method);
        }),
      Column::make('TotalPayable')
        ->format(function (Invoice $model) {
          $payable = $model->invoiceItems->sum('items_payable');
          return round($payable);
        }),
      Column::make('TotalDue')
        ->format(function (Invoice $model) {
          $due = $model->invoiceItems->sum('due_payment');
          return round($due);
        }),
      Column::make('PaymentMethod', 'payment_method')
        ->searchable()
        ->format(function (Invoice $model) {
          return readable_status($model->payment_method);
        }),
      Column::make('Status', 'status')
        ->searchable()
        ->format(function (Invoice $model) {
          return readable_status($model->status);
        }),
      Column::make(__('Action'), 'action')
        ->format(function (Invoice $model) {
          return view('backend.content.invoice.includes.actions', ['invoice' => $model]);
        })
        ->excludeFromExport(),
      // Column::make('order_id', 'invoiceItems.order_id')
      //   ->searchable()
      //   ->exportOnly(),
      // Column::make('orderNumber', 'invoiceItems')
      //   ->searchable(function ($builder, $term) {
      //     return $builder->orWhereHas('invoiceItems', function ($query) use ($term) {
      //       return $query->orWhereHas('order', function ($query2) use ($term) {
      //         return $query2->where('order_number', $term);
      //         // ->orWhere('phone', $term)
      //         // ->orWhere('transaction_id', $term);
      //       });
      //     });
      //   })
      //   ->exportOnly(),
      // Column::make('item_id', 'invoiceItems.item_id')
      //   ->searchable()
      //   ->exportOnly(),
      // Column::make('orderItemNumber', 'invoiceItems')
      //   ->searchable(function ($builder, $term) {
      //     return $builder->orWhereHas('invoiceItems', function ($query) use ($term) {
      //       return $query->orWhereHas('order_item', function ($query2) use ($term) {
      //         return $query2->where('order_item_number', $term);
      //       });
      //     });
      //   })
      //   ->exportOnly(),
    ];
  }


  public function setTableHeadAttributes($attribute): array
  {
    if ($attribute == 'action') {
      return ['style' => 'min-width:80px;'];
    } elseif ($attribute == 'customer_name') {
      return ['style' => 'min-width:150px;'];
    } elseif ($attribute == 'customer_phone') {
      return ['style' => 'min-width: 150px'];
    }
    return [
      'style' => 'min-width:120px'
    ];
  }

  public function setTableHeadClass($attribute): ?string
  {
    $array = ['transaction_id', 'customer_name', 'customer_phone', 'total_due', 'total_courier', 'total_payable', 'action'];
    if (in_array($attribute, $array)) {
      return $attribute . ' text-center';
    }
    return $attribute;
  }


  public function setTableRowId($model): ?string
  {
    return $model->id;
  }
}
