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
        // Redirect moderators to the unified admin login page (uses secret path)
        return redirect(route('admin.login'));
    }

    /** Handle moderator login */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Attempt to authenticate only users with role moderator
        $user = User::where('email', $credentials['email'])->first();
        if (!$user || $user->role !== 'moderator') {
            return back()->withErrors(['email' => 'Invalid moderator credentials'])->withInput();
        }

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/moderator');
        }

        return back()->withErrors(['email' => 'Invalid moderator credentials'])->withInput();
    }

    /** Logout moderator */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect(route('admin.login'));
    }
}
