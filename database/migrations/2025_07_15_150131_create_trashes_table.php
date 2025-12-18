<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('trashes', function (Blueprint $table) {
            $table->id();
            $table->json('article_data'); // Store all article data as JSON
            $table->foreignId('deleted_by')->constrained('users'); // Admin who deleted it
            $table->timestamp('deleted_at');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('trashes');
    }
};