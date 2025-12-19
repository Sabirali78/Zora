<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

class ModeratorAuthController extends Controller
{
    /** Show registration page (Inertia). */
    public function showRegister(Request $request)
    {
        return Inertia::render('auth/Register');
    }

    /** Handle moderator registration. */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_admin' => false,
            'role' => 'moderator',
            'email_verified_at' => null,
        ]);

        // Log the user in (moderator guard uses default web guard)
        Auth::login($user);

        return redirect('/')->with('success', 'Moderator account created and logged in');
    }

    /** Show moderator login page */
    public function showLogin(Request $request)
    {
        // Check if already logged in as moderator
        if (Auth::check() && Auth::user()->role === 'moderator') {
            return redirect('/moderator');
        }
        
        return Inertia::render('auth/Login');
    }

    /** Handle moderator login - FIXED FOR INERTIA */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Attempt to authenticate
        if (Auth::attempt($credentials, $request->filled('remember'))) {
            $request->session()->regenerate();
            
            // Check if the authenticated user is a moderator
            if (Auth::user()->role === 'moderator') {
                // Redirect to moderator dashboard
                return redirect()->intended('/moderator');
            } else {
                // Logout if user is not a moderator
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                // Use Inertia's back() with errors
                return back()->withErrors([
                    'email' => 'Access denied. Moderator account required.'
                ]);
            }
        }

        // Authentication failed - return with Inertia errors
        return back()->withErrors([
            'email' => 'Invalid credentials'
        ]);
    }

    /** Logout moderator */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/moderator/login');
    }
}