// Framework-free player runtime. Used by the dashboard preview (React)
// and by the public iframe page (resources/js/embed/embed.js).

const CSS = [
    ".vsp{--a:#e11d48;position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:12px;overflow:hidden;font:16px system-ui,sans-serif;color:#fff}",
    ".vsp.fill{aspect-ratio:auto;height:100%;border-radius:0}",
    ".vsp *{box-sizing:border-box}",
    ".vsp [hidden]{display:none!important}",
    ".vsp iframe{position:absolute;inset:0;width:100%;height:100%;border:0}",
    ".vsp .hit{position:absolute;inset:0;width:100%;height:100%;border:0;background:none;cursor:pointer;z-index:1}",
    ".vsp .scrim{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;cursor:pointer}",
    ".vsp .big{width:72px;height:72px;border-radius:50%;border:0;background:var(--a);color:#fff;font-size:26px;cursor:pointer;padding-left:5px;box-shadow:0 6px 24px rgba(0,0,0,.4)}",
    ".vsp .bar{position:absolute;left:0;right:0;bottom:0;z-index:3;display:flex;align-items:center;gap:10px;padding:0 12px;height:max(46px,9%);background:#000}",
    ".vsp .bar button{background:none;border:0;color:#fff;font-size:16px;cursor:pointer;min-width:28px}",
    ".vsp .trk{flex:1;height:6px;border-radius:3px;background:rgba(255,255,255,.3);cursor:pointer;overflow:hidden}",
    ".vsp .trk i{display:block;height:100%;width:0;background:var(--a)}",
    ".vsp .tm{font-size:12px;font-variant-numeric:tabular-nums;min-width:38px}",
    ".vsp .end{position:absolute;inset:0;z-index:4;background:rgba(10,10,10,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:20px}",
    ".vsp .end p{margin:0;font-size:clamp(18px,3.4vw,28px);font-weight:700}",
    ".vsp .end a{background:var(--a);color:#fff;text-decoration:none;padding:11px 22px;border-radius:8px;font-weight:600}",
    ".vsp .again{background:none;border:0;color:#ddd;text-decoration:underline;cursor:pointer;font-size:14px}",
].join("");

const TEMPLATE =
    '<div class="scrim"><button class="big" type="button" aria-label="Play">\u25B6</button></div>' +
    '<div class="bar" hidden><button class="pp" type="button" aria-label="Play or pause">\u25B6</button>' +
    '<div class="trk"><i></i></div><span class="tm">0:00</span>' +
    '<button class="mu" type="button" aria-label="Mute">\uD83D\uDD0A</button></div>' +
    '<div class="end" hidden><p></p><a target="_blank" rel="noopener"></a>' +
    '<button class="again" type="button">Watch again</button></div>';

const fmt = (n) => {
    n = Math.floor(n || 0);
    return Math.floor(n / 60) + ":" + ("0" + (n % 60)).slice(-2);
};

/**
 * @param {HTMLElement} el
 * @param {{id:string,color?:string,cover?:string|null,msg?:string|null,cta?:string|null,url?:string|null}} c
 * @param {{fill?:boolean,onEvent?:(type:string)=>void}} [opts]
 */
export function mountPlayer(el, c, opts = {}) {
    const emit = (type) => {
        try {
            if (opts.onEvent) opts.onEvent(type);
        } catch (_) {
            /* analytics must never break playback */
        }
    };

    const style = document.createElement("style");
    style.textContent = CSS;
    const root = document.createElement("div");
    root.className = "vsp" + (opts.fill ? " fill" : "");
    root.style.setProperty("--a", c.color || "#e11d48");
    root.innerHTML = TEMPLATE;
    el.append(style, root);

    const q = (sel) => root.querySelector(sel);
    const scrim = q(".scrim");
    const bar = q(".bar");
    const end = q(".end");
    const pp = q(".pp");
    const fill = q(".trk i");
    const tm = q(".tm");
    const mu = q(".mu");
    const cta = q(".end a");

    let frame = null;
    let duration = 0;
    let playing = false;
    let started = false;
    let muted = false;
    let played = false;
    let last = -2;
    const fired = { p25: false, p50: false, p75: false };

    scrim.style.background =
        c.cover && /^https:\/\//.test(c.cover)
            ? 'center/cover url("' +
              c.cover.replace(/["'()\\\s]/g, encodeURIComponent) +
              '")'
            : "linear-gradient(135deg,#111,var(--a))";
    q(".end p").textContent = c.msg || "Thanks for watching";
    if (c.cta && /^https?:\/\//.test(c.url || "")) {
        cta.textContent = c.cta;
        cta.href = c.url;
    } else {
        cta.hidden = true;
    }
    cta.addEventListener("click", () => emit("cta_click"));

    const send = (fn, args = []) => {
        if (frame && frame.contentWindow) {
            frame.contentWindow.postMessage(
                JSON.stringify({ event: "command", func: fn, args }),
                "*",
            );
        }
    };

    function setState(v, silent) {
        if (v === last) return;
        last = v;
        playing = v === 1;
        pp.textContent = playing ? "\u275A\u275A" : "\u25B6";
        if (v === 1 || v === 3) {
            scrim.style.display = "none";
            end.hidden = true;
            if (v === 1 && !played) {
                played = true;
                if (!silent) emit("play");
            }
        } else if (v === 2) {
            scrim.style.display = "flex";
            scrim.style.background = "rgba(0,0,0,.85)";
        } else if (v === 0) {
            scrim.style.display = "none";
            end.hidden = false;
            if (!silent) emit("complete");
        }
    }

    const toggle = () => send(playing ? "pauseVideo" : "playVideo");

    function start() {
        if (started) {
            send("playVideo");
            return;
        }
        started = true;
        const origin = /^http/.test(location.origin)
            ? "&origin=" + encodeURIComponent(location.origin)
            : "";
        frame = document.createElement("iframe");
        frame.title = "Video player";
        frame.allow = "autoplay; encrypted-media; fullscreen";
        frame.src =
            "https://www.youtube-nocookie.com/embed/" +
            encodeURIComponent(c.id) +
            "?autoplay=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1" +
            origin;
        frame.addEventListener("load", () => {
            frame.contentWindow.postMessage(
                JSON.stringify({
                    event: "listening",
                    id: 1,
                    channel: "widget",
                }),
                "*",
            );
        });
        const hit = document.createElement("button");
        hit.className = "hit";
        hit.type = "button";
        hit.setAttribute("aria-label", "Play or pause");
        hit.addEventListener("click", toggle);
        root.prepend(frame, hit);
        bar.hidden = false;
        setState(3);
    }

    function onMessage(e) {
        if (!frame || e.source !== frame.contentWindow) return;
        let m;
        try {
            m = JSON.parse(e.data);
        } catch (_) {
            return;
        }
        if (m.event === "onStateChange") setState(m.info);
        if (m.event === "infoDelivery" && m.info) {
            const i = m.info;
            if (i.duration) duration = i.duration;
            if (i.currentTime != null && duration) {
                const pct = (i.currentTime / duration) * 100;
                fill.style.width = pct + "%";
                tm.textContent = fmt(i.currentTime);
                [
                    ["p25", 25],
                    ["p50", 50],
                    ["p75", 75],
                ].forEach(([k, t]) => {
                    if (!fired[k] && pct >= t) {
                        fired[k] = true;
                        emit(k);
                    }
                });
            }
            if (i.playerState != null) setState(i.playerState);
        }
    }

    scrim.addEventListener("click", start);
    pp.addEventListener("click", () => (started ? toggle() : start()));
    mu.addEventListener("click", () => {
        muted = !muted;
        send(muted ? "mute" : "unMute");
        mu.textContent = muted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
    });
    q(".trk").addEventListener("click", (e) => {
        if (!duration) return;
        const b = e.currentTarget.getBoundingClientRect();
        send("seekTo", [((e.clientX - b.left) / b.width) * duration, true]);
    });
    q(".again").addEventListener("click", () => {
        end.hidden = true;
        send("seekTo", [0, true]);
        send("playVideo");
    });
    window.addEventListener("message", onMessage);

    emit("impression");

    return {
        showEnd() {
            started = true;
            bar.hidden = false;
            last = -2;
            setState(0, true);
        },
        setColor(color) {
            root.style.setProperty("--a", color);
        },
        destroy() {
            window.removeEventListener("message", onMessage);
            style.remove();
            root.remove();
        },
    };
}
