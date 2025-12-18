import React, { useContext } from 'react';
import { useForm } from '@inertiajs/react';
import { ThemeContext } from '../../contexts/ThemeContext';
import AppLayout from '@/layouts/app-layout';

export default function AdminLogin() {

  // Inertia form hook (Fixes auto-unfocus)
  const { data, setData, post, errors } = useForm({
    email: '',
    password: ''
  });

  const { darkMode } = useContext(ThemeContext);

  const handleSubmit = e => {
    e.preventDefault();

    post(window.location.pathname, {
      preserveScroll: true,
      preserveState: true
    });
  };

  return (
      <AppLayout>
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full mx-4 p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">Z</span>
          </div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Login
          </h1>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Access the admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={data.email}
              onChange={e => setData('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="admin@example.com"
              required
            />
            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              name="password"
              type="password"
              value={data.password}
              onChange={e => setData('password', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Enter your password"
              required
            />
            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              darkMode
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Login as Admin
          </button>
        </form>

        <div className={`mt-6 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>This is a secure admin access point</p>
        </div>
      </div>
    </div>
    </AppLayout>

  );  
}
  

