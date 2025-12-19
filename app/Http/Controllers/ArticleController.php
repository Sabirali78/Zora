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
        return [
            'id' => $article->id,
            'title' => $this->limitWords($title, $titleLimit),
            'summary' => $this->limitWords($summary, $summaryLimit),
            'content' => $language === 'ur' ? ($article->content_urdu ?? $article->content) : $article->content,
            'category' => $article->category,
            'language' => $article->language,
            'is_featured' => $article->is_featured,
            'author' => $article->author,
            'created_at' => $article->created_at,
            'images' => $article->images,
            'slug' => $article->slug,
            'tags' => $article->tags,
            'image_url' => $article->image_url
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

        // Get featured article for hero section (latest featured)
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

        // Define your six writing categories
        $categories = [
            'News' => $language === 'ur' ? 'خبریں' : 'News',
            'Opinion' => $language === 'ur' ? 'رائے' : 'Opinion', 
            'Analysis' => $language === 'ur' ? 'تجزیہ' : 'Analysis',
            'Mystery / Fiction' => $language === 'ur' ? 'پراسرار / افسانہ' : 'Mystery / Fiction',
            'Stories / Creative' => $language === 'ur' ? 'کہانیاں / تخلیقی' : 'Stories / Creative',
            'Miscellaneous' => $language === 'ur' ? 'متفرق' : 'Miscellaneous'
        ];

        // Get 4 latest featured articles (excluding hero article)
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

        if ($heroArticle) {
            $featuredArticlesQuery->where('id', '!=', $heroArticle->id);
        }

        $featuredArticles = $featuredArticlesQuery->take(4)
            ->get()
            ->map(function($article) use ($language) {
                return $this->formatArticle($article, $language, 12, 20);
            });

        // Get 10 latest featured articles for vertical list
        $featuredListArticles = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
            ->where('is_featured', true)
            ->where(function($query) use ($language) {
                if ($language === 'ur') {
                    $query->where('language', 'ur')->orWhere('language', 'multi');
                } else {
                    $query->where('language', 'en')->orWhere('language', 'multi');
                }
            })
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function($article) use ($language) {
                return $this->formatArticle($article, $language, 12, 20);
            });

        // Get latest articles by each category
        $categoryArticles = [];
        foreach ($categories as $categoryKey => $categoryName) {
            $articles = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
                ->where('category', $categoryKey)
                ->where(function($query) use ($language) {
                    if ($language === 'ur') {
                        $query->where('language', 'ur')->orWhere('language', 'multi');
                    } else {
                        $query->where('language', 'en')->orWhere('language', 'multi');
                    }
                })
                ->orderBy('created_at', 'desc')
                ->take(6) // Show 6 latest per category
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

        // Get 6 latest articles overall for "Latest Writings" section
        $latestWritings = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])
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
            'categoryArticles' => $categoryArticles,
            'featuredArticles' => $featuredArticles,
            'featuredListArticles' => $featuredListArticles,
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