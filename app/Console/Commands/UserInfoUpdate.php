<?php

namespace App\Console\Commands;

use App\Models\Auth\User;
use Illuminate\Console\Command;

class UserInfoUpdate extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'user:updateInfo';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'User information like name, phone, email update';

  /**
   * Create a new command instance.
   *
   * @return void
   */
  public function __construct()
  {
    parent::__construct();
  }

  /**
   * Execute the console command.
   *
   * @return mixed
   */
  public function handle()
  {

    \Log::info("Cron user Info update cron successfully is working fine!");
  }
}
