import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Sun, Moon, Menu, X, ChevronDown, Search, User, LogIn, LogOut, Shield } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';
import { router } from '@inertiajs/react';

export default function Header({ auth }) {
  // Ensure auth is always an object
  auth = auth || {};
  auth.user = auth.user || null;
  
  // State management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Context hooks
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  // Navigation links
  const navLinks = useMemo(() => [
    { path: '/', label: 'Home' },
  { path: '/articles', label: 'All Insights' }, 
    { path: '/category/mystery-fiction', label: 'Fiction' },
    { path: '/category/technology', label: 'Technology' },
    { path: '/category/stories', label: 'Stories' },
    { path: '/category/opinion', label: 'Opinion' },
    { path: '/category/analysis', label: 'Analysis' },
    { path: '/category/miscellaneous', label: 'Miscellaneous' },
  ], []);

  
  // Effect hooks
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  // Handler functions
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const isActiveLink = (url) => {
    const currentPath = window.location.pathname;
    const urlPath = url.split('?')[0]; // Remove query parameters for comparison
    return currentPath === urlPath;
  };

  const handleLogout = () => {
    router.post(route('logout'));
    setUserDropdownOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? darkMode
            ? 'bg-gray-900/95 backdrop-blur-md shadow-xl'
            : 'bg-white/95 backdrop-blur-md shadow-xl'
          : darkMode
            ? 'bg-gray-900 shadow-lg'
            : 'bg-white shadow-lg'
      }`}
    >
      {/* Main Navigation */}
      <nav className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-lg font-bold sm:block">The WriteLine</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.slice(0, 6).map((link) => (
                link.dropdown ? (
                  <div key={link.path} className="relative group">
                    <Link
                      href={link.path}
                      className={`flex items-center px-3 py-2 text-sm rounded-md font-medium ${
                        isActiveLink(link.path)
                          ? 'bg-red-600 text-white shadow-lg'
                          : darkMode
                            ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Link>
                    <div className={`
                      absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50
                      ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200
                    `}>
                      {link.dropdown.map((region) => (
                          <Link
                            key={region.path}
                            href={region.path}
                          className={`block px-4 py-2 text-sm ${
                            darkMode
                              ? 'text-gray-300 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {region.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                      <Link
                        key={link.path}
                        href={link.path}
                    className={`px-3 py-2 text-sm rounded-md font-medium ${
                      isActiveLink(link.path)
                        ? 'bg-red-600 text-white shadow-lg'
                        : darkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}

              {/* More dropdown */}
              <div className="relative group">
                <button
                  className={`flex items-center px-3 py-2 text-sm rounded-md font-medium ${
                    darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  More
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className={`
                  absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50
                  ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200
                `}>
                      {navLinks.slice(6).map((link) => (
                          <Link
                            key={link.path}
                            href={link.path}
                      className={`block px-4 py-2 text-sm ${
                        darkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Bar */}
              <form
                action="/search"
                method="get"
                className="hidden md:flex items-center mr-2"
                style={{ minWidth: 180 }}
              >
                <input
                  type="text"
                  name="q"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search..."
                  className={`border rounded px-2 py-1 text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}
                  style={{ width: 120 }}
                />
                <button
                  type="submit"
                  className={`ml-2 px-2 py-1 rounded ${darkMode ? 'bg-red-700 text-white' : 'bg-red-600 text-white'}`}
                  title="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Auth Section */}
              {auth.user ? (
                <div className="hidden lg:flex items-center">
                  {auth.user.is_admin ? (
                    // Admin user - show Admin button
                    <Link
                      href="/admin"
                      className={`flex items-center p-2 rounded-lg transition-colors ${
                        darkMode
                          ? 'hover:bg-gray-800 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Shield className="h-5 w-5" />
                      <span className="ml-1 hidden sm:inline">Admin</span>
                    </Link>
                  ) : (
                    // Regular user - show dropdown
                    <div className="relative user-dropdown">
                      <button
                        onClick={toggleUserDropdown}
                        className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
                          darkMode
                            ? 'hover:bg-gray-800 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <User className="h-5 w-5" />
                        <span className="hidden sm:inline">Account</span>
                        <ChevronDown className={`h-4 w-4 ${userDropdownOpen ? 'transform rotate-180' : ''}`} />
                      </button>
                      {userDropdownOpen && (
                        <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                        }`}>
                          <div className={`px-4 py-2 text-sm border-b ${
                            darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'
                          }`}>
                            {auth.user.name || 'Welcome'}
                          </div>
                          <Link
                            href={auth.user.role === 'admin' ? route('admin.dashboard') : route('moderator.dashboard')}
                            className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                              darkMode
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <User className="mr-2 h-4 w-4" />
                            {auth.user.role === 'admin' ? 'Admin Dashboard' : 'Profile'}
                          </Link>
                          <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                              darkMode
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={`/login`}
                  className={`flex items-center p-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'hover:bg-gray-800 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <LogIn className="h-5 w-5" />
                  <span className="ml-1 hidden sm:inline">Login</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`lg:hidden fixed inset-0 z-50 mobile-menu-container ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
              {/* Mobile Menu Header */}
              <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <Link href="/" className="flex items-center space-x-2 group" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">W</span>
                  </div>
                  <span className="text-lg font-bold">The WriteLine</span>
                </Link>
                <button
                  onClick={toggleMobileMenu}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Scrollable Mobile Menu Content */}
              <div className="mobile-menu-content">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {/* Mobile Navigation Links */}
                  {navLinks.map((link) => (
                    link.dropdown ? (
                      <div key={link.path} className="space-y-1">
                        <div className={`px-3 py-2 text-base font-medium ${
                          isActiveLink(link.path)
                            ? 'bg-red-600 text-white'
                            : darkMode
                              ? 'text-gray-300'
                              : 'text-gray-700'
                        }`}>
                          {link.label}
                        </div>
                        <div className="pl-4 space-y-1">
                          {link.dropdown.map((region) => (
                            <Link
                              key={region.path}
                              href={region.path}
                              className={`block px-3 py-2 text-sm ${
                                darkMode
                                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {region.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={link.path}
                        href={link.path}
                        className={`block px-3 py-2 text-base font-medium ${
                          isActiveLink(link.path)
                            ? 'bg-red-600 text-white'
                            : darkMode
                              ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )
                  ))}

                  {/* Mobile Auth Section */}
                  {auth.user ? (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      {auth.user.is_admin ? (
                        <Link
                          href="/admin"
                          className={`flex items-center px-3 py-2 text-base ${
                            darkMode
                              ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Admin
                        </Link>
                      ) : (
                        <>
                          <div className={`px-3 py-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {auth.user.name || 'Welcome'}
                          </div>
                          <Link
                            href={auth.user.role === 'admin' ? route('admin.dashboard') : route('moderator.dashboard')}
                            className={`flex items-center px-3 py-2 text-base ${
                              darkMode
                                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            {auth.user.role === 'admin' ? 'Admin Dashboard' : 'Profile'}
                          </Link>
                          <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className={`flex items-center w-full px-3 py-2 text-base text-left ${
                              darkMode
                                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                          </Link>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        href={`/login`}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center w-full px-3 py-2 text-base text-left ${
                          darkMode
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}