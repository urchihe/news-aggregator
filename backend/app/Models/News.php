<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'source_id',
        'category_id',
        'origin',
        'web_url',
        'published_at',
        'image_url',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function source(): BelongsTo
    {
        return $this->belongsTo(Source::class);
    }
    public function scopeFilter($query, $filters): void
    {
        if (isset($filters['keyword'])) {
            $query->where('title', 'like', '%' . $filters['keyword'] . '%')
                ->orWhere('content', 'like', '%' . $filters['keyword'] . '%');
        }

        if (isset($filters['category'])) {
            $query->where('category_id', $filters['category']);
        }

        if (isset($filters['source'])) {
            $query->where('source_id', $filters['source']);
        }

        if (isset($filters['date'])) {
            $query->whereDate('published_at', $filters['date']);
        }
    }

}
