<?php

namespace App\Services;

use App\Models\Category;
use App\Models\News;
use App\Models\Source;
use DateTime;
use Illuminate\Support\Facades\DB;

class AggregationService
{
    public function aggregateNews(array $newsData, Source $source, Category $category): void
    {
        foreach ($newsData as $news) {
            DB::transaction(function() use($news, $source, $category) {
                // Reverse transform the name back to the config key format
                $configKey = strtolower(str_replace(' ', '_', $source->name));
                if($configKey === 'news_api'){
                    $this->saveOrUpdateFromNewsApi($news, $source, $category);
                }
                if($configKey === 'new_york_times'){
                    $this->saveOrUpdateFromTheNYT($news, $source, $category);
                }
                if($configKey === 'the_guardian'){
                    $this->saveOrUpdateFromTheGuardian($news, $source, $category);
                }
            });
        }
    }

    protected function saveOrUpdateFromNewsApi(array $news, $source, $category): void
    {
        News::updateOrCreate(
            ['title' => $news['title'], 'source_id' => $source->id],
            [
                'description' => $news['description'] ?? '',
                'source_id' => $source->id,
                'category_id' => $category->id,
                'published_at' => $news['"publishedAt'] ?? now(),
                'web_url' => $news['url'] ?? '',
                'image_url' => $news['urlToImage'] ?? '',
            ]
        );
    }

    protected function saveOrUpdateFromTheNYT(array $news, $source, $category): void
    {
        News::updateOrCreate(
            ['title' => $news['title'], 'source_id' => $source->id],
            [
                'description' => $news['description'] ?? '',
                'origin' => $source->name,
                'category_id' => $category->id,
                'published_at' => $news['published_at'] ?? now(),
                'web_url' => $news['url'] ?? '',
                'image_url' => $news['url'] ?? '',
            ]
        );
    }
    protected function saveOrUpdateFromTheGuardian(array $news, $source, $category): void
    {
        News::updateOrCreate(
            ['title' => $news['webTitle'], 'source_id' => $source->id],
            [
                'description' => $news['description'] ?? '',
                'source_id' => $source->id,
                'category_id' => $category->id,
                'published_at' => new DateTime($news['webPublicationDate']) ?? now(),
                'web_url' => $news['webUrl'] ?? '',
                'image_url' => $news['url'] ?? '',
            ]
        );
    }
}
