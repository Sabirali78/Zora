<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    // Helper to limit words
    private function limitWords($text, $limit = 12) {
        if (!$text) return '';
        $words = preg_split('/\s+/', strip_tags($text));
        if (count($words) <= $limit) return implode(' ', $words);
        return implode(' ', array_slice($words, 0, $limit)) . '...';
    }

  private function formatArticle($article, $language, $titleLimit = 12, $summaryLimit = 20)
{
    $title = $language === 'ur' ? ($article->title_urdu ?? $article->title) : $article->title;
    $summary = $language === 'ur' ? ($article->summary_urdu ?? $article->summary) : $article->summary;
    
    // Handle image URL - ensure it's properly formatted
    $imageUrl = null;
    
    if ($article->image_url) {
        // If it's already a full URL, use it
        if (filter_var($article->image_url, FILTER_VALIDATE_URL)) {
            $imageUrl = $article->image_url;
        } 
        // If it starts with storage/, convert to full URL
        else if (str_starts_with($article->image_url, 'storage/')) {
            $imageUrl = asset($article->image_url);
        }
        // If it's just a filename/path, prepend storage path
        else if (!empty($article->image_url)) {
            $imageUrl = asset('storage/' . ltrim($article->image_url, '/'));
        }
    }
    
    // Fallback to first image from images relationship
    if (!$imageUrl && $article->images && $article->images->count() > 0) {
        $firstImage = $article->images->first();
        if ($firstImage->path) {
            // Ensure the path is properly formatted
            $path = str_starts_with($firstImage->path, 'storage/') 
                ? $firstImage->path 
                : 'storage/' . ltrim($firstImage->path, '/');
            $imageUrl = asset($path);
        }
    }
    
    // Format the images array for the frontend
    $formattedImages = [];
    if ($article->images && $article->images->count() > 0) {
        foreach ($article->images as $image) {
            $path = str_starts_with($image->path, 'storage/') 
                ? $image->path 
                : 'storage/' . ltrim($image->path, '/');
            $formattedImages[] = [
                'id' => $image->id,
                'url' => asset($path),
                'path' => $image->path,
                'original_name' => $image->original_name,
            ];
        }
    }
    
    return [
        'id' => $article->id,
        'title' => $this->limitWords($title, $titleLimit),
        'summary' => $this->limitWords($summary, $summaryLimit),
        'content' => $language === 'ur' ? ($article->content_urdu ?? $article->content) : $article->content,
        'category' => $article->category,
        'language' => $article->language,
        'is_featured' => $article->is_featured,
        'author' => $article->author,
        'created_at' => $article->created_at->format('M d, Y'), // Format date
        'images' => $formattedImages,
        'slug' => $article->slug,
        'tags' => $article->tags,
        'image_url' => $imageUrl, // Use the processed image URL
    ];
}

  public function index(Request $request)
{
    // Language handling
    $inputLang = $request->input('language');
    $cookieLang = $request->cookie('language');
    $isValidLang = function($lang) {
        return $lang === 'en' || $lang === 'ur';
    };
    
    if ($isValidLang($inputLang)) {
        $language = $inputLang;
    } elseif ($isValidLang($cookieLang)) {
        $language = $cookieLang;
    } else {
        $language = 'en';
    }
    
    // Set cookie if language is provided in request
    if ($language && $request->has('language') && $isValidLang($language)) {
        cookie()->queue('language', $language, 60 * 24 * 365);
    }

    // Define your six writing categories
    $categories = [
        'News' => $language === 'ur' ? 'خبریں' : 'News',
        'Opinion' => $language === 'ur' ? 'رائے' : 'Opinion', 
        'Analysis' => $language === 'ur' ? 'تجزیہ' : 'Analysis',
        'Mystery / Fiction' => $language === 'ur' ? 'پراسرار / افسانہ' : 'Mystery / Fiction',
        'Stories / Creative' => $language === 'ur' ? 'کہانیاں / تخلیقی' : 'Stories / Creative',
        'Miscellaneous' => $language === 'ur' ? 'متفرق' : 'Miscellaneous'
    ];

    // STRATEGY: Get featured articles first, then exclude them from other sections
    
    // Get hero article (latest featured)
    $heroArticle = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
        ->where('is_featured', true)
        ->where(function($query) use ($language) {
            if ($language === 'ur') {
                $query->where('language', 'ur')->orWhere('language', 'multi');
            } else {
                $query->where('language', 'en')->orWhere('language', 'multi');
            }
        })
        ->orderBy('created_at', 'desc')
        ->first();

    // Get all featured articles for featured sections
    $featuredArticlesQuery = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
        ->where('is_featured', true)
        ->where(function($query) use ($language) {
            if ($language === 'ur') {
                $query->where('language', 'ur')->orWhere('language', 'multi');
            } else {
                $query->where('language', 'en')->orWhere('language', 'multi');
            }
        })
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
            ->where(function($query) use ($language) {
                if ($language === 'ur') {
                    $query->where('language', 'ur')->orWhere('language', 'multi');
                } else {
                    $query->where('language', 'en')->orWhere('language', 'multi');
                }
            })
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get()
            ->map(function($article) use ($language) {
                return $this->formatArticle($article, $language, 12, 20);
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
        ->where(function($query) use ($language) {
            if ($language === 'ur') {
                $query->where('language', 'ur')->orWhere('language', 'multi');
            } else {
                $query->where('language', 'en')->orWhere('language', 'multi');
            }
        })
        ->orderBy('created_at', 'desc')
        ->take(6)
        ->get()
        ->map(function($article) use ($language) {
            return $this->formatArticle($article, $language, 12, 20);
        });

    return Inertia::render('Home', [
        'heroArticle' => $heroArticle ? $this->formatArticle($heroArticle, $language ?? 'en') : null,
        'sideFeaturedArticles' => $sideFeaturedArticles->map(function($article) use ($language) {
            return $this->formatArticle($article, $language, 12, 20);
        }),
        'categoryArticles' => $categoryArticles,
        'featuredListArticles' => $featuredListArticles->map(function($article) use ($language) {
            return $this->formatArticle($article, $language, 12, 20);
        }),
        'latestWritings' => $latestWritings,
        'categories' => $categories,
        'darkMode' => false,
        'currentLanguage' => $language ?? 'en',
    ]);
}

    public function list(Request $request)
    {
        $language = $request->input('language', $request->cookie('language', 'en'));
        
        // Set cookie if language is provided in request
        if ($request->has('language')) {
            cookie()->queue('language', $language, 60 * 24 * 365);
        }
        
        // Get all articles based on language preference
        $articles = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
            ->where(function($query) use ($language) {
                if ($language === 'ur') {
                    $query->where('language', 'ur')->orWhere('language', 'multi');
                } else {
                    $query->where('language', 'en')->orWhere('language', 'multi');
                }
            })
            ->latest()
            ->get();

        return Inertia::render('Articles', [
            'articles' => $articles,
            'darkMode' => false,
            'currentLanguage' => $language,
        ], [
            'currentLanguage' => $language,
        ]);
    }

    public function show(Article $article, Request $request)
    {
        $language = $request->input('language', $request->cookie('language', 'en'));
        
        // Set cookie if language is provided in request
        if ($request->has('language')) {
            cookie()->queue('language', $language, 60 * 24 * 365);
        }
        
        // Load the article with its images (latest first)
        $article->load(['images' => function($q) { $q->orderBy('id', 'desc'); }]);

        return Inertia::render('Article', [
            'article' => $this->formatArticle($article, $language),
            'darkMode' => false,
            'currentLanguage' => $language,
        ], [
            'currentLanguage' => $language,
        ]);
    }

    public function byCategory(Request $request, $category)
    {
        $language = $request->input('language', $request->cookie('language', 'en'));
        
        // Set cookie if language is provided in request
        if ($request->has('language')) {
            cookie()->queue('language', $language, 60 * 24 * 365);
        }
        
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
            ->where(function($query) use ($language) {
                if ($language === 'ur') {
                    $query->where('language', 'ur')->orWhere('language', 'multi');
                } else {
                    $query->where('language', 'en')->orWhere('language', 'multi');
                }
            })
            ->latest()
            ->get();

        // Get category display name
        $categoryNames = [
            'News' => $language === 'ur' ? 'خبریں' : 'News',
            'Opinion' => $language === 'ur' ? 'رائے' : 'Opinion',
            'Analysis' => $language === 'ur' ? 'تجزیہ' : 'Analysis',
            'Mystery / Fiction' => $language === 'ur' ? 'پراسرار / افسانہ' : 'Mystery / Fiction',
            'Stories / Creative' => $language === 'ur' ? 'کہانیاں / تخلیقی' : 'Stories / Creative',
            'Miscellaneous' => $language === 'ur' ? 'متفرق' : 'Miscellaneous'
        ];

        return Inertia::render('Articles', [
            'articles' => $articles,
            'darkMode' => false,
            'currentLanguage' => $language,
            'filter' => 'category',
            'filterValue' => $dbCategory,
            'categoryName' => $categoryNames[$dbCategory] ?? $dbCategory,
        ], [
            'currentLanguage' => $language,
        ]);
    }

    public function search(Request $request)
    {
        $language = $request->input('language', $request->cookie('language', 'en'));
        $query = $request->input('q', '');

        $articles = collect();
        $mainArticle = null;

        if ($query) {
            // Search for articles where query matches slug, title, summary, content, or tags
            $titleField = $language === 'ur' ? 'title_urdu' : 'title';
            $summaryField = $language === 'ur' ? 'summary_urdu' : 'summary';
            $contentField = $language === 'ur' ? 'content_urdu' : 'content';
            
            $articles = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
                ->where(function($q) use ($language) {
                    if ($language === 'ur') {
                        $q->where('language', 'ur')->orWhere('language', 'multi');
                    } else {
                        $q->where('language', 'en')->orWhere('language', 'multi');
                    }
                })
                ->where(function($q) use ($query, $titleField, $summaryField, $contentField) {
                    $q->where('slug', 'LIKE', '%' . $query . '%')
                      ->orWhere($titleField, 'LIKE', '%' . $query . '%')
                      ->orWhere($summaryField, 'LIKE', '%' . $query . '%')
                      ->orWhere($contentField, 'LIKE', '%' . $query . '%')
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
                ->where(function($query) use ($language) {
                    if ($language === 'ur') {
                        $query->where('language', 'ur')->orWhere('language', 'multi');
                    } else {
                        $query->where('language', 'en')->orWhere('language', 'multi');
                    }
                })
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
                ->where(function($query) use ($language) {
                    if ($language === 'ur') {
                        $query->where('language', 'ur')->orWhere('language', 'multi');
                    } else {
                        $query->where('language', 'en')->orWhere('language', 'multi');
                    }
                })
                ->whereNotIn('id', $excludeIds)
                ->orderBy('created_at', 'desc')
                ->take($needed)
                ->get();
                
            $relatedArticles = $relatedArticles->concat($latestFill);
        }

        $relatedArticles = $relatedArticles->map(function($related) use ($language) {
            return $this->formatArticle($related, $language, 12, 20);
        });

        return Inertia::render('SearchResults', [
            'query' => $query,
            'articles' => $articles->map(function($article) use ($language) {
                return $this->formatArticle($article, $language, 12, 20);
            }),
            'relatedArticles' => $relatedArticles,
            'darkMode' => false,
            'currentLanguage' => $language,
        ]);
    }

    // News page for only news articles
    public function newsPage(Request $request)
    {
        $language = $request->input('language', $request->cookie('language', 'en'));
        if ($request->has('language')) {
            cookie()->queue('language', $language, 60 * 24 * 365);
        }

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