<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if admin is logged in (session)
        if (!$request->session()->get('is_admin', false)) {
            // Get the secret from the request (set by AdminSecretMiddleware)
            $secret = $request->attributes->get('admin_secret', 'SECRET123');
            return redirect("/{$secret}/login");
        }
        return $next($request);
    }
}
