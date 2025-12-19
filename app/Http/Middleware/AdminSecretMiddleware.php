<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminSecretMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $secret = 'SECRET123';
        $path = $request->path();
        
        // Debug: Log the path and route info
        // \Log::info("AdminSecretMiddleware: Path={$path}, RouteName=" . ($request->route() ? $request->route()->getName() : 'null'));
        
        // Allow access to login page WITHOUT checking admin auth
        if (str_contains($path, "{$secret}/login")) {
            return $next($request);
        }
        
        // For any other path containing the secret, require admin auth
        if (str_contains($path, $secret)) {
            // This will be checked by AdminAuthMiddleware
            return $next($request);
        }
        
        // If someone tries to access admin routes without secret, show 404
        if ($request->routeIs('admin.*')) {
            abort(404);
        }
        
        return $next($request);
    }
}