<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminSecretMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Define your secret slug here
        $secret = 'SECRET123'; // Change this to your actual secret
        $path = ltrim($request->path(), '/');

        // Allow access only if the path starts with the secret
        if (strpos($path, $secret) !== 0) {
            return redirect('/');
        }

        // Remove the secret from the path for route handling
        $request->server->set('REQUEST_URI', '/' . substr($path, strlen($secret)));
        $request->server->set('PATH_INFO', '/' . substr($path, strlen($secret)));
        $request->attributes->set('admin_secret', $secret);

        return $next($request);
    }
}
