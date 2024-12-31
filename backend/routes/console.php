<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();


Schedule::call(function () {
// Call the fetchAndAggregateNews method in the controller
    app(\App\Http\Controllers\NewsController::class)->fetchAndAggregateNews();
})->dailyAt('00:00');