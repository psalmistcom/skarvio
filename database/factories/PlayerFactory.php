<?php

namespace Database\Factories;

use App\Models\Player;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Player> */
class PlayerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->words(3, true),
            'youtube_id' => 'aqz-KE-bpKQ',
            'settings' => Player::settingsFrom([
                'end_message' => 'Ready to get started?',
                'cta_label' => 'Book a call',
                'cta_url' => 'https://example.com',
            ]),
        ];
    }
}
