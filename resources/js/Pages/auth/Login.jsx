import React, { useState, useContext } from 'react';
import { router, useForm } from '@inertiajs/react';
import { ThemeContext } from '../../contexts/ThemeContext';
import AppLayout from '@/layouts/app-layout';

export default function Login() {
  const form = useForm({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const processing = form.processing;
  const { darkMode } = useContext(ThemeContext);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    form.setData(name, type === 'checkbox' ? checked : value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    // debug
    // console.log('Submitting login form', form.data());
    setErrors({});
    form.post('/login', {
      preserveScroll: true,
      preserveState: true,
      onError: (err) => {
        setErrors(err);
      },
      onSuccess: () => {
        // success — backend redirect should apply
      }
    });
  };

  return (
          <AppLayout>
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-md w-full p-8 shadow-lg rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className={`text-2xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Login to Account
        </h1>

        {errors.email && typeof errors.email === 'string' && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.email}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} block mb-1`}>
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.data.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} ${errors.email ? 'border-red-500' : ''}`}
              required
              disabled={processing}
            />
            {errors.email && typeof errors.email === 'object' && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} block mb-1`}>
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.data.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} ${errors.password ? 'border-red-500' : ''}`}
              required
              disabled={processing}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              name="remember"
              type="checkbox"
              checked={form.data.remember}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
              disabled={processing}
            />
            <label className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={processing}
            className={`w-full py-3 text-white rounded-lg font-semibold ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {processing ? 'Logging in...' : 'Login'}
          </button>

          {/* Register link */}
          <div className="text-center mt-4">
            <a 
              href="/register" 
              className={`text-sm ${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}`}
            >
              Don't have an account? Register here
            </a>
          </div>
        </form>
      </div>
    </div>
    </AppLayout>
  );
}