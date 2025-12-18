<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Article;
use App\Models\ModeratorLog;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\Image;

class ModeratorController extends Controller
{
    /** Show a basic moderator dashboard */
    public function dashboard(Request $request)
    {
        $moderatorName = null;
        $totalArticles = 0;
        $englishArticles = 0;
        $urduArticles = 0;
        $multiLangArticles = 0;

        if (Auth::check()) {
            $moderator = Auth::user();
            $moderatorName = $moderator->name;

            $totalArticles = Article::where('author', $moderatorName)->count();
            $englishArticles = Article::where('author', $moderatorName)->where('language', 'en')->count();
            $urduArticles = Article::where('author', $moderatorName)->where('language', 'ur')->count();
            $multiLangArticles = Article::where('author', $moderatorName)->where('language', 'multi')->count();
        }

        return Inertia::render('Moderator/Dashboard', [
            'moderatorName' => $moderatorName,
            'moderator' => $moderator ? [
                'id' => $moderator->id,
                'name' => $moderator->name,
                'email' => $moderator->email,
                'email_verified_at' => $moderator->email_verified_at,
            ] : null,
            'totalArticles' => $totalArticles,
            'englishArticles' => $englishArticles,
            'urduArticles' => $urduArticles,
            'multiLangArticles' => $multiLangArticles,
        ]);
    }

    /** List moderator's articles */
    public function articles(Request $request)
    {
        $moderator = Auth::user();
        $query = Article::where('author', $moderator->name)->orderByDesc('created_at');
        $articles = $query->get();

        return Inertia::render('Moderator/Articles', [
            'articles' => $articles,
            'moderatorName' => $moderator->name,
            'moderator' => [
                'id' => $moderator->id,
                'name' => $moderator->name,
                'email' => $moderator->email,
                'email_verified_at' => $moderator->email_verified_at,
            ],
        ]);
    }

    /** Show create article form for moderators */
    public function createArticle(Request $request)
    {
        $moderatorName = null;
        if (Auth::check()) {
            $moderatorName = Auth::user()->name;
        }
        // If not verified, don't allow creating articles
        $moderator = Auth::user();
        $isVerified = $moderator && $moderator->email_verified_at !== null;
        if (!$isVerified) {
            // Redirect to dashboard with message
            return redirect()->route('moderator.dashboard')->with('error', 'You must verify your email before creating articles.');
        }
        return Inertia::render('Moderator/CreateArticle', [
            'moderatorName' => $moderatorName,
            'moderator' => [
                'id' => $moderator->id,
                'name' => $moderator->name,
                'email' => $moderator->email,
                'email_verified_at' => $moderator->email_verified_at,
            ],
        ]);
    }

    /** Store article created by moderator */
    public function storeArticle(Request $request)
    {
        $moderator = Auth::user();
        if (!$moderator || !$moderator->email_verified_at) {
            return redirect()->route('moderator.dashboard')->with('error', 'You must verify your email before creating articles.');
        }

        $validated = $request->validate([
            'language' => 'required|in:en,ur,multi',
            'title' => 'required_if:language,en,required_if:language,multi',
            'summary' => 'required_if:language,en,required_if:language,multi',
            'content' => 'required_if:language,en,required_if:language,multi',
            'title_urdu' => 'required_if:language,ur,required_if:language,multi',
            'summary_urdu' => 'required_if:language,ur,required_if:language,multi',
            'content_urdu' => 'required_if:language,ur,required_if:language,multi',
            'category' => 'required',
            'type' => 'required',
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
            'type' => $validated['type'],
            'author' => $moderator->name,
        ]);

        $article->slug = $request->input('slug') ?? \Str::slug($article->title ?? $article->title_urdu ?? uniqid());
        // Ensure unique slug
        $originalSlug = $article->slug;
        $counter = 1;
        while (Article::where('slug', $article->slug)->exists()) {
            $article->slug = $originalSlug . '-' . $counter++;
        }

        $article->save();

        // Log moderator action
        $counts = ['created_articles_en' => 0, 'created_articles_ur' => 0, 'created_articles_multi' => 0];
        if ($article->language === 'en') $counts['created_articles_en'] = 1;
        if ($article->language === 'ur') $counts['created_articles_ur'] = 1;
        if ($article->language === 'multi') $counts['created_articles_multi'] = 1;

        ModeratorLog::create(array_merge([
            'moderator_id' => $moderator->id,
            'action' => 'create',
            'model_type' => 'Article',
            'model_id' => $article->id,
            'details' => 'Moderator created an article',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ], $counts));

        return redirect()->route('moderator.articles')->with('success', 'Article created');
    }

    /** Show edit form for a moderator's article (only author may edit) */
    public function editArticle(Request $request, $id)
    {
        $article = Article::with('images')->findOrFail($id);
        $moderator = Auth::user();
        // prevent unverified moderators
        if (!$moderator || !$moderator->email_verified_at) {
            abort(403);
        }
        if (!$moderator || $article->author !== $moderator->name) {
            abort(403);
        }
        return Inertia::render('Moderator/EditArticle', [
            'article' => $article,
            'moderatorName' => $moderator->name,
            'moderator' => [
                'id' => $moderator->id,
                'name' => $moderator->name,
                'email' => $moderator->email,
                'email_verified_at' => $moderator->email_verified_at,
            ],
        ]);
    }

    /** Update moderator article (only author) */
    public function updateArticle(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        $moderator = Auth::user();
        if (!$moderator || !$moderator->email_verified_at) {
            abort(403);
        }
        if (!$moderator || $article->author !== $moderator->name) {
            abort(403);
        }

        $validated = $request->validate([
            'language' => 'required|in:en,ur,multi',
            'title' => 'required_if:language,en,required_if:language,multi',
            'summary' => 'required_if:language,en,required_if:language,multi',
            'content' => 'required_if:language,en,required_if:language,multi',
            'title_urdu' => 'required_if:language,ur,required_if:language,multi',
            'summary_urdu' => 'required_if:language,ur,required_if:language,multi',
            'content_urdu' => 'required_if:language,ur,required_if:language,multi',
            'category' => 'required',
            'type' => 'required',
            'slug' => 'nullable|string',
        ]);

        $article->language = $validated['language'];
        $article->title = $validated['title'] ?? null;
        $article->summary = $validated['summary'] ?? null;
        $article->content = $validated['content'] ?? null;
        $article->title_urdu = $validated['title_urdu'] ?? null;
        $article->summary_urdu = $validated['summary_urdu'] ?? null;
        $article->content_urdu = $validated['content_urdu'] ?? null;
        $article->category = $validated['category'];
        $article->type = $validated['type'];
        $article->tags = $request->input('tags');
        $article->region = $request->input('region');
        $article->country = $request->input('country');

        $article->is_featured = $request->boolean('is_featured');
        $article->is_trending = $request->boolean('is_trending');
        $article->is_breaking = $request->boolean('is_breaking');
        $article->is_top_story = $request->boolean('is_top_story');
        $article->show_in_section = $request->boolean('show_in_section');
        $article->section_priority = $request->input('section_priority');

        // handle slug
        if ($request->filled('slug')) {
            $slug = $request->input('slug');
        } else {
            $slug = \Str::slug($article->title ?? $article->title_urdu ?? uniqid());
        }
        $originalSlug = $slug;
        $counter = 1;
        while (Article::where('slug', $slug)->where('id', '!=', $article->id)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }
        $article->slug = $slug;

        $article->save();

        // handle uploaded images
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

        // Log moderator update
        ModeratorLog::create([
            'moderator_id' => $moderator->id,
            'action' => 'update',
            'model_type' => 'Article',
            'model_id' => $article->id,
            'details' => 'Moderator updated an article',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->route('moderator.articles')->with('success', 'Article updated');
    }

    /** Remove an image from moderator's article */
    public function removeImage(Request $request, $id, $imageId)
    {
        $article = Article::findOrFail($id);
        $moderator = Auth::user();
        if (!$moderator || !$moderator->email_verified_at) {
            abort(403);
        }
        if (!$moderator || $article->author !== $moderator->name) {
            abort(403);
        }

        $image = Image::findOrFail($imageId);
        if ($image->article_id !== $article->id) {
            abort(404);
        }

        // delete file from storage
        if ($image->path && Storage::disk('public')->exists($image->path)) {
            Storage::disk('public')->delete($image->path);
        }
        $image->delete();

        return redirect()->back()->with('success', 'Image removed');
    }

    /** Show moderator's own logs page (create/update/delete only) */
    public function logs(Request $request)
    {
        $moderator = Auth::user();
        if (!$moderator) {
            // Redirect to unified admin login page
            return redirect(route('admin.login'));
        }
        $query = ModeratorLog::where('moderator_id', $moderator->id)
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

        return Inertia::render('Moderator/Logs', [
            'logs' => $logsWithArticle,
            'pagination' => $pagination,
            'moderator' => [
                'id' => $moderator->id,
                'name' => $moderator->name,
                'email' => $moderator->email,
                'email_verified_at' => $moderator->email_verified_at,
            ],
        ]);
    }
}
