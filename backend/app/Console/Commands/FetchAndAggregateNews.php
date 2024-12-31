<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class FetchAndAggregateNews extends Command
{
    protected $signature = 'news:aggregate'; // Command name
    protected $description = 'Fetch and aggregate news articles';

    public function handle(): void
    {
        // Call the method in your controller
        app(\App\Http\Controllers\NewsController::class)->fetchAndAggregateNews();

        $this->info('News aggregation complete!');
    }
}

