import React from 'react';
import { Link } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

export default function Dashboard({ 
  totalArticles, 
  totalVisits, // This is passed from controller, not totalTraffic
  todayVisits, 
  uniqueVisitors, 
  topArticles, 
  latestLogs, 
  adminName 
}) {
  const [darkMode, setDarkMode] = React.useState(
    window.localStorage.getItem('theme') === 'dark'
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <AdminNavbar adminName={adminName} darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        {adminName && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {adminName}</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Here's an overview of your content management system
            </p>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Articles Card */}
          <div className={`relative overflow-hidden rounded-xl transition-all duration-200 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{totalArticles}</div>
              <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Articles
              </div>
            </div>
          </div>

          {/* Total Visits Card - FIXED: using totalVisits instead of totalTraffic */}
          <div className={`relative overflow-hidden rounded-xl transition-all duration-200 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{totalVisits}</div> {/* Changed here */}
              <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Website Visits
              </div>
            </div>
          </div>

          {/* Today Visits */}
          <div className={`relative overflow-hidden rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
            <div className="p-6">
              <h3 className="text-sm font-medium mb-2">Today's Visits</h3>
              <div className="text-3xl font-bold">{todayVisits}</div>
            </div>
          </div>

          {/* Unique Visitors */}
          <div className={`relative overflow-hidden rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
            <div className="p-6">
              <h3 className="text-sm font-medium mb-2">Unique Visitors</h3>
              <div className="text-3xl font-bold">{uniqueVisitors}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`mt-8 p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link 
              href={route('admin.articles.create') || '#'} 
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Create New Article
            </Link>
            <Link 
              href={route('admin.articles') || '#'} 
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
            >
              View All Articles
            </Link>
            <Link 
              href={route('admin.logs') || '#'} 
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
            >
              Check Activity Logs
            </Link>
            <Link 
              href={route('admin.moderators') || '#'} 
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
            >
              Manage Moderators
            </Link>
          </div>
        </div>

        <div className={`mt-10 p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
          <h2 className="text-xl font-bold mb-4">🔥 Top 10 Most Viewed Articles</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-left`}>
                <th className="p-3">#</th>
                <th className="p-3">Article</th>
                <th className="p-3">Views</th>
              </tr>
            </thead>

            <tbody>
              {topArticles.map((item, index) => (
                <tr key={index} className={`${darkMode ? 'border-gray-800' : 'border-gray-200'} border-t`}>
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    {item.article
                      ? <Link href={`/articles/${item.article.slug}`} className="text-blue-500 hover:underline">
                          {item.article.title}
                        </Link>
                      : 'Deleted Article'}
                  </td>
                  <td className="p-3 font-semibold">{item.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       <div className={`mt-6 sm:mt-10 p-4 sm:p-6 rounded-lg sm:rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'}`}>
  <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">📈 Recent Visits</h2>

  {/* Desktop Table (hidden on mobile) */}
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full border-collapse min-w-[600px]">
      <thead>
        <tr className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-left text-sm`}>
          <th className="p-2 sm:p-3 font-medium">Article</th>
          <th className="p-2 sm:p-3 font-medium">IP</th>
          <th className="p-2 sm:p-3 font-medium">Browser</th>
          <th className="p-2 sm:p-3 font-medium">Time</th>
        </tr>
      </thead>
      <tbody>
        {latestLogs.map((log, i) => (
          <tr key={i} className={`${darkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50'} border-t transition-colors`}>
            <td className="p-2 sm:p-3 text-sm">
              <div className="font-medium truncate max-w-[200px]">
                {log.article ? log.article.title : 'Deleted Article'}
              </div>
            </td>
            <td className="p-2 sm:p-3 text-sm font-mono text-gray-500 dark:text-gray-400">
              {log.ip}
            </td>
            <td className="p-2 sm:p-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="truncate max-w-[180px]">{log.user_agent}</div>
            </td>
            <td className="p-2 sm:p-3 text-sm text-gray-500 dark:text-gray-400">
              {log.created_at}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Mobile Cards (shown on mobile) */}
  <div className="md:hidden space-y-4">
    {latestLogs.map((log, i) => (
      <div 
        key={i} 
        className={`p-4 rounded-lg border ${darkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}
      >
        <div className="space-y-3">
          {/* Article Title */}
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Article
            </div>
            <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {log.article ? log.article.title : 'Deleted Article'}
            </div>
          </div>

          {/* IP Address */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                IP Address
              </div>
              <div className="font-mono text-sm text-gray-600 dark:text-gray-400">
                {log.ip}
              </div>
            </div>
            
            {/* Time Badge */}
            <div className="text-right">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Time
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {log.created_at}
              </div>
            </div>
          </div>

          {/* Browser Info */}
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Browser
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {log.user_agent}
            </div>
          </div>

          {/* View Details Button (Optional) */}
          <button 
            className={`w-full mt-2 py-2 text-sm font-medium rounded-lg transition-colors ${darkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            onClick={() => {/* Add click handler */}}
          >
            View Details
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* Empty State */}
  {latestLogs.length === 0 && (
    <div className={`text-center py-8 sm:py-12 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
      <div className="text-4xl mb-3">📭</div>
      <h3 className={`text-lg font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        No visits yet
      </h3>
      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        Visitor logs will appear here once people start viewing your articles.
      </p>
    </div>
  )}

  {/* View All Button */}
  {latestLogs.length > 0 && (
    <div className="mt-6 text-center">
      <button 
        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${darkMode 
          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
        onClick={() => {/* Add click handler */}}
      >
        View All Logs
        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )}
</div>
      </main>
    </div>
  );
}