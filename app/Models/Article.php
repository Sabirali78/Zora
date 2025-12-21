<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Image;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\TrafficLog;

class Article extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'summary',
        'content',
        'category',
        'tags',
        'author',
        'is_featured',
        'slug',
        'image_url',
        'image_public_id',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    protected $dates = ['deleted_at'];

    public function images(): HasMany
    {
        return $this->hasMany(Image::class);
    }

    public function trafficLogs()
{
    return $this->hasMany(TrafficLog::class);
}

    public function getRouteKeyName()
    {
        return 'slug';
    }
}
