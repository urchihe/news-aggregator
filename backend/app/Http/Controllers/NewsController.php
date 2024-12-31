<?php

namespace App\Http\Controllers;

use App\Jobs\FetchAndAggregateNewsJob;
use App\Models\Source;
use Illuminate\Http\Request;
use App\Services\AggregationService;
use App\Services\CategoryService;
use App\Services\SourceService;
use App\Services\NewsFetcherService;
use Illuminate\Http\JsonResponse;
use App\Models\News;

class NewsController extends Controller
{

    public function __construct(
        protected NewsFetcherService $newsFetcherService,
        protected SourceService $sourceService,
        protected CategoryService $categoryService,
        protected AggregationService $aggregationService
    ) {

    }

    public function fetchAndAggregateNews(): JsonResponse
    {
        $sources = $this->sourceService->getAllSources();
        foreach ($sources as $source) {
            $categories = $this->categoryService->getAllCategories();
            foreach ($categories as $category) {
                dispatch(new FetchAndAggregateNewsJob($source, $category));
            }
        }

        return response()->json(['message' => 'News aggregation jobs dispatched.']);
    }


    public function index(Request $request): JsonResponse
    {
        // Extract filters from the request
        $filters = $request->only(['keyword', 'category', 'source', 'date']);

        // Start building the query
        $query = News::query()->with([
            'category:id,name',
            'source:id,name'
        ]);

        // Apply the keyword filter (search within title or content)
        if (isset($filters['q']) && $filters['q']) {
            $query->where(function ($query) use ($filters) {
                $query->where('title', 'like', '%' . $filters['q'] . '%')
                    ->orWhere('content', 'like', '%' . $filters['q'] . '%');
            });
        }

        // Apply the category filter
        if (isset($filters['category']) && $filters['category']) {
            $query->whereHas('categories', function ($query) use ($filters) {
                $query->where('categories.id', $filters['category']);
            });
        }

        // Apply the source filter
        if (isset($filters['source']) && $filters['source']) {
            $query->where('source_id', $filters['source']);
        }

        // Apply the date filter (if provided)
        if (isset($filters['date']) && $filters['date']) {
            $query->whereDate('published_at', '=', $filters['date']);
        }

        // Apply the default ordering by published_at (descending)
        $news = $query->orderBy('published_at', 'desc')->paginate(12);

        // Return the paginated news data as JSON
        return response()->json($news);
    }


    public function personalizedFeed(): JsonResponse
    {
        $user = auth()->user();

        // Get the user's preferences
        $preferences = $user?->preference;

        if (!$preferences) {
            return response()->json(['message' => 'No preferences found'], 404);
        }

        // Fetch the user's preferred sources and categories via pivot table relationships
        $preferredSourceIds = $preferences->sources->pluck('id')->toArray();
        $preferredCategoryIds = $preferences->categories->pluck('id')->toArray();

        // Query the news based on the user's preferences
        $news = News::whereIn('source_id', $preferredSourceIds)
            ->whereIn('category_id', $preferredCategoryIds)
            ->paginate(10);

        return response()->json($news);
    }


}
