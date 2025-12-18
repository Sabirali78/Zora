import React from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
// ...existing code...

export default function ArticleShow() {
    const { article, darkMode, currentLanguage: urlLanguage } = usePage().props;
    const currentLanguage = urlLanguage || 'en';

    // Debug logging
    console.log('Article data:', article);
    console.log('URL Language:', urlLanguage);
    console.log('Context Language:', currentLanguage);
    console.log('Article language field:', article.language);

    // Language is now handled via Inertia props and backend. No need to call switchLanguage.

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        return `/storage/${imagePath.replace(/^storage\//, '')}`;
    };

    // Helper function to get article content based on language
    const getArticleContent = (article, field) => {
        // Use URL language parameter to determine which content to show
        const displayLanguage = urlLanguage || currentLanguage;
        
        if (displayLanguage === 'ur') {
            return article[`${field}_urdu`] || article[field];
        }
        return article[field];
    };

    // Helper function to get article title
    const getArticleTitle = (article) => {
        return getArticleContent(article, 'title');
    };

    // Helper function to get article content
    const getArticleContentText = (article) => {
        return getArticleContent(article, 'content');
    };

    // Helper: distribute images between paragraphs
    const getContentWithImages = () => {
        const content = getArticleContentText(article) || '';
        const paragraphs = content.split('\n');
        const images = article.images ? article.images.slice(1) : [];
        if (images.length === 0) {
            return paragraphs.map((p, i) => <p key={i} className="mb-4">{p}</p>);
        }
        // Distribute images between paragraphs
        const result = [];
        const step = Math.max(1, Math.floor(paragraphs.length / images.length));
        let imgIdx = 0;
        for (let i = 0; i < paragraphs.length; i++) {
            result.push(<p key={`p-${i}`} className="mb-4">{paragraphs[i]}</p>);
            if (imgIdx < images.length && (i + 1) % step === 0) {
                result.push(
                    <div key={`img-${imgIdx}`} className="w-full flex justify-center my-4">
                        <img
                            src={getImageUrl(images[imgIdx].path)}
                            alt={images[imgIdx].original_name || `Image ${imgIdx + 2}`}
                            className="rounded shadow object-cover max-h-40 sm:max-h-56 md:max-h-72 lg:max-h-96 w-auto max-w-full"
                            style={{ maxWidth: '100%', objectFit: 'cover' }}
                            onError={e => (e.target.style.display = 'none')}
                        />
                    </div>
                );
                imgIdx++;
            }
        }
        // If any images left, append them at the end
        for (; imgIdx < images.length; imgIdx++) {
            result.push(
                <div key={`img-end-${imgIdx}`} className="w-full flex justify-center my-4">
                    <img
                        src={getImageUrl(images[imgIdx].path)}
                        alt={images[imgIdx].original_name || `Image ${imgIdx + 2}`}
                        className="rounded shadow object-cover max-h-40 sm:max-h-56 md:max-h-72 lg:max-h-96 w-auto max-w-full"
                        style={{ maxWidth: '100%', objectFit: 'cover' }}
                        onError={e => (e.target.style.display = 'none')}
                    />
                </div>
            );
        }
        return result;
    };

    // Helper function to get back button text
    const getBackButtonText = () => {
        const displayLanguage = urlLanguage || currentLanguage;
        if (displayLanguage === 'ur') return 'مقالات پر واپس جائیں';
        return 'Back to Articles';
    };

    const handleLanguageSwitch = (newLanguage) => {
        switchLanguage(newLanguage);
        
        // Reload the page with new language parameter
        router.get('/', { 
            language: newLanguage 
        }, {
            preserveState: false,
            preserveScroll: false,
            replace: true
        });
    };

    return (
        <AppLayout 
            darkMode={darkMode} 
            currentLanguage={urlLanguage}
            onLanguageSwitch={() => {
                const newLanguage = currentLanguage === 'en' ? 'ur' : 'en';
                handleLanguageSwitch(newLanguage);
            }}
        >
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Article Header */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        {getArticleTitle(article)}
                    </h1>
                    
                    <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-6">
                        <span>By {article.author}</span>
                        <span>•</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                        
                    </div>

                    {article.images?.[0]?.path && (
                        <div className="relative w-full rounded-lg overflow-hidden mb-6">
                            <img
                                src={getImageUrl(article.images[0].path)}
                                alt={getArticleTitle(article)}
                                className="w-full h-40 sm:h-56 md:h-72 lg:h-96 object-cover rounded-lg shadow"
                                style={{ maxWidth: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Article Content */}
                <div className="prose dark:prose-invert max-w-none">
                    {getContentWithImages()}
                </div>

                {/* Back Button */}
                <div className="mt-12">
                    <Link 
                        href={`/?language=${urlLanguage || currentLanguage}`}
                        className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:outline-none transition ease-in-out duration-150"
                    >
                        {getBackButtonText()}
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}