<?php

namespace App\Http\Livewire;

use App\Models\Content\Order;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\TableComponent;
use Rappasoft\LaravelLivewireTables\Traits\HtmlComponents;
use Rappasoft\LaravelLivewireTables\Views\Column;

class CustomerOrderTable extends TableComponent
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
        return Order::with('user', 'orderItems')
            ->withCount('orderItems')
            ->where('user_id', $user_id);
    }

    public function columns(): array
    {
        return [
            Column::make('Date', 'created_at')
                ->searchable()
                ->sortable()
                ->format(function (Order $model) {
                    return date('d-M-Y', strtotime($model->created_at));
                }),
            Column::make('OrderNumber', 'order_number')
                ->searchable(),
            Column::make('TotalPayable', 'amount')
                ->format(function (Order $model) {
                    return $this->html('<span class="amount">' . round($model->amount) . '</span>');
                }),
            Column::make('1stPayment', 'needToPay')
                ->format(function (Order $model) {
                    return $this->html('<span class="needToPay">' . round($model->needToPay) . '</span>');
                }),
            Column::make('Due', 'dueForProducts')
                ->format(function (Order $model) {
                    return $this->html('<span class="dueForProducts">' . round($model->dueForProducts) . '</span>');
                }),
            Column::make('Status', 'status')
                ->searchable()
                ->format(function (Order $model) {
                    $status =  str_replace('-', ' ', $model->status);
                    return ucwords($status);
                }),
            Column::make(__('Action'), 'action')
                ->format(function (Order $model) {
                    $tan_id = $model->transaction_id ?? '';
                    $details = '<a href="' . route('frontend.user.order-details', $model) . '" class="btn btn-sm btn-success">Details</a>';
                    $payNow = '<a href="' . route('frontend.user.failedOrderPayNow', $tan_id) . '" class="btn btn-fill-out btn-sm">Pay Now</a>';
                    $button = $model->status == 'Waiting for Payment' ? $payNow : $details;
                    return $this->html($button);
                }),
        ];
    }



    public function setTableHeadClass($attribute): ?string
    {
        $array = ['orderItems.chinaLocalDelivery', 'order_number', 'created_at', 'needToPay', 'dueForProducts', 'total_payable', 'status', 'action'];
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
