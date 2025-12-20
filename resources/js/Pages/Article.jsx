import React from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function ArticleShow() {
    const { article, darkMode, currentLanguage: urlLanguage } = usePage().props;
    const currentLanguage = urlLanguage || 'en';

    // Helper to get image URL
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
    const getArticleContent = (field) => {
        if ((urlLanguage || currentLanguage) === 'ur') {
            return article[`${field}_urdu`] || article[field];
        }
        return article[field];
    };

    const getArticleTitle = () => getArticleContent('title');
    const getArticleContentText = () => getArticleContent('content');

    // Distribute images between paragraphs
    const getContentWithImages = () => {
        const content = getArticleContentText() || '';
        const paragraphs = content.split('\n');
        const images = article.images || [];
        if (images.length === 0) return paragraphs.map((p, i) => <p key={i} className="mb-4">{p}</p>);

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
                            alt={images[imgIdx].original_name || `Image ${imgIdx + 1}`}
                            className="rounded shadow object-cover max-h-72 w-auto max-w-full"
                            onError={e => (e.target.style.display = 'none')}
                        />
                    </div>
                );
                imgIdx++;
            }
        }

        // Append any leftover images
        for (; imgIdx < images.length; imgIdx++) {
            result.push(
                <div key={`img-end-${imgIdx}`} className="w-full flex justify-center my-4">
                    <img
                        src={getImageUrl(images[imgIdx].path)}
                        alt={images[imgIdx].original_name || `Image ${imgIdx + 1}`}
                        className="rounded shadow object-cover max-h-72 w-auto max-w-full"
                        onError={e => (e.target.style.display = 'none')}
                    />
                </div>
            );
        }

        return result;
    };

    const getBackButtonText = () => ((urlLanguage || currentLanguage) === 'ur' ? 'مقالات پر واپس جائیں' : 'Back to Articles');

    return (
        <AppLayout 
            darkMode={darkMode} 
            currentLanguage={currentLanguage}
        >
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                {/* Article Header */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        {getArticleTitle()}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-6">
                        <span>By {article.author}</span>
                        <span>•</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </div>

                    {getArticleImageUrl(article) && (
                        <div className="relative w-full rounded-lg overflow-hidden mb-6">
                            <img
                                src={getArticleImageUrl(article)}
                                alt={getArticleTitle()}
                                className="w-full h-40 sm:h-56 md:h-72 lg:h-96 object-cover rounded-lg shadow"
                                style={{ maxWidth: '100%', objectFit: 'cover' }}
                                onError={e => (e.target.style.display = 'none')}
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
                        href={'/'}
                        className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:outline-none transition ease-in-out duration-150"
                    >
                        {getBackButtonText()}
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
