<?php

namespace App\Models\Content;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
  use SoftDeletes;

  protected $table = 'products';

  public $primaryKey = 'id';

  public $timestamps = true;

  protected $fillable  = ['active', 'ItemId', 'ProviderType', 'Title', 'CategoryId', 'ExternalCategoryId', 'VendorId', 'VendorName', 'VendorScore', 'BrandId', 'BrandName', 'TaobaoItemUrl', 'ExternalItemUrl', 'MainPictureUrl', 'Price', 'Pictures', 'Features', 'MasterQuantity', 'user_id'];

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function orderItems()
  {
    return $this->hasMany(OrderItem::class, 'product_id', 'id');
  }
}
