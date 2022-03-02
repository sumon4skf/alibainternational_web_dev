<?php

use App\Models\Content\Setting;
use Illuminate\Database\Seeder;

class SettingTableSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    $pages = [
      'site_name' => '#',
      'site_url' => '#',
      'site_email' => '#',
      'site_phone' => '#',
      'facebook' => '#',
      'twitter' => '#',
      'linkedin' => '#',
      'youtube' => '#',
      'instagram' => '#',
    ];

    foreach ($pages as $key => $value) {
      Setting::create([
        'active' => date('Y-m-d H:i:s'),
        'key' => $key,
        'value' => $value,
        'user_id' => 1,
      ]);
    }
  }
}
