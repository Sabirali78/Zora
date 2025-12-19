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
Route::get('/debug/articles', [ArticleController::class, 'debug'])->name('articles.debug');
Route::get('/test/region', [ArticleController::class, 'testRegion'])->name('articles.testRegion');
Route::get('/articles/{article}', [ArticleController::class, 'show'])->name('articles.show');

Route::get('/about-us', function() {
    return Inertia::render('AboutUs');
})->name('about.us');

Route::get('/privacy-policy', function () {
    return inertia('PrivacyPolicy');
})->name('privacy.policy');

// API endpoint to change language (for UI)
Route::post('/set-language', function(Request $request) {
    $language = $request->input('language');
    if (!in_array($language, ['en', 'ur'])) {
        $language = 'en';
    }
    \Session::put('language', $language);
    \Cookie::queue('language', $language, 60*24*365);
    return response()->json(['success' => true, 'language' => $language]);
});

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
Route::prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/articles', [AdminController::class, 'allArticles'])->name('admin.articles');
    Route::get('/logs', [AdminController::class, 'adminLogs'])->name('admin.logs');
    Route::get('/moderators', [AdminController::class, 'moderators'])->name('admin.moderators');
    Route::post('/moderators/{id}/verify', [AdminController::class, 'verifyModerator'])->name('admin.moderators.verify');
    Route::get('/moderators/{id}/logs', [AdminController::class, 'moderatorLogs'])->name('admin.moderators.logs');
    Route::get('/articles/create', [AdminController::class, 'createArticle'])->name('admin.articles.create');
    Route::post('/articles', [AdminController::class, 'storeArticle'])->name('admin.articles.store');
    Route::delete('/articles/{id}', [AdminController::class, 'deleteArticle'])->name('admin.articles.delete');
    Route::get('/articles/{id}/edit', [AdminController::class, 'editArticle'])->name('admin.articles.edit');
    Route::post('/articles/{id}/update', [AdminController::class, 'updateArticle'])->name('admin.articles.update');
});

// ============ MODERATOR ROUTES (WITH /moderator/ PREFIX) ============
Route::prefix('moderator')->group(function () {
    Route::get('/', [ModeratorController::class, 'dashboard'])->name('moderator.dashboard');
    Route::get('/articles', [ModeratorController::class, 'articles'])->name('moderator.articles');
    Route::get('/articles/create', [ModeratorController::class, 'createArticle'])->name('moderator.articles.create');
    Route::get('/logs', [ModeratorController::class, 'logs'])->name('moderator.logs');
    Route::post('/articles', [ModeratorController::class, 'storeArticle'])->name('moderator.articles.store');
    Route::get('/articles/{id}/edit', [ModeratorController::class, 'editArticle'])->name('moderator.articles.edit');
    Route::post('/articles/{id}/update', [ModeratorController::class, 'updateArticle'])->name('moderator.articles.update');
    Route::post('/articles/{id}/remove-image/{imageId}', [ModeratorController::class, 'removeImage'])->name('moderator.articles.remove_image');
});

// Catch all other routes and redirect to home (no 404 errors)
Route::fallback(function() {
    // Try to get language from query, then raw cookie, then default
    $request = request();
    $language = $request->query('language');

    // Prefer decrypted cookie via the framework (EncryptCookies middleware)
    if (!$language) {
        $cookieLang = $request->cookie('language');
        if ($cookieLang) {
            $language = $cookieLang;
        }
    }

    // Only accept known language values, otherwise default to 'en'
    $allowed = ['en', 'ur', 'multi'];
    if (!in_array($language, $allowed)) {
        $language = 'en';
    }

    // Set cookie for future requests (store plain language code)
    \Cookie::queue('language', $language, 60*24*365); // 1 year
    return redirect('/?language=' . $language);
});