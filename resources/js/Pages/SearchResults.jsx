import React, { useContext } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ThemeContext } from '../contexts/ThemeContext';

export default function SearchResults() {
    const { props } = usePage();
    const { query, articles = [], relatedArticles, currentLanguage } = props;
    const theme = useContext(ThemeContext);

    // Helper to get first image URL
    const getImageUrl = (item) => {
        if (item && item.images && item.images.length > 0) {
            return `/storage/${item.images[0].path}`;
        }
        return null;
    };

    return (
       <AppLayout 
            darkMode={theme.darkMode}
            currentLanguage={currentLanguage}
        >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
                <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {/* Search Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                            {currentLanguage === 'ur' ? 'تلاش کا نتیجہ' : 'Search Results'}
                        </h1>
                        <div className="flex items-center">
                            <span className="text-gray-600 dark:text-gray-400">
                                {currentLanguage === 'ur' ? 'آپ نے تلاش کیا:' : 'You searched for:'}
                            </span>
                            <span className="ml-2 font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                                {query}
                            </span>
                        </div>
                    </div>

                    {/* Search Results */}
                    <div className="mb-12">
                        {articles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {articles.map((article) => (
                                    <a
                                        key={article.id}
                                        href={`/articles/${article.slug ?? article.id}`}
                                        className="block group"
                                    >
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all overflow-hidden">
                                            <div className="flex-1 p-4">
                                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:underline">
                                                    {article.title}
                                                </h2>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 my-2 line-clamp-2">
                                                    {article.summary && article.summary.length > 140 ? `${article.summary.substring(0, 140)}...` : article.summary}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {new Date(article.updated_at).toLocaleDateString(undefined, {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                            {getImageUrl(article) && (
                                                <img
                                                    src={getImageUrl(article)}
                                                    alt={article.title}
                                                    className="w-full sm:w-36 h-28 object-cover"
                                                />
                                            )}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 shadow-md">
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    {currentLanguage === 'ur' ? 'کوئی نتیجہ نہیں ملا۔' : 'No results found.'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Related Articles */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                            {currentLanguage === 'ur' ? 'متعلقہ مضامین' : 'Related Articles'}
                        </h3>
                        {relatedArticles && relatedArticles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedArticles.map((rel) => (
                                    <div 
                                        key={rel.id} 
                                        className="rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800"
                                    >
                                        {getImageUrl(rel) && (
                                            <img
                                                src={getImageUrl(rel)}
                                                alt={rel.title}
                                                className="w-full h-40 object-cover"
                                            />
                                        )}
                                        <div className="p-6">
                                                <h4 className="text-lg font-semibold mb-2 hover:underline text-gray-900 dark:text-white">
                                                <a href={`/articles/${rel.slug ?? rel.id}`}>{rel.title}</a>
                                            </h4>
                                            <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
                                                {rel.summary && rel.summary.length > 120 ? `${rel.summary.substring(0, 120)}...` : rel.summary}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <a 
                                                    href={`/articles/${rel.slug ?? rel.id}`} 
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    {currentLanguage === 'ur' ? 'پڑھیں' : 'Read more'}
                                                </a>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(rel.updated_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 shadow-sm">
                                {currentLanguage === 'ur' ? 'کوئی متعلقہ مضمون نہیں۔' : 'No related articles found.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}