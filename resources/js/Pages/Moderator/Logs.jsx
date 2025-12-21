import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ModeratorNavbar from '../../components/ModeratorNavbar';

export default function Logs() {
  const { logs = [], pagination = {}, moderator = null } = usePage().props;
  const [darkMode, setDarkMode] = useState(
    window.localStorage.getItem('theme') === 'dark'
  );
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);
  
  const items = Array.isArray(logs) ? logs : (logs?.data || []);

  // Function to parse and format details JSON
  const formatDetails = (details) => {
    try {
      if (typeof details === 'string') {
        const parsed = JSON.parse(details);
        details = parsed;
      }
      
      if (typeof details === 'object' && details !== null) {
        return (
          <div className="space-y-2">
            {details.model && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-xs">Model:</span>
                <span className="text-xs">{details.model}</span>
              </div>
            )}
            
            {details.title && (
              <div className="flex items-start gap-2">
                <span className="font-medium text-xs">Title:</span>
                <span className="flex-1 text-xs truncate">{details.title}</span>
              </div>
            )}
            
            {details.id && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-xs">ID:</span>
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">#{details.id}</span>
              </div>
            )}
            
            {details.changes && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="font-medium text-xs mb-1">Changes:</div>
                <div className="space-y-1 pl-1 text-xs">
                  {Object.entries(details.changes).map(([key, value]) => {
                    if (key === 'images' && value.from && value.to) {
                      return (
                        <div key={key}>
                          <span className="font-medium">{key}:</span>
                          <div className="pl-1">
                            <div className="truncate">From: {JSON.stringify(value.from)}</div>
                            <div className="truncate">To: {JSON.stringify(value.to)}</div>
                          </div>
                        </div>
                      );
                    }
                    
                    if (key === 'additional_images' && typeof value === 'object') {
                      return (
                        <div key={key}>
                          <span className="font-medium">{key}:</span>
                          <div className="pl-1 truncate">
                            {Object.entries(value).map(([subKey, subValue]) => (
                              <div key={subKey} className="truncate">{subKey}: {subValue}</div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    
                    if (key === 'image_id' || key === 'image_path') {
                      return (
                        <div key={key} className="truncate">
                          <span className="font-medium">{key}:</span>
                          <span className="ml-1 truncate">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                          </span>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={key} className="truncate">
                        <span className="font-medium">{key}:</span>
                        <span className="ml-1">
                          {typeof value === 'string' ? value : JSON.stringify(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      }
      
      return <span className="text-xs">{typeof details === 'string' ? details : JSON.stringify(details)}</span>;
    } catch (error) {
      return <span className="text-xs">{typeof details === 'string' ? details : JSON.stringify(details)}</span>;
    }
  };

  // Function to format action with badge
  const formatAction = (action) => {
    const actionColors = {
      update: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      delete_image: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      create: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      delete: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      login: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      logout: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    };
    
    const colorClass = actionColors[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${colorClass}`}>
        {action.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  // Mobile card view for logs
  const MobileLogCard = ({ log }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-3 shadow-sm">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {formatAction(log.action)}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(log.created_at).toLocaleDateString()}
          </div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300">
          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Target information */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Target:</span>
          <span className="text-sm text-gray-900 dark:text-white">
            {log.model_type}
            {log.model_id && <span className="ml-1 text-xs text-gray-500">#{log.model_id}</span>}
          </span>
        </div>
        {log.article && (
          <Link 
            href={route('moderator.articles.edit', { article: log.article.id })} 
            className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {log.article.title || `Article #${log.article.id}`}
          </Link>
        )}
      </div>

      {/* Details section */}
      <div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Details:</div>
<div className="p-2 bg-gray-50 dark:bg-gray-900/30 rounded border border-gray-200 dark:border-gray-700">
          {formatDetails(log.details)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <ModeratorNavbar 
        moderatorName={moderator?.name} 
        moderator={moderator}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      
      <div className="container mx-auto px-3 py-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Activity Logs</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Track your actions and modifications
              </p>
            </div>
            <Link 
              href={route('moderator.articles')} 
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden xs:inline">Back</span>
            </Link>
          </div>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No activity logs found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your actions will appear here</p>
          </div>
        ) : (
          <>
            {/* Mobile View - Card Layout */}
            <div className="block md:hidden space-y-3">
              {items.map((log) => (
                <MobileLogCard key={log.id} log={log} />
              ))}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Target
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {items.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                        <td className="px-4 py-3 whitespace-nowrap">
                          {formatAction(log.action)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="text-sm">
                              {log.model_type}
                              {log.model_id && (
                                <span className="ml-1 text-xs text-gray-500">#{log.model_id}</span>
                              )}
                            </div>
                            {log.article && (
                              <div>
                                <Link 
                                  href={route('moderator.articles.edit', { article: log.article.id })} 
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-xs"
                                >
                                  {log.article.title || `Article #${log.article.id}`}
                                </Link>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs">
  <div className="p-2 bg-gray-50 dark:bg-gray-900/30 rounded border border-gray-200 dark:border-gray-700">
                              {formatDetails(log.details)}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-gray-900 dark:text-white">
                              {new Date(log.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(log.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Pagination - Mobile Optimized */}
        {pagination && pagination.total > 0 && (
          <div className="mt-6">
            {/* Info */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              Showing <span className="font-medium">{((pagination.current_page - 1) * pagination.per_page) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
              </span>{' '}
              of <span className="font-medium">{pagination.total}</span> logs
            </div>
            
            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {pagination.current_page} of {pagination.last_page}
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {pagination.prev_page_url ? (
                  <Link 
                    href={pagination.prev_page_url} 
                    className="flex-1 sm:flex-none px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors flex items-center justify-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden xs:inline">Previous</span>
                    <span className="xs:hidden">Prev</span>
                  </Link>
                ) : (
                  <button 
                    disabled 
                    className="flex-1 sm:flex-none px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-lg text-sm cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden xs:inline">Previous</span>
                    <span className="xs:hidden">Prev</span>
                  </button>
                )}
                
                {pagination.next_page_url ? (
                  <Link 
                    href={pagination.next_page_url} 
                    className="flex-1 sm:flex-none px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="hidden xs:inline">Next</span>
                    <span className="xs:hidden">Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <button 
                    disabled 
                    className="flex-1 sm:flex-none px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-lg text-sm cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    <span className="hidden xs:inline">Next</span>
                    <span className="xs:hidden">Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}