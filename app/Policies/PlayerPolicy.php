<?php

namespace App\Policies;

use App\Models\Player;
use App\Models\User;

class PlayerPolicy
{
    public function manage(User $user, Player $player): bool
    {
        return $user->id === $player->user_id;
    }
}
