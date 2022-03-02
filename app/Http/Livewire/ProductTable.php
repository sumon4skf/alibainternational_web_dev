<?php

namespace App\Http\Livewire;

use App\Models\Content\Product;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\TableComponent;
use Rappasoft\LaravelLivewireTables\Traits\HtmlComponents;
use Rappasoft\LaravelLivewireTables\Views\Column;

class ProductTable extends TableComponent
{
  use HtmlComponents;

  protected $options = [
    'bootstrap.classes.table' => 'table table-striped table-bordered',
    'bootstrap.classes.thead' => null,
    'bootstrap.classes.buttons.export' => 'btn btn-info',
    'bootstrap.container' => true,
    'bootstrap.responsive' => true,
  ];

  public $sortDefaultIcon = '<i class="text-muted fa fa-sort"></i>';
  public $ascSortIcon = '<i class="fa fa-sort-up"></i>';
  public $descSortIcon = '<i class="fa fa-sort-down"></i>';
  public $sortField = 'id';
  public $sortDirection = 'desc';

  public $perPage = 20;
  public $perPageOptions = [];
  public $loadingIndicator = true;

  public $exportFileName = 'Product-table';
  public $exports = [];


  public function query(): Builder
  {
    return  Product::with('user', 'orderItems')->withCount('orderItems');
  }

  public function columns(): array
  {
    return [
      Column::make('#LID', 'id')
        ->sortable()
        ->searchable(),
      Column::make('OTC-Id', 'ItemId')
        ->searchable(),
      Column::make('Picture', 'MainPictureUrl')
        ->format(function (Product $model) {
          $image =  $this->image($model->MainPictureUrl, '', ['class' => 'img-fluid']);
          return $this->html($this->link(url('product/' . $model->ItemId), $image, ['target' => '_blank'], $secure = null, false));
        }),
      Column::make('Title', 'Title')
        ->searchable(),
      Column::make('1688', '1688_link')
        ->format(function (Product $model) {
          $url = explode('-', $model->ItemId);
          $href = '<a href="https://detail.1688.com/offer/' . end($url) . '.html" class="btn btn-sm btn-secondary" target="_blank">	
          <i class="fa fa-external-link"></i></a>';
          return $this->html($href);
        }),
      Column::make('Category Id', 'CategoryId')
        ->searchable(),
      Column::make('Vendor Name', 'VendorName')
        ->searchable(),
      Column::make('Total Orders', 'order_items_count')
        ->sortable(),
      Column::make('Last-Update', 'updated_at')
        ->searchable()
        ->format(function (Product $model) {
          return date('d M, Y', strtotime($model->updated_at));
        }),
      Column::make(__('Action'), 'action')
        ->format(function (Product $model) {
          return view('backend.content.product.includes.actions', ['product' => $model]);
        }),
    ];
  }

  public function setTableHeadAttributes($attribute): array
  {
    if ($attribute == 'action') {
      return ['style' => 'min-width:80px;'];
    } elseif ($attribute == 'MainPictureUrl') {
      return ['style' => 'width:80px;'];
    } elseif ($attribute == 'ItemId') {
      return ['style' => 'min-width: 136px;'];
    } elseif ($attribute == '1688_link') {
      return ['style' => 'width:90px;'];
    }
    return [
      'style' => 'min-width:120px'
    ];
  }

  public function setTableHeadClass($attribute): string
  {
    if ($attribute == 'ItemId' || $attribute == '1688_link' || $attribute == 'MainPictureUrl' || $attribute == 'action' || $attribute == 'id') {
      return ' text-center';
    }
    return $attribute;
  }


  public function setTableDataClass($attribute, $value): ?string
  {
    if ($attribute == '1688_link' || $attribute == 'order_items_count' || $attribute == 'action' || $attribute == 'id') {
      return $attribute . ' text-center';
    }
    return $attribute;
  }
}
