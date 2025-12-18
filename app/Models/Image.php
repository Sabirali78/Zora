<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Article;

class Image extends Model
{
    protected $fillable = ['path', 'original_name', 'mime_type'];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }
}
