import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminNavbar from '@/components/AdminNavbar';

export default function CreateModerator() {
  const { props } = usePage();
  const { adminName } = props;
  // Safely handle errors
  const errors = props.errors || {};

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '', // Add this for confirmation
  });

  const [darkMode, setDarkMode] = useState(
    typeof window !== 'undefined' ? window.localStorage.getItem('theme') === 'dark' : false
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    router.post(route('admin.moderators.store'), form);
  }

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <AdminNavbar adminName={adminName} darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Create New Moderator</h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              required
            />
            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              required
            />
            {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              required
              minLength="6"
            />
            {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              required
              minLength="6"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Moderator
            </button>
            {/* Fixed route name: admin.moderators instead of admin.moderators.index */}
            <Link 
              href={route('admin.moderators')} 
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}