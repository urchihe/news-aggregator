<?php

namespace App\Services;

use App\Models\Source;
use Illuminate\Database\Eloquent\Collection;

class SourceService
{
    /**
     *@return Collection<int, Source>
     */
    public function getAllSources(): Collection
    {
        return Source::all();
    }
}
