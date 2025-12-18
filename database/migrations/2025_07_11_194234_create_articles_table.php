<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArticlesTable extends Migration
{
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();

            // English content (nullable by default)
            $table->string('title')->nullable();
            $table->text('summary')->nullable();
            $table->text('content')->nullable();

            // Urdu content (nullable by default)
            $table->string('title_urdu')->nullable();
            $table->text('summary_urdu')->nullable();
            $table->text('content_urdu')->nullable();

            // Language indicator - updated to support multi-language
            $table->enum('language', ['en', 'ur', 'multi'])->default('en');

            // Common fields
            $table->string('category');
            $table->string('region')->nullable();
            $table->string('slug')->nullable();
            $table->string('country')->nullable();
            $table->string('type')->default('news');

            $table->text('tags')->nullable(); // Comma-separated string

            // Image fields (flattened)
            $table->string('image_url')->nullable();
            $table->string('image_public_id')->nullable();

            $table->string('author')->default('Admin');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_trending')->default(false);

            $table->timestamps(); // Adds created_at & updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('articles');
    }
}
