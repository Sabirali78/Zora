
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ArticleController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\ModeratorAuthController;
use App\Http\Controllers\ModeratorController;

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
// Privacy Policy Page
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

// Secret admin URL
$adminSecret = 'SECRET123'; // Change this to your actual secret

// Admin Login Route (only accessible via secret)
Route::middleware(['admin.secret'])->group(function () use ($adminSecret) {
    Route::get("/{$adminSecret}/login", function() {
        return inertia('auth/admin-login');
    })->name('admin.login');
    Route::post("/{$adminSecret}/login", [App\Http\Controllers\AdminController::class, 'login'])->name('admin.login.submit');
});

// Admin Panel Routes (only accessible via secret and if logged in)
Route::middleware(['admin.secret', 'admin.auth'])->group(function () use ($adminSecret) {
    Route::prefix($adminSecret)->group(function () {
        Route::get('/', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('/articles', [\App\Http\Controllers\AdminController::class, 'allArticles'])->name('admin.articles');
        Route::get('/logs', [\App\Http\Controllers\AdminController::class, 'adminLogs'])->name('admin.logs');
        // Moderators management
        Route::get('/moderators', [\App\Http\Controllers\AdminController::class, 'moderators'])->name('admin.moderators');
        Route::post('/moderators/{id}/verify', [\App\Http\Controllers\AdminController::class, 'verifyModerator'])->name('admin.moderators.verify');
        Route::get('/moderators/{id}/logs', [\App\Http\Controllers\AdminController::class, 'moderatorLogs'])->name('admin.moderators.logs');
        Route::get('/articles/create', [\App\Http\Controllers\AdminController::class, 'createArticle'])->name('admin.articles.create');
        Route::post('/articles', [\App\Http\Controllers\AdminController::class, 'storeArticle'])->name('admin.articles.store');
        Route::post('/logout', [\App\Http\Controllers\AdminController::class, 'logout'])->name('logout');
        Route::delete('/articles/{id}', [\App\Http\Controllers\AdminController::class, 'deleteArticle'])->name('admin.articles.delete');
        Route::get('/articles/{id}/edit', [\App\Http\Controllers\AdminController::class, 'editArticle'])->name('admin.articles.edit');
        Route::post('/articles/{id}/update', [\App\Http\Controllers\AdminController::class, 'updateArticle'])->name('admin.articles.update');
    });
});

// Moderator auth (separate from admin)
Route::get('/moderator/register', [ModeratorAuthController::class, 'showRegister'])->name('moderator.register.show');
Route::post('/moderator/register', [ModeratorAuthController::class, 'register'])->name('moderator.register');

Route::get('/moderator/login', [ModeratorAuthController::class, 'showLogin'])->name('moderator.login.show');
Route::post('/moderator/login', [ModeratorAuthController::class, 'login'])->name('moderator.login');
Route::post('/moderator/logout', [ModeratorAuthController::class, 'logout'])->name('moderator.logout');

// Moderator dashboard
Route::get('/moderator', [ModeratorController::class, 'dashboard'])->name('moderator.dashboard');
// Moderator articles
Route::get('/moderator/articles', [ModeratorController::class, 'articles'])->name('moderator.articles');
Route::get('/moderator/articles/create', [ModeratorController::class, 'createArticle'])->name('moderator.articles.create');
    Route::get('/moderator/logs', [ModeratorController::class, 'logs'])->name('moderator.logs');
Route::post('/moderator/articles', [ModeratorController::class, 'storeArticle'])->name('moderator.articles.store');
Route::get('/moderator/articles/{id}/edit', [ModeratorController::class, 'editArticle'])->name('moderator.articles.edit');
Route::post('/moderator/articles/{id}/update', [ModeratorController::class, 'updateArticle'])->name('moderator.articles.update');
Route::post('/moderator/articles/{id}/remove-image/{imageId}', [ModeratorController::class, 'removeImage'])->name('moderator.articles.remove_image');
