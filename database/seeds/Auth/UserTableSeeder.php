<?php

use App\Models\Auth\User;
use Illuminate\Database\Seeder;

/**
 * Class UserTableSeeder.
 */
class UserTableSeeder extends Seeder
{
  use DisableForeignKeys;

  /**
   * Run the database seed.
   */
  public function run()
  {
    $this->disableForeignKeys();
    // Add the master administrator, user id of 1
    User::create([
      'name' => 'Super Admin',
      'email' => 'admin@admin.com',
      'phone' => '01734905649',
      'password' => 'secret',
      'confirmation_code' => md5(uniqid(mt_rand(), true)),
      'confirmed' => true,
    ]);

    User::create([
      'name' => 'Default User',
      'email' => 'user@user.com',
      'phone' => '01515234363',
      'password' => 'secret',
      'confirmation_code' => md5(uniqid(mt_rand(), true)),
      'confirmed' => true,
    ]);

    $this->enableForeignKeys();
  }
}
