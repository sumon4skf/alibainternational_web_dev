<?php

namespace App\Http\Livewire;

use App\Models\Content\Invoice;
use App\Models\Content\OrderItem;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\TableComponent;
use Rappasoft\LaravelLivewireTables\Traits\HtmlComponents;
use Rappasoft\LaravelLivewireTables\Views\Column;

class CustomerInvoiceTable extends TableComponent
{
  use HtmlComponents;
  /**
   * @var string
   */
  public $sortField = 'id';
  public $sortDirection = 'desc';

  public $perPage = 10;
  public $perPageOptions = [];

  public $loadingIndicator = true;

  public $searchEnabled = false;

  protected $options = [
    'bootstrap.classes.table' => 'table table-striped table-bordered',
    'bootstrap.classes.thead' => null,
    'bootstrap.classes.buttons.export' => 'btn',
    'bootstrap.container' => true,
    'bootstrap.responsive' => true,
  ];


  public $sortDefaultIcon = '<i class="text-muted fa fa-sort"></i>';
  public $ascSortIcon = '<i class="fa fa-sort-up"></i>';
  public $descSortIcon = '<i class="fa fa-sort-down"></i>';

  public function query(): Builder
  {
    $user_id = auth()->id();
    return Invoice::with('user', 'invoiceItems')->where('user_id', $user_id);
  }

  public function columns(): array
  {
    return [
      Column::make(__('Date'), 'created_at')
        ->format(function (Invoice $model) {
          return $model->created_at->diffForHumans();
        }),
      Column::make(__('InvoiceID'), 'invoice_no'),
      Column::make(__('CourierBill'), 'invoiceItems.courier_bill')
        ->format(function (Invoice $model) {
          return $model->invoiceItems->sum('courier_bill');
        }),
      Column::make(__('TotalDue'), 'invoiceItems.due_payment')
        ->format(function (Invoice $model) {
          return $model->invoiceItems->sum('due_payment');
        }),
      Column::make(__('PaymentMethod'), 'payment_method'),
      Column::make(__('Status'), 'status')
        ->format(function (Invoice $model) {
          return readable_status($model->status);
        }),
      Column::make(__('Action'), 'action')
        ->format(function (Invoice $model) {
          $tan_id = $model->order->transaction_id ?? '';
          $status = $model->status;
          $pm = $model->payment_method;
          $payNow = '';
          $details = '<a href="' . route('frontend.user.invoice-details', $model) . '" class="btn btn-secondary" title="View Details"><i class="fas fa-file-alt"></i></a>';
          if ($status == 'Pending' & $pm !== 'Cash') {
            $payNow = '<a href="' . route('frontend.user.invoice.payNow', $model->invoice_no) . '" class="btn btn-danger"><i class="fas fa-hand-holding-usd"></i></a>';
          }

          $html_data =  $details . $payNow;
          return $this->html($html_data);
        }),
    ];
  }


  public function setTableHeadClass($attribute): ?string
  {
    $array = ['created_at', 'invoiceItems.due_payment', 'invoiceItems.courier_bill', 'total_payable', 'payment_method', 'status', 'action'];
    if (in_array($attribute, $array)) {
      return ' text-center';
    }
    return $attribute;
  }


  public function setTableDataClass($attribute, $value): ?string
  {
    $array = ['created_at', 'invoiceItems.due_payment', 'invoiceItems.courier_bill', 'total_payable', 'payment_method', 'status', 'action'];
    if (in_array($attribute, $array)) {
      return ' text-center';
    }
    return $attribute;
  }

  public function setTableRowId($model): ?string
  {
    return $model->id;
  }
}
