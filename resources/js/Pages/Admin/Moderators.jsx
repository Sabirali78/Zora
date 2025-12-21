import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

export default function Moderators() {
  const { moderators = [], pagination = {}, adminName } = usePage().props;
  const [darkMode, setDarkMode] = React.useState(
    window.localStorage.getItem('theme') === 'dark'
  );

  function handleVerify(id) {
    if (!confirm('Verify this moderator?')) return;
    router.post(route('admin.moderators.verify', { id }));
  }

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <AdminNavbar adminName={adminName} darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Moderators</h1>
        </div>
        <div className="flex items-center justify-between mb-4">
  <h1 className="text-xl font-bold">Moderators</h1>
  <Link
    href={route('admin.moderators.create')}
    className="px-4 py-2 bg-green-600 text-white rounded"
  >
    Add Moderator
  </Link>
</div>

        <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Verified</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Created</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {moderators.map(mod => (
                <tr key={mod.id}>
                  <td className="px-4 py-2 text-sm">{mod.name}</td>
                  <td className="px-4 py-2 text-sm">{mod.email}</td>
                  <td className="px-4 py-2 text-sm">{mod.email_verified_at ? new Date(mod.email_verified_at).toLocaleString() : 'No'}</td>
                  <td className="px-4 py-2 text-sm">{new Date(mod.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2 text-sm text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link href={route('admin.moderators.logs', { id: mod.id })} className="px-2 py-1 bg-indigo-600 text-white rounded text-sm">View Logs</Link>
                      {!mod.email_verified_at && (
                        <button onClick={() => handleVerify(mod.id)} className="px-2 py-1 bg-green-600 text-white rounded text-sm">Verify</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination simple */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            {pagination && pagination.total ? (
              <div className="text-sm text-gray-500">Showing page {pagination.current_page} of {pagination.last_page} ({pagination.total} moderators)</div>
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
