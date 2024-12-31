<?php

namespace App\Http\Controllers;

use App\Jobs\FetchAndAggregateNewsJob;
use App\Models\Category;
use App\Models\Source;
use Illuminate\Http\Request;
use App\Services\AggregationService;
use App\Services\CategoryService;
use App\Services\SourceService;
use App\Services\NewsFetcherService;
use Illuminate\Http\JsonResponse;
use App\Models\News;
use Carbon\Carbon;

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
        $filters = $request->only(['keyword', 'categories', 'origins', 'date_range', 'q']);

        // Start building the query
        $query = News::query()->with([
            'category:id,name',
            'source:id,name'
        ]);

        // Apply the keyword filter (search within title or content)
        if (isset($filters['q']) && $filters['q']) {
            $query->where(function ($query) use ($filters) {
                $query->where('title', 'like', '%' . $filters['q'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['q'] . '%');
            });
        }

        if (isset($filters['categories']) && $filters['categories']) {
           $categories = array_map('trim', explode(',', $filters['categories'])); 
            $query->whereHas('category', function ($query) use ($categories) {
                $query->whereIn('name', $categories);
            });
        }

        if (isset($filters['origins']) && $filters['origins']) {
           $sources = array_map('trim', explode(',', $filters['origins'])); 
            $query->whereHas('source', function ($query) use ($sources) {
                $query->whereIn('name', $sources);
            });
        }

                // Apply the date range filter if provided as a comma-separated string
        if (isset($filters['date_range']) && $filters['date_range']) {
            $timestamps = explode(',', $filters['date_range']);

            if (count($timestamps) === 2) {
                $startTimestamp = trim($timestamps[0]);
                $endTimestamp = trim($timestamps[1]);

                $query->whereBetween('published_at', [
                    Carbon::createFromTimestamp($startTimestamp)->toDateTimeString(),
                    Carbon::createFromTimestamp($endTimestamp)->toDateTimeString(),
                ]);
            }
        }

        // Apply the default ordering by published_at (descending)
        $news = $query->orderBy('published_at', 'desc')->paginate(12);

        // Return the paginated news data as JSON
        return response()->json($news);
    }


    public function personalizedFeed(): array
    {
         $categories = Category::query()
            ->distinct()
            ->get()
            ->pluck('name');

        $origins = Source::query()
            ->distinct()
            ->get()
            ->pluck('name');

        return [
            'categories' => $categories,
            'origins' => $origins,
        ];
    }


}
