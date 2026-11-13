export function parseYouTubeId(input) {
    const v = (input || "").trim();
    const m = v.match(
        /(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/,
    );
    if (m) return m[1];
    return /^[\w-]{11}$/.test(v) ? v : "";
}

export function toPlayerConfig(data) {
    return {
        id: parseYouTubeId(data.youtube_url),
        color: data.color,
        cover: data.cover_url || null,
        msg: data.end_message || null,
        cta: data.cta_label || null,
        url: data.cta_url || null,
    };
}
