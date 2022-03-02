<?php

namespace App\Models\Api;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;

class ApiCallLog extends Model
{
  protected $table = 'api_call_logs';

  public $primaryKey = 'id';

  public $timestamps = true;

  protected $guarded = [];

  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
