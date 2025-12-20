import React, { useState, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Grid, List, Search, Tag } from 'lucide-react';

export default function Articles() {
    const { articles, darkMode, currentLanguage: urlLanguage, filter, filterValue } = usePage().props;
    const currentLanguage = urlLanguage || 'en';
    const [viewMode, setViewMode] = useState('grid');

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        return `/storage/${imagePath.replace(/^storage\//, '')}`;
    };

    const getArticleImageUrl = (article) => {
        if (!article) return null;
        if (article.image_url) return article.image_url;
        if (article.images && article.images.length > 0 && article.images[0].path) {
            return getImageUrl(article.images[0].path);
        }
        return null;
    };

    // Get article content/title based on language
    const getArticleContent = (article, field) => {
        if ((urlLanguage || currentLanguage) === 'ur') {
            return article[`${field}_urdu`] || article[field];
        }
        return article[field];
    };

    const getArticleTitle = (article) => getArticleContent(article, 'title');
    const getArticleSummary = (article) => {
        const summary = getArticleContent(article, 'summary');
        const content = getArticleContent(article, 'content');
        return summary || (content ? content.substring(0, 150) + '...' : '');
    };

    const filteredArticles = articles || [];

    return (
        <AppLayout 
                darkMode={darkMode} 
                currentLanguage={currentLanguage}
            >
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {urlLanguage === 'ur' ? 'تمام خبریں' : 'All Articles'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {urlLanguage === 'ur' ? `${filteredArticles.length} خبریں ملیں` : `${filteredArticles.length} articles found`}
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
                                <Link href={`/articles/${article.slug ?? article.id}`} className="block">
                                    {getArticleImageUrl(article) && (
                                        <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-48' : 'h-32'}`}>
                                            <img
                                                src={getArticleImageUrl(article)}
                                                alt={getArticleTitle(article)}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                                            {getArticleTitle(article)}
                                        </h2>
                                        <p className="text-sm mb-4 line-clamp-3">
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
                            {urlLanguage === 'ur' ? 'اپنے فلٹرز کو تبدیل کریں یا نئی تلاش کریں' : 'Try adjusting your filters or search terms'}
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
