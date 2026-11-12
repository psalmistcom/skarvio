<?php

namespace App\Support;

class YouTube
{
    /**
     * Extract the 11-character video id from a watch, youtu.be, shorts,
     * embed or live URL. A bare id is accepted too. Returns null otherwise.
     */
    public static function parseId(string $input): ?string
    {
        $input = trim($input);

        if (preg_match('~(?:youtu\.be/|[?&]v=|/embed/|/shorts/|/live/)([\w-]{11})~', $input, $m)) {
            return $m[1];
        }

        return preg_match('/^[\w-]{11}$/', $input) ? $input : null;
    }
}
