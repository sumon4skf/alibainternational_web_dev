<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecentProductsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('recent_products', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('ItemId');
      $table->string('ProviderType')->nullable();
      $table->text('Title')->nullable();
      $table->string('CategoryId')->nullable();
      $table->string('VendorId')->nullable();
      $table->string('VendorName')->nullable();
      $table->integer('VendorScore')->nullable();
      $table->string('BrandId')->nullable();
      $table->string('BrandName')->nullable();
      $table->string('TaobaoItemUrl')->nullable();
      $table->text('MainPictureUrl')->nullable();
      $table->text('Pictures')->nullable();
      $table->text('FeaturedValues')->nullable();
      $table->string('PhysicalParameters')->nullable();
      $table->unsignedInteger('Price')->nullable();
      $table->unsignedInteger('DeliveryCosts')->nullable();
      $table->unsignedInteger('MasterQuantity')->nullable();
      $table->unsignedInteger('FirstLotQuantity')->nullable();
      $table->unsignedInteger('NextLotQuantity')->nullable();
      $table->unsignedInteger('BatchLotQuantity')->default(1);
      $table->longText('Attributes')->nullable();
      $table->longText('ConfiguredItems')->nullable();
      $table->longText('QuantityRanges')->nullable();
      $table->string('recent_view_uid')->nullable();
      $table->unsignedInteger('user_id')->nullable();
      $table->timestamps();
    });

    // php artisan migrate --path='./database/migrations/2022_03_06_112819_create_recent_products_table.php'
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('recent_products');
  }
}
