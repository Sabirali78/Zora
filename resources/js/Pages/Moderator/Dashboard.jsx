import React from 'react';
import { Link } from '@inertiajs/react';
import ModeratorNavbar from '../../components/ModeratorNavbar';

export default function ModeratorDashboard({ 
  totalArticles, 
  moderatorName, 
  moderatorArticles,
  moderator,
  
  // Traffic stats specific to moderator
  moderatorArticleVisits,
  moderatorTodayVisits,
  moderatorUniqueVisitors,
  moderatorTopArticles,
  moderatorRecentLogs,
  moderatorCategoryCounts,
  monthlyPerformance,
  
  // General traffic stats
  totalVisits,
  todayVisits,
  uniqueVisitors,
  
  categories 
}) {
  // Stats calculations
  const pendingArticles = 0; // You can add this to your backend
  const approvedArticles = moderatorArticles; // Assuming these are approved
  const approvalRate = totalArticles > 0 ? Math.round((approvedArticles / totalArticles) * 100) : 0;
  
  const [darkMode, setDarkMode] = React.useState(
    window.localStorage.getItem('theme') === 'dark'
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <ModeratorNavbar moderatorName={moderatorName} moderator={moderator} darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Moderator Dashboard
              </h1>
              {moderatorName && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Welcome back, <span className="font-semibold">{moderatorName}</span>
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                Active
              </span>
              <span>•</span>
              <span>Last login: Today</span>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* My Articles */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Articles</p>
                <p className="text-3xl font-bold mt-2">{moderatorArticles.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Published under your name
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-3xl font-bold mt-2">{moderatorArticleVisits.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              All-time article views
            </div>
          </div>

          {/* Today's Views */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Views</p>
                <p className="text-3xl font-bold mt-2">{moderatorTodayVisits.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Views in last 24 hours
            </div>
          </div>

          {/* Unique Visitors */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Visitors</p>
                <p className="text-3xl font-bold mt-2">{moderatorUniqueVisitors.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Unique readers of your articles
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link 
              href={route('moderator.articles.create')} 
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Create New Article
            </Link>
            <Link 
              href={route('moderator.articles')} 
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
            >
              View My Articles
            </Link>
            <Link 
              href={route('moderator.logs')} 
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
            >
              My Activity Logs
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* My Top Articles */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🔥 My Top Articles</h2>
            {moderatorTopArticles && moderatorTopArticles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                      <th className="pb-3 px-2">#</th>
                      <th className="pb-3 px-2">Article</th>
                      <th className="pb-3 px-2 text-right">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moderatorTopArticles.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-2">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          {item.article ? (
                            <Link 
                              href={`/articles/${item.article.slug}`} 
                              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                              {item.article.title}
                            </Link>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 italic">Deleted Article</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right font-semibold text-gray-900 dark:text-white">
                          {item.views.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">No views yet. Create your first article!</p>
              </div>
            )}
          </div>

          {/* Recent Visits */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">📈 Recent Visits</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {moderatorRecentLogs?.length || 0} activities
              </span>
            </div>
            {moderatorRecentLogs && moderatorRecentLogs.length > 0 ? (
              <div className="space-y-4">
                {moderatorRecentLogs.slice(0, 5).map((log, index) => (
                  <div key={index} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {log.article ? log.article.title : 'Deleted Article'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {log.ip}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                          {log.user_agent}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {log.created_at}
                      </span>
                    </div>
                  </div>
                ))}
                {moderatorRecentLogs.length > 5 && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                    <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 py-2">
                      View all {moderatorRecentLogs.length} activities
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">No recent visits recorded</p>
              </div>
            )}
          </div>
        </div>

        {/* Articles by Category */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">📊 Articles by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories && categories.map((category, index) => {
                const count = moderatorCategoryCounts[category] || 0;
                const colors = [
                  'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
                  'bg-red-500', 'bg-purple-500', 'bg-pink-500'
                ];
                return (
                  <div key={index} className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${colors[index % colors.length]} flex items-center justify-center text-white text-xl font-bold`}>
                      {count}
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">{category}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Articles</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monthly Performance Chart */}
        {monthlyPerformance && monthlyPerformance.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">📈 Monthly Performance</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last 6 months
              </span>
            </div>
            <div className="h-64 flex items-end space-x-2">
              {monthlyPerformance.map((month, index) => {
                const maxVisits = Math.max(...monthlyPerformance.map(m => m.visits));
                const height = maxVisits > 0 ? (month.visits / maxVisits) * 100 : 0;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex justify-center mb-2">
                      <div 
                        className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 dark:from-blue-600 dark:to-blue-400 rounded-t-lg transition-all hover:w-10"
                        style={{ height: `${height}%` }}
                        title={`${month.visits} visits`}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {month.month.split('-')[1]}/{month.month.split('-')[0].slice(2)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {monthlyPerformance.reduce((sum, month) => sum + month.visits, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Views (6M)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(monthlyPerformance.reduce((sum, month) => sum + month.visits, 0) / 6)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Monthly</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.max(...monthlyPerformance.map(m => m.visits)).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Peak Month</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}