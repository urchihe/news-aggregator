<?php

namespace App\Services;

use App\Models\Category;
use DateTime;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use App\Models\Source;

class NewsFetcherService
{
    public function fetchNews(Source $source, Category $category): JsonResponse|array
    {
        // Reverse transform the name back to the config key format
        $configKey = strtolower(str_replace(' ', '_', $source->name));

        // Retrieve API configuration for the source
        $config = config("news_source.{$configKey}");

        if (!$config) {
            return response()->json(['error' => 'Configuration for the source not found.'], 404);
        }

        // Build the query parameters, including the API key
        $queryParams = $this->buildParameters($configKey, $config['key'] ?? '', $category);


        // Make the HTTP request with query parameters
        $response = Http::get($source->api_url, $queryParams);

        // Check if the request was successful
        if ($response->successful()) {
            return $response->json();
        }

        return []; //
    }

    protected function buildParameters(string $configKey, string $key, Category $category): array
    {
        $startDate = new DateTime('2024-12-10');
        $endDate = new DateTime('2025-01-10');
        $commonParams = [
            'q' => $category->name,
            'from' => $startDate->format('Y-m-d'),
            'to' => $endDate->format('Y-m-d'),
        ];

        $configMappings = [
            'news_api' => [
                'apiKey' => $key,
                'pageSize' => 20,
                'sortBy' => 'popularity',
                'language' => 'en',
            ],
            'new_york_times' => [
                'apiKey' => $key,
                'page' => 20,
                'begin_date' => $startDate->format('Ymd'),
                'end_date' => $endDate->format('Ymd'),
            ],
            'the_guardian' => [
                'api-key' => $key,
                'page' => 20,
                'from_date' => $startDate->format('Y-m-d'),
                'to' => $endDate->format('Y-m-d'),
            ],
        ];

        return array_merge($commonParams, $configMappings[$configKey] ?? []);
    }

}
