import { Link, router } from "@inertiajs/react";

import PlayersLayout from "@/layouts/players-layout";

export default function Index({ players }) {
    return (
        <PlayersLayout title="Players">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Your players</h1>
                <Link
                    href="/players/create"
                    className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
                >
                    New player
                </Link>
            </div>

            {players.length === 0 ? (
                <p className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500 dark:border-neutral-700">
                    No players yet. Paste a YouTube link to make your first one.
                </p>
            ) : (
                <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
                    {players.map((p) => (
                        <li
                            key={p.id}
                            className="flex items-center justify-between gap-4 px-4 py-3"
                        >
                            <div className="min-w-0">
                                <Link
                                    href={`/players/${p.id}/edit`}
                                    className="font-medium hover:underline"
                                >
                                    {p.title}
                                </Link>
                                <p className="truncate text-xs text-neutral-500">
                                    {p.youtube_id} · updated {p.updated_at}
                                </p>
                            </div>
                            <div className="flex gap-3 text-sm">
                                <Link href={`/players/${p.id}/edit`}>Edit</Link>
                                <button
                                    type="button"
                                    className="text-red-600"
                                    onClick={() => {
                                        if (
                                            confirm(
                                                `Delete "${p.title}"? Embeds using it will stop working.`,
                                            )
                                        ) {
                                            router.delete(`/players/${p.id}`);
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </PlayersLayout>
    );
}
