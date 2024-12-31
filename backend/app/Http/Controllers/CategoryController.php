<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $source = Category::all()->makeHidden(['created_at', 'updated_at']);
        return response()->json($source);
    }
}
