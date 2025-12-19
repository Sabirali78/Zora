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

// --- MODERATOR ROUTES ---
// Moderator auth (separate from admin)
Route::get('/moderator/register', [ModeratorAuthController::class, 'showRegister'])->name('moderator.register.show');
Route::post('/moderator/register', [ModeratorAuthController::class, 'register'])->name('moderator.register');

Route::get('/moderator/login', [ModeratorAuthController::class, 'showLogin'])->name('moderator.login.show');
Route::post('/moderator/login', [ModeratorAuthController::class, 'login'])->name('moderator.login');
Route::post('/moderator/logout', [ModeratorAuthController::class, 'logout'])->name('moderator.logout');

// Moderator dashboard (protected routes)
Route::middleware(['auth', 'moderator.only'])->group(function () {
    Route::get('/moderator', [ModeratorController::class, 'dashboard'])->name('moderator.dashboard');
    Route::get('/moderator/articles', [ModeratorController::class, 'articles'])->name('moderator.articles');
    Route::get('/moderator/articles/create', [ModeratorController::class, 'createArticle'])->name('moderator.articles.create');
    Route::get('/moderator/logs', [ModeratorController::class, 'logs'])->name('moderator.logs');
    Route::post('/moderator/articles', [ModeratorController::class, 'storeArticle'])->name('moderator.articles.store');
    Route::get('/moderator/articles/{id}/edit', [ModeratorController::class, 'editArticle'])->name('moderator.articles.edit');
    Route::post('/moderator/articles/{id}/update', [ModeratorController::class, 'updateArticle'])->name('moderator.articles.update');
    Route::post('/moderator/articles/{id}/remove-image/{imageId}', [ModeratorController::class, 'removeImage'])->name('moderator.articles.remove_image');
});
// --- ADMIN ROUTES ---
$adminSecret = 'SECRET123';

// Public admin routes (login/logout) - only need admin.secret
Route::prefix($adminSecret)->middleware(['admin.secret'])->group(function () use ($adminSecret) {
    // Login routes
    Route::get('/login', function() use ($adminSecret) {
        // Check if already logged in
        if (session()->get('is_admin', false)) {
            return redirect("/{$adminSecret}");
        }
        return inertia('auth/admin-login', ['adminSecret' => $adminSecret]);
    })->name('admin.login');
    
    Route::post('/login', [App\Http\Controllers\AdminController::class, 'login'])
        ->name('admin.login.submit');
    
    // Logout route
    Route::post('/logout', [App\Http\Controllers\AdminController::class, 'logout'])
        ->name('logout');
});

// Protected admin routes - need both secret and auth
Route::prefix($adminSecret)->middleware(['admin.secret', 'admin.auth'])->group(function () {
    // DASHBOARD ROUTE (this was missing)
    Route::get('/', [App\Http\Controllers\AdminController::class, 'dashboard'])->name('admin.dashboard');
    
    Route::get('/articles', [App\Http\Controllers\AdminController::class, 'allArticles'])->name('admin.articles');
    Route::get('/logs', [App\Http\Controllers\AdminController::class, 'adminLogs'])->name('admin.logs');
    Route::get('/moderators', [App\Http\Controllers\AdminController::class, 'moderators'])->name('admin.moderators');
    Route::post('/moderators/{id}/verify', [App\Http\Controllers\AdminController::class, 'verifyModerator'])->name('admin.moderators.verify');
    Route::get('/moderators/{id}/logs', [App\Http\Controllers\AdminController::class, 'moderatorLogs'])->name('admin.moderators.logs');
    Route::get('/articles/create', [App\Http\Controllers\AdminController::class, 'createArticle'])->name('admin.articles.create');
    Route::post('/articles', [App\Http\Controllers\AdminController::class, 'storeArticle'])->name('admin.articles.store');
    Route::delete('/articles/{id}', [App\Http\Controllers\AdminController::class, 'deleteArticle'])->name('admin.articles.delete');
    Route::get('/articles/{id}/edit', [App\Http\Controllers\AdminController::class, 'editArticle'])->name('admin.articles.edit');
    Route::post('/articles/{id}/update', [App\Http\Controllers\AdminController::class, 'updateArticle'])->name('admin.articles.update');
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



// Add this temporary debug route
Route::get('/debug/moderator-check', function() {
    $email = 'younis@gmail.com';
    $user = \App\Models\User::where('email', $email)->first();
    
    if (!$user) {
        return 'User not found';
    }
    
    // Test password hash
    $password = 'younis123';
    $isPasswordCorrect = \Illuminate\Support\Facades\Hash::check($password, $user->password);
    
    return response()->json([
        'user_exists' => !!$user,
        'email' => $user->email,
        'role' => $user->role,
        'password_hash' => $user->password,
        'password_check' => $isPasswordCorrect ? 'MATCHES' : 'DOES NOT MATCH',
        'test_password' => $password,
        'hashed_test_password' => \Illuminate\Support\Facades\Hash::make($password)
    ]);
});


// Add this before your admin routes
Route::get('/test-middleware', function(Request $request) {
    return response()->json([
        'middleware_test' => 'This route has no middleware',
        'session' => session()->all(),
        'path' => $request->path(),
    ]);
})->middleware(['admin.secret', 'admin.auth']); // Intentionally add middleware here