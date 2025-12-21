<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrafficLog extends Model
{
    protected $fillable = [
        'article_id',
        'user_id',
        'ip',
        'user_agent',
        'referer'
    ];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
