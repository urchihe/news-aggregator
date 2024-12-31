<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Source extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'api_url'];

    public function preferences(): BelongsToMany
    {
        return $this->belongsToMany(Preference::class);
    }
}
