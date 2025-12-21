<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Trash;
use App\Models\AdminLog;
use App\Models\ModeratorLog;
use Illuminate\Support\Facades\Storage;
use App\Models\TrafficLog; // Add this import
use Illuminate\Support\Facades\DB; // Add this for DB::raw

class AdminController extends Controller
{
public function createModerator()
{
    return inertia('Admin/CreateModerator', [
        'adminName' => auth()->user()->name,
    ]);
}

// Store new moderator
public function storeModerator(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6|confirmed', // Add confirmed rule
    ], [
        'password.confirmed' => 'Password confirmation does not match.',
    ]);

    User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'moderator',
        'email_verified_at' => now(), // Auto-verify admin-created accounts
    ]);

    return redirect()->route('admin.moderators')
                     ->with('success', 'Moderator created successfully.');
}


   private function getCategories()
{
    return [
        'News',
        'Opinion', 
        'Analysis',
        'Mystery / Fiction',
        'Stories / Creative',
        'Miscellaneous'
    ];
}

   public function dashboard(Request $request)
    {
        // Require authenticated admin user
        if (! Auth::check() || (Auth::user()->role !== 'admin' && Auth::user()->is_admin != 1)) {
            return redirect()->route('login');
        }

        $totalArticles = Article::count();

        // Get article counts by category
        $categoryCounts = [];
        foreach ($this->getCategories() as $category) {
            $categoryCounts[$category] = Article::where('category', $category)->count();
        }

        $adminName = Auth::user()->name ?? null;

        // ---------- TRAFFIC STATS ----------
        $totalVisits = TrafficLog::count();

        $todayVisits = TrafficLog::whereDate('created_at', today())->count();

        $uniqueVisitors = TrafficLog::select('ip')->distinct()->count('ip'); // Fixed column name

        // Top 10 Most Viewed Articles
        $topArticles = TrafficLog::select('article_id', DB::raw('COUNT(*) as views'))
            ->whereNotNull('article_id')
            ->groupBy('article_id')
            ->orderByDesc('views')
            ->with('article:id,title,slug')
            ->limit(10)
            ->get()
            ->map(function($item) {
                return [
                    'article' => $item->article,
                    'views' => $item->views
                ];
            });

        // Latest 20 Logs
        $latestLogs = TrafficLog::with('article:id,title,slug')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function($log) {
                return [
                    'article' => $log->article,
                    'ip' => $log->ip_address,
                    'user_agent' => $this->formatUserAgent($log->browser, $log->platform),
                    'created_at' => $log->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'totalArticles' => $totalArticles,
            'categoryCounts' => $categoryCounts,
            'categories' => $this->getCategories(),
            'adminName' => $adminName,

            // Traffic Props
            'totalVisits' => $totalVisits,
            'todayVisits' => $todayVisits,
            'uniqueVisitors' => $uniqueVisitors,
            'topArticles' => $topArticles,
            'latestLogs' => $latestLogs,
        ]);
    }

    // Helper method to format user agent
    private function formatUserAgent($browser, $platform)
    {
        if (!$browser && !$platform) {
            return 'Unknown';
        }
        
        if ($browser && $platform) {
            return "{$browser} on {$platform}";
        }
        
        return $browser ?: $platform;
    }

    public function adminLogs(Request $request)
    {
        $query = AdminLog::query()
            ->whereIn('action', ['create', 'update', 'delete'])
            ->orderByDesc('created_at');
            
        $filterAdminId = $request->input('admin_id');
        if ($filterAdminId) {
            $query->where('admin_id', $filterAdminId);
        }
        
        $logs = $query->paginate(20)->withQueryString();
        
        $pagination = [
            'current_page' => $logs->currentPage(),
            'last_page' => $logs->lastPage(),
            'per_page' => $logs->perPage(),
            'total' => $logs->total(),
            'next_page_url' => $logs->nextPageUrl(),
            'prev_page_url' => $logs->previousPageUrl(),
        ];
        
        $items = collect($logs->items());
        $articleIds = $items->filter(function ($l) { 
            return $l->model_type === 'Article' && $l->model_id; 
        })->pluck('model_id')->unique()->values()->all();
        
        $articles = [];
        if (!empty($articleIds)) {
            $articles = Article::whereIn('id', $articleIds)->get()->keyBy('id');
        }
        
        $logsWithArticle = $items->map(function ($l) use ($articles) {
            $arr = $l instanceof \Illuminate\Database\Eloquent\Model ? $l->toArray() : (array) $l;
            
            if (isset($l->created_at) && $l->created_at instanceof \Carbon\Carbon) {
                $arr['created_at'] = $l->created_at->toIso8601String();
            }
            
            $arr['article'] = null;
            if ($l->model_type === 'Article' && $l->model_id && isset($articles[$l->model_id])) {
                $a = $articles[$l->model_id];
                $arr['article'] = [ 
                    'id' => $a->id, 
                    'title' => $a->title, 
                    'slug' => $a->slug,
                    'category' => $a->category
                ];
            }
            
            return $arr;
        })->all();

        return Inertia::render('Admin/AdminLogs', [
            'logs' => $logsWithArticle,
            'pagination' => $pagination,
            'filterAdminId' => $filterAdminId,
        ]);
    }

    public function removeImage(Request $request, $articleId, $imageId)
{
    \Log::info('Admin removeImage called', [
        'article_id' => $articleId,
        'image_id' => $imageId,
        'admin_id' => Auth::id(),
        'url' => $request->fullUrl(),
    ]);
    
    // Check if user is admin
    if (!Auth::check() || (Auth::user()->role !== 'admin' && Auth::user()->is_admin != 1)) {
        \Log::warning('Unauthorized access to removeImage');
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    try {
        \Log::info('Looking for article and image...');
        
        // Find the article
        $article = Article::find($articleId);
        if (!$article) {
            \Log::error('Article not found', ['article_id' => $articleId]);
            return response()->json(['error' => 'Article not found'], 404);
        }
        
        // Find the image - use where clause to be safe
        $image = $article->images()->where('id', $imageId)->first();
        if (!$image) {
            \Log::error('Image not found', ['image_id' => $imageId]);
            return response()->json(['error' => 'Image not found'], 404);
        }
        
        \Log::info('Found article and image', [
            'article_title' => $article->title,
            'image_path' => $image->path,
        ]);
        
        // Delete the image file from storage
        if ($image->path && Storage::disk('public')->exists($image->path)) {
            Storage::disk('public')->delete($image->path);
            \Log::info('Deleted file from storage', ['path' => $image->path]);
        }
        
        // Delete the image record
        $image->delete();
        \Log::info('Deleted image record from database');
        
        // Log the action
        AdminLog::create([
            'admin_id' => Auth::id(),
            'action' => 'delete',
            'model_type' => 'Image',
            'model_id' => $imageId,
            'details' => 'Removed image from article: ' . $article->title . ' (Image ID: ' . $imageId . ')',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
        
        \Log::info('Image removal completed successfully');
        
        // Return Inertia response instead of plain JSON
        return redirect()->back()->with('success', 'Image removed successfully');
        
    } catch (\Exception $e) {
        \Log::error('Error removing image', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);
        
        return redirect()->back()->with('error', 'Error removing image: ' . $e->getMessage());
    }
}
    
    public function allArticles(Request $request)
    {
        $query = Article::query();
        
        // Filter by category if provided
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }
        
        // language column removed; no language filter
        
        // Filter by featured status
        if ($request->has('featured') && $request->featured !== 'all') {
            $query->where('is_featured', $request->featured === 'yes');
        }
        
        // Search by title/slug/author
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('slug', 'LIKE', "%{$search}%")
                  ->orWhere('author', 'LIKE', "%{$search}%");
            });
        }
        
        $articles = $query->orderBy('created_at', 'desc')->paginate(20);
        
        return Inertia::render('Admin/AllArticles', [
            'articles' => $articles,
            'categories' => $this->getCategories(),
            'filters' => $request->only(['category', 'featured', 'search']),
        ]);
    }

    public function moderators(Request $request)
    {
        $query = User::where('role', 'moderator')->orderByDesc('created_at');
        $perPage = 20;
        $moderators = $query->paginate($perPage)->withQueryString();
        
        $pagination = [
            'current_page' => $moderators->currentPage(),
            'last_page' => $moderators->lastPage(),
            'per_page' => $moderators->perPage(),
            'total' => $moderators->total(),
            'next_page_url' => $moderators->nextPageUrl(),
            'prev_page_url' => $moderators->previousPageUrl(),
        ];
        
        $moderatorItems = collect($moderators->items())->map(function ($m) {
            return [
                'id' => $m->id,
                'name' => $m->name,
                'email' => $m->email,
                'email_verified_at' => $m->email_verified_at,
                'created_at' => $m->created_at,
            ];
        })->all();

        return Inertia::render('Admin/Moderators', [
            'moderators' => $moderatorItems,
            'pagination' => $pagination,
        ]);
    }

    public function verifyModerator(Request $request, $id)
    {
        $adminId = $request->session()->get('admin_id');
        $moderator = User::where('role', 'moderator')->findOrFail($id);
        $moderator->email_verified_at = now();
        $moderator->save();
        
        if ($adminId) {
            AdminLog::create([
                'admin_id' => $adminId,
                'action' => 'verify_moderator',
                'model_type' => 'User',
                'model_id' => $moderator->id,
                'details' => 'Verified moderator: ' . $moderator->email,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }
        
        return redirect()->back()->with('success', 'Moderator verified successfully.');
    }

     public function unverifyModerator(Request $request, $id)
    {
        $adminId = $request->session()->get('admin_id');
        $moderator = User::where('role', 'moderator')->findOrFail($id);
        $moderator->email_verified_at = null;
        $moderator->save();
        
        if ($adminId) {
            AdminLog::create([
                'admin_id' => $adminId,
                'action' => 'unverify_moderator',
                'model_type' => 'User',
                'model_id' => $moderator->id,
                'details' => 'Unverified moderator: ' . $moderator->email,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }
        
        return redirect()->back()->with('success', 'Moderator unverified successfully.');
    }

    public function moderatorLogs(Request $request, $id)
    {
        $moderator = User::findOrFail($id);
        
        $query = ModeratorLog::where('moderator_id', $id)
            ->whereIn('action', ['create', 'update', 'delete'])
            ->orderByDesc('created_at');
            
        $perPage = 20;
        $logs = $query->paginate($perPage)->withQueryString();
        
        $pagination = [
            'current_page' => $logs->currentPage(),
            'last_page' => $logs->lastPage(),
            'per_page' => $logs->perPage(),
            'total' => $logs->total(),
            'next_page_url' => $logs->nextPageUrl(),
            'prev_page_url' => $logs->previousPageUrl(),
        ];
        
        $items = collect($logs->items());
        $articleIds = $items->filter(function ($l) { 
            return $l->model_type === 'Article' && $l->model_id; 
        })->pluck('model_id')->unique()->values()->all();
        
        $articles = [];
        if (!empty($articleIds)) {
            $articles = Article::whereIn('id', $articleIds)->get()->keyBy('id');
        }
        
        $logsWithArticle = $items->map(function ($l) use ($articles) {
            $arr = $l instanceof \Illuminate\Database\Eloquent\Model ? $l->toArray() : (array) $l;
            
            if (isset($l->created_at) && $l->created_at instanceof \Carbon\Carbon) {
                $arr['created_at'] = $l->created_at->toIso8601String();
            }
            
            $arr['article'] = null;
            if ($l->model_type === 'Article' && $l->model_id && isset($articles[$l->model_id])) {
                $a = $articles[$l->model_id];
                $arr['article'] = [ 
                    'id' => $a->id, 
                    'title' => $a->title ?? $a->title_urdu, 
                    'slug' => $a->slug,
                    'category' => $a->category
                ];
            }
            
            return $arr;
        })->all();

        return Inertia::render('Admin/ModeratorLogs', [
            'logs' => $logsWithArticle,
            'pagination' => $pagination,
            'moderatorId' => $id,
            'moderator' => [
                'id' => $moderator->id,
                'name' => $moderator->name,
                'email' => $moderator->email,
                'created_at' => $moderator->created_at,
                'email_verified_at' => $moderator->email_verified_at,
            ],
        ]);
    }

    public function createArticle()
    {
        return Inertia::render('Admin/CreateArticle', [
            'categories' => $this->getCategories(),
        ]);
    }

  public function storeArticle(Request $request)
{
    $adminId = $request->session()->get('admin_id');
    
    $validated = $request->validate([
        'title' => 'required|string',
        'summary' => 'required|string',
        'content' => 'required|string',
        'category' => 'required|in:News,Opinion,Analysis,Mystery / Fiction,Stories / Creative,Miscellaneous',
        'tags' => 'nullable|string',
        'image_url' => 'nullable|url',
        'image_public_id' => 'nullable|string',
        'main_image' => 'nullable|image|max:4096',
        'images' => 'nullable',
        'images.*' => 'image|max:4096',
        'author' => 'required|string',
        'slug' => 'nullable|string|unique:articles,slug',
        'is_featured' => 'sometimes|boolean',
    ]);

    $article = new Article();
    $article->fill([
        'title' => $validated['title'] ?? null,
        'summary' => $validated['summary'] ?? null,
        'content' => $validated['content'] ?? null,
        'category' => $validated['category'],
        'tags' => $validated['tags'] ?? null,
        'author' => $validated['author'],
        'is_featured' => $request->boolean('is_featured', false),
        'image_url' => $validated['image_url'] ?? null,
        'image_public_id' => $validated['image_public_id'] ?? null,
    ]);

    // Handle slug generation
    $article->slug = $validated['slug'] ?? \Str::slug($article->title ?? uniqid('article-', true));

    // Ensure slug is unique
    $originalSlug = $article->slug;
    $counter = 1;
    while (Article::where('slug', $article->slug)->exists()) {
        $article->slug = $originalSlug . '-' . $counter++;
    }

    $article->save();

    // Handle multiple image uploads
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $index => $file) {
            $path = $file->store('articles', 'public');
            $image = $article->images()->create([
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
            ]);
            
            // If this is the first image and no image_url was provided, set it as main image
            if ($index === 0 && empty($article->image_url)) {
                $article->image_url = asset('storage/' . $path);
                $article->save();
            }
        }
    }

    // Log admin create
    if ($adminId) {
        AdminLog::create([
            'admin_id' => $adminId,
            'action' => 'create',
            'model_type' => 'Article',
            'model_id' => $article->id,
            'details' => 'Created article: ' . ($article->title) . ' (Category: ' . $article->category . ')',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }

    return redirect()->route('admin.articles')->with('success', 'Article created successfully!');
}
    public function deleteArticle(Request $request, $id)
    {
        $adminId = $request->session()->get('admin_id');
        $article = Article::findOrFail($id);
        
        // Move to trash before deleting
        Trash::create([
            'article_data' => $article->toArray(),
            'deleted_by' => $request->session()->get('admin_id'),
            'deleted_at' => now()
        ]);
        
        // Delete the article
        $article->delete();

        if ($adminId) {
            AdminLog::create([
                'admin_id' => $adminId,
                'action' => 'delete',
                'model_type' => 'Article',
                'model_id' => $article->id,
                'details' => 'Deleted article: ' . ($article->title) . ' (Category: ' . $article->category . ')',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }
        
        return redirect()->back()->with('success', 'Article moved to trash successfully');
    }

    public function editArticle($id)
    {
        $article = Article::with(['images' => function($q) { $q->orderBy('id', 'desc'); }])->findOrFail($id);
        
        return Inertia::render('Admin/EditArticle', [
            'article' => $article,
            'categories' => $this->getCategories(),
        ]);
    }

  public function updateArticle(Request $request, $id)
{
    $adminId = $request->session()->get('admin_id');
    $article = Article::findOrFail($id);
    
    $validated = $request->validate([
        'title' => 'required|string',
        'summary' => 'required|string',
        'content' => 'required|string',
        'category' => 'required|in:News,Opinion,Analysis,Mystery / Fiction,Stories / Creative,Miscellaneous',
        'tags' => 'nullable|string',
        'image_url' => 'nullable|url',
        'image_public_id' => 'nullable|string',
        'main_image' => 'nullable|image|max:4096',
        'images' => 'nullable',
        'images.*' => 'image|max:4096',
        'author' => 'required|string',
        'slug' => 'nullable|string|unique:articles,slug,' . $article->id,
        'is_featured' => 'sometimes|boolean',
    ]);

    $article->title = $validated['title'] ?? null;
    $article->summary = $validated['summary'] ?? null;
    $article->content = $validated['content'] ?? null;
    $article->category = $validated['category'];
    $article->tags = $validated['tags'] ?? null;
    $article->author = $validated['author'];
    $article->is_featured = $request->boolean('is_featured', false);
    $article->image_url = $validated['image_url'] ?? null;
    $article->image_public_id = $validated['image_public_id'] ?? null;
    
    // Handle main image upload
    if ($request->hasFile('main_image')) {
        $mainImagePath = $request->file('main_image')->store('articles/main', 'public');
       $article->image_url = 'storage/' . $mainImagePath;
    }
    
    // Handle slug update and uniqueness
    if (isset($validated['slug']) && !empty($validated['slug'])) {
        $slug = $validated['slug'];
    } else {
        $slug = \Str::slug($article->title ?? uniqid('article-', true));
    }
    
    $originalSlug = $slug;
    $counter = 1;
    while (Article::where('slug', $slug)->where('id', '!=', $article->id)->exists()) {
        $slug = $originalSlug . '-' . $counter++;
    }
    
    $article->slug = $slug;
    $article->save();

    // Handle multiple image uploads
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $file) {
            $path = $file->store('articles', 'public');
            $article->images()->create([
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
            ]);
        }
    }

    // Log admin update
    if ($adminId) {
        AdminLog::create([
            'admin_id' => $adminId,
            'action' => 'update',
            'model_type' => 'Article',
            'model_id' => $article->id,
            'details' => 'Updated article: ' . ($article->title) . ' (Category: ' . $article->category . ')',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }

    return redirect()->route('admin.articles')->with('success', 'Article updated successfully!');
}
    // New method to toggle featured status
    public function toggleFeatured(Request $request, $id)
    {
        $adminId = $request->session()->get('admin_id');
        $article = Article::findOrFail($id);
        
        $article->is_featured = !$article->is_featured;
        $article->save();
        
        if ($adminId) {
            AdminLog::create([
                'admin_id' => $adminId,
                'action' => 'update',
                'model_type' => 'Article',
                'model_id' => $article->id,
                'details' => 'Toggled featured status: ' . ($article->is_featured ? 'Featured' : 'Unfeatured') . ' - ' . ($article->title),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }
        
        return response()->json([
            'success' => true,
            'is_featured' => $article->is_featured,
            'message' => 'Featured status updated successfully'
        ]);
    }
    
    // New method for article statistics
    public function articleStats()
    {
        $stats = [
            'total' => Article::count(),
            'by_category' => Article::selectRaw('category, COUNT(*) as count')
                ->groupBy('category')
                ->get()
                ->pluck('count', 'category'),
            // 'by_language' removed (English-only)
            'featured_count' => Article::where('is_featured', true)->count(),
            'latest_articles' => Article::orderBy('created_at', 'desc')
                ->take(10)
                ->get(['id', 'title', 'category', 'author', 'created_at'])
        ];
        
        return response()->json($stats);
    }


    private function getDateRange($period)
{
    $endDate = now()->endOfDay();
    
    switch ($period) {
        case '7days':
            $startDate = now()->subDays(7)->startOfDay();
            break;
        case '30days':
            $startDate = now()->subDays(30)->startOfDay();
            break;
        case '90days':
            $startDate = now()->subDays(90)->startOfDay();
            break;
        case 'year':
            $startDate = now()->subYear()->startOfDay();
            break;
        case 'all':
            $startDate = TrafficLog::min('created_at') ? Carbon::parse(TrafficLog::min('created_at')) : now()->subYear();
            break;
        default:
            $startDate = now()->subDays(7)->startOfDay();
    }
    
    return ['start' => $startDate, 'end' => $endDate];
}


private function calculateAvgTimeOnArticle($articleId, $startDate, $endDate)
{
    // This is a simplified version - you might want to implement session tracking
    $logs = TrafficLog::where('article_id', $articleId)
        ->whereBetween('created_at', [$startDate, $endDate])
        ->orderBy('created_at')
        ->get();

    if ($logs->count() < 2) {
        return 0;
    }

    // Calculate average time between visits to same article from same IP (simplified)
    $totalTime = 0;
    $count = 0;

    foreach ($logs->groupBy('ip') as $ipLogs) {
        if ($ipLogs->count() > 1) {
            $ipLogs = $ipLogs->sortBy('created_at');
            for ($i = 0; $i < $ipLogs->count() - 1; $i++) {
                $timeDiff = $ipLogs[$i]->created_at->diffInSeconds($ipLogs[$i + 1]->created_at);
                // If time difference is reasonable (less than 1 hour), assume it's the same session
                if ($timeDiff < 3600) {
                    $totalTime += $timeDiff;
                    $count++;
                }
            }
        }
    }

    return $count > 0 ? round($totalTime / $count) : 0;
}


public function trafficAnalytics(Request $request)
{
    // Require admin authentication
    if (!Auth::check() || (Auth::user()->role !== 'admin' && Auth::user()->is_admin != 1)) {
        return redirect()->route('login');
    }

    $period = $request->input('period', '7days'); // 7days, 30days, 90days, year
    
    // Determine date range - FIXED METHOD CALL
    $dateRange = $this->getDateRange($period); // This should match your method name
    $startDate = $dateRange['start'];
    $endDate = $dateRange['end'];

    // Base query
    $query = TrafficLog::query();
    
    // Apply date filter
    $query->whereBetween('created_at', [$startDate, $endDate]);

    // ============ OVERALL STATS ============
    $totalVisits = $query->count();
    $uniqueVisitors = $query->distinct('ip')->count('ip');
    
    // Simplified bounce rate calculation (since we don't have page_type)
    $bounceRate = $this->calculateBounceRate($startDate, $endDate);
    
    // ============ VISITS OVER TIME ============
    $visitsOverTime = $this->getVisitsOverTime($startDate, $endDate);
    
    
    // ============ TOP ARTICLES ============
    $topArticles = TrafficLog::select(
            'article_id',
            DB::raw('COUNT(*) as visits'),
            DB::raw('COUNT(DISTINCT ip) as unique_visitors')
        )
        ->whereBetween('created_at', [$startDate, $endDate])
        ->whereNotNull('article_id')
        ->groupBy('article_id')
        ->orderByDesc('visits')
        ->with('article:id,title,slug,category,author')
        ->limit(20)
        ->get()
        ->map(function ($item) use ($startDate, $endDate) {
            return [
                'article' => $item->article,
                'visits' => $item->visits,
                'unique_visitors' => $item->unique_visitors,
                'avg_time_on_page' => $this->calculateAvgTimeOnArticle($item->article_id, $startDate, $endDate),
            ];
        });

    // ============ ARTICLE VIEWS BREAKDOWN ============
    $articleViews = TrafficLog::select(
            DB::raw('COUNT(*) as total_visits'),
            DB::raw('COUNT(DISTINCT article_id) as articles_viewed'),
            DB::raw('ROUND(AVG(TIMESTAMPDIFF(SECOND, created_at, updated_at)), 0) as avg_duration')
        )
        ->whereBetween('created_at', [$startDate, $endDate])
        ->whereNotNull('article_id')
        ->first();

    // ============ TIME OF DAY ANALYSIS ============
    $timeOfDayStats = TrafficLog::select(
            DB::raw('HOUR(created_at) as hour'),
            DB::raw('COUNT(*) as visits')
        )
        ->whereBetween('created_at', [$startDate, $endDate])
        ->groupBy('hour')
        ->orderBy('hour')
        ->get();

    // ============ PEAK TRAFFIC DAYS ============
    $peakDays = TrafficLog::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as visits'),
            DB::raw('COUNT(DISTINCT ip) as unique_visitors')
        )
        ->whereBetween('created_at', [$startDate, $endDate])
        ->groupBy('date')
        ->orderByDesc('visits')
        ->limit(10)
        ->get();

    // ============ BROWSER/DEVICE DETECTION FROM USER_AGENT ============
    // Extract basic browser info from user_agent
     // ============ BROWSER/DEVICE DETECTION FROM USER_AGENT ============
    // Extract basic browser info from user_agent - FIXED
    $browserStats = TrafficLog::select(
            DB::raw('
                CASE 
                    WHEN user_agent LIKE "%Chrome%" THEN "Chrome"
                    WHEN user_agent LIKE "%Firefox%" THEN "Firefox"
                    WHEN user_agent LIKE "%Safari%" THEN "Safari"
                    WHEN user_agent LIKE "%Edge%" THEN "Edge"
                    WHEN user_agent LIKE "%Opera%" THEN "Opera"
                    WHEN user_agent LIKE "%MSIE%" OR user_agent LIKE "%Trident%" THEN "Internet Explorer"
                    ELSE "Other"
                END as browser
            '),
            DB::raw('COUNT(*) as visits')
        )
        ->whereBetween('created_at', [$startDate, $endDate])
        ->groupBy('browser')
        ->orderByDesc('visits')
        ->limit(10)
        ->get()
        ->map(function ($item) use ($totalVisits) {
            return [
                'browser' => $item->browser,
                'visits' => $item->visits,
                'percentage' => $totalVisits > 0 ? round(($item->visits / $totalVisits) * 100, 2) : 0,
            ];
        });

    // Extract device type from user_agent - FIXED
    $deviceStats = TrafficLog::select(
            DB::raw('
                CASE 
                    WHEN user_agent LIKE "%Mobile%" OR user_agent LIKE "%Android%" OR user_agent LIKE "%iPhone%" THEN "Mobile"
                    WHEN user_agent LIKE "%Tablet%" OR user_agent LIKE "%iPad%" THEN "Tablet"
                    ELSE "Desktop"
                END as device_type
            '),
            DB::raw('COUNT(*) as visits')
        )
        ->whereBetween('created_at', [$startDate, $endDate])
        ->groupBy('device_type')
        ->orderByDesc('visits')
        ->get()
        ->map(function ($item) use ($totalVisits) {
            return [
                'device_type' => $item->device_type,
                'visits' => $item->visits,
                'percentage' => $totalVisits > 0 ? round(($item->visits / $totalVisits) * 100, 2) : 0,
            ];
        });

    // ============ REFERRER STATS ============
    $referrerStats = TrafficLog::select(
            DB::raw('
                CASE 
                    WHEN referer IS NULL OR referer = "" THEN "Direct"
                    WHEN referer LIKE "%google%" THEN "Google"
                    WHEN referer LIKE "%bing%" THEN "Bing"
                    WHEN referer LIKE "%yahoo%" THEN "Yahoo"
                    WHEN referer LIKE "%facebook%" THEN "Facebook"
                    WHEN referer LIKE "%twitter%" THEN "Twitter"
                    WHEN referer LIKE "%instagram%" THEN "Instagram"
                    WHEN referer LIKE "%linkedin%" THEN "LinkedIn"
                    WHEN referer LIKE "%tiktok%" THEN "TikTok"
                    WHEN referer LIKE "%youtube%" THEN "YouTube"
                    ELSE "Other Referrals"
                END as source
            '),
            DB::raw('COUNT(*) as visits')
        )
        ->whereBetween('created_at', [$startDate, $endDate])
        ->groupBy('source')
        ->orderByDesc('visits')
        ->get()
        ->map(function ($item) use ($totalVisits) {
            return [
                'source' => $item->source,
                'visits' => $item->visits,
                'percentage' => $totalVisits > 0 ? round(($item->visits / $totalVisits) * 100, 2) : 0,
            ];
        });

    // ============ REAL-TIME ACTIVITY (Last 24 hours) ============
    $realtimeActivity = TrafficLog::with(['article:id,title,slug'])
        ->where('created_at', '>=', now()->subHours(24))
        ->orderByDesc('created_at')
        ->limit(50)
        ->get()
        ->map(function ($log) {
            // Extract browser from user_agent for display
            $browser = 'Unknown';
            $userAgent = $log->user_agent ?? '';
            
            if (strpos($userAgent, 'Chrome') !== false) {
                $browser = 'Chrome';
            } elseif (strpos($userAgent, 'Firefox') !== false) {
                $browser = 'Firefox';
            } elseif (strpos($userAgent, 'Safari') !== false && strpos($userAgent, 'Chrome') === false) {
                $browser = 'Safari';
            } elseif (strpos($userAgent, 'Edge') !== false) {
                $browser = 'Edge';
            } elseif (strpos($userAgent, 'Opera') !== false) {
                $browser = 'Opera';
            } elseif (strpos($userAgent, 'MSIE') !== false || strpos($userAgent, 'Trident') !== false) {
                $browser = 'Internet Explorer';
            }
            
            // Extract device type
            $deviceType = 'Desktop';
            if (strpos($userAgent, 'Mobile') !== false || 
                strpos($userAgent, 'Android') !== false || 
                strpos($userAgent, 'iPhone') !== false) {
                $deviceType = 'Mobile';
            } elseif (strpos($userAgent, 'Tablet') !== false || strpos($userAgent, 'iPad') !== false) {
                $deviceType = 'Tablet';
            }
            
            return [
                'id' => $log->id,
                'article' => $log->article,
                'ip' => $log->ip,
                'browser' => $browser,
                'device_type' => $deviceType,
                'referrer' => $log->referer ?? 'Direct',
                'created_at' => $log->created_at->format('Y-m-d H:i:s'),
                'time_ago' => $log->created_at->diffForHumans(),
            ];
        });

    return Inertia::render('Admin/TrafficAnalytics', [
        // Filters
        'period' => $period,
        'startDate' => $startDate->format('Y-m-d'),
        'endDate' => $endDate->format('Y-m-d'),
        
        // Overall Stats
        'totalVisits' => $totalVisits,
        'uniqueVisitors' => $uniqueVisitors,
        'bounceRate' => $bounceRate,
        'articleViews' => $articleViews,
        
        // Charts Data
        'visitsOverTime' => $visitsOverTime,
        'timeOfDayStats' => $timeOfDayStats,
        
        // Breakdowns
        'deviceStats' => $deviceStats,
        'browserStats' => $browserStats,
        'referrerStats' => $referrerStats,
        
        // Content Analysis
        'topArticles' => $topArticles,
        'peakDays' => $peakDays,
        
        // Real-time
        'realtimeActivity' => $realtimeActivity,
        
        // Options for filters
        'periodOptions' => [
            ['value' => '7days', 'label' => 'Last 7 Days'],
            ['value' => '30days', 'label' => 'Last 30 Days'],
            ['value' => '90days', 'label' => 'Last 90 Days'],
            ['value' => 'year', 'label' => 'Last Year'],
            ['value' => 'all', 'label' => 'All Time'],
        ],
    ]);
}

// Update helper methods to remove page_type parameter
private function getVisitsOverTime($startDate, $endDate)
{
    $diffInDays = $startDate->diffInDays($endDate);
    
    if ($diffInDays <= 7) {
        // Daily breakdown for 7 days or less
        return TrafficLog::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as visits'),
                DB::raw('COUNT(DISTINCT ip) as unique_visitors')
            )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    } elseif ($diffInDays <= 30) {
        // Daily for 30 days
        return TrafficLog::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as visits'),
                DB::raw('COUNT(DISTINCT ip) as unique_visitors')
            )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    } else {
        // Monthly for longer periods
        return TrafficLog::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('COUNT(*) as visits'),
                DB::raw('COUNT(DISTINCT ip) as unique_visitors')
            )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }
}

private function calculateBounceRate($startDate, $endDate)
{
    // Simple bounce rate calculation: single page visits / total visits
    $totalVisits = TrafficLog::whereBetween('created_at', [$startDate, $endDate])
        ->count();

    $singlePageVisits = TrafficLog::select('ip')
        ->whereBetween('created_at', [$startDate, $endDate])
        ->groupBy('ip')
        ->havingRaw('COUNT(*) = 1')
        ->count();

    if ($totalVisits > 0) {
        return round(($singlePageVisits / $totalVisits) * 100, 2);
    }

    return 0;
}


}