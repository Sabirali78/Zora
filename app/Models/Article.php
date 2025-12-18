<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Image;
use Illuminate\Database\Eloquent\SoftDeletes; // Add this


class Article extends Model
{
    use SoftDeletes; // Add this trait

    protected $fillable = [
        'title', 'summary', 'content',
        'title_urdu', 'summary_urdu', 'content_urdu',
        'language', 'category', 'region', 'country', 'type',
        'tags', 'author', 'is_featured', 'is_trending', 'slug',
         'is_breaking',
    'is_top_story',
    'show_in_section',
    'section_priority'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_trending' => 'boolean',
        'is_breaking' => 'boolean',
        'is_top_story' => 'boolean',
    ];

        // Add this for soft deletes
    protected $dates = ['deleted_at'];
    
    public function images(): HasMany
    {
        return $this->hasMany(Image::class);
    }

    // Helper methods for multi-language content
    public function getTitle($language = null)
    {
        if ($language === 'ur' || $this->language === 'ur') {
            return $this->title_urdu ?: $this->title;
        }
        return $this->title;
    }

    public function getSummary($language = null)
    {
        if ($language === 'ur' || $this->language === 'ur') {
            return $this->summary_urdu ?: $this->summary;
        }
        return $this->summary;
    }

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
