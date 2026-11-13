import { mountPlayer } from "../player/runtime";

// window.__CFG__ is printed by resources/views/embed/player.blade.php
const cfg = window.__CFG__;
const host = document.getElementById("p");

if (cfg && host) {
    mountPlayer(host, cfg, {
        fill: true,
        onEvent: () => {
            // Step 4 (analytics): navigator.sendBeacon('/e/' + cfg.pid + '/events', ...)
        },
    });
}
