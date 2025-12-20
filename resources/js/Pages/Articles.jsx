import React, { useState, useMemo } from 'react';
import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Grid, List, Search, Tag, Clock, User, Eye, TrendingUp } from 'lucide-react';

export default function Articles() {
    const { 
        articles = [], 
        darkMode, 
        currentLanguage: urlLanguage, 
        filter, 
        filterValue,
        category = null 
    } = usePage().props;
    
    const currentLanguage = urlLanguage || 'en';
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('newest');

    // Memoized translations to prevent re-creation on every render
    const translations = useMemo(() => ({
        en: {
            allArticles: 'All Articles',
            articlesFound: 'articles found',
            noArticles: 'No articles found',
            adjustFilters: 'Try adjusting your filters or search terms',
            newest: 'Newest',
            oldest: 'Oldest',
            featured: 'Featured',
            popular: 'Popular',
            readTime: 'min read',
            views: 'views',
            by: 'by',
            category: 'Category',
            trending: 'Trending'
        },
        ur: {
            allArticles: 'تمام خبریں',
            articlesFound: 'خبریں ملیں',
            noArticles: 'کوئی خبر نہیں ملی',
            adjustFilters: 'اپنے فلٹرز کو تبدیل کریں یا نئی تلاش کریں',
            newest: 'تازہ ترین',
            oldest: 'پرانی',
            featured: 'نمایاں',
            popular: 'مقبول',
            readTime: 'منٹ پڑھنے',
            views: 'ملاحظات',
            by: 'از',
            category: 'زمرہ',
            trending: 'رائج الوقت'
        }
    }), []);

    const t = translations[currentLanguage === 'ur' ? 'ur' : 'en'];

    // Optimized image URL getter
    const getArticleImageUrl = useMemo(() => {
        const getImageUrl = (imagePath) => {
            if (!imagePath) return null;
            return `/storage/${imagePath.replace(/^storage\//, '')}`;
        };

        return (article) => {
            if (!article) return null;
            if (article.image_url) return article.image_url;
            if (article.images?.[0]?.path) {
                return getImageUrl(article.images[0].path);
            }
            return null;
        };
    }, []);

    // Optimized content getter
    const getArticleContent = useMemo(() => (article, field) => {
        if (currentLanguage === 'ur') {
            return article[`${field}_urdu`] || article[field];
        }
        return article[field];
    }, [currentLanguage]);

    const getArticleTitle = (article) => getArticleContent(article, 'title');
    const getArticleSummary = (article) => {
        const summary = getArticleContent(article, 'summary');
        const content = getArticleContent(article, 'content');
        return summary || (content ? content.substring(0, 150) + '...' : '');
    };

    // Calculate read time (optimized)
    const calculateReadTime = useMemo(() => (content) => {
        if (!content) return 2;
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }, []);

    // Sort articles based on selected option
    const sortedArticles = useMemo(() => {
        const articlesCopy = [...(articles || [])];
        
        switch (sortBy) {
            case 'newest':
                return articlesCopy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            case 'oldest':
                return articlesCopy.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            case 'featured':
                return articlesCopy.sort((a, b) => (b.is_featured || 0) - (a.is_featured || 0));
            case 'popular':
                // Assuming you have a views field, otherwise fallback to newest
                return articlesCopy.sort((a, b) => (b.views || 0) - (a.views || 0));
            default:
                return articlesCopy;
        }
    }, [articles, sortBy]);

    // Get category display name
     const getCategoryDisplayName = () => {
        const titleCase = (str) =>
            String(str || '')
                .replace(/-/g, ' ')
                .split(' ')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(' ');

        // If backend passed a category object use its name/title
        if (category) {
            if (typeof category === 'object') {
                return category.name || category.title || (category.slug ? titleCase(category.slug) : t.allArticles);
            }
            // If it's a slug/string convert to Title Case (e.g. "news" or "mystery-fiction" -> "Mystery Fiction")
            if (typeof category === 'string') {
                const normalized = category.trim();
                if (normalized === '' || normalized === 'all' || normalized === 'all-articles') {
                    return t.allArticles;
                }
                return titleCase(normalized);
            }
        }

        // Fallback: derive from first article's category if available
        if (articles && articles.length > 0 && articles[0].category) {
            return articles[0].category;
        }

        return t.allArticles;
    };

    // Featured articles (first 3)
    const featuredArticles = useMemo(() => 
        sortedArticles.filter(article => article.is_featured).slice(0, 3), 
        [sortedArticles]
    );

    // Regular articles (non-featured)
    const regularArticles = useMemo(() => 
        sortedArticles.filter(article => !article.is_featured), 
        [sortedArticles]
    );

    return (
        <AppLayout 
            darkMode={darkMode} 
            currentLanguage={currentLanguage}
        >
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {/* Page Header with Breadcrumb */}
                    <div className="mb-8">
                        <nav className="flex mb-4" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                <li className="inline-flex items-center">
                                    <Link 
                                        href="/" 
                                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-red-600 dark:text-gray-400 dark:hover:text-white"
                                    >
                                        {currentLanguage === 'ur' ? 'ہوم' : 'Home'}
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                                            {getCategoryDisplayName()}
                                        </span>
                                    </div>
                                </li>
                            </ol>
                        </nav>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {getCategoryDisplayName()}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {sortedArticles.length} {t.articlesFound}
                                    {category && (
                                        <span className="ml-2 px-3 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                                            {t.category}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Featured Articles Banner */}
                    {featuredArticles.length > 0 && viewMode === 'grid' && (
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <TrendingUp className="h-5 w-5 text-red-600 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {t.trending} {t.featured}
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {featuredArticles.map((article, index) => (
                                    <FeaturedArticleCard 
                                        key={article.id}
                                        article={article}
                                        index={index}
                                        getArticleTitle={getArticleTitle}
                                        getArticleSummary={getArticleSummary}
                                        getArticleImageUrl={getArticleImageUrl}
                                        calculateReadTime={calculateReadTime}
                                        t={t}
                                        currentLanguage={currentLanguage}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Controls Bar */}
                    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        viewMode === 'grid' 
                                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                                    aria-label="Grid view"
                                >
                                    <Grid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        viewMode === 'list' 
                                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                                    aria-label="List view"
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600 dark:text-gray-400">{t.sortBy}:</span>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                >
                                    <option value="newest">{t.newest}</option>
                                    <option value="oldest">{t.oldest}</option>
                                    <option value="featured">{t.featured}</option>
                                    <option value="popular">{t.popular}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Articles Grid/List */}
                    {sortedArticles.length > 0 ? (
                        <>
                            {/* Main Articles Grid */}
                            <div className={viewMode === 'grid' 
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                                : 'space-y-6'
                            }>
                                {(viewMode === 'grid' ? regularArticles : sortedArticles).map((article) => (
                                    <ArticleCard 
                                        key={article.id}
                                        article={article}
                                        viewMode={viewMode}
                                        getArticleTitle={getArticleTitle}
                                        getArticleSummary={getArticleSummary}
                                        getArticleImageUrl={getArticleImageUrl}
                                        calculateReadTime={calculateReadTime}
                                        t={t}
                                        currentLanguage={currentLanguage}
                                    />
                                ))}
                            </div>

                            {/* Load More Button (if paginated) */}
                            {articles?.next_page_url && (
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => router.get(articles.next_page_url)}
                                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                                    >
                                        {currentLanguage === 'ur' ? 'مزید خبریں دیکھیں' : 'Load More Articles'}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <EmptyState 
                            darkMode={darkMode} 
                            currentLanguage={currentLanguage}
                            t={t}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

// Featured Article Card Component
const FeaturedArticleCard = ({ 
    article, 
    index, 
    getArticleTitle, 
    getArticleSummary, 
    getArticleImageUrl, 
    calculateReadTime,
    t,
    currentLanguage 
}) => {
    const imageUrl = getArticleImageUrl(article);
    
    return (
        <div className={`group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 ${
            index === 0 ? 'md:col-span-2' : ''
        }`}>
            <Link href={`/articles/${article.slug ?? article.id}`} className="block">
                {imageUrl && (
                    <div className={`relative overflow-hidden ${index === 0 ? 'h-64' : 'h-48'}`}>
                        <img
                            src={imageUrl}
                            alt={getArticleTitle(article)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => { 
                                e.target.style.display = 'none';
                                e.target.parentElement.classList.add('bg-gradient-to-r', 'from-red-500', 'to-orange-500');
                            }}
                        />
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                                {t.featured}
                            </span>
                        </div>
                    </div>
                )}
                <div className="p-6">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <Tag className="h-3 w-3 mr-1" />
                        <span className="font-medium">{article.category || 'General'}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{calculateReadTime(getArticleSummary(article))} {t.readTime}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-3 line-clamp-2">
                        {getArticleTitle(article)}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {getArticleSummary(article)}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium">{article.author}</span>
                        </div>
                        {article.views > 0 && (
                            <div className="flex items-center text-sm text-gray-500">
                                <Eye className="h-4 w-4 mr-1" />
                                {article.views} {t.views}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

// Regular Article Card Component
const ArticleCard = ({ 
    article, 
    viewMode, 
    getArticleTitle, 
    getArticleSummary, 
    getArticleImageUrl, 
    calculateReadTime,
    t,
    currentLanguage 
}) => {
    const imageUrl = getArticleImageUrl(article);
    
    if (viewMode === 'list') {
        return (
            <div className="group bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <Link href={`/articles/${article.slug ?? article.id}`} className="flex flex-col sm:flex-row">
                    {imageUrl && (
                        <div className="sm:w-48 h-48 sm:h-auto overflow-hidden">
                            <img
                                src={imageUrl}
                                alt={getArticleTitle(article)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                onError={(e) => { 
                                    e.target.style.display = 'none';
                                    e.target.parentElement.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-purple-500');
                                }}
                            />
                        </div>
                    )}
                    <div className="flex-1 p-6">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium">
                                {article.category || 'General'}
                            </span>
                            <span className="mx-2">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{calculateReadTime(getArticleSummary(article))} {t.readTime}</span>
                        </div>
                        <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                            {getArticleTitle(article)}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                            {getArticleSummary(article)}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                <span>{article.author}</span>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400">
                                {new Date(article.created_at).toLocaleDateString(currentLanguage === 'ur' ? 'ur-PK' : 'en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        );
    }

    // Grid View
    return (
        <div className="group bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all duration-300 overflow-hidden hover:-translate-y-1">
            <Link href={`/articles/${article.slug ?? article.id}`} className="block">
                <div className="relative overflow-hidden h-48">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={getArticleTitle(article)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => { 
                                e.target.style.display = 'none';
                                e.target.parentElement.classList.add('bg-gradient-to-r', 'from-gray-300', 'to-gray-400', 'dark:from-gray-700', 'dark:to-gray-600');
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">No Image</span>
                        </div>
                    )}
                    {article.is_featured && (
                        <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                                {t.featured}
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium rounded">
                            {article.category || 'General'}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {calculateReadTime(getArticleSummary(article))} {t.readTime}
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold mb-3 line-clamp-2">
                        {getArticleTitle(article)}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm">
                        {getArticleSummary(article)}
                    </p>
                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {article.author?.charAt(0) || 'A'}
                                </span>
                            </div>
                            <div className="text-sm">
                                <div className="font-medium">{article.author}</div>
                                <div className="text-xs text-gray-500">{t.by}</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">
                            {new Date(article.created_at).toLocaleDateString(currentLanguage === 'ur' ? 'ur-PK' : 'en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

// Empty State Component
const EmptyState = ({ darkMode, currentLanguage, t }) => (
    <div className="text-center py-16">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} mb-6`}>
            <Search className={`h-10 w-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <h3 className={`text-2xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.noArticles}
        </h3>
        <p className={`text-lg mb-6 max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.adjustFilters}
        </p>
        <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
            {currentLanguage === 'ur' ? 'واپس ہوم پر جائیں' : 'Back to Home'}
        </Link>
    </div>
);