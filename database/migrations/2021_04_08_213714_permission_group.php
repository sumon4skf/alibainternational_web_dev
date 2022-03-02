<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class PermissionGroup extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('permission_group', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('name', 255);
      $table->string('permissions');
      $table->integer('user_id');
      $table->boolean('is_delete')->default(0);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('permission_group');
  }
}
