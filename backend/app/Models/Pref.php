<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Pref extends Model
{
    use HasFactory;

    protected $table = 'preferences';

    protected $fillable = ['user_id', 'keywords','pref_key','pref_value',];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function sources(): BelongsToMany
    {
        return $this->belongsToMany(Source::class);
    }
}
