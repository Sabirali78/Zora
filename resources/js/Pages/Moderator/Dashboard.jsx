import React from 'react';
import ModeratorNavbar from '../../components/ModeratorNavbar';

export default function ModeratorDashboard({ totalArticles = 0, englishArticles = 0, urduArticles = 0, multiLangArticles = 0, moderatorName, moderator = null }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <ModeratorNavbar moderatorName={moderatorName} moderator={moderator} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        {moderatorName && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {moderatorName}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Here's an overview of your content management system
            </p>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Articles Card */}
          <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{totalArticles}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Articles
              </div>
            </div>
          </div>

          {/* English Articles Card */}
          <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{englishArticles}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                English Articles
              </div>
            </div>
          </div>

          {/* Urdu Articles Card */}
          <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{urduArticles}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Urdu Articles
              </div>
            </div>
          </div>

          {/* Multi-language Articles Card */}
          <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/30">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{multiLangArticles}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Multi-language
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Content Overview</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monitor and manage all articles across different languages. Use the navigation menu to access specific article categories and management tools.
          </p>
        </div>
      </main>
    </div>
  );
}