<?php

namespace Tests\Unit;

use App\Support\YouTube;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class YouTubeTest extends TestCase
{
    public static function links(): array
    {
        return [
            'watch' => ['https://www.youtube.com/watch?v=aqz-KE-bpKQ', 'aqz-KE-bpKQ'],
            'watch with extras' => ['https://youtube.com/watch?feature=share&v=aqz-KE-bpKQ&t=10', 'aqz-KE-bpKQ'],
            'short link' => ['https://youtu.be/aqz-KE-bpKQ?si=abc', 'aqz-KE-bpKQ'],
            'shorts' => ['https://www.youtube.com/shorts/aqz-KE-bpKQ', 'aqz-KE-bpKQ'],
            'embed' => ['https://www.youtube.com/embed/aqz-KE-bpKQ', 'aqz-KE-bpKQ'],
            'live' => ['https://www.youtube.com/live/aqz-KE-bpKQ', 'aqz-KE-bpKQ'],
            'bare id' => ['aqz-KE-bpKQ', 'aqz-KE-bpKQ'],
            'garbage' => ['not a link', null],
            'too short' => ['https://youtu.be/abc', null],
        ];
    }

    #[DataProvider('links')]
    public function test_it_parses_ids(string $input, ?string $expected): void
    {
        $this->assertSame($expected, YouTube::parseId($input));
    }
}
