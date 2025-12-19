<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ModeratorUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Don't create duplicate moderator
        $email = 'Younis@gmail.com';
        if (User::where('email', $email)->exists()) {
            $this->command->info('Moderator already exists: ' . $email);
            return;
        }

        User::create([
            'name' => 'Youins',
            'email' => $email,
            'password' => Hash::make('12121212'), // change in production
            'is_admin' => false,
            'role' => 'moderator',
            'email_verified_at' => now(),
        ]);

        $this->command->info('Moderator user created: ' . $email);
    }
}
