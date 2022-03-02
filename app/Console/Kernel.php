<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

/**
 * Class Kernel.
 */
class Kernel extends ConsoleKernel
{
  /**
   * The Artisan commands provided by your application.
   *
   * @var array
   */
  protected $commands = [
    Commands\UserInfoUpdate::class,
    Commands\OrderInfoUpdate::class,
  ];

  /**
   * Define the application's command schedule.
   *
   * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
   */
  protected function schedule(Schedule $schedule)
  {
    // $schedule->command('user:updateInfo')->everyMinute();
    // $schedule->command('order:updateInfo')->everyMinute();
    // $schedule->command('order:updateInfo')->everyFifteenMinutes();
  }

  /**
   * Register the commands for the application.
   */
  protected function commands()
  {
    $this->load(__DIR__ . '/Commands');

    require base_path('routes/console.php');
  }
}
