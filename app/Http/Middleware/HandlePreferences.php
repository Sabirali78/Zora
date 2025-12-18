<?php
// app/Http/Middleware/HandlePreferences.php

// app/Http/Middleware/HandlePreferences.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HandlePreferences
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        if ($request->header('X-Inertia')) {
            // Get language from cookie or default to 'en'
            $language = $request->cookie('language', 'en');
            
            // Share with all Inertia views
            $response->with('language', $language);
            
            // Ensure cookie is set
            $response->cookie('language', $language, 60 * 24 * 365);
        }
        
        return $response;
    }
}