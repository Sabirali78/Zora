<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Image;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'summary', 'content',
        'title_urdu', 'summary_urdu', 'content_urdu',
        'language', 'category', 'tags', 'author', 
        'is_featured', 'slug', 'image_url', 'image_public_id'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    protected $dates = ['deleted_at'];

    // Relationship: an article can have multiple images
    public function images(): HasMany
    {
        return $this->hasMany(Image::class);
    }

    // Get title based on language
    public function getTitle($language = null)
    {
        if ($language === 'ur' || $this->language === 'ur') {
            return $this->title_urdu ?: $this->title;
        }
        return $this->title;
    }

    // Get summary based on language
    public function getSummary($language = null)
    {
        if ($language === 'ur' || $this->language === 'ur') {
            return $this->summary_urdu ?: $this->summary;
        }
        return $this->summary;
    }

    // Get content based on language
    public function getContent($language = null)
    {
        if ($language === 'ur' || $this->language === 'ur') {
            return $this->content_urdu ?: $this->content;
        }
        return $this->content;
    }

    // Check if article has content in specific language
    public function hasLanguageContent($language)
    {
        if ($language === 'ur') {
            return !empty($this->title_urdu) && !empty($this->content_urdu);
        }
        return !empty($this->title) && !empty($this->content);
    }

    // Check if article is multi-language
    public function isMultiLanguage()
    {
        return $this->language === 'multi' && 
               $this->hasLanguageContent('en') && 
               $this->hasLanguageContent('ur');
    }
}
