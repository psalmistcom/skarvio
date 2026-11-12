<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlayerRequest;
use App\Models\Player;
use App\Support\YouTube;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PlayerController extends Controller
{
    public function index(Request $request): Response
    {
        $players = Player::where('user_id', $request->user()->id)
            ->latest('updated_at')
            ->get()
            ->map(fn (Player $p) => [
                'id' => $p->id,
                'title' => $p->title,
                'youtube_id' => $p->youtube_id,
                'embed_url' => $p->embedUrl(),
                'updated_at' => $p->updated_at->diffForHumans(),
            ]);

        return Inertia::render('players/index', ['players' => $players]);
    }

    public function create(): Response
    {
        return Inertia::render('players/create', [
            'defaults' => array_map(fn ($v) => $v ?? '', Player::settingsFrom([])),
        ]);
    }

    public function store(PlayerRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $player = Player::create([
            'user_id' => $request->user()->id,
            'title' => $data['title'],
            'youtube_id' => YouTube::parseId($data['youtube_url']),
            'settings' => Player::settingsFrom($data),
        ]);

        return redirect()->route('players.edit', $player);
    }

    public function edit(Player $player): Response
    {
        Gate::authorize('manage', $player);

        $settings = array_map(
            fn ($v) => $v ?? '',
            array_merge(Player::settingsFrom([]), $player->settings ?? []),
        );

        return Inertia::render('players/edit', [
            'player' => [
                'id' => $player->id,
                'title' => $player->title,
                'youtube_id' => $player->youtube_id,
                'youtube_url' => 'https://www.youtube.com/watch?v='.$player->youtube_id,
                'public_id' => $player->public_id,
                'embed_url' => $player->embedUrl(),
                'snippet' => $player->snippet(),
                ...$settings,
            ],
        ]);
    }

    public function update(PlayerRequest $request, Player $player): RedirectResponse
    {
        $data = $request->validated();

        $player->update([
            'title' => $data['title'],
            'youtube_id' => YouTube::parseId($data['youtube_url']),
            'settings' => Player::settingsFrom($data),
        ]);

        return back();
    }

    public function destroy(Player $player): RedirectResponse
    {
        Gate::authorize('manage', $player);

        $player->delete();

        return redirect()->route('players.index');
    }
}
