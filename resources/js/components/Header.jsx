import React, { useState, useContext, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Sun, Moon, Menu, X, ChevronDown, Search, User, LogIn, LogOut, PenTool, BookOpen, Eye, Zap, Sparkles, Layers } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
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
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Context hooks
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { currentLanguage, switchLanguage, t } = useLanguage();

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

  const handleLogout = () => {
    router.post(route('logout'));
    setUserDropdownOpen(false);
  };

  // Simplified navigation for writing focus - updated to match image
  const navLinks = [
    { path: '/', label: t('home') || 'Home', icon: <Sparkles className="h-4 w-4 mr-1" /> },
    { path: '/category/news', label: t('news') || 'News', icon: <Zap className="h-4 w-4 mr-1" /> },
    { path: '/category/opinion', label: t('opinion') || 'Opinion', icon: <Eye className="h-4 w-4 mr-1" /> },
    { path: '/category/analysis', label: t('analysis') || 'Analysis', icon: <BookOpen className="h-4 w-4 mr-1" /> },
    { path: '/category/mystery', label: t('mystery') || 'Mystery / Fiction', icon: <PenTool className="h-4 w-4 mr-1" /> },
    { path: '/category/stories', label: t('stories') || 'Stories', icon: <BookOpen className="h-4 w-4 mr-1" /> },
    { path: '/category/misc', label: t('extra') || 'Miscellaneous', icon: <Layers className="h-4 w-4 mr-1" /> },
  ];

  const isActiveLink = (url) => {
    const currentPath = window.location.pathname;
    const urlPath = url.split('?')[0];
    return currentPath === urlPath;
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
      <nav className={`${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo - Made smaller to fit more links */}
            <Link href="/" className="flex items-center space-x-2 group shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <div className="flex flex-col">
              </div>
            </Link>

            {/* Desktop Navigation - Fixed alignment */}
            <div className="flex-1 flex justify-center px-4">
              <div className="hidden lg:flex items-center space-x-1 overflow-x-auto max-w-full">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`group flex items-center px-3 py-2 text-sm rounded-md font-medium transition-all whitespace-nowrap ${
                      isActiveLink(link.path)
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : darkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      {link.icon}
                      <span className="font-semibold">{link.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3 shrink-0">
              {/* Search - Made smaller for better fit */}
              <div className="hidden md:flex items-center">
                <form
                  action="/search"
                  method="get"
                  className="flex items-center"
                >
                  <input
                    type="text"
                    name="q"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search writings..."
                    className={`border rounded-l px-3 py-1.5 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-800 text-white border-gray-700' 
                        : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  />
                  <button
                    type="submit"
                    className={`rounded-r px-3 py-1.5 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>
              </div>

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

              {/* Language Switcher (uses LanguageContext) */}
              <div className="relative">
                <button
                  onClick={async () => {
                    const next = (currentLanguage || 'en') === 'en' ? 'ur' : 'en';
                    try {
                      await switchLanguage(next);
                    } catch (e) {}
                    router.get(window.location.pathname, { language: next });
                  }}
                  title="Change language"
                  className={`px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                    darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {(currentLanguage || 'en').toUpperCase()}
                </button>
              </div>

              {/* Auth Section */}
              {auth.user ? (
                <div className="hidden lg:flex items-center">
                  <div className="relative user-dropdown">
                    <button
                      onClick={toggleUserDropdown}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                        darkMode
                          ? 'hover:bg-gray-800 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                        {auth.user.name?.charAt(0) || 'U'}
                      </div>
                      <span className="hidden sm:inline font-medium">{auth.user.name || 'Writer'}</span>
                      <ChevronDown className={`h-4 w-4 ${userDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>
                    {userDropdownOpen && (
                      <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-2 z-50 ${
                        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                      }`}>
                        <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="font-semibold">{auth.user.name || 'Writer'}</div>
                          <div className="text-sm opacity-75">Author & Storyteller</div>
                        </div>
                        <Link
                          href='/dashboard'
                          className={`flex items-center w-full px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                        >
                          <BookOpen className="mr-3 h-4 w-4" />
                          My Writings
                        </Link>
                        <Link
                          href='/create'
                          className={`flex items-center w-full px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                        >
                          <PenTool className="mr-3 h-4 w-4" />
                          New Story
                        </Link>
                        <Link
                          href={route('logout')}
                          method="post"
                          as="button"
                          className={`flex items-center w-full px-4 py-2.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign Out
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Link
                      href={route('admin.login')}
                      className={`flex items-center px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      title="Admin Login"
                    >
                      Admin
                    </Link>

                    <Link
                      href={route('moderator.login.show')}
                      className={`flex items-center px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      title="Moderator Login"
                    >
                      Mod
                    </Link>
                  </div>
                </div>
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
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden fixed inset-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Mobile Menu Header */}
            <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Writer's Den</span>
                  <span className="text-xs opacity-75">Daily Thoughts & Stories</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Mobile language quick toggle */}
                <button
                  onClick={async () => {
                    const next = (currentLanguage || 'en') === 'en' ? 'ur' : 'en';
                    try {
                      await switchLanguage(next);
                    } catch (e) {}
                    router.get(window.location.pathname, { language: next });
                  }}
                  className={`px-2 py-1 rounded-md text-sm font-medium transition-colors ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  {(currentLanguage || 'en').toUpperCase()}
                </button>

                <button
                  onClick={toggleMobileMenu}
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b dark:border-gray-700">
              <form action="/search" method="get" className="flex">
                <input
                  type="text"
                  name="q"
                  placeholder="Search writings..."
                  className={`flex-1 border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-800 text-white border-gray-700' 
                      : 'bg-white text-gray-900 border-gray-300'
                  }`}
                />
                <button
                  type="submit"
                  className={`rounded-r px-4 ${darkMode ? 'bg-blue-700' : 'bg-blue-600'} text-white`}
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <div className="p-2 space-y-1 overflow-y-auto max-h-[70vh]">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-start p-3 rounded-lg transition-colors ${
                    isActiveLink(link.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="mr-3 mt-0.5">
                    {link.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{link.label}</div>
                  </div>
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t dark:border-gray-700">
                {auth.user ? (
                  <>
                    <div className="px-3 py-2">
                      <div className="font-semibold">{auth.user.name || 'Writer'}</div>
                      <div className="text-sm opacity-75">Author & Storyteller</div>
                    </div>
                    <Link
                      href='/dashboard'
                      className={`flex items-center p-3 rounded-lg ${
                        darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BookOpen className="mr-3 h-4 w-4" />
                      My Writings
                    </Link>
                    <Link
                      href='/create'
                      className={`flex items-center p-3 rounded-lg ${
                        darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <PenTool className="mr-3 h-4 w-4" />
                      New Story
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center w-full p-3 text-left rounded-lg ${
                        darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 px-3">
                    <button
                      onClick={() => {
                        router.get('/login');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-center p-3 rounded-lg font-medium ${
                        darkMode
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                      }`}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Start Writing
                    </button>

                    <Link
                      href={route('admin.login')}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full block text-center px-3 py-2 rounded-lg font-medium ${
                        darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Admin Login
                    </Link>

                    <Link
                      href={route('moderator.login.show')}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full block text-center px-3 py-2 rounded-lg font-medium ${
                        darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Moderator Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}