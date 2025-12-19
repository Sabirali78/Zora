<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use App\Models\Article;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Custom route model binding: resolve `article` by `slug` or numeric `id`.
        Route::bind('article', function ($value) {
            if (is_numeric($value)) {
                return Article::where('id', $value)->firstOrFail();
            }
            return Article::where('slug', $value)->orWhere('id', $value)->firstOrFail();
        });
    }
}
