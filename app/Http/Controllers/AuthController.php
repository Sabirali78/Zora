<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('auth/Login');
    }

    public function showRegister()
    {
        return Inertia::render('auth/Register');
    }

  public function login(Request $request)
{
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required'
    ]);

    if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
        return back()->withErrors([
            'email' => 'Invalid credentials'
        ]);
    }

    $request->session()->regenerate();
    
    $user = Auth::user();

    // For Inertia, return a proper redirect response
        if ($user->role === 'admin') {
            // Store admin id in session for admin dashboard usage
            $request->session()->put('admin_id', $user->id);
            return redirect()->route('admin.dashboard');
    } elseif ($user->role === 'moderator') {
        return redirect()->route('moderator.dashboard');
    }

    return redirect('/');
}

    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'role'     => 'moderator',   // or user
            'password' => Hash::make($request->password),
        ]);

        Auth::login($user);

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('moderator.dashboard');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        // Remove any custom session keys and invalidate session
        $request->session()->forget('admin_id');
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
