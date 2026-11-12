<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Public, cookie-less endpoints that power the iframe snippet.
 * Registered in routes/embed.php WITHOUT the web middleware group.
 */
class EmbedController extends Controller
{
    public function show(Player $player): Response
    {
        return response()
            ->view('embed.player', [
                'title' => $player->title,
                'config' => $player->embedConfig(),
            ])
            ->header('Content-Security-Policy', 'frame-ancestors *')
            ->header('Cache-Control', 'public, max-age=60')
            ->header('X-Robots-Tag', 'noindex');
    }

    public function config(Player $player): JsonResponse
    {
        return response()
            ->json($player->embedConfig())
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Cache-Control', 'public, max-age=60');
    }
}
