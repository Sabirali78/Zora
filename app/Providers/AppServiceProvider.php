<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use App\Models\Article;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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

        // Share authenticated user globally with Inertia
        Inertia::share([
            'auth' => function () {
                $user = Auth::user();
                return [
                    'user' => $user ? [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'is_admin' => $user->role === 'admin',
                    ] : null,
                ];
            },
        ]);
    }
}
