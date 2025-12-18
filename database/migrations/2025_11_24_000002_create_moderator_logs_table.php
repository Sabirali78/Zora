<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('moderator_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('moderator_id');
            $table->string('action', 255);
            $table->string('model_type', 255)->nullable();
            $table->unsignedBigInteger('model_id')->nullable();
            $table->text('details')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 255)->nullable();

            // Counts of articles created by this moderator in this event/context
            $table->unsignedInteger('created_articles_en')->default(0);
            $table->unsignedInteger('created_articles_ur')->default(0);
            $table->unsignedInteger('created_articles_multi')->default(0);

            $table->timestamps();

            // indexes
            $table->index('moderator_id');
            $table->index('model_type');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('moderator_logs');
    }
};
