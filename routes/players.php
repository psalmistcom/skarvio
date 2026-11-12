<?php

use App\Http\Controllers\PlayerController;
use Illuminate\Support\Facades\Route;

// Required from the bottom of routes/web.php (already inside the "web" group).
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('players', PlayerController::class)->except('show');
});
