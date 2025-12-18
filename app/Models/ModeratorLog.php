<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModeratorLog extends Model
{
    protected $fillable = [
        'moderator_id',
        'action',
        'model_type',
        'model_id',
        'details',
        'ip_address',
        'user_agent',
        'created_articles_en',
        'created_articles_ur',
        'created_articles_multi',
    ];
}
