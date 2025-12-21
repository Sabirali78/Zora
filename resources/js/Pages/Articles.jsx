import React, { useState, useMemo } from 'react';
import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Grid, List, Search, Tag, Clock, User, Eye, TrendingUp } from 'lucide-react';

export default function Articles() {
    const { 
        articles = [], 
        darkMode, 
        filter, 
        filterValue,
        category = null 
    } = usePage().props;

    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('newest');

    // Optimized image URL getter
    const getArticleImageUrl = useMemo(() => {
        return (article) => {
            if (!article) return null;
            if (article.image_url) return article.image_url;
            if (article.images?.[0]?.url) return article.images[0].url;
            if (article.images?.[0]?.path) return `/storage/${article.images[0].path.replace(/^storage\//, '')}`;
            return null;
        };
    }, []);

    const getArticleTitle = (article) => article?.title || '';
    const getArticleSummary = (article) => {
        const summary = article?.summary || '';
        const content = article?.content || '';
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

        if (category) {
            if (typeof category === 'object') {
                return category.name || category.title || (category.slug ? titleCase(category.slug) : 'All Articles');
            }
            if (typeof category === 'string') {
                const normalized = category.trim();
                if (normalized === '' || normalized === 'all' || normalized === 'all-articles') {
                    return 'All Articles';
                }
                return titleCase(normalized);
            }
        }

        if (articles && articles.length > 0 && articles[0].category) {
            return articles[0].category;
        }

        return 'All Articles';
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
    // Get page title based on URL path
const getPageTitle = () => {
    const currentPath = window.location.pathname;
    
    // If this is the /articles page
    if (currentPath === '/articles' || currentPath === '/articles/') {
        return 'All Insights';
    }
    
    // If this is a category page
    if (currentPath.startsWith('/category/')) {
        return getCategoryDisplayName();
    }
    
    // Default fallback
    return getCategoryDisplayName();
};

// Get subtitle based on page type
const getPageSubtitle = () => {
    const currentPath = window.location.pathname;
    
    if (currentPath === '/articles' || currentPath === '/articles/') {
        return 'Browse all articles, stories, and insights';
    }
    
    if (currentPath.startsWith('/category/')) {
        const count = articles?.length || 0;
        return count === 1 
            ? `${count} article found in this category` 
            : `${count} articles found in this category`;
    }
    
    return 'Browse articles and insights';
};

    return (
        <AppLayout darkMode={darkMode}>
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
                    Home
                </Link>
            </li>
            <li>
                <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                        {window.location.pathname === '/articles' || window.location.pathname === '/articles/' 
                            ? 'All Insights' 
                            : getCategoryDisplayName()}
                    </span>
                </div>
            </li>
        </ol>
    </nav>

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {getPageTitle()}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
                {getPageSubtitle()}
            </p>
        </div>
    </div>
</div>

                    {/* Featured Articles Banner */}
                    {featuredArticles.length > 0 && viewMode === 'grid' && (
                        <div className="mb-8">

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
                                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>
                                    <option value="featured">Featured</option>
                                    <option value="popular">Popular</option>
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
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <EmptyState darkMode={darkMode} />
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
    calculateReadTime
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
                                Featured
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
                        <span>{calculateReadTime(getArticleSummary(article))} min read</span>
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
                            <span className="text-sm font-medium">{article.author || 'Anonymous'}</span>
                        </div>
                        {article.views > 0 && (
                            <div className="flex items-center text-sm text-gray-500">
                                <Eye className="h-4 w-4 mr-1" />
                                {article.views} views
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
    calculateReadTime
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
                            <span>{calculateReadTime(getArticleSummary(article))} min read</span>
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
                                <span>{article.author || 'Anonymous'}</span>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400">
                                {new Date(article.created_at).toLocaleDateString('en-US', {
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
                                Featured
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
                            {calculateReadTime(getArticleSummary(article))} min read
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
                                    {(article.author || 'Anonymous').charAt(0)}
                                </span>
                            </div>
                            <div className="text-sm">
                                    <div className="text-xs text-gray-500">by</div>
                                <div className="font-medium">{article.author || 'Anonymous'}</div>
                            
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">
                            {new Date(article.created_at).toLocaleDateString('en-US', {
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
const EmptyState = ({ darkMode }) => (
    <div className="text-center py-16">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} mb-6`}>
            <Search className={`h-10 w-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <h3 className={`text-2xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No Articles Found
        </h3>
        <p className={`text-lg mb-6 max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Try adjusting your filters or check back later for new content.
        </p>
        <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
            Back to Home
        </Link>
    </div>
);