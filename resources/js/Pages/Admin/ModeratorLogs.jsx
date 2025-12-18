import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

export default function ModeratorLogs() {
  const { logs = [], pagination = {}, moderatorId, moderator = null, adminName } = usePage().props;
  const [darkMode, setDarkMode] = React.useState(window.localStorage.getItem('theme') === 'dark');

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <AdminNavbar adminName={adminName} darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Moderator Logs</h1>
            {moderator && (
              <div className="text-sm text-gray-500 dark:text-gray-300">{moderator.name} — {moderator.email}</div>
            )}
          </div>
          <Link href={route('admin.moderators')} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded">Back</Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Action</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Model</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Article</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Details</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">IP</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">User Agent</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {logs.map(l => (
                <tr key={l.id}>
                  <td className="px-4 py-2 text-sm">{l.action}</td>
                  <td className="px-4 py-2 text-sm">{l.model_type}{l.model_id ? ` #${l.model_id}` : ''}</td>
                  <td className="px-4 py-2 text-sm">
                    {l.article ? (
                      <Link href={route('admin.articles.edit', { id: l.article.id })} className="text-blue-600 hover:underline">{l.article.title || `#${l.article.id}`}</Link>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm">{l.details}</td>
                  <td className="px-4 py-2 text-sm">{l.ip_address}</td>
                  <td className="px-4 py-2 text-sm truncate max-w-xs">{l.user_agent}</td>
                  <td className="px-4 py-2 text-sm">{new Date(l.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            {pagination && pagination.total ? (
              <div className="text-sm text-gray-500">Showing page {pagination.current_page} of {pagination.last_page} ({pagination.total} logs)</div>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {pagination && pagination.prev_page_url ? (
              <Link href={pagination.prev_page_url} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Prev</Link>
            ) : null}
            {pagination && pagination.next_page_url ? (
              <Link href={pagination.next_page_url} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Next</Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
