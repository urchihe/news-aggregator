<?php

namespace App\Http\Controllers;

use App\Models\Source;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SourceController extends Controller
{
    public function index(): JsonResponse
    {
        $source = Source::all()->makeHidden(['created_at', 'updated_at']);
        return response()->json($source);
    }
}
