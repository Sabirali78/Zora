import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';
import { 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  User, 
  Calendar, 
  Globe, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Activity,
  Database,
  Hash,
  ExternalLink
} from 'lucide-react';

export default function AdminLogs({ logs, pagination, filterAdminId }) {
  const [adminId, setAdminId] = useState(filterAdminId || '');
  const [searchInput, setSearchInput] = useState(adminId);
  const [darkMode, setDarkMode] = React.useState(
    window.localStorage.getItem('theme') === 'dark'
  );

  const { adminName } = usePage().props;

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleFilter = (e) => {
    e.preventDefault();
    Inertia.get(window.location.pathname, { admin_id: searchInput });
  };

  const clearFilter = () => {
    setSearchInput('');
    Inertia.get(window.location.pathname, { admin_id: '' });
  };

  const getActionColor = (action) => {
    switch (action?.toLowerCase()) {
      case 'create':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'update':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'view':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, length = 50) => {
    if (!text) return '—';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  const getModelIcon = (modelType) => {
    switch (modelType?.toLowerCase()) {
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar adminName={adminName} darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="h-8 w-8 text-red-600 dark:text-red-500" />
                Admin Activity Logs
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Monitor all administrative actions and system activities
              </p>
            </div>
            <div className="text-sm bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Logs:</span>
              <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                {pagination.total}
              </span>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Logs
              </h2>
              {filterAdminId && (
                <button
                  onClick={clearFilter}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  Clear Filter
                </button>
              )}
            </div>
            
            <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by Admin ID or IP Address"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Apply Filter
              </button>
            </form>
            
            {filterAdminId && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Currently filtering by Admin ID: <span className="font-semibold">{filterAdminId}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Activity Logs Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {filterAdminId 
                  ? 'No logs found for the specified Admin ID. Try a different filter.'
                  : 'No activity logs have been recorded yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Admin / Details
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Article
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                            {log.action || 'Unknown'}
                          </span>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            {getModelIcon(log.model_type)}
                            <span className="text-sm">{log.model_type}</span>
                            <Hash className="h-3 w-3" />
                            <span className="text-sm font-mono">{log.model_id}</span>
                          </div>
                        </div>
                        {log.details && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {truncateText(log.details, 80)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              ID: {log.admin_id}
                            </span>
                          </div>
                          {log.user_agent && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {truncateText(log.user_agent, 60)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {log.article ? (
                          <Link
                            href={route('admin.articles.edit', { id: log.article.id })}
                            className="group inline-flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="font-medium group-hover:underline">
                              {truncateText(log.article.title || `Article #${log.article.id}`, 40)}
                            </span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 italic">No article</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <code className="text-sm font-mono text-gray-700 dark:text-gray-300">
                            {log.ip_address || 'N/A'}
                          </code>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <time dateTime={log.created_at} className="text-sm">
                            {formatDateTime(log.created_at)}
                          </time>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {logs.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{(pagination.current_page - 1) * pagination.per_page + 1}</span> to{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
              </span>{' '}
              of <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> logs
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => pagination.prev_page_url && Inertia.get(pagination.prev_page_url)}
                disabled={!pagination.prev_page_url}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium ${
                  pagination.prev_page_url
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => Inertia.get(`${window.location.pathname}?page=${pageNumber}${filterAdminId ? `&admin_id=${filterAdminId}` : ''}`)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium ${
                        pageNumber === pagination.current_page
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                {pagination.last_page > 5 && (
                  <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
                )}
              </div>
              
              <button
                onClick={() => pagination.next_page_url && Inertia.get(pagination.next_page_url)}
                disabled={!pagination.next_page_url}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium ${
                  pagination.next_page_url
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}