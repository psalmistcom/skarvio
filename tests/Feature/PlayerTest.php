<?php

namespace Tests\Feature;

use App\Models\Player;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlayerTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Demo',
            'youtube_url' => 'https://youtu.be/aqz-KE-bpKQ',
            'color' => '#e11d48',
        ], $overrides);
    }

    public function test_guests_cannot_reach_the_dashboard_routes(): void
    {
        $this->get('/players')->assertRedirect('/login');
    }

    public function test_user_can_create_a_player(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/players', $this->payload())->assertRedirect();

        $this->assertDatabaseHas('players', [
            'user_id' => $user->id,
            'youtube_id' => 'aqz-KE-bpKQ',
        ]);
        $this->assertNotNull(Player::first()->public_id);
    }

    public function test_invalid_youtube_link_is_rejected(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/players', $this->payload(['youtube_url' => 'not a link']))
            ->assertSessionHasErrors('youtube_url');
    }

    public function test_cta_label_requires_a_link(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/players', $this->payload(['cta_label' => 'Book a call']))
            ->assertSessionHasErrors('cta_url');
    }

    public function test_user_cannot_edit_someone_elses_player(): void
    {
        $player = Player::factory()->create();

        $this->actingAs(User::factory()->create())->get("/players/{$player->id}/edit")->assertForbidden();
        $this->actingAs(User::factory()->create())->put("/players/{$player->id}", $this->payload())->assertForbidden();
        $this->actingAs(User::factory()->create())->delete("/players/{$player->id}")->assertForbidden();
    }

    public function test_owner_can_update_and_delete(): void
    {
        $player = Player::factory()->create();

        $this->actingAs($player->user)
            ->put("/players/{$player->id}", $this->payload(['title' => 'Renamed', 'color' => '#112233']))
            ->assertRedirect();

        $this->assertSame('Renamed', $player->fresh()->title);
        $this->assertSame('#112233', $player->fresh()->settings['color']);

        $this->actingAs($player->user)->delete("/players/{$player->id}")->assertRedirect('/players');
        $this->assertSoftDeleted('players', ['id' => $player->id]);
    }

    public function test_embed_is_public_and_frameable(): void
    {
        $this->withoutVite();
        $player = Player::factory()->create();

        $this->get("/e/{$player->public_id}")
            ->assertOk()
            ->assertSee('aqz-KE-bpKQ', false)
            ->assertHeader('Content-Security-Policy', 'frame-ancestors *');
    }

    public function test_embed_404s_for_unknown_or_deleted_players(): void
    {
        $this->withoutVite();
        $this->get('/e/does-not-exist')->assertNotFound();

        $player = Player::factory()->create();
        $player->delete();
        $this->get("/e/{$player->public_id}")->assertNotFound();
    }

    public function test_embed_config_json(): void
    {
        $player = Player::factory()->create();

        $this->getJson("/e/{$player->public_id}/config.json")
            ->assertOk()
            ->assertJson(['id' => 'aqz-KE-bpKQ', 'pid' => $player->public_id, 'cta' => 'Book a call']);
    }
}
