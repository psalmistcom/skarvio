import { useForm } from "@inertiajs/react";

import PlayerForm from "@/components/player-form";
import PlayerPreview from "@/components/player-preview";
import PlayersLayout from "@/layouts/players-layout";
import { toPlayerConfig } from "@/lib/player";

export default function Create({ defaults }) {
    const form = useForm({ title: "", youtube_url: "", ...defaults });

    return (
        <PlayersLayout title="New player">
            <h1 className="mb-6 text-2xl font-semibold">New player</h1>
            <div className="grid gap-8 md:grid-cols-[320px_1fr]">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post("/players");
                    }}
                >
                    <PlayerForm
                        data={form.data}
                        errors={form.errors}
                        setData={form.setData}
                    />
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="mt-6 rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                    >
                        Create player
                    </button>
                </form>
                <PlayerPreview cfg={toPlayerConfig(form.data)} />
            </div>
        </PlayersLayout>
    );
}
