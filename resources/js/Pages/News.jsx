import React, { useContext, useMemo } from 'react';
import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ThemeContext } from '../contexts/ThemeContext';

const TYPE_LABELS = {
    standard: 'Standard',
    breaking: 'Breaking',
    exclusive: 'Exclusive',
    investigation: 'Investigation',
    analysis: 'Analysis',
    feature: 'Feature',
    interview: 'Interview',
    opinion: 'Opinion',
    editorial: 'Editorial',
    factCheck: 'Fact Check',
    live: 'Live',
    obituary: 'Obituary',
    review: 'Review',
    news: 'News',
};

export default function News() {
    const { newsSections = {}, currentLanguage: lang } = usePage().props;
    const currentLanguage = lang || 'en';
    const { darkMode } = useContext(ThemeContext);

    // Flatten all articles for hero/top story selection
    const allArticles = useMemo(() => {
        return Object.values(newsSections).flat();
    }, [newsSections]);

    // Get top story article (is_top_story === true)
    const topStories = allArticles.filter(a => a.is_top_story);
    const latestTopStory = topStories.length > 0 ? [...topStories].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] : null;

    // Helper to get image url
    const getImageUrl = (article) => {
        if (article.images && article.images.length > 0) {
            return `/storage/${article.images[0].path.replace(/^storage\//, '')}`;
        }
        return null;
    };

    // Helper to get title/content based on language
    const getArticleContent = (article, field) => {
        if (currentLanguage === 'ur') {
            return article[`${field}_urdu`] || article[field];
        }
        return article[field];
    };

    return (
        <AppLayout darkMode={darkMode} currentLanguage={currentLanguage}>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
                {/* Hero Top Stories Section */}
{topStories && topStories.length > 0 && (
    <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Top Stories</h2>
        <div className="flex flex-col md:flex-row gap-6">
            {/* Main featured top story (left side) */}
            <div className="md:w-1/2">
                <Link 
                    href={`/articles/${topStories[0].id}?language=${currentLanguage}`} 
                    className="block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden h-full"
                >
                    {getImageUrl(topStories[0]) && (
                        <img
                            src={getImageUrl(topStories[0])}
                            alt={getArticleContent(topStories[0], 'title')}
                            className="w-full h-64 object-cover"
                        />
                    )}
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">
                            {getArticleContent(topStories[0], 'title')}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">
                            {getArticleContent(topStories[0], 'summary') || getArticleContent(topStories[0], 'content')?.substring(0, 120) + '...'}
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {topStories[0].author} &middot; {new Date(topStories[0].created_at).toLocaleDateString()}
                        </div>
                    </div>
                </Link>
            </div>

            {/* 5 smaller top stories (right side) */}
            <div className="md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {topStories.slice(1, 6).map((story, index) => (
                    <Link 
                        key={story.id}
                        href={`/articles/${story.id}?language=${currentLanguage}`} 
                        className="block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                    >
                        {getImageUrl(story) && (
                            <img
                                src={getImageUrl(story)}
                                alt={getArticleContent(story, 'title')}
                                className="w-full h-32 object-cover"
                            />
                        )}
                        <div className="p-4">
                            <h3 className="text-sm font-bold mb-1 text-gray-900 dark:text-white line-clamp-2">
                                {getArticleContent(story, 'title')}
                            </h3>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(story.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
)}

                {/* News Sections by Type */}
                {Object.entries(newsSections).map(([type, articles]) => (
                    <div key={type} className="mb-12">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                            {TYPE_LABELS[type] || type}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map(article => (
                                <Link key={article.id} href={`/articles/${article.id}?language=${currentLanguage}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-300 overflow-hidden">
                                    {getImageUrl(article) && (
                                        <img
                                            src={getImageUrl(article)}
                                            alt={getArticleContent(article, 'title')}
                                            className="w-full h-40 object-cover"
                                        />
                                    )}
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
                                            {getArticleContent(article, 'title')}
                                        </h3>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">
                                            {getArticleContent(article, 'summary') || getArticleContent(article, 'content')?.substring(0, 120) + '...'}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>{article.author}</span>
                                            <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
