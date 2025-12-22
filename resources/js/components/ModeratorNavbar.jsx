import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function ModeratorNavbar({ moderatorName = null, moderator = null, darkMode = false, setDarkMode = () => {} }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: route('moderator.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Articles', href: route('moderator.articles'), icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { 
      name: 'Create', 
      href: route('moderator.articles.create'), 
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      disabled: moderator && !moderator.email_verified_at
    },
    { name: 'Logs', href: route('moderator.logs'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-200 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Logo and desktop navigation */}
          <div className="flex items-center flex-1 min-w-0">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href={route('moderator.dashboard')}
                className="flex items-center space-x-2"
              >
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="hidden sm:flex sm:flex-col">
                  <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Moderator Panel
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Content Management
                  </span>
                </div>
              </Link>
            </div>

            {/* Main Site Link - Hidden on mobile, shown on tablet+ */}
            <Link
              href={route('home')}
              className={`hidden sm:block ml-6 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${darkMode 
                ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              ← Main Site
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-1">
              {navLinks.map((item) => {
                if (item.disabled) {
                  return (
                    <span
                      key={item.name}
                      className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium cursor-not-allowed ${darkMode 
                        ? 'text-gray-500' 
                        : 'text-gray-400'
                      }`}
                      title="Verify email to create content"
                    >
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                      {item.name}
                      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${darkMode 
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <svg className="mr-2 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center justify-end flex-shrink-0 space-x-2 sm:space-x-4">
            {/* Moderator name - Hidden on mobile */}
            {moderatorName && (
              <div className="hidden sm:flex items-center">
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${darkMode 
                  ? 'bg-gray-800 text-gray-300' 
                  : 'bg-gray-100 text-gray-700'
                }`}>
                  <span className="hidden lg:inline">Welcome, </span>
                  <span className="font-semibold">{moderatorName}</span>
                  {moderator && !moderator.email_verified_at && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                      Unverified
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => {
                const newTheme = !darkMode;
                window.localStorage.setItem('theme', newTheme ? 'dark' : 'light');
                setDarkMode(newTheme);
              }}
              className={`p-2 rounded-lg transition-colors ${darkMode 
                ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Logout Button - Smaller on mobile */}
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors shadow-sm ${darkMode 
                ? 'bg-red-700 hover:bg-red-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <svg className="sm:mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`ml-2 sm:hidden p-2 rounded-md ${darkMode 
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Main Site Link in Mobile - Now visible */}
              <Link
                href={route('home')}
                className={`flex items-center rounded-lg px-3 py-3 text-base font-medium transition-colors ${darkMode 
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Main Site
              </Link>

              {navLinks.map((item) => {
                if (item.disabled) {
                  return (
                    <div
                      key={item.name}
                      className={`flex items-center rounded-lg px-3 py-3 text-base font-medium cursor-not-allowed ${darkMode 
                        ? 'text-gray-500' 
                        : 'text-gray-400'
                      }`}
                      title="Verify email to create content"
                    >
                      <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                      {item.name}
                      <svg className="ml-auto h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center rounded-lg px-3 py-3 text-base font-medium transition-colors ${darkMode 
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Moderator info in mobile */}
              {moderatorName && (
                <div className={`px-3 py-3 border-t ${darkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                  <div className="text-sm">Logged in as</div>
                  <div className="font-semibold text-base">{moderatorName}</div>
                  {moderator && !moderator.email_verified_at && (
                    <div className="mt-2 px-2 py-1 inline-flex items-center text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                      <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Email Not Verified
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}