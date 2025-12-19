<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuthMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $path = $request->path();
        $secret = 'SECRET123';
        
        // Skip auth check for login page
        if (str_contains($path, "{$secret}/login")) {
            return $next($request);
        }
        
        // Check if admin is logged in (session)
        if (!$request->session()->get('is_admin', false)) {
            return redirect("/{$secret}/login");
        }
        
        return $next($request);
    }
}