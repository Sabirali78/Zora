<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add a role column. Use enum if supported, otherwise string.
            if (Schema::getConnection()->getDoctrineSchemaManager()->tablesExist(['users'])) {
                // Use enum via raw statement for portability
                $driver = Schema::getConnection()->getDriverName();
                if ($driver === 'mysql') {
                    DB::statement("ALTER TABLE `users` ADD `role` ENUM('admin','moderator') NOT NULL DEFAULT 'moderator' AFTER `is_admin`");
                } else {
                    $table->string('role')->default('moderator')->after('is_admin');
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
        });
    }
};
