import { useEffect, useRef } from "react";

import { mountPlayer } from "@/player/runtime";

export default function PlayerPreview({ cfg }) {
    const host = useRef(null);
    const handle = useRef(null);

    // Remount only when something other than the color changes,
    // so dragging the color picker doesn't restart playback.
    useEffect(() => {
        if (!host.current || !cfg.id) return;
        const h = mountPlayer(host.current, cfg);
        handle.current = h;
        return () => {
            h.destroy();
            handle.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cfg.id, cfg.cover, cfg.msg, cfg.cta, cfg.url]);

    useEffect(() => {
        if (cfg.color) handle.current?.setColor(cfg.color);
    }, [cfg.color]);

    if (!cfg.id) {
        return (
            <div className="grid aspect-video place-items-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 dark:border-neutral-700">
                Paste a YouTube link to see your player
            </div>
        );
    }

    return (
        <div>
            <div ref={host} />
            <button
                type="button"
                onClick={() => handle.current?.showEnd()}
                className="mt-3 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700"
            >
                Preview end screen
            </button>
        </div>
    );
}
