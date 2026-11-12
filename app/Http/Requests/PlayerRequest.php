<?php

namespace App\Http\Requests;

use App\Support\YouTube;
use Illuminate\Foundation\Http\FormRequest;

class PlayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        $player = $this->route('player');

        return $player === null || $this->user()->can('manage', $player);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:120'],
            'youtube_url' => [
                'required',
                'string',
                'max:300',
                function (string $attribute, mixed $value, \Closure $fail) {
                    if (! YouTube::parseId((string) $value)) {
                        $fail("That doesn't look like a YouTube link.");
                    }
                },
            ],
            'color' => ['required', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'cover_url' => ['nullable', 'url:https', 'max:2048'],
            'end_message' => ['nullable', 'string', 'max:160'],
            'cta_label' => ['nullable', 'string', 'max:40', 'required_with:cta_url'],
            'cta_url' => ['nullable', 'url:http,https', 'max:2048', 'required_with:cta_label'],
        ];
    }
}
