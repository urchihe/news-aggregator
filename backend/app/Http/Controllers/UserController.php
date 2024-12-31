<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function savePreferences(Request $request): JsonResponse
    {
        $user = auth()->user();

        // Validate the request inputs
        $validatedData = $request->validate([
            'sources' => 'array|exists:sources,id',
            'categories' => 'array|exists:categories,id',
        ]);

        // Get or create the preference record for the user
        $preference = $user->preference()->firstOrCreate(['user_id' => $user->id]);

        // Sync the relationships
        $preference->sources()->sync($validatedData['sources'] ?? []);
        $preference->categories()->sync($validatedData['categories'] ?? []);

        return response()->json(['message' => 'Preferences saved successfully']);
    }

    public function getUserPreferences(): JsonResponse
    {
        $user = auth()->user();

        // Get the user's preference
        $preference = $user?->preference()->first();

        if (!$preference) {
            return response()->json(['message' => 'No preferences found'], 404);
        }

        // Retrieve the associated sources and categories
        $sources = $preference->sources;
        $categories = $preference->categories;

        return response()->json([
            'sources' => $sources,
            'categories' => $categories
        ]);
    }


}
