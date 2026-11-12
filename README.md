# Skarvio starter: steps 1 to 3

Customizable YouTube player SaaS. This overlay adds players CRUD with live
preview, the public iframe embed, and the shared player runtime.
Analytics, billing and plan limits come next.

## 1. Create the project

```bash
laravel new skarvio      # pick the React starter kit (Inertia + React + Tailwind)
cd skarvio
```

## 2. Copy this zip over the project root

Unzip so `app/`, `routes/`, `resources/`, `database/` and `tests/` merge into
the project. The zip only adds new files; it never overwrites starter-kit files.

## 3. Make three small edits

**a) `routes/web.php`: add at the bottom**

```php
require __DIR__.'/players.php';
```

**b) `bootstrap/app.php`: register the cookie-less embed routes**

```php
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

// inside ->withRouting(...) add a `then:` argument:
    then: function () {
        Route::middleware([SubstituteBindings::class])
            ->group(base_path('routes/embed.php'));
    },
```

**c) `vite.config.ts`: add the embed bundle as an input**

```ts
laravel({
    input: ['resources/css/app.css', 'resources/js/app.tsx', 'resources/js/embed/embed.js'],
    // ...keep the rest of your options
}),
```

## 4. Run it

```bash
php artisan migrate
npm run dev            # or: npm run build
php artisan serve
php artisan test --filter=Player
```

Set `APP_URL` correctly in `.env`: it is baked into the embed snippet.

Then open `/players`, create a player, copy the snippet into any HTML page.

## Notes

- Pages live in `resources/js/pages/players/` (lowercase, as the current starter
  kit expects). If your starter uses `Pages/`, move the folder.
- Pages use plain URLs and their own small layout (`layouts/players-layout.tsx`),
  so they don't depend on starter-kit internals. Swap in `AppLayout` if you like.
- The embed page is cached for 60 seconds (`Cache-Control`), so edits take up to
  a minute to show on embedded sites.
- Embed routes deliberately skip sessions, cookies and CSRF. Don't add
  `web` middleware to them.
- `runtime.js` already emits `impression`, `play`, `p25`, `p50`, `p75`,
  `complete` and `cta_click`. Hook `onEvent` in `resources/js/embed/embed.js`
  to a beacon endpoint when you build step 4.
- Hiding YouTube's branding behind custom controls may conflict with YouTube's
  terms. Get a proper read before charging money.
