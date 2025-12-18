import React, { useState, useContext } from 'react';
import { router } from '@inertiajs/react';
import { ThemeContext } from '../../contexts/ThemeContext';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState({});
  const { darkMode } = useContext(ThemeContext);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    router.post('/moderator/register', form, {
      preserveScroll: true,
      preserveState: true,
      onError: setErrors
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-md w-full p-8 shadow-lg rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className={`text-2xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Create Moderator Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} block mb-1`}>
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} block mb-1`}>
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} block mb-1`}>
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              required
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} block mb-1`}>
              Confirm Password
            </label>
            <input
              name="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
          >
            Register Moderator
          </button>
        </form>
      </div>
    </div>
  );
}
