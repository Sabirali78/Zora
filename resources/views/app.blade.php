<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Inline script to detect system dark mode preference --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? "system" }}';
            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style for dark/light background --}}
    <style>
        html { background-color: oklch(1 0 0); }
        html.dark { background-color: oklch(0.145 0 0); }
    </style>

    {{-- Inertia dynamic title/meta --}}
    <title inertia>{{ config('app.name', 'The WriteLine') }}</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Global SEO defaults --}}
    <meta name="description" content="The WriteLine – Read news, opinion, creative stories, and tech articles.">
    <meta name="keywords" content="News, Opinion, Analysis, Fiction, Creative Stories, Tech, Miscellaneous">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{{ url()->current() }}">

    {{-- Open Graph default --}}
    <meta property="og:site_name" content="The WriteLine">
    <meta property="og:type" content="website">
    <meta property="og:title" content="The WriteLine – Read news, opinion, creative stories, and tech articles">
    <meta property="og:description" content="Stay updated with latest articles and stories on The WriteLine.">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:image" content="{{ asset('default-og-image.jpg') }}">

    {{-- Twitter Card default --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="The WriteLine – Read news, opinion, creative stories, and tech articles">
    <meta name="twitter:description" content="Stay updated with latest articles and stories on The WriteLine.">
    <meta name="twitter:image" content="{{ asset('default-og-image.jpg') }}">

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @routes
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead {{-- This is where per-page React SEO is injected --}}
</head>
<body class="font-sans antialiased" 
      data-language="{{ request()->input('language', request()->cookie('language', 'en')) }}" 
      data-dark="{{ ($appearance ?? 'system') == 'dark' ? '1' : '0' }}">
    @inertia
</body>
</html>
