import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';
import { useContext, useRef, useEffect, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export default function Home() {
    const {
        heroArticle,
        categoryArticles,
        currentLanguage: lang,
        featuredArticles,
        featuredListArticles,
        latestWritings,
        categories
    } = usePage().props;
    const currentLanguage = lang || 'en';

    const { darkMode } = useContext(ThemeContext);
    
    // Add loading state to prevent flickering
    const [isLoading, setIsLoading] = useState(true);
    const [heroData, setHeroData] = useState(null);
    const [featuredData, setFeaturedData] = useState([]);
    const [featuredListData, setFeaturedListData] = useState([]);
    const [categoryData, setCategoryData] = useState({});

    useEffect(() => {
      // Set loading to false and hydrate local state from props
      setIsLoading(false);

      // Ensure heroArticle is properly set
      if (heroArticle && Object.keys(heroArticle).length > 0) {
        setHeroData(heroArticle);
      }

      // Ensure featuredArticles is properly set
      if (featuredArticles && Array.isArray(featuredArticles)) {
        setFeaturedData(featuredArticles);
      }

      // Ensure featuredListArticles is properly set
      if (featuredListArticles && Array.isArray(featuredListArticles)) {
        setFeaturedListData(featuredListArticles);
      }

      // Ensure categoryArticles is properly set
      if (categoryArticles && typeof categoryArticles === 'object') {
        setCategoryData(categoryArticles);
      }
    }, [heroArticle, featuredArticles, featuredListArticles, categoryArticles]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) {
            return null;
        }
        const url = `/storage/${imagePath.replace(/^storage\//, '')}`;
        return url;
    };

    const getArticleImageUrl = (article) => {
      if (!article) return null;
      // Prefer image_url (new single-image field) if provided by the backend
      if (article.image_url) return article.image_url;
      // Fallback to images relation (array with path)
      if (article.images && article.images.length > 0 && article.images[0].path) {
        return getImageUrl(article.images[0].path);
      }
      return null;
    };

    const getArticleContent = (article, field) => {
        if (!article) return '';
        
        // Check if article has the field
        if (currentLanguage === 'ur') {
            return article[`${field}_urdu`] || article[field] || '';
        }
        return article[field] || '';
    };

    const getArticleTitle = (article) => {
        return getArticleContent(article, 'title');
    };

    const getArticleSummary = (article) => {
        if (!article) return '';
        
        const summary = getArticleContent(article, 'summary');
        const content = getArticleContent(article, 'content');
        return summary || (content ? content.substring(0, 120) + '...' : '');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return currentLanguage === 'ur' ? 'آج' : 'Today';
        } else if (diffDays === 2) {
            return currentLanguage === 'ur' ? 'کل' : 'Yesterday';
        } else if (diffDays <= 7) {
            return currentLanguage === 'ur' ? `${diffDays} دن پہلے` : `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString(currentLanguage === 'ur' ? 'ur-PK' : 'en-US');
        }
    };

    // Get category URL slug
    const getCategorySlug = (categoryKey) => {
        const slugMap = {
            'News': 'news',
            'Opinion': 'opinion', 
            'Analysis': 'analysis',
            'Mystery / Fiction': 'mystery-fiction',
            'Stories / Creative': 'stories-creative',
            'Miscellaneous': 'misc'
        };
        return slugMap[categoryKey] || categoryKey.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <AppLayout currentLanguage={currentLanguage}>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    {/* Language Indicator */}
                    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/90">
                        <div className="mx-auto px-2 py-1 sm:px-4 sm:py-2 lg:px-8">
                            <div className="flex items-center justify-between">
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400 sm:px-3 sm:py-1 sm:text-sm">
                                    {currentLanguage === 'en' ? 'English' : currentLanguage === 'ur' ? 'اردو' : 'Multi-Language'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Hero Section Skeleton */}
                    <div className="px-2 py-4 sm:flex sm:items-stretch sm:justify-center sm:gap-4 sm:py-6 md:px-0">
                        <div className="w-full mb-4 sm:mb-0 sm:w-3/5 sm:min-w-[320px] sm:max-w-[600px]">
                            <div className="animate-pulse">
                                <div className="h-48 sm:h-64 md:h-80 rounded-xl bg-gray-300 dark:bg-gray-700"></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 sm:w-1/5 sm:min-w-[140px] sm:max-w-[180px]">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-24 rounded-lg bg-gray-300 dark:bg-gray-700"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout currentLanguage={currentLanguage}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                {/* Language Indicator - Mobile Optimized */}
                <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/90">
                    <div className="mx-auto px-2 py-1 sm:px-4 sm:py-2 lg:px-8">
                        <div className="flex items-center justify-between">
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400 sm:px-3 sm:py-1 sm:text-sm">
                                {currentLanguage === 'en' ? 'English' : currentLanguage === 'ur' ? 'اردو' : 'Multi-Language'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
              {/* Hero Section - Only render if we have valid heroData */}
                {heroData && heroData.id && (
                  <div className="px-2 py-4 sm:flex sm:items-stretch sm:justify-center sm:gap-4 sm:py-6 md:px-0">
                    {/* Main Hero Article */}
                    <div className="w-full mb-4 sm:mb-0 sm:w-3/5 sm:min-w-[320px] sm:max-w-[600px]">
                      <div className="group relative">
                        <Link
                          href={`/articles/${heroData.id}?language=${currentLanguage}`}
                          className="group-hover:shadow-3xl relative block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 sm:rounded-2xl sm:shadow-2xl"
                        >
                          <div className="relative overflow-hidden min-h-48 sm:min-h-64 md:min-h-80">
                            {getArticleImageUrl(heroData) ? (
                              <img
                                src={getArticleImageUrl(heroData)}
                                alt={getArticleTitle(heroData)}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                style={{ left: 0, top: 0 }}
                                onError={(e) => {
                                  // hide broken image but keep container height so layout doesn't collapse
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-4">
                                <h1 className={`mb-2 text-lg font-bold leading-snug sm:text-xl ${darkMode ? 'text-white' : 'text-gray-900'} md:text-2xl`}>
                                  {getArticleTitle(heroData)}
                                </h1>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          </div>
                          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                            <h1 className="mb-1 line-clamp-2 text-lg font-bold leading-snug text-white transition-colors group-hover:text-gray-100 sm:mb-2 sm:text-xl md:text-2xl">
                              {getArticleTitle(heroData)}
                            </h1>
                            <p className="mb-1 line-clamp-2 text-xs leading-relaxed text-gray-200 sm:mb-2 sm:text-sm md:text-base">
                              {getArticleSummary(heroData)}
                            </p>
                            <div className="flex items-center text-xs text-gray-300 sm:text-sm md:text-base">
                              <span className="font-medium">{heroData.author || 'Unknown'}</span>
                              <span className="mx-1 sm:mx-2">•</span>
                              <span>{formatDate(heroData.created_at)}</span>
                              <span className="mx-1 sm:mx-2">•</span>
                              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-200">
                                {heroData.category || 'Uncategorized'}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Featured Articles */}
                    <div className="flex flex-col gap-3 sm:w-1/5 sm:min-w-[140px] sm:max-w-[180px]">
                      {/* Mobile: Show all 4 featured articles in 2x2 grid */}
                      <div className="grid grid-cols-2 gap-3 sm:hidden">
                        {featuredData.slice(0, 4).map((article) => (
                          <Link
                            key={article.id}
                            href={`/articles/${article.id}?language=${currentLanguage}`}
                            className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition-all duration-300 hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800"
                          >
                            <div className="relative h-24 w-full overflow-hidden sm:h-28 md:h-36">
                              {getArticleImageUrl(article) ? (
                                <img
                                  src={getArticleImageUrl(article)}
                                  alt={getArticleTitle(article)}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                                  <svg
                                    className="h-5 w-5 text-gray-400 dark:text-gray-500 sm:h-7 sm:w-7"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="p-2">
                              <h3 className="mb-1 line-clamp-2 text-xs font-bold text-gray-900 transition-colors group-hover:text-blue-600 sm:text-sm md:text-base dark:text-white dark:group-hover:text-blue-400">
                                {getArticleTitle(article)}
                              </h3>
                              <div className="flex items-center text-[10px] text-gray-500 sm:text-xs md:text-sm dark:text-gray-400">
                                <span className="text-xs">{article.category || 'Uncategorized'}</span>
                              </div>
                              <div className="flex items-center text-[10px] text-gray-500 sm:text-xs md:text-sm dark:text-gray-400">
                                <span>{formatDate(article.created_at)}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Desktop: Show left column */}
                      <div className="hidden sm:flex sm:flex-col sm:gap-3">
                        {featuredData.slice(0, 2).map((article) => (
                          <Link
                            key={article.id}
                            href={`/articles/${article.id}?language=${currentLanguage}`}
                            className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition-all duration-300 hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800"
                          >
                            <div className="relative h-24 w-full overflow-hidden sm:h-28 md:h-36">
                              {getArticleImageUrl(article) ? (
                                <img
                                  src={getArticleImageUrl(article)}
                                  alt={getArticleTitle(article)}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                                  <svg
                                    className="h-5 w-5 text-gray-400 dark:text-gray-500 sm:h-7 sm:w-7"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="p-2">
                              <h3 className="mb-1 line-clamp-2 text-xs font-bold text-gray-900 transition-colors group-hover:text-blue-600 sm:text-sm md:text-base dark:text-white dark:group-hover:text-blue-400">
                                {getArticleTitle(article)}
                              </h3>
                              <div className="flex items-center text-[10px] text-gray-500 sm:text-xs md:text-sm dark:text-gray-400">
                                <span className="text-xs">{article.category || 'Uncategorized'}</span>
                              </div>
                              <div className="flex items-center text-[10px] text-gray-500 sm:text-xs md:text-sm dark:text-gray-400">
                                <span>{formatDate(article.created_at)}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Desktop: Right column */}
                    <div className="hidden sm:flex sm:w-1/5 sm:min-w-[140px] sm:max-w-[180px] sm:flex-col sm:gap-3">
                      {featuredData.slice(2, 4).map((article) => (
                        <Link
                          key={article.id}
                          href={`/articles/${article.id}?language=${currentLanguage}`}
                          className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition-all duration-300 hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800"
                        >
                          <div className="relative h-24 w-full overflow-hidden sm:h-28 md:h-36">
                            {getArticleImageUrl(article) ? (
                              <img
                                src={getArticleImageUrl(article)}
                                alt={getArticleTitle(article)}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                                <svg
                                  className="h-5 w-5 text-gray-400 dark:text-gray-500 sm:h-7 sm:w-7"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <h3 className="mb-1 line-clamp-2 text-xs font-bold text-gray-900 transition-colors group-hover:text-blue-600 sm:text-sm md:text-base dark:text-white dark:group-hover:text-blue-400">
                              {getArticleTitle(article)}
                            </h3>
                            <div className="flex items-center text-[10px] text-gray-500 sm:text-xs md:text-sm dark:text-gray-400">
                              <span className="text-xs">{article.category || 'Uncategorized'}</span>
                            </div>
                            <div className="flex items-center text-[10px] text-gray-500 sm:text-xs md:text-sm dark:text-gray-400">
                              <span>{formatDate(article.created_at)}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Featured Articles List Section */}
                <div className="mx-4 mb-8 mt-12 sm:mx-6 sm:mb-12 sm:mt-20 lg:mx-8 xl:mx-8">
                    <div className="mb-6 sm:mb-8">
                        <h2 className="mb-3 text-xl font-bold dark:text-white sm:text-2xl text-left">
                            {currentLanguage === 'ur' ? 'فیچرڈ مضامین' : 'Featured Articles'}
                        </h2>
                        <div className="space-y-3 sm:space-y-4 w-full">
                            {(featuredListArticles || []).map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/articles/${article.id}?language=${currentLanguage}`}
                                    className="block w-full"
                                >
                                    <div className="flex items-start rounded-lg bg-white p-3 shadow transition-all hover:shadow-md dark:bg-gray-800 sm:p-4 w-full">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="line-clamp-2 text-sm font-medium text-gray-900 hover:underline sm:text-lg dark:text-white text-left">
                                                {getArticleTitle(article)}
                                            </h3>
                                            <div className="mt-1 flex items-center space-x-2">
                                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    {article.category}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(article.created_at)}
                                                </span>
                                            </div>
                                            {article.summary && (
                                                <p className="mt-2 line-clamp-2 text-xs text-gray-600 dark:text-gray-300 sm:line-clamp-3 sm:text-sm text-left">
                                                    {article.summary}
                                                </p>
                                            )}
                                        </div>
                                        {getArticleImageUrl(article) && (
                                          <div className="ml-3 h-16 w-16 flex-shrink-0 sm:ml-4 sm:h-20 sm:w-20">
                                            <img
                                              src={getArticleImageUrl(article)}
                                              alt={getArticleTitle(article)}
                                              className="h-full w-full rounded object-cover"
                                            />
                                          </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Latest Writings Section */}
                {latestWritings && latestWritings.length > 0 && (
                    <div className="mx-4 mb-8 sm:mx-6 lg:mx-8">
                        <h2 className="mb-3 text-xl font-bold dark:text-white sm:text-2xl text-left">
                            {currentLanguage === 'ur' ? 'تازہ ترین تحریریں' : 'Latest Writings'}
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {latestWritings.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/articles/${article.id}?language=${currentLanguage}`}
                                    className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <div className="p-4">
                                        <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                            {getArticleTitle(article)}
                                        </h3>
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                {article.category}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(article.created_at)}
                                            </span>
                                        </div>
                                        {article.summary && (
                                            <p className="line-clamp-3 text-xs text-gray-600 dark:text-gray-300">
                                                {article.summary}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Category Sections */}
                <div className="px-3 pb-8 sm:px-4 sm:pb-12 lg:px-8">
                    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8 md:space-y-12">
                        {Object.keys(categoryArticles || {}).map((categoryKey, categoryIndex) => {
                            const category = categoryArticles[categoryKey];
                            if (!category || !category.articles || category.articles.length === 0) return null;

                            return (
                                <div key={categoryKey} className="relative">
                                    {/* Section Header */}
                                    <div className="mb-3 flex items-center justify-between sm:mb-4 md:mb-8">
                                        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                                            <div className="h-4 w-0.5 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 sm:h-6 md:h-8"></div>
                                            <h2 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-3xl dark:text-white">
                                                {category.name}
                                            </h2>
                                        </div>
                                        <Link
                                            href={`/category/${getCategorySlug(categoryKey)}?language=${currentLanguage}`}
                                            className="group flex items-center space-x-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 sm:space-x-2 sm:text-sm md:text-base dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            <span>{currentLanguage === 'ur' ? 'مزید' : 'More'}</span>
                                            <svg
                                                className="h-2.5 w-2.5 transition-transform group-hover:translate-x-1 sm:h-3 sm:w-3 md:h-4 md:w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>

                                    {/* Articles Grid */}
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                        {category.articles.map((article, index) => (
                                            <div
                                                key={article.id}
                                                className={`group relative overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-lg md:rounded-xl dark:border-gray-700 dark:bg-gray-800 ${
                                                    index === 0 && category.articles.length > 3 && window.innerWidth >= 640 
                                                        ? 'col-span-2 sm:col-span-2 lg:col-span-2' 
                                                        : ''
                                                }`}
                                            >
                                                <Link href={`/articles/${article.id}?language=${currentLanguage}`}>
                                                    {/* Article Image */}
                                                    <div className="relative overflow-hidden">
                                                        {getArticleImageUrl(article) ? (
                                                          <>
                                                            <img
                                                              src={getArticleImageUrl(article)}
                                                              alt={getArticleTitle(article)}
                                                              className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                                                                index === 0 && category.articles.length > 3 && window.innerWidth >= 640
                                                                  ? 'h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56'
                                                                  : 'h-16 sm:h-24 md:h-32 lg:h-36 xl:h-44'
                                                              }`}
                                                              onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.classList.add(
                                                                  'bg-gradient-to-br',
                                                                  'from-gray-200',
                                                                  'to-gray-300',
                                                                  'dark:from-gray-700',
                                                                  'dark:to-gray-600',
                                                                );
                                                              }}
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"></div>
                                                          </>
                                                        ) : (
                                                            <div
                                                                className={`flex w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 ${
                                                                    index === 0 && category.articles.length > 3 && window.innerWidth >= 640
                                                                        ? 'h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56'
                                                                        : 'h-16 sm:h-24 md:h-32 lg:h-36 xl:h-44'
                                                                }`}
                                                            >
                                                                <svg
                                                                    className="h-5 w-5 text-gray-400 sm:h-6 sm:w-6 md:h-8 md:w-8 dark:text-gray-500"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Article Content */}
                                                    <div className="p-1.5 sm:p-3 md:p-4">
                                                        <h3
                                                            className={`mb-1 line-clamp-2 font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 ${
                                                                index === 0 && category.articles.length > 3 && window.innerWidth >= 640
                                                                    ? 'text-xs sm:text-sm md:text-base lg:text-lg'
                                                                    : 'text-xs sm:text-sm'
                                                            }`}
                                                        >
                                                            {getArticleTitle(article)}
                                                        </h3>
                                                        <div className="mb-1 flex items-center">
                                                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200 sm:text-xs">
                                                                {article.category}
                                                            </span>
                                                        </div>
                                                        <p
                                                            className={`mb-1 line-clamp-2 text-gray-600 dark:text-gray-300 ${
                                                                index === 0 && category.articles.length > 3 && window.innerWidth >= 640
                                                                    ? 'text-[10px] sm:text-xs md:text-sm'
                                                                    : 'hidden text-[10px] sm:block sm:text-xs'
                                                            }`}
                                                        >
                                                            {getArticleSummary(article)}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center text-[10px] text-gray-500 dark:text-gray-400 sm:text-xs">
                                                                <svg className="mr-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                    />
                                                                </svg>
                                                                <span className="hidden sm:inline">{formatDate(article.created_at)}</span>
                                                                <span className="sm:hidden">{formatDate(article.created_at).split(' ')[0]}</span>
                                                            </div>
                                                            <div className="flex items-center text-[10px] text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400 sm:text-xs">
                                                                <span className="mr-0.5 hidden sm:inline">
                                                                    {currentLanguage === 'ur' ? 'پڑھیں' : 'Read'}
                                                                </span>
                                                                <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M9 5l7 7-7 7"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* No Articles Message */}
                {(!categoryArticles || Object.keys(categoryArticles).length === 0) && (
                    <div className="px-4 py-16 text-center sm:py-24">
                        <div className="mx-auto max-w-md">
                            <div className={`mb-4 text-6xl sm:mb-6 sm:text-8xl ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>📝</div>
                            <h2 className={`mb-2 text-xl font-bold sm:text-2xl md:text-3xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {currentLanguage === 'ur' ? 'کوئی تحریر نہیں' : 'No Writings Found'}
                            </h2>
                            <p className={`mb-4 text-base sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {currentLanguage === 'ur' ? 'ابھی تک کوئی تحریر شائع نہیں ہوئی' : 'No writings have been published yet'}
                            </p>
                            <div className="mx-auto h-1 w-16 rounded-full bg-blue-500"></div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}











