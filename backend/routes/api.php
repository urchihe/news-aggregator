<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\SourceController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/news', [NewsController::class, 'index']);
Route::get('/pull-data', [NewsController::class, 'fetchAndAggregateNews']);
Route::get('/sources', [SourceController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/user-preference', [UserController::class, 'getUserPreferences']);

Route::post('/sanctum/token', [LoginController::class, 'login']);
