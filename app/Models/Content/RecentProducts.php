<?php

namespace App\Models\Content;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecentProducts extends Model
{
  protected $table = 'recent_products';

  public $primaryKey = 'id';

  public $timestamps = true;

  protected $guarded  = [];

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function orderItems()
  {
    return $this->hasMany(OrderItem::class, 'product_id', 'id');
  }
}
