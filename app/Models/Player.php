<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Player extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['user_id', 'title', 'youtube_id', 'settings'];

    protected function casts(): array
    {
        return ['settings' => 'array'];
    }

    protected static function booted(): void
    {
        static::creating(function (Player $player) {
            $player->public_id ??= Str::lower((string) Str::ulid());
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Normalise flat form input into the stored settings array. */
    public static function settingsFrom(array $data): array
    {
        return [
            'color' => $data['color'] ?? '#e11d48',
            'cover_url' => $data['cover_url'] ?? null,
            'end_message' => $data['end_message'] ?? null,
            'cta_label' => $data['cta_label'] ?? null,
            'cta_url' => $data['cta_url'] ?? null,
        ];
    }

    public function embedUrl(): string
    {
        return route('embed.show', ['player' => $this->public_id]);
    }

    public function snippet(): string
    {
        return sprintf(
            '<iframe src="%s" title="%s" style="width:100%%;aspect-ratio:16/9;border:0;border-radius:12px" allow="autoplay; encrypted-media; fullscreen" loading="lazy"></iframe>',
            e($this->embedUrl()),
            e($this->title),
        );
    }

    /** Config consumed by resources/js/player/runtime.js */
    public function embedConfig(): array
    {
        $s = array_merge(self::settingsFrom([]), $this->settings ?? []);

        return [
            'id' => $this->youtube_id,
            'pid' => $this->public_id,
            'color' => $s['color'],
            'cover' => $s['cover_url'],
            'msg' => $s['end_message'],
            'cta' => $s['cta_label'],
            'url' => $s['cta_url'],
        ];
    }
}
