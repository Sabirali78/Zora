import React, { useState, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
// ...existing code...
import { Filter, Grid, List, Search, MapPin, Tag } from 'lucide-react';


export default function Articles() {
    const { articles, darkMode, currentLanguage: urlLanguage, filter, filterValue } = usePage().props;
    const currentLanguage = urlLanguage || 'en';
    const [viewMode, setViewMode] = useState('grid');

    // Debug logging
    console.log('Articles page props:', { articles, filter, filterValue, urlLanguage });
    console.log('Articles count:', articles?.length);
    
    // Additional debug logging for region filtering
    if (filter === 'region') {
        console.log('Region filtering debug:', {
            filterValue,
            articles: articles?.map(a => ({ id: a.id, title: a.title, region: a.region, language: a.language }))
        });
    }

    // Initialize language context with URL language if different
    useEffect(() => {
        if (urlLanguage && urlLanguage !== currentLanguage) {
            // Update URL with current language if needed
            const url = new URL(window.location);
            url.searchParams.set('language', urlLanguage);
            window.history.replaceState({}, '', url);
        }
    }, [urlLanguage, currentLanguage]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        return `/storage/${imagePath.replace(/^storage\//, '')}`;
    };

    // Helper function to get article content based on language
    const getArticleContent = (article, field) => {
        const displayLanguage = urlLanguage || currentLanguage;
        if (displayLanguage === 'ur') {
            return article[`${field}_urdu`] || article[field];
        }
        return article[field];
    };

    const getArticleTitle = (article) => {
        return getArticleContent(article, 'title');
    };

    const getArticleSummary = (article) => {
        const summary = getArticleContent(article, 'summary');
        const content = getArticleContent(article, 'content');
        return summary || (content ? content.substring(0, 150) + '...' : '');
    };

    // Show all articles (backend already filters them)
    const filteredArticles = articles || [];

    return (
        <AppLayout 
            darkMode={darkMode} 
            currentLanguage={urlLanguage}
            onLanguageSwitch={() => {
                const newLanguage = currentLanguage === 'en' ? 'ur' : 'en';
                router.get('/', { language: newLanguage });
            }}
        >
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {filter === 'category' 
                            ? `${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)} ${urlLanguage === 'ur' ? 'خبریں' : 'Articles'}`
                            : filter === 'type'
                            ? `${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)} ${urlLanguage === 'ur' ? 'خبریں' : 'Articles'}`
                            : filter === 'region'
                            ? `${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)} ${urlLanguage === 'ur' ? 'خبریں' : 'Articles'}`
                            : filter === 'country'
                            ? `${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)} ${urlLanguage === 'ur' ? 'کی خبریں' : 'News'}`
                            : urlLanguage === 'ur' ? 'تمام خبریں' : 'All Articles'
                        }
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {urlLanguage === 'ur' 
                            ? `${filteredArticles.length} خبریں ملیں` 
                            : `${filteredArticles.length} articles found`}
                    </p>
                </div>

                {/* View Mode Toggle */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-100 text-red-600' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <Grid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-red-100 text-red-600' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Articles Grid/List */}
                {filteredArticles.length > 0 ? (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                        {filteredArticles.map(article => (
                            <div key={article.id} className='bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-300 overflow-hidden'>
                                <Link href={`/articles/${article.id}?language=${urlLanguage || currentLanguage}`} className="block">
                                    {article.images?.[0]?.path && (
                                        <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-48' : 'h-32'}`}>
                                            <img
                                                src={getImageUrl(article.images[0].path)}
                                                alt={getArticleTitle(article)}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            {article.type && (
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                                    <Tag className="h-3 w-3 mr-1" />
                                                    {article.type}
                                                </span>
                                            )}
                                            {article.region && (
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {article.region}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className={`text-lg font-semibold mb-2 line-clamp-2`}>
                                            {getArticleTitle(article)}
                                        </h2>
                                        <p className={`text-sm mb-4line-clamp-3`}>
                                            {getArticleSummary(article)}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>{article.author}</span>
                                            <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
                            <Search className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {urlLanguage === 'ur' ? 'کوئی خبر نہیں ملی' : 'No articles found'}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {urlLanguage === 'ur' 
                                ? 'اپنے فلٹرز کو تبدیل کریں یا نئی تلاش کریں' 
                                : 'Try adjusting your filters or search terms'}
                        </p>
                    </div>
                )}

                {/* Related Articles: show articles from other categories (or fallback to some articles) */}
                <div className="mt-12">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{urlLanguage === 'ur' ? 'متعلقہ خبریں' : 'Related Articles'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(() => {
                            const all = filteredArticles || [];
                            // Prefer articles in categories different from current filterValue
                            const related = filterValue ? all.filter(a => a.category !== filterValue) : [];
                            // If none found (or no filter), show a fallback set from `all`
                            const list = (related && related.length > 0) ? related.slice(0, 6) : (all.slice(0, 6));
                            return list.map(article => (
                                <div key={article.id} className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
                                    <Link href={`/articles/${article.id}?language=${urlLanguage || currentLanguage}`} className="block">
                                        {article.images?.[0]?.path && (
                                            <div className={`relative overflow-hidden h-32`}> 
                                                <img
                                                    src={getImageUrl(article.images[0].path)}
                                                    alt={getArticleTitle(article)}
                                                    className="w-full h-full object-cover"
                                                    onError={(e)=>{e.target.style.display='none'}}
                                                />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h4 className="text-sm font-semibold line-clamp-2 text-gray-900 dark:text-white">{getArticleTitle(article)}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{getArticleSummary(article)}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3">
                                                <span>{article.category}</span>
                                                <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 