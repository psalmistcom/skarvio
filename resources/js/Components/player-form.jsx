const input =
    "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900";

function Field({ label, error, children }) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-semibold">{label}</span>
            {children}
            {error && (
                <span className="mt-1 block text-xs text-red-600">{error}</span>
            )}
        </label>
    );
}

export default function PlayerForm({ data, errors, setData }) {
    const text = (key, label, placeholder = "") => (
        <Field label={label} error={errors[key]}>
            <input
                className={input}
                value={data[key]}
                placeholder={placeholder}
                onChange={(e) => setData(key, e.target.value)}
            />
        </Field>
    );

    return (
        <div className="space-y-4">
            {text("title", "Name (just for you)")}
            {text(
                "youtube_url",
                "YouTube link",
                "https://youtube.com/watch?v=...",
            )}
            <Field label="Brand color" error={errors.color}>
                <input
                    type="color"
                    className="h-10 w-full rounded-lg border border-neutral-300 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900"
                    value={data.color}
                    onChange={(e) => setData("color", e.target.value)}
                />
            </Field>
            {text("cover_url", "Cover image URL (https, optional)")}
            {text("end_message", "Closing message")}
            {text("cta_label", "Button label")}
            {text("cta_url", "Button link", "https://")}
        </div>
    );
}
