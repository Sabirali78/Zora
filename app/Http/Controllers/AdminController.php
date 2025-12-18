<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Trash; // Add this import
use App\Models\AdminLog; // Add this import
use App\Models\ModeratorLog;


class AdminController extends Controller
{
      public function dashboard(Request $request)
    {
        $totalArticles = Article::count();
        $englishArticles = Article::where('language', 'en')->count();
        $urduArticles = Article::where('language', 'ur')->count();
        $multiLangArticles = Article::where('language', 'multi')->count();

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
            'adminName' => $adminName,
        ]);
    }
    /**
     * Show paginated admin logs, with optional filter by admin_id.
     */
    public function adminLogs(Request $request)
    {
        // Only show create/update/delete logs (filter out login/logout and other noise)
        $query = AdminLog::query()
            ->whereIn('action', ['create', 'update', 'delete'])
            ->orderByDesc('created_at');
        $filterAdminId = $request->input('admin_id');
        if ($filterAdminId) {
            $query->where('admin_id', $filterAdminId);
        }
        $logs = $query->paginate(20)->withQueryString();
        // Format pagination for Inertia
        $pagination = [
            'current_page' => $logs->currentPage(),
            'last_page' => $logs->lastPage(),
            'per_page' => $logs->perPage(),
            'total' => $logs->total(),
            'next_page_url' => $logs->nextPageUrl(),
            'prev_page_url' => $logs->previousPageUrl(),
        ];
        // Collect article titles for Article logs
        $items = collect($logs->items());
        $articleIds = $items->filter(function ($l) { return $l->model_type === 'Article' && $l->model_id; })->pluck('model_id')->unique()->values()->all();
        $articles = [];
        if (!empty($articleIds)) {
            $articles = Article::whereIn('id', $articleIds)->get()->keyBy('id');
        }
        // Attach article meta to log items; ensure created_at is formatted
        $logsWithArticle = $items->map(function ($l) use ($articles) {
            $arr = $l instanceof \Illuminate\Database\Eloquent\Model ? $l->toArray() : (array) $l;
            // ensure created_at is string
            if (isset($l->created_at) && $l->created_at instanceof \Carbon\Carbon) {
                $arr['created_at'] = $l->created_at->toIso8601String();
            }
            $arr['article'] = null;
            if ($l->model_type === 'Article' && $l->model_id && isset($articles[$l->model_id])) {
                $a = $articles[$l->model_id];
                $arr['article'] = [ 'id' => $a->id, 'title' => $a->title ?? $a->title_urdu, 'slug' => $a->slug ];
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

        // Admin -> go to admin dashboard (secret)
        if ($user->is_admin) {
            $request->session()->put('is_admin', true);
            $request->session()->put('admin_id', $user->id);
            // Log admin login
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

        // Moderator -> regular moderator dashboard
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
        $request->session()->forget('is_admin');
        $request->session()->forget('admin_id');
        $secret = $request->attributes->get('admin_secret', 'admin-SECRET123');
        return redirect("/{$secret}/login");
    }

    public function allArticles()
    {
        $articles = \App\Models\Article::orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/AllArticles', [
            'articles' => $articles,
        ]);
    }

    // Show list of moderators
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
        // Return moderator details including verification status
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

    // Admin verifies a moderator (sets email_verified_at)
    public function verifyModerator(Request $request, $id)
    {
        $adminId = $request->session()->get('admin_id');
        $moderator = User::where('role', 'moderator')->findOrFail($id);
        $moderator->email_verified_at = now();
        $moderator->save();
        // Log action
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

    // Show logs for a single moderator
    public function moderatorLogs(Request $request, $id)
    {
        $moderator = User::findOrFail($id);
        // show only create/update/delete logs in moderator logs listing
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
        $articleIds = $items->filter(function ($l) { return $l->model_type === 'Article' && $l->model_id; })->pluck('model_id')->unique()->values()->all();
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
                $arr['article'] = [ 'id' => $a->id, 'title' => $a->title ?? $a->title_urdu, 'slug' => $a->slug ];
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
        return Inertia::render('Admin/CreateArticle');
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
        'category' => 'required',
        'region' => 'nullable',
        'country' => 'nullable',
        'type' => 'required',
        'tags' => 'nullable',
        'images' => 'nullable',
        'images.*' => 'image|max:4096',
        'author' => 'required',
        'slug' => 'nullable|string|unique:articles,slug',
        'is_featured' => 'sometimes|boolean',
        'is_trending' => 'sometimes|boolean',
        'is_breaking' => 'sometimes|boolean',
        'is_top_story' => 'sometimes|boolean',
        'show_in_section' => 'sometimes|boolean',
        'section_priority' => 'nullable|integer',
    ]);

    $article = new \App\Models\Article();
    $article->fill([
        'language' => $validated['language'],
        'title' => $validated['title'] ?? null,
        'summary' => $validated['summary'] ?? null,
        'content' => $validated['content'] ?? null,
        'title_urdu' => $validated['title_urdu'] ?? null,
        'summary_urdu' => $validated['summary_urdu'] ?? null,
        'content_urdu' => $validated['content_urdu'] ?? null,
        'category' => $validated['category'],
        'region' => $validated['region'] ?? null,
        'country' => $validated['country'] ?? null,
        'type' => $validated['type'],
        'tags' => $validated['tags'] ?? null,
        'author' => $validated['author'],
        'is_featured' => $request->boolean('is_featured'),
        'is_trending' => $request->boolean('is_trending'),
        'is_breaking' => $request->boolean('is_breaking'),
        'is_top_story' => $request->boolean('is_top_story'),
        'show_in_section' => $request->boolean('show_in_section'),
        'section_priority' => $validated['section_priority'] ?? null,
    ]);

    // Handle slug generation
    $article->slug = $validated['slug'] ?? \Str::slug(
        $article->title ?? $article->title_urdu ?? uniqid()
    );

    // Ensure slug is unique
    $originalSlug = $article->slug;
    $counter = 1;
    while (\App\Models\Article::where('slug', $article->slug)->where('id', '!=', $article->id)->exists()) {
        $article->slug = $originalSlug . '-' . $counter++;
    }

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

    // Log admin create
    if ($adminId) {
        AdminLog::create([
            'admin_id' => $adminId,
            'action' => 'create',
            'model_type' => 'Article',
            'model_id' => $article->id,
            'details' => 'Created article: ' . ($article->title ?? $article->title_urdu),
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

        // Log admin delete
        if ($adminId) {
            AdminLog::create([
                'admin_id' => $adminId,
                'action' => 'delete',
                'model_type' => 'Article',
                'model_id' => $article->id,
                'details' => 'Deleted article: ' . ($article->title ?? $article->title_urdu),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }
        
        return redirect()->back()->with('success', 'Article moved to trash successfully');
    }

    public function editArticle($id)
    {
        $article = Article::with('images')->findOrFail($id);
        return Inertia::render('Admin/EditArticle', [
            'article' => $article,
        ]);
    }

    public function updateArticle(Request $request, $id)
    {
        $adminId = $request->session()->get('admin_id');
        $article = Article::findOrFail($id);
        $validated = $request->validate([
            'language' => 'required|in:en,ur,multi',
            'title' => 'required_if:language,en,required_if:language,multi',
            'summary' => 'required_if:language,en,required_if:language,multi',
            'content' => 'required_if:language,en,required_if:language,multi',
            'title_urdu' => 'required_if:language,ur,required_if:language,multi',
            'summary_urdu' => 'required_if:language,ur,required_if:language,multi',
            'content_urdu' => 'required_if:language,ur,required_if:language,multi',
            'category' => 'required',
            'region' => 'nullable',
            'country' => 'nullable',
            'type' => 'required',
            'tags' => 'nullable',
            'images' => 'nullable',
            'images.*' => 'image|max:4096',
            'author' => 'required',
            'slug' => 'nullable|string|unique:articles,slug,' . $article->id,
            'is_featured' => 'sometimes|boolean',
            'is_trending' => 'sometimes|boolean',
            'is_breaking' => 'sometimes|boolean',
            'is_top_story' => 'sometimes|boolean',
            'show_in_section' => 'sometimes|boolean',
            'section_priority' => 'nullable|integer',
        ]);

        $article->language = $validated['language'];
        $article->title = $validated['title'] ?? null;
        $article->summary = $validated['summary'] ?? null;
        $article->content = $validated['content'] ?? null;
        $article->title_urdu = $validated['title_urdu'] ?? null;
        $article->summary_urdu = $validated['summary_urdu'] ?? null;
        $article->content_urdu = $validated['content_urdu'] ?? null;
        $article->category = $validated['category'];
        $article->region = $validated['region'] ?? null;
        $article->country = $validated['country'] ?? null;
        $article->type = $validated['type'];
        $article->tags = $validated['tags'] ?? null;
        $article->author = $validated['author'];
        $article->is_featured = $request->boolean('is_featured');
        $article->is_trending = $request->boolean('is_trending');
        $article->is_breaking = $request->boolean('is_breaking');
        $article->is_top_story = $request->boolean('is_top_story');
        $article->show_in_section = $request->boolean('show_in_section');
        $article->section_priority = $validated['section_priority'] ?? null;
        // Handle slug update and uniqueness
        if (isset($validated['slug']) && !empty($validated['slug'])) {
            $slug = $validated['slug'];
        } else {
            $slug = \Str::slug($article->title ?? $article->title_urdu ?? uniqid());
        }
        // Ensure slug is unique (except for this article)
        $originalSlug = $slug;
        $counter = 1;
        while (\App\Models\Article::where('slug', $slug)->where('id', '!=', $article->id)->exists()) {
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
                'details' => 'Updated article: ' . ($article->title ?? $article->title_urdu),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        return redirect()->route('admin.articles')->with('success', 'Article updated successfully!');
    }

}
