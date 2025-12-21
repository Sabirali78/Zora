<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class ArticleController extends Controller
{
    // Helper to limit words
    private function limitWords($text, $limit = 12) {
        if (!$text) return '';
        $words = preg_split('/\s+/', strip_tags($text));
        if (count($words) <= $limit) return implode(' ', $words);
        return implode(' ', array_slice($words, 0, $limit)) . '...';
    }

public function formatArticle($article, $titleLimit = 12, $summaryLimit = 20)
{
    $title = $article->title;
    $summary = $article->summary;

    $imageUrl = null;

    // First priority → local stored images
    if ($article->images && $article->images->count() > 0) {
        $firstImage = $article->images->first();

        if ($firstImage->path) {
            $imageUrl = Storage::url($firstImage->path);
        }
    }

    // Second priority → image_url column
    if (!$imageUrl && $article->image_url) {
        if (filter_var($article->image_url, FILTER_VALIDATE_URL)) {
            $imageUrl = $article->image_url;
        } else {
            $imageUrl = asset($article->image_url);
        }
    }

    // Build images array correctly
    $formattedImages = [];

    if ($article->images && $article->images->count() > 0) {
        foreach ($article->images as $image) {
            $formattedImages[] = [
                'id' => $image->id,
                'url' => Storage::url($image->path),
                'path' => $image->path,
                'original_name' => $image->original_name,
            ];
        }
    }

    return [
        'id' => $article->id,
        'title' => $this->limitWords($title, $titleLimit),
        'summary' => $this->limitWords($summary, $summaryLimit),
        'content' => $article->content,
        'category' => $article->category,
        'is_featured' => $article->is_featured,
        'author' => $article->author,
        'created_at' => $article->created_at->format('M d, Y'),
        'images' => $formattedImages,
        'slug' => $article->slug,
        'tags' => $article->tags,
        'image_url' => $imageUrl,
    ];
}

  public function index(Request $request)
{
    // English-only app; default language is 'en'
    $language = 'en';

    // Define your six writing categories (English-only)
    $categories = [
        'News' => 'News',
        'Opinion' => 'Opinion', 
        'Analysis' => 'Analysis',
        'Mystery / Fiction' => 'Mystery / Fiction',
        'Stories / Creative' => 'Stories / Creative',
        'Miscellaneous' => 'Miscellaneous'
    ];

    // STRATEGY: Get featured articles first, then exclude them from other sections
    
    // Get hero article (latest featured)
    $heroArticle = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
        ->where('is_featured', true)
        ->orderBy('created_at', 'desc')
        ->first();

    // Get all featured articles for featured sections
    $featuredArticlesQuery = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
        ->where('is_featured', true)
        ->orderBy('created_at', 'desc');

    $heroArticleId = $heroArticle ? $heroArticle->id : null;
    $allFeaturedArticles = $featuredArticlesQuery->get();
    
    // Get 3 featured articles for side columns (excluding hero)
    $sideFeaturedArticles = $allFeaturedArticles
        ->where('id', '!=', $heroArticleId)
        ->take(3)
        ->values();
    
    // Get 10 featured articles for featured list (excluding hero and side articles)
    $excludeIds = $sideFeaturedArticles->pluck('id')->toArray();
    if ($heroArticleId) {
        $excludeIds[] = $heroArticleId;
    }
    
    $featuredListArticles = $allFeaturedArticles
        ->whereNotIn('id', $excludeIds)
        ->take(10)
        ->values();

    // For category sections, we want to exclude ALL featured articles
    $allFeaturedArticleIds = $allFeaturedArticles->pluck('id')->toArray();

    // Get latest articles by each category (excluding featured articles)
    $categoryArticles = [];
    foreach ($categories as $categoryKey => $categoryName) {
            $articles = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
            ->where('category', $categoryKey)
            ->whereNotIn('id', $allFeaturedArticleIds) // Exclude featured articles
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get()
            ->map(function($article) {
                return $this->formatArticle($article, 12, 20);
            });
        
        if ($articles->count() > 0) {
            $categoryArticles[$categoryKey] = [
                'name' => $categoryName,
                'articles' => $articles
            ];
        }
    }

    // Get 6 latest articles overall for "Latest Writings" section (excluding ALL featured articles)
    $latestWritings = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
        ->whereNotIn('id', $allFeaturedArticleIds) // Exclude featured articles
        ->orderBy('created_at', 'desc')
        ->take(6)
        ->get()
        ->map(function($article) {
            return $this->formatArticle($article, 12, 20);
        });

    return Inertia::render('Home', [
        'heroArticle' => $heroArticle ? $this->formatArticle($heroArticle) : null,
        'sideFeaturedArticles' => $sideFeaturedArticles->map(function($article) use ($language) {
            return $this->formatArticle($article, 12, 20);
        }),
        'categoryArticles' => $categoryArticles,
        'featuredListArticles' => $featuredListArticles->map(function($article) {
            return $this->formatArticle($article, 12, 20);
        }),
        'latestWritings' => $latestWritings,
        'categories' => $categories,
        'darkMode' => false,
        'currentLanguage' => 'en',
    ]);
}

    public function list(Request $request)
    {
        // English-only listing
        $articles = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
            ->latest()
            ->get()
            ->map(function($article) {
                return $this->formatArticle($article, 12, 20);
            });

        return Inertia::render('Articles', [
            'articles' => $articles,
            'darkMode' => false,
            'currentLanguage' => 'en',
        ], [
            'currentLanguage' => 'en',
        ]);
    }

    public function show(Article $article, Request $request)
    {
        // English-only
        $language = 'en';
        
        // Load the article with its images (latest first)
        $article->load(['images' => function($q) { $q->orderBy('id', 'desc'); }]);

        return Inertia::render('Article', [
            'article' => $this->formatArticle($article),
            'darkMode' => false,
            'currentLanguage' => 'en',
        ], [
            'currentLanguage' => 'en',
        ]);
    }

    public function byCategory(Request $request, $category)
    {
        // English-only
        $language = 'en';
        
        // Map URL slugs to database category values
        $categoryMap = [
            'news' => 'News',
            'opinion' => 'Opinion',
            'analysis' => 'Analysis',
            // support both long and short slugs for these categories
            'mystery-fiction' => 'Mystery / Fiction',
            'mystery' => 'Mystery / Fiction',
            'stories-creative' => 'Stories / Creative',
            'stories' => 'Stories / Creative',
            'misc' => 'Miscellaneous'
        ];
        
        $dbCategory = $categoryMap[$category] ?? ucfirst(str_replace('-', ' ', $category));
        
        $articles = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
            ->where('category', $dbCategory)
            ->latest()
            ->get();

        // Category display names (English-only)
        $categoryNames = [
            'News' => 'News',
            'Opinion' => 'Opinion',
            'Analysis' => 'Analysis',
            'Mystery / Fiction' => 'Mystery / Fiction',
            'Stories / Creative' => 'Stories / Creative',
            'Miscellaneous' => 'Miscellaneous'
        ];

        return Inertia::render('Articles', [
            'articles' => $articles,
            'darkMode' => false,
            'currentLanguage' => 'en',
            'filter' => 'category',
            'filterValue' => $dbCategory,
            'categoryName' => $categoryNames[$dbCategory] ?? $dbCategory,
        ], [
            'currentLanguage' => 'en',
        ]);
    }

   public function search(Request $request)
{
    $query = $request->input('q', '');

    $articles = collect();
    $mainArticle = null;

    if ($query) {
        // Search for articles where query matches slug, title, summary, content, or tags
        $articles = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
            ->where(function($q) use ($query) {
                $q->where('slug', 'LIKE', '%' . $query . '%')
                  ->orWhere('title', 'LIKE', '%' . $query . '%')
                  ->orWhere('summary', 'LIKE', '%' . $query . '%')
                  ->orWhere('content', 'LIKE', '%' . $query . '%')
                  ->orWhere('tags', 'LIKE', '%' . $query . '%');
            })
            ->orderBy('created_at', 'desc')
            ->get();
            
        $mainArticle = $articles->first();
    }

    // Related articles: 6 from same category as first search result
    $relatedArticles = collect();
    if ($mainArticle) {
        $relatedArticles = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
            ->where('category', $mainArticle->category)
            ->where('id', '!=', $mainArticle->id)
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();
    }
    
    // If not enough related articles, fill with latest articles
    if ($relatedArticles->count() < 6) {
        $excludeIds = $mainArticle ? [$mainArticle->id] : [];
        $excludeIds = array_merge($excludeIds, $relatedArticles->pluck('id')->toArray());
        
        $needed = 6 - $relatedArticles->count();
        $latestFill = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
            ->whereNotIn('id', $excludeIds)
            ->orderBy('created_at', 'desc')
            ->take($needed)
            ->get();
            
        $relatedArticles = $relatedArticles->concat($latestFill);
    }

    // Format related articles - removed $language parameter
    $relatedArticles = $relatedArticles->map(function($related) {
        return $this->formatArticle($related, 12, 20);
    });

    return Inertia::render('SearchResults', [
        'query' => $query,
        'articles' => $articles->map(function($article) {
            return $this->formatArticle($article, 12, 20);
        }),
        'relatedArticles' => $relatedArticles,
        'darkMode' => false,
        'currentLanguage' => 'en',
    ]);
}

    // News page for only news articles
    public function newsPage(Request $request)
    {
        // English-only
        $language = 'en';
        // Get top stories (6 most recent featured news articles)
        $topStories = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
            ->where('category', 'News')
            ->where('is_featured', true)
            ->where(function($query) use ($language) {
                if ($language === 'ur') {
                    $query->where('language', 'ur')->orWhere('language', 'multi');
                } else {
                    $query->where('language', 'en')->orWhere('language', 'multi');
                }
            })
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get()
            ->map(function($article) use ($language) {
                return $this->formatArticle($article, $language, 15, 25);
            });

        // Get all news articles grouped by tags or show all if no tags
        $allNewsArticles = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
            ->where('category', 'News')
            ->where(function($query) use ($language) {
                if ($language === 'ur') {
                    $query->where('language', 'ur')->orWhere('language', 'multi');
                } else {
                    $query->where('language', 'en')->orWhere('language', 'multi');
                }
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($article) use ($language) {
                return $this->formatArticle($article, $language, 12, 20);
            });

        // Group by tags if available
        $newsByTags = [];
        if ($allNewsArticles->isNotEmpty()) {
            foreach ($allNewsArticles as $article) {
                if ($article['tags']) {
                    $tags = explode(',', $article['tags']);
                    foreach ($tags as $tag) {
                        $tag = trim($tag);
                        if ($tag) {
                            if (!isset($newsByTags[$tag])) {
                                $newsByTags[$tag] = [];
                            }
                            $newsByTags[$tag][] = $article;
                        }
                    }
                }
            }
        }

        return Inertia::render('News', [
            'topStories' => $topStories,
            'allNewsArticles' => $allNewsArticles,
            'newsByTags' => $newsByTags,
            'currentLanguage' => $language,
        ]);
    }

    // Remove deprecated methods
    // public function byType(Request $request, $type) - REMOVED
    // public function byRegion(Request $request, $region) - REMOVED  
    // public function byCountry(Request $request, $country) - REMOVED
    // public function debug(Request $request) - REMOVED
    // public function testRegion(Request $request) - REMOVED

    public function handleNotFound()
    {
        return redirect('/');
    }
}