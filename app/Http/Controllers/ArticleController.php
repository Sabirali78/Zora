<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
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

    // Debug logging
    \Log::info('Homepage request', [
        'language' => $language,
        'has_language_param' => $request->has('language'),
        'cookie_language' => $request->cookie('language')
    ]);

    // Get first trending article for hero section with section_priority > 50
    $heroArticle = Article::with('images')
        ->where('is_trending', true)
        ->where('section_priority', '>', 50)
        ->where(function($query) use ($language) {
            if ($language === 'ur') {
                $query->where('language', 'ur')->orWhere('language', 'multi');
            } else {
                $query->where('language', 'en')->orWhere('language', 'multi');
            }
        })
        ->orderBy('created_at', 'desc')
        ->first();

    // Fallback: if none found for current language, get any trending with section_priority > 50 in the same language
    if (!$heroArticle) {
        $heroArticle = Article::with('images')
            ->where('is_trending', true)
            ->where('section_priority', '>', 50)
            ->where('language', $language) // Only fallback to same language
            ->orderBy('created_at', 'desc')
            ->first();
    }

    // Get IDs of all trending articles for exclusion in featured articles
    $trendingArticleIds = Article::where('is_trending', true)
        ->where('section_priority', '>', 50)
        ->where(function($query) use ($language) {
            if ($language === 'ur') {
                $query->where('language', 'ur')->orWhere('language', 'multi');
            } else {
                $query->where('language', 'en')->orWhere('language', 'multi');
            }
        })
        ->pluck('id')
        ->toArray();

    // Define all categories
    $categories = [
        'latest-news' => $language === 'ur' ? 'تازہ ترین خبریں' : 'Latest News',
        'pakistan' => $language === 'ur' ? 'پاکستان' : 'Pakistan',
        'sports' => $language === 'ur' ? 'کھیل' : 'Sports',
        'weather' => $language === 'ur' ? 'موسم' : 'Weather',
        'politics' => $language === 'ur' ? 'سیاست' : 'Politics',
        'technology' => $language === 'ur' ? 'ٹیکنالوجی' : 'Technology',
        'health' => $language === 'ur' ? 'صحت' : 'Health',
        'business' => $language === 'ur' ? 'کاروبار' : 'Business',
        'science' => $language === 'ur' ? 'سائنس' : 'Science',
        'entertainment' => $language === 'ur' ? 'تفریح' : 'Entertainment',
        'environment' => $language === 'ur' ? 'ماحولیات' : 'Environment',
        'education' => $language === 'ur' ? 'تعلیم' : 'Education',
        'lifestyle' => $language === 'ur' ? 'طرز زندگی' : 'Lifestyle',
        'arts-culture' => $language === 'ur' ? 'فن و ثقافت' : 'Arts & Culture',
        'food' => $language === 'ur' ? 'کھانا' : 'Food',
        'travel' => $language === 'ur' ? 'سفر' : 'Travel',
        'fashion' => $language === 'ur' ? 'فیشن' : 'Fashion'
    ];

    // Get 4 latest featured articles (excluding trending articles)
    $featuredArticlesQuery = Article::with('images')
        ->where('is_featured', true)
        ->where(function($query) {
            $query->where('section_priority', '>', 50)
                  ->orWhereNull('section_priority');
        })
        ->where(function($query) use ($language) {
            if ($language === 'ur') {
                $query->where('language', 'ur')->orWhere('language', 'multi');
            } else {
                $query->where('language', 'en')->orWhere('language', 'multi');
            }
        })
        ->orderBy('created_at', 'desc');

    if (!empty($trendingArticleIds)) {
        $featuredArticlesQuery->whereNotIn('id', $trendingArticleIds);
    }

    $featuredArticles = $featuredArticlesQuery->take(4)
        ->get()
        ->map(function($article) use ($language) {
            return $this->formatArticle($article, $language, 12, 20);
        });

    // Get 10 latest featured articles for vertical list
    $featuredListArticles = Article::with('images')
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

    // Get articles by category
    $categoryArticles = [];
    foreach ($categories as $categoryKey => $categoryName) {
        $randomCounts = [4, 5, 6];
        $articleCount = $randomCounts[array_rand($randomCounts)];
        $articles = Article::with('images')
            ->whereRaw('LOWER(category) = ?', [strtolower($categoryKey)])
            ->where(function($query) use ($language) {
                if ($language === 'ur') {
                    $query->where('language', 'ur')->orWhere('language', 'multi');
                } else {
                    $query->where('language', 'en')->orWhere('language', 'multi');
                }
            })
            ->orderBy('created_at', 'desc')
            ->take($articleCount)
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

    return Inertia::render('Home', [
        'heroArticle' => $heroArticle ? $this->formatArticle($heroArticle, $language ?? 'en') : null,
        'categoryArticles' => $categoryArticles,
        'featuredArticles' => $featuredArticles,
        'featuredListArticles' => $featuredListArticles,
        'darkMode' => false,
        'currentLanguage' => $language ?? 'en',
    ]);
}

    public function list(Request $request)
    {
        $language = $request->input('language', $request->cookie('language', 'en'));
        
        // Set cookie if language is provided in request
        if ($request->has('language')) {
            cookie()->queue('language', $language, 60 * 24 * 365); // 1 year
        }
        
        // Get all articles based on language preference
        $articles = Article::with('images')
            ->where(function($query) use ($language) {
                if ($language === 'ur') {
                    $query->where('language', 'ur')
                          ->orWhere('language', 'multi');
                } elseif ($language === 'en') {
                    $query->where('language', 'en')
                          ->orWhere('language', 'multi');
                } else {
                    // Show all articles for any other language preference
                    $query->whereIn('language', ['en', 'ur', 'multi']);
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
            cookie()->queue('language', $language, 60 * 24 * 365); // 1 year
        }
        
        // Load the article with its images
        $article->load('images');

        return Inertia::render('Article', [
            'article' => $article,
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
            cookie()->queue('language', $language, 60 * 24 * 365); // 1 year
        }
        
        // Debug logging
        \Log::info('byCategory called', ['category' => $category, 'language' => $language]);
        
        $articles = Article::with('images')
            ->whereRaw('LOWER(category) = ?', [strtolower($category)])
            ->where(function($query) use ($language) {
                if ($language === 'ur') {
                    $query->where('language', 'ur')
                          ->orWhere('language', 'multi');
                } elseif ($language === 'en') {
                    $query->where('language', 'en')
                          ->orWhere('language', 'multi');
                } else {
                    $query->whereIn('language', ['en', 'ur', 'multi']);
                }
            })
            ->latest()
            ->get();

        // Debug logging
        \Log::info('byCategory results', ['count' => $articles->count(), 'articles' => $articles->pluck('id', 'title')]);

        return Inertia::render('Articles', [
            'articles' => $articles,
            'darkMode' => false,
            'currentLanguage' => $language,
            'filter' => 'category',
            'filterValue' => $category,
        ], [
            'currentLanguage' => $language,
        ]);
    }

    public function byType(Request $request, $type)
    {
        $language = $request->input('language', $request->cookie('language', 'en'));
        
        // Set cookie if language is provided in request
        if ($request->has('language')) {
            cookie()->queue('language', $language, 60 * 24 * 365); // 1 year
        }
        
        $articles = Article::with('images')
            ->whereRaw('LOWER(type) = ?', [strtolower($type)])
            ->where(function($query) use ($language) {
                if ($language === 'ur') {
                    $query->where('language', 'ur')
                          ->orWhere('language', 'multi');
                } elseif ($language === 'en') {
                    $query->where('language', 'en')
                          ->orWhere('language', 'multi');
                } else {
                    $query->whereIn('language', ['en', 'ur', 'multi']);
                }
            })
            ->latest()
            ->get();

        return Inertia::render('Articles', [
            'articles' => $articles,
            'darkMode' => false,
            'currentLanguage' => $language,
            'filter' => 'type',
            'filterValue' => $type,
        ], [
            'currentLanguage' => $language,
        ]);
    }

    public function byRegion(Request $request, $region)
    {
        $language = $request->input('language', 'en');
        
        // Debug logging
        \Log::info('byRegion called', ['region' => $region, 'language' => $language]);
        
        // First, let's see all articles with this region regardless of language
        $allRegionArticles = Article::whereRaw('LOWER(region) = ?', [strtolower($region)])->get();
        \Log::info('All articles with region', ['region' => $region, 'count' => $allRegionArticles->count(), 'articles' => $allRegionArticles->pluck('id', 'title')]);
        
        // Now let's see what languages these articles have
        $languages = $allRegionArticles->pluck('language')->unique();
        \Log::info('Languages in region articles', ['languages' => $languages]);
        
        $articles = Article::with('images')
            ->whereRaw('LOWER(region) = ?', [strtolower($region)])
            ->where(function($query) use ($language) {
                if ($language === 'ur') {
                    $query->where('language', 'ur')
                          ->orWhere('language', 'multi');
                } elseif ($language === 'en') {
                    $query->where('language', 'en')
                          ->orWhere('language', 'multi');
                } else {
                    $query->whereIn('language', ['en', 'ur', 'multi']);
                }
            })
            ->latest()
            ->get();

        // Debug logging
        \Log::info('byRegion results after language filter', [
            'count' => $articles->count(), 
            'articles' => $articles->pluck('id', 'title'),
            'sql' => Article::with('images')
                ->whereRaw('LOWER(region) = ?', [strtolower($region)])
                ->where(function($query) use ($language) {
                    if ($language === 'ur') {
                        $query->where('language', 'ur')
                              ->orWhere('language', 'multi');
                    } elseif ($language === 'en') {
                        $query->where('language', 'en')
                              ->orWhere('language', 'multi');
                    } else {
                        $query->whereIn('language', ['en', 'ur', 'multi']);
                    }
                })
                ->toSql()
        ]);

        return Inertia::render('Articles', [
            'articles' => $articles,
            'darkMode' => false,
            'currentLanguage' => $language,
            'filter' => 'region',
            'filterValue' => $region,
        ]);
    }

    public function byCountry(Request $request, $country)
    {
        $language = $request->input('language', 'en');
        
        // Debug logging
        \Log::info('byCountry called', ['country' => $country, 'language' => $language]);
        
        $articles = Article::with('images')
            ->whereRaw('LOWER(country) = ?', [strtolower($country)])
            ->where(function($query) use ($language) {
                if ($language === 'ur') {
                    $query->where('language', 'ur')
                          ->orWhere('language', 'multi');
                } elseif ($language === 'en') {
                    $query->where('language', 'en')
                          ->orWhere('language', 'multi');
                } else {
                    $query->whereIn('language', ['en', 'ur', 'multi']);
                }
            })
            ->latest()
            ->get();

        // Debug logging
        \Log::info('byCountry results', ['count' => $articles->count(), 'articles' => $articles->pluck('id', 'title')]);

        return Inertia::render('Articles', [
            'articles' => $articles,
            'darkMode' => false,
            'currentLanguage' => $language,
            'filter' => 'country',
            'filterValue' => $country,
        ]);
    }

    // Debug method to check database values
    public function debug(Request $request)
    {
        $categories = Article::distinct()->pluck('category')->filter()->values();
        $types = Article::distinct()->pluck('type')->filter()->values();
        $regions = Article::distinct()->pluck('region')->filter()->values();
        $countries = Article::distinct()->pluck('country')->filter()->values();
        $languages = Article::distinct()->pluck('language')->filter()->values();

        // Get article counts by region
        $regionCounts = Article::selectRaw('region, COUNT(*) as count')
            ->whereNotNull('region')
            ->groupBy('region')
            ->get();

        // Get article counts by category
        $categoryCounts = Article::selectRaw('category, COUNT(*) as count')
            ->whereNotNull('category')
            ->groupBy('category')
            ->get();

        // Get article counts by type
        $typeCounts = Article::selectRaw('type, COUNT(*) as count')
            ->whereNotNull('type')
            ->groupBy('type')
            ->get();

        return response()->json([
            'categories' => $categories,
            'types' => $types,
            'regions' => $regions,
            'countries' => $countries,
            'languages' => $languages,
            'total_articles' => Article::count(),
            'region_counts' => $regionCounts,
            'category_counts' => $categoryCounts,
            'type_counts' => $typeCounts,
            'articles' => Article::select('id', 'title', 'category', 'type', 'region', 'country', 'language')->get()
        ]);
    }

    // Test method for region debugging
    public function testRegion(Request $request)
    {
        $region = 'asia';
        $language = 'en';
        
        // Test 1: All articles with region = 'asia' (case insensitive)
        $allAsiaArticles = Article::whereRaw('LOWER(region) = ?', [strtolower($region)])->get();
        
        // Test 2: Articles with region = 'asia' and language = 'en'
        $asiaEnglishArticles = Article::whereRaw('LOWER(region) = ?', [strtolower($region)])
            ->where('language', 'en')
            ->get();
            
        // Test 3: Articles with region = 'asia' and language = 'en' or 'multi'
        $asiaEnglishOrMultiArticles = Article::whereRaw('LOWER(region) = ?', [strtolower($region)])
            ->where(function($query) use ($language) {
                if ($language === 'en') {
                    $query->where('language', 'en')
                          ->orWhere('language', 'multi');
                }
            })
            ->get();
            
        // Test 4: Raw SQL query
        $rawQuery = Article::whereRaw('LOWER(region) = ?', [strtolower($region)])
            ->where(function($query) use ($language) {
                if ($language === 'en') {
                    $query->where('language', 'en')
                          ->orWhere('language', 'multi');
                }
            })
            ->toSql();
            
        return response()->json([
            'region' => $region,
            'language' => $language,
            'all_asia_articles' => $allAsiaArticles->pluck('id', 'title'),
            'asia_english_articles' => $asiaEnglishArticles->pluck('id', 'title'),
            'asia_english_or_multi_articles' => $asiaEnglishOrMultiArticles->pluck('id', 'title'),
            'raw_sql' => $rawQuery,
            'all_articles_data' => Article::select('id', 'title', 'region', 'language')->get()
        ]);
    }

    // Handle 404 for non-existent routes by redirecting to home
    public function handleNotFound()
    {
        return redirect('/');
    }
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
            'type' => $article->type,
            'region' => $article->region,
            'country' => $article->country,
            'language' => $article->language,
            'is_featured' => $article->is_featured,
            'is_trending' => $article->is_trending,
            'author' => $article->author,
            'created_at' => $article->created_at,
            'images' => $article->images,
            'slug' => $article->slug
        ];
    }

    public function search(Request $request)
    {
        $language = $request->input('language', $request->cookie('language', 'en'));
        $query = $request->input('q', '');

        $articles = collect();
        $mainArticle = null;

        if ($query) {
            // Search for articles where query matches slug, title, summary, content, or tags (partial/word match, case-insensitive)
            $titleField = $language === 'ur' ? 'title_urdu' : 'title';
            $summaryField = $language === 'ur' ? 'summary_urdu' : 'summary';
            $contentField = $language === 'ur' ? 'content_urdu' : 'content';
            $articles = \App\Models\Article::with('images')
                ->where('language', $language)
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

        // Related articles: 6 from same category as first search result, or latest 6 if none
        $relatedArticles = [];
        if ($mainArticle) {
            $relatedArticles = \App\Models\Article::with('images')
                ->where('category', $mainArticle->category)
                ->where('id', '!=', $mainArticle->id)
                ->where('language', $language)
                ->orderBy('created_at', 'desc')
                ->take(6)
                ->get();
        }
        // If not enough related articles, fill with latest articles (excluding already shown)
        if (count($relatedArticles) < 6) {
            $excludeIds = $mainArticle ? [$mainArticle->id] : [];
            if (!empty($relatedArticles)) {
                $excludeIds = array_merge($excludeIds, $relatedArticles->pluck('id')->all());
            }
            $needed = 6 - count($relatedArticles);
            $latestFill = \App\Models\Article::with('images')
                ->where('language', $language)
                ->whereNotIn('id', $excludeIds)
                ->orderBy('created_at', 'desc')
                ->take($needed)
                ->get();
            $relatedArticles = $relatedArticles->concat($latestFill);
        }
        $relatedArticles = collect($relatedArticles)->map(function($related) use ($language) {
            return $this->formatArticle($related, $language, 12, 20);
        });

        $darkMode = $request->header('X-Dark-Mode', false);

        return \Inertia\Inertia::render('SearchResults', [
            'query' => $query,
            'articles' => $articles->map(function($a) use ($language) {
                return $this->formatArticle($a, $language, 12, 20);
            }),
            'relatedArticles' => $relatedArticles,
            'darkMode' => $darkMode,
            'currentLanguage' => $language,
        ]);
    }

    // News page for only news articles, grouped by type, but only where category = 'News'
   public function newsPage(Request $request)
{
    $language = $request->input('language', $request->cookie('language', 'en'));
    if ($request->has('language')) {
        cookie()->queue('language', $language, 60 * 24 * 365);
    }

    $types = [
        'standard', 'breaking', 'exclusive', 'investigation', 'analysis', 'feature',
        'interview', 'opinion', 'editorial', 'factCheck', 'live', 'obituary', 'review', 'news'
    ];

    // Get top stories (6 most recent is_top_story articles)
    $topStories = Article::with('images')
        ->where(function($query) use ($language) {
            if ($language === 'ur') {
                $query->where('language', 'ur')->orWhere('language', 'multi');
            } else {
                $query->where('language', 'en')->orWhere('language', 'multi');
            }
        })
        ->where('category', 'News')
        ->where('is_top_story', true)
        ->orderBy('created_at', 'desc')
        ->limit(6)
        ->get();

    $sections = [];
    foreach ($types as $type) {
        $articles = Article::with('images')
            ->where(function($query) use ($language) {
                if ($language === 'ur') {
                    $query->where('language', 'ur')->orWhere('language', 'multi');
                } else {
                    $query->where('language', 'en')->orWhere('language', 'multi');
                }
            })
            ->where('category', 'News')
            ->where('type', $type)
            ->orderBy('created_at', 'desc')
            ->get();
        if ($articles->count() > 0) {
            $sections[$type] = $articles;
        }
    }

    return Inertia::render('News', [
        'newsSections' => $sections,
        'currentLanguage' => $language,
        'topStories' => $topStories,
    ]);
}
}
