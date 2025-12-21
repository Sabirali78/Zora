import React, { useState, useEffect } from 'react';
import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar, 
  Share2, 
  Bookmark,
  Eye,
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';

export default function ArticleShow() {
  const { article, darkMode, currentLanguage: urlLanguage, relatedArticles = [] } = usePage().props;
  const currentLanguage = urlLanguage || 'en';
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  // Translations
  const translations = {
    en: {
      by: 'By',
      readTime: 'min read',
      views: 'views',
      share: 'Share',
      copyLink: 'Copy Link',
      linkCopied: 'Link Copied!',
      backToArticles: 'Back to Articles',
      relatedArticles: 'Related Articles',
      publishedOn: 'Published on',
      category: 'Category',
      tags: 'Tags',
      tableOfContents: 'Table of Contents',
      imageGallery: 'Image Gallery'
    },
    ur: {
      by: 'از',
      readTime: 'منٹ پڑھنے',
      views: 'ملاحظات',
      share: 'شیئر کریں',
      copyLink: 'لنک کاپی کریں',
      linkCopied: 'لنک کاپی ہوگیا!',
      backToArticles: 'مقالات پر واپس جائیں',
      relatedArticles: 'متعلقہ مضامین',
      publishedOn: 'شائع کردہ',
      category: 'زمرہ',
      tags: 'ٹیگز',
      tableOfContents: 'فہرست',
      imageGallery: 'تصویر گیلری'
    }
  };

  const t = translations[currentLanguage === 'ur' ? 'ur' : 'en'];

  // Calculate read time
  const calculateReadTime = () => {
    const content = getArticleContent('content') || '';
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  // Get article content
  const getArticleContent = (field) => {
    if (currentLanguage === 'ur') {
      return article[`${field}_urdu`] || article[field];
    }
    return article[field];
  };

  const getArticleTitle = () => getArticleContent('title');
  const getArticleContentText = () => getArticleContent('content');
  const getArticleSummary = () => getArticleContent('summary');

  // Get main image URL
  const getArticleImageUrl = (article) => {
    if (!article) return null;
    if (article.image_url) return article.image_url;
    if (article.images?.[0]?.url) return article.images[0].url;
    if (article.images?.[0]?.path) {
      const filename = article.images[0].path.split('/').pop();
      return `/storage/articles/${filename}`;
    }
    return null;
  };

  // Get additional images (excluding the main/first one)
  const getAdditionalImages = () => {
    if (!article.images || article.images.length <= 1) return [];
    return article.images.slice(1);
  };

  // For individual images
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.url) return image.url;
    if (image.path) {
      const filename = image.path.split('/').pop();
      return `/storage/articles/${filename}`;
    }
    return null;
  };

  // Table of contents generation
  const generateTableOfContents = () => {
    const content = getArticleContentText() || '';
    const headings = content.match(/^#{2,3}\s+(.+)$/gm);
    if (!headings) return [];

    return headings.map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.replace(/^#{2,3}\s+/, ''),
      level: heading.startsWith('## ') ? 2 : 3
    }));
  };

  const tableOfContents = generateTableOfContents();

  // Share functionality
  const shareArticle = (platform) => {
    const url = window.location.href;
    const title = getArticleTitle();
    const text = getArticleSummary() || title;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
        break;
    }
  };

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const contentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const progress = (scrollPosition / contentHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Content with images
  const renderContentWithImages = () => {
    const content = getArticleContentText() || '';
    const additionalImages = getAdditionalImages();
    
    if (!content) return null;

    // Split by paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    const result = [];

    // Insert additional images at strategic points
    let imgIndex = 0;
    
    paragraphs.forEach((paragraph, paraIndex) => {
      // Check if paragraph is a heading
      if (paragraph.startsWith('#') || paragraph.startsWith('##') || paragraph.startsWith('###')) {
        const level = paragraph.match(/^(#+)/)[0].length;
        const text = paragraph.replace(/^#+\s+/, '');
        const id = `heading-${paraIndex}`;
        
        result.push(
          React.createElement(
            `h${level}`,
            { 
              key: `h${paraIndex}`, 
              id,
              className: `font-bold ${level === 2 ? 'text-2xl mt-10 mb-5' : 'text-xl mt-8 mb-4'} scroll-mt-20`
            },
            text
          )
        );
      } else {
        result.push(
          <p key={`p${paraIndex}`} className="mb-6 leading-relaxed text-lg text-gray-700 dark:text-gray-300">
            {paragraph}
          </p>
        );
      }

      // Insert additional image after every 3 paragraphs or headings
      if (imgIndex < additionalImages.length && paraIndex > 0 && (paraIndex + 1) % 3 === 0) {
        const image = additionalImages[imgIndex];
        result.push(
          <div key={`img${imgIndex}`} className="my-8">
            <div className="relative w-full mx-auto rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 p-2">
              <img
                src={getImageUrl(image)}
                alt={image.original_name || image.caption || `Image ${imgIndex + 2}`}
                className="w-full h-auto max-h-[400px] object-contain"
                loading="lazy"
              />
            </div>
            {image.caption && (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-3 italic">
                {image.caption}
              </p>
            )}
          </div>
        );
        imgIndex++;
      }
    });

    // Add remaining images at the end if there are many
    if (imgIndex < additionalImages.length) {
      result.push(
        <div key="remaining-images" className="mt-10">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ImageIcon className="h-5 w-5 mr-2" />
            {t.imageGallery}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalImages.slice(imgIndex).map((image, index) => (
              <div key={`gallery-${index}`} className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden p-2">
                <img
                  src={getImageUrl(image)}
                  alt={image.original_name || image.caption || `Gallery Image ${index + 1}`}
                  className="w-full h-auto max-h-[300px] object-contain"
                  loading="lazy"
                />
                {image.caption && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    {image.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return result;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage === 'ur' ? 'ur-PK' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Main image URL
  const mainImageUrl = getArticleImageUrl(article);
  const hasAdditionalImages = getAdditionalImages().length > 0;

  return (
    <AppLayout darkMode={darkMode} currentLanguage={currentLanguage}>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div 
          className="h-full bg-red-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Article Header */}
        <div className="relative">
          {/* Back Button - Mobile */}
          <div className="lg:hidden fixed top-4 left-4 z-30">
            <Link
              href="/articles"
              className="flex items-center px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">{t.backToArticles}</span>
            </Link>
          </div>

          {/* Article Hero */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-20 pb-8">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link href="/" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    {currentLanguage === 'ur' ? 'ہوم' : 'Home'}
                  </Link>
                </li>
                <li className="mx-2">/</li>
                <li>
                  <Link href="/articles" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    {currentLanguage === 'ur' ? 'مقالات' : 'Articles'}
                  </Link>
                </li>
                <li className="mx-2">/</li>
                <li className="text-gray-900 dark:text-white font-medium truncate max-w-xs">
                  {getArticleTitle()}
                </li>
              </ol>
            </nav>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-medium">
                  {article.category || 'General'}
                </span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{calculateReadTime()} {t.readTime}</span>
              </div>
              {article.views > 0 && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="text-sm">{article.views} {t.views}</span>
                </div>
              )}
            </div>

            {/* Article Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              {getArticleTitle()}
            </h1>

            {/* Author and Date */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {article.author}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(article.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => shareArticle('copy')}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
                  title={t.copyLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => shareArticle('facebook')}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </button>
                <button
                  onClick={() => shareArticle('twitter')}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Share on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </button>
                <button
                  onClick={() => shareArticle('linkedin')}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Bookmark"
                >
                  <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current text-red-600' : ''}`} />
                </button>
              </div>
            </div>

            {/* Featured Image - Medium size, professional look */}
            {mainImageUrl && (
              <div className="mb-8 mt-4">
                <div className="relative w-full mx-auto rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                  <img
                    src={mainImageUrl}
                    alt={getArticleTitle()}
                    className="w-full h-auto max-h-[450px] object-contain"
                    loading="eager"
                  />
                </div>
                {article.images?.[0]?.caption && (
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-3 italic">
                    {article.images[0].caption}
                  </p>
                )}
              </div>
            )}

            {/* Article Summary */}
            {getArticleSummary() && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 mb-8 border-l-4 border-red-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {currentLanguage === 'ur' ? 'خلاصہ' : 'Summary'}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {getArticleSummary()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents - Desktop */}
            {tableOfContents.length > 0 && (
              <div className="hidden lg:block w-56 flex-shrink-0">
                <div className="sticky top-20">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center text-sm">
                      <Tag className="h-4 w-4 mr-2" />
                      {t.tableOfContents}
                    </h4>
                    <nav className="space-y-1.5">
                      {tableOfContents.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block text-xs hover:text-red-600 dark:hover:text-red-400 transition-colors text-gray-600 dark:text-gray-400 ${
                            item.level === 3 ? 'ml-3' : ''
                          }`}
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="flex-1">
              <article className="prose prose-lg dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300">
                {renderContentWithImages()}
              </article>

              {/* Tags */}
              {article.tags && (
                <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {t.tags}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t.relatedArticles}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedArticles.slice(0, 3).map((related) => (
                  <Link
                    key={related.id}
                    href={`/articles/${related.slug || related.id}`}
                    className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    {getArticleImageUrl(related) && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={getArticleImageUrl(related)}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 text-sm">
                        {related.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(related.created_at)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Articles Button */}
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/articles"
              className="inline-flex items-center px-5 py-2.5 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backToArticles}
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}