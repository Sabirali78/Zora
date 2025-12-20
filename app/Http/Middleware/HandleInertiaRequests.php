<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user() ? $request->user()->only('id', 'name', 'email', 'is_admin', 'role') : null,
            ],
            'ziggy' => function () use ($request) {
                $ziggy = (new Ziggy)->toArray();
                
                // Filter out sensitive routes (like admin routes)
                $filteredRoutes = array_filter($ziggy['routes'], function ($route) {
                    return !str_contains($route['uri'], 'admin');
                });
                
                return [
                    ...$ziggy,
                    'routes' => $filteredRoutes,
                    'location' => $request->url(),
                ];
            },
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            // Language removed: always use English
            'currentLanguage' => 'en',
        ];
    }

    /**
     * Handle the incoming request.
     */
    public function handle(Request $request, \Closure $next)
    {
        $response = parent::handle($request, $next);
        
        // Add security headers to prevent caching of sensitive pages
        $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', '0');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        
        return $response;
    }
}