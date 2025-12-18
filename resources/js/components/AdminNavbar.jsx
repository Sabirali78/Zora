import React from 'react';
import { Link } from '@inertiajs/react';

export default function AdminNavbar({ adminName = null, darkMode = false, setDarkMode = () => {} }) {
  return (
    <header className={`border-b transition-colors duration-200 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              href={route('admin.dashboard')}
              className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              Admin Portal
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link
                href={route('admin.articles') || '#'}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
                >
                Articles
              </Link>
              <Link
                href={route('admin.articles.create') || '#'}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
              >
                Create
              </Link>
              <Link
                href={route('admin.logs') || '#'}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
              >
                Logs
              </Link>
              <Link
                href={route('admin.moderators') || '#'}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
              >
                Moderators
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode((prev) => {
                window.localStorage.setItem('theme', !prev ? 'dark' : 'light');
                return !prev;
              })}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link
              href={route('logout') || '#'}
              method="post"
              as="button"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Logout
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
