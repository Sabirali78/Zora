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

        if (!Auth::attempt($request->only('email', 'password'))) {
            return back()->withErrors([
                'email' => 'Invalid credentials'
            ]);
        }

        $user = Auth::user();

        // Redirect based on role
        if ($user->role === 'admin' || $user->is_admin == 1) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->role === 'moderator') {
            return redirect()->route('moderator.dashboard');
        }

        return redirect('/'); // default
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

    public function logout()
    {
        Auth::logout();
        return redirect()->route('login');
    }
}
