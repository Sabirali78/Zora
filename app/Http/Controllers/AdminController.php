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

class AdminController extends Controller
{
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
        $totalArticles = Article::count();
        $englishArticles = Article::where('language', 'en')->count();
        $urduArticles = Article::where('language', 'ur')->count();
        $multiLangArticles = Article::where('language', 'multi')->count();
        
        // Get article counts by category
        $categoryCounts = [];
        foreach ($this->getCategories() as $category) {
            $categoryCounts[$category] = Article::where('category', $category)->count();
        }

        $adminName = null;
        $adminId = $request->session()->get('admin_id');
        if ($adminId) {
            $admin = User::find($adminId);
            if ($admin) {
                $adminName = $admin->name;
            }
        }

        return Inertia::render('Admin/Dashboard', [
            'totalArticles' => $totalArticles,
            'englishArticles' => $englishArticles,
            'urduArticles' => $urduArticles,
            'multiLangArticles' => $multiLangArticles,
            'categoryCounts' => $categoryCounts,
            'categories' => $this->getCategories(),
            'adminName' => $adminName,
        ]);
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
                    'title' => $a->title ?? $a->title_urdu, 
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

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        
        $user = User::where('email', $request->input('email'))->first();

        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            return back()->withErrors(['email' => 'Invalid credentials'])->withInput();
        }

        if ($user->is_admin) {
            $request->session()->put('is_admin', true);
            $request->session()->put('admin_id', $user->id);
            
            AdminLog::create([
                'admin_id' => $user->id,
                'action' => 'login',
                'model_type' => null,
                'model_id' => null,
                'details' => 'Admin logged in',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
            
            $secret = $request->attributes->get('admin_secret', 'admin-SECRET123');
            return redirect("/{$secret}");
        }

        if ($user->role === 'moderator') {
            Auth::login($user);
            $request->session()->put('moderator_id', $user->id);
            return redirect('/moderator');
        }

        return back()->withErrors(['email' => 'Invalid credentials'])->withInput();
    }

  public function logout(Request $request)
{
    $adminId = $request->session()->get('admin_id');
    
    // Log the logout action
    if ($adminId) {
        AdminLog::create([
            'admin_id' => $adminId,
            'action' => 'logout',
            'model_type' => null,
            'model_id' => null,
            'details' => 'Admin logged out',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
    
    // DEBUG: Log what's in session before logout
    \Log::info('Before logout', [
        'session_id' => session()->getId(),
        'is_admin' => session()->get('is_admin'),
        'admin_id' => session()->get('admin_id'),
        'all_session' => session()->all()
    ]);
    
    // METHOD 1: Laravel's proper logout (recommended)
    Auth::logout(); // This handles everything
    
    // METHOD 2: Manual session destruction (alternative)
    // $request->session()->invalidate(); // Invalidate the session
    // $request->session()->regenerateToken(); // Regenerate CSRF token
    // session()->flush(); // Remove all data
    
    // Clear specific admin data
    session()->forget('is_admin');
    session()->forget('admin_id');
    session()->forget('admin_name');
    session()->forget('admin_email');
    
    // DEBUG: Log what's in session after logout
    \Log::info('After logout', [
        'session_id' => session()->getId(),
        'is_admin' => session()->get('is_admin'),
        'admin_id' => session()->get('admin_id'),
    ]);
    
    $secret = $request->attributes->get('admin_secret', 'SECRET123');
    return redirect("/{$secret}/login")->with('message', 'Logged out successfully');
}
    public function allArticles(Request $request)
    {
        $query = Article::query();
        
        // Filter by category if provided
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }
        
        // Filter by language if provided
        if ($request->has('language') && $request->language !== 'all') {
            $query->where('language', $request->language);
        }
        
        // Filter by featured status
        if ($request->has('featured') && $request->featured !== 'all') {
            $query->where('is_featured', $request->featured === 'yes');
        }
        
        // Search by title/slug
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('title_urdu', 'LIKE', "%{$search}%")
                  ->orWhere('slug', 'LIKE', "%{$search}%")
                  ->orWhere('author', 'LIKE', "%{$search}%");
            });
        }
        
        $articles = $query->orderBy('created_at', 'desc')->paginate(20);
        
        return Inertia::render('Admin/AllArticles', [
            'articles' => $articles,
            'categories' => $this->getCategories(),
            'filters' => $request->only(['category', 'language', 'featured', 'search']),
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
        'language' => 'required|in:en,ur,multi',
        'title' => 'required_if:language,en,multi',
        'summary' => 'required_if:language,en,multi',
        'content' => 'required_if:language,en,multi',
        'title_urdu' => 'required_if:language,ur,multi',
        'summary_urdu' => 'required_if:language,ur,multi',
        'content_urdu' => 'required_if:language,ur,multi',
        'category' => 'required|in:News,Opinion,Analysis,Mystery / Fiction,Stories / Creative,Miscellaneous', // Updated
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
        'language' => $validated['language'],
        'title' => $validated['title'] ?? null,
        'summary' => $validated['summary'] ?? null,
        'content' => $validated['content'] ?? null,
        'title_urdu' => $validated['title_urdu'] ?? null,
        'summary_urdu' => $validated['summary_urdu'] ?? null,
        'content_urdu' => $validated['content_urdu'] ?? null,
        'category' => $validated['category'],
        'tags' => $validated['tags'] ?? null,
        'author' => $validated['author'],
        'is_featured' => $request->boolean('is_featured', false),
        'image_url' => $validated['image_url'] ?? null,
        'image_public_id' => $validated['image_public_id'] ?? null,
    ]);

    // Handle slug generation
    $article->slug = $validated['slug'] ?? \Str::slug(
        $article->title ?? $article->title_urdu ?? uniqid('article-', true)
    );

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
            'details' => 'Created article: ' . ($article->title ?? $article->title_urdu) . ' (Category: ' . $article->category . ')',
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
                'details' => 'Deleted article: ' . ($article->title ?? $article->title_urdu) . ' (Category: ' . $article->category . ')',
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
        'language' => 'required|in:en,ur,multi',
        'title' => 'required_if:language,en,multi',
        'summary' => 'required_if:language,en,multi',
        'content' => 'required_if:language,en,multi',
        'title_urdu' => 'required_if:language,ur,multi',
        'summary_urdu' => 'required_if:language,ur,multi',
        'content_urdu' => 'required_if:language,ur,multi',
        'category' => 'required|in:News,Opinion,Analysis,Mystery / Fiction,Stories / Creative,Miscellaneous', // Updated
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

    $article->language = $validated['language'];
    $article->title = $validated['title'] ?? null;
    $article->summary = $validated['summary'] ?? null;
    $article->content = $validated['content'] ?? null;
    $article->title_urdu = $validated['title_urdu'] ?? null;
    $article->summary_urdu = $validated['summary_urdu'] ?? null;
    $article->content_urdu = $validated['content_urdu'] ?? null;
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
        $slug = \Str::slug($article->title ?? $article->title_urdu ?? uniqid('article-', true));
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
            'details' => 'Updated article: ' . ($article->title ?? $article->title_urdu) . ' (Category: ' . $article->category . ')',
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
                'details' => 'Toggled featured status: ' . ($article->is_featured ? 'Featured' : 'Unfeatured') . ' - ' . ($article->title ?? $article->title_urdu),
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
            'by_language' => Article::selectRaw('language, COUNT(*) as count')
                ->groupBy('language')
                ->get()
                ->pluck('count', 'language'),
            'featured_count' => Article::where('is_featured', true)->count(),
            'latest_articles' => Article::orderBy('created_at', 'desc')
                ->take(10)
                ->get(['id', 'title', 'category', 'author', 'created_at'])
        ];
        
        return response()->json($stats);
    }
}