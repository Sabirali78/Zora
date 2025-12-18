import React from 'react';
import { Link } from '@inertiajs/react';

export default function ModeratorNavbar({ moderatorName, moderator }) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={route('moderator.dashboard')} className="text-lg font-bold mr-4 text-gray-900 dark:text-white">Moderator</Link>
            <nav className="hidden sm:flex space-x-3">
              <Link href={route('moderator.dashboard')} className="text-sm hover:underline text-gray-700 dark:text-gray-200">Overview</Link>
              <Link href={route('moderator.articles')} className="text-sm hover:underline text-gray-700 dark:text-gray-200">Articles</Link>
              {moderator && !moderator.email_verified_at ? (
                <button className="text-sm text-gray-400" disabled>Verify email to create</button>
              ) : (
                <Link href={route('moderator.articles.create')} className="text-sm hover:underline text-gray-700 dark:text-gray-200">Create</Link>
              )}
              <Link href={route('moderator.logs')} className="text-sm hover:underline text-gray-700 dark:text-gray-200">Logs</Link>
            </nav>
          </div>

          <div className="flex items-center">
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              <div className="text-sm text-gray-700 dark:text-gray-200">{moderatorName}</div>
              <Link href={route('moderator.logout')} method="post" as="button" className="px-3 py-1 bg-red-600 text-white rounded text-sm">Logout</Link>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button onClick={() => setOpen((s) => !s)} className="p-2 rounded-md text-gray-700 dark:text-gray-200 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {open ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden px-4 pb-4">
            <nav className="space-y-2">
            <Link href={route('moderator.dashboard')} className="block text-gray-700 dark:text-gray-200">Overview</Link>
            <Link href={route('moderator.articles')} className="block text-gray-700 dark:text-gray-200">Articles</Link>
              {moderator && !moderator.email_verified_at ? (
                <div className="block text-gray-400">Verify email to create</div>
              ) : (
                <Link href={route('moderator.articles.create')} className="block text-gray-700 dark:text-gray-200">Create</Link>
              )}
              <Link href={route('moderator.logs')} className="block text-gray-700 dark:text-gray-200">Logs</Link>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-700 dark:text-gray-200 py-2">{moderatorName}</div>
              <Link href={route('moderator.logout')} method="post" as="button" className="block w-full text-left px-3 py-2 bg-red-600 text-white rounded">Logout</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
