<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Trash extends Model
{
    protected $fillable = [
        'article_data',
        'deleted_by',
        'deleted_at'
    ];

    protected $casts = [
        'article_data' => 'json',
        'deleted_at' => 'datetime'
    ];

    public function deletedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}