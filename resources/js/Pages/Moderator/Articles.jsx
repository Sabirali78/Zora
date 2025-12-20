import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import ModeratorNavbar from '@/components/ModeratorNavbar';

export default function ModeratorArticles({ 
  articles = [], 
  allArticles = [], 
  moderatorName, 
  moderator = null 
}) {
  const [deletingId, setDeletingId] = useState(null);
  
  const myArticles = Array.isArray(articles) ? articles : (articles?.data || []);
  const allArticlesList = Array.isArray(allArticles) ? allArticles : (allArticles?.data || []);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setDeletingId(id);
      router.delete(route('moderator.articles.destroy', { id }), {
        preserveScroll: true,
        onFinish: () => setDeletingId(null),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <ModeratorNavbar moderatorName={moderatorName} moderator={moderator} />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header with Create Button */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Article Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your articles and view all platform content
              </p>
            </div>
            {moderator && !moderator.email_verified_at ? (
              <button className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed" disabled>
                Verify Email to Create
              </button>
            ) : (
              <Link 
                href={route('moderator.articles.create')} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                + Create New Article
              </Link>
            )}
          </div>
        </div>

        {/* My Articles Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Articles</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Articles you have authored ({myArticles.length})
              </p>
            </div>
          </div>

          {myArticles.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't created any articles yet</p>
              {moderator && moderator.email_verified_at && (
                <Link 
                  href={route('moderator.articles.create')} 
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg inline-block"
                >
                  Create Your First Article
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Language
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {myArticles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {article.title || article.title_urdu || 'Untitled'}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {article.summary || article.summary_urdu || 'No summary'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {article.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            article.language === 'urdu' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                            article.language === 'multi' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                            'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                          }`}>
                            {article.language?.toUpperCase() || 'EN'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(article.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Link
                              href={route('moderator.articles.edit', { id: article.id })}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(article.id)}
                              disabled={deletingId === article.id}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingId === article.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* All Articles Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Articles</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All articles on the platform ({allArticlesList.length})
              </p>
            </div>
          </div>

          {allArticlesList.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No articles available on the platform</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Author
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Language
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {allArticlesList.map((article) => {
                      const isMyArticle = article.author === moderatorName;
                      return (
                        <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {article.title || article.title_urdu || 'Untitled'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                  {article.summary || article.summary_urdu || 'No summary'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                isMyArticle ? 'bg-green-500' : 'bg-gray-400'
                              }`}></div>
                              <div className="text-sm text-gray-900 dark:text-white">
                                {article.author}
                                {isMyArticle && (
                                  <span className="ml-2 text-xs text-green-600 dark:text-green-400">(You)</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                              {article.category || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              article.language === 'urdu' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                              article.language === 'multi' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                              'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                            }`}>
                              {article.language?.toUpperCase() || 'EN'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(article.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              {isMyArticle ? (
                                <>
                                  <Link
                                    href={route('moderator.articles.edit', { id: article.id })}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(article.id)}
                                    disabled={deletingId === article.id}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {deletingId === article.id ? 'Deleting...' : 'Delete'}
                                  </button>
                                </>
                              ) : (
                                <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 italic">
                                  Read only
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}