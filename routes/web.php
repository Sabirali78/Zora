<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ArticleController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\ModeratorAuthController;
use App\Http\Controllers\ModeratorController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;

// Public Routes
Route::get('/', [ArticleController::class, 'index'])->name('home');
Route::get('/articles', [ArticleController::class, 'list'])->name('articles.list');
Route::get('/category/{category}', [ArticleController::class, 'byCategory'])->name('articles.category');
Route::get('/articles/{article}', [ArticleController::class, 'show'])->name('articles.show');

Route::get('/about-us', function() {
    return Inertia::render('AboutUs');
})->name('about.us');

Route::get('/privacy-policy', function () {
    return inertia('PrivacyPolicy');
})->name('privacy.policy');



// News Page Route
Route::get('/news', [ArticleController::class, 'newsPage'])->name('articles.news');
Route::get('/search', [ArticleController::class, 'search'])->name('articles.search');

// Auth
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');

Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register'])->name('register.submit');

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// ============ ADMIN ROUTES (WITH /admin/ PREFIX) ============
Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/articles', [AdminController::class, 'allArticles'])->name('admin.articles');
    Route::get('/logs', [AdminController::class, 'adminLogs'])->name('admin.logs');
    Route::get('/moderators', [AdminController::class, 'moderators'])->name('admin.moderators');
    Route::post('/moderators/{id}/verify', [AdminController::class, 'verifyModerator'])->name('admin.moderators.verify');
    Route::get('/moderators/{id}/logs', [AdminController::class, 'moderatorLogs'])->name('admin.moderators.logs');
    
    // FIXED: Use lowercase 'traffic-analytics' for URL consistency
    Route::get('/traffic-analytics', [AdminController::class, 'trafficAnalytics'])->name('admin.traffic');
    
    // Remove the duplicate route below
    // Route::get('/TrafficAnalytics', [AdminController::class, 'trafficAnalytics'])->name('admin.traffic');
    
    // Inside the /admin prefix group
    Route::get('/moderators/create', [AdminController::class, 'createModerator'])->name('admin.moderators.create');
    Route::post('/moderators', [AdminController::class, 'storeModerator'])->name('admin.moderators.store');

    Route::get('/articles/create', [AdminController::class, 'createArticle'])->name('admin.articles.create');
    Route::post('/articles', [AdminController::class, 'storeArticle'])->name('admin.articles.store');
    Route::delete('/articles/{id}', [AdminController::class, 'deleteArticle'])->name('admin.articles.delete');
    Route::get('/articles/{id}/edit', [AdminController::class, 'editArticle'])->name('admin.articles.edit');
    Route::post('/articles/{id}/remove-image/{image}', [AdminController::class, 'removeImage'])
        ->name('admin.articles.remove-image');
    Route::post('/articles/{id}/update', [AdminController::class, 'updateArticle'])->name('admin.articles.update');
});

// REMOVE THIS DUPLICATE ROUTE - It's outside the admin prefix group
// Route::get('/TrafficAnalytics', [AdminController::class, 'trafficAnalytics'])->name('admin.traffic');

// ============ MODERATOR ROUTES (WITH /moderator/ PREFIX) ============
Route::prefix('moderator')->middleware('auth')->group(function () {
    Route::get('/', [ModeratorController::class, 'dashboard'])->name('moderator.dashboard');
    Route::get('/articles', [ModeratorController::class, 'articles'])->name('moderator.articles');
    Route::get('/articles/create', [ModeratorController::class, 'createArticle'])->name('moderator.articles.create');
    Route::get('/logs', [ModeratorController::class, 'logs'])->name('moderator.logs');
    Route::post('/articles', [ModeratorController::class, 'storeArticle'])->name('moderator.articles.store');
    Route::get('/articles/{article}/edit', [ModeratorController::class, 'editArticle'])->name('moderator.articles.edit');
    Route::post('/articles/{article}/update', [ModeratorController::class, 'updateArticle'])->name('moderator.articles.update');
    Route::post('/articles/{article}/remove-image/{image}', [ModeratorController::class, 'removeImage'])->name('moderator.articles.remove_image');
    Route::delete('/articles/{article}', [ModeratorController::class, 'destroyArticle'])->name('moderator.articles.destroy');
});

// Catch all other routes and redirect to home (no 404 errors)
Route::fallback(function() {
    return redirect('/');
});
