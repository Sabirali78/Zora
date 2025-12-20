<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleImage;
use App\Models\ModeratorLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ModeratorController extends Controller
{
    // ... existing create and store methods ...
    
    public function editArticle(Article $article)
    {
        $moderator = Auth::guard('moderator')->user();
        
        // Load article with images
        $article->load('images');
        
        return inertia('Moderator/EditArticle', [
            'moderator' => $moderator,
            'article' => $article
        ]);
    }

    public function updateArticle(Request $request, Article $article)
    {
        $moderator = Auth::guard('moderator')->user();
        
        // Validate request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'summary' => 'required|string',
            'content' => 'required|string',
            'category' => 'required|in:News,Opinion,Analysis,Mystery / Fiction,Stories / Creative,Miscellaneous',
            'tags' => 'nullable|string',
            'slug' => 'nullable|string|unique:articles,slug,' . $article->id,
            'image_url' => 'nullable|url',
            'image_public_id' => 'nullable|string',
            'is_featured' => 'boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'main_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'original_author' => 'required|string', // Preserve original author
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'integer|exists:article_images,id',
        ]);

        // Generate slug if empty
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(6);
        }

        // Ensure slug is unique (excluding current article)
        $validated['slug'] = $this->makeUniqueSlug($validated['slug'], $article->id);

        // Keep original author (important for moderators editing others' articles)
        $validated['author'] = $request->input('original_author');

        // Store changes for logging
        $originalData = $article->toArray();
        $changes = [];

        // Track changes
        foreach ($validated as $key => $value) {
            if (isset($article->$key) && $article->$key != $value) {
                $changes[$key] = [
                    'from' => $article->$key,
                    'to' => $value
                ];
            }
        }

        // Update article
        $article->update($validated);

        // Handle main image upload if provided
        if ($request->hasFile('main_image')) {
            $this->handleMainImageUpload($request->file('main_image'), $article);
            $changes['main_image'] = ['from' => 'old image', 'to' => 'new image uploaded'];
        }

        // Handle additional images
        if ($request->hasFile('images')) {
            $this->handleAdditionalImages($request->file('images'), $article);
            $count = count($request->file('images'));
            $changes['additional_images'] = ['added' => $count . ' new images'];
        }

        // Remove images not in existing_images array
        if ($request->has('existing_images')) {
            $existingImageIds = $request->input('existing_images', []);
            $deletedImages = ArticleImage::where('article_id', $article->id)
                ->whereNotIn('id', $existingImageIds)
                ->get();
            
            foreach ($deletedImages as $image) {
                // Delete from storage
                if (Storage::exists('public/' . $image->path)) {
                    Storage::delete('public/' . $image->path);
                }
                $image->delete();
            }
            
            if ($deletedImages->count() > 0) {
                $changes['removed_images'] = ['removed' => $deletedImages->count() . ' images'];
            }
        }

        // Log the edit action with detailed changes
        $this->logModeratorAction($moderator, 'update', $article, $changes);

        return redirect()->route('moderator.articles.index')
            ->with('success', 'Article updated successfully!');
    }

    public function removeImage(Article $article, ArticleImage $image)
    {
        $moderator = Auth::guard('moderator')->user();
        
        // Verify the image belongs to the article
        if ($image->article_id !== $article->id) {
            abort(403, 'Unauthorized action.');
        }

        // Delete from storage
        if (Storage::exists('public/' . $image->path)) {
            Storage::delete('public/' . $image->path);
        }

        // Delete from database
        $image->delete();

        // Log the action
        $this->logModeratorAction($moderator, 'delete_image', $article, [
            'image_id' => $image->id,
            'image_path' => $image->path
        ]);

        return back()->with('success', 'Image removed successfully.');
    }

    private function makeUniqueSlug($slug, $excludeId = null)
    {
        $originalSlug = $slug;
        $counter = 1;

        while (Article::where('slug', $slug)
            ->when($excludeId, function ($query) use ($excludeId) {
                return $query->where('id', '!=', $excludeId);
            })
            ->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function logModeratorAction($moderator, $action, $model = null, $details = [])
    {
        $logData = [
            'moderator_id' => $moderator->id,
            'action' => $action,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ];

        if ($model) {
            $logData['model_type'] = get_class($model);
            $logData['model_id'] = $model->id;
            
            // Prepare detailed information
            $logDetails = [
                'model' => class_basename($model),
                'title' => $model->title ?? null,
                'id' => $model->id,
            ];
            
            // Add additional details if provided
            if (!empty($details)) {
                $logDetails['changes'] = $details;
            }
            
            $logData['details'] = json_encode($logDetails, JSON_PRETTY_PRINT);
        }

        // Only increment creation counters for 'create' action
        if ($action === 'create') {
            $logData['created_articles_en'] = 1; // Single language - English
        }
        // For update actions, we could add updated_articles counter if needed
        // else if ($action === 'update') {
        //     $logData['updated_articles'] = 1;
        // }

        ModeratorLog::create($logData);
    }

    // Add method to show article (read-only for moderators)
    public function showArticle(Article $article)
    {
        $moderator = Auth::guard('moderator')->user();
        $article->load('images');
        
        return inertia('Moderator/ShowArticle', [
            'moderator' => $moderator,
            'article' => $article,
            'canEdit' => $article->author === $moderator->name
        ]);
    }

    // Add method to delete article (with confirmation and logging)
    public function destroyArticle(Article $article)
    {
        $moderator = Auth::guard('moderator')->user();
        
        // Check if moderator is the author
        if ($article->author !== $moderator->name) {
            return back()->with('error', 'You can only delete your own articles.');
        }

        // Store article info for logging before deletion
        $articleInfo = [
            'title' => $article->title,
            'id' => $article->id,
            'author' => $article->author
        ];

        // Delete associated images from storage
        $images = ArticleImage::where('article_id', $article->id)->get();
        foreach ($images as $image) {
            if (Storage::exists('public/' . $image->path)) {
                Storage::delete('public/' . $image->path);
            }
        }

        // Delete the article
        $article->delete();

        // Log the deletion action
        $this->logModeratorAction($moderator, 'delete', null, [
            'deleted_article' => $articleInfo,
            'deleted_at' => now()->toDateTimeString()
        ]);

        return redirect()->route('moderator.articles.index')
            ->with('success', 'Article deleted successfully.');
    }
}