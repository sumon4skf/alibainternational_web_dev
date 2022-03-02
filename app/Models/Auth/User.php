<?php

namespace App\Models\Auth;

use App\Models\Api\ApiCallLog;
use App\Models\Auth\Traits\Attribute\UserAttribute;
use App\Models\Auth\Traits\Method\UserMethod;
use App\Models\Auth\Traits\Relationship\UserRelationship;
use App\Models\Auth\Traits\Scope\UserScope;
use App\Models\Content\Frontend\Address;
use App\Models\Content\Order;
use App\Models\Content\Product;
use Illuminate\Notifications\Notifiable;

/**
 * Class User.
 */
class User extends BaseUser
{
  use UserAttribute,
    UserMethod,
    UserRelationship,
    UserScope,
    Notifiable;

  public function orders()
  {
    return $this->hasMany(Order::class);
  }

  public function address()
  {
    return $this->hasMany(Address::class, 'user_id', 'id');
  }

  public function shipping()
  {
    return $this->belongsTo(Address::class, 'shipping_id', 'id');
  }

  public function billing()
  {
    return $this->belongsTo(Address::class, 'billing_id', 'id');
  }

  public function wishlist()
  {
    return $this->belongsToMany(Product::class, 'wishlists', 'user_id', 'ItemId', 'id', 'ItemId')->wherePivot('deleted_at', null);
  }

  public function api_logs()
  {
    return $this->hasMany(ApiCallLog::class, 'user_id', 'id');
  }
}
