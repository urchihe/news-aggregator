<?php

namespace App\Http\Controllers;

use App\Models\Pref;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
   public function index(Request $request)
    {
        if ($user = Auth::guard('api')->user()) {
           return $user->load('prefs'); 
        }

        return null;
    }

    public function updatePrefs(Request $request)
    {
        $user = Auth::guard('api')->user();
        Pref::query()->updateOrCreate(
            [
                'user_id' => $user->id,
                'pref_key' => $request->input('pref_key'),
            ],
            [
                 'keywords' => 'user defined',
                'pref_value' => $request->input('pref_value') ?? '',
            ]
        );
        return [
            'success' => true,
        ];
    }
}
