import { Head, Link } from "@inertiajs/react";

export default function PlayersLayout({ title, children }) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
                <header className="border-b border-neutral-200 dark:border-neutral-800">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                        <Link href="/players" className="text-lg font-semibold">
                            Skarvio
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-sm text-neutral-500 hover:underline"
                        >
                            Dashboard
                        </Link>
                    </div>
                </header>
                <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
            </div>
        </>
    );
}
