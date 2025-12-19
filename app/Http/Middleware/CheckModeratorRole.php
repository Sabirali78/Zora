<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckModeratorRole
{
    public function handle(Request $request, Closure $next)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect('/moderator/login')->with('error', 'Please login first.');
        }

        // Check if user has moderator role
        if (Auth::user()->role !== 'moderator') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect('/moderator/login')->with('error', 'Access denied. Moderator role required.');
        }

        return $next($request);
    }
}