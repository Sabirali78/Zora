<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $validLanguages = ['en', 'ur'];
        $lang = $request->query('language');
        $cookieLang = $request->cookie('language');
        $sessionLang = session('language');

        // Determine language: query > cookie > session > default
        if (in_array($lang, $validLanguages)) {
            $language = $lang;
        } elseif (in_array($cookieLang, $validLanguages)) {
            $language = $cookieLang;
        } elseif (in_array($sessionLang, $validLanguages)) {
            $language = $sessionLang;
        } else {
            $language = 'en';
        }

        // Persist language in session and cookie
        session(['language' => $language]);
        Cookie::queue('language', $language, 60 * 24 * 365);

        // Optionally set app locale
        app()->setLocale($language);

        return $next($request);
    }
}
