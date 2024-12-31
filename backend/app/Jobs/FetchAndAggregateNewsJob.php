<?php

namespace App\Jobs;

use App\Models\Category;
use App\Models\Source;
use App\Services\AggregationService;
use App\Services\CategoryService;
use App\Services\NewsFetcherService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class FetchAndAggregateNewsJob implements ShouldQueue
{
    use Queueable;

    public Source $source;
    public Category $category;

    public function __construct(Source $source, Category $category)
    {
        $this->source = $source;
        $this->category = $category;
    }

    public function handle(
        NewsFetcherService $newsFetcherService,
        CategoryService $categoryService,
        AggregationService $aggregationService
    ): void
    {
        try {
            $newsData = $newsFetcherService->fetchNews($this->source, $this->category);

            if (!empty($newsData)) {
                $configKey = strtolower(str_replace(' ', '_', $this->source->name));
                $categoryName = $newsData['category'] ?? 'General';
                $categoryService->getOrCreateCategory($categoryName);

                $processMapping = [
                    'news_api' => fn($data) => $aggregationService->aggregateNews($data['articles'], $this->source, $this->category),
                    'the_guardian' => fn($data) => $aggregationService->aggregateNews($data['response']['results'], $this->source, $this->category),
                    'new_york_times' => fn($data) => $aggregationService->aggregateNews($data, $this->source, $this->category),
                ];

                if (isset($processMapping[$configKey])) {
                    $processMapping[$configKey]($newsData);
                } else {
                    error_log("Unsupported configKey: $configKey");
                }
            }
        } catch (Exception $e) {
            // Log or handle exceptions
            error_log("Job failed: " . $e->getMessage());
        }
    }
}
