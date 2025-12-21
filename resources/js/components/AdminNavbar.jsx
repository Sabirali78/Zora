import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function AdminNavbar({ adminName = null, darkMode = false, setDarkMode = () => {} }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// In your AdminNavbar.jsx, update the navLinks array:
const navLinks = [
    { name: 'Dashboard', href: route('admin.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Articles', href: route('admin.articles'), icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Create', href: route('admin.articles.create'), icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { name: 'Traffic', href: route('admin.traffic'), icon: 'M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z' },
    { name: 'Logs', href: route('admin.logs'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Moderators', href: route('admin.moderators'), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0h1m-4 3v1m-5-4h1m3-4v1' },
];

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-200 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link
                href={route('admin.dashboard')}
                className="flex items-center space-x-2"
              >
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Admin Panel
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-1">
              {navLinks.map((item) => (
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
              ))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Admin name */}
            {adminName && (
              <div className="hidden md:flex items-center">
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${darkMode 
                  ? 'bg-gray-800 text-gray-300' 
                  : 'bg-gray-100 text-gray-700'
                }`}>
                  <span className="hidden lg:inline">Welcome, </span>
                  <span className="font-semibold">{adminName}</span>
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

            {/* Logout Button */}
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-sm ${darkMode 
                ? 'bg-red-700 hover:bg-red-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-md ${darkMode 
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
              {navLinks.map((item) => (
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
              ))}
              
              {/* Admin info in mobile */}
              {adminName && (
                <div className={`px-3 py-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="text-sm">Logged in as</div>
                  <div className="font-semibold text-base">{adminName}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}