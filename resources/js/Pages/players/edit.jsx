import { router, useForm } from "@inertiajs/react";
import { useState } from "react";

import PlayerForm from "@/components/player-form";
import PlayerPreview from "@/components/player-preview";
import PlayersLayout from "@/layouts/players-layout";
import { toPlayerConfig } from "@/lib/player";

function SnippetBox({ snippet }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(snippet);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* clipboard blocked: the text can still be selected manually */
        }
    };

    return (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="mb-2 text-sm font-semibold">Your embed snippet</h2>
            <textarea
                readOnly
                value={snippet}
                className="h-28 w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-950"
            />
            <button
                type="button"
                onClick={copy}
                className="mt-2 rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-neutral-900"
            >
                {copied ? "Copied" : "Copy snippet"}
            </button>
            <p className="mt-2 text-xs text-neutral-500">
                Changes can take up to a minute to appear on embedded pages.
            </p>
        </div>
    );
}

export default function Edit({ player }) {
    const form = useForm({
        title: player.title,
        youtube_url: player.youtube_url,
        color: player.color,
        cover_url: player.cover_url,
        end_message: player.end_message,
        cta_label: player.cta_label,
        cta_url: player.cta_url,
    });

    return (
        <PlayersLayout title={player.title}>
            <h1 className="mb-6 text-2xl font-semibold">{player.title}</h1>
            <div className="grid gap-8 md:grid-cols-[320px_1fr]">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.put(`/players/${player.id}`, {
                            preserveScroll: true,
                        });
                    }}
                >
                    <PlayerForm
                        data={form.data}
                        errors={form.errors}
                        setData={form.setData}
                    />
                    <div className="mt-6 flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                        >
                            Save changes
                        </button>
                        {form.recentlySuccessful && (
                            <span className="text-sm text-neutral-500">
                                Saved
                            </span>
                        )}
                    </div>
                </form>
                <div>
                    <PlayerPreview cfg={toPlayerConfig(form.data)} />
                    <SnippetBox snippet={player.snippet} />
                    <button
                        type="button"
                        className="mt-6 text-sm text-red-600"
                        onClick={() => {
                            if (
                                confirm(
                                    "Delete this player? Embeds using it will stop working.",
                                )
                            ) {
                                router.delete(`/players/${player.id}`);
                            }
                        }}
                    >
                        Delete player
                    </button>
                </div>
            </div>
        </PlayersLayout>
    );
}
