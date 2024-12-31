<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Collection;

class CategoryService
{
    public function getOrCreateCategory(string $name): Category
    {
        return Category::firstOrCreate(['name' => $name]);
    }

    public function getAllCategories(): Collection
    {
        return Category::all();
    }
}
