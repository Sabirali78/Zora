import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';


    
export default function AdminLogs({ logs, pagination, filterAdminId}) {

  const [adminId, setAdminId] = useState(filterAdminId || '');

  const handleFilter = (e) => {
    e.preventDefault();
    Inertia.get(window.location.pathname, { admin_id: adminId });
  };

  const [darkMode, setDarkMode] = React.useState(
      window.localStorage.getItem('theme') === 'dark'
    );
  const { adminName } = usePage().props;

    React.useEffect(() => {
      document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

  return (
    <div>
      <AdminNavbar adminName={adminName} darkMode={darkMode} setDarkMode={setDarkMode} />
      {/* inline nav removed; AdminNavbar used above */}

   
    <div className="p-6 max-w-5xl mx-auto">


      <h1 className="text-2xl font-bold mb-4">Admin Logs</h1>
      <form onSubmit={handleFilter} className="mb-4 flex gap-2 items-center">
        <label htmlFor="adminId">Filter by Admin ID:</label>
        <input
          id="adminId"
          type="text"
          value={adminId}
          onChange={e => setAdminId(e.target.value)}
          className="border px-2 py-1 rounded"
          placeholder="Enter Admin ID"
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Filter</button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
              <tr className="bg-gray-100">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Admin ID</th>
              <th className="border px-2 py-1">Action</th>
              <th className="border px-2 py-1">Model</th>
              <th className="border px-2 py-1">Model ID</th>
              <th className="border px-2 py-1">Details</th>
              <th className="border px-2 py-1">Article</th>
              <th className="border px-2 py-1">IP</th>
              <th className="border px-2 py-1">User Agent</th>
              <th className="border px-2 py-1">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan="9" className="text-center py-4">No logs found.</td></tr>
            ) : logs.map(log => (
              <tr key={log.id}>
                <td className="border px-2 py-1">{log.id}</td>
                <td className="border px-2 py-1">{log.admin_id}</td>
                <td className="border px-2 py-1">{log.action}</td>
                <td className="border px-2 py-1">{log.model_type}</td>
                <td className="border px-2 py-1">{log.model_id}</td>
                <td className="border px-2 py-1">{log.details}</td>
                <td className="border px-2 py-1">
                  {log.article ? (
                    <Link href={route('admin.articles.edit', { id: log.article.id })} className="text-blue-600 hover:underline">{log.article.title || `#${log.article.id}`}</Link>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="border px-2 py-1">{log.ip_address}</td>
                <td className="border px-2 py-1 truncate max-w-xs">{log.user_agent}</td>
                <td className="border px-2 py-1">{log.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex gap-2 justify-center">
        {pagination.prev_page_url && (
          <button onClick={() => Inertia.get(pagination.prev_page_url)} className="px-3 py-1 border rounded">Previous</button>
        )}
        <span>Page {pagination.current_page} of {pagination.last_page}</span>
        {pagination.next_page_url && (
          <button onClick={() => Inertia.get(pagination.next_page_url)} className="px-3 py-1 border rounded">Next</button>
        )}
      </div>
    </div>
     </div>
  );
}

