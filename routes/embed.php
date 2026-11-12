<?php

use App\Http\Controllers\EmbedController;
use Illuminate\Support\Facades\Route;

// Registered from bootstrap/app.php with SubstituteBindings only:
// no session, no cookies, no CSRF. Keep it that way.
Route::prefix('e/{player:public_id}')->name('embed.')->group(function () {
    Route::get('/', [EmbedController::class, 'show'])->name('show');
    Route::get('config.json', [EmbedController::class, 'config'])->name('config');
});
